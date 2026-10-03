/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PropertyLightbox from "@/components/listings/PropertyLightbox";

vi.mock("next/image", () => ({
  default: (props: { alt?: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={props.alt ?? ""} />;
  },
  getImageProps: () => ({ props: { src: "/images/landing/hero/banner.jpg" } }),
}));

vi.mock("framer-motion", async () => {
  const React = await import("react");
  return {
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: {
      div: ({
        children,
        ...props
      }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) => (
        <div {...props}>{children}</div>
      ),
    },
    useReducedMotion: () => true,
  };
});

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
});

describe("PropertyLightbox behavior", () => {
  const images = [
    "/images/landing/hero/banner.jpg",
    "/images/landing/hero/side.jpg",
    "/images/admin/properties/saadatabad.jpg",
  ];

  it("opens with accessible dialog name and closes on Escape", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <PropertyLightbox open images={images} title="ملک الف" code="PA-001" onClose={onClose} />,
    );
    await waitFor(() => {
      expect(document.querySelector('[role="dialog"][aria-label="گالری ملک الف"]')).toBeTruthy();
    });
    await user.keyboard("{Escape}");
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("next/previous controls change the live frame label", async () => {
    const user = userEvent.setup();
    render(
      <PropertyLightbox open images={images} title="ملک الف" startIndex={0} onClose={() => undefined} />,
    );
    await waitFor(() => {
      expect(document.querySelector('[role="dialog"][aria-label="گالری ملک الف"]')).toBeTruthy();
    });
    const live = () => document.querySelector("[aria-live='polite']");
    expect(live()?.textContent).toBe("01 / 03");
    await user.click(screen.getByRole("button", { name: "تصویر بعدی" }));
    await waitFor(() => expect(live()?.textContent).toBe("02 / 03"));
    await user.click(screen.getByRole("button", { name: "تصویر قبلی" }));
    await waitFor(() => expect(live()?.textContent).toBe("01 / 03"));
  });

  it("close control is named and invokes onClose", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<PropertyLightbox open images={images} title="ملک الف" onClose={onClose} />);
    await waitFor(() => {
      expect(document.querySelector('[role="dialog"][aria-label="گالری ملک الف"]')).toBeTruthy();
    });
    const closes = screen.getAllByRole("button", { name: "بستن گالری" });
    await user.click(closes[closes.length - 1]);
    expect(onClose).toHaveBeenCalled();
  });
});
