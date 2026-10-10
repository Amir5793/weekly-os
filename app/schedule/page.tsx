"use client";

import { BellRing, GraduationCap, MonitorPlay, RotateCcw, Search, StickyNote, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { DaySelector } from "@/components/day-selector";
import { EventCard } from "@/components/event-card";
import { useWeekMode } from "@/components/week-mode-context";
import { WeekModeToggle } from "@/components/week-mode-toggle";
import { APP, DAYS, emptyMazMessage, toFa, todayKey, visibleMaz, visibleNotes, type DayKey, type Priority } from "@/lib/data";

type Filter = "all" | Priority;
const FILTERS: Filter[] = ["all", "A", "B", "C", "A+"];

const norm = (s: string) => s.replace(/ي/g, "ی").replace(/ك/g, "ک").toLowerCase();

export default function SchedulePage() {
  const { mode } = useWeekMode();
  const [day, setDay] = useState<DayKey>("sat");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => { setDay(todayKey()); }, []);

  const d = DAYS.find(x => x.key === day)!;
  const events = visibleMaz(d, mode).filter(e => filter === "all" || e.priority === filter);
  const notes = visibleNotes(d.notes, mode);
  const reminders = visibleNotes(d.reminders, mode);

  const q = norm(query.trim());
  const searching = q.length > 0;

  const results = useMemo(() => {
    if (!searching) return [];
    return DAYS.map(dd => {
      const evs = visibleMaz(dd, mode).filter(e =>
        filter !== "all" && e.priority !== filter
          ? false
          : norm(`${e.subject} ${e.time} ${e.execution} ${dd.name}`).includes(q));
      const nts = visibleNotes(dd.notes, mode).filter(t => norm(`${t} ${dd.name}`).includes(q));
      return { day: dd, evs, nts };
    }).filter(r => r.evs.length > 0 || r.nts.length > 0);
  }, [q, mode, filter, searching]);

  const clear = () => { setQuery(""); setFilter("all"); };

  return (
    <>
      <section className="mt-8">
        <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">برنامهٔ هفتگی</h1>
        <p className="mt-2 max-w-2xl text-muted">
          یک روز را انتخاب کن؛ مدرسه، کلاس‌های ماز، یادداشت کامل روز و یادآورهای مرتبط نمایش داده می‌شود. {APP.routineNote}
        </p>
      </section>

      <div className="mt-6 grid gap-4 print:hidden">
        <WeekModeToggle />
        <DaySelector value={day} onChange={setDay} />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="جست‌وجو در درس، ساعت و متن نکات — در همهٔ روزها…"
              aria-label="جست‌وجو"
              className="focus-ring h-11 w-full rounded-xl border border-hair bg-card ps-10 pe-10 text-sm text-ink outline-none placeholder:text-faint"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="پاک‌کردن جست‌وجو"
                className="focus-ring absolute end-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-faint transition-colors hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div role="group" aria-label="فیلتر اولویت" className="flex flex-wrap gap-2">
            {FILTERS.map(f => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={`chip ${filter === f ? "chip-on" : ""}`}
              >
                {f === "all" ? "همه" : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {searching ? (
        <section className="mt-6" aria-label="نتایج جست‌وجو">
          <h2 className="text-sm font-semibold text-faint">
            نتایج برای «{query.trim()}» {filter !== "all" && <>· فیلتر اولویت {filter}</>}
          </h2>
          {results.length === 0 ? (
            <div className="card mt-3 border-dashed p-6 text-center">
              <p className="text-sm text-muted">
                نتیجه‌ای پیدا نشد. جست‌وجو شامل نام درس، ساعت و متن نکات اجرایی همهٔ روزهاست.
              </p>
              <button type="button" onClick={clear} className="btn focus-ring mt-3">
                <RotateCcw className="h-4 w-4" /> پاک کردن فیلتر
              </button>
            </div>
          ) : (
            results.map(r => (
              <div key={r.day.key} className="mt-4">
                <h3 className="mb-2 font-bold text-ink">{r.day.name}</h3>
                <div className="grid gap-3">
                  {r.evs.map(ev => <EventCard key={r.day.key + ev.subject} ev={ev} />)}
                  {r.nts.map((t, j) => (
                    <p key={j} className="card p-4 text-sm leading-7 text-muted">
                      <StickyNote className="me-2 inline h-4 w-4 text-brand" />{t}
                    </p>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>
      ) : (
        <>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <section aria-label={`مدرسهٔ ${d.name}`} className="card p-5">
              <h2 className="flex items-center gap-2 font-bold text-ink">
                <GraduationCap className="h-5 w-5 text-brand" /> مدرسه · {d.name}
              </h2>
              {d.school.length === 0 ? (
                <p className="mt-3 text-sm text-faint">مدرسه تعطیل است؛ این روز طبق روتین پر می‌شود.</p>
              ) : (
                <ol className="mt-3 divide-y divide-hair">
                  {d.school.map((s, i) => (
                    <li key={i} className="flex items-center gap-3 py-2.5 text-sm">
                      <span className="flex h-7 shrink-0 items-center justify-center rounded-lg bg-soft px-2 text-xs font-bold text-muted">
                        زنگ {toFa(i + 1)}
                      </span>
                      {s ?? <span className="text-faint">— (زنگ خالی)</span>}
                    </li>
                  ))}
                </ol>
              )}
            </section>

            <section aria-label={`کلاس‌های ماز ${d.name}`} className="card p-5">
              <h2 className="flex items-center gap-2 font-bold text-ink">
                <MonitorPlay className="h-5 w-5 text-brand" /> ماز · {d.name}
              </h2>
              {events.length === 0 ? (
                <div className="mt-3 text-sm text-faint">
                  <p>{emptyMazMessage(d, mode)}</p>
                  {d.maz.length > 0 && (
                    <button type="button" onClick={clear} className="btn-ghost focus-ring mt-3">
                      <RotateCcw className="h-4 w-4" /> پاک کردن فیلتر
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-3 grid gap-3">
                  {events.map(ev => <EventCard key={ev.subject} ev={ev} />)}
                </div>
              )}
            </section>
          </div>

          <section className="card mt-4 p-5" aria-label={`یادداشت ${d.name}`}>
            <h2 className="flex items-center gap-2 font-bold text-ink">
              <StickyNote className="h-5 w-5 text-brand" /> یادداشت {d.name}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-muted">
              {notes.map((n, i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  {n}
                </li>
              ))}
            </ul>
          </section>

          <section className="card mt-4 p-5" aria-label={`یادآورهای ${d.name}`}>
            <h2 className="flex items-center gap-2 font-bold text-ink">
              <BellRing className="h-5 w-5 text-brand" /> یادآورهای مرتبط
            </h2>
            <p className="mt-1 text-xs text-faint">
              یادآورها فقط مهلت‌ها را نشان می‌دهند؛ زمان دقیق هر کار در روتین تعیین می‌شود.
            </p>
            <ul className="mt-3 grid gap-2 text-sm leading-7">
              {reminders.map((r, i) => (
                <li key={i} className="rounded-xl border border-hair bg-soft px-3 py-2 text-ink">{r}</li>
              ))}
            </ul>
          </section>
        </>
      )}
    </>
  );
}
