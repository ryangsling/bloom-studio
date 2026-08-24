import { NextRequest, NextResponse } from "next/server";
import salon from "@/config/salon.json";
import type { Salon } from "@/types/salon";
import { buildSystemPrompt } from "@/lib/systemPrompt";
import { callOpenRouter, type ChatMessage } from "@/lib/openrouter";
import { checkRateLimit } from "@/lib/rateLimit";
import { sendBookingEmail } from "@/lib/email";
import { sendBookingTelegram } from "@/lib/telegram";
import { getOrCreateSessionId, withSessionCookie } from "@/lib/session";
import type { BookingDetails } from "@/lib/booking";

const FRIENDLY_UNAVAILABLE_MESSAGE =
  "We're getting lots of interest right now — please try again shortly.";
const INCOMPLETE_BOOKING_MESSAGE =
  "Sorry, I didn't catch all of your booking details — could you share your name, phone number, service, and preferred time again?";

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

function parseBookingArgs(args: Record<string, unknown>): BookingDetails | null {
  const { name, phone, service, preferred_time: preferredTime } = args;
  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof phone !== "string" ||
    !phone.trim() ||
    typeof service !== "string" ||
    !service.trim() ||
    typeof preferredTime !== "string" ||
    !preferredTime.trim()
  ) {
    return null;
  }
  return { name, phone, service, preferredTime };
}

export async function POST(request: NextRequest) {
  const { sessionId, isNew: isNewSession } = getOrCreateSessionId(request);

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
    const booking = parseBookingArgs(JSON.parse(toolCall.function.arguments));
    if (booking) {
      await Promise.allSettled([sendBookingEmail(booking), sendBookingTelegram(booking)]);
      payload = { content: result.content, toolCall: { name: "capture_booking", booking } };
    } else {
      console.error("capture_booking tool call had incomplete arguments — dropping it");
      payload = { content: result.content ?? INCOMPLETE_BOOKING_MESSAGE, toolCall: null };
    }
  } else if (toolCall?.function.name === "request_handoff") {
    const args = JSON.parse(toolCall.function.arguments);
    payload = {
      content: result.content,
      toolCall: { name: "request_handoff", reason: args.reason || "unspecified" },
    };
  }

  return withSessionCookie(NextResponse.json(payload), sessionId, isNewSession);
}
