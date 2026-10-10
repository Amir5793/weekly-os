import { Ban } from "lucide-react";

import { PRIORITY_BAR, PriorityBadge } from "@/components/priority-badge";
import { PRIORITIES, SCOPE_LIMITS, type Priority } from "@/lib/data";

export const metadata = { title: "راهنمای اولویت‌ها" };

const ORDER: Priority[] = ["A+", "A", "B", "C"];

export default function PrioritiesPage() {
  return (
    <>
      <section className="mt-8">
        <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">راهنمای اولویت‌ها</h1>
        <p className="mt-2 max-w-2xl text-muted">
          معنی دقیق A، B، C و A+؛ سرعت‌های مجاز و مهلت ضبط‌ها. رنگ نشان‌ها همیشه همراه برچسب متنی است.
        </p>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {ORDER.map(p => {
          const info = PRIORITIES[p];
          return (
            <section key={p} className="card break-inside-avoid p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-bold text-ink"><span dir="ltr">{p}</span> · {info.title}</h2>
                <PriorityBadge p={p} />
              </div>
              <span aria-hidden="true" className={`mt-4 block h-1.5 w-14 rounded-full ${PRIORITY_BAR[p]}`} />
              <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
                {info.body.map((b, j) => <li key={j}>{b}</li>)}
              </ul>
              <p className="mt-4 inline-flex rounded-lg border border-hair bg-soft px-2.5 py-1 text-xs font-medium text-ink">{info.speed}</p>
            </section>
          );
        })}
      </div>

      <section className="mt-8 rounded-2xl border border-danger/30 bg-danger/5 p-5">
        <h2 className="font-bold text-danger">مرزهای این داشبورد</h2>
        <p className="mt-1 text-sm text-muted">
          این رابط فقط لایهٔ نمایش و پیگیری چارچوب است، نه موتور زمان‌بندی؛ این موارد هرگز به‌صورت خودکار ساخته یا تغییر داده نمی‌شوند:
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-7 text-ink">
          {SCOPE_LIMITS.map((s, i) => (
            <li key={i} className="flex gap-2"><Ban className="mt-1.5 h-4 w-4 shrink-0 text-danger" />{s}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
