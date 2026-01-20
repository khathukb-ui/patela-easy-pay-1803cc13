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
 * - "dark" - Purple wordmark for light backgrounds
 * - "light" - White wordmark for dark backgrounds (uses CSS filter)
 * - "icon" - Purple "p." icon for light backgrounds
 * - "light-icon" - White "p." icon for dark backgrounds (uses CSS filter)
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

  return (
    <div className={cn(heightClass, "inline-flex items-center", className)}>
      <img 
        src={imgSrc} 
        alt="Patela" 
        className={cn(
          "h-full w-auto",
          isLightVariant && "brightness-0 invert"
        )}
      />
    </div>
  );
}
