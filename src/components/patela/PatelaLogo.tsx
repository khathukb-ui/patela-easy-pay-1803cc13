import { cn } from "@/lib/utils";

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
  "2xl": "h-16",
};

// Brand colors - exact hex values from reference
const BRAND = {
  purple: "#2D1B69",
  cyan: "#00D4FF",
  white: "#FFFFFF",
};

/**
 * SVG-based "p." icon with true transparency
 * Rounded loop design matching official brand mark
 */
function PatelaIconSVG({ color, dotColor }: { color: string; dotColor: string }) {
  return (
    <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto">
      {/* "p" - rounded loop with descender */}
      <path
        d="M12 22C12 9.85 21.85 0 34 0C46.15 0 56 9.85 56 22C56 34.15 46.15 44 34 44H22V92C22 96.42 18.42 100 14 100H12V22Z"
        fill={color}
      />
      {/* Inner circle of "p" loop */}
      <circle cx="34" cy="22" r="12" fill="none" stroke="none" />
      <path
        d="M22 22C22 15.37 27.37 10 34 10C40.63 10 46 15.37 46 22C46 28.63 40.63 34 34 34H22V22Z"
        fill="transparent"
      />
      {/* Cyan dot */}
      <circle cx="68" cy="40" r="10" fill={dotColor} />
    </svg>
  );
}

/**
 * SVG-based "patela." wordmark with true transparency
 * Clean rounded typography matching official brand guidelines
 */
function PatelaWordmarkSVG({ color, dotColor }: { color: string; dotColor: string }) {
  // Using text-based SVG for cleaner rendering with a rounded font
  return (
    <svg viewBox="0 0 200 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto">
      {/* Using a rounded sans-serif text for the wordmark */}
      <text
        x="0"
        y="38"
        fill={color}
        fontFamily="'Plus Jakarta Sans', 'Nunito', 'Poppins', system-ui, sans-serif"
        fontWeight="800"
        fontSize="42"
        letterSpacing="-1"
      >
        patela
      </text>
      {/* Cyan dot positioned after text */}
      <circle cx="185" cy="38" r="6" fill={dotColor} />
    </svg>
  );
}

/**
 * PatelaLogo Component
 * 
 * Uses inline SVG for guaranteed transparency - no image files, no background artifacts.
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
  
  // Determine colors based on variant
  const mainColor = (variant === "light" || variant === "light-icon") ? BRAND.white : BRAND.purple;
  const dotColor = BRAND.cyan;

  return (
    <div
      className={cn(
        heightClass,
        "inline-flex items-center",
        className
      )}
    >
      {isIconVariant ? (
        <PatelaIconSVG color={mainColor} dotColor={dotColor} />
      ) : (
        <PatelaWordmarkSVG color={mainColor} dotColor={dotColor} />
      )}
    </div>
  );
}
