"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import BlogEditorToolbar from "@/components/blog/admin/BlogEditorToolbar";
import {
  clearInlineFormatting,
  insertLink,
  prefixLines,
  setHeading,
  wrapSelection,
  type TextSelection,
} from "@/lib/blog/markdown-edit";
import { cn } from "@/lib/utils";

type BlogRichTextAreaProps = {
  name?: string;
  label?: string;
  defaultValue?: string;
  rows?: number;
  hint?: string;
  className?: string;
};

/**
 * Markdown-compatible writing area with toolbar.
 * Keeps BlogPost.content as plain text — no schema/API change.
 */
export default function BlogRichTextArea({
  name = "content",
  label = "محتوای مقاله",
  defaultValue = "",
  rows = 14,
  hint = "قالب‌بندی به‌صورت Markdown سبک ذخیره می‌شود (## عنوان، **پررنگ**، > نقل‌قول، - فهرست).",
  className,
}: BlogRichTextAreaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState(defaultValue);
  const historyRef = useRef<string[]>([defaultValue]);
  const indexRef = useRef(0);
  const [, bump] = useState(0);
  const typingTimer = useRef<number | null>(null);

  const canUndo = indexRef.current > 0;
  const canRedo = indexRef.current < historyRef.current.length - 1;

  const commit = useCallback((next: string, recordHistory: boolean) => {
    setValue(next);
    if (!recordHistory) return;
    const prev = historyRef.current;
    const idx = indexRef.current;
    const trimmed = prev.slice(0, idx + 1);
    if (trimmed[trimmed.length - 1] === next) return;
    const merged = [...trimmed, next].slice(-40);
    historyRef.current = merged;
    indexRef.current = merged.length - 1;
    bump((n) => n + 1);
  }, []);

  function readSelection(): TextSelection {
    const el = ref.current;
    if (!el) return { value, start: value.length, end: value.length };
    return { value: el.value, start: el.selectionStart, end: el.selectionEnd };
  }

  function apply(result: TextSelection) {
    commit(result.value, true);
    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(result.start, result.end);
    });
  }

  function onBold() {
    apply(wrapSelection(readSelection(), "**"));
  }
  function onItalic() {
    apply(wrapSelection(readSelection(), "*"));
  }
  function onUnderline() {
    apply(wrapSelection(readSelection(), "__"));
  }
  function onH1() {
    apply(setHeading(readSelection(), 1));
  }
  function onH2() {
    apply(setHeading(readSelection(), 2));
  }
  function onH3() {
    apply(setHeading(readSelection(), 3));
  }
  function onParagraph() {
    apply(setHeading(readSelection(), 0));
  }
  function onBullet() {
    apply(prefixLines(readSelection(), "- "));
  }
  function onNumbered() {
    apply(prefixLines(readSelection(), "1. "));
  }
  function onQuote() {
    apply(prefixLines(readSelection(), "> "));
  }
  function onLink() {
    const url = window.prompt("آدرس لینک را وارد کنید:", "https://");
    if (!url) return;
    apply(insertLink(readSelection(), url.trim()));
  }
  function onClear() {
    apply(clearInlineFormatting(readSelection()));
  }
  function onUndo() {
    if (indexRef.current <= 0) return;
    indexRef.current -= 1;
    setValue(historyRef.current[indexRef.current] ?? "");
    bump((n) => n + 1);
  }
  function onRedo() {
    if (indexRef.current >= historyRef.current.length - 1) return;
    indexRef.current += 1;
    setValue(historyRef.current[indexRef.current] ?? "");
    bump((n) => n + 1);
  }

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey;
      if (!meta) return;
      const key = event.key.toLowerCase();
      if (key === "b") {
        event.preventDefault();
        onBold();
      } else if (key === "i") {
        event.preventDefault();
        onItalic();
      } else if (key === "u") {
        event.preventDefault();
        onUnderline();
      } else if (key === "z" && event.shiftKey) {
        event.preventDefault();
        onRedo();
      } else if (key === "z") {
        event.preventDefault();
        onUndo();
      } else if (key === "y") {
        event.preventDefault();
        onRedo();
      }
    };

    el.addEventListener("keydown", onKeyDown);
    return () => el.removeEventListener("keydown", onKeyDown);
  });

  useEffect(() => {
    return () => {
      if (typingTimer.current) window.clearTimeout(typingTimer.current);
    };
  }, []);

  return (
    <div className={cn("space-y-1.5 md:col-span-2", className)} dir="rtl">
      <label htmlFor={name} className="text-sm font-medium text-ws-text">
        {label}
      </label>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#121821] shadow-[0_18px_40px_-28px_rgba(0,0,0,0.55)]">
        <BlogEditorToolbar
          onBold={onBold}
          onItalic={onItalic}
          onUnderline={onUnderline}
          onH1={onH1}
          onH2={onH2}
          onH3={onH3}
          onParagraph={onParagraph}
          onBullet={onBullet}
          onNumbered={onNumbered}
          onQuote={onQuote}
          onLink={onLink}
          onUndo={onUndo}
          onRedo={onRedo}
          onClear={onClear}
          canUndo={canUndo}
          canRedo={canRedo}
        />
        <textarea
          ref={ref}
          id={name}
          name={name}
          rows={rows}
          value={value}
          onChange={(event) => {
            const next = event.target.value;
            setValue(next);
            if (typingTimer.current) window.clearTimeout(typingTimer.current);
            typingTimer.current = window.setTimeout(() => commit(next, true), 450);
          }}
          onBlur={() => commit(value, true)}
          dir="rtl"
          className="w-full resize-y bg-transparent px-4 py-3 text-sm leading-8 text-ws-text outline-none placeholder:text-ws-muted/70"
          placeholder="متن مقاله را اینجا بنویسید…"
        />
      </div>
      <span className="block text-xs leading-6 text-ws-muted">{hint}</span>
    </div>
  );
}
