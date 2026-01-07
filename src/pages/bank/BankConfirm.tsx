import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProgressSteps } from "@/components/patela/ProgressSteps";
import { ArrowLeft, ArrowRight, Building2, CreditCard, CheckCircle2, Pencil } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BankConfirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { bankName, accountNumber, accountType, scanned } = location.state || {
    bankName: "FNB",
    accountNumber: "****4521",
    accountType: "Cheque Account",
    scanned: true
  };

  return (
    <div className="min-h-screen patela-app-bg flex flex-col">
      {/* Header */}
      <div className="p-4 pt-6 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <ProgressSteps currentStep={3} totalSteps={4} />
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 patela-form-container py-4">
        <div className="flex items-center gap-2 mb-2">
          {scanned && (
            <span className="px-2 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
              Card Scanned
            </span>
          )}
        </div>
        
        <h1 className="text-xl font-bold text-foreground mb-1">
          Confirm Bank Details
        </h1>
        <p className="text-muted-foreground text-sm mb-4">
          Please verify the information below is correct
        </p>

        {/* Bank Details Card */}
        <div className="bg-card rounded-2xl patela-shadow-md overflow-hidden mb-4">
          {/* Bank Header */}
          <div className="patela-gradient-primary p-4 text-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <h2 className="text-lg font-bold text-primary-foreground">{bankName}</h2>
          </div>

          {/* Details */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">Account Number</span>
              </div>
              <span className="font-bold text-foreground">{accountNumber}</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">Account Type</span>
              </div>
              <span className="font-bold text-foreground">{accountType}</span>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <button 
          onClick={() => navigate("/bank/manual")}
          className="flex items-center justify-center gap-2 w-full py-2 text-primary text-sm font-medium"
        >
          <Pencil className="h-4 w-4" />
          Edit Details
        </button>
      </div>

      {/* Bottom Action */}
      <div className="patela-button-container space-y-2">
        <Button 
          variant="hero"
          size="xl" 
          className="w-full"
          onClick={() => navigate("/bank/verify")}
        >
          Verify Account
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        
        <p className="text-center text-xs text-muted-foreground">
          We'll verify your account with your bank
        </p>
      </div>
    </div>
  );
}
