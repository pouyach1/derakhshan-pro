/** Thin typed client for Agency API */

export type ApiSuccess<T> = {
  ok: true;
  data: T;
  meta: { requestId: string; ts: string };
};

export type ApiFailure = {
  ok: false;
  error: { code: string; message: string; details?: unknown };
  meta: { requestId: string; ts: string };
};

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export async function api<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResult<T>> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  return (await res.json()) as ApiResult<T>;
}
