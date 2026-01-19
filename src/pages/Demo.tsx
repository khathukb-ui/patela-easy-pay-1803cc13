import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Globe
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
  duration: number; // seconds
}

// Mock screen components
function MockPhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[280px] h-[560px] bg-background rounded-[40px] border-4 border-foreground/20 shadow-2xl overflow-hidden">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-foreground/20 rounded-b-2xl z-10" />
      {/* Screen content */}
      <div className="h-full overflow-hidden">
        {children}
      </div>
      {/* Home indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-foreground/30 rounded-full" />
    </div>
  );
}

function LandingMock() {
  return (
    <div className="h-full bg-primary flex flex-col items-center justify-center p-6 text-center">
      <PatelaLogo size="lg" variant="light" className="mb-6" />
      <h2 className="text-2xl font-bold text-primary-foreground mb-2">Accept Payments</h2>
      <p className="text-primary-foreground/70 text-sm mb-8">The POS device built for SA vendors</p>
      <div className="w-full space-y-3">
        <div className="bg-accent text-accent-foreground py-3 rounded-xl font-semibold text-sm">
          Get Your Device →
        </div>
        <div className="bg-primary-foreground/20 text-primary-foreground py-3 rounded-xl text-sm">
          Sign In
        </div>
      </div>
    </div>
  );
}

function SignUpMock() {
  return (
    <div className="h-full bg-background flex flex-col p-6">
      <div className="flex items-center gap-2 mb-8 pt-8">
        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Create Account</h2>
      <p className="text-muted-foreground text-sm mb-6">Enter your phone number to get started</p>
      
      <div className="space-y-4">
        <div className="flex items-center border border-border rounded-xl p-4">
          <span className="text-foreground font-medium mr-2">🇿🇦 +27</span>
          <span className="text-muted-foreground">81 234 5678</span>
        </div>
        <div className="bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-center">
          Send Code
        </div>
      </div>
    </div>
  );
}

function OTPMock() {
  return (
    <div className="h-full bg-background flex flex-col p-6">
      <div className="flex items-center gap-2 mb-8 pt-8">
        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mb-4">
        <Phone className="h-8 w-8 text-accent" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Verify Number</h2>
      <p className="text-muted-foreground text-sm mb-6">Enter the 6-digit code we sent you</p>
      
      <div className="flex gap-2 justify-center mb-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={`w-10 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-bold ${i <= 4 ? 'border-accent bg-accent/10 text-foreground' : 'border-border'}`}>
            {i <= 4 ? i : ''}
          </div>
        ))}
      </div>
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
        <Globe className="h-12 w-12 text-accent mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Choose Language</h2>
        <p className="text-muted-foreground text-sm">Select your preferred language</p>
      </div>
      
      <div className="space-y-3">
        {languages.map((lang, i) => (
          <div key={lang.code} className={`flex items-center gap-3 p-4 rounded-xl border-2 ${i === 0 ? 'border-accent bg-accent/10' : 'border-border'}`}>
            <span className="text-2xl">{lang.flag}</span>
            <span className={`font-medium ${i === 0 ? 'text-foreground' : 'text-muted-foreground'}`}>{lang.name}</span>
            {i === 0 && <Check className="h-5 w-5 text-accent ml-auto" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function PINMock() {
  return (
    <div className="h-full bg-background flex flex-col p-6">
      <div className="pt-8 mb-6">
        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-4">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Create Your PIN</h2>
        <p className="text-muted-foreground text-sm">Enter a 4-digit PIN to secure your account</p>
      </div>
      
      <div className="flex gap-4 justify-center mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`w-12 h-12 rounded-full flex items-center justify-center ${i <= 3 ? 'bg-primary' : 'border-2 border-border'}`}>
            {i <= 3 && <div className="w-3 h-3 bg-primary-foreground rounded-full" />}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'].map((key, i) => (
          <div key={i} className={`h-14 rounded-xl flex items-center justify-center text-xl font-semibold ${key !== '' ? 'bg-secondary text-foreground' : ''}`}>
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
      <div className="pt-8 mb-6">
        <FileText className="h-10 w-10 text-primary mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">Your Details</h2>
        <p className="text-muted-foreground text-sm">Tell us about yourself</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground">First Name</label>
          <div className="border border-border rounded-xl p-3 mt-1">
            <span className="text-foreground">Thembi</span>
          </div>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Business Name</label>
          <div className="border border-border rounded-xl p-3 mt-1">
            <span className="text-foreground">Thembi's Fresh Produce</span>
          </div>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Business Type</label>
          <div className="border border-accent bg-accent/10 rounded-xl p-3 mt-1 flex items-center justify-between">
            <span className="text-foreground">Food & Beverages</span>
            <Check className="h-4 w-4 text-accent" />
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeMock() {
  return (
    <div className="h-full bg-background flex flex-col">
      <div className="bg-primary p-4 pt-10 pb-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-primary-foreground/70 text-sm">Good morning</p>
            <p className="text-primary-foreground font-bold text-lg">Thembi 👋</p>
          </div>
          <div className="w-10 h-10 bg-primary-foreground/20 rounded-full" />
        </div>
        <div className="bg-primary-foreground/10 rounded-xl p-4">
          <p className="text-primary-foreground/70 text-sm">Today's Sales</p>
          <p className="text-primary-foreground font-bold text-3xl">R1,250.00</p>
        </div>
      </div>
      
      <div className="flex-1 p-4">
        <div className="bg-accent text-accent-foreground rounded-2xl p-4 flex items-center justify-between mb-4">
          <div>
            <p className="font-bold text-lg">Take Payment</p>
            <p className="text-accent-foreground/70 text-sm">Start a new sale</p>
          </div>
          <CreditCard className="h-8 w-8" />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <ShoppingBag className="h-6 w-6 mx-auto mb-1 text-primary" />
            <p className="text-sm font-medium">Items</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <BarChart3 className="h-6 w-6 mx-auto mb-1 text-primary" />
            <p className="text-sm font-medium">Sales</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddItemMock() {
  return (
    <div className="h-full bg-background flex flex-col p-6">
      <div className="pt-8 mb-6">
        <h2 className="text-xl font-bold text-foreground mb-2">Add Item</h2>
        <p className="text-muted-foreground text-sm">Add products to sell faster</p>
      </div>
      
      <div className="space-y-4 flex-1">
        <div>
          <label className="text-sm text-muted-foreground">Item Name</label>
          <div className="border border-border rounded-xl p-3 mt-1">
            <span className="text-foreground">Fresh Tomatoes (1kg)</span>
          </div>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Price</label>
          <div className="border border-accent bg-accent/10 rounded-xl p-3 mt-1">
            <span className="text-foreground font-bold">R 25.00</span>
          </div>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Category</label>
          <div className="border border-border rounded-xl p-3 mt-1">
            <span className="text-foreground">Fresh Produce</span>
          </div>
        </div>
      </div>
      
      <div className="bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-center">
        Save Item ✓
      </div>
    </div>
  );
}

function PaymentMock() {
  return (
    <div className="h-full bg-background flex flex-col">
      <div className="p-6 pt-10 text-center">
        <p className="text-muted-foreground text-sm mb-2">Enter Amount</p>
        <p className="text-5xl font-bold text-foreground">R 150<span className="text-muted-foreground">.00</span></p>
      </div>
      
      <div className="flex gap-2 justify-center mb-4 px-4">
        {['R20', 'R50', 'R100'].map((amt) => (
          <div key={amt} className="bg-secondary text-foreground px-4 py-2 rounded-lg text-sm font-medium">
            {amt}
          </div>
        ))}
      </div>
      
      <div className="flex-1 p-4">
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, '⌫'].map((key, i) => (
            <div key={i} className="h-14 bg-card border border-border rounded-xl flex items-center justify-center text-xl font-semibold">
              {key}
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4">
        <div className="bg-accent text-accent-foreground py-4 rounded-xl font-bold text-center text-lg">
          Continue →
        </div>
      </div>
    </div>
  );
}

function SuccessMock() {
  return (
    <div className="h-full bg-success flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-success-foreground rounded-full flex items-center justify-center mb-6 animate-bounce">
        <Check className="h-12 w-12 text-success" />
      </div>
      <h2 className="text-3xl font-bold text-success-foreground mb-2">Payment Success!</h2>
      <p className="text-success-foreground/80 text-xl mb-6">R 150.00</p>
      <p className="text-success-foreground/60 text-sm">Your first sale is complete 🎉</p>
    </div>
  );
}

function SalesMock() {
  const sales = [
    { time: '2:30 PM', amount: 'R150.00', method: 'Card' },
    { time: '1:15 PM', amount: 'R45.00', method: 'Cash' },
    { time: '11:30 AM', amount: 'R320.00', method: 'Card' },
  ];
  
  return (
    <div className="h-full bg-background flex flex-col">
      <div className="p-6 pt-10">
        <h2 className="text-xl font-bold text-foreground mb-1">Sales History</h2>
        <p className="text-muted-foreground text-sm">Today: R515.00</p>
      </div>
      
      <div className="flex-1 px-4 space-y-3">
        {sales.map((sale, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-foreground">{sale.amount}</p>
              <p className="text-muted-foreground text-sm">{sale.time} • {sale.method}</p>
            </div>
            <Check className="h-5 w-5 text-success" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SetupPromptMock() {
  return (
    <div className="h-full bg-background flex flex-col p-6">
      <div className="pt-10 flex-1">
        <h2 className="text-xl font-bold text-foreground mb-6">Complete Your Setup</h2>
        
        <div className="space-y-4">
          <div className="bg-success/10 border border-success/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">Pair Patela Device</p>
                <p className="text-muted-foreground text-xs">Accept card payments</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                <Wallet className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">Link Bank Account</p>
                <p className="text-muted-foreground text-xs">Get your payouts</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm mt-6 text-center">
          You can do this later from Settings
        </p>
      </div>
    </div>
  );
}

export default function Demo() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const demoSteps: DemoStep[] = [
    {
      id: 1,
      title: "Discover Patela",
      subtitle: "Your journey begins",
      description: "Visit our website and see how Patela can help grow your business with simple card payments.",
      icon: <Home className="h-6 w-6" />,
      mockScreen: <LandingMock />,
      duration: 4,
    },
    {
      id: 2,
      title: "Sign Up",
      subtitle: "Quick registration",
      description: "Enter your phone number – that's all you need to create your account. No paperwork!",
      icon: <User className="h-6 w-6" />,
      mockScreen: <SignUpMock />,
      duration: 4,
    },
    {
      id: 3,
      title: "Verify Your Number",
      subtitle: "Quick & secure",
      description: "We send you a code via SMS. Enter it to verify your phone number.",
      icon: <Phone className="h-6 w-6" />,
      mockScreen: <OTPMock />,
      duration: 4,
    },
    {
      id: 4,
      title: "Choose Language",
      subtitle: "Your language, your way",
      description: "Select English, isiZulu, Sesotho, or Xitsonga. The app speaks your language!",
      icon: <Globe className="h-6 w-6" />,
      mockScreen: <LanguageMock />,
      duration: 4,
    },
    {
      id: 5,
      title: "Create PIN",
      subtitle: "Secure your account",
      description: "Set a 4-digit PIN that only you know. This keeps your money safe.",
      icon: <Lock className="h-6 w-6" />,
      mockScreen: <PINMock />,
      duration: 4,
    },
    {
      id: 6,
      title: "Your Details",
      subtitle: "Tell us about you",
      description: "Add your name and business details. This helps us serve you better.",
      icon: <FileText className="h-6 w-6" />,
      mockScreen: <DetailsMock />,
      duration: 4,
    },
    {
      id: 7,
      title: "Your Dashboard",
      subtitle: "Account ready!",
      description: "Welcome to your home screen! See your sales and access all features from here.",
      icon: <Home className="h-6 w-6" />,
      mockScreen: <HomeMock />,
      duration: 5,
    },
    {
      id: 8,
      title: "Add Your Items",
      subtitle: "Build your catalog",
      description: "Add the products you sell. This makes taking payments even faster!",
      icon: <ShoppingBag className="h-6 w-6" />,
      mockScreen: <AddItemMock />,
      duration: 4,
    },
    {
      id: 9,
      title: "Take Payment",
      subtitle: "Your first sale",
      description: "Enter the amount or select an item. It's as easy as using a calculator!",
      icon: <CreditCard className="h-6 w-6" />,
      mockScreen: <PaymentMock />,
      duration: 4,
    },
    {
      id: 10,
      title: "Payment Success!",
      subtitle: "Money received",
      description: "That's it! The payment is complete. Your money is on its way to your bank.",
      icon: <Check className="h-6 w-6" />,
      mockScreen: <SuccessMock />,
      duration: 5,
    },
    {
      id: 11,
      title: "Track Your Sales",
      subtitle: "See your earnings",
      description: "View all your transactions. Know exactly how much you've made today, this week, or this month.",
      icon: <BarChart3 className="h-6 w-6" />,
      mockScreen: <SalesMock />,
      duration: 4,
    },
    {
      id: 12,
      title: "Complete Setup",
      subtitle: "When you're ready",
      description: "Link your bank and pair your device whenever you want. Cash sales work right away!",
      icon: <Smartphone className="h-6 w-6" />,
      mockScreen: <SetupPromptMock />,
      duration: 5,
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
      setCurrentStep(prev => prev - 1);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setProgress(0);
    }
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
    setProgress(0);
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
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 px-4 pb-8">
        {/* Left: Info Panel */}
        <div className="lg:w-1/2 max-w-md text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span>Step {currentStep + 1} of {demoSteps.length}</span>
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

          <p className="text-lg text-primary-foreground/80 mb-8">
            {currentDemoStep.description}
          </p>

          {/* Progress bar */}
          <div className="mb-6">
            <Progress value={progress} className="h-1 bg-primary-foreground/20" />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 justify-center lg:justify-start">
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
          </div>

          {/* Step dots */}
          <div className="flex gap-2 justify-center lg:justify-start mt-6 flex-wrap">
            {demoSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => handleStepClick(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep 
                    ? 'bg-accent w-6' 
                    : index < currentStep 
                      ? 'bg-accent/60' 
                      : 'bg-primary-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Phone Mockup */}
        <div className="lg:w-1/2 flex justify-center">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl scale-110" />
            <MockPhoneFrame>
              {currentDemoStep.mockScreen}
            </MockPhoneFrame>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="p-6 text-center">
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
