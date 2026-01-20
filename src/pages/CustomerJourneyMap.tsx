import { useRef, useState } from "react";
import { 
  Check, User, Phone, Lock, FileText, Home, ShoppingBag, CreditCard, 
  BarChart3, Smartphone, Wallet, ArrowRight, Download, Loader2, 
  Globe, ChevronRight, Banknote, Clock, QrCode, Bluetooth, Sparkles,
  SkipForward, CheckCircle2, XCircle, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import html2pdf from "html2pdf.js";

// Human-focused vendor images
import vendorPortrait1 from "@/assets/vendor-portrait-1.jpg";
import vendorPortrait2 from "@/assets/vendor-portrait-2.jpg";
import vendorBanner from "@/assets/vendor-banner.jpg";
// Visual imagery for account/device linking
import bankLinkingVisual from "@/assets/bank-linking-visual.png";
import devicePairingVisual from "@/assets/device-pairing-visual.png";
// Official Patela logo assets - exact shapes from brand guidelines
import wordmarkLight from "@/assets/patela-wordmark-light.png";
import iconLight from "@/assets/patela-icon-light.png";

// Official Patela Brand Colors (from design system)
// Primary: hsl(261 51% 37%) = #5B3E9E (Deep Purple)
// Accent: hsl(191 100% 50%) = #00D4FF (Cyan)
// Success: hsl(145 65% 42%) = #25A55F (Green)
// Warning: hsl(38 92% 50%) = #F59E0B (Amber)
const BRAND = {
  primary: '#5B3E9E',
  primaryDark: '#3D2A6B',
  primaryLight: '#7B5BBE',
  accent: '#00D4FF',
  accentDark: '#00A8CC',
  success: '#25A55F',
  successLight: '#34D399',
  warning: '#F59E0B',
  warningDark: '#D97706',
  text: '#FFFFFF',
  textMuted: '#E0E0E0',
  textSubtle: '#B0B0B0',
  bgDark: '#1A1040',
  bgDarker: '#0D0A1A',
};

// Logo components using official brand assets for PDF export
// Using actual image files to ensure exact shape matching
function LogoFull({ className = "" }: { className?: string }) {
  return (
    <img 
      src={wordmarkLight} 
      alt="patela." 
      className={`object-contain ${className}`}
      draggable={false}
    />
  );
}

function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <img 
      src={iconLight} 
      alt="Patela" 
      className={`object-contain ${className}`}
      draggable={false}
    />
  );
}

// Rich phone mockup component for visual journey
// Enhanced with stronger borders and labels for PDF clarity
function PhoneMockup({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[120px] h-[240px] rounded-[24px] shadow-xl overflow-hidden" style={{ backgroundColor: BRAND.bgDark, borderColor: BRAND.primaryLight, borderWidth: '2px', borderStyle: 'solid' }}>
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
        <p className="mt-3 text-sm font-bold text-center" style={{ color: BRAND.textMuted }}>{label}</p>
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
          <LogoIcon className="h-4" />
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

// Modern 2026 flow arrow component - clean SVG with transparent background
function FlowArrow({ direction = "right" }: { direction?: "right" | "down" }) {
  if (direction === "down") {
    return (
      <div className="flex justify-center my-4">
        {/* Pure SVG arrow - no background elements for PDF transparency */}
        <svg width="32" height="48" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="arrowGradientDown" x1="16" y1="0" x2="16" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor={BRAND.accent} />
              <stop offset="1" stopColor={BRAND.primaryLight} />
            </linearGradient>
            <filter id="arrowGlowDown" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Flowing line with glow */}
          <path 
            d="M16 4 L16 32" 
            stroke="url(#arrowGradientDown)" 
            strokeWidth="3" 
            strokeLinecap="round"
            filter="url(#arrowGlowDown)"
          />
          {/* Modern arrow head - soft chevron */}
          <path 
            d="M8 34 L16 44 L24 34" 
            stroke="url(#arrowGradientDown)" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="none"
            filter="url(#arrowGlowDown)"
          />
          {/* Subtle dot at start */}
          <circle cx="16" cy="4" r="3" fill={BRAND.accent} opacity="0.7" />
        </svg>
      </div>
    );
  }
  
  return (
    <div className="flex items-center mx-2">
      {/* Pure SVG arrow - no background elements for PDF transparency */}
      <svg width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="arrowGradientRight" x1="0" y1="16" x2="48" y2="16" gradientUnits="userSpaceOnUse">
            <stop stopColor={BRAND.accent} />
            <stop offset="1" stopColor={BRAND.primaryLight} />
          </linearGradient>
          <filter id="arrowGlowRight" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Flowing curved line */}
        <path 
          d="M4 16 C12 16, 20 16, 32 16" 
          stroke="url(#arrowGradientRight)" 
          strokeWidth="2.5" 
          strokeLinecap="round"
          filter="url(#arrowGlowRight)"
        />
        {/* Modern arrow head - elegant chevron */}
        <path 
          d="M34 8 L44 16 L34 24" 
          stroke="url(#arrowGradientRight)" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          fill="none"
          filter="url(#arrowGlowRight)"
        />
        {/* Subtle starting dot */}
        <circle cx="4" cy="16" r="2.5" fill={BRAND.accent} opacity="0.6" />
      </svg>
    </div>
  );
}

// Journey stage header - using official brand colors
function StageHeader({ icon, title, subtitle, phase }: { icon: React.ReactNode; title: string; subtitle: string; phase: "required" | "optional" | "usage" }) {
  const phaseStyles = {
    required: { bg: BRAND.primary, border: BRAND.accent, labelBg: 'rgba(0,212,255,0.25)', labelColor: BRAND.accent },
    optional: { bg: BRAND.warningDark, border: BRAND.warning, labelBg: 'rgba(245,158,11,0.25)', labelColor: BRAND.warning },
    usage: { bg: BRAND.success, border: BRAND.successLight, labelBg: 'rgba(52,211,153,0.25)', labelColor: BRAND.successLight },
  };
  const phaseLabels = {
    required: "Required",
    optional: "Optional",
    usage: "Daily Use",
  };
  const style = phaseStyles[phase];
  
  return (
    <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: style.bg, borderWidth: '2px', borderStyle: 'solid', borderColor: style.border }}>
      <div className="flex items-center gap-3">
        {/* Icon container with logo image for PDF compatibility */}
        <div 
          style={{ 
            position: 'relative',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: BRAND.primaryDark, 
            border: `2px solid ${BRAND.accent}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LogoIcon className="h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold" style={{ color: BRAND.text }}>{title}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: style.labelBg, color: style.labelColor }}>
              {phaseLabels[phase]}
            </span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: BRAND.textMuted }}>{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

// Feature availability indicator - using brand colors
function FeatureCheck({ available, label }: { available: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs py-0.5">
      {available ? (
        <CheckCircle2 className="h-4 w-4" style={{ color: BRAND.success }} />
      ) : (
        <XCircle className="h-4 w-4" style={{ color: '#ef4444' }} />
      )}
      <span className="font-medium" style={{ color: available ? BRAND.text : BRAND.textSubtle }}>{label}</span>
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
      // Calculate the actual height of the content for a single continuous page
      const contentHeight = contentRef.current.scrollHeight;
      const contentWidth = contentRef.current.offsetWidth;
      
      // Convert pixels to mm (assuming 96 DPI)
      const pxToMm = 0.264583;
      const widthMm = 210; // A4 width in mm
      const scale = widthMm / (contentWidth * pxToMm);
      const heightMm = contentHeight * pxToMm * scale;

      const opt = {
        margin: 0,
        filename: 'Patela-Customer-Journey-Map.pdf',
        image: { type: 'png', quality: 1 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          backgroundColor: BRAND.bgDarker,
          scrollX: 0,
          scrollY: 0,
          windowWidth: contentWidth,
          windowHeight: contentHeight,
        },
        jsPDF: { 
          unit: 'mm', 
          format: [widthMm, heightMm],
          orientation: 'portrait',
          compress: true,
        },
        pagebreak: { mode: 'avoid-all' }
      };

      await html2pdf().set(opt).from(contentRef.current).save();
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${BRAND.bgDarker} 0%, ${BRAND.bgDark} 50%, ${BRAND.bgDarker} 100%)` }}>
      {/* Floating Download Button */}
      <div className="fixed top-4 right-4 z-50 print:hidden">
        <Button
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          style={{ background: `linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.accent} 100%)` }}
          className="hover:opacity-90 text-white shadow-lg"
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
      <div ref={contentRef} className="max-w-4xl mx-auto" style={{ backgroundColor: BRAND.bgDarker, padding: '0' }}>
        {/* Hero Header with Human Banner */}
        <div className="relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${BRAND.primary} 0%, ${BRAND.bgDark} 100%)` }}>
          {/* Subtle vendor banner overlay */}
          <div 
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `url(${vendorBanner})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
            }}
          />
          <div className="relative px-6 py-10 text-center">
            <LogoFull className="h-14 mx-auto mb-5" />
            <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: BRAND.text }}>
              Onboarding to First Sale
            </h1>
            <p className="text-lg font-semibold mb-4" style={{ color: BRAND.accent }}>
              Intelligence in every tap. Growing with you.
            </p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: BRAND.accent }} />
              ))}
            </div>
          </div>
        </div>

        {/* User Personas */}
        <div className="px-6 py-6">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2" style={{ color: BRAND.text }}>
            <User className="h-6 w-6" style={{ color: BRAND.accent }} />
            Who Uses Patela?
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-xl p-4" style={{ backgroundColor: BRAND.primary, border: `2px solid ${BRAND.primaryLight}` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ border: `2px solid ${BRAND.accent}` }}>
                  <img 
                    src={vendorPortrait1} 
                    alt="Business owner" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: BRAND.text }}>Admin Merchant</h3>
                  <p className="text-xs font-medium" style={{ color: BRAND.textSubtle }}>Business Owner</p>
                </div>
              </div>
              <div className="space-y-1">
                <FeatureCheck available={true} label="Full account access & settings" />
                <FeatureCheck available={true} label="Add and manage team members" />
                <FeatureCheck available={true} label="View all sales & reports" />
                <FeatureCheck available={true} label="Request payouts" />
                <FeatureCheck available={true} label="Link bank & pair devices" />
              </div>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: BRAND.primaryDark, border: `2px solid ${BRAND.accent}` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ border: `2px solid ${BRAND.accent}` }}>
                  <img 
                    src={vendorPortrait2} 
                    alt="Team member" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: BRAND.text }}>Cashier</h3>
                  <p className="text-xs font-medium" style={{ color: BRAND.textSubtle }}>Team Member</p>
                </div>
              </div>
              <div className="space-y-1">
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
        <div className="px-6 py-6">
          <StageHeader
            icon={<User className="h-5 w-5" />}
            title="Account Setup"
            subtitle="Quick registration in 5 simple steps"
            phase="required"
          />
          
          {/* Visual Flow */}
          <div className="rounded-xl p-5" style={{ backgroundColor: BRAND.bgDark, border: `2px solid ${BRAND.primaryLight}` }}>
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
            <div className="mt-5 text-center">
              <p className="text-sm font-medium" style={{ color: BRAND.textMuted }}>
                <span style={{ color: BRAND.accent, fontWeight: 700 }}>5 steps</span> • Takes about <span style={{ color: BRAND.accent, fontWeight: 700 }}>2 minutes</span> • Progress saves automatically
              </p>
            </div>
          </div>
        </div>

        {/* Stage 2: Optional Setup */}
        <div className="px-6 py-6">
          <StageHeader
            icon={<Smartphone className="h-5 w-5" />}
            title="Optional Setup"
            subtitle="Complete when you're ready - skip to start selling immediately"
            phase="optional"
          />
          
          <div className="grid md:grid-cols-2 gap-5">
            {/* Bank Linking */}
            <div className="rounded-xl p-4" style={{ backgroundColor: BRAND.warningDark, border: `2px solid ${BRAND.warning}` }}>
              <div className="flex items-center gap-3 mb-3">
                <div 
                  style={{ 
                    position: 'relative',
                    width: '40px',
                    height: '40px',
                    minWidth: '40px',
                    borderRadius: '10px',
                    backgroundColor: BRAND.success,
                  }}
                >
                  <Banknote 
                    style={{ 
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '20px',
                      height: '20px',
                      color: BRAND.text,
                    }} 
                  />
                </div>
                <div>
                  <h4 className="font-bold text-base" style={{ color: BRAND.text }}>Link Bank Account</h4>
                  <p className="text-xs font-medium" style={{ color: BRAND.warning }}>For payouts</p>
                </div>
              </div>
              <div className="flex justify-center mb-3">
                <img 
                  src={bankLinkingVisual} 
                  alt="Bank account linking" 
                  style={{ 
                    width: '100px', 
                    height: '100px', 
                    objectFit: 'contain',
                    borderRadius: '10px',
                  }} 
                />
              </div>
              <PhoneMockup><ScreenBank /></PhoneMockup>
              <div className="mt-3 flex items-center justify-center gap-2 text-sm font-medium" style={{ color: BRAND.warning }}>
                <SkipForward className="h-4 w-4" />
                <span>Can skip and do later</span>
              </div>
            </div>
            
            {/* Device Pairing */}
            <div className="rounded-xl p-4" style={{ backgroundColor: BRAND.warningDark, border: `2px solid ${BRAND.warning}` }}>
              <div className="flex items-center gap-3 mb-3">
                <div 
                  style={{ 
                    position: 'relative',
                    width: '40px',
                    height: '40px',
                    minWidth: '40px',
                    borderRadius: '10px',
                    backgroundColor: BRAND.primaryDark,
                  }}
                >
                  <Smartphone 
                    style={{ 
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '20px',
                      height: '20px',
                      color: BRAND.accent,
                    }} 
                  />
                </div>
                <div>
                  <h4 className="font-bold text-base" style={{ color: BRAND.text }}>Pair Device</h4>
                  <p className="text-xs font-medium" style={{ color: BRAND.warning }}>For card payments</p>
                </div>
              </div>
              <div className="flex justify-center mb-3">
                <img 
                  src={devicePairingVisual} 
                  alt="Device pairing" 
                  style={{ 
                    width: '100px', 
                    height: '100px', 
                    objectFit: 'contain',
                    borderRadius: '10px',
                  }} 
                />
              </div>
              <PhoneMockup><ScreenDevice /></PhoneMockup>
              <div className="mt-3 flex items-center justify-center gap-2 text-sm font-medium" style={{ color: BRAND.warning }}>
                <SkipForward className="h-4 w-4" />
                <span>Can skip and do later</span>
              </div>
            </div>
          </div>
          
          {/* Skip explanation */}
          <div className="mt-5 rounded-lg p-4" style={{ backgroundColor: BRAND.warningDark, border: `2px solid ${BRAND.warning}` }}>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5" style={{ color: BRAND.warning }} />
              <div>
                <p className="text-sm font-bold" style={{ color: BRAND.text }}>Why can I skip these steps?</p>
                <p className="text-xs mt-1" style={{ color: BRAND.textMuted }}>
                  Patela lets you start selling right away! Cash sales work without any additional setup. 
                  You can link your bank and pair your device later when you need card payments or payouts.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stage 3: Daily Use */}
        <div className="px-6 py-6">
          <StageHeader
            icon={<Home className="h-5 w-5" />}
            title="Start Selling"
            subtitle="Your daily workflow from dashboard to successful sales"
            phase="usage"
          />
          
          <div className="rounded-xl p-5" style={{ backgroundColor: BRAND.success, border: `2px solid ${BRAND.successLight}` }}>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <PhoneMockup label="Dashboard"><ScreenHome /></PhoneMockup>
              <FlowArrow />
              <PhoneMockup label="Take Payment"><ScreenPayment /></PhoneMockup>
              <FlowArrow />
              <PhoneMockup label="Success!"><ScreenPaySuccess /></PhoneMockup>
            </div>
            <div className="mt-5 text-center">
              <p className="text-sm font-medium" style={{ color: BRAND.text }}>
                <span style={{ color: BRAND.text, fontWeight: 700 }}>Cash sales</span> work immediately • <span style={{ color: BRAND.text, fontWeight: 700 }}>Card payments</span> require device
              </p>
            </div>
          </div>
        </div>

        {/* Feature Availability Matrix */}
        <div className="px-6 py-6">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2" style={{ color: BRAND.text }}>
            <Check className="h-6 w-6" style={{ color: BRAND.accent }} />
            What Works Without Full Setup?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-lg p-4" style={{ backgroundColor: BRAND.success, border: `2px solid ${BRAND.successLight}` }}>
              <div className="flex items-center gap-2 mb-3">
                <div 
                  style={{ 
                    position: 'relative',
                    width: '20px',
                    height: '20px',
                    minWidth: '20px',
                  }}
                >
                  <CheckCircle2 
                    style={{ 
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '20px',
                      height: '20px',
                      color: BRAND.text,
                    }} 
                  />
                </div>
                <h4 className="font-bold text-base" style={{ color: BRAND.text }}>Always Available</h4>
              </div>
              <ul className="space-y-1.5 text-sm" style={{ color: BRAND.text }}>
                <li>• Record cash sales</li>
                <li>• Add items to catalog</li>
                <li>• View sales history</li>
                <li>• Manage team members</li>
                <li>• Track daily earnings</li>
              </ul>
            </div>
            
            <div className="rounded-lg p-4" style={{ backgroundColor: BRAND.primaryDark, border: `2px solid ${BRAND.accent}` }}>
              <div className="flex items-center gap-2 mb-3">
                <div 
                  style={{ 
                    position: 'relative',
                    width: '20px',
                    height: '20px',
                    minWidth: '20px',
                  }}
                >
                  <Smartphone 
                    style={{ 
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '20px',
                      height: '20px',
                      color: BRAND.accent,
                    }} 
                  />
                </div>
                <h4 className="font-bold text-base" style={{ color: BRAND.accent }}>Needs Device</h4>
              </div>
              <ul className="space-y-1.5 text-sm" style={{ color: BRAND.textMuted }}>
                <li>• Accept card payments</li>
                <li>• Tap to pay (NFC)</li>
                <li>• QR code payments</li>
                <li>• Chip & PIN</li>
              </ul>
            </div>
            
            <div className="rounded-lg p-4" style={{ backgroundColor: BRAND.primary, border: `2px solid ${BRAND.primaryLight}` }}>
              <div className="flex items-center gap-2 mb-3">
                <div 
                  style={{ 
                    position: 'relative',
                    width: '20px',
                    height: '20px',
                    minWidth: '20px',
                  }}
                >
                  <Banknote 
                    style={{ 
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '20px',
                      height: '20px',
                      color: BRAND.accent,
                    }} 
                  />
                </div>
                <h4 className="font-bold text-base" style={{ color: BRAND.text }}>Needs Bank Account</h4>
              </div>
              <ul className="space-y-1.5 text-sm" style={{ color: BRAND.textMuted }}>
                <li>• Request payouts</li>
                <li>• Same-day transfers</li>
                <li>• Instant payouts</li>
                <li>• Automatic settlements</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer with Human Touch */}
        <div className="px-6 py-6 text-center relative" style={{ borderTop: `2px solid ${BRAND.primaryLight}` }}>
          <div className="flex justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full overflow-hidden opacity-80" style={{ border: `2px solid ${BRAND.accent}` }}>
              <img src={vendorPortrait1} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden opacity-80" style={{ border: `2px solid ${BRAND.accent}` }}>
              <img src={vendorPortrait2} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
          <LogoFull className="h-10 mx-auto mb-3" />
          <p className="text-sm font-medium" style={{ color: BRAND.textSubtle }}>
            Built for the Hustle. Patela © 2025
          </p>
          <p className="text-xs mt-2" style={{ color: BRAND.textSubtle }}>
            Languages: English • isiZulu • Sesotho • Xitsonga
          </p>
        </div>
      </div>
    </div>
  );
}