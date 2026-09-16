import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { getSessionFromRequest } from "@/server/http/guard";
import { jsonError, jsonOk, ApiError } from "@/server/http/response";

export async function GET(request: NextRequest) {
  const requestId = nanoid(10);
  try {
    const session = await getSessionFromRequest(request);
    if (!session) throw new ApiError(401, "UNAUTHORIZED", "نشست معتبر یافت نشد");
    return jsonOk({ session }, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}
