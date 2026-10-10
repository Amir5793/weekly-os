"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { WeekMode } from "@/lib/data";

const Ctx = createContext<{ mode: WeekMode; setMode: (m: WeekMode) => void }>({
  mode: "exam",
  setMode: () => { /* noop */ },
});

export function WeekModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<WeekMode>("exam");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("weekly-os:week-mode");
      if (saved === "exam" || saved === "regular") setMode(saved);
    } catch { /* noop */ }
  }, []);

  const change = (m: WeekMode) => {
    setMode(m);
    try { localStorage.setItem("weekly-os:week-mode", m); } catch { /* noop */ }
  };

  return <Ctx.Provider value={{ mode, setMode: change }}>{children}</Ctx.Provider>;
}

export const useWeekMode = () => useContext(Ctx);
