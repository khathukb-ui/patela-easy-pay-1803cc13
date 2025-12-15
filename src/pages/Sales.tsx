import { useState } from "react";
import { BottomNav } from "@/components/patela/BottomNav";
import { SaleItem, SaleStatus } from "@/components/patela/SaleItem";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Filter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Sale {
  id: string;
  amount: number;
  timestamp: Date;
  status: SaleStatus;
  lastFourDigits?: string;
  note?: string;
}

// Mock data
const mockSales: Sale[] = [
  { id: "1", amount: 150, timestamp: new Date(), status: "success", lastFourDigits: "4532", note: "Bread & milk" },
  { id: "2", amount: 75, timestamp: new Date(Date.now() - 3600000), status: "success", lastFourDigits: "8821" },
  { id: "3", amount: 200, timestamp: new Date(Date.now() - 7200000), status: "queued" },
  { id: "4", amount: -50, timestamp: new Date(Date.now() - 10800000), status: "refunded", lastFourDigits: "4532" },
  { id: "5", amount: 320, timestamp: new Date(Date.now() - 14400000), status: "success", lastFourDigits: "9012" },
  { id: "6", amount: 85, timestamp: new Date(Date.now() - 18000000), status: "failed", lastFourDigits: "1234" },
];

export default function Sales() {
  const [sales] = useState<Sale[]>(mockSales);
  const { t } = useLanguage();

  const totalToday = sales
    .filter((s) => s.status === "success")
    .reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="min-h-screen patela-app-bg pb-24">
      {/* Header */}
      <header className="bg-primary px-6 py-4 patela-shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-primary-foreground">{t("salesHistory")}</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">
              <Filter className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Date Selector */}
        <Button variant="outline" className="w-full justify-start gap-2 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20">
          <Calendar className="h-4 w-4" />
          {t("today")}, {new Date().toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
        </Button>
      </header>

      <main className="px-6 py-4">
        {/* Summary */}
        <div className="bg-accent/10 rounded-xl p-4 mb-6 border border-accent/20">
          <p className="text-sm text-primary mb-1">{t("todaySales")}</p>
          <p className="text-3xl font-bold text-accent">R{totalToday.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">{sales.filter(s => s.status === "success").length} {t("numberOfSales").toLowerCase()}</p>
        </div>

        {/* Sales List */}
        <div className="space-y-3">
          {sales.map((sale) => (
            <SaleItem
              key={sale.id}
              {...sale}
              onClick={() => console.log("View sale", sale.id)}
            />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
