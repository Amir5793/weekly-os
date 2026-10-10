// ─────────────────────────────────────────────
//  بازبینی روزانه — مدل داده و ذخیرهٔ محلی
//  فقط ذخیره‌سازی در همین مرورگر (localStorage).
// ─────────────────────────────────────────────

import type { DayKey } from "@/lib/data";

export const DAILY_KEY = "weekly-os:daily";
export const TITLE_MAX = 120;
export const NOTE_MAX = 280;

export interface DailyTask {
  id: string;
  title: string;
  day: DayKey;
  note: string;
  done: boolean;
  createdAt: number;
}

export type StatusFilter = "all" | "open" | "done";

export const DAY_ORDER: DayKey[] = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"];

export const uid = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const isDayKey = (v: unknown): v is DayKey =>
  typeof v === "string" && (DAY_ORDER as string[]).includes(v);

const clean = (v: unknown, max: number): string =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

function normalize(v: unknown): DailyTask | null {
  if (typeof v !== "object" || v === null) return null;
  const o = v as Record<string, unknown>;
  const title = clean(o.title, TITLE_MAX);
  if (!title) return null;
  return {
    id: typeof o.id === "string" && o.id ? o.id : uid(),
    title,
    day: isDayKey(o.day) ? o.day : "sat",
    note: clean(o.note, NOTE_MAX),
    done: o.done === true,
    createdAt: typeof o.createdAt === "number" ? o.createdAt : Date.now(),
  };
}

export function loadTasks(): DailyTask[] {
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(normalize)
      .filter((t): t is DailyTask => t !== null)
      .sort((a, b) => a.createdAt - b.createdAt);
  } catch {
    return [];
  }
}

export function saveTasks(tasks: DailyTask[]): boolean {
  try {
    localStorage.setItem(DAILY_KEY, JSON.stringify(tasks));
    return true;
  } catch {
    return false;
  }
}
