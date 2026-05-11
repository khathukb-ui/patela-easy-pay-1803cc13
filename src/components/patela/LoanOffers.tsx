import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoanOffer {
  id: string;
  provider: string;
  amount: number;
  interestRate: number;
  term: string;
  status: "pre_qualified" | "pending" | "approved";
}

interface LoanOffersProps {
  offers?: LoanOffer[];
  onApply?: (offerId: string) => void;
}

const mockOffers: LoanOffer[] = [
  {
    id: "1",
    provider: "Patela Finance",
    amount: 15000,
    interestRate: 12.5,
    term: "12 months",
    status: "pre_qualified",
  },
  {
    id: "2",
    provider: "Growth Capital",
    amount: 25000,
    interestRate: 15.0,
    term: "18 months",
    status: "pre_qualified",
  },
];

export function LoanOffers({ offers = mockOffers, onApply }: LoanOffersProps) {
  const [expandedOffer, setExpandedOffer] = useState<string | null>(null);

  if (offers.length === 0) {
    return null;
  }

  const handleApply = (offerId: string) => {
    if (onApply) {
      onApply(offerId);
    }
  };

  return (
    <div className="bg-card rounded-2xl p-4 border border-primary/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Grow Your Business</h3>
            <p className="text-xs text-muted-foreground">Pre-qualified offers</p>
          </div>
        </div>
        <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
          {offers.length} offers
        </span>
      </div>

      <div className="space-y-3">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className={cn(
              "border rounded-xl p-3 transition-all cursor-pointer",
              expandedOffer === offer.id
                ? "border-accent bg-accent/5"
                : "border-border hover:border-accent/50"
            )}
            onClick={() => setExpandedOffer(expandedOffer === offer.id ? null : offer.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{offer.provider}</p>
                <p className="text-lg font-bold text-primary">
                  R{offer.amount.toLocaleString("en-ZA")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs text-success bg-success/10 px-2 py-1 rounded-full">
                  <CheckCircle2 className="h-3 w-3" />
                  Pre-qualified
                </span>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform",
                    expandedOffer === offer.id && "rotate-90"
                  )}
                />
              </div>
            </div>

            {expandedOffer === offer.id && (
              <div className="mt-3 pt-3 border-t border-border space-y-3 animate-patela-fade-in">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/50 rounded-lg p-2">
                    <p className="text-xs text-muted-foreground">Interest Rate</p>
                    <p className="text-sm font-semibold text-foreground">
                      {offer.interestRate}% p.a.
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Term
                    </p>
                    <p className="text-sm font-semibold text-foreground">{offer.term}</p>
                  </div>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApply(offer.id);
                  }}
                >
                  Apply Now
                </Button>
                <p className="text-[10px] text-center text-muted-foreground">
                  Subject to final approval. Terms & conditions apply.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
