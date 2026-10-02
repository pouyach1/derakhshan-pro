import { NextRequest } from "next/server";
import { nanoid } from "@/lib/id";
import { chatThreadCreateSchema } from "@/server/validation/schemas";
import { ensureOwnThread, listChatThreads } from "@/server/services/chat";
import { requireSession } from "@/server/http/guard";
import { jsonError, jsonOk } from "@/server/http/response";
import type { ChatThreadKind } from "@/server/db/store";

export async function GET(request: NextRequest) {
  const requestId = nanoid(10);
  try {
    const session = await requireSession(request, ["admin", "agent", "client"]);
    const kindParam = request.nextUrl.searchParams.get("kind");
    const kind =
      kindParam === "support" || kindParam === "admin"
        ? (kindParam as ChatThreadKind)
        : undefined;
    const items = await listChatThreads(session, kind);
    return jsonOk({ items }, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}

export async function POST(request: NextRequest) {
  const requestId = nanoid(10);
  try {
    const session = await requireSession(request, ["admin", "agent", "client"]);
    const body = chatThreadCreateSchema.parse(await request.json());
    const item = await ensureOwnThread(session, body.kind);
    return jsonOk(item, { requestId, status: 201 });
  } catch (error) {
    return jsonError(error, requestId);
  }
}
