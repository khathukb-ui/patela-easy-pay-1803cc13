import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/patela/BottomNav";
import { Button } from "@/components/ui/button";
import { useCatalog, CatalogItem } from "@/hooks/use-catalog";
import { Plus, Package, AlertTriangle, PackageX, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

type ViewMode = "all" | "low" | "out";

export default function Items() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { items, loading, error, refetch, getLowStockItems, getOutOfStockItems } = useCatalog();
  const [viewMode, setViewMode] = useState<ViewMode>("all");

  const lowStockItems = getLowStockItems();
  const outOfStockItems = getOutOfStockItems();

  const displayedItems = viewMode === "low" 
    ? lowStockItems 
    : viewMode === "out" 
    ? outOfStockItems 
    : items;

  const getStockStatus = (item: CatalogItem) => {
    if (!item.in_stock) return "out";
    if (item.available_qty <= 5) return "low";
    return "ok";
  };

  if (loading) {
    return (
      <div className="min-h-screen patela-app-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen patela-app-bg flex flex-col items-center justify-center px-6 text-center">
        <PackageX className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-lg font-bold text-foreground mb-2">Unable to load items</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={refetch}>Try Again</Button>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen patela-app-bg pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-primary px-6 py-4 patela-shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-primary-foreground">My Items</h1>
          <p className="text-xs text-primary-foreground/70">Synced from IMS</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("all")}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              viewMode === "all"
                ? "bg-primary-foreground text-primary"
                : "bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
            )}
          >
            <Package className="h-4 w-4" />
            All ({items.length})
          </button>
          <button
            onClick={() => setViewMode("low")}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              viewMode === "low"
                ? "bg-warning text-warning-foreground"
                : "bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
            )}
          >
            <AlertTriangle className="h-4 w-4" />
            Low ({lowStockItems.length})
          </button>
          <button
            onClick={() => setViewMode("out")}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              viewMode === "out"
                ? "bg-destructive text-destructive-foreground"
                : "bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
            )}
          >
            <PackageX className="h-4 w-4" />
            Out ({outOfStockItems.length})
          </button>
        </div>
      </header>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && viewMode === "all" && (
        <div className="mx-6 mt-4 p-3 bg-warning/15 border border-warning/30 rounded-xl flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0" />
          <p className="text-sm text-warning">
            <strong>{lowStockItems.length} items</strong> running low on stock
          </p>
        </div>
      )}

      <main className="px-6 py-4">
        {/* Items Grid */}
        <div className="grid grid-cols-2 gap-3">
          {displayedItems.map((item) => {
            const status = getStockStatus(item);
            return (
              <div
                key={item.sku}
                className={cn(
                  "bg-card rounded-xl p-4 border transition-all",
                  status === "out" && "opacity-60 border-destructive/30",
                  status === "low" && "border-warning/30",
                  status === "ok" && "border-border"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-accent" />
                  </div>
                  {item.category && (
                    <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">
                      {item.category}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{item.name}</h3>
                <p className="text-lg font-bold text-accent">R{item.price.toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      status === "out" && "bg-destructive/10 text-destructive",
                      status === "low" && "bg-warning/10 text-warning",
                      status === "ok" && "bg-success/10 text-success"
                    )}
                  >
                    {status === "out" ? "Out of stock" : `${item.available_qty} in stock`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {displayedItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No items found</p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
