"use client";

import { useWeekMode } from "@/components/week-mode-context";
import type { WeekMode } from "@/lib/data";

const OPTS: { key: WeekMode; label: string }[] = [
  { key: "exam", label: "هفتهٔ آزمون" },
  { key: "regular", label: "هفتهٔ بدون آزمون" },
];

export function WeekModeToggle() {
  const { mode, setMode } = useWeekMode();

  return (
    <div>
      <div role="group" aria-label="حالت نمایش چرخهٔ آزمون" className="inline-flex rounded-xl border border-hair bg-card p-1 shadow-card">
        {OPTS.map(o => (
          <button
            key={o.key}
            type="button"
            aria-pressed={mode === o.key}
            onClick={() => setMode(o.key)}
            className={`focus-ring min-h-11 rounded-lg px-4 text-sm font-medium transition-colors ${
              mode === o.key
                ? "bg-accent text-white"
                : "text-muted hover:text-ink"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-faint">
        این کنترل فقط حالت نمایشی است و نمی‌گوید الان کدام هفته را می‌گذرانی.
      </p>
    </div>
  );
}
