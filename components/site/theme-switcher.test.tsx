import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ThemeSwitcher } from "@/components/site/theme-switcher";

const setTheme = vi.fn();

let theme = "system";

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme, setTheme }),
}));

afterEach(() => {
  setTheme.mockClear();
});

function getRootNode() {
  const trigger = screen.getByRole("button", { name: "Theme" });
  return trigger.closest("div")!;
}

function getTrigger() {
  return screen.getByRole("button", { name: "Theme" });
}

describe("ThemeSwitcher", () => {
  it("opens menu on mouse hover", () => {
    theme = "system";
    render(<ThemeSwitcher />);
    const root = getRootNode();

    fireEvent.pointerEnter(root, { pointerType: "mouse" });

    expect(screen.getByRole("menu")).toBeTruthy();
  });

  it("closes menu on mouse leave", () => {
    theme = "system";
    render(<ThemeSwitcher />);
    const root = getRootNode();

    fireEvent.pointerEnter(root, { pointerType: "mouse" });
    fireEvent.pointerLeave(root, { pointerType: "mouse" });

    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("still toggles with click", () => {
    theme = "system";
    render(<ThemeSwitcher />);
    const trigger = getTrigger();

    fireEvent.click(trigger);
    expect(screen.getByRole("menu")).toBeTruthy();

    fireEvent.click(trigger);
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("does not open on touch pointer enter", () => {
    theme = "system";
    render(<ThemeSwitcher />);
    const root = getRootNode();

    fireEvent.pointerEnter(root, { pointerType: "touch" });

    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("sets theme and closes on option click", () => {
    theme = "system";
    render(<ThemeSwitcher />);
    const trigger = getTrigger();

    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("menuitemradio", { name: "Dark" }));

    expect(setTheme).toHaveBeenCalledWith("dark");
    expect(screen.queryByRole("menu")).toBeNull();
  });
});
