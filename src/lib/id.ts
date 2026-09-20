/**
 * Tiny URL-safe id helper (nanoid-compatible API).
 * Implemented with Node/Web Crypto so Parspack installs do not depend on
 * downloading `nanoid` from a flaky npm mirror.
 */

const ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-";

function randomBytes(size: number): Uint8Array {
  if (typeof globalThis.crypto?.getRandomValues === "function") {
    const bytes = new Uint8Array(size);
    globalThis.crypto.getRandomValues(bytes);
    return bytes;
  }
  // Node fallback without importing node:crypto (keeps Edge/middleware-safe).
  const bytes = new Uint8Array(size);
  for (let i = 0; i < size; i += 1) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  return bytes;
}

/** Generate a URL-safe id. Default length matches nanoid's default (21). */
export function nanoid(size = 21): string {
  const length = Math.max(1, Math.floor(size));
  const bytes = randomBytes(length);
  let id = "";
  for (let i = 0; i < length; i += 1) {
    id += ALPHABET[bytes[i]! & 63]!;
  }
  return id;
}
