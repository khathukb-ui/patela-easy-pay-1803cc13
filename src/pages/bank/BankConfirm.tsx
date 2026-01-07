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
      <div className="flex-1 patela-form-container py-6">
        <div className="flex items-center gap-2 mb-3">
          {scanned && (
            <span className="px-3 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
              Card Scanned
            </span>
          )}
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Confirm Bank Details
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          Please verify the information below is correct
        </p>

        {/* Bank Details Card */}
        <div className="bg-card rounded-2xl patela-shadow-md overflow-hidden mb-6">
          {/* Bank Header */}
          <div className="patela-gradient-primary p-5 text-center">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building2 className="h-7 w-7 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-bold text-primary-foreground">{bankName}</h2>
          </div>

          {/* Details */}
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">Account Number</span>
              </div>
              <span className="font-bold text-foreground">{accountNumber}</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">Account Type</span>
              </div>
              <span className="font-bold text-foreground">{accountType}</span>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <button 
          onClick={() => navigate("/bank/manual")}
          className="flex items-center justify-center gap-2 w-full py-3 text-primary font-medium"
        >
          <Pencil className="h-4 w-4" />
          Edit Details
        </button>
      </div>

      {/* Bottom Action */}
      <div className="px-4 sm:px-6 pb-6 pt-4 space-y-3">
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
