"use client";

import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  Undo2,
  Redo2,
  RemoveFormatting,
  Pilcrow,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ToolButton = {
  key: string;
  label: string;
  icon?: LucideIcon;
  text?: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
};

type BlogEditorToolbarProps = {
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onH1: () => void;
  onH2: () => void;
  onH3: () => void;
  onParagraph: () => void;
  onBullet: () => void;
  onNumbered: () => void;
  onQuote: () => void;
  onLink: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

function Tool({ label, icon: Icon, text, onClick, disabled, active }: ToolButton) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 min-w-9 items-center justify-center rounded-xl px-2 text-xs font-semibold transition duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50",
        disabled && "cursor-not-allowed opacity-35",
        active
          ? "bg-sky-500/25 text-sky-100 ring-1 ring-sky-400/45"
          : "text-ws-muted hover:bg-white/5 hover:text-ws-text",
      )}
    >
      {Icon ? <Icon className="h-4 w-4" aria-hidden /> : text}
    </button>
  );
}

function Divider() {
  return <span aria-hidden className="mx-0.5 h-6 w-px shrink-0 bg-white/10" />;
}

/**
 * Compact premium toolbar for the markdown-backed blog editor.
 */
export default function BlogEditorToolbar(props: BlogEditorToolbarProps) {
  const groups: ToolButton[][] = [
    [
      { key: "bold", label: "پررنگ", icon: Bold, onClick: props.onBold },
      { key: "italic", label: "کج", icon: Italic, onClick: props.onItalic },
      { key: "underline", label: "زیرخط", icon: Underline, onClick: props.onUnderline },
    ],
    [
      { key: "h1", label: "عنوان ۱", icon: Heading1, onClick: props.onH1 },
      { key: "h2", label: "عنوان ۲", icon: Heading2, onClick: props.onH2 },
      { key: "h3", label: "عنوان ۳", icon: Heading3, onClick: props.onH3 },
      { key: "p", label: "پاراگراف", icon: Pilcrow, onClick: props.onParagraph },
    ],
    [
      { key: "ul", label: "فهرست نقطه‌ای", icon: List, onClick: props.onBullet },
      { key: "ol", label: "فهرست شماره‌دار", icon: ListOrdered, onClick: props.onNumbered },
      { key: "quote", label: "نقل‌قول", icon: Quote, onClick: props.onQuote },
      { key: "link", label: "افزودن لینک", icon: Link2, onClick: props.onLink },
    ],
    [
      {
        key: "undo",
        label: "بازگشت",
        icon: Undo2,
        onClick: props.onUndo,
        disabled: !props.canUndo,
      },
      {
        key: "redo",
        label: "انجام دوباره",
        icon: Redo2,
        onClick: props.onRedo,
        disabled: !props.canRedo,
      },
      { key: "clear", label: "پاک کردن قالب‌بندی", icon: RemoveFormatting, onClick: props.onClear },
    ],
  ];

  return (
    <div
      className="flex items-center gap-0.5 overflow-x-auto border-b border-white/10 bg-[#141a22] px-2 py-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="toolbar"
      aria-label="ابزار قالب‌بندی متن"
      dir="rtl"
    >
      {groups.map((group, index) => (
        <div key={index} className="flex shrink-0 items-center gap-0.5">
          {index > 0 ? <Divider /> : null}
          {group.map((tool) => {
            const { key, ...rest } = tool;
            return <Tool key={key} {...rest} />;
          })}
        </div>
      ))}
    </div>
  );
}
