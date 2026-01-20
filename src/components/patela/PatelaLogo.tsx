import { cn } from "@/lib/utils";
import patelaIconTransparent from "@/assets/patela-icon-transparent.png";

interface PatelaLogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  variant?: "light" | "dark" | "icon" | "light-icon";
  className?: string;
}

// Height classes for consistent sizing
const wordmarkHeightClasses = {
  sm: "h-6",
  md: "h-8",
  lg: "h-12",
  xl: "h-16",
  "2xl": "h-20",
};

const iconHeightClasses = {
  sm: "h-6",
  md: "h-8",
  lg: "h-12",
  xl: "h-16",
  "2xl": "h-20",
};

// Brand colors - exact hex values from reference
const BRAND = {
  purple: "#2D1B69",
  cyan: "#00D4FF",
  white: "#FFFFFF",
};

/**
 * SVG "patela." wordmark - using web font for exact typography match
 * The reference uses a rounded sans-serif similar to "Nunito" or custom
 */
function PatelaWordmarkSVG({ color, dotColor }: { color: string; dotColor: string }) {
  return (
    <svg 
      viewBox="0 0 280 70" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-full w-auto"
      style={{ display: 'block' }}
    >
      <defs>
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@800&display=swap');`}
        </style>
      </defs>
      <text
        x="0"
        y="52"
        fill={color}
        fontFamily="'Nunito', 'Plus Jakarta Sans', sans-serif"
        fontWeight="800"
        fontSize="58"
        letterSpacing="-2"
      >
        patela
      </text>
      {/* Cyan dot - positioned at baseline after 'a' */}
      <circle cx="262" cy="52" r="8" fill={dotColor} />
    </svg>
  );
}

/**
 * PatelaLogo Component
 * 
 * Uses inline SVG for guaranteed transparency.
 * 
 * Variants:
 * - "dark" - Purple wordmark for light backgrounds
 * - "light" - White wordmark for dark backgrounds
 * - "icon" - Purple "p." icon for light backgrounds
 * - "light-icon" - White "p." icon for dark backgrounds
 */
export function PatelaLogo({ 
  size = "md", 
  variant = "dark", 
  className
}: PatelaLogoProps) {
  const isIconVariant = variant === "icon" || variant === "light-icon";
  const heightClass = isIconVariant ? iconHeightClasses[size] : wordmarkHeightClasses[size];
  
  const mainColor = (variant === "light" || variant === "light-icon") ? BRAND.white : BRAND.purple;
  const dotColor = BRAND.cyan;

  // For icon variants, use the official transparent PNG
  // Apply CSS filter for light-icon variant to invert colors
  if (isIconVariant) {
    return (
      <div className={cn(heightClass, "inline-flex items-center", className)}>
        <img 
          src={patelaIconTransparent} 
          alt="Patela" 
          className={cn(
            "h-full w-auto",
            variant === "light-icon" && "brightness-0 invert"
          )}
        />
      </div>
    );
  }

  return (
    <div className={cn(heightClass, "inline-flex items-center", className)}>
      <PatelaWordmarkSVG color={mainColor} dotColor={dotColor} />
    </div>
  );
}
