import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { otpRequestSchema } from "@/server/validation/schemas";
import { jsonError, jsonOk, ApiError } from "@/server/http/response";
import { rateLimit } from "@/server/auth/rate-limit";
import { clientIp } from "@/server/http/guard";
import { normalizePhone, isValidIranMobile } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const requestId = nanoid(10);
  try {
    const ip = clientIp(request);
    const limited = rateLimit(`otp:${ip}`, 8, 60_000);
    if (!limited.ok) {
      throw new ApiError(429, "RATE_LIMITED", "لطفاً کمی بعد دوباره تلاش کنید");
    }

    const body = otpRequestSchema.parse(await request.json());
    const phone = normalizePhone(body.phone);
    if (!isValidIranMobile(phone)) {
      throw new ApiError(400, "INVALID_PHONE", "شماره موبایل نامعتبر است");
    }

    // Production: integrate SMS provider here.
    // Demo mode returns masked confirmation only — never invent a default OTP.
    const demoOtp = process.env.DEMO_OTP?.trim();
    return jsonOk(
      {
        sent: true,
        phone: phone.replace(/(\d{4})\d{3}(\d{4})/, "$1***$2"),
        expiresInSec: 120,
        demoHint:
          process.env.NODE_ENV === "production" || !demoOtp ? undefined : "کد تأیید دمو از DEMO_OTP خوانده می‌شود",
      },
      { requestId },
    );
  } catch (error) {
    return jsonError(error, requestId);
  }
}
