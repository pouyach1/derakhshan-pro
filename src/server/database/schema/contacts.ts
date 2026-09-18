/**
 * Contact / newsletter messages captured from public forms.
 * Kept for parity with the live JSON store (not a separate Phase-A domain folder).
 */

export type ContactRecord = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  interest: string;
  category: string;
  message: string;
  budget: string | null;
  tab: string;
  status: "new" | "read" | "archived";
  meta: Record<string, unknown>;
  createdAt: string;
};
