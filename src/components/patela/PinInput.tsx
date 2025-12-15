import { useState } from "react";
import { cn } from "@/lib/utils";

interface PinInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function PinInput({ length = 4, value, onChange, error }: PinInputProps) {
  const handleKeyPress = (key: string) => {
    if (value.length < length) {
      onChange(value + key);
    }
  };

  const handleDelete = () => {
    onChange(value.slice(0, -1));
  };

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "delete"];

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* PIN Dots */}
      <div className="flex items-center gap-4">
        {Array.from({ length }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-5 w-5 rounded-full transition-all duration-200",
              index < value.length
                ? "bg-primary scale-110"
                : "bg-muted border-2 border-border"
            )}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-destructive text-sm font-medium animate-patela-slide-up">
          {error}
        </p>
      )}

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-4 max-w-[280px]">
        {keys.map((key, index) => (
          <button
            key={index}
            onClick={() => {
              if (key === "delete") {
                handleDelete();
              } else if (key !== "") {
                handleKeyPress(key);
              }
            }}
            disabled={key === ""}
            className={cn(
              "h-16 w-20 rounded-2xl text-2xl font-bold transition-all duration-150",
              key === ""
                ? "invisible"
                : key === "delete"
                  ? "bg-secondary text-muted-foreground hover:bg-secondary/80 active:scale-95"
                  : "bg-card border-2 border-border text-foreground hover:bg-secondary hover:border-primary/20 active:scale-95 patela-shadow-sm"
            )}
          >
            {key === "delete" ? "←" : key}
          </button>
        ))}
      </div>
    </div>
  );
}
