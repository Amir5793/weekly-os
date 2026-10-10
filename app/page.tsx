"use client";

import { ArrowLeft, BedDouble, ChevronDown, ClipboardCheck, FileSearch, Timer, Video } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

import { DaySelector } from "@/components/day-selector";
import { EventCard } from "@/components/event-card";
import { useWeekMode } from "@/components/week-mode-context";
import { WeekModeToggle } from "@/components/week-mode-toggle";
import { APP, DAYS, RULES, emptyMazMessage, toFa, todayKey, visibleMaz, type DayKey } from "@/lib/data";

const ALL = DAYS.flatMap(d => d.maz);
const COUNT = (p: string) => ALL.filter(e => e.priority === p).length;

function Card({ icon, title, value, note }: { icon: ReactNode; title: string; value: ReactNode; note: string }) {
  return (
    <div className="card break-inside-avoid p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted">
        <span className="text-brand">{icon}</span><span>{title}</span>
      </div>
      <p className="mt-2 text-lg font-bold text-ink">{value}</p>
      <p className="mt-2 text-sm leading-6 text-faint">{note}</p>
    </div>
  );
}

export default function OverviewPage() {
  const { mode } = useWeekMode();
  const [day, setDay] = useState<DayKey>("sat");

  useEffect(() => { setDay(todayKey()); }, []);
  useEffect(() => {
    const openAll = () => document.querySelectorAll("details").forEach(el => { (el as HTMLDetailsElement).open = true; });
    window.addEventListener("beforeprint", openAll);
    return () => window.removeEventListener("beforeprint", openAll);
  }, []);

  const d = DAYS.find(x => x.key === day)!;
  const events = visibleMaz(d, mode);

  return (
    <>
      <section className="mt-8 sm:mt-12">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-hair bg-card px-3 py-1 text-xs text-muted shadow-card">
            نسخهٔ {APP.version} · {APP.date}
          </span>
          <span className="rounded-full border border-accent/30 bg-accentsoft px-3 py-1 text-xs font-medium text-ink">
            {APP.tagline}
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {APP.name} <span className="font-bold text-faint">| {APP.latin}</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted">{APP.subtitle}</p>
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-faint">
          <span>{toFa(COUNT("A"))} کلاس A (زنده)</span>
          <span>{toFa(COUNT("B"))} کلاس B (ضبط)</span>
          <span>{toFa(COUNT("C"))} کلاس C (اختیاری)</span>
          <span>آزمون A+ (یک هفته در میان)</span>
        </p>
      </section>

      <section className="mt-10 print:hidden" aria-labelledby="week-mode-h">
        <h2 id="week-mode-h" className="text-lg font-bold text-ink">چرخهٔ آزمون</h2>
        <div className="mt-3"><WeekModeToggle /></div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2" aria-label="خلاصهٔ چارچوب">
        <Card
          icon={<BedDouble className="h-4 w-4" />}
          title="خواب"
          value={<span dir="ltr" className="tabular-nums">{APP.sleep}</span>}
          note={APP.sleepNote}
        />
        {mode === "exam" ? (
          <Card
            icon={<ClipboardCheck className="h-4 w-4" />}
            title="آزمون ماز · A+"
            value="یک هفته در میان"
            note="بازهٔ شرکت 08:00 تا 15:00 · مدت خود آزمون ۳ ساعت. اولویت A+ به معنی حذف خواب یا آزمون هفت‌ساعته نیست."
          />
        ) : (
          <Card
            icon={<FileSearch className="h-4 w-4" />}
            title="تحلیل شنبه"
            value="هفتهٔ بدون آزمون"
            note="منبع تحلیل شنبه را در فایل روتین همین هفته مشخص کن؛ مثلاً آزمون معلم یا آزمون خودساخته از دفتر خطا."
          />
        )}
        <Card
          icon={<Timer className="h-4 w-4" />}
          title="قاعدهٔ A"
          value="زنده و سرِ وقت"
          note="در اضطرار، بررسی با سرعت حداکثر 1.25. مرور هر کلاس A حداکثر تا ۴۸ ساعت پس از پایان کلاس؛ زمان مرور در روتین تعیین می‌شود."
        />
        <Card
          icon={<Video className="h-4 w-4" />}
          title="قاعدهٔ B"
          value="ضبط تا جلسهٔ بعدی"
          note="پخش اصلی برگزار می‌شود؛ ضبط با سرعت 1.5 تا 3 و پیش از جلسهٔ بعدی همان درس دیده می‌شود. زمان دقیق در روتین."
        />
      </section>

      <section className="mt-10" aria-labelledby="day-h">
        <div className="flex items-baseline justify-between gap-2">
          <h2 id="day-h" className="text-lg font-bold text-ink">روز را انتخاب کن</h2>
          <Link href="/schedule" className="focus-ring inline-flex min-h-11 items-center gap-1 rounded-lg text-sm font-medium text-brand hover:underline">
            برنامهٔ کامل روزها <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-3 print:hidden"><DaySelector value={day} onChange={setDay} /></div>
        <h3 className="mt-6 text-sm font-semibold text-faint">اولویت‌های {d.name}</h3>
        <div className="mt-3 grid gap-3">
          {events.length > 0 ? (
            events.map(ev => <EventCard key={ev.day + ev.subject} ev={ev} />)
          ) : (
            <p className="rounded-xl border border-dashed border-hair bg-card/60 p-4 text-sm text-faint">
              {emptyMazMessage(d, mode)}
            </p>
          )}
        </div>
      </section>

      <section className="mt-10" aria-labelledby="rules-h">
        <h2 id="rules-h" className="text-lg font-bold text-ink">قواعدی که نباید فراموش شوند</h2>
        <div className="mt-3 grid gap-3">
          {RULES.map((r, i) => (
            <details key={r.n} open={i === 0} className="card group break-inside-avoid">
              <summary className="focus-ring flex min-h-11 cursor-pointer list-none items-center gap-3 rounded-2xl px-4 py-3 font-semibold text-ink">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm text-white">{r.n}</span>
                <span className="flex-1">{r.title}</span>
                <span className="hidden font-normal text-faint sm:block">{r.short}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-faint transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-hair px-4 py-3 text-sm leading-7 text-muted">
                {r.body.map((p, j) => <p key={j} className="mt-2 first:mt-0">{p}</p>)}
                {r.steps && (
                  <ol className="mt-3 list-decimal space-y-1 pr-5">
                    {r.steps.map((s, j) => <li key={j}>{s}</li>)}
                  </ol>
                )}
                {r.tail && <p className="mt-2">{r.tail}</p>}
              </div>
            </details>
          ))}
        </div>
      </section>

      <p className="mt-10 rounded-xl border border-hair bg-soft p-4 text-sm leading-7 text-muted">
        {APP.routineNote} — این داشبورد چیزی به چارچوب اضافه یا کم نمی‌کند.
      </p>
    </>
  );
}
