import { Cpu } from "lucide-react";
import { PatelaLogo } from "./PatelaLogo";

interface PatelaCardProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-56 h-36",
  md: "w-72 h-44",
  lg: "w-80 h-48",
};

export function PatelaCard({ className = "", size = "lg" }: PatelaCardProps) {
  const logoSize = size === "sm" ? "sm" : "md";
  const chipSize = size === "sm" ? "w-8 h-5" : "w-10 h-7";
  const chipIconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const numberSize = size === "sm" ? "text-sm" : "text-lg";
  const padding = size === "sm" ? "p-4" : "p-6";
  const chipTop = size === "sm" ? "top-12" : "top-16";

  return (
    <div className={`relative ${sizeClasses[size]} animate-float transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer ${className}`}>
      {/* Card background */}
      <div className="absolute inset-0 rounded-2xl bg-white border border-primary/20 shadow-lg overflow-hidden">
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>
      
      {/* Decorative wave accent */}
      <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden rounded-b-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/15 transform -skew-y-3" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 transform skew-y-2 translate-y-2" />
      </div>
      
      {/* Logo */}
      <div className={`absolute top-${size === "sm" ? "4" : "6"} left-${size === "sm" ? "4" : "6"}`}>
        <PatelaLogo size={logoSize} variant="dark" />
      </div>
      
      {/* Chip icon */}
      <div className={`absolute ${chipTop} left-${size === "sm" ? "4" : "6"}`}>
        <div className={`${chipSize} rounded bg-gradient-to-br from-amber-200 via-amber-100 to-amber-300 border border-amber-300/50 flex items-center justify-center`}>
          <Cpu className={`${chipIconSize} text-amber-600/60`} strokeWidth={1} />
        </div>
      </div>
      
      {/* Card number */}
      <div className={`absolute bottom-${size === "sm" ? "4" : "6"} left-${size === "sm" ? "4" : "6"} right-${size === "sm" ? "4" : "6"}`}>
        <p className={`font-mono ${numberSize} tracking-[0.2em] text-black`}>
          4532 7891 0124 3456
        </p>
      </div>
    </div>
  );
}
