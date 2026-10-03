import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BottomSheet from "@/components/mobile/BottomSheet";

vi.mock("framer-motion", async () => {
  const React = await import("react");
  const stripMotion = (props: Record<string, unknown>) => {
    const {
      animate: _a,
      exit: _e,
      initial: _i,
      transition: _t,
      drag: _d,
      dragConstraints: _dc,
      dragElastic: _de,
      style,
      ...rest
    } = props;
    return {
      ...rest,
      ...(style && typeof style === "object" ? { style: style as React.CSSProperties } : {}),
    };
  };
  return {
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: {
      button: ({
        children,
        ...props
      }: React.ButtonHTMLAttributes<HTMLButtonElement> & Record<string, unknown>) => (
        <button type="button" {...stripMotion(props as Record<string, unknown>)}>
          {children}
        </button>
      ),
      div: ({
        children,
        ...props
      }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode } & Record<
        string,
        unknown
      >) => <div {...stripMotion(props as Record<string, unknown>)}>{children}</div>,
    },
    useMotionValue: () => ({ set: vi.fn(), get: () => 0 }),
    useTransform: () => 1,
    useReducedMotion: () => true,
  };
});

vi.mock("@/hooks/useHaptic", () => ({
  useHaptic: () => vi.fn(),
}));

describe("BottomSheet accessibility regression", () => {
  it("closes on Escape", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <BottomSheet open title="فیلترها" onClose={onClose}>
        <p>محتوا</p>
      </BottomSheet>,
    );

    expect(screen.getByRole("dialog", { name: "فیلترها" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("backdrop close control is named", () => {
    render(
      <BottomSheet open title="فیلترها" onClose={() => undefined}>
        <p>محتوا</p>
      </BottomSheet>,
    );
    const closeControls = screen.getAllByRole("button", { name: "بستن" });
    expect(closeControls.length).toBeGreaterThan(0);
    expect(closeControls[0]).toHaveAttribute("aria-label", "بستن");
  });
});
