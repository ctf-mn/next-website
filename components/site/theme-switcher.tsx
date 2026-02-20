"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ThemeOption = "system" | "light" | "dark";

const options: Array<{ value: ThemeOption; label: string; Icon: typeof Laptop }> = [
  { value: "system", label: "System", Icon: Laptop },
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const activeTheme: ThemeOption = theme === "light" || theme === "dark" ? theme : "system";
  const ActiveIcon = options.find((option) => option.value === activeTheme)?.Icon ?? Laptop;

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const openMenu = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpen(true);
  };

  const queueCloseMenu = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false);
      closeTimerRef.current = null;
    }, 140);
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onPointerEnter={openMenu}
      onPointerLeave={queueCloseMenu}
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-label="Theme"
        aria-haspopup="menu"
        aria-expanded={open}
        className="h-9 w-9 p-0"
        onClick={() => setOpen((value) => !value)}
        onFocus={openMenu}
      >
        <ActiveIcon className="h-4 w-4" aria-hidden />
      </Button>
      {open ? (
        <>
          <div
            aria-hidden
            className="pointer-events-auto absolute top-0 right-0 z-40 h-11 w-36 bg-transparent [clip-path:polygon(75%_0%,100%_0%,100%_100%,0%_100%)]"
          />
          <div
            role="menu"
            aria-label="Theme options"
            className="absolute right-0 z-50 mt-2 w-36 rounded-md border border-border bg-card p-1 shadow-lg"
          >
            {options.map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                role="menuitemradio"
                aria-checked={activeTheme === value}
                className={cn(
                  "flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm text-left",
                  "hover:bg-accent hover:text-accent-foreground",
                )}
                onClick={() => {
                  setTheme(value);
                  setOpen(false);
                }}
              >
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                </span>
                {activeTheme === value ? <Check className="h-4 w-4" aria-hidden /> : null}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
