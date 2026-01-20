import { useRef, useState } from "react";
import { 
  Check, User, Phone, Lock, FileText, Home, ShoppingBag, CreditCard, 
  BarChart3, Smartphone, Wallet, ArrowRight, Download, Loader2, 
  Globe, ChevronRight, Banknote, Clock, QrCode, Bluetooth, Sparkles,
  SkipForward, CheckCircle2, XCircle, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import html2pdf from "html2pdf.js";
// Logo text components for true transparency (no image edges)
// Using high-contrast colors for PDF export
function LogoFull({ className = "" }: { className?: string }) {
  return (
    <span className={`font-extrabold tracking-tight text-white ${className}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      patela<span style={{ color: '#00D4FF' }}>.</span>
    </span>
  );
}

function LogoFullDark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-extrabold tracking-tight ${className}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#2D1B69' }}>
      patela<span style={{ color: '#00D4FF' }}>.</span>
    </span>
  );
}

function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <span className={`font-extrabold tracking-tight text-white ${className}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      p<span style={{ color: '#00D4FF' }}>.</span>
    </span>
  );
}

// Rich phone mockup component for visual journey
// Enhanced with stronger borders and labels for PDF clarity
function PhoneMockup({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[120px] h-[240px] rounded-[24px] border-3 shadow-xl overflow-hidden" style={{ backgroundColor: '#1a1040', borderColor: '#4a3a8a', borderWidth: '3px' }}>
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-3 bg-black rounded-b-lg z-10" />
        {/* Screen */}
        <div className="h-full overflow-hidden p-1">
          {children}
        </div>
        {/* Home indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.5)' }} />
      </div>
      {label && (
        <p className="mt-3 text-sm font-bold text-center" style={{ color: '#e0e0e0' }}>{label}</p>
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
        {/* Icon logo for small navigation areas */}
        <div className="flex items-center mb-1">
          <LogoIcon className="text-[12px]" />
        </div>
        <div className="bg-white/10 rounded p-1.5">
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

// Flow arrow component - enhanced for PDF visibility
function FlowArrow({ direction = "right" }: { direction?: "right" | "down" }) {
  if (direction === "down") {
    return (
      <div className="flex justify-center my-3">
        <div className="flex flex-col items-center">
          <div className="w-1 h-6" style={{ backgroundColor: '#00D4FF' }} />
          <ChevronRight className="h-6 w-6 rotate-90" style={{ color: '#00D4FF' }} />
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center mx-3">
      <div className="w-6 h-1" style={{ backgroundColor: '#00D4FF' }} />
      <ChevronRight className="h-6 w-6" style={{ color: '#00D4FF' }} />
    </div>
  );
}

// Journey stage header - enhanced contrast for PDF
function StageHeader({ icon, title, subtitle, phase }: { icon: React.ReactNode; title: string; subtitle: string; phase: "required" | "optional" | "usage" }) {
  const phaseStyles = {
    required: { bg: '#2D1B69', border: '#00D4FF', labelBg: 'rgba(0,212,255,0.3)', labelColor: '#00D4FF' },
    optional: { bg: '#5c4a1f', border: '#f59e0b', labelBg: 'rgba(245,158,11,0.3)', labelColor: '#fbbf24' },
    usage: { bg: '#1a4a2e', border: '#22c55e', labelBg: 'rgba(34,197,94,0.3)', labelColor: '#4ade80' },
  };
  const phaseLabels = {
    required: "Required",
    optional: "Optional",
    usage: "Daily Use",
  };
  const style = phaseStyles[phase];
  
  return (
    <div className="rounded-xl p-5 mb-5" style={{ backgroundColor: style.bg, borderWidth: '2px', borderStyle: 'solid', borderColor: style.border }}>
      <div className="flex items-center gap-4">
        {/* Icon logo for platform representation in journey diagrams */}
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#2D1B69', border: '2px solid #00D4FF' }}>
          <LogoIcon className="text-2xl" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold" style={{ color: '#ffffff' }}>{title}</h3>
            <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ backgroundColor: style.labelBg, color: style.labelColor }}>
              {phaseLabels[phase]}
            </span>
          </div>
          <p className="text-sm mt-1" style={{ color: '#d0d0d0' }}>{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

// Feature availability indicator - enhanced for PDF
function FeatureCheck({ available, label }: { available: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3 text-sm py-1">
      {available ? (
        <CheckCircle2 className="h-5 w-5" style={{ color: '#22c55e' }} />
      ) : (
        <XCircle className="h-5 w-5" style={{ color: '#ef4444' }} />
      )}
      <span className="font-medium" style={{ color: available ? '#ffffff' : '#a0a0a0' }}>{label}</span>
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
      margin: [15, 15, 15, 15],
        filename: 'Patela-Customer-Journey-Map.pdf',
        image: { type: 'png', quality: 1 },
        html2canvas: { 
          scale: 3,
          useCORS: true,
          letterRendering: true,
          backgroundColor: '#0d0a1a',
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: false
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

      {/* PDF Content - using inline styles for reliable PDF export */}
      <div ref={contentRef} className="max-w-5xl mx-auto" style={{ backgroundColor: '#0d0a1a' }}>
        {/* Hero Header */}
        <div className="relative overflow-hidden" style={{ backgroundColor: '#1a1040' }}>
          <div className="relative px-8 py-14 text-center">
            <LogoFull className="text-6xl block mb-8" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#ffffff' }}>
              Onboarding to First Sale
            </h1>
            <p className="text-xl font-semibold mb-6" style={{ color: '#00D4FF' }}>
              Intelligence in every tap. Growing with you.
            </p>
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00D4FF' }} />
              ))}
            </div>
          </div>
        </div>

        {/* User Personas */}
        <div className="px-8 py-10">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3" style={{ color: '#ffffff' }}>
            <User className="h-7 w-7" style={{ color: '#00D4FF' }} />
            Who Uses Patela?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl p-6" style={{ backgroundColor: '#2D1B69', border: '2px solid #4a3a8a' }}>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#00D4FF' }}>
                  <User className="h-8 w-8" style={{ color: '#2D1B69' }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: '#ffffff' }}>Admin Merchant</h3>
                  <p className="text-sm font-medium" style={{ color: '#b0b0b0' }}>Business Owner</p>
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
            <div className="rounded-2xl p-6" style={{ backgroundColor: '#1a3a4a', border: '2px solid #00D4FF' }}>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#2D1B69' }}>
                  <User className="h-8 w-8" style={{ color: '#00D4FF' }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: '#ffffff' }}>Cashier</h3>
                  <p className="text-sm font-medium" style={{ color: '#b0b0b0' }}>Team Member</p>
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
        <div className="px-8 py-10">
          <StageHeader
            icon={<User className="h-5 w-5" />}
            title="Account Setup"
            subtitle="Quick registration in 5 simple steps"
            phase="required"
          />
          
          {/* Visual Flow */}
          <div className="rounded-2xl p-8" style={{ backgroundColor: '#1a1040', border: '2px solid #4a3a8a' }}>
            <div className="flex flex-wrap items-center justify-center gap-3">
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
            <div className="mt-8 text-center">
              <p className="text-base font-medium" style={{ color: '#d0d0d0' }}>
                <span style={{ color: '#00D4FF', fontWeight: 700 }}>5 steps</span> • Takes about <span style={{ color: '#00D4FF', fontWeight: 700 }}>2 minutes</span> • Progress saves automatically
              </p>
            </div>
          </div>
        </div>

        {/* Stage 2: Optional Setup */}
        <div className="px-8 py-10">
          <StageHeader
            icon={<Smartphone className="h-5 w-5" />}
            title="Optional Setup"
            subtitle="Complete when you're ready - skip to start selling immediately"
            phase="optional"
          />
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Bank Linking */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: '#3d3220', border: '2px solid #f59e0b' }}>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#166534' }}>
                  <Banknote className="h-6 w-6" style={{ color: '#4ade80' }} />
                </div>
                <div>
                  <h4 className="font-bold text-lg" style={{ color: '#ffffff' }}>Link Bank Account</h4>
                  <p className="text-sm font-medium" style={{ color: '#fbbf24' }}>For payouts</p>
                </div>
              </div>
              <PhoneMockup><ScreenBank /></PhoneMockup>
              <div className="mt-5 flex items-center justify-center gap-2 text-base font-medium" style={{ color: '#fbbf24' }}>
                <SkipForward className="h-5 w-5" />
                <span>Can skip and do later</span>
              </div>
            </div>
            
            {/* Device Pairing */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: '#3d3220', border: '2px solid #f59e0b' }}>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#1e3a5f' }}>
                  <Smartphone className="h-6 w-6" style={{ color: '#00D4FF' }} />
                </div>
                <div>
                  <h4 className="font-bold text-lg" style={{ color: '#ffffff' }}>Pair Device</h4>
                  <p className="text-sm font-medium" style={{ color: '#fbbf24' }}>For card payments</p>
                </div>
              </div>
              <PhoneMockup><ScreenDevice /></PhoneMockup>
              <div className="mt-5 flex items-center justify-center gap-2 text-base font-medium" style={{ color: '#fbbf24' }}>
                <SkipForward className="h-5 w-5" />
                <span>Can skip and do later</span>
              </div>
            </div>
          </div>
          
          {/* Skip explanation */}
          <div className="mt-8 rounded-xl p-5" style={{ backgroundColor: '#4a3d1a', border: '2px solid #f59e0b' }}>
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 mt-0.5" style={{ color: '#fbbf24' }} />
              <div>
                <p className="text-base font-bold" style={{ color: '#ffffff' }}>Why can I skip these steps?</p>
                <p className="text-sm mt-2" style={{ color: '#e0e0e0' }}>
                  Patela lets you start selling right away! Cash sales work without any additional setup. 
                  You can link your bank and pair your device later when you need card payments or payouts.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stage 3: Daily Use */}
        <div className="px-8 py-10">
          <StageHeader
            icon={<Home className="h-5 w-5" />}
            title="Start Selling"
            subtitle="Your daily workflow from dashboard to successful sales"
            phase="usage"
          />
          
          <div className="rounded-2xl p-8" style={{ backgroundColor: '#1a3a2e', border: '2px solid #22c55e' }}>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <PhoneMockup label="Dashboard"><ScreenHome /></PhoneMockup>
              <FlowArrow />
              <PhoneMockup label="Take Payment"><ScreenPayment /></PhoneMockup>
              <FlowArrow />
              <PhoneMockup label="Success!"><ScreenPaySuccess /></PhoneMockup>
            </div>
            <div className="mt-8 text-center">
              <p className="text-base font-medium" style={{ color: '#d0d0d0' }}>
                <span style={{ color: '#4ade80', fontWeight: 700 }}>Cash sales</span> work immediately • <span style={{ color: '#4ade80', fontWeight: 700 }}>Card payments</span> require device
              </p>
            </div>
          </div>
        </div>

        {/* Feature Availability Matrix */}
        <div className="px-8 py-10">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3" style={{ color: '#ffffff' }}>
            <Check className="h-7 w-7" style={{ color: '#00D4FF' }} />
            What Works Without Full Setup?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-xl p-6" style={{ backgroundColor: '#1a3a2e', border: '2px solid #22c55e' }}>
              <h4 className="font-bold mb-4 flex items-center gap-3 text-lg" style={{ color: '#4ade80' }}>
                <CheckCircle2 className="h-6 w-6" />
                Always Available
              </h4>
              <ul className="space-y-3 text-base" style={{ color: '#e0e0e0' }}>
                <li>• Record cash sales</li>
                <li>• Add items to catalog</li>
                <li>• View sales history</li>
                <li>• Manage team members</li>
                <li>• Track daily earnings</li>
              </ul>
            </div>
            
            <div className="rounded-xl p-6" style={{ backgroundColor: '#1a3a4a', border: '2px solid #00D4FF' }}>
              <h4 className="font-bold mb-4 flex items-center gap-3 text-lg" style={{ color: '#00D4FF' }}>
                <Smartphone className="h-6 w-6" />
                Needs Device
              </h4>
              <ul className="space-y-3 text-base" style={{ color: '#e0e0e0' }}>
                <li>• Accept card payments</li>
                <li>• Tap to pay (NFC)</li>
                <li>• QR code payments</li>
                <li>• Chip & PIN</li>
              </ul>
            </div>
            
            <div className="rounded-xl p-6" style={{ backgroundColor: '#2D1B69', border: '2px solid #6b5b95' }}>
              <h4 className="font-bold mb-4 flex items-center gap-3 text-lg" style={{ color: '#ffffff' }}>
                <Banknote className="h-6 w-6" style={{ color: '#a78bfa' }} />
                Needs Bank Account
              </h4>
              <ul className="space-y-3 text-base" style={{ color: '#e0e0e0' }}>
                <li>• Request payouts</li>
                <li>• Same-day transfers</li>
                <li>• Instant payouts</li>
                <li>• Automatic settlements</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-10 text-center" style={{ borderTop: '2px solid #4a3a8a' }}>
          <LogoFull className="text-4xl block mb-5" />
          <p className="text-base font-medium" style={{ color: '#b0b0b0' }}>
            Built for the Hustle. Patela © 2025
          </p>
          <p className="text-sm mt-3" style={{ color: '#808080' }}>
            Languages: English • isiZulu • Sesotho • Xitsonga
          </p>
        </div>
      </div>
    </div>
  );
}