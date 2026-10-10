import type { ReactNode } from "react";

import { PrintButton } from "@/components/print-button";
import { APP, CHECKLIST, DAYS, PRIORITIES, RULES, SUPPLEMENTARY, toFa, type Priority } from "@/lib/data";

export const metadata = { title: "نسخهٔ چاپی" };

const SCHOOL_DAYS = DAYS.filter(d => d.school.length > 0);
const TD = "border border-stone-300 p-2 align-top";
const PRIORITY_ORDER: Priority[] = ["A+", "A", "B", "C"];

function Section({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className="mt-8 break-inside-avoid-page">
      <h2 className="mb-3 border-b border-stone-300 pb-1 text-base font-extrabold">
        <span className="me-2 inline-block rounded bg-stone-900 px-2 py-0.5 text-sm text-white">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function PrintPage() {
  return (
    <div className="mt-6">
      <div className="no-print card mb-4 flex flex-wrap items-center justify-between gap-3 p-4 text-sm text-muted">
        <p>برای ساختن PDF: دکمه را بزن و «Save as PDF / ذخیره به‌صورت PDF» را انتخاب کن.</p>
        <PrintButton />
      </div>

      <article className="rounded-2xl bg-white p-6 text-stone-900 shadow-sm sm:p-10">
        <header className="border-b-2 border-stone-900 pb-4">
          <h1 className="text-2xl font-extrabold">چارچوب هفتگی | Weekly OS</h1>
          <p className="mt-2 text-sm text-stone-600">نسخهٔ {APP.version} · {APP.date} · {APP.tagline}</p>
          <p className="mt-1 text-xs text-stone-500">{APP.routineNote}</p>
        </header>

        <Section n="۱" title="برنامهٔ هفتگی مدرسه">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={`${TD} bg-stone-100`}>زنگ</th>
                  {SCHOOL_DAYS.map(d => <th key={d.key} className={`${TD} bg-stone-100`}>{d.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {[0, 1, 2, 3].map(i => (
                  <tr key={i}>
                    <td className={`${TD} text-center font-bold`}>{toFa(i + 1)}</td>
                    {SCHOOL_DAYS.map(d => <td key={d.key} className={TD}>{d.school[i] ?? "—"}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-stone-500">پنجشنبه و جمعه مدرسه تعطیل است.</p>
        </Section>

        <Section n="۲" title="برنامهٔ هفتگی ماز">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={`${TD} bg-stone-100`}>روز</th>
                  <th className={`${TD} bg-stone-100`}>کلاس</th>
                  <th className={`${TD} bg-stone-100`}>ساعت برگزاری</th>
                  <th className={`${TD} bg-stone-100`}>اولویت</th>
                </tr>
              </thead>
              <tbody>
                {DAYS.map(d => d.maz.map(e => (
                  <tr key={d.key + e.subject} className="break-inside-avoid">
                    <td className={TD}>{d.name}</td>
                    <td className={`${TD} font-medium`}>{e.subject}</td>
                    <td className={TD}>
                      <span dir="ltr" className="tabular-nums">{e.time}</span>
                      {e.timeNote && <span className="text-xs text-stone-500"> · {e.timeNote}</span>}
                    </td>
                    <td className={`${TD} font-bold`}><span dir="ltr">{e.priority}</span></td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs leading-6 text-stone-600">
            مهلت ضبط‌های B: هر ضبط پیش از جلسهٔ بعدی همان درس دیده می‌شود؛ در چرخهٔ معمول، زمین و عربی تا پیش از یکشنبهٔ بعد و آمار تا پیش از سه‌شنبهٔ بعد. شیوهٔ اجرا: A زنده و سرِ وقت (اضطرار: حداکثر 1.25) · B ضبط با سرعت 1.5 تا 3 · C اختیاری · A+ آزمون ماز.
          </p>
        </Section>

        <Section n="۳" title="اولویت‌ها و معنی آن‌ها">
          <div className="grid gap-2 sm:grid-cols-2">
            {PRIORITY_ORDER.map(p => (
              <div key={p} className="break-inside-avoid rounded-lg border border-stone-300 p-3 text-sm">
                <p className="font-bold"><span dir="ltr">{p}</span> — {PRIORITIES[p].title}</p>
                <p className="mt-1 leading-6 text-stone-600">{PRIORITIES[p].body.join(" ")}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section n="۴" title="برنامهٔ روزها">
          {DAYS.map(d => (
            <div key={d.key} className="mb-3 break-inside-avoid">
              <h3 className="text-sm font-bold">{d.name}</h3>
              <ul className="mt-1 list-disc space-y-1 pr-5 text-sm leading-7 text-stone-700">
                {d.notes.map((n, i) => <li key={i}>{n.text}</li>)}
              </ul>
            </div>
          ))}
        </Section>

        <Section n="۵" title="چهار اصل اجرایی">
          {RULES.map(r => (
            <div key={r.n} className="mb-3 break-inside-avoid text-sm leading-7">
              <h3 className="font-bold">اصل {r.n} — {r.title}</h3>
              {r.body.map((p, j) => <p key={j} className="text-stone-700">{p}</p>)}
              {r.steps && (
                <ol className="list-decimal pr-5 text-stone-700">
                  {r.steps.map((s, j) => <li key={j}>{s}</li>)}
                </ol>
              )}
              {r.tail && <p className="text-stone-700">{r.tail}</p>}
            </div>
          ))}
        </Section>

        <Section n="۶" title="قواعد تکمیلی ثابت">
          <ul className="list-disc space-y-1 pr-5 text-sm leading-7 text-stone-700">
            {SUPPLEMENTARY.map(s => <li key={s.title}><b>{s.title}:</b> {s.text}</li>)}
          </ul>
        </Section>

        <Section n="۷" title="چک‌لیست بازبینی هفتگی">
          <ul className="space-y-1 text-sm">
            {CHECKLIST.map((c, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden="true" className="mt-1 inline-block h-4 w-4 shrink-0 rounded border border-stone-500" />
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-stone-500">
            این چک‌لیست جای روتین را نمی‌گیرد؛ فقط بررسی می‌کند که چهار اصل در روتین همین هفته قابل اجرا شده‌اند.
          </p>
        </Section>

        <footer className="mt-6 border-t border-stone-300 pt-3 text-xs leading-6 text-stone-500">
          چارچوب ثابت؛ روتین متغیر — سهمیهٔ تست، شرط‌های لازم و کافی و زمان دقیق کارهای متغیر در فایل روتین تعیین می‌شوند. منبع: Weekly_برنامه_فعلی_v2.md
        </footer>
      </article>
    </div>
  );
}
