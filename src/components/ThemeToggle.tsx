import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";

interface ThemeToggleProps {
  showLabel?: boolean;
}

export function ThemeToggle({ showLabel = true }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-3">
      {showLabel && (
        <div className="flex items-center gap-2">
          {isDark ? (
            <Moon className="h-4 w-4 text-accent" />
          ) : (
            <Sun className="h-4 w-4 text-warning" />
          )}
          <span className="text-sm text-foreground">
            {isDark ? "Dark Mode" : "Light Mode"}
          </span>
        </div>
      )}
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Toggle dark mode"
      />
    </div>
  );
}
