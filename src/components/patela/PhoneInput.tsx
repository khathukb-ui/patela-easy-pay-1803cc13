import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function PhoneInput({ value, onChange, error, disabled }: PhoneInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, "");
    if (input.length <= 10) {
      onChange(input);
    }
  };

  const formatPhone = (phone: string) => {
    if (phone.length <= 3) return phone;
    if (phone.length <= 6) return `${phone.slice(0, 3)} ${phone.slice(3)}`;
    return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground">
          <span className="text-xl">🇿🇦</span>
          <span className="font-medium">+27</span>
        </div>
        <Input
          type="tel"
          value={formatPhone(value)}
          onChange={handleChange}
          disabled={disabled}
          placeholder="082 123 4567"
          className={cn(
            "h-16 pl-24 text-xl font-medium tracking-wide rounded-2xl border-2",
            error ? "border-destructive" : "border-border focus:border-primary"
          )}
        />
      </div>
      {error && (
        <p className="text-destructive text-sm font-medium animate-patela-slide-up">
          {error}
        </p>
      )}
    </div>
  );
}
