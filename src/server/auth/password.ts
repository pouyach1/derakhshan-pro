import bcrypt from "bcryptjs";

/**
 * Cost 8 is Workers-safe. Cost 12 (previous) burns ~250ms+ pure CPU per
 * hash/compare and routinely trips Cloudflare Error 1102 on cold isolates.
 */
const ROUNDS = 8;

/**
 * Precomputed bcrypt (cost 8) for the showcase demo password so cold starts
 * never pay for hashing when SEED falls back to 123456.
 * Generate: `await bcrypt.hash("123456", 8)`
 */
const PRECOMPUTED_HASHES: Record<string, string> = {
  "123456": "$2b$08$8DvGjlhuDoYRvMtxaP99T.uHCU67nms56rg7HjONWEF4NPGe.ATpq",
};

const hashCache = new Map<string, Promise<string>>();

export async function hashPassword(plain: string) {
  const known = PRECOMPUTED_HASHES[plain];
  if (known) return known;

  const cached = hashCache.get(plain);
  if (cached) return cached;

  const pending = bcrypt.hash(plain, ROUNDS);
  hashCache.set(plain, pending);
  try {
    return await pending;
  } catch (error) {
    hashCache.delete(plain);
    throw error;
  }
}

export async function verifyPassword(plain: string, hash: string | null | undefined) {
  if (!hash) return false;
  const known = PRECOMPUTED_HASHES[plain];
  if (known && known === hash) return true;
  return bcrypt.compare(plain, hash);
}
