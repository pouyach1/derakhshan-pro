import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function jsonOk<T>(data: T, init?: ResponseInit & { requestId?: string }) {
  const requestId = init?.requestId ?? nanoid(10);
  return NextResponse.json(
    { ok: true, data, meta: { requestId, ts: new Date().toISOString() } },
    {
      ...init,
      headers: {
        "x-request-id": requestId,
        ...(init?.headers ?? {}),
      },
    },
  );
}

export function jsonError(error: unknown, requestId = nanoid(10)) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
        meta: { requestId, ts: new Date().toISOString() },
      },
      {
        status: error.status,
        headers: { "x-request-id": requestId },
      },
    );
  }

  console.error("[api]", requestId, error);
  return NextResponse.json(
    {
      ok: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "خطای داخلی سرور",
      },
      meta: { requestId, ts: new Date().toISOString() },
    },
    { status: 500, headers: { "x-request-id": requestId } },
  );
}
