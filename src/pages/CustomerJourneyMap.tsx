import { useRef, useState } from "react";
import { Check, User, Phone, Lock, FileText, Home, ShoppingBag, CreditCard, BarChart3, Smartphone, Wallet, ArrowRight, Download, Loader2 } from "lucide-react";
import { PatelaLogo } from "@/components/patela/PatelaLogo";
import { Button } from "@/components/ui/button";
import html2pdf from "html2pdf.js";

interface JourneyStageProps {
  number: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  userGoal: string;
  actions: string[];
  systemResponse: string;
  screens: string[];
  isLast?: boolean;
}

function JourneyStage({ number, title, subtitle, icon, userGoal, actions, systemResponse, screens, isLast }: JourneyStageProps) {
  return (
    <div className="relative">
      {/* Connection Line */}
      {!isLast && (
        <div className="absolute left-6 top-16 w-0.5 h-full bg-gradient-to-b from-primary/50 to-accent/50 -z-10" />
      )}
      
      <div className="flex gap-4">
        {/* Step Number Circle */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/30">
          {number}
        </div>
        
        {/* Content Card */}
        <div className="flex-1 bg-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-5 mb-6 hover:border-accent/40 transition-all duration-300">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-accent">
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div>
                <span className="text-accent font-semibold text-xs uppercase tracking-wider">🎯 User Goal</span>
                <p className="text-foreground/90 mt-1">{userGoal}</p>
              </div>
              <div>
                <span className="text-accent font-semibold text-xs uppercase tracking-wider">👆 User Actions</span>
                <ul className="mt-1 space-y-1">
                  {actions.map((action, i) => (
                    <li key={i} className="text-foreground/80 flex items-start gap-2">
                      <ArrowRight className="h-3 w-3 text-accent mt-1 flex-shrink-0" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-accent font-semibold text-xs uppercase tracking-wider">⚡ System Response</span>
                <p className="text-foreground/80 mt-1">{systemResponse}</p>
              </div>
              <div>
                <span className="text-accent font-semibold text-xs uppercase tracking-wider">📱 Key Screens</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {screens.map((screen, i) => (
                    <span key={i} className="px-2 py-0.5 bg-primary/20 text-primary-foreground text-xs rounded-full">
                      {screen}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonaCard({ type, title, description, capabilities }: { type: "admin" | "cashier"; title: string; description: string; capabilities: string[] }) {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 hover:border-accent/40 transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${type === "admin" ? "bg-gradient-to-br from-primary to-primary/50" : "bg-gradient-to-br from-accent to-accent/50"}`}>
          <User className="h-7 w-7 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="space-y-2">
        {capabilities.map((cap, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-foreground/80">
            <Check className="h-4 w-4 text-accent" />
            {cap}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CustomerJourneyMap() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;
    
    setIsGenerating(true);
    
    try {
      const opt = {
        margin: [10, 10, 10, 10],
        filename: 'Patela-Customer-Journey-Map.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(opt).from(contentRef.current).save();
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const journeyStages: JourneyStageProps[] = [
    {
      number: 1,
      title: "Discover Patela",
      subtitle: "First Contact",
      icon: <Home className="h-5 w-5" />,
      userGoal: "Learn what Patela is and how it helps my business",
      actions: ["See landing page", "View device options", "Read benefits"],
      systemResponse: "Show clear value proposition with device showcase and pricing",
      screens: ["Landing", "Products"],
    },
    {
      number: 2,
      title: "Sign Up",
      subtitle: "Create Account",
      icon: <User className="h-5 w-5" />,
      userGoal: "Create my Patela account quickly",
      actions: ["Tap 'Get Started'", "Enter phone or email"],
      systemResponse: "Send verification code immediately",
      screens: ["Auth"],
    },
    {
      number: 3,
      title: "Verify Number",
      subtitle: "OTP Confirmation",
      icon: <Phone className="h-5 w-5" />,
      userGoal: "Prove my phone number is real",
      actions: ["Receive SMS", "Enter 6-digit code"],
      systemResponse: "Auto-verify and proceed to next step",
      screens: ["OTP Input"],
    },
    {
      number: 4,
      title: "Choose Language",
      subtitle: "Personalization",
      icon: <Check className="h-5 w-5" />,
      userGoal: "Use the app in my preferred language",
      actions: ["Select language from options"],
      systemResponse: "Apply language instantly across all screens",
      screens: ["Language Select"],
    },
    {
      number: 5,
      title: "Create PIN",
      subtitle: "Security Setup",
      icon: <Lock className="h-5 w-5" />,
      userGoal: "Secure my account with a memorable PIN",
      actions: ["Enter 4-digit PIN", "Confirm PIN"],
      systemResponse: "Store securely and confirm setup",
      screens: ["PIN Create", "PIN Confirm"],
    },
    {
      number: 6,
      title: "Basic Details (KYC)",
      subtitle: "Identity Verification",
      icon: <FileText className="h-5 w-5" />,
      userGoal: "Provide my basic business information",
      actions: ["Enter name", "Add business name", "Select business type"],
      systemResponse: "Save profile and show completion",
      screens: ["Personal Details"],
    },
    {
      number: 7,
      title: "Account Ready!",
      subtitle: "Home Dashboard",
      icon: <Home className="h-5 w-5" />,
      userGoal: "See my new account and understand what's next",
      actions: ["View dashboard", "Explore features"],
      systemResponse: "Show home with gentle setup prompts",
      screens: ["Home"],
    },
    {
      number: 8,
      title: "Add Items",
      subtitle: "Build Catalog",
      icon: <ShoppingBag className="h-5 w-5" />,
      userGoal: "Add my products so I can sell faster",
      actions: ["Tap 'Add Item'", "Enter name & price", "Save"],
      systemResponse: "Show item in catalog with quick-add option",
      screens: ["Items", "Add Item"],
    },
    {
      number: 9,
      title: "Make First Sale",
      subtitle: "Accept Payment",
      icon: <CreditCard className="h-5 w-5" />,
      userGoal: "Take my first payment and see it work",
      actions: ["Enter amount or select item", "Choose payment method", "Complete sale"],
      systemResponse: "Show success with celebration animation",
      screens: ["Payment", "Success"],
    },
    {
      number: 10,
      title: "View Sales History",
      subtitle: "Track Performance",
      icon: <BarChart3 className="h-5 w-5" />,
      userGoal: "See my sales and track my earnings",
      actions: ["Open Sales tab", "View transactions", "Check totals"],
      systemResponse: "Show clear sales list with filtering options",
      screens: ["Sales"],
    },
    {
      number: 11,
      title: "Link Device or Bank",
      subtitle: "Optional Setup",
      icon: <Smartphone className="h-5 w-5" />,
      userGoal: "Unlock more features when I'm ready",
      actions: ["Tap setup reminder", "Follow guided flow"],
      systemResponse: "Simple step-by-step pairing or linking",
      screens: ["Device Setup", "Bank Link"],
    },
    {
      number: 12,
      title: "Request Payout",
      subtitle: "Get Paid",
      icon: <Wallet className="h-5 w-5" />,
      userGoal: "Transfer my earnings to my bank account",
      actions: ["Tap 'Request Payout'", "Confirm amount", "Enter PIN"],
      systemResponse: "Process payout and show confirmation",
      screens: ["Payouts", "Confirm"],
      isLast: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Floating Download Button */}
      <div className="fixed top-4 right-4 z-50 print:hidden">
        <Button
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg shadow-primary/30"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </>
          )}
        </Button>
      </div>

      {/* PDF Content */}
      <div ref={contentRef}>
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 border-b border-primary/20">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <PatelaLogo className="h-10" />
              <span className="text-xs text-muted-foreground">Customer Journey Map v1.0</span>
            </div>
            <div className="mt-6 text-center">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Onboarding to First Sale
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Intelligence in every tap. Growing with you.
              </p>
              <div className="flex justify-center gap-2 mt-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-accent/60" />
                ))}
              </div>
            </div>
          </div>
        </div>

      {/* Personas Section */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <User className="h-6 w-6 text-accent" />
          User Personas
        </h2>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <PersonaCard
            type="admin"
            title="Admin Merchant"
            description="Business owner who sets up and manages the account"
            capabilities={[
              "Full account access & settings",
              "Add and manage team members",
              "View all sales & reports",
              "Request payouts",
              "Link bank & pair devices",
            ]}
          />
          <PersonaCard
            type="cashier"
            title="Cashier"
            description="Team member who processes daily sales"
            capabilities={[
              "Take payments only",
              "View own sales history",
              "Cannot access settings",
              "Cannot request payouts",
              "Limited to assigned functions",
            ]}
          />
        </div>

        {/* Journey Stages */}
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <ArrowRight className="h-6 w-6 text-accent" />
          The Journey
        </h2>
        <div className="space-y-2">
          {journeyStages.map((stage) => (
            <JourneyStage key={stage.number} {...stage} />
          ))}
        </div>

        {/* Feature Availability Table */}
        <div className="mt-12 bg-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Check className="h-5 w-5 text-accent" />
            What Works Without Full Setup
          </h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-accent mb-2">✅ Always Available</h4>
              <ul className="space-y-1 text-foreground/80">
                <li>• Cash sales</li>
                <li>• Add items</li>
                <li>• View sales</li>
                <li>• Team management</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-500 mb-2">📱 Needs Device</h4>
              <ul className="space-y-1 text-foreground/80">
                <li>• Card payments</li>
                <li>• Tap to pay</li>
                <li>• QR payments</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-2">🏦 Needs Bank</h4>
              <ul className="space-y-1 text-foreground/80">
                <li>• Request payouts</li>
                <li>• Instant transfers</li>
                <li>• Same-day payouts</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground pb-8">
          <p>Built for the Hustle. Patela © 2025</p>
          <p className="mt-1">Languages: English • isiZulu • Sesotho • Xitsonga</p>
        </div>
      </div>
      </div>
    </div>
  );
}
