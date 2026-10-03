import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthField, PasswordField } from "@/components/auth/AuthFields";
import Button from "@/components/ui/Button";

vi.mock("framer-motion", async () => {
  const React = await import("react");
  return {
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: {
      span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
        <span {...props}>{children}</span>
      ),
    },
  };
});

describe("AuthFields accessibility", () => {
  it("marks invalid fields with aria-invalid", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <AuthField
        id="login-id"
        label="شناسه"
        value="x"
        onChange={onChange}
        error
      />,
    );
    const input = screen.getByLabelText("شناسه");
    expect(input).toHaveAttribute("aria-invalid", "true");
    await user.clear(input);
    await user.type(input, "0912");
    expect(onChange).toHaveBeenCalled();
  });

  it("password visibility toggle has an accessible name", () => {
    render(
      <PasswordField id="pwd" label="رمز عبور" value="secret" onChange={() => undefined} />,
    );
    expect(screen.getByLabelText("رمز عبور")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /نمایش رمز عبور|مخفی کردن رمز عبور/ })).toBeInTheDocument();
  });
});

describe("Button", () => {
  it("renders accessible button text and supports disabled", () => {
    render(
      <Button disabled type="button">
        ادامه
      </Button>,
    );
    const button = screen.getByRole("button", { name: /ادامه/ });
    expect(button).toBeDisabled();
  });
});
