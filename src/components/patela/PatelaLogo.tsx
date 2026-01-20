import { cn } from "@/lib/utils";

interface PatelaLogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  variant?: "light" | "dark" | "icon";
  className?: string;
}

// Larger, more prominent sizes for fintech branding
const sizeClasses = {
  sm: "text-2xl",
  md: "text-3xl",
  lg: "text-5xl",
  xl: "text-6xl",
  "2xl": "text-7xl",
};

const iconSizeClasses = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-5xl",
  "2xl": "text-6xl",
};

export function PatelaLogo({ 
  size = "md", 
  variant = "dark", 
  className
}: PatelaLogoProps) {
  // Icon variant - show just "p." with brand colors
  if (variant === "icon") {
    return (
      <span
        className={cn(
          "font-extrabold tracking-tight",
          iconSizeClasses[size],
          "text-[#2D1B69]",
          className
        )}
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        p<span className="text-[#00D4FF]">.</span>
      </span>
    );
  }

  // Light icon variant for dark backgrounds
  if (variant === "light") {
    return (
      <span
        className={cn(
          "font-extrabold tracking-tight",
          sizeClasses[size],
          "text-white",
          className
        )}
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        patela<span className="text-[#00D4FF]">.</span>
      </span>
    );
  }

  // Dark wordmark variant - "patela." with brand colors on light backgrounds
  return (
    <span
      className={cn(
        "font-extrabold tracking-tight",
        sizeClasses[size],
        "text-[#2D1B69]",
        className
      )}
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      patela<span className="text-[#00D4FF]">.</span>
    </span>
  );
}