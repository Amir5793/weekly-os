"use client";

import { CalendarDays, Printer, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/theme-toggle";
import { APP } from "@/lib/data";

/** آدرس همراه (مولد روتین) — با NEXT_PUBLIC_COMPANION_URL قابل بازتعریف است. */
const COMPANION_URL = process.env.NEXT_PUBLIC_COMPANION_URL ?? "https://amir5793.github.io/Routine-Generator/";

const LINKS = [
  { href: "/", label: "نمای کلی" },
  { href: "/schedule", label: "برنامهٔ هفتگی" },
  { href: "/rules", label: "قواعد اجرا" },
  { href: "/priorities", label: "راهنمای اولویت‌ها" },
  { href: "/review", label: "بازبینی هفتگی" },
  { href: "/daily", label: "بازبینی روزانه" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-hair bg-page/85 backdrop-blur print:hidden">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 sm:px-6">
        <Link href="/" aria-label={APP.name} className="focus-ring flex h-14 items-center gap-2 rounded-xl font-extrabold">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white shadow-card">
            <CalendarDays className="h-5 w-5" />
          </span>
          <span className="hidden text-ink sm:block">{APP.name}</span>
        </Link>

        <nav aria-label="ناوبری اصلی" className="min-w-0 flex-1 overflow-x-auto py-2">
          <ul className="flex items-center gap-1">
            {LINKS.map(l => {
              const active = pathname === l.href;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`focus-ring flex h-11 items-center whitespace-nowrap rounded-lg px-3 text-sm font-medium transition-colors ${
                      active
                        ? "bg-accent text-white"
                        : "text-muted hover:bg-soft hover:text-ink"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <Link
          href={COMPANION_URL}
          aria-label="رفتن به مولد روتین"
          title="رفتن به مولد روتین"
          className="focus-ring flex h-11 items-center gap-2 whitespace-nowrap rounded-xl border border-hair bg-card px-3 text-sm font-medium text-muted transition-colors hover:text-ink"
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden md:inline">رفتن به مولد روتین</span>
        </Link>
        <Link
          href="/print"
          aria-label="نسخهٔ چاپی / PDF"
          title="نسخهٔ چاپی / PDF"
          className="focus-ring flex h-11 w-11 items-center justify-center rounded-xl border border-hair bg-card text-muted transition-colors hover:text-ink"
        >
          <Printer className="h-5 w-5" />
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
