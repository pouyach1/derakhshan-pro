import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogDeleteButton from "@/components/blog/admin/BlogDeleteButton";

const refresh = vi.fn();
const apiMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

vi.mock("@/lib/api", () => ({
  api: (...args: unknown[]) => apiMock(...args),
}));

describe("BlogDeleteButton accessibility regression", () => {
  beforeEach(() => {
    refresh.mockReset();
    apiMock.mockReset();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("opens dialog, focuses cancel, and closes on Escape with focus return", async () => {
    const user = userEvent.setup();
    render(<BlogDeleteButton postId="blog-1" title="مقاله تست" />);

    const trigger = screen.getByRole("button", { name: /حذف مقاله مقاله تست/ });
    await user.click(trigger);

    expect(screen.getByRole("dialog", { name: /حذف مقاله/ })).toBeInTheDocument();
    const cancel = screen.getByRole("button", { name: "انصراف" });
    await waitFor(() => expect(cancel).toHaveFocus());

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("closes when backdrop is clicked", async () => {
    const user = userEvent.setup();
    render(<BlogDeleteButton postId="blog-1" title="مقاله تست" />);
    await user.click(screen.getByRole("button", { name: /حذف مقاله مقاله تست/ }));
    const dialog = screen.getByRole("dialog");
    await user.click(dialog);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
