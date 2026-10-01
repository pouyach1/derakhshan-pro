/** Lightweight markdown helpers for the blog textarea editor (no new deps). */

export type TextSelection = {
  value: string;
  start: number;
  end: number;
};

export type TextEditResult = TextSelection;

export function wrapSelection(
  state: TextSelection,
  before: string,
  after: string = before,
): TextEditResult {
  const selected = state.value.slice(state.start, state.end) || "متن";
  const next = state.value.slice(0, state.start) + before + selected + after + state.value.slice(state.end);
  const start = state.start + before.length;
  return { value: next, start, end: start + selected.length };
}

/** Prefix each selected line (or current line) with a marker. */
export function prefixLines(state: TextSelection, prefix: string): TextEditResult {
  const { value, start, end } = state;
  const lineStart = value.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
  const lineEndIdx = value.indexOf("\n", end);
  const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx;
  const block = value.slice(lineStart, lineEnd);
  const lines = block.split("\n").map((line, index) => {
    const trimmed = line.replace(/^\s*(?:[-*]\s+|\d+\.\s+|>\s+|#+\s+)/, "");
    const body = trimmed || "مورد";
    if (prefix === "1. ") return `${index + 1}. ${body}`;
    return `${prefix}${body}`;
  });
  const nextBlock = lines.join("\n");
  const next = value.slice(0, lineStart) + nextBlock + value.slice(lineEnd);
  return { value: next, start: lineStart, end: lineStart + nextBlock.length };
}

/** Set heading level for the current/selected lines (# … ###) or paragraph (strip). */
export function setHeading(state: TextSelection, level: 0 | 1 | 2 | 3): TextEditResult {
  const prefix = level === 0 ? "" : `${"#".repeat(level)} `;
  const { value, start, end } = state;
  const lineStart = value.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
  const lineEndIdx = value.indexOf("\n", end);
  const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx;
  const block = value.slice(lineStart, lineEnd);
  const lines = block.split("\n").map((line) => {
    const trimmed = line.replace(/^\s*#+\s+/, "");
    return `${prefix}${trimmed || "عنوان"}`;
  });
  const nextBlock = lines.join("\n");
  const next = value.slice(0, lineStart) + nextBlock + value.slice(lineEnd);
  return { value: next, start: lineStart, end: lineStart + nextBlock.length };
}

export function clearInlineFormatting(state: TextSelection): TextEditResult {
  const selected = state.value.slice(state.start, state.end);
  if (!selected) return state;
  const cleaned = selected
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  const next = state.value.slice(0, state.start) + cleaned + state.value.slice(state.end);
  return { value: next, start: state.start, end: state.start + cleaned.length };
}

export function insertLink(state: TextSelection, url: string): TextEditResult {
  const label = state.value.slice(state.start, state.end) || "لینک";
  const snippet = `[${label}](${url})`;
  const next = state.value.slice(0, state.start) + snippet + state.value.slice(state.end);
  return { value: next, start: state.start, end: state.start + snippet.length };
}
