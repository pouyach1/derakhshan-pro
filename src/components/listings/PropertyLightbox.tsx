"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image, { getImageProps } from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { frameLabel } from "@/lib/property-images";
import { fallbackImage } from "@/lib/money";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type PropertyLightboxProps = {
  open: boolean;
  images: string[];
  title: string;
  code?: string;
  startIndex?: number;
  onClose: () => void;
};

export default function PropertyLightbox({
  open,
  images,
  title,
  code,
  startIndex = 0,
  onClose,
}: PropertyLightboxProps) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(startIndex);
  const [broken, setBroken] = useState<Record<number, boolean>>({});
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const dragX = useRef<number | null>(null);
  const onCloseRef = useRef(onClose);
  const indexRef = useRef(index);
  onCloseRef.current = onClose;
  indexRef.current = index;

  const total = Math.max(images.length, 1);
  const safeImages = images.length ? images : [fallbackImage(null)];
  const multi = safeImages.length > 1;

  const go = useCallback(
    (next: number) => {
      const count = safeImages.length;
      setIndex(((next % count) + count) % count);
    },
    [safeImages.length],
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) setIndex(Math.min(startIndex, safeImages.length - 1));
  }, [open, startIndex, safeImages.length]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => closeRef.current?.focus());
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(indexRef.current - 1);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(indexRef.current + 1);
        return;
      }
      if (event.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const nodes = [...root.querySelectorAll<HTMLElement>("button, [href], [tabindex]:not([tabindex='-1'])")].filter(
        (node) => !node.hasAttribute("disabled"),
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !root.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !root.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, go]);

  useEffect(() => {
    if (!open || !multi) return;
    const nextSrc = safeImages[(index + 1) % safeImages.length];
    try {
      const { props } = getImageProps({ alt: "", fill: true, sizes: "100vw", src: nextSrc });
      if (!props.src) return;
      const preload = new window.Image();
      preload.src = props.src;
    } catch {
      const preload = new window.Image();
      preload.src = nextSrc;
    }
  }, [open, index, multi, safeImages]);

  if (!mounted) return null;

  const src = broken[index] ? fallbackImage(null) : safeImages[index];

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`گالری ${title}`}
          className="fixed inset-0 z-[120] flex flex-col bg-[#07080c] text-white"
          style={{
            paddingTop: "max(0.75rem, env(safe-area-inset-top))",
            paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: EASE.expoOut }}
        >
          <div className="flex items-start justify-between gap-4 px-4 pt-2 sm:px-6">
            <div className="min-w-0">
              {code ? (
                <p className="font-mono text-[11px] tracking-[0.22em] text-white/45">{code}</p>
              ) : null}
              <p className="mt-1 truncate font-vazirmatn text-sm text-white/88 sm:text-base">{title}</p>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="بستن گالری"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div
            className="relative mx-auto min-h-0 w-full flex-1 touch-pan-y"
            onPointerDown={(event) => {
              if ((event.target as HTMLElement).closest("button")) return;
              dragX.current = event.clientX;
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerUp={(event) => {
              if (dragX.current == null || !multi) return;
              const delta = event.clientX - dragX.current;
              dragX.current = null;
              if (delta <= -48) go(index + 1);
              else if (delta >= 48) go(index - 1);
            }}
            onPointerCancel={() => {
              dragX.current = null;
            }}
          >
            <div className="absolute inset-0 sm:inset-x-16">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${index}-${src}`}
                  className="absolute inset-0"
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0.15 : 0.38, ease: EASE.expoOut }}
                >
                  <Image
                    src={src}
                    alt={`${title} — ${frameLabel(index + 1, total)}`}
                    fill
                    priority
                    sizes="100vw"
                    draggable={false}
                    className="pointer-events-none object-contain select-none"
                    onError={() => {
                      if (src === fallbackImage(null)) return;
                      setBroken((prev) => ({ ...prev, [index]: true }));
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {multi ? (
              <>
                <NavButton
                  label="تصویر قبلی"
                  className="left-2 sm:left-5"
                  onClick={() => go(index - 1)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </NavButton>
                <NavButton
                  label="تصویر بعدی"
                  className="right-2 sm:right-5"
                  onClick={() => go(index + 1)}
                >
                  <ChevronRight className="h-5 w-5" />
                </NavButton>
              </>
            ) : null}
          </div>

          <div className="flex flex-col items-center gap-3 px-4 pb-2 pt-3">
            <p className="font-mono text-[11px] tracking-[0.28em] text-white/70" aria-live="polite">
              {frameLabel(index + 1, total)}
            </p>
            {multi ? (
              <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
                {safeImages.map((image, imageIndex) => {
                  const active = imageIndex === index;
                  return (
                    <button
                      key={`${image}-${imageIndex}`}
                      type="button"
                      aria-label={`تصویر ${frameLabel(imageIndex + 1, total)}`}
                      aria-current={active ? "true" : undefined}
                      onClick={() => go(imageIndex)}
                      className={cn(
                        "relative h-12 w-[4.25rem] shrink-0 overflow-hidden transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:h-14 sm:w-20",
                        active ? "opacity-100" : "opacity-40 hover:opacity-80",
                      )}
                    >
                      <Image
                        src={broken[imageIndex] ? fallbackImage(null) : image}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

function NavButton({
  label,
  className,
  onClick,
  children,
}: {
  label: string;
  className?: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
        className,
      )}
    >
      {children}
    </button>
  );
}
