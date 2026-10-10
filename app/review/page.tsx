"use client";

import { Check, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { CHECKLIST, toFa } from "@/lib/data";

const KEY = "weekly-os:review";

export default function ReviewPage() {
  const [done, setDone] = useState<boolean[]>(() => CHECKLIST.map(() => false));
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved)) setDone(CHECKLIST.map((_, i) => Boolean(saved[i])));
      }
    } catch { /* noop */ }
  }, []);

  const persist = (next: boolean[]) => {
    setDone(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* noop */ }
  };

  const toggle = (i: number) => {
    setConfirming(false);
    persist(done.map((v, j) => (j === i ? !v : v)));
  };

  const reset = () => {
    persist(CHECKLIST.map(() => false));
    setConfirming(false);
  };

  const count = done.filter(Boolean).length;
  const all = count === CHECKLIST.length;

  return (
    <>
      <section className="mt-8">
        <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">بازبینی هفتگی</h1>
        <p className="mt-2 max-w-2xl text-muted">
          این چک‌لیست بازبینی اصول است، نه سهمیه‌بندی روتین؛ فقط بررسی می‌کند که چهار اصل در روتین همین هفته قابل اجرا شده‌اند.
        </p>
      </section>

      <section className="card mt-6 p-5" aria-label="چک‌لیست بازبینی">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-ink">پیشرفت: {toFa(count)} از {toFa(CHECKLIST.length)}</p>
          <div className="print:hidden">
            {confirming ? (
              <span className="flex flex-wrap items-center gap-2 text-sm text-ink">
                <span>همهٔ تیک‌ها پاک شود؟</span>
                <button type="button" onClick={reset} className="btn-danger focus-ring">بله، پاک شود</button>
                <button type="button" onClick={() => setConfirming(false)} className="btn-ghost focus-ring">لغو</button>
              </span>
            ) : (
              <button type="button" onClick={() => setConfirming(true)} className="btn-ghost focus-ring text-sm">
                <RotateCcw className="h-4 w-4" /> پاک‌کردن تیک‌ها
              </button>
            )}
          </div>
        </div>

        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-soft"
          role="progressbar"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-valuemax={CHECKLIST.length}
        >
          <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${(count / CHECKLIST.length) * 100}%` }} />
        </div>

        <ul className="mt-4 space-y-2">
          {CHECKLIST.map((item, i) => (
            <li key={i}>
              <button
                type="button"
                role="checkbox"
                aria-checked={done[i]}
                onClick={() => toggle(i)}
                className={`focus-ring flex min-h-11 w-full items-center gap-3 rounded-xl border p-3 text-start text-sm leading-6 transition-colors ${
                  done[i]
                    ? "border-accent bg-accent/10 text-ink"
                    : "border-hair bg-card text-ink hover:border-brand hover:bg-soft"
                }`}
              >
                <span aria-hidden="true" className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${done[i] ? "border-accent bg-accent text-white" : "border-hair"}`}>
                  {done[i] && <Check className="h-4 w-4" />}
                </span>
                <span className={done[i] ? "text-faint line-through" : ""}>{item}</span>
              </button>
            </li>
          ))}
        </ul>

        {all && (
          <p className="mt-4 rounded-xl border border-accent/30 bg-accentsoft p-3 text-sm font-medium text-ink">
            بازبینی این هفته کامل شد؛ چارچوب و روتین هماهنگ‌اند.
          </p>
        )}

        <p className="mt-4 text-xs leading-6 text-faint">
          تیک‌ها فقط در همین مرورگر ذخیره می‌شوند، با بارگذاری مجدد باقی می‌مانند و با فایل روتین همگام‌سازی نمی‌شوند.
        </p>
      </section>

      <p className="mt-4 text-sm text-muted">
        کارهای متغیر روز را جداگانه دنبال کن:{" "}
        <Link href="/daily" className="focus-ring rounded font-medium text-brand hover:underline">
          بازبینی روزانه ←
        </Link>
      </p>
    </>
  );
}
