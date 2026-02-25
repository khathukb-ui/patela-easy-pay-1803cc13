import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PatelaLogo } from "@/components/patela/PatelaLogo";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Phone, User } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");
const phoneSchema = z.string().regex(/^(\+27|0)[6-8][0-9]{8}$/, "Please enter a valid SA phone number");
const passwordSchema = z.string().min(8, "Password must be at least 8 characters");

type LoginMethod = "email" | "phone";

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("phone");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && !authLoading) {
      navigate("/home");
    }
  }, [user, authLoading, navigate]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (loginMethod === "email") {
      const r = emailSchema.safeParse(email);
      if (!r.success) newErrors.identifier = r.error.errors[0].message;
    } else {
      const r = phoneSchema.safeParse(phone);
      if (!r.success) newErrors.identifier = r.error.errors[0].message;
    }
    
    const pr = passwordSchema.safeParse(password);
    if (!pr.success) newErrors.password = pr.error.errors[0].message;
    
    if (isSignUp) {
      if (!fullName.trim()) newErrors.fullName = "Full name is required";
      if (password !== confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getIdentifier = () => {
    if (loginMethod === "email") return email;
    return phone.startsWith("+27") ? phone : `+27${phone.slice(1)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    const identifier = getIdentifier();
    
    try {
      if (isSignUp) {
        const data: { full_name: string; password: string; email?: string; phone?: string } = {
          full_name: fullName,
          password,
        };
        if (loginMethod === "email") data.email = email;
        else data.phone = identifier;

        const { error } = await signUp(data);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Account created!");
          navigate("/home");
        }
      } else {
        const { error } = await signIn(identifier, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Welcome back!");
          navigate("/home");
        }
      }
    } catch {
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
      <header className="bg-primary px-6 py-8 text-center">
        <PatelaLogo size="xl" variant="dark" className="mx-auto" />
        <p className="text-primary-foreground/80 mt-4">
          {isSignUp ? "Create your account" : "Welcome back"}
        </p>
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="max-w-sm mx-auto">
          {/* Login Method Toggle */}
          <div className="flex mb-6 bg-muted rounded-xl p-1">
            <button
              type="button"
              onClick={() => { setLoginMethod("phone"); setErrors({}); }}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                loginMethod === "phone" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Phone className="h-4 w-4" />
              Phone
            </button>
            <button
              type="button"
              onClick={() => { setLoginMethod("email"); setErrors({}); }}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                loginMethod === "email" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mail className="h-4 w-4" />
              Email
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name (Sign Up only) */}
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-foreground font-semibold">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="fullName"
                    placeholder="Thembi Ndlovu"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-12 h-14 text-lg"
                  />
                </div>
                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
              </div>
            )}

            {/* Phone or Email */}
            {loginMethod === "phone" ? (
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground font-semibold">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="phone" type="tel" placeholder="081 234 5678" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-12 h-14 text-lg" />
                </div>
                {errors.identifier && <p className="text-sm text-destructive">{errors.identifier}</p>}
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-semibold">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-12 h-14 text-lg" />
                </div>
                {errors.identifier && <p className="text-sm text-destructive">{errors.identifier}</p>}
              </div>
            )}

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-semibold">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-14 text-lg"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            {/* Confirm Password (Sign Up only) */}
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground font-semibold">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-12 h-14 text-lg"
                  />
                </div>
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
              </div>
            )}

            <Button type="submit" size="xl" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold" disabled={loading}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <>
                  {isSignUp ? "Create Account" : "Sign In"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            {isSignUp ? (
              <>
                <p className="text-muted-foreground">Already have an account?</p>
                <Button variant="link" className="text-primary font-semibold" onClick={() => { setIsSignUp(false); setErrors({}); }}>
                  Sign in instead
                </Button>
              </>
            ) : (
              <>
                <p className="text-muted-foreground">Don't have an account?</p>
                <Button variant="link" className="text-primary font-semibold" onClick={() => { setIsSignUp(true); setErrors({}); }}>
                  Create one now
                </Button>
              </>
            )}
          </div>

          <div className="mt-6 text-center">
            <Button variant="ghost" className="text-muted-foreground" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
