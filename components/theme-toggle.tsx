"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("weekly-os:theme", next ? "dark" : "light"); } catch { /* noop */ }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "فعال‌کردن تم روشن" : "فعال‌کردن تم تیره"}
      title="تغییر تم"
      className="focus-ring flex h-11 w-11 items-center justify-center rounded-xl border border-hair bg-card text-muted transition-colors hover:text-ink"
    >
      {dark === null ? null : dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
