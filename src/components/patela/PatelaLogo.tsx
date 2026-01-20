import { cn } from "@/lib/utils";

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
 * SVG "p." icon - accurately traced from reference image
 * Features: rounded loop at top, straight descender, circular dot
 */
function PatelaIconSVG({ color, dotColor }: { color: string; dotColor: string }) {
  return (
    <svg 
      viewBox="0 0 120 150" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-full w-auto"
      style={{ display: 'block' }}
    >
      {/* "p" letter - outer shape with rounded loop and descender */}
      <path
        d="M20 45C20 20.147 40.147 0 65 0C89.853 0 110 20.147 110 45C110 69.853 89.853 90 65 90H35V140C35 145.523 30.523 150 25 150H20V45Z"
        fill={color}
      />
      {/* Inner cutout of the "p" loop - creates the hole */}
      <circle cx="65" cy="45" r="25" fill="none" />
      <path
        d="M35 45C35 28.431 48.431 15 65 15C81.569 15 95 28.431 95 45C95 61.569 81.569 75 65 75H35V45Z"
        fill="transparent"
      />
      {/* Mask to create the inner hole */}
      <mask id="p-mask">
        <rect width="120" height="150" fill="white"/>
        <circle cx="65" cy="45" r="22" fill="black"/>
      </mask>
      <path
        d="M20 45C20 20.147 40.147 0 65 0C89.853 0 110 20.147 110 45C110 69.853 89.853 90 65 90H35V140C35 145.523 30.523 150 25 150H20V45Z"
        fill={color}
        mask="url(#p-mask)"
      />
      {/* Cyan dot */}
      <circle cx="105" cy="78" r="12" fill={dotColor} />
    </svg>
  );
}

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

  return (
    <div className={cn(heightClass, "inline-flex items-center", className)}>
      {isIconVariant ? (
        <PatelaIconSVG color={mainColor} dotColor={dotColor} />
      ) : (
        <PatelaWordmarkSVG color={mainColor} dotColor={dotColor} />
      )}
    </div>
  );
}
