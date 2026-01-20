import { useRef, useState } from "react";
import { 
  Check, User, Phone, Lock, FileText, Home, ShoppingBag, CreditCard, 
  BarChart3, Smartphone, Wallet, ArrowRight, Download, Loader2, 
  Globe, ChevronRight, Banknote, Clock, QrCode, Bluetooth, Sparkles,
  SkipForward, CheckCircle2, XCircle, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import html2pdf from "html2pdf.js";
import patelaLogoFull from "@/assets/patela-logo-full.jpg";

// Rich phone mockup component for visual journey
function PhoneMockup({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[120px] h-[240px] bg-[#1a1040] rounded-[24px] border-2 border-[#2D1B69]/50 shadow-xl overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-3 bg-black rounded-b-lg z-10" />
        {/* Screen */}
        <div className="h-full overflow-hidden p-1">
          {children}
        </div>
        {/* Home indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-white/30 rounded-full" />
      </div>
      {label && (
        <p className="mt-2 text-xs font-medium text-center text-muted-foreground">{label}</p>
      )}
    </div>
  );
}

// Screen mockup components
function ScreenLanguage() {
  return (
    <div className="h-full bg-gradient-to-b from-[#2D1B69] to-[#1a1040] flex flex-col items-center justify-center p-2 text-center">
      <Globe className="h-6 w-6 text-[#00D4FF] mb-2" />
      <p className="text-[8px] text-white font-bold mb-2">Choose Language</p>
      <div className="space-y-1 w-full">
        {['English', 'isiZulu', 'Sesotho'].map((lang, i) => (
          <div key={lang} className={`text-[6px] py-1 px-2 rounded ${i === 0 ? 'bg-[#00D4FF] text-[#2D1B69]' : 'bg-white/10 text-white/70'}`}>
            {lang}
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenPhone() {
  return (
    <div className="h-full bg-gradient-to-b from-[#2D1B69] to-[#1a1040] flex flex-col items-center justify-center p-2 text-center">
      <Phone className="h-6 w-6 text-[#00D4FF] mb-2" />
      <p className="text-[8px] text-white font-bold mb-2">Your Number</p>
      <div className="bg-white/10 rounded px-2 py-1 w-full">
        <p className="text-[6px] text-white">+27 81 234 5678</p>
      </div>
      <div className="bg-[#00D4FF] text-[#2D1B69] text-[6px] py-1 px-3 rounded mt-2 font-semibold">
        Send Code
      </div>
    </div>
  );
}

function ScreenOTP() {
  return (
    <div className="h-full bg-gradient-to-b from-[#2D1B69] to-[#1a1040] flex flex-col items-center justify-center p-2 text-center">
      <Check className="h-6 w-6 text-[#00D4FF] mb-2" />
      <p className="text-[8px] text-white font-bold mb-2">Enter Code</p>
      <div className="flex gap-1 mb-2">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="w-3 h-4 bg-[#00D4FF]/20 rounded text-[6px] text-white flex items-center justify-center">
            {Math.floor(Math.random() * 10)}
          </div>
        ))}
      </div>
      <div className="text-[6px] text-green-400 flex items-center gap-1">
        <Check className="h-2 w-2" /> Verified!
      </div>
    </div>
  );
}

function ScreenPIN() {
  return (
    <div className="h-full bg-gradient-to-b from-[#2D1B69] to-[#1a1040] flex flex-col items-center justify-center p-2 text-center">
      <Lock className="h-6 w-6 text-[#00D4FF] mb-2" />
      <p className="text-[8px] text-white font-bold mb-2">Create PIN</p>
      <div className="flex gap-2 mb-2">
        {[1,2,3,4].map(i => (
          <div key={i} className="w-4 h-4 bg-[#00D4FF] rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-[#2D1B69] rounded-full" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-1 mt-1">
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <div key={n} className="w-4 h-4 bg-white/10 rounded text-[6px] text-white flex items-center justify-center">{n}</div>
        ))}
      </div>
    </div>
  );
}

function ScreenKYC() {
  return (
    <div className="h-full bg-gradient-to-b from-[#2D1B69] to-[#1a1040] flex flex-col p-2">
      <FileText className="h-5 w-5 text-[#00D4FF] mb-1" />
      <p className="text-[7px] text-white font-bold mb-2">Your Details</p>
      <div className="space-y-1.5 flex-1">
        <div className="bg-white/10 rounded px-1.5 py-1">
          <p className="text-[5px] text-white/50">First Name</p>
          <p className="text-[6px] text-white">Thembi</p>
        </div>
        <div className="bg-white/10 rounded px-1.5 py-1">
          <p className="text-[5px] text-white/50">Business</p>
          <p className="text-[6px] text-white">Fresh Produce</p>
        </div>
      </div>
      <div className="bg-[#00D4FF] text-[#2D1B69] text-[6px] py-1 rounded text-center font-semibold">
        Continue
      </div>
    </div>
  );
}

function ScreenSuccess() {
  return (
    <div className="h-full bg-gradient-to-b from-[#2D1B69] to-[#1a1040] flex flex-col items-center justify-center p-2 text-center">
      <div className="w-10 h-10 bg-[#00D4FF] rounded-full flex items-center justify-center mb-2">
        <Sparkles className="h-5 w-5 text-[#2D1B69]" />
      </div>
      <p className="text-[8px] text-white font-bold">Account Created!</p>
      <p className="text-[6px] text-white/70 mb-2">You're ready to sell</p>
      <div className="bg-[#00D4FF] text-[#2D1B69] text-[6px] py-1 px-3 rounded font-semibold">
        Continue →
      </div>
      <p className="text-[5px] text-white/50 mt-1 flex items-center gap-0.5">
        <Clock className="h-2 w-2" /> Skip for now
      </p>
    </div>
  );
}

function ScreenBank() {
  return (
    <div className="h-full bg-gradient-to-b from-[#2D1B69] to-[#1a1040] flex flex-col p-2">
      <Banknote className="h-5 w-5 text-green-400 mb-1" />
      <p className="text-[7px] text-white font-bold mb-1">Link Bank</p>
      <p className="text-[5px] text-white/60 mb-2">Get your earnings paid out</p>
      <div className="space-y-1.5 flex-1">
        <div className="bg-white/10 rounded p-1.5 flex items-center gap-1">
          <CreditCard className="h-3 w-3 text-green-400" />
          <p className="text-[5px] text-white">Scan Card</p>
        </div>
        <div className="bg-white/10 rounded p-1.5 flex items-center gap-1">
          <FileText className="h-3 w-3 text-[#00D4FF]" />
          <p className="text-[5px] text-white">Enter Manually</p>
        </div>
      </div>
      <p className="text-[5px] text-white/50 text-center flex items-center justify-center gap-0.5">
        <SkipForward className="h-2 w-2" /> Do this later
      </p>
    </div>
  );
}

function ScreenDevice() {
  return (
    <div className="h-full bg-gradient-to-b from-[#2D1B69] to-[#1a1040] flex flex-col p-2">
      <Smartphone className="h-5 w-5 text-[#00D4FF] mb-1" />
      <p className="text-[7px] text-white font-bold mb-1">Pair Device</p>
      <p className="text-[5px] text-white/60 mb-2">Accept card payments</p>
      <div className="space-y-1.5 flex-1">
        <div className="bg-[#00D4FF]/20 border border-[#00D4FF]/30 rounded p-1.5 flex items-center gap-1">
          <QrCode className="h-3 w-3 text-[#00D4FF]" />
          <p className="text-[5px] text-white">Scan QR Code</p>
        </div>
        <div className="bg-white/10 rounded p-1.5 flex items-center gap-1">
          <Bluetooth className="h-3 w-3 text-blue-400" />
          <p className="text-[5px] text-white">Bluetooth</p>
        </div>
      </div>
      <p className="text-[5px] text-white/50 text-center flex items-center justify-center gap-0.5">
        <SkipForward className="h-2 w-2" /> Skip for now
      </p>
    </div>
  );
}

function ScreenHome() {
  return (
    <div className="h-full bg-gradient-to-b from-[#2D1B69] to-[#1a1040] flex flex-col">
      <div className="bg-[#2D1B69] p-2 rounded-b-xl">
        <p className="text-[6px] text-white/70">Good morning</p>
        <p className="text-[7px] text-white font-bold">Thembi 👋</p>
        <div className="bg-white/10 rounded p-1.5 mt-1">
          <p className="text-[5px] text-white/70">Today's Sales</p>
          <p className="text-[10px] text-white font-bold">R515.00</p>
        </div>
      </div>
      <div className="flex-1 p-1.5">
        <div className="bg-[#00D4FF] rounded-lg p-2 flex items-center justify-between">
          <div>
            <p className="text-[7px] text-[#2D1B69] font-bold">Take Payment</p>
            <p className="text-[5px] text-[#2D1B69]/70">Start selling</p>
          </div>
          <CreditCard className="h-4 w-4 text-[#2D1B69]" />
        </div>
      </div>
    </div>
  );
}

function ScreenPayment() {
  return (
    <div className="h-full bg-gradient-to-b from-[#2D1B69] to-[#1a1040] flex flex-col items-center justify-center p-2 text-center">
      <p className="text-[6px] text-white/70 mb-1">Enter Amount</p>
      <p className="text-[14px] text-white font-bold mb-2">R150.00</p>
      <div className="flex gap-1 mb-2">
        {['R20', 'R50', 'R100'].map(amt => (
          <div key={amt} className="bg-white/10 text-[5px] text-white px-1.5 py-0.5 rounded">{amt}</div>
        ))}
      </div>
      <div className="bg-[#00D4FF] text-[#2D1B69] text-[6px] py-1 px-4 rounded font-semibold">
        Charge R150 →
      </div>
    </div>
  );
}

function ScreenPaySuccess() {
  return (
    <div className="h-full bg-gradient-to-b from-green-500 to-green-600 flex flex-col items-center justify-center p-2 text-center">
      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-2">
        <Check className="h-5 w-5 text-green-500" />
      </div>
      <p className="text-[10px] text-white font-bold">Payment Success!</p>
      <p className="text-[8px] text-white/90">R150.00</p>
      <p className="text-[6px] text-white/70 mt-1">Your first sale! 🎉</p>
    </div>
  );
}

// Flow arrow component
function FlowArrow({ direction = "right" }: { direction?: "right" | "down" }) {
  if (direction === "down") {
    return (
      <div className="flex justify-center my-2">
        <div className="flex flex-col items-center">
          <div className="w-0.5 h-4 bg-gradient-to-b from-[#00D4FF] to-[#2D1B69]" />
          <ChevronRight className="h-4 w-4 text-[#00D4FF] rotate-90" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center mx-2">
      <div className="w-4 h-0.5 bg-gradient-to-r from-[#00D4FF] to-[#2D1B69]" />
      <ChevronRight className="h-4 w-4 text-[#00D4FF]" />
    </div>
  );
}

// Journey stage header
function StageHeader({ icon, title, subtitle, phase }: { icon: React.ReactNode; title: string; subtitle: string; phase: "required" | "optional" | "usage" }) {
  const phaseColors = {
    required: "from-[#2D1B69] to-[#2D1B69]/80 border-[#00D4FF]/30",
    optional: "from-amber-900/50 to-amber-800/30 border-amber-500/30",
    usage: "from-green-900/50 to-green-800/30 border-green-500/30",
  };
  const phaseLabels = {
    required: "Required",
    optional: "Optional",
    usage: "Daily Use",
  };
  
  return (
    <div className={`bg-gradient-to-r ${phaseColors[phase]} border rounded-xl p-4 mb-4`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#00D4FF]/20 rounded-xl flex items-center justify-center text-[#00D4FF]">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${phase === "required" ? "bg-[#00D4FF]/20 text-[#00D4FF]" : phase === "optional" ? "bg-amber-500/20 text-amber-400" : "bg-green-500/20 text-green-400"}`}>
              {phaseLabels[phase]}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

// Feature availability indicator
function FeatureCheck({ available, label }: { available: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {available ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 text-red-400" />
      )}
      <span className={available ? "text-foreground" : "text-muted-foreground"}>{label}</span>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0a1a] via-[#1a1040] to-[#0d0a1a]">
      {/* Floating Download Button */}
      <div className="fixed top-4 right-4 z-50 print:hidden">
        <Button
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className="bg-gradient-to-r from-[#2D1B69] to-[#00D4FF] hover:opacity-90 text-white shadow-lg"
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
      <div ref={contentRef} className="max-w-5xl mx-auto">
        {/* Hero Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2D1B69]/30 via-[#00D4FF]/10 to-[#2D1B69]/30" />
          <div className="relative px-6 py-12 text-center">
            <img src={patelaLogoFull} alt="Patela" className="h-12 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Onboarding to First Sale
            </h1>
            <p className="text-lg text-[#00D4FF] mb-4">
              Intelligence in every tap. Growing with you.
            </p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-[#00D4FF]/60" />
              ))}
            </div>
          </div>
        </div>

        {/* User Personas */}
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <User className="h-6 w-6 text-[#00D4FF]" />
            Who Uses Patela?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#2D1B69]/50 to-[#2D1B69]/20 border border-[#2D1B69]/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#2D1B69] to-[#00D4FF] rounded-2xl flex items-center justify-center">
                  <User className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Admin Merchant</h3>
                  <p className="text-sm text-white/60">Business Owner</p>
                </div>
              </div>
              <div className="space-y-2">
                <FeatureCheck available={true} label="Full account access & settings" />
                <FeatureCheck available={true} label="Add and manage team members" />
                <FeatureCheck available={true} label="View all sales & reports" />
                <FeatureCheck available={true} label="Request payouts" />
                <FeatureCheck available={true} label="Link bank & pair devices" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#00D4FF]/10 to-[#00D4FF]/5 border border-[#00D4FF]/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#00D4FF] to-[#00D4FF]/60 rounded-2xl flex items-center justify-center">
                  <User className="h-7 w-7 text-[#2D1B69]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Cashier</h3>
                  <p className="text-sm text-white/60">Team Member</p>
                </div>
              </div>
              <div className="space-y-2">
                <FeatureCheck available={true} label="Take payments" />
                <FeatureCheck available={true} label="View own sales history" />
                <FeatureCheck available={false} label="Cannot access settings" />
                <FeatureCheck available={false} label="Cannot request payouts" />
                <FeatureCheck available={false} label="Limited to assigned functions" />
              </div>
            </div>
          </div>
        </div>

        {/* Stage 1: Required Onboarding */}
        <div className="px-6 py-8">
          <StageHeader
            icon={<User className="h-5 w-5" />}
            title="Account Setup"
            subtitle="Quick registration in 5 simple steps"
            phase="required"
          />
          
          {/* Visual Flow */}
          <div className="bg-gradient-to-r from-[#2D1B69]/20 to-[#2D1B69]/10 border border-[#2D1B69]/20 rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <PhoneMockup label="1. Language"><ScreenLanguage /></PhoneMockup>
              <FlowArrow />
              <PhoneMockup label="2. Phone"><ScreenPhone /></PhoneMockup>
              <FlowArrow />
              <PhoneMockup label="3. Verify"><ScreenOTP /></PhoneMockup>
              <FlowArrow />
              <PhoneMockup label="4. PIN"><ScreenPIN /></PhoneMockup>
              <FlowArrow />
              <PhoneMockup label="5. Details"><ScreenKYC /></PhoneMockup>
              <FlowArrow />
              <PhoneMockup label="✓ Done!"><ScreenSuccess /></PhoneMockup>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-white/70">
                <span className="text-[#00D4FF] font-semibold">5 steps</span> • Takes about <span className="text-[#00D4FF] font-semibold">2 minutes</span> • Progress saves automatically
              </p>
            </div>
          </div>
        </div>

        {/* Stage 2: Optional Setup */}
        <div className="px-6 py-8">
          <StageHeader
            icon={<Smartphone className="h-5 w-5" />}
            title="Optional Setup"
            subtitle="Complete when you're ready - skip to start selling immediately"
            phase="optional"
          />
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Bank Linking */}
            <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 border border-amber-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Banknote className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Link Bank Account</h4>
                  <p className="text-xs text-amber-400">For payouts</p>
                </div>
              </div>
              <PhoneMockup><ScreenBank /></PhoneMockup>
              <div className="mt-4 flex items-center justify-center gap-2 text-amber-400 text-sm">
                <SkipForward className="h-4 w-4" />
                <span>Can skip and do later</span>
              </div>
            </div>
            
            {/* Device Pairing */}
            <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 border border-amber-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#00D4FF]/20 rounded-xl flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-[#00D4FF]" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Pair Device</h4>
                  <p className="text-xs text-amber-400">For card payments</p>
                </div>
              </div>
              <PhoneMockup><ScreenDevice /></PhoneMockup>
              <div className="mt-4 flex items-center justify-center gap-2 text-amber-400 text-sm">
                <SkipForward className="h-4 w-4" />
                <span>Can skip and do later</span>
              </div>
            </div>
          </div>
          
          {/* Skip explanation */}
          <div className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5" />
              <div>
                <p className="text-sm text-white font-medium">Why can I skip these steps?</p>
                <p className="text-xs text-white/70 mt-1">
                  Patela lets you start selling right away! Cash sales work without any additional setup. 
                  You can link your bank and pair your device later when you need card payments or payouts.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stage 3: Daily Use */}
        <div className="px-6 py-8">
          <StageHeader
            icon={<Home className="h-5 w-5" />}
            title="Start Selling"
            subtitle="Your daily workflow from dashboard to successful sales"
            phase="usage"
          />
          
          <div className="bg-gradient-to-r from-green-900/20 to-green-800/10 border border-green-500/20 rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <PhoneMockup label="Dashboard"><ScreenHome /></PhoneMockup>
              <FlowArrow />
              <PhoneMockup label="Take Payment"><ScreenPayment /></PhoneMockup>
              <FlowArrow />
              <PhoneMockup label="Success!"><ScreenPaySuccess /></PhoneMockup>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-white/70">
                <span className="text-green-400 font-semibold">Cash sales</span> work immediately • <span className="text-green-400 font-semibold">Card payments</span> require device
              </p>
            </div>
          </div>
        </div>

        {/* Feature Availability Matrix */}
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Check className="h-6 w-6 text-[#00D4FF]" />
            What Works Without Full Setup?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5">
              <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Always Available
              </h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>• Record cash sales</li>
                <li>• Add items to catalog</li>
                <li>• View sales history</li>
                <li>• Manage team members</li>
                <li>• Track daily earnings</li>
              </ul>
            </div>
            
            <div className="bg-[#00D4FF]/10 border border-[#00D4FF]/20 rounded-xl p-5">
              <h4 className="font-bold text-[#00D4FF] mb-3 flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Needs Device
              </h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>• Accept card payments</li>
                <li>• Tap to pay (NFC)</li>
                <li>• QR code payments</li>
                <li>• Chip & PIN</li>
              </ul>
            </div>
            
            <div className="bg-[#2D1B69]/30 border border-[#2D1B69]/30 rounded-xl p-5">
              <h4 className="font-bold text-[#2D1B69] mb-3 flex items-center gap-2 text-white">
                <Banknote className="h-5 w-5" />
                Needs Bank Account
              </h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>• Request payouts</li>
                <li>• Same-day transfers</li>
                <li>• Instant payouts</li>
                <li>• Automatic settlements</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-8 text-center border-t border-white/10">
          <img src={patelaLogoFull} alt="Patela" className="h-8 mx-auto mb-4" />
          <p className="text-sm text-white/50">
            Built for the Hustle. Patela © 2025
          </p>
          <p className="text-xs text-white/30 mt-2">
            Languages: English • isiZulu • Sesotho • Xitsonga
          </p>
        </div>
      </div>
    </div>
  );
}