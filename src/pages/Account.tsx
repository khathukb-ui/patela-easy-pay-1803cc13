import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/patela/BottomNav";
import { 
  User, 
  Smartphone, 
  Bell, 
  Shield, 
  HelpCircle,
  ChevronRight,
  LogOut,
  Building2,
  Wallet
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SettingsItemProps {
  icon: typeof User;
  label: string;
  description?: string;
  onClick?: () => void;
  danger?: boolean;
}

function SettingsItem({ icon: Icon, label, description, onClick, danger }: SettingsItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:bg-secondary/50 transition-colors text-left"
    >
      <div className={`h-10 w-10 rounded-xl ${danger ? "bg-destructive/10" : "bg-primary/10"} flex items-center justify-center`}>
        <Icon className={`h-5 w-5 ${danger ? "text-destructive" : "text-primary"}`} />
      </div>
      <div className="flex-1">
        <p className={`font-medium ${danger ? "text-destructive" : "text-foreground"}`}>{label}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </button>
  );
}

export default function Account() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-6 patela-shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full patela-gradient-primary flex items-center justify-center">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Sipho's Spaza</h1>
            <p className="text-muted-foreground">+27 82 123 4567</p>
          </div>
        </div>
      </header>

      <main className="px-6 py-6 space-y-6">
        {/* Bank & Payouts */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            {t("money")}
          </h2>
          <div className="space-y-2">
            <SettingsItem
              icon={Building2}
              label={t("bankAccount")}
              description="FNB ••••4523"
              onClick={() => navigate("/bank/start")}
            />
            <SettingsItem
              icon={Wallet}
              label={t("payouts")}
              description={`${t("nextPayout")}: Tomorrow`}
            />
          </div>
        </div>

        {/* Device */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            {t("device")}
          </h2>
          <div className="space-y-2">
            <SettingsItem
              icon={Smartphone}
              label="Patela Pro"
              description={t("connected")}
              onClick={() => navigate("/device/manage")}
            />
          </div>
        </div>

        {/* Settings */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            {t("settings")}
          </h2>
          <div className="space-y-2">
            <SettingsItem icon={Bell} label={t("notifications")} />
            <SettingsItem icon={Shield} label={t("securityPin")} />
            <SettingsItem 
              icon={HelpCircle} 
              label={t("helpSupport")} 
              onClick={() => navigate("/help")}
            />
          </div>
        </div>

        {/* Logout */}
        <div className="pt-4">
          <SettingsItem
            icon={LogOut}
            label={t("logOut")}
            danger
          />
        </div>

        {/* Version */}
        <p className="text-center text-sm text-muted-foreground pt-4">
          Patela v1.0.0
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
