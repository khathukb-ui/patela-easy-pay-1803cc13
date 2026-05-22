import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PatelaLogo } from "@/components/patela/PatelaLogo";
import { ArrowRight, Shield, Zap, CreditCard, Globe, Code, BarChart3, Banknote, CheckCircle2 } from "lucide-react";

export default function PaygateLanding() {
  const navigate = useNavigate();

  const features = [
    { icon: CreditCard, title: "Accept Card Payments", desc: "Visa, Mastercard, and more. Securely process payments online." },
    { icon: Code, title: "Developer-Friendly API", desc: "Simple RESTful API with SDKs. Integrate in minutes, not days." },
    { icon: Shield, title: "PCI DSS Compliant", desc: "Bank-level encryption. Your customers' data is always safe." },
    { icon: Zap, title: "Instant Settlement", desc: "Get your money fast. Same-day or next-day payouts available." },
    { icon: Globe, title: "Multi-Currency", desc: "Accept payments in ZAR and expand to other currencies." },
    { icon: BarChart3, title: "Real-Time Analytics", desc: "Track every transaction. Detailed reports and insights." },
  ];

  const steps = [
    { step: 1, title: "Create Account", desc: "Sign up and submit your business documents for verification." },
    { step: 2, title: "Get Approved", desc: "Our team reviews your KYC documents within 24-48 hours." },
    { step: 3, title: "Integrate & Earn", desc: "Use our API keys to start accepting payments immediately." },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-b border-primary-foreground/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PatelaLogo size="lg" variant="dark" />
            <span className="text-accent font-bold text-sm border border-accent/40 rounded-full px-2 py-0.5">PayGate</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm font-medium">Features</a>
            <a href="#how-it-works" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm font-medium">How It Works</a>
            <a href="#pricing" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm font-medium">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10" onClick={() => navigate("/paygate/auth")}>
              Sign In
            </Button>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" onClick={() => navigate("/paygate/auth?mode=signup")}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center pt-16" style={{ background: "var(--patela-gradient-hero)" }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Payment Gateway for Africa
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight mb-6">
              Accept Payments.
              <br />
              <span className="text-accent">Scale Your Business.</span>
            </h1>
            <p className="text-lg sm:text-xl text-primary-foreground/80 mb-8 max-w-lg">
              Patela PayGate is the payment gateway built for South African merchants. Simple API, fast settlements, and world-class security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="xl" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg px-8" onClick={() => navigate("/paygate/auth?mode=signup")}>
                Start Accepting Payments
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="xl" className="bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 font-semibold border border-primary-foreground/20" onClick={() => navigate("/paygate/auth")}>
                <Code className="mr-2 h-5 w-5" />
                View API Docs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-3">Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Everything You Need to Get Paid</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  <f.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 bg-secondary/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-3">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Go Live in 3 Steps</h2>
          </div>
          <div className="space-y-6">
            {steps.map((s) => (
              <div key={s.step} className="flex gap-6 items-start bg-card rounded-2xl p-6 border border-border">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">{s.step}</div>
                <div>
                  <h3 className="font-bold text-foreground text-lg mb-1">{s.title}</h3>
                  <p className="text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-3">Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground mb-12">No monthly fees. No hidden charges. Only pay when you get paid.</p>
          <div className="bg-card rounded-3xl border-2 border-accent p-8 sm:p-12 max-w-md mx-auto">
            <p className="text-5xl font-extrabold text-foreground mb-2">2.9% <span className="text-lg font-normal text-muted-foreground">+ R2.00</span></p>
            <p className="text-muted-foreground mb-8">per successful transaction</p>
            <ul className="space-y-3 text-left mb-8">
              {["No setup fees", "No monthly fees", "Free sandbox testing", "Same-day payouts available", "24/7 support"].map(item => (
                <li key={item} className="flex items-center gap-3 text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button size="xl" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold" onClick={() => navigate("/paygate/auth?mode=signup")}>
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6" style={{ background: "var(--patela-gradient-hero)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">Ready to grow your business?</h2>
          <p className="text-lg text-primary-foreground/80 mb-8">Join thousands of South African merchants using Patela PayGate.</p>
          <Button size="xl" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg px-8" onClick={() => navigate("/paygate/auth?mode=signup")}>
            Create Your Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <PatelaLogo size="md" variant="dark" />
          <span className="text-accent font-bold text-sm">PayGate</span>
        </div>
        <p className="text-primary-foreground/50 text-sm">© {new Date().getFullYear()} Patela. All rights reserved.</p>
        <button onClick={() => navigate("/")} className="text-accent/70 hover:text-accent text-sm mt-2 underline">
          ← Back to Patela POS
        </button>
      </footer>
    </div>
  );
}
