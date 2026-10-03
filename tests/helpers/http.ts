import { NextRequest } from "next/server";

export function makeRequest(
  url: string,
  init?: {
    method?: string;
    body?: unknown;
    cookie?: string;
    headers?: HeadersInit;
    searchParams?: Record<string, string>;
  },
) {
  const target = new URL(url, "http://localhost");
  if (init?.searchParams) {
    for (const [key, value] of Object.entries(init.searchParams)) {
      target.searchParams.set(key, value);
    }
  }
  const headers = new Headers(init?.headers);
  if (init?.cookie) headers.set("cookie", init.cookie);
  if (init?.body !== undefined && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  return new NextRequest(target, {
    method: init?.method ?? (init?.body !== undefined ? "POST" : "GET"),
    headers,
    body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
  });
}

export async function readJson<T = unknown>(response: Response): Promise<{
  status: number;
  body: T;
  ok: boolean;
  cookies: string[];
}> {
  const body = (await response.json()) as T;
  return {
    status: response.status,
    body,
    ok: response.ok,
    cookies: response.headers.getSetCookie?.() ?? [],
  };
}
