import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, Bell, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BankPending() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center text-center animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mb-6">
          <Clock className="h-12 w-12 text-accent" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          {t("underReview")}
        </h1>
        <p className="text-muted-foreground mb-8 max-w-xs">
          {t("verifying")}
        </p>

        {/* Status Timeline */}
        <div className="w-full max-w-sm bg-card rounded-2xl p-5 patela-shadow-sm mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
                <span className="text-success-foreground text-sm">✓</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{t("done")}</p>
                <p className="text-sm text-muted-foreground">Just now</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center animate-pulse">
                <span className="text-accent-foreground text-sm">2</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{t("verifying")}</p>
                <p className="text-sm text-muted-foreground">In progress</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm">3</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-muted-foreground">{t("verified")}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Info */}
        <div className="w-full max-w-sm flex items-center gap-3 p-4 bg-primary/5 rounded-2xl mb-8">
          <Bell className="h-5 w-5 text-primary flex-shrink-0" />
          <p className="text-sm text-foreground">
            {t("notifications")}
          </p>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <Button 
            size="xl" 
            className="w-full patela-gradient-primary text-lg font-bold h-16 rounded-2xl patela-shadow-md"
            onClick={() => navigate("/home")}
          >
            {t("home")}
          </Button>

          <Button 
            variant="outline"
            size="lg" 
            className="w-full h-14 rounded-2xl"
            onClick={() => navigate("/help")}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            {t("helpSupport")}
          </Button>
        </div>
      </div>
    </div>
  );
}
