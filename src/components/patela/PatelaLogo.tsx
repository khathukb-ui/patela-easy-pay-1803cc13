import { cn } from "@/lib/utils";
import patelaWordmarkSvg from "@/assets/patela-wordmark.svg";
import patelaIconSvg from "@/assets/patela-icon.svg";

interface PatelaLogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  variant?: "dark" | "icon";
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
 * Master brand asset: Uses official SVG files from the AI source.
 * 
 * IMPORTANT: No CSS filters, theming, or color modifications are applied.
 * The dot colour and all SVG colours are preserved exactly as defined.
 * 
 * Variants:
 * - "dark" - Full "patela." wordmark (SVG) - use on any background
 * - "icon" - Standalone "p." icon (SVG) - use on any background
 */
export function PatelaLogo({ 
  size = "md", 
  variant = "dark", 
  className
}: PatelaLogoProps) {
  const isIconVariant = variant === "icon";
  const heightClass = isIconVariant ? iconHeightClasses[size] : wordmarkHeightClasses[size];

  // Use official SVG assets - NO filters or color modifications
  const imgSrc = isIconVariant ? patelaIconSvg : patelaWordmarkSvg;

  return (
    <div className={cn(heightClass, "inline-flex items-center", className)}>
      <img 
        src={imgSrc} 
        alt="Patela" 
        className="h-full w-auto"
      />
    </div>
  );
}
