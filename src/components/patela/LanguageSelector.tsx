import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type Language = {
  code: string;
  name: string;
  nativeName: string;
};

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "zu", name: "Zulu", nativeName: "isiZulu" },
  { code: "st", name: "Sesotho", nativeName: "Sesotho" },
  { code: "ts", name: "Tsonga", nativeName: "Xitsonga" },
  { code: "af", name: "Afrikaans", nativeName: "Afrikaans" },
  { code: "xh", name: "Xhosa", nativeName: "isiXhosa" },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onSelect: (code: string) => void;
}

export function LanguageSelector({ selectedLanguage, onSelect }: LanguageSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {languages.map((lang) => {
        const isSelected = selectedLanguage === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => onSelect(lang.code)}
            className={cn(
              "relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-200",
              isSelected
                ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                : "border-border bg-card hover:border-muted-foreground/30"
            )}
          >
            {isSelected && (
              <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
            <span className={cn(
              "text-lg font-bold",
              isSelected ? "text-primary" : "text-foreground"
            )}>{lang.nativeName}</span>
            <span className="text-sm text-muted-foreground">{lang.name}</span>
          </button>
        );
      })}
    </div>
  );
}
