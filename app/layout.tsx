import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { PwaRegister } from "@/components/pwa-register";
import { SiteNav } from "@/components/site-nav";
import { WeekModeProvider } from "@/components/week-mode-context";
import { APP } from "@/lib/data";

import "./globals.css";

export const metadata: Metadata = {
  title: { default: `${APP.name} | ${APP.latin}`, template: `%s | ${APP.name}` },
  description: "داشبورد شخصی چارچوب هفتگی — چارچوب ثابت؛ روتین متغیر.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: { capable: true, title: APP.name, statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f7f3" },
    { media: "(prefers-color-scheme: dark)", color: "#04070e" },
  ],
};

const themeInit = `(function(){try{var t=localStorage.getItem("weekly-os:theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark")}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" />
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-dvh bg-page font-sans text-ink antialiased">
        <WeekModeProvider>
          <SiteNav />
          <main className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6">{children}</main>
          <footer className="print:hidden border-t border-hair py-6 text-center text-xs text-faint">
            {APP.name} · نسخهٔ {APP.version} — {APP.routineNote}
          </footer>
          <PwaRegister />
        </WeekModeProvider>
      </body>
    </html>
  );
}
