"use client";

import { useTheme } from "next-themes";

import { NativeSelect } from "@/components/ui/select";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <NativeSelect
      aria-label="Theme"
      className="h-9 w-28 text-sm"
      suppressHydrationWarning
      onChange={(event) => setTheme(event.target.value)}
      value={theme ?? "system"}
    >
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </NativeSelect>
  );
}
