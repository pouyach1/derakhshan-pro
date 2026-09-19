import bcrypt from "bcryptjs";

/**
 * Cost 8 keeps hashing cheap on constrained hosts (and Workers).
 * Cost 12 burns ~250ms+ pure CPU per hash/compare.
 */
const ROUNDS = 8;

/**
 * Optional precomputed bcrypt (cost 8) for the local-dev demo password only.
 * Production must never auto-login with this value — see resolveSeedPassword().
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
