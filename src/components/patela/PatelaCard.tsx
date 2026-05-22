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
  const isSmall = size === "sm";
  const logoSize = isSmall ? "sm" : "md";

  return (
    <div className={`relative ${sizeClasses[size]} animate-float group ${className}`}>
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      
      {/* Card background */}
      <div className="absolute inset-0 rounded-2xl bg-white border border-primary/20 shadow-lg overflow-hidden group-hover:shadow-xl group-hover:border-primary/30 transition-all duration-300">
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>
      
      {/* Decorative wave accent */}
      <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden rounded-b-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/15 transform -skew-y-3" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 transform skew-y-2 translate-y-2" />
      </div>
      
      {/* Logo */}
      <div className={isSmall ? "absolute top-4 left-4" : "absolute top-6 left-6"}>
        <PatelaLogo size={logoSize} variant="dark" />
      </div>
      
      {/* Chip icon */}
      <div className={isSmall ? "absolute top-12 left-4" : "absolute top-16 left-6"}>
        <div className={isSmall 
          ? "w-8 h-5 rounded bg-gradient-to-br from-amber-200 via-amber-100 to-amber-300 border border-amber-300/50 flex items-center justify-center"
          : "w-10 h-7 rounded bg-gradient-to-br from-amber-200 via-amber-100 to-amber-300 border border-amber-300/50 flex items-center justify-center"
        }>
          <Cpu className={isSmall ? "w-4 h-4 text-amber-600/60" : "w-5 h-5 text-amber-600/60"} strokeWidth={1} />
        </div>
      </div>
      
      {/* Card number */}
      <div className={isSmall ? "absolute bottom-4 left-4 right-4" : "absolute bottom-6 left-6 right-6"}>
        <p className={isSmall 
          ? "font-mono text-sm tracking-[0.2em] text-black"
          : "font-mono text-lg tracking-[0.2em] text-black"
        }>
          4532 7891 0124 3456
        </p>
      </div>
    </div>
  );
}
