"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="btn focus-ring">
      <Printer className="h-4 w-4" />
      چاپ / ذخیرهٔ PDF
    </button>
  );
}
