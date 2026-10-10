import type { Priority } from "@/lib/data";

export const PRIORITY_BAR: Record<Priority, string> = {
  A: "bg-pa",
  B: "bg-pb",
  C: "bg-pc",
  "A+": "bg-pp",
};

const BADGE: Record<Priority, string> = {
  A: "border-pa/40 bg-pa/10 text-pa",
  B: "border-pb/40 bg-pb/10 text-pb",
  C: "border-pc/40 bg-pc/10 text-pc",
  "A+": "border-pp/40 bg-pp/10 text-pp",
};

const LABEL: Record<Priority, string> = {
  A: "زنده و ضروری",
  B: "ضبط تا جلسهٔ بعدی",
  C: "اختیاری",
  "A+": "آزمون ماز",
};

export function PriorityBadge({ p }: { p: Priority }) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${BADGE[p]}`}>
      <b dir="ltr" aria-hidden="true" className="font-extrabold">{p}</b>
      <span aria-hidden="true" className="h-3 w-px bg-current opacity-40" />
      {LABEL[p]}
    </span>
  );
}
