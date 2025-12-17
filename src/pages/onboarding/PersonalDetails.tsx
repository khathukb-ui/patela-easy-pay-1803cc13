import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressSteps } from "@/components/patela/ProgressSteps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, Loader2, User, Store, MessageSquare, Mail, Phone, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

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
  const [step, setStep] = useState<Step>("personal");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Personal details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [idError, setIdError] = useState("");

  // Business details
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");

  // Communication preferences
  const [selectedMethods, setSelectedMethods] = useState<string[]>(["sms"]);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

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

      <div className="flex-1 flex flex-col px-6 py-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          {t("back")}
        </button>

        {step === "personal" && (
          <>
            <div className="text-center mb-8 animate-patela-slide-up">
              <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center patela-shadow-primary">
                <User className="h-10 w-10 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {t("personalDetailsTitle")}
              </h1>
              <p className="text-muted-foreground text-lg">
                {t("personalDetailsDesc")}
              </p>
            </div>

            <div className="flex-1 space-y-6 animate-patela-fade-in">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-base font-medium">
                  {t("firstName")}
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={t("firstNamePlaceholder")}
                  className="h-14 text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-base font-medium">
                  {t("lastName")}
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={t("lastNamePlaceholder")}
                  className="h-14 text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="idNumber" className="text-base font-medium">
                  {t("idNumber")} <span className="text-muted-foreground font-normal">({t("optional")})</span>
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
                  placeholder={t("idNumberPlaceholder")}
                  className={cn("h-14 text-lg", idError && "border-destructive")}
                  maxLength={13}
                  inputMode="numeric"
                />
                {idError && (
                  <p className="text-sm text-destructive">{idError}</p>
                )}
              </div>
            </div>
          </>
        )}

        {step === "business" && (
          <>
            <div className="text-center mb-8 animate-patela-slide-up">
              <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center">
                <Store className="h-10 w-10 text-accent-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {t("businessDetailsTitle")}
              </h1>
              <p className="text-muted-foreground text-lg">
                {t("businessDetailsDesc")}
              </p>
            </div>

            <div className="flex-1 space-y-6 animate-patela-fade-in">
              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-base font-medium">
                  {t("businessName")}
                </Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder={t("businessNamePlaceholder")}
                  className="h-14 text-lg"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">
                  {t("businessTypeLabel")} <span className="text-muted-foreground font-normal">({t("optional")})</span>
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {businessTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setBusinessType(type.id)}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border-2 transition-all",
                        businessType === type.id
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-primary/50"
                      )}
                    >
                      <span className="text-2xl">{type.icon}</span>
                      <span className="font-medium text-foreground">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {step === "communication" && (
          <>
            <div className="text-center mb-8 animate-patela-slide-up">
              <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-success flex items-center justify-center">
                <MessageSquare className="h-10 w-10 text-success-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {t("communicationTitle")}
              </h1>
              <p className="text-muted-foreground text-lg">
                {t("communicationDesc")}
              </p>
            </div>

            <div className="flex-1 space-y-4 animate-patela-fade-in">
              {communicationMethods.map((method) => {
                const isSelected = selectedMethods.includes(method.id);
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => toggleCommunicationMethod(method.id)}
                    className={cn(
                      "w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all text-left",
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/50"
                    )}
                  >
                    <div className={cn(
                      "h-12 w-12 rounded-full flex items-center justify-center",
                      isSelected ? "bg-primary" : "bg-muted"
                    )}>
                      <Icon className={cn(
                        "h-6 w-6",
                        isSelected ? "text-primary-foreground" : "text-muted-foreground"
                      )} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground text-lg">{method.label}</p>
                      <p className="text-muted-foreground">{method.description}</p>
                    </div>
                    {isSelected && (
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-5 w-5 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                );
              })}

              {selectedMethods.includes("email") && (
                <div className="space-y-2 animate-patela-fade-in">
                  <Label htmlFor="email" className="text-base font-medium">
                    {t("emailAddress")}
                  </Label>
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
                    placeholder={t("emailPlaceholder")}
                    className={cn("h-14 text-lg", emailError && "border-destructive")}
                  />
                  {emailError && (
                    <p className="text-sm text-destructive">{emailError}</p>
                  )}
                </div>
              )}

              <p className="text-sm text-muted-foreground text-center mt-4">
                {t("communicationNote")}
              </p>
            </div>
          </>
        )}

        <div className="pt-6">
          <Button
            variant="hero"
            size="xl"
            className="w-full"
            onClick={handleNext}
            disabled={isLoading || isNextDisabled()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {t("loading")}
              </>
            ) : (
              <>
                {step === "communication" ? t("continue") : t("next")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
