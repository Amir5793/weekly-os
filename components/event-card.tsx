import { PriorityBadge, PRIORITY_BAR } from "@/components/priority-badge";
import type { MazEvent } from "@/lib/data";

export function EventCard({ ev }: { ev: MazEvent }) {
  return (
    <article className="card flex gap-3 break-inside-avoid p-4">
      <span aria-hidden="true" className={`w-1.5 shrink-0 self-stretch rounded-full ${PRIORITY_BAR[ev.priority]}`} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold text-ink">{ev.subject}</h3>
          <PriorityBadge p={ev.priority} />
        </div>
        <p className="mt-1.5 text-sm text-faint">
          {ev.timeKind === "window" ? "بازهٔ مجاز شرکت" : "ساعت برگزاری"}:
          <span dir="ltr" className="mx-1.5 inline-block font-medium tabular-nums text-ink">{ev.time}</span>
          {ev.timeNote && <span className="text-xs">({ev.timeNote})</span>}
        </p>
        <p className="mt-2 text-sm leading-6 text-muted">{ev.execution}</p>
      </div>
    </article>
  );
}
