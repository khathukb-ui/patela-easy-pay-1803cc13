import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PatelaLogo } from "@/components/patela/PatelaLogo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function PaygateAuth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = useState(searchParams.get("mode") === "signup");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Signup fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");

  const handleSignup = async () => {
    if (!fullName || !email || !password || !businessName) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, is_paygate_merchant: true } },
      });

      if (error) throw error;
      if (!data.user) throw new Error("Signup failed");

      // Create merchant record
      const { error: merchantError } = await supabase.from("merchants").insert({
        user_id: data.user.id,
        business_name: businessName,
        business_type: "other",
        contact_email: email,
      });

      if (merchantError) throw merchantError;

      // Generate sandbox API keys
      const { error: keyError } = await supabase.rpc("generate_merchant_api_keys", {
        p_merchant_id: (await supabase.from("merchants").select("id").eq("user_id", data.user.id).single()).data?.id,
        p_environment: "sandbox",
      });

      toast.success("Account created! Please check your email to verify.");
      navigate("/paygate/onboarding");
    } catch (e: any) {
      toast.error(e.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate("/paygate/dashboard");
    } catch (e: any) {
      toast.error(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--patela-gradient-hero)" }}>
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16">
        <div className="flex items-center gap-2 mb-8">
          <PatelaLogo size="xl" variant="dark" />
          <span className="text-accent font-bold text-lg border border-accent/40 rounded-full px-3 py-1">PayGate</span>
        </div>
        <h2 className="text-3xl font-bold text-primary-foreground mb-4">
          The payment gateway built for South African merchants
        </h2>
        <p className="text-primary-foreground/70 text-lg">
          Accept card payments, get fast settlements, and grow your business with our developer-friendly API.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-card rounded-3xl p-8 shadow-xl border border-border">
          <button onClick={() => navigate("/paygate")} className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          <div className="lg:hidden flex items-center gap-2 mb-6">
            <PatelaLogo size="md" />
            <span className="text-accent font-bold text-sm border border-accent/40 rounded-full px-2 py-0.5">PayGate</span>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-1">
            {isSignup ? "Create your merchant account" : "Welcome back"}
          </h1>
          <p className="text-muted-foreground mb-6 text-sm">
            {isSignup ? "Start accepting payments in minutes" : "Sign in to your PayGate dashboard"}
          </p>

          <div className="space-y-4">
            {isSignup && (
              <>
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="John Doe" value={fullName} onChange={e => setFullName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input id="businessName" placeholder="My Company (Pty) Ltd" value={businessName} onChange={e => setBusinessName(e.target.value)} />
                </div>
              </>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@company.co.za" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" size="lg" disabled={loading} onClick={isSignup ? handleSignup : handleSignin}>
              {loading ? "Please wait..." : isSignup ? "Create Account" : "Sign In"}
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button className="text-accent font-semibold hover:underline" onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
