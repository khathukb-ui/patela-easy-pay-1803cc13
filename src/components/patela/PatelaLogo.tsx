import { cn } from "@/lib/utils";

// Official Patela logo assets - exact shapes from brand guidelines
import wordmarkDark from "@/assets/patela-wordmark-dark.png";
import wordmarkLight from "@/assets/patela-wordmark-light.png";
import iconDark from "@/assets/patela-icon-dark.png";
import iconLight from "@/assets/patela-icon-light.png";

interface PatelaLogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  variant?: "light" | "dark" | "icon" | "light-icon";
  className?: string;
}

// Height classes for consistent sizing across all variants
const wordmarkHeightClasses = {
  sm: "h-6",
  md: "h-8",
  lg: "h-12",
  xl: "h-16",
  "2xl": "h-20",
};

const iconHeightClasses = {
  sm: "h-5",
  md: "h-7",
  lg: "h-10",
  xl: "h-14",
  "2xl": "h-18",
};

/**
 * PatelaLogo Component
 * 
 * Uses the official Patela logo assets with exact shapes from brand guidelines.
 * NO CSS text, NO font reinterpretation - only the original designed logo marks.
 * 
 * Variants:
 * - "dark" - Purple wordmark "patela." for light backgrounds
 * - "light" - White wordmark "patela." for dark backgrounds
 * - "icon" - Purple "p." icon for light backgrounds
 * - "light-icon" - White "p." icon for dark backgrounds
 * 
 * Usage Rules:
 * - Icon variants ("icon", "light-icon") must appear ALONE - never with "Patela" text
 * - Wordmark variants ("dark", "light") are the complete logo - never add extra text
 * - Never place logos inside containers, cards, or frames
 */
export function PatelaLogo({ 
  size = "md", 
  variant = "dark", 
  className
}: PatelaLogoProps) {
  const isIconVariant = variant === "icon" || variant === "light-icon";
  const heightClass = isIconVariant ? iconHeightClasses[size] : wordmarkHeightClasses[size];
  
  // Select the correct logo asset based on variant
  const logoSrc = (() => {
    switch (variant) {
      case "light":
        return wordmarkLight;
      case "dark":
        return wordmarkDark;
      case "light-icon":
        return iconLight;
      case "icon":
        return iconDark;
      default:
        return wordmarkDark;
    }
  })();

  const altText = isIconVariant ? "Patela" : "patela.";

  return (
    <img
      src={logoSrc}
      alt={altText}
      className={cn(
        heightClass,
        "w-auto object-contain",
        className
      )}
      draggable={false}
    />
  );
}
