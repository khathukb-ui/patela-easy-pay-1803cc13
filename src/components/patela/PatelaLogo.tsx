import { cn } from "@/lib/utils";
import patelaWordmarkSvg from "@/assets/patela-wordmark.svg";
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

/**
 * PatelaLogo Component
 * 
 * Master brand asset: Uses official SVG wordmark from the AI source file.
 * 
 * Variants:
 * - "dark" - Original purple wordmark for light backgrounds (SVG)
 * - "light" - White wordmark for dark backgrounds (CSS filter on SVG)
 * - "icon" - Purple "p." icon for light backgrounds (PNG fallback)
 * - "light-icon" - White "p." icon for dark backgrounds (CSS filter)
 */
export function PatelaLogo({ 
  size = "md", 
  variant = "dark", 
  className
}: PatelaLogoProps) {
  const isIconVariant = variant === "icon" || variant === "light-icon";
  const isLightVariant = variant === "light" || variant === "light-icon";
  const heightClass = isIconVariant ? iconHeightClasses[size] : wordmarkHeightClasses[size];

  // Use SVG for wordmark (master source), PNG for icon (until SVG provided)
  const imgSrc = isIconVariant ? patelaIconTransparent : patelaWordmarkSvg;

  // For light variants: invert to white
  const lightFilterStyle = isLightVariant 
    ? { filter: "brightness(0) saturate(100%) invert(100%)" }
    : undefined;

  return (
    <div className={cn(heightClass, "inline-flex items-center", className)}>
      <img 
        src={imgSrc} 
        alt="Patela" 
        className="h-full w-auto"
        style={lightFilterStyle}
      />
    </div>
  );
}
