import { cn } from "@/lib/utils";

interface PatelaLogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  variant?: "light" | "dark" | "icon" | "light-icon";
  className?: string;
}

// Wordmark sizes for "patela."
const wordmarkSizeClasses = {
  sm: "text-2xl",
  md: "text-3xl",
  lg: "text-5xl",
  xl: "text-6xl",
  "2xl": "text-7xl",
};

// Icon sizes for "p."
const iconSizeClasses = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-5xl",
  "2xl": "text-6xl",
};

// Brand colors - exact hex values
const BRAND = {
  purple: "#2D1B69",
  cyan: "#00D4FF",
};

export function PatelaLogo({ 
  size = "md", 
  variant = "dark", 
  className
}: PatelaLogoProps) {
  const fontStyle = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

  // Dark icon variant - "p." on light backgrounds
  if (variant === "icon") {
    return (
      <span
        className={cn(
          "font-extrabold tracking-tight",
          iconSizeClasses[size],
          className
        )}
        style={{ ...fontStyle, color: BRAND.purple }}
      >
        p<span style={{ color: BRAND.cyan }}>.</span>
      </span>
    );
  }

  // Light icon variant - "p." on dark backgrounds
  if (variant === "light-icon") {
    return (
      <span
        className={cn(
          "font-extrabold tracking-tight text-white",
          iconSizeClasses[size],
          className
        )}
        style={fontStyle}
      >
        p<span style={{ color: BRAND.cyan }}>.</span>
      </span>
    );
  }

  // Light wordmark variant - "patela." on dark backgrounds
  if (variant === "light") {
    return (
      <span
        className={cn(
          "font-extrabold tracking-tight text-white",
          wordmarkSizeClasses[size],
          className
        )}
        style={fontStyle}
      >
        patela<span style={{ color: BRAND.cyan }}>.</span>
      </span>
    );
  }

  // Dark wordmark variant - "patela." on light backgrounds (default)
  return (
    <span
      className={cn(
        "font-extrabold tracking-tight",
        wordmarkSizeClasses[size],
        className
      )}
      style={{ ...fontStyle, color: BRAND.purple }}
    >
      patela<span style={{ color: BRAND.cyan }}>.</span>
    </span>
  );
}