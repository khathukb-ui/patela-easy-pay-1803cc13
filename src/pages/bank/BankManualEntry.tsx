import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgressSteps } from "@/components/patela/ProgressSteps";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const BANKS = [
  { id: "fnb", name: "FNB", color: "#009639" },
  { id: "absa", name: "ABSA", color: "#AF0C21" },
  { id: "standard", name: "Standard Bank", color: "#0033A0" },
  { id: "nedbank", name: "Nedbank", color: "#00A859" },
  { id: "capitec", name: "Capitec", color: "#00205B" },
  { id: "other", name: "Other Bank", color: "#6B7280" },
];

const ACCOUNT_TYPES = ["Cheque Account", "Savings Account", "Transmission Account"];

export default function BankManualEntry() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState("");
  const [showBankList, setShowBankList] = useState(false);
  const [showAccountTypes, setShowAccountTypes] = useState(false);

  const selectedBankData = BANKS.find(b => b.id === selectedBank);
  const isValid = selectedBank && accountNumber.length >= 8 && accountType;

  const handleContinue = () => {
    navigate("/bank/confirm", {
      state: {
        scanned: false,
        bankName: selectedBankData?.name,
        accountNumber: `****${accountNumber.slice(-4)}`,
        accountType: accountType,
        fullAccountNumber: accountNumber
      }
    });
  };

  return (
    <div className="min-h-screen patela-app-bg flex flex-col">
      {/* Header */}
      <div className="p-4 pt-6 flex items-center justify-between">
        <button 
          onClick={() => navigate("/bank/start")}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <ProgressSteps currentStep={2} totalSteps={4} />
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 patela-form-container py-4">
        <h1 className="text-xl font-bold text-foreground mb-1">
          Enter Bank Details
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          Link your bank account to receive payments
        </p>

        <div className="patela-form-section">
          {/* Bank Selection */}
          <div className="patela-form-field">
            <label className="patela-label">
              Select Your Bank
            </label>
            <button
              onClick={() => setShowBankList(!showBankList)}
              className="w-full flex items-center justify-between p-3 bg-card border-2 border-border rounded-xl text-left hover:border-primary/30 transition-colors"
            >
              {selectedBankData ? (
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: selectedBankData.color }}
                  >
                    {selectedBankData.name[0]}
                  </div>
                  <span className="font-medium text-foreground">{selectedBankData.name}</span>
                </div>
              ) : (
                <span className="text-muted-foreground">Choose a bank</span>
              )}
              <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${showBankList ? "rotate-180" : ""}`} />
            </button>
            
            {showBankList && (
              <div className="mt-2 bg-card border-2 border-border rounded-xl overflow-hidden">
                {BANKS.map((bank) => (
                  <button
                    key={bank.id}
                    onClick={() => {
                      setSelectedBank(bank.id);
                      setShowBankList(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors border-b border-border last:border-b-0"
                  >
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: bank.color }}
                    >
                      {bank.name[0]}
                    </div>
                    <span className="font-medium text-foreground">{bank.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Account Number */}
          <div className="patela-form-field">
            <label className="patela-label">
              Account Number
            </label>
            <Input
              type="tel"
              inputMode="numeric"
              placeholder="Enter your account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
              className="h-12"
            />
            <p className="patela-helper-text">Your bank account number (8-12 digits)</p>
          </div>

          {/* Account Type */}
          <div className="patela-form-field">
            <label className="patela-label">
              Account Type
            </label>
            <button
              onClick={() => setShowAccountTypes(!showAccountTypes)}
              className="w-full flex items-center justify-between p-3 bg-card border-2 border-border rounded-xl text-left hover:border-primary/30 transition-colors"
            >
              {accountType ? (
                <span className="font-medium text-foreground">{accountType}</span>
              ) : (
                <span className="text-muted-foreground">Select account type</span>
              )}
              <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${showAccountTypes ? "rotate-180" : ""}`} />
            </button>
            
            {showAccountTypes && (
              <div className="mt-2 bg-card border-2 border-border rounded-xl overflow-hidden">
                {ACCOUNT_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setAccountType(type);
                      setShowAccountTypes(false);
                    }}
                    className="w-full text-left p-3 hover:bg-muted transition-colors border-b border-border last:border-b-0 font-medium text-foreground"
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="patela-button-container">
        <Button 
          variant="hero"
          size="xl" 
          className="w-full"
          onClick={handleContinue}
          disabled={!isValid}
        >
          Continue to Verify
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
