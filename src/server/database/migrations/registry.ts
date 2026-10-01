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
];

export function listPendingMigrations() {
  return MIGRATIONS.filter((migration) => !migration.applied);
}
