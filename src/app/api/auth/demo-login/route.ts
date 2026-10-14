import { NextRequest } from "next/server";
import { nanoid } from "@/lib/id";
import { demoLoginSchema } from "@/server/validation/schemas";
import {
  authenticateDemoRole,
  isDemoQuickLoginEnabled,
} from "@/server/services/crm";
import { jsonError, jsonOk, ApiError } from "@/server/http/response";
import { rateLimit } from "@/server/auth/rate-limit";
import { clientIp } from "@/server/http/guard";
import {
  authCookieName,
  sessionCookieOptions,
  signSession,
} from "@/server/auth/session";
import { postAuthPath, ROLE_LABELS } from "@/lib/auth";

/** Whether the login UI should show one-click role buttons. */
export async function GET() {
  const requestId = nanoid(10);
  return jsonOk(
    {
      enabled: isDemoQuickLoginEnabled(),
      roles: [
        { role: "admin" as const, label: ROLE_LABELS.admin },
        { role: "agent" as const, label: ROLE_LABELS.agent },
        { role: "client" as const, label: ROLE_LABELS.client },
      ],
    },
    { requestId },
  );
}

/** One-click demo login: { role: "admin" | "agent" | "client" }. */
export async function POST(request: NextRequest) {
  const requestId = nanoid(10);
  try {
    if (!isDemoQuickLoginEnabled()) {
      throw new ApiError(
        403,
        "DEMO_LOGIN_DISABLED",
        "ورود سریع نمایشی غیرفعال است.",
      );
    }

    const ip = clientIp(request);
    const limited = rateLimit(`demo-login:${ip}`, 20, 60_000);
    if (!limited.ok) {
      throw new ApiError(429, "RATE_LIMITED", "تعداد تلاش‌ها بیش از حد مجاز است");
    }

    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      throw new ApiError(400, "INVALID_JSON", "بدنه درخواست نامعتبر است");
    }

    const body = demoLoginSchema.parse(raw);
    const session = await authenticateDemoRole(body.role);
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
