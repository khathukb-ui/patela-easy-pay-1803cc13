import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressSteps } from "@/components/patela/ProgressSteps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, Loader2, User, Store, MessageSquare, Mail, Phone, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { useOnboardingData } from "@/hooks/use-onboarding-data";

type Step = "personal" | "business" | "communication";

interface CommunicationMethod {
  id: string;
  icon: React.ElementType;
  label: string;
  description: string;
}

// Validate SA ID number format and checksum (Luhn algorithm)
const validateSAID = (id: string): boolean => {
  if (!id) return true; // Optional field
  if (!/^\d{13}$/.test(id)) return false;
  
  // Validate date of birth (first 6 digits: YYMMDD)
  const year = parseInt(id.substring(0, 2));
  const month = parseInt(id.substring(2, 4));
  const day = parseInt(id.substring(4, 6));
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  
  // Luhn checksum validation
  let sum = 0;
  for (let i = 0; i < 13; i++) {
    let digit = parseInt(id[i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
};

export default function PersonalDetails() {
  const { data: onboardingData, updateData } = useOnboardingData();
  const [step, setStep] = useState<Step>("personal");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Personal details - initialize from saved data
  const [firstName, setFirstName] = useState(onboardingData.firstName);
  const [lastName, setLastName] = useState(onboardingData.lastName);
  const [idNumber, setIdNumber] = useState(onboardingData.idNumber);
  const [idError, setIdError] = useState("");

  // Business details - initialize from saved data
  const [businessName, setBusinessName] = useState(onboardingData.businessName);
  const [businessType, setBusinessType] = useState(onboardingData.businessType);

  // Communication preferences - initialize from saved data
  const [selectedMethods, setSelectedMethods] = useState<string[]>(onboardingData.selectedMethods);
  const [email, setEmail] = useState(onboardingData.email);
  const [emailError, setEmailError] = useState("");

  // Save data when it changes
  useEffect(() => {
    updateData({
      firstName,
      lastName,
      idNumber,
      businessName,
      businessType,
      selectedMethods,
      email,
      currentStep: "details",
    });
  }, [firstName, lastName, idNumber, businessName, businessType, selectedMethods, email, updateData]);

  const validateEmail = (email: string): boolean => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const businessTypes = [
    { id: "food", label: t("businessTypeFood"), icon: "🍔" },
    { id: "clothing", label: t("businessTypeClothing"), icon: "👕" },
    { id: "electronics", label: t("businessTypeElectronics"), icon: "📱" },
    { id: "services", label: t("businessTypeServices"), icon: "✂️" },
    { id: "other", label: t("businessTypeOther"), icon: "📦" },
  ];

  const communicationMethods: CommunicationMethod[] = [
    { id: "sms", icon: Phone, label: t("commSms"), description: t("commSmsDesc") },
    { id: "whatsapp", icon: MessageSquare, label: t("commWhatsApp"), description: t("commWhatsAppDesc") },
    { id: "email", icon: Mail, label: t("commEmail"), description: t("commEmailDesc") },
  ];

  const toggleCommunicationMethod = (methodId: string) => {
    setSelectedMethods(prev => {
      if (prev.includes(methodId)) {
        // Don't allow deselecting if it's the only one
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== methodId);
      }
      return [...prev, methodId];
    });
  };

  const handleNext = async () => {
    if (step === "personal") {
      if (!firstName.trim() || !lastName.trim()) return;
      if (idNumber && !validateSAID(idNumber)) {
        setIdError(t("idNumberError"));
        return;
      }
      setStep("business");
    } else if (step === "business") {
      if (!businessName.trim()) return;
      setStep("communication");
    } else {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
      navigate("/onboarding/pin");
    }
  };

  const handleBack = () => {
    if (step === "personal") {
      navigate("/onboarding/phone");
    } else if (step === "business") {
      setStep("personal");
    } else {
      setStep("business");
    }
  };

  const isNextDisabled = () => {
    if (step === "personal") return !firstName.trim() || !lastName.trim() || !!idError;
    if (step === "business") return !businessName.trim();
    if (selectedMethods.length === 0) return true;
    if (selectedMethods.includes("email") && !validateEmail(email)) return true;
    return false;
  };

  const getCurrentStepNumber = () => {
    if (step === "personal") return 1;
    if (step === "business") return 2;
    return 3;
  };

  return (
    <div className="min-h-screen patela-app-bg flex flex-col">
      <ProgressSteps currentStep={3} totalSteps={5} />

      <div className="flex-1 flex flex-col patela-form-container py-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 text-muted-foreground mb-3 hover:text-foreground transition-colors text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </button>

        {step === "personal" && (
          <>
            <div className="text-center mb-4 animate-patela-slide-up">
              <div className="h-12 w-12 mx-auto mb-2 rounded-full bg-primary flex items-center justify-center patela-shadow-primary">
                <User className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground mb-0.5">
                {t("personalDetailsTitle")}
              </h1>
              <p className="text-muted-foreground text-xs">
                {t("personalDetailsDesc")}
              </p>
            </div>

            <div className="flex-1 space-y-3 animate-patela-fade-in">
              <h2 className="text-xs font-semibold text-foreground uppercase">Your Information</h2>
              
              <div className="space-y-1">
                <Label htmlFor="firstName" className="text-xs font-medium">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  className="h-10"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="lastName" className="text-xs font-medium">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  className="h-10"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="idNumber" className="text-xs font-medium">
                  ID Number <span className="text-muted-foreground font-normal">({t("optional")})</span>
                </Label>
                <Input
                  id="idNumber"
                  value={idNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setIdNumber(value);
                    if (value && !validateSAID(value)) {
                      setIdError(t("idNumberError"));
                    } else {
                      setIdError("");
                    }
                  }}
                  placeholder="13-digit SA ID number"
                  className={cn("h-10", idError && "border-destructive")}
                  maxLength={13}
                  inputMode="numeric"
                />
                {idError ? (
                  <p className="text-[10px] text-destructive">{idError}</p>
                ) : (
                  <p className="text-[10px] text-muted-foreground">Used for verification only</p>
                )}
              </div>
            </div>
          </>
        )}

        {step === "business" && (
          <>
            <div className="text-center mb-4 animate-patela-slide-up">
              <div className="h-12 w-12 mx-auto mb-2 rounded-full bg-accent flex items-center justify-center">
                <Store className="h-6 w-6 text-accent-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground mb-0.5">
                {t("businessDetailsTitle")}
              </h1>
              <p className="text-muted-foreground text-xs">
                {t("businessDetailsDesc")}
              </p>
            </div>

            <div className="flex-1 space-y-3 animate-patela-fade-in">
              <h2 className="text-xs font-semibold text-foreground uppercase">Business Information</h2>
              
              <div className="space-y-1">
                <Label htmlFor="businessName" className="text-xs font-medium">Business Name</Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter your business name"
                  className="h-10"
                />
                <p className="text-[10px] text-muted-foreground">This will appear on receipts</p>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">
                  Business Type <span className="text-muted-foreground font-normal">({t("optional")})</span>
                </Label>
                <div className="grid grid-cols-2 gap-1.5 mt-1">
                  {businessTypes.map((type) => {
                    const isSelected = businessType === type.id;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setBusinessType(type.id)}
                        className={cn(
                          "flex items-center gap-1.5 p-2 rounded-lg border-2 transition-all text-left",
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border bg-card hover:border-muted-foreground/30"
                        )}
                      >
                        <span className="text-base">{type.icon}</span>
                        <span className={cn(
                          "font-medium text-xs",
                          isSelected ? "text-primary" : "text-foreground"
                        )}>{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {step === "communication" && (
          <>
            <div className="text-center mb-4 animate-patela-slide-up">
              <div className="h-12 w-12 mx-auto mb-2 rounded-full bg-success flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-success-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground mb-0.5">
                {t("communicationTitle")}
              </h1>
              <p className="text-muted-foreground text-xs">
                {t("communicationDesc")}
              </p>
            </div>

            <div className="flex-1 space-y-2 animate-patela-fade-in">
              <h2 className="text-xs font-semibold text-foreground uppercase">Contact Preferences</h2>
              
              {communicationMethods.map((method) => {
                const isSelected = selectedMethods.includes(method.id);
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => toggleCommunicationMethod(method.id)}
                    className={cn(
                      "w-full flex items-center gap-2 p-2.5 rounded-lg border-2 transition-all text-left",
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-muted-foreground/30"
                    )}
                  >
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0",
                      isSelected ? "bg-primary" : "bg-muted"
                    )}>
                      <Icon className={cn(
                        "h-4 w-4",
                        isSelected ? "text-primary-foreground" : "text-muted-foreground"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-semibold text-sm",
                        isSelected ? "text-primary" : "text-foreground"
                      )}>{method.label}</p>
                      <p className="text-muted-foreground text-xs">{method.description}</p>
                    </div>
                    {isSelected && (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                );
              })}

              {selectedMethods.includes("email") && (
                <div className="space-y-1 animate-patela-fade-in mt-2">
                  <Label htmlFor="email" className="text-xs font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (e.target.value && !validateEmail(e.target.value)) {
                        setEmailError(t("emailError"));
                      } else {
                        setEmailError("");
                      }
                    }}
                    placeholder="your@email.com"
                    className={cn("h-10", emailError && "border-destructive")}
                  />
                  {emailError ? (
                    <p className="text-[10px] text-destructive">{emailError}</p>
                  ) : (
                    <p className="text-[10px] text-muted-foreground">For receipts and updates</p>
                  )}
                </div>
              )}

              <p className="text-[10px] text-muted-foreground text-center mt-2">
                {t("communicationNote")}
              </p>
            </div>
          </>
        )}

        <div className="pt-3 pb-4">
          <Button
            variant="hero"
            size="lg"
            className="w-full"
            onClick={handleNext}
            disabled={isLoading || isNextDisabled()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                {step === "communication" ? "Complete Setup" : "Continue"}
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
