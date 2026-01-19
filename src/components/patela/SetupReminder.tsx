import { Button } from "@/components/ui/button";
import { X, Banknote, Smartphone, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SetupReminderProps {
  type: "bank" | "device";
  onDismiss?: () => void;
}

export function SetupReminder({ type, onDismiss }: SetupReminderProps) {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const config = {
    bank: {
      icon: Banknote,
      title: "Link your bank account",
      description: "Get your earnings paid directly to your bank",
      action: "Link Bank",
      path: "/bank/start",
      color: "bg-success/10 border-success/20",
      iconColor: "text-success",
      iconBg: "bg-success/20",
    },
    device: {
      icon: Smartphone,
      title: "Pair your Patela device",
      description: "Accept card payments and tap-to-pay",
      action: "Pair Device",
      path: "/device/start",
      color: "bg-accent/10 border-accent/20",
      iconColor: "text-accent",
      iconBg: "bg-accent/20",
    },
  };

  const { icon: Icon, title, description, action, path, color, iconColor, iconBg } = config[type];

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div className={`${color} rounded-xl p-4 border relative`}>
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-background/50 transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-foreground text-sm">{title}</p>
          <p className="text-xs text-muted-foreground mb-2">{description}</p>
          <Button
            size="sm"
            variant="outline"
            className="h-8"
            onClick={() => navigate(path)}
          >
            {action}
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
