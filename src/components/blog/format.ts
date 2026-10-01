/** Shared blog presentation helpers — keep formatting out of page files. */

export function formatBlogDate(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(date);
}

export function formatReadingTime(minutes: number): string {
  return `${minutes.toLocaleString("fa-IR")} دقیقه مطالعه`;
}
