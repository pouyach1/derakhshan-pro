import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { inquirySchema } from "@/server/validation/schemas";
import { createInquiry } from "@/server/services/crm";
import { jsonError, jsonOk, ApiError } from "@/server/http/response";
import { rateLimit } from "@/server/auth/rate-limit";
import { clientIp } from "@/server/http/guard";

export async function POST(request: NextRequest) {
  const requestId = nanoid(10);
  try {
    const ip = clientIp(request);
    const limited = rateLimit(`inquiry:${ip}`, 8, 60_000);
    if (!limited.ok) {
      throw new ApiError(429, "RATE_LIMITED", "تعداد درخواست‌ها بیش از حد مجاز است");
    }
    const body = inquirySchema.parse(await request.json());
    const result = await createInquiry(body, ip);
    return jsonOk(result, { requestId, status: 201 });
  } catch (error) {
    return jsonError(error, requestId);
  }
}
