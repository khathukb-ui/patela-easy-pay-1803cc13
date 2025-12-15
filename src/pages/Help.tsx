import { BottomNav } from "@/components/patela/BottomNav";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  MessageCircle, 
  PlayCircle, 
  BookOpen,
  ChevronRight,
  Smartphone,
  Signal,
  Battery,
  RefreshCw
} from "lucide-react";

interface HelpItemProps {
  icon: typeof Phone;
  label: string;
  description?: string;
  onClick?: () => void;
  variant?: "default" | "highlight";
}

function HelpItem({ icon: Icon, label, description, onClick, variant = "default" }: HelpItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-colors text-left ${
        variant === "highlight" 
          ? "bg-primary/5 border-primary/20 hover:bg-primary/10" 
          : "bg-card border-border hover:bg-secondary/50"
      }`}
    >
      <div className={`h-10 w-10 rounded-xl ${variant === "highlight" ? 'patela-gradient-primary' : 'bg-secondary'} flex items-center justify-center`}>
        <Icon className={`h-5 w-5 ${variant === "highlight" ? 'text-primary-foreground' : 'text-foreground'}`} />
      </div>
      <div className="flex-1">
        <p className="font-medium text-foreground">{label}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </button>
  );
}

export default function Help() {
  // Mock device diagnostics
  const diagnostics = {
    deviceId: "PAT-7823-ZA",
    battery: 85,
    signal: "Strong",
    lastSync: "2 minutes ago",
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-6 patela-shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">Help & Support</h1>
        <p className="text-muted-foreground">We're here to help you</p>
      </header>

      <main className="px-6 py-6 space-y-6">
        {/* Quick Contact */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-auto py-4 flex-col gap-2">
            <Phone className="h-6 w-6 text-primary" />
            <span className="font-medium">Call Us</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2">
            <MessageCircle className="h-6 w-6 text-success" />
            <span className="font-medium">WhatsApp</span>
          </Button>
        </div>

        {/* Learn */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Learn How
          </h2>
          <div className="space-y-2">
            <HelpItem
              icon={PlayCircle}
              label="Watch: How to Take Payment"
              description="2 min video"
              variant="highlight"
            />
            <HelpItem
              icon={BookOpen}
              label="Practice Mode"
              description="Try a test payment"
            />
          </div>
        </div>

        {/* Device Diagnostics */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Device Status
          </h2>
          <div className="bg-card rounded-xl border border-border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Smartphone className="h-4 w-4" />
                <span className="text-sm">Device ID</span>
              </div>
              <span className="text-sm font-mono text-foreground">{diagnostics.deviceId}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Battery className="h-4 w-4" />
                <span className="text-sm">Battery</span>
              </div>
              <span className="text-sm font-medium text-success">{diagnostics.battery}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Signal className="h-4 w-4" />
                <span className="text-sm">Signal</span>
              </div>
              <span className="text-sm font-medium text-success">{diagnostics.signal}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <RefreshCw className="h-4 w-4" />
                <span className="text-sm">Last Sync</span>
              </div>
              <span className="text-sm text-foreground">{diagnostics.lastSync}</span>
            </div>

            <Button variant="outline" className="w-full mt-2">
              Share Diagnostics with Support
            </Button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
