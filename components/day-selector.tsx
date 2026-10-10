"use client";

import { useEffect, useState } from "react";

import { useWeekMode } from "@/components/week-mode-context";
import { DAYS, toFa, todayKey, visibleMaz, type DayKey } from "@/lib/data";

export function DaySelector({ value, onChange }: { value: DayKey; onChange: (d: DayKey) => void }) {
  const { mode } = useWeekMode();
  const [today, setToday] = useState<DayKey | null>(null);

  useEffect(() => { setToday(todayKey()); }, []);

  return (
    <div role="group" aria-label="انتخاب روز هفته" className="grid grid-cols-4 gap-2 sm:grid-cols-7">
      {DAYS.map(d => {
        const selected = d.key === value;
        const n = visibleMaz(d, mode).length;
        const meta =
          d.key === "fri" ? (mode === "exam" ? "آزمون A+" : "استراحت")
          : d.key === "thu" ? "تمرین و مرور"
          : n > 0 ? `${toFa(n)} کلاس ماز`
          : "بدون کلاس";

        return (
          <button
            key={d.key}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(d.key)}
            className={`focus-ring flex min-h-11 flex-col items-center justify-center rounded-xl border px-2 py-2 text-sm transition-colors ${
              selected
                ? "border-accent bg-accent text-white shadow-card"
                : "border-hair bg-card text-ink hover:border-brand hover:bg-soft"
            }`}
          >
            <span className="font-semibold">
              {d.name}
              {today === d.key && <span className="ms-1.5 text-[10px] font-normal opacity-70">(امروز)</span>}
            </span>
            <span className={`mt-0.5 text-[11px] ${selected ? "text-white/85" : "text-faint"}`}>{meta}</span>
          </button>
        );
      })}
    </div>
  );
}
