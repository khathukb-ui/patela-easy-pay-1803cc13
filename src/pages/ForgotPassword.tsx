import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PatelaLogo } from "@/components/patela/PatelaLogo";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Mail, Phone, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

type ResetMethod = "email" | "phone";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [method, setMethod] = useState<ResetMethod>("phone");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let resetEmail: string;

      if (method === "email") {
        if (!email.trim()) {
          toast.error("Please enter your email address");
          setLoading(false);
          return;
        }
        resetEmail = email;
      } else {
        if (!phone.trim()) {
          toast.error("Please enter your phone number");
          setLoading(false);
          return;
        }
        // Convert phone to pseudo-email used in auth
        const formatted = phone.startsWith("+27") ? phone : `+27${phone.slice(1)}`;
        resetEmail = `${formatted.replace(/\+/g, "")}@phone.patela.app`;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setSent(true);
        toast.success("Password reset link sent!");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen patela-app-bg flex flex-col">
        <header className="bg-primary px-6 py-8 text-center">
          <PatelaLogo size="xl" variant="dark" className="mx-auto" />
        </header>
        <main className="flex-1 px-6 py-12 flex flex-col items-center">
          <div className="max-w-sm mx-auto text-center space-y-6">
            <div className="h-20 w-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
              <Send className="h-10 w-10 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Check your {method === "email" ? "inbox" : "messages"}</h2>
            <p className="text-muted-foreground">
              We've sent a password reset link to your {method === "email" ? "email address" : "phone's associated email"}. 
              Click the link to set a new password.
            </p>
            <Button variant="outline" className="w-full" onClick={() => navigate("/auth")}>
              Back to Sign In
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen patela-app-bg flex flex-col">
      <header className="bg-primary px-6 py-8 text-center">
        <PatelaLogo size="xl" variant="dark" className="mx-auto" />
        <p className="text-primary-foreground/80 mt-4">Reset your password</p>
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="max-w-sm mx-auto">
          <button onClick={() => navigate("/auth")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </button>

          {/* Method Toggle */}
          <div className="flex mb-6 bg-muted rounded-xl p-1">
            <button
              type="button"
              onClick={() => setMethod("phone")}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                method === "phone" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Phone className="h-4 w-4" />
              Phone
            </button>
            <button
              type="button"
              onClick={() => setMethod("email")}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                method === "email" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mail className="h-4 w-4" />
              Email
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {method === "phone" ? (
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground font-semibold">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="phone" type="tel" placeholder="081 234 5678" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-12 h-14 text-lg" />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-semibold">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-12 h-14 text-lg" />
                </div>
              </div>
            )}

            <Button type="submit" size="xl" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold" disabled={loading}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send Reset Link"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
