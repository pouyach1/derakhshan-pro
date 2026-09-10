"use client";

import { useEffect, useRef } from "react";

type UseScrollSyncOptions = {
  /** Master switch — typically true only on the dashboard route. */
  enabled?: boolean;
  /** Portion of the combined scroll journey reserved for the sidebar (0–1). */
  sidebarShare?: number;
  /** Desktop breakpoint — sync is disabled below this width. */
  minWidth?: number;
  /** CSS selector for the contacts scroll container. */
  sidebarSelector?: string;
};

/**
 * Proportional scroll sync (default 40% sidebar → 60% page).
 *
 * On desktop, while the page sits at the top, wheel/trackpad deltas are routed
 * into the contacts sidebar until either:
 *   1) diverted distance reaches `sidebarShare` of the combined scroll range, or
 *   2) the sidebar hits its bottom boundary.
 * Then the main viewport unlocks and scrolls normally.
 * Disabled on stacked mobile/tablet layouts.
 */
export function useScrollSync({
  enabled = true,
  sidebarShare = 0.4,
  minWidth = 1024,
  sidebarSelector = "[data-contacts-scroll]",
}: UseScrollSyncOptions = {}) {
  const divertedRef = useRef(0);
  const unlockedRef = useRef(false);
  const pendingDeltaRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const media = window.matchMedia(`(min-width: ${minWidth}px)`);
    let active = media.matches;

    const reset = () => {
      divertedRef.current = 0;
      unlockedRef.current = false;
      pendingDeltaRef.current = 0;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };

    const getSidebar = () => document.querySelector<HTMLElement>(sidebarSelector);

    const flushSidebar = () => {
      rafRef.current = 0;
      const sidebar = getSidebar();
      const delta = pendingDeltaRef.current;
      pendingDeltaRef.current = 0;
      if (!sidebar || delta === 0) return;

      const sidebarMax = Math.max(0, sidebar.scrollHeight - sidebar.clientHeight);
      const before = sidebar.scrollTop;
      sidebar.scrollTop = Math.min(sidebarMax, Math.max(0, before + delta));
      const applied = sidebar.scrollTop - before;

      if (applied > 0) divertedRef.current += applied;
      else if (applied < 0) divertedRef.current = Math.max(0, divertedRef.current + applied);

      const pageMax = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const unlockBudget = Math.max(sidebarMax * 0.5, (sidebarMax + pageMax) * sidebarShare);

      if (sidebar.scrollTop >= sidebarMax - 1 || divertedRef.current >= unlockBudget) {
        unlockedRef.current = true;
      }
    };

    const queueSidebarDelta = (deltaY: number) => {
      pendingDeltaRef.current += deltaY;
      if (!rafRef.current) {
        rafRef.current = window.requestAnimationFrame(flushSidebar);
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (!active) return;

      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-wheel-self]")) return;

      const sidebar = getSidebar();
      if (!sidebar) return;

      const sidebarMax = Math.max(0, sidebar.scrollHeight - sidebar.clientHeight);
      if (sidebarMax <= 1) return;

      const pageMax = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const unlockBudget = Math.max(sidebarMax * 0.5, (sidebarMax + pageMax) * sidebarShare);

      const scrollingDown = event.deltaY > 0;
      const scrollingUp = event.deltaY < 0;
      const pageAtTop = window.scrollY <= 1;
      const sidebarAtBottom = sidebar.scrollTop >= sidebarMax - 1;
      const sidebarAtTop = sidebar.scrollTop <= 1;

      // Re-arm when returning to the page top and scrolling back into the sidebar.
      if (pageAtTop && scrollingUp && !sidebarAtTop) {
        unlockedRef.current = false;
      }

      if (pageAtTop && scrollingDown && (sidebarAtBottom || divertedRef.current >= unlockBudget)) {
        unlockedRef.current = true;
      }

      // Locked phase: hold the viewport, feed the sidebar with rAF batching.
      if (!unlockedRef.current && pageAtTop) {
        if (scrollingDown && !sidebarAtBottom) {
          event.preventDefault();
          queueSidebarDelta(event.deltaY);
          return;
        }

        if (scrollingUp && !sidebarAtTop) {
          event.preventDefault();
          queueSidebarDelta(event.deltaY);
          return;
        }
      }

      if (pageAtTop && sidebarAtTop && !scrollingDown) {
        reset();
      }
    };

    const onMedia = () => {
      active = media.matches;
      if (!active) reset();
    };

    media.addEventListener("change", onMedia);
    // passive:false only so we can preventDefault during the locked phase —
    // never set overflow:hidden on body/main.
    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      media.removeEventListener("change", onMedia);
      window.removeEventListener("wheel", onWheel);
      reset();
    };
  }, [enabled, sidebarShare, minWidth, sidebarSelector]);
}
