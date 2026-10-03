import type { ClientNote } from "@/server/database/schema/clients";

/** Guard against missing/legacy notes payloads without inventing events. */
export function normalizeClientNotes(notes: unknown): ClientNote[] {
  if (!Array.isArray(notes)) return [];
  return notes
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item, index) => ({
      id: typeof item.id === "string" && item.id ? item.id : undefined,
      text: typeof item.text === "string" ? item.text : "",
      at: typeof item.at === "string" ? item.at : undefined,
    }))
    .filter((item) => item.text.trim().length > 0)
    .map((item, index) => ({
      ...item,
      id: item.id || `note-${index}`,
    }));
}

/**
 * Format note timestamps for display.
 * Accepts ISO strings or already-localized Persian labels (pass-through).
 */
export function formatNoteAt(value?: string | null): string {
  if (!value || !value.trim()) return "";
  const raw = value.trim();
  // Already a Persian/localized label from older agent writes
  if (/[۰-۹]/.test(raw) || raw.includes("·") || raw.includes("امروز")) return raw;
  const parsed = Date.parse(raw);
  if (Number.isNaN(parsed)) return raw;
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(parsed));
  } catch {
    return raw;
  }
}

/** Newest first when `at` is parseable; otherwise keep relative order. */
export function sortNotesNewestFirst(notes: ClientNote[]): ClientNote[] {
  return [...notes].sort((a, b) => {
    const ta = a.at ? Date.parse(a.at) : NaN;
    const tb = b.at ? Date.parse(b.at) : NaN;
    if (!Number.isNaN(ta) && !Number.isNaN(tb)) return tb - ta;
    if (!Number.isNaN(ta)) return -1;
    if (!Number.isNaN(tb)) return 1;
    return 0;
  });
}
