import { NextRequest, NextResponse } from "next/server";
import salon from "@/config/salon.json";
import type { Salon } from "@/types/salon";
import { buildSystemPrompt } from "@/lib/systemPrompt";
import { callOpenRouter, type ChatMessage } from "@/lib/openrouter";
import { checkRateLimit } from "@/lib/rateLimit";
import { sendBookingEmail } from "@/lib/email";
import { sendBookingTelegram } from "@/lib/telegram";

const SESSION_COOKIE = "bloom_session";
const FRIENDLY_UNAVAILABLE_MESSAGE =
  "We're getting lots of interest right now — please try again shortly.";

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

function withSessionCookie(res: NextResponse, sessionId: string, isNew: boolean) {
  if (isNew) {
    res.cookies.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });
  }
  return res;
}

export async function POST(request: NextRequest) {
  const existingSessionId = request.cookies.get(SESSION_COOKIE)?.value;
  const sessionId = existingSessionId ?? crypto.randomUUID();
  const isNewSession = !existingSessionId;

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { limited } = checkRateLimit(`${sessionId}:${ip}`);

  if (limited) {
    return withSessionCookie(
      NextResponse.json(
        { error: "rate_limited", message: FRIENDLY_UNAVAILABLE_MESSAGE },
        { status: 429 },
      ),
      sessionId,
      isNewSession,
    );
  }

  const body = await request.json().catch(() => null);
  const messages: IncomingMessage[] = Array.isArray(body?.messages) ? body.messages : [];

  const chatMessages: ChatMessage[] = [
    { role: "system", content: buildSystemPrompt(salon as Salon) },
    ...messages.map((m): ChatMessage => ({ role: m.role, content: m.content })),
  ];

  let result;
  try {
    result = await callOpenRouter(chatMessages);
  } catch (err) {
    console.error("OpenRouter call failed", err);
    return withSessionCookie(
      NextResponse.json(
        { error: "upstream_unavailable", message: FRIENDLY_UNAVAILABLE_MESSAGE },
        { status: 503 },
      ),
      sessionId,
      isNewSession,
    );
  }

  const toolCall = result.toolCalls[0];
  let payload: {
    content: string | null;
    toolCall: null | { name: string; [key: string]: unknown };
  } = { content: result.content, toolCall: null };

  if (toolCall?.function.name === "capture_booking") {
    const args = JSON.parse(toolCall.function.arguments);
    const booking = {
      name: args.name,
      phone: args.phone,
      service: args.service,
      preferredTime: args.preferred_time,
    };
    await Promise.allSettled([sendBookingEmail(booking), sendBookingTelegram(booking)]);
    payload = { content: result.content, toolCall: { name: "capture_booking", booking } };
  } else if (toolCall?.function.name === "request_handoff") {
    const args = JSON.parse(toolCall.function.arguments);
    payload = {
      content: result.content,
      toolCall: { name: "request_handoff", reason: args.reason },
    };
  }

  return withSessionCookie(NextResponse.json(payload), sessionId, isNewSession);
}
