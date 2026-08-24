import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { sendCallbackRequestEmail } from "@/lib/email";
import { sendCallbackRequestTelegram } from "@/lib/telegram";
import { getOrCreateSessionId, withSessionCookie } from "@/lib/session";

const FRIENDLY_UNAVAILABLE_MESSAGE =
  "We're getting lots of interest right now — please try again shortly.";

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
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";

  if (!name || !phone) {
    return withSessionCookie(
      NextResponse.json({ error: "invalid_request" }, { status: 400 }),
      sessionId,
      isNewSession,
    );
  }

  await Promise.allSettled([
    sendCallbackRequestEmail({ name, phone }),
    sendCallbackRequestTelegram({ name, phone }),
  ]);

  return withSessionCookie(NextResponse.json({ ok: true }), sessionId, isNewSession);
}
