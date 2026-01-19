import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PatelaLogo } from "@/components/patela/PatelaLogo";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Phone } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");
const phoneSchema = z.string().regex(/^(\+27|0)[6-8][0-9]{8}$/, "Please enter a valid SA phone number");
const pinSchema = z.string().length(4, "PIN must be exactly 4 digits").regex(/^\d{4}$/, "PIN must be 4 digits");

type LoginMethod = "email" | "phone";

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("phone");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; pin?: string; confirmPin?: string }>({});

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      navigate("/home");
    }
  }, [user, authLoading, navigate]);

  const validate = () => {
    const newErrors: { identifier?: string; pin?: string; confirmPin?: string } = {};
    
    if (loginMethod === "email") {
      const emailResult = emailSchema.safeParse(email);
      if (!emailResult.success) {
        newErrors.identifier = emailResult.error.errors[0].message;
      }
    } else {
      const phoneResult = phoneSchema.safeParse(phone);
      if (!phoneResult.success) {
        newErrors.identifier = phoneResult.error.errors[0].message;
      }
    }
    
    const pinResult = pinSchema.safeParse(pin);
    if (!pinResult.success) {
      newErrors.pin = pinResult.error.errors[0].message;
    }
    
    if (isSignUp && pin !== confirmPin) {
      newErrors.confirmPin = "PINs don't match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Convert phone to email format for Supabase auth (phone@patela.app)
  const getAuthEmail = () => {
    if (loginMethod === "email") {
      return email;
    }
    // Normalize phone number and use as email
    const normalizedPhone = phone.startsWith("+27") ? phone : `+27${phone.slice(1)}`;
    return `${normalizedPhone.replace("+", "")}@patela.app`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    const authEmail = getAuthEmail();
    
    try {
      if (isSignUp) {
        const { error } = await signUp(authEmail, pin);
        if (error) {
          if (error.message.includes("already registered")) {
            toast.error(loginMethod === "phone" 
              ? "This phone number is already registered. Please sign in instead."
              : "This email is already registered. Please sign in instead.");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Account created! You can now sign in.");
          navigate("/onboarding/language");
        }
      } else {
        const { error } = await signIn(authEmail, pin);
        if (error) {
          if (error.message.includes("Invalid login")) {
            toast.error(loginMethod === "phone"
              ? "Invalid phone number or PIN. Please try again."
              : "Invalid email or PIN. Please try again.");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Welcome back!");
          navigate("/home");
        }
      }
    } catch (e) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen patela-app-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen patela-app-bg flex flex-col">
      {/* Header */}
      <header className="bg-primary px-6 py-8 text-center">
        <PatelaLogo size="lg" variant="light" />
        <p className="text-primary-foreground/80 mt-2">
          {isSignUp ? "Create your account" : "Welcome back"}
        </p>
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="max-w-sm mx-auto">
          {/* Login Method Toggle */}
          <div className="flex mb-6 bg-muted rounded-xl p-1">
            <button
              type="button"
              onClick={() => {
                setLoginMethod("phone");
                setErrors({});
              }}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                loginMethod === "phone"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Phone className="h-4 w-4" />
              Phone
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMethod("email");
                setErrors({});
              }}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                loginMethod === "email"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mail className="h-4 w-4" />
              Email
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Phone or Email based on toggle */}
            {loginMethod === "phone" ? (
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground font-semibold">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="081 234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-12 h-14 text-lg"
                  />
                </div>
                {errors.identifier && (
                  <p className="text-sm text-destructive">{errors.identifier}</p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-semibold">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 text-lg"
                  />
                </div>
                {errors.identifier && (
                  <p className="text-sm text-destructive">{errors.identifier}</p>
                )}
              </div>
            )}

            {/* PIN */}
            <div className="space-y-2">
              <Label htmlFor="pin" className="text-foreground font-semibold">
                4-Digit PIN
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="pin"
                  type={showPin ? "text" : "password"}
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setPin(value);
                  }}
                  className="pl-12 pr-12 h-14 text-lg tracking-widest text-center"
                  inputMode="numeric"
                  maxLength={4}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors?.pin && (
                <p className="text-sm text-destructive">{errors.pin}</p>
              )}
            </div>

            {/* Confirm PIN (Sign Up only) */}
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPin" className="text-foreground font-semibold">
                  Confirm PIN
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPin"
                    type={showPin ? "text" : "password"}
                    placeholder="••••"
                    value={confirmPin}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setConfirmPin(value);
                    }}
                    className="pl-12 h-14 text-lg tracking-widest text-center"
                    inputMode="numeric"
                    maxLength={4}
                  />
                </div>
                {errors?.confirmPin && (
                  <p className="text-sm text-destructive">{errors.confirmPin}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              size="xl"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {isSignUp ? "Create Account" : "Sign In"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          {/* Toggle Sign In / Sign Up */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </p>
            <Button
              variant="link"
              className="text-primary font-semibold"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrors({});
              }}
            >
              {isSignUp ? "Sign in instead" : "Create one now"}
            </Button>
          </div>

          {/* Back to landing */}
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              className="text-muted-foreground"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
