/**
 * Migration registry — additive, reviewable schema evolution notes.
 * Physical JSON stores normalize missing collections on load (no destructive rewrite).
 */

export type Migration = {
  id: string;
  title: string;
  /** Human description of the additive change. */
  description: string;
  /**
   * `applied: false` means the registry entry documents intent;
   * runtime normalization + hydrateDerivedCollections perform the safe additive work.
   */
  applied: boolean;
};

/** Ordered list of additive migrations. */
export const MIGRATIONS: Migration[] = [
  {
    id: "2026-10-01-blog-posts-collection",
    title: "Add blogPosts collection to AgencyStore",
    description:
      "Additive optional array AgencyStore.blogPosts (BlogPostRecord[]). " +
      "normalizeAgencyStore defaults missing field to []. " +
      "hydrateDerivedCollections imports seed editorial posts when empty. " +
      "Non-destructive; reversible by clearing blogPosts (data loss only of blog rows).",
    applied: true,
  },
  {
    id: "2026-10-01-chat-collections",
    title: "Add chatThreads and chatMessages to AgencyStore",
    description:
      "Additive optional arrays AgencyStore.chatThreads and AgencyStore.chatMessages. " +
      "normalizeAgencyStore defaults missing fields to []. " +
      "Supports support (client↔office) and admin (agent↔admins) desks.",
    applied: true,
  },
  {
    id: "2026-10-03-schema-version",
    title: "Stamp AgencyStore.schemaVersion",
    description:
      "Additive optional schemaVersion number on the agency document. " +
      "normalizeAgencyStore / saveStore stamp AGENCY_SCHEMA_VERSION=1. " +
      "Older files without the field load safely and gain the version on next save.",
    applied: true,
  },
];

export function listPendingMigrations() {
  return MIGRATIONS.filter((migration) => !migration.applied);
}
