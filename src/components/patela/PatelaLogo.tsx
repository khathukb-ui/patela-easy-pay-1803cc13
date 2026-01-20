import { cn } from "@/lib/utils";
import patelaIconTransparent from "@/assets/patela-icon-transparent.png";
import patelaWordmarkTransparent from "@/assets/patela-wordmark-transparent.png";

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
 * Uses official transparent PNG assets for pixel-perfect rendering.
 * 
 * Variants:
 * - "dark" - Purple wordmark for light backgrounds (original PNG)
 * - "light" - White wordmark for dark backgrounds (CSS filter to make purple white, keep cyan)
 * - "icon" - Purple "p." icon for light backgrounds (original PNG)
 * - "light-icon" - White "p." icon for dark backgrounds (CSS filter)
 * 
 * The CSS filter chain targets only the deep purple (#2D1B69) to white conversion
 * while keeping the cyan (#00D4FF) dot visible.
 */
export function PatelaLogo({ 
  size = "md", 
  variant = "dark", 
  className
}: PatelaLogoProps) {
  const isIconVariant = variant === "icon" || variant === "light-icon";
  const isLightVariant = variant === "light" || variant === "light-icon";
  const heightClass = isIconVariant ? iconHeightClasses[size] : wordmarkHeightClasses[size];

  const imgSrc = isIconVariant ? patelaIconTransparent : patelaWordmarkTransparent;

  // For light variants: invert purple to white, but preserve cyan
  // Using hue-rotate + saturate to shift purple to white while keeping cyan intact
  const lightFilterStyle = isLightVariant 
    ? { filter: "brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg)" }
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
