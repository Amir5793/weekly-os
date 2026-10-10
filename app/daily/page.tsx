"use client";

import { Check, Pencil, Plus, RotateCcw, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { APP, DAYS, toFa, todayKey, type DayKey } from "@/lib/data";
import {
  DAY_ORDER, NOTE_MAX, TITLE_MAX, loadTasks, saveTasks, uid,
  type DailyTask, type StatusFilter,
} from "@/lib/daily";

const STATUSES: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "open", label: "انجام‌نشده" },
  { key: "done", label: "انجام‌شده" },
];

const dayName = (k: DayKey) => DAYS.find(d => d.key === k)?.name ?? k;

export default function DailyPage() {
  const [tasks, setTasks] = useState<DailyTask[] | null>(null);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [day, setDay] = useState<DayKey>("sat");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [dayFilter, setDayFilter] = useState<DayKey | "all">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ title: "", note: "", day: "sat" as DayKey });
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setTasks(loadTasks());
    setDay(todayKey());
  }, []);

  const commit = (next: DailyTask[]) => {
    setTasks(next);
    setError(saveTasks(next) ? "" : "ذخیرهٔ محلی ممکن نشد (حافظهٔ مرورگر در دسترس نیست).");
  };

  const add = () => {
    if (!tasks) return;
    const t = title.trim().slice(0, TITLE_MAX);
    if (!t) { setError("برای افزودن، عنوان بازبینی را بنویس."); return; }
    commit([
      ...tasks!,
      { id: uid(), title: t, day, note: note.trim().slice(0, NOTE_MAX), done: false, createdAt: Date.now() },
    ]);
    setTitle("");
    setNote("");
    setError("");
  };

  const toggle = (id: string) => {
    if (!tasks) return;
    commit(tasks.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const startEdit = (t: DailyTask) => {
    setConfirmId(null);
    setEditingId(t.id);
    setDraft({ title: t.title, note: t.note, day: t.day });
  };

  const saveEdit = () => {
    if (!tasks) return;
    const t = draft.title.trim().slice(0, TITLE_MAX);
    if (!t) { setError("عنوان نمی‌تواند خالی باشد."); return; }
    commit(tasks.map(x => (x.id === editingId
      ? { ...x, title: t, note: draft.note.trim().slice(0, NOTE_MAX), day: draft.day }
      : x)));
    setEditingId(null);
    setError("");
  };

  const remove = (id: string) => {
    if (!tasks) return;
    commit(tasks.filter(t => t.id !== id));
    setConfirmId(null);
  };

  const clearDone = () => {
    if (!tasks) return;
    commit(tasks.filter(t => !t.done));
    setConfirmClear(false);
  };

  const total = tasks?.length ?? 0;
  const doneCount = tasks?.filter(t => t.done).length ?? 0;

  const visible = useMemo(() => {
    if (!tasks) return [];
    return tasks.filter(t =>
      (status === "all" || (status === "open" ? !t.done : t.done)) &&
      (dayFilter === "all" || t.day === dayFilter));
  }, [tasks, status, dayFilter]);

  const groups = useMemo(
    () => DAY_ORDER
      .map(k => ({ key: k, items: visible.filter(t => t.day === k) }))
      .filter(g => g.items.length > 0),
    [visible]
  );

  return (
    <>
      <section className="mt-8">
        <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">بازبینی روزانه</h1>
        <p className="mt-2 max-w-2xl text-muted">
          کارهای متغیر روز را اینجا ثبت، ویرایش و تیک بزن. این فهرست جای روتین را نمی‌گیرد؛ فقط اجرای همان چارچوب را در روز پیگیری می‌کند و فقط در همین مرورگر ذخیره می‌شود.
        </p>
      </section>

      {/* ── افزودن ── */}
      <section className="card mt-6 p-5" aria-label="افزودن بازبینی روزانه">
        <h2 className="font-bold text-ink">بازبینی تازه</h2>
        <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") add(); }}
              maxLength={TITLE_MAX}
              placeholder="عنوان کار، مثلاً «مرور فیزیک شنبه»"
              aria-label="عنوان"
              className="focus-ring h-11 rounded-xl border border-hair bg-card px-3 text-sm text-ink outline-none placeholder:text-faint"
            />
            <input
              value={note}
              onChange={e => setNote(e.target.value)}
              maxLength={NOTE_MAX}
              placeholder="یادداشت (اختیاری)"
              aria-label="یادداشت"
              className="focus-ring h-11 rounded-xl border border-hair bg-card px-3 text-sm text-ink outline-none placeholder:text-faint"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={day}
              onChange={e => setDay(e.target.value as DayKey)}
              aria-label="روز"
              className="focus-ring h-11 rounded-xl border border-hair bg-card px-3 text-sm text-ink outline-none"
            >
              {DAYS.map(d => <option key={d.key} value={d.key}>{d.name}</option>)}
            </select>
            <button type="button" onClick={add} className="btn focus-ring">
              <Plus className="h-4 w-4" /> افزودن
            </button>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-faint">
          <span>ذخیره در localStorage · {APP.routineNote}</span>
          <span>{toFa(title.length)} از {toFa(TITLE_MAX)} نویسه</span>
        </div>
        {error && (
          <p role="alert" className="mt-2 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
        )}
      </section>

      {/* ── وضعیت و فیلتر ── */}
      <section className="card mt-4 p-5" aria-label="پیشرفت و فیلترها">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-ink">
            پیشرفت امروز/این هفته: {toFa(doneCount)} از {toFa(total)} انجام شده
          </p>
          <div className="print:hidden">
            {confirmClear ? (
              <span className="flex flex-wrap items-center gap-2 text-sm text-ink">
                <span>کارهای انجام‌شده پاک شود؟</span>
                <button type="button" onClick={clearDone} className="btn-danger focus-ring">بله، پاک شود</button>
                <button type="button" onClick={() => setConfirmClear(false)} className="btn-ghost focus-ring">لغو</button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                disabled={doneCount === 0}
                className="btn-ghost focus-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RotateCcw className="h-4 w-4" /> پاک کردن انجام‌شده‌ها
              </button>
            )}
          </div>
        </div>

        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-soft"
          role="progressbar"
          aria-valuenow={doneCount}
          aria-valuemin={0}
          aria-valuemax={Math.max(total, 1)}
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-300"
            style={{ width: `${total === 0 ? 0 : (doneCount / total) * 100}%` }}
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div role="group" aria-label="فیلتر وضعیت" className="flex flex-wrap gap-2">
            {STATUSES.map(s => (
              <button
                key={s.key}
                type="button"
                aria-pressed={status === s.key}
                onClick={() => setStatus(s.key)}
                className={`chip ${status === s.key ? "chip-on" : ""}`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <select
            value={dayFilter}
            onChange={e => setDayFilter(e.target.value as DayKey | "all")}
            aria-label="فیلتر روز"
            className="focus-ring h-11 rounded-xl border border-hair bg-card px-3 text-sm text-ink outline-none"
          >
            <option value="all">همهٔ روزها</option>
            {DAYS.map(d => <option key={d.key} value={d.key}>{d.name}</option>)}
          </select>
        </div>
      </section>

      {/* ── فهرست ── */}
      <section className="mt-4" aria-label="فهرست بازبینی روزانه">
        {tasks === null ? (
          <p className="card p-5 text-sm text-faint">در حال خواندن…</p>
        ) : tasks.length === 0 ? (
          <div className="card border-dashed p-6 text-center">
            <p className="text-sm text-muted">
              هنوز بازبینی روزانه‌ای ثبت نشده است. از فرم بالا اولین کار را اضافه کن؛ با شروع هفته، روتین همین‌جا پر می‌شود.
            </p>
          </div>
        ) : visible.length === 0 ? (
          <div className="card border-dashed p-6 text-center">
            <p className="text-sm text-muted">با این فیلتر، کاری در این روز نیست.</p>
            <button
              type="button"
              onClick={() => { setStatus("all"); setDayFilter("all"); }}
              className="btn focus-ring mt-3"
            >
              <RotateCcw className="h-4 w-4" /> پاک کردن فیلتر
            </button>
          </div>
        ) : (
          groups.map(g => (
            <div key={g.key} className="mb-5">
              <h2 className="mb-2 flex items-center gap-2 font-bold text-ink">
                <span className="rounded-lg bg-soft px-2 py-0.5 text-sm text-muted">{dayName(g.key)}</span>
                <span className="text-xs font-normal text-faint">{toFa(g.items.length)} مورد</span>
              </h2>
              <ul className="grid gap-2">
                {g.items.map(t => (
                  <li key={t.id}>
                    {editingId === t.id ? (
                      <div className="card p-4">
                        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                          <input
                            value={draft.title}
                            onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
                            maxLength={TITLE_MAX}
                            aria-label="عنوان ویرایش‌شده"
                            className="focus-ring h-11 rounded-xl border border-hair bg-card px-3 text-sm text-ink outline-none"
                          />
                          <input
                            value={draft.note}
                            onChange={e => setDraft(d => ({ ...d, note: e.target.value }))}
                            maxLength={NOTE_MAX}
                            aria-label="یادداشت ویرایش‌شده"
                            className="focus-ring h-11 rounded-xl border border-hair bg-card px-3 text-sm text-ink outline-none"
                          />
                          <div className="flex flex-wrap items-center gap-2">
                            <select
                              value={draft.day}
                              onChange={e => setDraft(d => ({ ...d, day: e.target.value as DayKey }))}
                              aria-label="روز ویرایش‌شده"
                              className="focus-ring h-11 rounded-xl border border-hair bg-card px-3 text-sm text-ink outline-none"
                            >
                              {DAYS.map(d => <option key={d.key} value={d.key}>{d.name}</option>)}
                            </select>
                            <button type="button" onClick={saveEdit} className="btn focus-ring">ذخیره</button>
                            <button type="button" onClick={() => setEditingId(null)} className="btn-ghost focus-ring">
                              <X className="h-4 w-4" /> انصراف
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : confirmId === t.id ? (
                      <div className="card flex flex-wrap items-center justify-between gap-3 border-danger/40 p-4">
                        <p className="text-sm text-ink">«{t.title}» حذف شود؟</p>
                        <span className="flex gap-2">
                          <button type="button" onClick={() => remove(t.id)} className="btn-danger focus-ring">بله، حذف شود</button>
                          <button type="button" onClick={() => setConfirmId(null)} className="btn-ghost focus-ring">لغو</button>
                        </span>
                      </div>
                    ) : (
                      <div className="card flex items-start gap-3 p-4">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={t.done}
                          onClick={() => toggle(t.id)}
                          aria-label={`علامت‌گذاری «${t.title}»`}
                          className={`focus-ring mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                            t.done ? "border-accent bg-accent text-white" : "border-hair bg-card"
                          }`}
                        >
                          {t.done && <Check className="h-4 w-4" />}
                        </button>

                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-semibold ${t.done ? "text-faint line-through" : "text-ink"}`}>
                            {t.title}
                          </p>
                          {t.note && <p className="mt-1 text-sm leading-6 text-muted">{t.note}</p>}
                        </div>

                        <span className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            onClick={() => startEdit(t)}
                            aria-label={`ویرایش «${t.title}»`}
                            title="ویرایش"
                            className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-faint transition-colors hover:bg-soft hover:text-ink"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => { setEditingId(null); setConfirmId(t.id); }}
                            aria-label={`حذف «${t.title}»`}
                            title="حذف"
                            className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-faint transition-colors hover:bg-danger/10 hover:text-danger"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </section>

      <p className="rounded-xl border border-hair bg-soft p-4 text-sm leading-7 text-muted">
        تیک‌ها و عنوان‌ها فقط در همین مرورگر ذخیره می‌شوند و با فایل روتین همگام‌سازی نمی‌شوند؛ حذف داده‌های مرورگر این فهرست را پاک می‌کند.
      </p>
    </>
  );
}
