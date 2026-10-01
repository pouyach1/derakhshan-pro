"use client";

import { useCallback, useEffect, useState } from "react";
import {
  readWorkspaceTheme,
  writeWorkspaceTheme,
  type WorkspaceTheme,
} from "@/lib/workspace-theme";

/**
 * Light/dark preference for Admin + Agent workspace shells only.
 */
export function useWorkspaceTheme() {
  const [theme, setTheme] = useState<WorkspaceTheme>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTheme(readWorkspaceTheme());
    setReady(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: WorkspaceTheme = current === "dark" ? "light" : "dark";
      writeWorkspaceTheme(next);
      return next;
    });
  }, []);

  return {
    theme,
    isDark: theme === "dark",
    ready,
    toggleTheme,
  };
}
