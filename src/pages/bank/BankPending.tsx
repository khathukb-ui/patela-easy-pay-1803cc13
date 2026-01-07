import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, Bell, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BankPending() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen patela-app-bg flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-4">
          <Clock className="h-10 w-10 text-accent" />
        </div>

        <h1 className="text-xl font-bold text-foreground mb-1">
          {t("underReview")}
        </h1>
        <p className="text-muted-foreground text-sm mb-4 max-w-xs">
          {t("verifying")}
        </p>

        {/* Status Timeline */}
        <div className="w-full max-w-sm bg-card rounded-xl p-4 patela-shadow-sm mb-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-success flex items-center justify-center">
                <span className="text-success-foreground text-xs">✓</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{t("done")}</p>
                <p className="text-xs text-muted-foreground">Just now</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center animate-pulse">
                <span className="text-accent-foreground text-xs">2</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{t("verifying")}</p>
                <p className="text-xs text-muted-foreground">In progress</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-xs">3</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-muted-foreground text-sm">{t("verified")}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Info */}
        <div className="w-full max-w-sm flex items-center gap-3 p-3 bg-primary/5 rounded-xl mb-4">
          <Bell className="h-4 w-4 text-primary flex-shrink-0" />
          <p className="text-xs text-foreground">
            {t("notifications")}
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Button 
            variant="default"
            size="default" 
            className="w-[220px] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
            onClick={() => navigate("/home")}
          >
            {t("home")}
          </Button>

          <Button 
            variant="outline"
            size="default" 
            className="w-[220px]"
            onClick={() => navigate("/help")}
          >
            <MessageCircle className="mr-1.5 h-4 w-4" />
            {t("helpSupport")}
          </Button>
        </div>
      </div>
    </div>
  );
}
