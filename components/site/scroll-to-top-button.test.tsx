import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ScrollToTopButton } from "@/components/site/scroll-to-top-button";

describe("ScrollToTopButton", () => {
  const scrollToMock = vi.fn();
  const matchMediaMock = vi.fn();

  beforeEach(() => {
    scrollToMock.mockReset();
    matchMediaMock.mockReset();

    vi.stubGlobal("scrollTo", scrollToMock);

    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      writable: true,
      value: 1000,
    });

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 0,
    });

    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: matchMediaMock,
    });

    matchMediaMock.mockReturnValue({
      matches: false,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });
  });

  it("is hidden when scrollY is at or below the 100vh threshold", () => {
    render(<ScrollToTopButton />);

    const button = screen.getByRole("button", { name: "Scroll to top" });
    expect(button.className).toContain("opacity-0");

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 1000,
    });
    fireEvent.scroll(window);

    expect(button.className).toContain("opacity-0");
  });

  it("becomes visible once scroll exceeds 100vh", () => {
    render(<ScrollToTopButton />);

    const button = screen.getByRole("button", { name: "Scroll to top" });

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 1001,
    });
    fireEvent.scroll(window);

    expect(button.className).toContain("opacity-100");
  });

  it("hides again when user scrolls back to threshold or below", () => {
    render(<ScrollToTopButton />);

    const button = screen.getByRole("button", { name: "Scroll to top" });

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 1001,
    });
    fireEvent.scroll(window);
    expect(button.className).toContain("opacity-100");

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 1000,
    });
    fireEvent.scroll(window);

    expect(button.className).toContain("opacity-0");
  });

  it("scrolls to top with smooth behavior by default", () => {
    render(<ScrollToTopButton />);

    fireEvent.click(screen.getByRole("button", { name: "Scroll to top" }));

    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("uses auto scroll behavior when reduced motion is preferred", () => {
    matchMediaMock.mockReturnValue({
      matches: true,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });

    render(<ScrollToTopButton />);

    fireEvent.click(screen.getByRole("button", { name: "Scroll to top" }));

    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
  });

  it("recalculates visibility threshold on resize", () => {
    render(<ScrollToTopButton />);

    const button = screen.getByRole("button", { name: "Scroll to top" });

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 1500,
    });

    fireEvent.scroll(window);
    expect(button.className).toContain("opacity-100");

    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      writable: true,
      value: 2000,
    });
    fireEvent(window, new Event("resize"));

    expect(button.className).toContain("opacity-0");
  });

  it("always keeps fade transition classes", () => {
    render(<ScrollToTopButton />);

    const button = screen.getByRole("button", { name: "Scroll to top" });

    expect(button.className).toContain("transition-opacity");
    expect(button.className).toContain("duration-200");
  });
});
