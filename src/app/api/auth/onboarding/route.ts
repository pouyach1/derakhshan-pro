import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { onboardingSchema } from "@/server/validation/schemas";
import { completeOnboarding } from "@/server/services/crm";
import { requireSession } from "@/server/http/guard";
import { jsonError, jsonOk } from "@/server/http/response";
import {
  authCookieName,
  sessionCookieOptions,
  signSession,
} from "@/server/auth/session";

export async function POST(request: NextRequest) {
  const requestId = nanoid(10);
  try {
    const session = await requireSession(request, ["client"]);
    const body = onboardingSchema.parse(await request.json());
    const profile = await completeOnboarding(session.id, body);
    const nextSession = {
      ...session,
      name: profile.fullName,
      onboardingComplete: true,
      clientProfile: profile,
    };
    const token = await signSession(nextSession);
    const response = jsonOk({ session: nextSession }, { requestId });
    response.cookies.set(authCookieName(), token, sessionCookieOptions());
    return response;
  } catch (error) {
    return jsonError(error, requestId);
  }
}
