import { cn } from "@/lib/utils";

interface PatelaLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "light" | "dark";
  className?: string;
}

const sizeClasses = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-5xl",
};

export function PatelaLogo({ size = "md", variant = "dark", className }: PatelaLogoProps) {
  return (
    <span
      className={cn(
        "font-bold tracking-tight",
        sizeClasses[size],
        variant === "light" ? "text-primary-foreground" : "text-primary",
        className
      )}
    >
      patela<span className="text-accent">.</span>
    </span>
  );
}