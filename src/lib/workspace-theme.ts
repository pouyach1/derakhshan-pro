export type WorkspaceTheme = "dark" | "light";

export const WORKSPACE_THEME_KEY = "derakhshan-workspace-theme";

export function readWorkspaceTheme(): WorkspaceTheme {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = window.localStorage.getItem(WORKSPACE_THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* ignore */
  }
  return "dark";
}

export function writeWorkspaceTheme(theme: WorkspaceTheme) {
  try {
    window.localStorage.setItem(WORKSPACE_THEME_KEY, theme);
  } catch {
    /* ignore */
  }
}
