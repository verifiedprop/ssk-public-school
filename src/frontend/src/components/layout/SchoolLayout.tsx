import type { ReactNode } from "react";
import { SchoolFooter } from "./SchoolFooter";
import { SchoolHeader } from "./SchoolHeader";

interface SchoolLayoutProps {
  children: ReactNode;
}

export function SchoolLayout({ children }: SchoolLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SchoolHeader />
      <main className="flex-1">{children}</main>
      <SchoolFooter />
    </div>
  );
}
