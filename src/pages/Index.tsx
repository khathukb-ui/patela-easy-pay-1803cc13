import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Shield, 
  Wifi, 
  CreditCard, 
  Zap, 
  Banknote,
  CheckCircle2,
  Nfc,
  Store,
  TrendingUp,
  Users,
  Globe,
  Headphones,
  Star,
  Play,
  ChevronDown
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
      priceNote: "once-off",
      features: ["Tap to pay", "Works offline", "Long battery life", "Free delivery"],
      popular: true,
    },
    {
      name: "Patela Pro",
      description: "Advanced POS with receipt printer",
      price: "R899",
      priceNote: "once-off",
      features: ["Built-in printer", "Large screen", "All payment types", "Priority support"],
      popular: false,
    },
  ];

  const features = [
    { 
      icon: Wifi, 
      title: "Works Offline", 
      desc: "Keep selling even without signal. Transactions sync automatically when you're back online.",
      highlight: true
    },
    { 
      icon: Zap, 
      title: "Next-Day Payouts", 
      desc: "Your money hits your bank account the very next business day. No waiting.",
      highlight: false
    },
    { 
      icon: Shield, 
      title: "Bank-Level Security", 
      desc: "Your money goes straight to your bank. Encrypted, protected, always safe.",
      highlight: false
    },
    { 
      icon: Globe, 
      title: "Multiple Languages", 
      desc: "Use the app in English, isiZulu, Sesotho, or Xitsonga. Your language, your way.",
      highlight: false
    },
  ];

  const services = [
    { icon: CreditCard, title: "Card Payments", desc: "Visa, Mastercard, Amex & more", color: "bg-primary" },
    { icon: Nfc, title: "Tap to Pay", desc: "Fast NFC contactless", color: "bg-accent" },
    { icon: Banknote, title: "Fast Payouts", desc: "Next-day settlements", color: "bg-success" },
    { icon: Store, title: "Business Tools", desc: "Sales tracking & reports", color: "bg-warning" },
  ];

  const steps = [
    { step: 1, title: "Get Your Device", desc: "Order online or from a local agent. Free delivery nationwide." },
    { step: 2, title: "Link Your Bank", desc: "Quick setup with card scan. No paperwork, no hassle." },
    { step: 3, title: "Start Selling", desc: "Accept payments in minutes. Grow your hustle today." },
  ];

  const stats = [
    { value: "10,000+", label: "Active Vendors" },
    { value: "R50M+", label: "Processed Monthly" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" },
  ];

  const successStories = [
    { 
      name: "Thembi Mabaso", 
      location: "Soweto Market", 
      business: "Fresh Produce Vendor",
      quote: "Before Patela, I was losing 30% of sales because people only had cards. Now my daily sales jumped from R800 to R1,200! I even bought a second table for my stall.", 
      rating: 5,
      growth: "+50% Sales",
      since: "Using Patela for 8 months"
    },
    { 
      name: "Sipho Khumalo", 
      location: "Durban Beachfront", 
      business: "Craft & Souvenirs",
      quote: "Tourists love tapping to pay. Last December I made R45,000 in one month – my best season ever! The next-day payouts mean I can buy stock immediately.", 
      rating: 5,
      growth: "R45K Record Month",
      since: "Using Patela for 1 year"
    },
    { 
      name: "Nomsa Dlamini", 
      location: "Cape Town Station", 
      business: "Fast Food Kiosk",
      quote: "I was scared of technology, but Patela is so simple. My daughter set it up in 5 minutes. Now I process over 100 card transactions every day!", 
      rating: 5,
      growth: "100+ Daily Sales",
      since: "Using Patela for 6 months"
    },
    { 
      name: "Mandla Ngwenya", 
      location: "Johannesburg CBD", 
      business: "Mobile Phone Repairs",
      quote: "Customers trust me more now that I give proper receipts. My repair business grew from a small table to a proper shop in just 10 months with Patela.", 
      rating: 5,
      growth: "Opened Own Shop",
      since: "Using Patela for 10 months"
    },
    { 
      name: "Lindiwe Mokoena", 
      location: "Pretoria Township", 
      business: "Hair Salon",
      quote: "My stokvel group all got Patela together. We share tips and help each other. My salon income doubled because clients can pay for bigger treatments with card.", 
      rating: 5,
      growth: "2x Income",
      since: "Using Patela for 14 months"
    },
    { 
      name: "Thabo Molefe", 
      location: "Bloemfontein Market", 
      business: "Clothing & Accessories",
      quote: "I started with one rack of clothes. Thanks to card payments, I now have 3 employees and a container shop. Patela changed my life completely!", 
      rating: 5,
      growth: "3 Employees Hired",
      since: "Using Patela for 2 years"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      {/* Navigation */}
      {/* Navigation - Full wordmark for website header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-b border-primary-foreground/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <PatelaLogo size="lg" variant="light" />
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm font-medium">Features</a>
            <a href="#devices" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm font-medium">Devices</a>
            <a href="#how-it-works" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm font-medium">How It Works</a>
            <a href="#testimonials" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm font-medium">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 hidden sm:inline-flex"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
            <Button
              size="sm"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
              onClick={() => navigate("/onboarding/language")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col pt-16">
        <div 
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${patelaHeroBg})`, backgroundPosition: '100% center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/75 to-primary/55" />
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex-1 flex items-center">
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left content */}
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6 animate-patela-fade-in">
                  <Zap className="h-4 w-4" />
                  <span>Now with Tap to Pay</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight mb-6 animate-patela-slide-up">
                  Accept Payments.
                  <br />
                  <span className="text-accent">Grow Your Hustle.</span>
                </h1>
                
                <p className="text-lg sm:text-xl text-primary-foreground/80 mb-8 max-w-lg mx-auto md:mx-0 animate-patela-slide-up" style={{ animationDelay: "0.1s" }}>
                  The POS device built for South African street vendors. Simple to use, works offline, and gets your money to you fast.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-patela-slide-up" style={{ animationDelay: "0.2s" }}>
                  <Button
                    size="xl"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold patela-shadow-accent text-lg px-8"
                    onClick={() => navigate("/onboarding/language")}
                  >
                    Get Your Device
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    size="xl"
                    className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
                    onClick={() => navigate("/demo")}
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Button>
                </div>

                {/* Trust badges */}
                <div className="flex items-center gap-6 justify-center md:justify-start mt-10 animate-patela-fade-in" style={{ animationDelay: "0.3s" }}>
                  <div className="flex items-center gap-2 text-primary-foreground/60">
                    <Shield className="h-5 w-5" />
                    <span className="text-sm">Secure Payments</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary-foreground/60">
                    <Users className="h-5 w-5" />
                    <span className="text-sm">10,000+ Vendors</span>
                  </div>
                </div>
              </div>

              {/* Right content - Device showcase */}
              <div className="relative hidden md:flex justify-center items-center">
                <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl scale-75" />
                <div className="relative bg-gradient-to-br from-primary-foreground/10 to-primary-foreground/5 backdrop-blur-sm rounded-3xl p-8 border border-primary-foreground/20">
                  <img 
                    src={patelaDeviceBox} 
                    alt="Patela POS Device" 
                    className="w-72 h-72 object-contain animate-patela-bounce-in"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-accent text-accent-foreground px-4 py-2 rounded-xl font-bold shadow-lg">
                    From R499
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-primary-foreground/50 animate-bounce">
          <ChevronDown className="h-6 w-6" />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-accent py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl sm:text-3xl font-extrabold text-accent-foreground">{stat.value}</p>
                <p className="text-sm text-accent-foreground/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-3">Why Choose Patela</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Built for Your Business</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Everything you need to accept payments and grow your business, with features designed for South African vendors.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div 
                key={feature.title} 
                className={`relative group bg-card rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${feature.highlight ? 'border-accent shadow-md' : 'border-border'}`}
              >
                {feature.highlight && (
                  <div className="absolute -top-3 left-6 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </div>
                )}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${feature.highlight ? 'bg-accent/10' : 'bg-primary/10'}`}>
                  <feature.icon className={`h-7 w-7 ${feature.highlight ? 'text-accent' : 'text-primary'}`} />
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 sm:px-6 bg-secondary/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-3">Our Services</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Everything You Need</h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {services.map((service) => (
              <div key={service.title} className="bg-card rounded-2xl p-6 border border-border text-center hover:shadow-lg transition-shadow">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${service.color} flex items-center justify-center`}>
                  <service.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-foreground mb-1">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Devices Section */}
      <section id="devices" className="py-20 px-4 sm:px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-3">Choose Your Device</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">POS Devices Made for You</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Simple, reliable, and affordable. Pick the device that fits your business.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {products.map((product) => (
              <div 
                key={product.name}
                className={`relative bg-card rounded-3xl p-8 border-2 transition-all duration-300 hover:shadow-xl ${product.popular ? 'border-accent shadow-lg scale-105' : 'border-border hover:border-primary/30'}`}
              >
                {product.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-sm font-bold px-6 py-2 rounded-full shadow-lg">
                    MOST POPULAR
                  </div>
                )}
                <div className="flex flex-col items-center text-center">
                  <div className="w-40 h-40 rounded-2xl overflow-hidden border border-border mb-6 bg-secondary/50">
                    <img src={patelaDeviceBox} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold text-foreground text-2xl mb-2">{product.name}</h3>
                  <p className="text-muted-foreground mb-4">{product.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-primary">{product.price}</span>
                    <span className="text-muted-foreground ml-2">{product.priceNote}</span>
                  </div>
                  <div className="space-y-3 w-full mb-6">
                    {product.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3 text-left">
                        <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    size="lg"
                    className={`w-full font-semibold ${product.popular ? 'bg-accent hover:bg-accent/90 text-accent-foreground patela-shadow-accent' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}
                    onClick={() => navigate("/onboarding/language")}
                  >
                    Order Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 bg-primary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-3">Getting Started</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">Up and Running in Minutes</h2>
            <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">Three simple steps to start accepting payments</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item, index) => (
              <div key={item.step} className="relative text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-extrabold text-3xl shadow-lg">
                  {item.step}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-accent/30" />
                )}
                <h3 className="font-bold text-primary-foreground text-xl mb-3">{item.title}</h3>
                <p className="text-primary-foreground/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-3">Success Stories</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Real Vendors, Real Growth</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">See how Patela is helping South African entrepreneurs grow their businesses</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {successStories.map((story) => (
              <div key={story.name} className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                {/* Growth Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 bg-success/10 text-success px-3 py-1 rounded-full text-xs font-bold">
                    <TrendingUp className="h-3 w-3" />
                    {story.growth}
                  </span>
                </div>
                
                {/* Quote */}
                <p className="text-foreground mb-6 leading-relaxed">"{story.quote}"</p>
                
                {/* Profile */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">{story.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{story.name}</p>
                    <p className="text-sm text-muted-foreground">{story.business}</p>
                    <p className="text-xs text-muted-foreground">{story.location}</p>
                  </div>
                </div>
                
                {/* Time Badge */}
                <p className="text-xs text-muted-foreground mt-4 text-center">{story.since}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 px-4 sm:px-6 bg-secondary/50">
        <div className="max-w-4xl mx-auto text-center">
          <Headphones className="h-12 w-12 mx-auto mb-4 text-accent" />
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Need Help? We're Here 24/7</h2>
          <p className="text-muted-foreground mb-6">Call us anytime or chat with us on WhatsApp. Our team speaks your language.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" className="font-semibold">
              Call 0800 123 456
            </Button>
            <Button variant="outline" size="lg" className="font-semibold">
              WhatsApp Us
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-primary via-primary to-primary/90">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
            <TrendingUp className="h-4 w-4" />
            <span>Join 10,000+ successful vendors</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">Ready to Grow Your Hustle?</h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">Get your Patela device today and start accepting card payments. Low monthly fees that won't eat into your profits.</p>
          <Button
            size="xl"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold patela-shadow-accent text-lg px-10"
            onClick={() => navigate("/onboarding/language")}
          >
            Get Your Device Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <PatelaLogo size="md" variant="light" />
              <p className="text-primary-foreground/60 mt-4 text-sm">Built for the hustle. Empowering South African vendors everywhere.</p>
            </div>
            <div>
              <h4 className="font-semibold text-primary-foreground mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/60">
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Patela Phanda</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Patela Pro</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Compare Devices</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/60">
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/60">
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/10 pt-8 text-center text-sm text-primary-foreground/50">
            <p>© 2024 Patela. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
