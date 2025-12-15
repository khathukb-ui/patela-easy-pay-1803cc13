import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Smartphone, 
  Battery, 
  Wifi, 
  RefreshCw, 
  Unlink, 
  Share2,
  AlertTriangle
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DeviceManagement() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Mock device data
  const device = {
    name: "Patela Pro",
    id: "PTL-2024-7842",
    battery: 85,
    connected: true,
    lastSync: "2 min ago"
  };

  return (
    <div className="min-h-screen patela-app-bg flex flex-col">
      {/* Header */}
      <div className="p-4 pt-8 flex items-center">
        <button 
          onClick={() => navigate("/account")}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-foreground pr-10">
          {t("deviceManagement")}
        </h1>
      </div>

      {/* Device Card */}
      <div className="px-6 py-4">
        <div className="bg-card rounded-3xl patela-shadow-md overflow-hidden">
          <div className="patela-gradient-primary p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Smartphone className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary-foreground">{device.name}</h2>
                <p className="text-primary-foreground/80">{device.id}</p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Battery className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">{t("battery")}</span>
              </div>
              <span className={`font-bold ${device.battery > 20 ? "text-success" : "text-destructive"}`}>
                {device.battery}%
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wifi className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">{t("status")}</span>
              </div>
              <span className={`flex items-center gap-2 font-bold ${device.connected ? "text-success" : "text-destructive"}`}>
                <span className={`w-2 h-2 rounded-full ${device.connected ? "bg-success" : "bg-destructive"}`} />
                {device.connected ? t("connected") : "Disconnected"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">{t("lastSync")}</span>
              </div>
              <span className="font-medium text-foreground">{device.lastSync}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex-1 px-6 py-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Device Actions
        </h3>
        
        <div className="space-y-3">
          {/* Transfer Device */}
          <button
            onClick={() => navigate("/device/transfer")}
            className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl border border-border hover:bg-muted/50 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Share2 className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-foreground">{t("transferDevice")}</p>
              <p className="text-sm text-muted-foreground">{t("transferDesc")}</p>
            </div>
          </button>

          {/* Unpair Device */}
          <button
            onClick={() => navigate("/device/unpair")}
            className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl border border-destructive/20 hover:bg-destructive/5 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Unlink className="h-6 w-6 text-destructive" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-destructive">{t("unpairDevice")}</p>
              <p className="text-sm text-muted-foreground">{t("unpairDesc")}</p>
            </div>
          </button>
        </div>

        {/* Warning Note */}
        <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-2xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground text-sm">{t("warning")}:</p>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>• Transfer is pending</li>
                <li>• Device is being unpaired</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
