import type { ReactNode } from "react";

interface SchoolCardProps {
  children: ReactNode;
  className?: string;
  highlighted?: boolean;
  hoverable?: boolean;
  "data-ocid"?: string;
}

export function SchoolCard({
  children,
  className = "",
  highlighted = false,
  hoverable = true,
  "data-ocid": dataOcid,
}: SchoolCardProps) {
  return (
    <div
      data-ocid={dataOcid}
      className={`bg-card border border-border rounded-xl p-6 ${
        highlighted ? "border-l-4 border-l-primary" : ""
      } ${
        hoverable
          ? "shadow-premium hover:shadow-hover hover:-translate-y-1 transition-smooth"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
