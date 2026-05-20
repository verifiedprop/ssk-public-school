import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: string;
  trendUp?: boolean;
  color?: "blue" | "gold" | "green" | "red";
  "data-ocid"?: string;
}

const colorMap = {
  blue: "bg-primary/10 text-primary",
  gold: "bg-accent/20 text-foreground",
  green: "bg-green-100 text-green-700",
  red: "bg-destructive/10 text-destructive",
};

export function StatCard({
  icon: Icon,
  value,
  label,
  trend,
  trendUp,
  color = "blue",
  "data-ocid": dataOcid,
}: StatCardProps) {
  return (
    <div
      data-ocid={dataOcid}
      className="bg-card border border-border rounded-xl p-5 shadow-premium hover:shadow-hover transition-smooth"
    >
      <div className="flex items-start justify-between">
        <div
          className={`w-11 h-11 rounded-lg flex items-center justify-center ${colorMap[color]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              trendUp
                ? "bg-green-100 text-green-700"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      <div className="mt-3">
        <div className="text-2xl font-display font-bold text-foreground">
          {value}
        </div>
        <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
      </div>
    </div>
  );
}
