import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { settingsUpdateSchema } from "@/server/validation/schemas";
import { getSettings, updateSettings } from "@/server/services/crm";
import { requireSession } from "@/server/http/guard";
import { jsonError, jsonOk } from "@/server/http/response";

export async function GET(request: NextRequest) {
  const requestId = nanoid(10);
  try {
    await requireSession(request, ["admin"]);
    const item = await getSettings();
    return jsonOk(item, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}

export async function PATCH(request: NextRequest) {
  const requestId = nanoid(10);
  try {
    await requireSession(request, ["admin"]);
    const body = settingsUpdateSchema.parse(await request.json());
    const item = await updateSettings(body);
    return jsonOk(item, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}
