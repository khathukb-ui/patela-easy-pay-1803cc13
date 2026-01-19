import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  ArrowLeft,
  Play, 
  Pause,
  X,
  User,
  Phone,
  Lock,
  FileText,
  Home,
  ShoppingBag,
  CreditCard,
  BarChart3,
  Smartphone,
  Wallet,
  Check,
  Globe,
  QrCode,
  Bluetooth,
  Clock,
  Banknote,
  RotateCcw,
  Sparkles
} from "lucide-react";
import { PatelaLogo } from "@/components/patela/PatelaLogo";
import { Progress } from "@/components/ui/progress";

interface DemoStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  mockScreen: React.ReactNode;
  duration: number;
  phase: "onboarding" | "setup" | "usage";
}

// Animation variants
const phoneVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.8,
    rotateY: direction > 0 ? 15 : -15,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.8,
    rotateY: direction < 0 ? 15 : -15,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const textVariants = {
  enter: { opacity: 0, y: 20 },
  center: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, delay: 0.1 }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3 }
  },
};

// Mock screen components
function MockPhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[280px] h-[560px] bg-background rounded-[40px] border-4 border-foreground/20 shadow-2xl overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-foreground/20 rounded-b-2xl z-10" />
      <div className="h-full overflow-hidden">
        {children}
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-foreground/30 rounded-full" />
    </div>
  );
}

function LandingMock() {
  return (
    <div className="h-full bg-primary flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
      >
        <PatelaLogo size="lg" variant="light" className="mb-6" />
      </motion.div>
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-primary-foreground mb-2"
      >
        Accept Payments
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-primary-foreground/70 text-sm mb-8"
      >
        The POS device built for SA vendors
      </motion.p>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full space-y-3"
      >
        <div className="bg-accent text-accent-foreground py-3 rounded-xl font-semibold text-sm">
          Get Started →
        </div>
        <div className="bg-primary-foreground/20 text-primary-foreground py-3 rounded-xl text-sm">
          Sign In
        </div>
      </motion.div>
    </div>
  );
}

function LanguageMock() {
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'zu', name: 'isiZulu', flag: '🇿🇦' },
    { code: 'st', name: 'Sesotho', flag: '🇿🇦' },
    { code: 'ts', name: 'Xitsonga', flag: '🇿🇦' },
  ];
  
  return (
    <div className="h-full bg-background flex flex-col p-6">
      <div className="pt-8 mb-6">
        <motion.div
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
        >
          <Globe className="h-12 w-12 text-accent mb-4" />
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Choose Language</h2>
        <p className="text-muted-foreground text-sm">Select your preferred language</p>
      </div>
      
      <div className="space-y-3">
        {languages.map((lang, i) => (
          <motion.div 
            key={lang.code}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 ${i === 0 ? 'border-accent bg-accent/10' : 'border-border'}`}
          >
            <span className="text-2xl">{lang.flag}</span>
            <span className={`font-medium ${i === 0 ? 'text-foreground' : 'text-muted-foreground'}`}>{lang.name}</span>
            {i === 0 && <Check className="h-5 w-5 text-accent ml-auto" />}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SignUpMock() {
  return (
    <div className="h-full bg-background flex flex-col p-6">
      <div className="flex items-center gap-2 mb-8 pt-8">
        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Step 1 of 5</span>
      </div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center mb-4"
      >
        <Phone className="h-7 w-7 text-primary" />
      </motion.div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Your Phone Number</h2>
      <p className="text-muted-foreground text-sm mb-6">We'll send you a code to verify</p>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <div className="flex items-center border-2 border-accent rounded-xl p-4 bg-accent/5">
          <span className="text-foreground font-medium mr-2">🇿🇦 +27</span>
          <span className="text-foreground">81 234 5678</span>
          <motion.div 
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="w-0.5 h-5 bg-accent ml-1"
          />
        </div>
        <div className="bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-center">
          Send Code
        </div>
      </motion.div>
    </div>
  );
}

function OTPMock() {
  return (
    <div className="h-full bg-background flex flex-col p-6">
      <div className="flex items-center gap-2 mb-8 pt-8">
        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Step 2 of 5</span>
      </div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center mb-4"
      >
        <Check className="h-7 w-7 text-accent" />
      </motion.div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Enter Code</h2>
      <p className="text-muted-foreground text-sm mb-6">Sent to +27 81 234 5678</p>
      
      <div className="flex gap-2 justify-center mb-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div 
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.08, type: "spring" }}
            className={`w-10 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-bold ${i <= 6 ? 'border-accent bg-accent/10 text-foreground' : 'border-border'}`}
          >
            {i <= 6 ? Math.floor(Math.random() * 10) : ''}
          </motion.div>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-sm text-success flex items-center justify-center gap-2"
      >
        <Check className="h-4 w-4" />
        Code verified!
      </motion.div>
    </div>
  );
}

function PINMock() {
  return (
    <div className="h-full bg-background flex flex-col p-6">
      <div className="flex items-center gap-2 mb-6 pt-8">
        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Step 3 of 5</span>
      </div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center mb-4"
      >
        <Lock className="h-7 w-7 text-primary" />
      </motion.div>
      <h2 className="text-xl font-bold text-foreground mb-2">Create Your PIN</h2>
      <p className="text-muted-foreground text-sm mb-4">4 digits to secure your account</p>
      
      <div className="flex gap-4 justify-center mb-6">
        {[1, 2, 3, 4].map((i) => (
          <motion.div 
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${i <= 4 ? 'bg-primary' : 'border-2 border-border'}`}
          >
            {i <= 4 && <div className="w-3 h-3 bg-primary-foreground rounded-full" />}
          </motion.div>
        ))}
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'].map((key, i) => (
          <div key={i} className={`h-12 rounded-xl flex items-center justify-center text-lg font-semibold ${key !== '' ? 'bg-secondary text-foreground' : ''}`}>
            {key}
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailsMock() {
  return (
    <div className="h-full bg-background flex flex-col p-6 overflow-y-auto">
      <div className="flex items-center gap-2 mb-4 pt-8">
        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Step 4 of 5</span>
      </div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
      >
        <FileText className="h-10 w-10 text-primary mb-3" />
      </motion.div>
      <h2 className="text-xl font-bold text-foreground mb-1">Your Details</h2>
      <p className="text-muted-foreground text-sm mb-4">Tell us about your business</p>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <div>
          <label className="text-xs text-muted-foreground">First Name</label>
          <div className="border border-accent bg-accent/5 rounded-xl p-3 mt-1">
            <span className="text-foreground">Thembi</span>
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Business Name</label>
          <div className="border border-accent bg-accent/5 rounded-xl p-3 mt-1">
            <span className="text-foreground">Thembi's Fresh Produce</span>
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Business Type</label>
          <div className="border border-accent bg-accent/10 rounded-xl p-3 mt-1 flex items-center justify-between">
            <span className="text-foreground">Food & Beverages</span>
            <Check className="h-4 w-4 text-accent" />
          </div>
        </div>
      </motion.div>
      
      <div className="mt-auto pt-4">
        <div className="bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-center text-sm">
          Continue
        </div>
      </div>
    </div>
  );
}

function OnboardingSuccessMock() {
  return (
    <div className="h-full bg-gradient-to-b from-primary to-primary/80 flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mb-6"
      >
        <Sparkles className="h-12 w-12 text-accent-foreground" />
      </motion.div>
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-bold text-primary-foreground mb-2"
      >
        Account Created! 🎉
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-primary-foreground/80 mb-8"
      >
        You're ready to start selling
      </motion.p>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full space-y-3"
      >
        <div className="bg-accent text-accent-foreground py-3 rounded-xl font-semibold text-sm">
          Complete Setup →
        </div>
        <div className="text-primary-foreground/70 text-sm flex items-center justify-center gap-1">
          <Clock className="h-3 w-3" />
          Skip for now
        </div>
      </motion.div>
    </div>
  );
}

function BankLinkMock() {
  return (
    <div className="h-full bg-background flex flex-col p-6">
      <div className="flex items-center gap-2 mb-6 pt-8">
        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Optional Setup</span>
      </div>
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="w-14 h-14 bg-success/20 rounded-2xl flex items-center justify-center mb-4"
      >
        <Banknote className="h-7 w-7 text-success" />
      </motion.div>
      <h2 className="text-xl font-bold text-foreground mb-2">Link Your Bank</h2>
      <p className="text-muted-foreground text-sm mb-6">Get your earnings paid directly to you</p>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-primary" />
          <div className="flex-1">
            <p className="font-medium text-foreground text-sm">Scan Bank Card</p>
            <p className="text-muted-foreground text-xs">Quick & easy</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <FileText className="h-6 w-6 text-primary" />
          <div className="flex-1">
            <p className="font-medium text-foreground text-sm">Enter Manually</p>
            <p className="text-muted-foreground text-xs">Type your details</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </motion.div>
      
      <div className="mt-auto pt-6 text-center">
        <p className="text-muted-foreground text-xs flex items-center justify-center gap-1">
          <Clock className="h-3 w-3" />
          Do this later
        </p>
      </div>
    </div>
  );
}

function DevicePairMock() {
  return (
    <div className="h-full bg-background flex flex-col p-6">
      <div className="flex items-center gap-2 mb-6 pt-8">
        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Optional Setup</span>
      </div>
      <motion.div
        initial={{ scale: 0, rotate: 10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center mb-4"
      >
        <Smartphone className="h-7 w-7 text-accent" />
      </motion.div>
      <h2 className="text-xl font-bold text-foreground mb-2">Pair Your Device</h2>
      <p className="text-muted-foreground text-sm mb-6">Accept card & tap-to-pay</p>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 flex items-center gap-3">
          <QrCode className="h-6 w-6 text-accent" />
          <div className="flex-1">
            <p className="font-medium text-foreground text-sm">Scan QR Code</p>
            <p className="text-muted-foreground text-xs">Fastest way to pair</p>
          </div>
          <ArrowRight className="h-4 w-4 text-accent" />
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <Bluetooth className="h-6 w-6 text-primary" />
          <div className="flex-1">
            <p className="font-medium text-foreground text-sm">Use Bluetooth</p>
            <p className="text-muted-foreground text-xs">Connect nearby</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </motion.div>
      
      <div className="mt-auto pt-6 text-center">
        <p className="text-muted-foreground text-xs flex items-center justify-center gap-1">
          <Clock className="h-3 w-3" />
          Skip for now
        </p>
      </div>
    </div>
  );
}

function HomeMock() {
  return (
    <div className="h-full bg-background flex flex-col">
      <div className="bg-primary p-4 pt-10 pb-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-primary-foreground/70 text-sm">Good morning</p>
            <p className="text-primary-foreground font-bold text-lg">Thembi 👋</p>
          </motion.div>
          <div className="w-10 h-10 bg-primary-foreground/20 rounded-full" />
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-primary-foreground/10 rounded-xl p-4"
        >
          <p className="text-primary-foreground/70 text-sm">Today's Sales</p>
          <p className="text-primary-foreground font-bold text-3xl">R0.00</p>
        </motion.div>
      </div>
      
      <div className="flex-1 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-accent text-accent-foreground rounded-2xl p-4 flex items-center justify-between mb-4"
        >
          <div>
            <p className="font-bold text-lg">Take Payment</p>
            <p className="text-accent-foreground/70 text-sm">Start selling now!</p>
          </div>
          <CreditCard className="h-8 w-8" />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-3"
        >
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <ShoppingBag className="h-6 w-6 mx-auto mb-1 text-primary" />
            <p className="text-sm font-medium">Items</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <BarChart3 className="h-6 w-6 mx-auto mb-1 text-primary" />
            <p className="text-sm font-medium">Sales</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function AddItemMock() {
  return (
    <div className="h-full bg-background flex flex-col p-6">
      <div className="flex items-center gap-2 mb-4 pt-8">
        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-bold text-foreground mb-1">Add Item</h2>
      <p className="text-muted-foreground text-sm mb-4">Create products to sell faster</p>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-3 flex-1"
      >
        <div>
          <label className="text-xs text-muted-foreground">Item Name</label>
          <div className="border border-accent bg-accent/5 rounded-xl p-3 mt-1">
            <span className="text-foreground">Fresh Tomatoes (1kg)</span>
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Price</label>
          <div className="border border-accent bg-accent/10 rounded-xl p-3 mt-1">
            <span className="text-foreground font-bold">R 25.00</span>
          </div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-center flex items-center justify-center gap-2"
      >
        <Check className="h-5 w-5" />
        Save Item
      </motion.div>
    </div>
  );
}

function PaymentMock() {
  return (
    <div className="h-full bg-background flex flex-col">
      <div className="p-6 pt-10 text-center">
        <p className="text-muted-foreground text-sm mb-2">Enter Amount</p>
        <motion.p 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-5xl font-bold text-foreground"
        >
          R 150<span className="text-muted-foreground">.00</span>
        </motion.p>
      </div>
      
      <div className="flex gap-2 justify-center mb-4 px-4">
        {['R20', 'R50', 'R100'].map((amt, i) => (
          <motion.div 
            key={amt}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="bg-secondary text-foreground px-4 py-2 rounded-lg text-sm font-medium"
          >
            {amt}
          </motion.div>
        ))}
      </div>
      
      <div className="flex-1 p-4">
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, '⌫'].map((key) => (
            <div key={key} className="h-12 bg-card border border-border rounded-xl flex items-center justify-center text-lg font-semibold">
              {key}
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4">
        <div className="bg-accent text-accent-foreground py-4 rounded-xl font-bold text-center text-lg">
          Charge R150 →
        </div>
      </div>
    </div>
  );
}

function SuccessMock() {
  return (
    <div className="h-full bg-success flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="w-24 h-24 bg-success-foreground rounded-full flex items-center justify-center mb-6"
      >
        <Check className="h-12 w-12 text-success" />
      </motion.div>
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-bold text-success-foreground mb-2"
      >
        Payment Success!
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-success-foreground/80 text-xl mb-6"
      >
        R 150.00
      </motion.p>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-success-foreground/60 text-sm"
      >
        Your first sale is complete 🎉
      </motion.p>
    </div>
  );
}

function SalesMock() {
  const sales = [
    { time: '2:30 PM', amount: 'R150.00', method: 'Cash' },
    { time: '1:15 PM', amount: 'R45.00', method: 'Cash' },
    { time: '11:30 AM', amount: 'R320.00', method: 'Cash' },
  ];
  
  return (
    <div className="h-full bg-background flex flex-col">
      <div className="p-6 pt-10">
        <h2 className="text-xl font-bold text-foreground mb-1">Sales History</h2>
        <p className="text-muted-foreground text-sm">Today: R515.00</p>
      </div>
      
      <div className="flex-1 px-4 space-y-3">
        {sales.map((sale, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="bg-card border border-border rounded-xl p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-bold text-foreground">{sale.amount}</p>
              <p className="text-muted-foreground text-sm">{sale.time} • {sale.method}</p>
            </div>
            <Check className="h-5 w-5 text-success" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SetupPromptMock() {
  return (
    <div className="h-full bg-background flex flex-col p-6">
      <div className="pt-10">
        <h2 className="text-xl font-bold text-foreground mb-2">Unlock More Features</h2>
        <p className="text-muted-foreground text-sm mb-6">Complete setup when you're ready</p>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4 flex-1"
      >
        <div className="bg-success/10 border border-success/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-success" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground text-sm">Pair Device</p>
              <p className="text-muted-foreground text-xs">Accept card payments</p>
            </div>
            <ArrowRight className="h-4 w-4 text-success" />
          </div>
        </div>
        
        <div className="bg-accent/10 border border-accent/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
              <Wallet className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground text-sm">Link Bank</p>
              <p className="text-muted-foreground text-xs">Get your payouts</p>
            </div>
            <ArrowRight className="h-4 w-4 text-accent" />
          </div>
        </div>
      </motion.div>
      
      <p className="text-muted-foreground text-xs text-center">
        Cash sales work without any setup!
      </p>
    </div>
  );
}

export default function Demo() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(1);

  const demoSteps: DemoStep[] = [
    {
      id: 1,
      title: "Welcome to Patela",
      subtitle: "Your journey begins",
      description: "Discover how Patela helps you accept payments and grow your business. Tap 'Get Started' to begin.",
      icon: <Home className="h-6 w-6" />,
      mockScreen: <LandingMock />,
      duration: 4,
      phase: "onboarding",
    },
    {
      id: 2,
      title: "Choose Your Language",
      subtitle: "Step 1: Personalization",
      description: "Select English, isiZulu, Sesotho, or Xitsonga. The entire app will speak your language!",
      icon: <Globe className="h-6 w-6" />,
      mockScreen: <LanguageMock />,
      duration: 4,
      phase: "onboarding",
    },
    {
      id: 3,
      title: "Enter Your Number",
      subtitle: "Step 2: Registration",
      description: "Just enter your phone number – that's all you need to create your account. No paperwork!",
      icon: <Phone className="h-6 w-6" />,
      mockScreen: <SignUpMock />,
      duration: 4,
      phase: "onboarding",
    },
    {
      id: 4,
      title: "Verify Your Number",
      subtitle: "Step 3: Confirmation",
      description: "We send a 6-digit code via SMS. Enter it to verify your phone number.",
      icon: <Check className="h-6 w-6" />,
      mockScreen: <OTPMock />,
      duration: 4,
      phase: "onboarding",
    },
    {
      id: 5,
      title: "Create Your PIN",
      subtitle: "Step 4: Security",
      description: "Set a 4-digit PIN that only you know. This keeps your money and account safe.",
      icon: <Lock className="h-6 w-6" />,
      mockScreen: <PINMock />,
      duration: 4,
      phase: "onboarding",
    },
    {
      id: 6,
      title: "Your Details",
      subtitle: "Step 5: KYC",
      description: "Add your name and business details. This helps us serve you better and enables payouts.",
      icon: <FileText className="h-6 w-6" />,
      mockScreen: <DetailsMock />,
      duration: 4,
      phase: "onboarding",
    },
    {
      id: 7,
      title: "Account Created!",
      subtitle: "Setup Complete",
      description: "You're registered! Now you can complete optional setup or skip to start selling immediately.",
      icon: <Sparkles className="h-6 w-6" />,
      mockScreen: <OnboardingSuccessMock />,
      duration: 5,
      phase: "onboarding",
    },
    {
      id: 8,
      title: "Link Your Bank",
      subtitle: "Optional: Get Payouts",
      description: "Connect your bank account to receive your earnings. Scan your card or enter details manually.",
      icon: <Banknote className="h-6 w-6" />,
      mockScreen: <BankLinkMock />,
      duration: 5,
      phase: "setup",
    },
    {
      id: 9,
      title: "Pair Your Device",
      subtitle: "Optional: Card Payments",
      description: "Connect your Patela device via QR code or Bluetooth to accept card and tap-to-pay.",
      icon: <Smartphone className="h-6 w-6" />,
      mockScreen: <DevicePairMock />,
      duration: 5,
      phase: "setup",
    },
    {
      id: 10,
      title: "Your Dashboard",
      subtitle: "Home Sweet Home",
      description: "Welcome to your home screen! See your sales, take payments, and access all features from here.",
      icon: <Home className="h-6 w-6" />,
      mockScreen: <HomeMock />,
      duration: 4,
      phase: "usage",
    },
    {
      id: 11,
      title: "Add Your Items",
      subtitle: "Build Your Catalog",
      description: "Add the products you sell. This makes taking payments even faster with one-tap selling!",
      icon: <ShoppingBag className="h-6 w-6" />,
      mockScreen: <AddItemMock />,
      duration: 4,
      phase: "usage",
    },
    {
      id: 12,
      title: "Take Your First Payment",
      subtitle: "Make a Sale",
      description: "Enter the amount or select an item. It's as easy as using a calculator!",
      icon: <CreditCard className="h-6 w-6" />,
      mockScreen: <PaymentMock />,
      duration: 4,
      phase: "usage",
    },
    {
      id: 13,
      title: "Payment Success!",
      subtitle: "Money Received",
      description: "Congratulations! The payment is complete. Your earnings will be paid out to your bank.",
      icon: <Check className="h-6 w-6" />,
      mockScreen: <SuccessMock />,
      duration: 5,
      phase: "usage",
    },
    {
      id: 14,
      title: "Track Your Sales",
      subtitle: "See Your Earnings",
      description: "View all your transactions. Know exactly how much you've made today, this week, or this month.",
      icon: <BarChart3 className="h-6 w-6" />,
      mockScreen: <SalesMock />,
      duration: 4,
      phase: "usage",
    },
    {
      id: 15,
      title: "Complete Setup Anytime",
      subtitle: "Unlock More Features",
      description: "Pair your device for card payments, or link your bank for payouts – whenever you're ready!",
      icon: <Smartphone className="h-6 w-6" />,
      mockScreen: <SetupPromptMock />,
      duration: 5,
      phase: "usage",
    },
  ];

  const currentDemoStep = demoSteps[currentStep];

  useEffect(() => {
    if (!isPlaying) return;

    const stepDuration = currentDemoStep.duration * 1000;
    const interval = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      setProgress((elapsed / stepDuration) * 100);

      if (elapsed >= stepDuration) {
        if (currentStep < demoSteps.length - 1) {
          setDirection(1);
          setCurrentStep(prev => prev + 1);
          setProgress(0);
        } else {
          setIsPlaying(false);
        }
      }
    }, interval);

    return () => clearInterval(timer);
  }, [currentStep, isPlaying, currentDemoStep.duration]);

  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
      setProgress(0);
    }
  };

  const handleStepClick = (index: number) => {
    setDirection(index > currentStep ? 1 : -1);
    setCurrentStep(index);
    setProgress(0);
  };

  const handleRestart = () => {
    setDirection(-1);
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "onboarding": return "text-primary";
      case "setup": return "text-accent";
      case "usage": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case "onboarding": return "Onboarding";
      case "setup": return "Optional Setup";
      case "usage": return "Daily Use";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-primary/90 flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <PatelaLogo size="md" variant="light" />
        <Button
          variant="ghost"
          size="sm"
          className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
          onClick={() => navigate("/")}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 px-4 pb-4">
        {/* Left: Info Panel */}
        <div className="lg:w-1/2 max-w-md text-center lg:text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <div className="flex items-center gap-2 justify-center lg:justify-start mb-4">
                <span className={`text-xs font-medium uppercase tracking-wider ${getPhaseColor(currentDemoStep.phase)}`}>
                  {getPhaseLabel(currentDemoStep.phase)}
                </span>
                <span className="text-primary-foreground/40">•</span>
                <span className="text-primary-foreground/60 text-xs">
                  {currentStep + 1} of {demoSteps.length}
                </span>
              </div>

              <div className="flex items-center gap-3 justify-center lg:justify-start mb-4">
                <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent">
                  {currentDemoStep.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-primary-foreground">{currentDemoStep.title}</h2>
                  <p className="text-primary-foreground/60">{currentDemoStep.subtitle}</p>
                </div>
              </div>

              <p className="text-lg text-primary-foreground/80 mb-6">
                {currentDemoStep.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress bar */}
          <div className="mb-6">
            <Progress value={progress} className="h-1 bg-primary-foreground/20" />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 justify-center lg:justify-start">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/10 w-12 h-12"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              onClick={handleNext}
              disabled={currentStep === demoSteps.length - 1}
            >
              <ArrowRight className="h-5 w-5" />
            </Button>

            {currentStep === demoSteps.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                onClick={handleRestart}
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Phase-grouped step dots */}
          <div className="mt-6 space-y-2">
            {["onboarding", "setup", "usage"].map((phase) => (
              <div key={phase} className="flex items-center gap-2 justify-center lg:justify-start">
                <span className={`text-xs w-16 ${getPhaseColor(phase)}`}>
                  {phase === "onboarding" ? "Sign up" : phase === "setup" ? "Setup" : "Use"}
                </span>
                <div className="flex gap-1">
                  {demoSteps
                    .filter((step) => step.phase === phase)
                    .map((step, i) => {
                      const globalIndex = demoSteps.findIndex(s => s.id === step.id);
                      return (
                        <button
                          key={step.id}
                          onClick={() => handleStepClick(globalIndex)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            globalIndex === currentStep 
                              ? 'bg-accent w-4' 
                              : globalIndex < currentStep 
                                ? 'bg-accent/60' 
                                : 'bg-primary-foreground/30'
                          }`}
                        />
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Phone Mockup */}
        <div className="lg:w-1/2 flex justify-center" style={{ perspective: "1000px" }}>
          <div className="relative">
            {/* Glow effect */}
            <motion.div 
              className="absolute inset-0 bg-accent/20 rounded-full blur-3xl scale-110"
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={phoneVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <MockPhoneFrame>
                  {currentDemoStep.mockScreen}
                </MockPhoneFrame>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="p-4 text-center">
        <Button
          size="lg"
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-8"
          onClick={() => navigate("/onboarding/language")}
        >
          Get Started Now
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
