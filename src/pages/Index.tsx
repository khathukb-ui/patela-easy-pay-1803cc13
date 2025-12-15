import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Shield, 
  Wifi, 
  Smartphone, 
  CreditCard, 
  Zap, 
  Clock, 
  Banknote,
  CheckCircle2,
  ChevronRight,
  Nfc,
  Store,
  TrendingUp
} from "lucide-react";
import { PatelaLogo } from "@/components/patela/PatelaLogo";
import patelaHeroBg from "@/assets/patela-hero-bg.jpg";
import patelaDeviceBox from "@/assets/patela-device-box.jpg";

export default function Index() {
  const navigate = useNavigate();

  const products = [
    {
      name: "Patela Phanda",
      description: "Compact POS for everyday sales",
      price: "R499",
      features: ["Tap to pay", "Works offline", "Long battery life"],
      popular: true,
    },
    {
      name: "Patela Pro",
      description: "Advanced POS with receipt printer",
      price: "R899",
      features: ["Built-in printer", "Large screen", "All payment types"],
      popular: false,
    },
  ];

  const services = [
    { icon: CreditCard, title: "Card Payments", desc: "Accept Visa, Mastercard & more" },
    { icon: Nfc, title: "Tap to Pay", desc: "NFC contactless payments" },
    { icon: Banknote, title: "Fast Payouts", desc: "Money in your account next day" },
    { icon: Store, title: "Business Tools", desc: "Track sales & manage your hustle" },
  ];

  const steps = [
    { step: 1, title: "Get Your Device", desc: "Order online or from a local agent" },
    { step: 2, title: "Link Your Bank", desc: "Quick setup, no paperwork" },
    { step: 3, title: "Start Selling", desc: "Accept payments in minutes" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${patelaHeroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/95 via-primary/85 to-primary" />
        
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
          <div className="mb-2 animate-patela-bounce-in">
            <PatelaLogo size="xl" variant="light" />
          </div>
          <p className="text-xl text-primary-foreground/90 mb-8 font-bold uppercase tracking-wide animate-patela-slide-up" style={{ animationDelay: "0.1s" }}>
            Built for the Hustle.
          </p>

          {/* Quick Features */}
          <div className="w-full max-w-sm space-y-3 mb-8 animate-patela-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-4 bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-3 border border-primary-foreground/20">
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                <Wifi className="h-5 w-5 text-accent-foreground" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-primary-foreground">Works Offline</p>
                <p className="text-sm text-primary-foreground/70">Keep selling, even with no signal</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-3 border border-primary-foreground/20">
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                <Zap className="h-5 w-5 text-accent-foreground" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-primary-foreground">Next-Day Payouts</p>
                <p className="text-sm text-primary-foreground/70">Get your money fast</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-3 border border-primary-foreground/20">
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                <Shield className="h-5 w-5 text-accent-foreground" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-primary-foreground">Safe & Secure</p>
                <p className="text-sm text-primary-foreground/70">Your money goes straight to your bank</p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-sm space-y-3 animate-patela-slide-up" style={{ animationDelay: "0.3s" }}>
            <Button
              size="xl"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold patela-shadow-accent"
              onClick={() => navigate("/onboarding/language")}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="w-full text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => navigate("/home")}
            >
              I already have an account
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center text-primary-foreground/60 animate-bounce">
          <span className="text-xs mb-1">Scroll to learn more</span>
          <ChevronRight className="h-5 w-5 rotate-90" />
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 px-6 bg-background">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-2">Our POS Devices</h2>
          <p className="text-muted-foreground text-center mb-8">Choose the right device for your business</p>
          
          <div className="space-y-4">
            {products.map((product) => (
              <div 
                key={product.name}
                className={`relative bg-card rounded-2xl p-5 border ${product.popular ? 'border-accent shadow-lg' : 'border-primary/10'}`}
              >
                {product.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-primary/10 flex-shrink-0">
                    <img src={patelaDeviceBox} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                    <p className="text-2xl font-bold text-accent">{product.price}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.features.map((feature) => (
                    <span key={feature} className="inline-flex items-center gap-1 text-xs bg-primary/5 text-primary px-2 py-1 rounded-full">
                      <CheckCircle2 className="h-3 w-3" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 px-6 bg-primary/5">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-2">What We Offer</h2>
          <p className="text-muted-foreground text-center mb-8">Everything you need to grow your business</p>
          
          <div className="grid grid-cols-2 gap-4">
            {services.map((service) => (
              <div key={service.title} className="bg-card rounded-2xl p-4 border border-primary/10 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-accent/10 flex items-center justify-center">
                  <service.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{service.title}</h3>
                <p className="text-xs text-muted-foreground">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 px-6 bg-background">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-2">How to Get Started</h2>
          <p className="text-muted-foreground text-center mb-8">Start accepting payments in 3 easy steps</p>
          
          <div className="space-y-4">
            {steps.map((item, index) => (
              <div key={item.step} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-lg flex-shrink-0">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute left-6 mt-12 w-0.5 h-4 bg-accent/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-6 bg-primary">
        <div className="max-w-lg mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <TrendingUp className="h-6 w-6 text-accent" />
            <span className="text-primary-foreground/80 font-medium">Join 10,000+ vendors</span>
          </div>
          <h2 className="text-2xl font-bold text-primary-foreground mb-4">Ready to Grow Your Hustle?</h2>
          <Button
            size="xl"
            className="w-full max-w-sm bg-accent hover:bg-accent/90 text-accent-foreground font-semibold patela-shadow-accent"
            onClick={() => navigate("/onboarding/language")}
          >
            Get Your Device Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}