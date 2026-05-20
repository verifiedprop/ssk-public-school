import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "gold" | "ghost";
type Size = "sm" | "md" | "lg";

interface SchoolButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  asChild?: boolean;
  href?: string;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-90 shadow-xs hover:shadow-premium",
  secondary: "bg-secondary text-secondary-foreground hover:opacity-90",
  outline:
    "border border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground",
  gold: "bg-accent text-foreground hover:opacity-90 shadow-xs hover:shadow-premium font-semibold",
  ghost: "bg-transparent text-foreground hover:bg-primary/8",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-5 py-2.5 text-sm rounded-lg",
  lg: "px-7 py-3.5 text-base rounded-lg",
};

export function SchoolButton({
  variant = "primary",
  size = "md",
  className = "",
  href,
  children,
  ...props
}: SchoolButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none";
  const classes = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
