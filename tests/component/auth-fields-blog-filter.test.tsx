import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthField, PasswordField } from "@/components/auth/AuthFields";
import BlogCategoryFilter from "@/components/blog/BlogCategoryFilter";

describe("AuthFields accessibility", () => {
  it("sets aria-invalid when error is true", () => {
    render(
      <AuthField
        id="email"
        label="ایمیل"
        value="bad"
        onChange={() => undefined}
        error
      />,
    );
    expect(screen.getByLabelText("ایمیل")).toHaveAttribute("aria-invalid", "true");
  });

  it("password visibility toggle updates accessible name", async () => {
    const user = userEvent.setup();
    render(
      <PasswordField id="password" label="رمز عبور" value="secret" onChange={() => undefined} />,
    );
    const toggle = screen.getByRole("button", { name: "نمایش رمز عبور" });
    await user.click(toggle);
    expect(screen.getByRole("button", { name: "مخفی کردن رمز عبور" })).toBeInTheDocument();
  });
});

describe("BlogCategoryFilter accessibility", () => {
  it("aria-checked reflects active category", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<BlogCategoryFilter activeCategory={null} onChange={onChange} />);

    const all = screen.getByRole("radio", { name: "همه" });
    expect(all).toHaveAttribute("aria-checked", "true");

    const market = screen.getByRole("radio", { name: "بازار املاک" });
    await user.click(market);
    expect(onChange).toHaveBeenCalledWith("بازار املاک");
  });
});
