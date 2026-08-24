import type { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "bloom_session";

export function getOrCreateSessionId(request: NextRequest): { sessionId: string; isNew: boolean } {
  const existing = request.cookies.get(SESSION_COOKIE)?.value;
  return { sessionId: existing ?? crypto.randomUUID(), isNew: !existing };
}

export function withSessionCookie(
  res: NextResponse,
  sessionId: string,
  isNew: boolean,
): NextResponse {
  if (isNew) {
    res.cookies.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });
  }
  return res;
}
