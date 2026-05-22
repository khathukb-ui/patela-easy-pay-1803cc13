import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingHeader } from "@/components/patela/OnboardingHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, Loader2, User, Store, MessageSquare, Mail, Phone, Check, Lock, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { useOnboardingData } from "@/hooks/use-onboarding-data";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { z } from "zod";

type Step = "personal" | "business" | "communication";

interface CommunicationMethod {
  id: string;
  icon: React.ElementType;
  label: string;
  description: string;
}

const phoneSchema = z.string().regex(/^(\+27|0)[6-8][0-9]{8}$/, "Please enter a valid SA phone number");
const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "At least one uppercase letter")
  .regex(/[0-9]/, "At least one number")
  .regex(/[^A-Za-z0-9]/, "At least one special character");

const passwordChecks = [
  { label: "8+ characters", test: (v: string) => v.length >= 8 },
  { label: "Uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "Number", test: (v: string) => /[0-9]/.test(v) },
  { label: "Special character", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

// Validate SA ID number format and checksum (Luhn algorithm)
const validateSAID = (id: string): boolean => {
  if (!id) return true; // Optional field
  if (!/^\d{13}$/.test(id)) return false;
  const month = parseInt(id.substring(2, 4));
  const day = parseInt(id.substring(4, 6));
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
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
  const { data: onboardingData, updateData, clearData } = useOnboardingData();
  const { signUp } = useAuth();
  const [step, setStep] = useState<Step>("personal");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Personal details
  const [firstName, setFirstName] = useState(onboardingData.firstName);
  const [lastName, setLastName] = useState(onboardingData.lastName);
  const [idNumber, setIdNumber] = useState(onboardingData.idNumber);
  const [idError, setIdError] = useState("");

  // Account / registration fields
  const [phone, setPhone] = useState(onboardingData.phone);
  const [email, setEmail] = useState(onboardingData.email);
  const [password, setPassword] = useState(onboardingData.password);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Business details
  const [businessName, setBusinessName] = useState(onboardingData.businessName);
  const [businessType, setBusinessType] = useState(onboardingData.businessType);

  // Communication preferences
  const [selectedMethods, setSelectedMethods] = useState<string[]>(onboardingData.selectedMethods);
  const [commEmail, setCommEmail] = useState(onboardingData.email);

  // Save data when it changes
  useEffect(() => {
    updateData({
      firstName, lastName, idNumber,
      phone, email, password,
      businessName, businessType,
      selectedMethods,
      currentStep: "details",
    });
  }, [firstName, lastName, idNumber, phone, email, password, businessName, businessType, selectedMethods, updateData]);

  const validateEmail = (val: string): boolean => {
    if (!val) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
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
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== methodId);
      }
      return [...prev, methodId];
    });
  };

  const handleNext = async () => {
    if (step === "personal") {
      // Validate all personal + account fields
      let hasError = false;

      if (!firstName.trim() || !lastName.trim()) return;

      if (idNumber && !validateSAID(idNumber)) {
        setIdError(t("idNumberError"));
        hasError = true;
      }

      const phoneResult = phoneSchema.safeParse(phone);
      if (!phoneResult.success) {
        setPhoneError(phoneResult.error.errors[0].message);
        hasError = true;
      } else {
        setPhoneError("");
      }

      if (email.trim()) {
        const emailResult = emailSchema.safeParse(email);
        if (!emailResult.success) {
          setEmailError(emailResult.error.errors[0].message);
          hasError = true;
        } else {
          setEmailError("");
        }
      } else {
        setEmailError("");
      }

      const pwResult = passwordSchema.safeParse(password);
      if (!pwResult.success) {
        setPasswordError(pwResult.error.errors[0].message);
        hasError = true;
      } else {
        setPasswordError("");
      }

      if (password !== confirmPassword) {
        setConfirmPasswordError("Passwords don't match");
        hasError = true;
      } else {
        setConfirmPasswordError("");
      }

      if (hasError) return;
      setStep("business");
    } else if (step === "business") {
      if (!businessName.trim()) return;
      setStep("communication");
    } else {
      // Final step: create account
      setIsLoading(true);
      try {
        const formattedPhone = phone.startsWith("+27") ? phone : `+27${phone.slice(1)}`;
        const signUpData: { full_name: string; phone: string; password: string; email?: string } = {
          full_name: `${firstName} ${lastName}`,
          phone: formattedPhone,
          password,
        };
        if (email.trim()) signUpData.email = email;

        const { error } = await signUp(signUpData);
        if (error) {
          toast.error(error.message);
          setIsLoading(false);
          return;
        }
        clearData();
        toast.success("Account created!");
        navigate("/onboarding/pin");
      } catch {
        toast.error("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step === "personal") {
      navigate("/onboarding/language");
    } else if (step === "business") {
      setStep("personal");
    } else {
      setStep("business");
    }
  };

  const isNextDisabled = () => {
    if (step === "personal") {
      return !firstName.trim() || !lastName.trim() || !!idError || !phone.trim() || !password.trim() || !confirmPassword.trim();
    }
    if (step === "business") return !businessName.trim();
    if (selectedMethods.length === 0) return true;
    if (selectedMethods.includes("email") && !validateEmail(commEmail)) return true;
    return false;
  };

  return (
    <div className="min-h-screen patela-app-bg flex flex-col">
      <OnboardingHeader currentStep={3} totalSteps={5} />

      <div className="flex-1 flex flex-col patela-form-container py-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground mb-3 hover:text-foreground transition-colors text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </button>

        {step === "personal" && (
          <>
            <div className="text-center mb-4 animate-patela-slide-up">
              <div className="h-20 w-20 mx-auto mb-3 rounded-full bg-primary flex items-center justify-center patela-shadow-primary">
                <User className="h-10 w-10 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {t("personalDetailsTitle")}
              </h1>
              <p className="text-muted-foreground text-base">
                {t("personalDetailsDesc")}
              </p>
            </div>

            <div className="flex-1 space-y-3 animate-patela-fade-in overflow-y-auto">
              <h2 className="text-xs font-semibold text-foreground uppercase tracking-wide">Your Information</h2>
              
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter your first name" className="h-12" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter your last name" className="h-12" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="idNumber" className="text-sm font-medium">
                  ID Number <span className="text-muted-foreground font-normal text-xs">({t("optional")})</span>
                </Label>
                <Input
                  id="idNumber"
                  value={idNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setIdNumber(value);
                    setIdError(value && !validateSAID(value) ? t("idNumberError") : "");
                  }}
                  placeholder="13-digit SA ID number"
                  className={cn("h-12", idError && "border-destructive")}
                  maxLength={13}
                  inputMode="numeric"
                />
                {idError ? (
                  <p className="text-xs text-destructive mt-1">{idError}</p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">Used for verification purposes only</p>
                )}
              </div>

              {/* Account fields */}
              <h2 className="text-xs font-semibold text-foreground uppercase tracking-wide pt-2">Account Details</h2>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="phone" type="tel" placeholder="081 234 5678"
                    value={phone} onChange={(e) => { setPhone(e.target.value); setPhoneError(""); }}
                    className={cn("pl-12 h-12", phoneError && "border-destructive")}
                  />
                </div>
                {phoneError && <p className="text-xs text-destructive">{phoneError}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address <span className="text-muted-foreground font-normal text-xs">(optional)</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email" type="email" placeholder="you@example.com"
                    value={email} onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                    className={cn("pl-12 h-12", emailError && "border-destructive")}
                  />
                </div>
                {emailError && <p className="text-xs text-destructive">{emailError}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
                    className={cn("pl-12 pr-12 h-12", passwordError && "border-destructive")}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {passwordError && <p className="text-xs text-destructive">{passwordError}</p>}
                {password.length > 0 && (
                  <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                    {passwordChecks.map((check) => {
                      const passed = check.test(password);
                      return (
                        <div key={check.label} className={`flex items-center gap-1.5 text-xs ${passed ? "text-emerald-600" : "text-muted-foreground"}`}>
                          <div className={`h-1.5 w-1.5 rounded-full ${passed ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
                          {check.label}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setConfirmPasswordError(""); }}
                    className={cn("pl-12 h-12", confirmPasswordError && "border-destructive")}
                  />
                </div>
                {confirmPasswordError && <p className="text-xs text-destructive">{confirmPasswordError}</p>}
              </div>
            </div>
          </>
        )}

        {step === "business" && (
          <>
            <div className="text-center mb-4 animate-patela-slide-up">
              <div className="h-20 w-20 mx-auto mb-3 rounded-full bg-accent flex items-center justify-center">
                <Store className="h-10 w-10 text-accent-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {t("businessDetailsTitle")}
              </h1>
              <p className="text-muted-foreground text-base">
                {t("businessDetailsDesc")}
              </p>
            </div>

            <div className="flex-1 space-y-3 animate-patela-fade-in">
              <h2 className="text-xs font-semibold text-foreground uppercase tracking-wide">Business Information</h2>
              
              <div className="space-y-1.5">
                <Label htmlFor="businessName" className="text-sm font-medium">Business Name</Label>
                <Input id="businessName" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Enter your business name" className="h-12" />
                <p className="text-xs text-muted-foreground mt-1">This will appear on customer receipts</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Business Type <span className="text-muted-foreground font-normal text-xs">({t("optional")})</span>
                </Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {businessTypes.map((type) => {
                    const isSelected = businessType === type.id;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setBusinessType(type.id)}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-xl border-2 transition-all",
                          isSelected ? "border-primary bg-primary/10" : "border-border bg-card hover:border-muted-foreground/30"
                        )}
                      >
                        <span className="text-xl">{type.icon}</span>
                        <span className={cn("font-medium text-sm", isSelected ? "text-primary" : "text-foreground")}>{type.label}</span>
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
              <div className="h-20 w-20 mx-auto mb-3 rounded-full bg-success flex items-center justify-center">
                <MessageSquare className="h-10 w-10 text-success-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {t("communicationTitle")}
              </h1>
              <p className="text-muted-foreground text-base">
                {t("communicationDesc")}
              </p>
            </div>

            <div className="flex-1 space-y-2 animate-patela-fade-in">
              <h2 className="text-xs font-semibold text-foreground uppercase tracking-wide">Contact Preferences</h2>
              
              {communicationMethods.map((method) => {
                const isSelected = selectedMethods.includes(method.id);
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => toggleCommunicationMethod(method.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                      isSelected ? "border-primary bg-primary/10" : "border-border bg-card hover:border-muted-foreground/30"
                    )}
                  >
                    <div className={cn("h-10 w-10 rounded-full flex items-center justify-center transition-colors", isSelected ? "bg-primary" : "bg-muted")}>
                      <Icon className={cn("h-5 w-5", isSelected ? "text-primary-foreground" : "text-muted-foreground")} />
                    </div>
                    <div className="flex-1">
                      <p className={cn("font-semibold", isSelected ? "text-primary" : "text-foreground")}>{method.label}</p>
                      <p className="text-muted-foreground text-sm">{method.description}</p>
                    </div>
                    {isSelected && (
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                );
              })}

              {selectedMethods.includes("email") && (
                <div className="space-y-1.5 animate-patela-fade-in mt-3">
                  <Label htmlFor="commEmail" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="commEmail"
                    type="email"
                    value={commEmail}
                    onChange={(e) => setCommEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="h-12"
                  />
                  <p className="text-xs text-muted-foreground mt-1">For receipts and updates</p>
                </div>
              )}

              <p className="text-xs text-muted-foreground text-center mt-4">
                {t("communicationNote")}
              </p>
            </div>
          </>
        )}

        <div className="pt-4 pb-4 flex flex-col items-center">
          <Button
            variant="default"
            size="xl"
            className="w-[300px] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
            onClick={handleNext}
            disabled={isLoading || isNextDisabled()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                {step === "communication" ? "Create Account" : "Continue"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
