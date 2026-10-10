import { AlertTriangle } from "lucide-react";
import Link from "next/link";

import { RULES, SUPPLEMENTARY } from "@/lib/data";

export const metadata = { title: "قواعد اجرا" };

export default function RulesPage() {
  return (
    <>
      <section className="mt-8">
        <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">قواعد اجرا</h1>
        <p className="mt-2 max-w-2xl text-muted">
          چهار اصل اجرایی چارچوب، با متن کامل. این قواعد ثابت‌اند؛ زمان و حجم اجرایشان در فایل روتین جای‌گذاری می‌شود.
        </p>
      </section>

      <div className="mt-6 grid gap-4">
        {RULES.map(r => (
          <section key={r.n} className="card break-inside-avoid p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent font-bold text-white">{r.n}</span>
              <div>
                <h2 className="font-bold text-ink">{r.title}</h2>
                <p className="text-xs text-faint">{r.short}</p>
              </div>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-7 text-muted">
              {r.body.map((p, j) => <p key={j}>{p}</p>)}
              {r.steps && (
                <ol className="list-decimal space-y-2 rounded-xl border border-hair bg-soft p-4 text-ink">
                  {r.steps.map((s, j) => <li key={j}>{s}</li>)}
                </ol>
              )}
              {r.tail && (
                <p className="rounded-xl border border-hair bg-soft p-3 text-ink">
                  <AlertTriangle className="me-2 inline h-4 w-4 text-pb" />{r.tail}
                </p>
              )}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-ink">قواعد تکمیلی ثابت</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {SUPPLEMENTARY.map(s => (
            <div key={s.title} className="card break-inside-avoid p-4">
              <h3 className="text-sm font-bold text-ink">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="card mt-8 p-5 text-sm text-muted">
        <p>هر هفته، پیش از شروع، این چهار اصل را در روتین همان هفته بررسی کن.</p>
        <Link href="/review" className="focus-ring mt-2 inline-flex min-h-11 items-center rounded-lg font-medium text-brand hover:underline">
          رفتن به بازبینی هفتگی ←
        </Link>
      </div>
    </>
  );
}
