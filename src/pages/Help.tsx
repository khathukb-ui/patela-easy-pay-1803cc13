import { BottomNav } from "@/components/patela/BottomNav";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  MessageCircle, 
  PlayCircle, 
  BookOpen,
  ChevronRight,
  Smartphone,
  Signal,
  Battery,
  RefreshCw
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface HelpItemProps {
  icon: typeof Phone;
  label: string;
  description?: string;
  onClick?: () => void;
  variant?: "default" | "highlight";
}

function HelpItem({ icon: Icon, label, description, onClick, variant = "default" }: HelpItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-colors text-left ${
        variant === "highlight" 
          ? "bg-accent/10 border-accent/20 hover:bg-accent/20" 
          : "bg-card border-primary/10 hover:bg-primary/5"
      }`}
    >
      <div className={`h-10 w-10 rounded-xl ${variant === "highlight" ? "bg-accent" : "bg-primary/10"} flex items-center justify-center`}>
        <Icon className={`h-5 w-5 ${variant === "highlight" ? "text-accent-foreground" : "text-primary"}`} />
      </div>
      <div className="flex-1">
        <p className="font-medium text-foreground">{label}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <ChevronRight className="h-5 w-5 text-primary/50" />
    </button>
  );
}

export default function Help() {
  const { t } = useLanguage();

  // Mock device diagnostics
  const diagnostics = {
    deviceId: "PTL-2024-7842",
    battery: 85,
    signal: "Strong",
    lastSync: "2 minutes ago",
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-primary px-6 py-6 patela-shadow-md">
        <h1 className="text-2xl font-bold text-primary-foreground">{t("helpSupport")}</h1>
        <p className="text-primary-foreground/70">{t("contactUs")}</p>
      </header>

      <main className="px-6 py-6 space-y-6">
        {/* Quick Contact */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-auto py-4 flex-col gap-2 border-primary/20 hover:bg-accent/10 hover:border-accent/30">
            <Phone className="h-6 w-6 text-accent" />
            <span className="font-medium">{t("callSupport")}</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2 border-primary/20 hover:bg-success/10 hover:border-success/30">
            <MessageCircle className="h-6 w-6 text-success" />
            <span className="font-medium">{t("whatsappSupport")}</span>
          </Button>
        </div>

        {/* Learn */}
        <div>
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
            {t("learnPatela")}
          </h2>
          <div className="space-y-2">
            <HelpItem
              icon={PlayCircle}
              label={t("howToGetPaid")}
              description="2 min video"
              variant="highlight"
            />
            <HelpItem
              icon={BookOpen}
              label={t("practiceMode")}
              description="Try a test payment"
            />
          </div>
        </div>

        {/* Device Diagnostics */}
        <div>
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
            {t("deviceDiagnostics")}
          </h2>
          <div className="bg-card rounded-xl border border-primary/10 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Smartphone className="h-4 w-4" />
                <span className="text-sm">{t("device")} ID</span>
              </div>
              <span className="text-sm font-mono text-foreground">{diagnostics.deviceId}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Battery className="h-4 w-4" />
                <span className="text-sm">{t("battery")}</span>
              </div>
              <span className="text-sm font-medium text-success">{diagnostics.battery}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Signal className="h-4 w-4" />
                <span className="text-sm">Signal</span>
              </div>
              <span className="text-sm font-medium text-success">{diagnostics.signal}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <RefreshCw className="h-4 w-4" />
                <span className="text-sm">{t("lastSync")}</span>
              </div>
              <span className="text-sm text-foreground">{diagnostics.lastSync}</span>
            </div>

            <Button variant="outline" className="w-full mt-2">
              {t("shareDiagnostics")}
            </Button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
