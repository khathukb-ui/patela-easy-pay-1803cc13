import { cn } from "@/lib/utils";
import patelaLogoFull from "@/assets/patela-logo-full.jpg";
import patelaLogoIcon from "@/assets/patela-logo-icon.jpg";

interface PatelaLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "light" | "dark" | "icon";
  className?: string;
  useImage?: boolean;
}

const sizeClasses = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-5xl",
};

const imageSizeClasses = {
  sm: "h-6",
  md: "h-8",
  lg: "h-12",
  xl: "h-16",
};

const iconSizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-14 w-14",
  xl: "h-20 w-20",
};

export function PatelaLogo({ size = "md", variant = "dark", className, useImage = false }: PatelaLogoProps) {
  // Icon variant - show the "p." logo
  if (variant === "icon") {
    return (
      <img 
        src={patelaLogoIcon} 
        alt="Patela" 
        className={cn(iconSizeClasses[size], "rounded-xl object-cover", className)} 
      />
    );
  }

  // Image variant - show the full official logo
  if (useImage) {
    return (
      <img 
        src={patelaLogoFull} 
        alt="Patela" 
        className={cn(imageSizeClasses[size], "object-contain", className)} 
      />
    );
  }

  // Text variant - recreate the logo with CSS (deep purple text + cyan dot)
  return (
    <span
      className={cn(
        "font-bold tracking-tight",
        sizeClasses[size],
        variant === "light" ? "text-white" : "text-[#2D1B69]",
        className
      )}
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      patela<span className="text-[#00D4FF]">.</span>
    </span>
  );
}