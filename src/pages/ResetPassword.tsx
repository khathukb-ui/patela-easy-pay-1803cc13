import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PatelaLogo } from "@/components/patela/PatelaLogo";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const passwordChecks = [
  { label: "8+ characters", test: (v: string) => v.length >= 8 },
  { label: "Uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "Number", test: (v: string) => /[0-9]/.test(v) },
  { label: "Special character", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    // Listen for the PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    // Also check URL hash for recovery type
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    return () => subscription.unsubscribe();
  }, []);

  const allChecksPassed = passwordChecks.every((c) => c.test(password));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!allChecksPassed) {
      toast.error("Password does not meet requirements");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        toast.error(error.message);
      } else {
        setSuccess(true);
        toast.success("Password updated successfully!");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen patela-app-bg flex flex-col">
        <header className="bg-primary px-6 py-8 text-center">
          <PatelaLogo size="xl" variant="dark" className="mx-auto" />
        </header>
        <main className="flex-1 px-6 py-12 flex flex-col items-center">
          <div className="max-w-sm mx-auto text-center space-y-6">
            <div className="h-20 w-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Password Updated</h2>
            <p className="text-muted-foreground">Your password has been reset successfully. You can now sign in with your new password.</p>
            <Button size="xl" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (!isRecovery) {
    return (
      <div className="min-h-screen patela-app-bg flex flex-col items-center justify-center px-6">
        <div className="text-center space-y-4">
          <PatelaLogo size="xl" className="mx-auto" />
          <h2 className="text-xl font-bold text-foreground">Invalid Reset Link</h2>
          <p className="text-muted-foreground">This link is invalid or has expired. Please request a new password reset.</p>
          <Button variant="outline" onClick={() => navigate("/forgot-password")}>Request New Link</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen patela-app-bg flex flex-col">
      <header className="bg-primary px-6 py-8 text-center">
        <PatelaLogo size="xl" variant="dark" className="mx-auto" />
        <p className="text-primary-foreground/80 mt-4">Set your new password</p>
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="max-w-sm mx-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-semibold">New Password</Label>
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
              {password.length > 0 && (
                <div className="grid grid-cols-2 gap-1.5 mt-2">
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
              {confirmPassword && password !== confirmPassword && (
                <p className="text-sm text-destructive">Passwords don't match</p>
              )}
            </div>

            <Button type="submit" size="xl" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold" disabled={loading || !allChecksPassed}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Password"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
