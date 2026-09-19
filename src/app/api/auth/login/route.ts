import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { loginSchema } from "@/server/validation/schemas";
import { authenticate } from "@/server/services/crm";
import { jsonError, jsonOk, ApiError } from "@/server/http/response";
import { rateLimit } from "@/server/auth/rate-limit";
import { clientIp } from "@/server/http/guard";
import {
  authCookieName,
  sessionCookieOptions,
  signSession,
} from "@/server/auth/session";
import { postAuthPath } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const requestId = nanoid(10);
  try {
    const ip = clientIp(request);
    const limited = rateLimit(`login:${ip}`, 12, 60_000);
    if (!limited.ok) {
      throw new ApiError(429, "RATE_LIMITED", "تعداد تلاش‌ها بیش از حد مجاز است");
    }

    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      throw new ApiError(400, "INVALID_JSON", "بدنه درخواست نامعتبر است");
    }

    const body = loginSchema.parse(raw);
    const session = await authenticate(body);
    const token = await signSession(session);
    const redirectTo = postAuthPath(session);

    const response = jsonOk(
      {
        session,
        redirectTo,
      },
      { requestId },
    );
    response.cookies.set(authCookieName(), token, sessionCookieOptions());
    return response;
  } catch (error) {
    return jsonError(error, requestId);
  }
}
