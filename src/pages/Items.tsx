import { useCallback, useEffect, useMemo, useState } from "react";
import { BottomNav } from "@/components/patela/BottomNav";
import { Button } from "@/components/ui/button";
import {
  fetchIMSBarcodeItems,
  getIMSApiBaseUrl,
  IMSBarcodeItem,
  IMSBarcodeItemsPagination,
} from "@/lib/ims-api";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Package,
  PackageX,
  RefreshCcw,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ViewMode = "all" | "available" | "unavailable";

const ITEMS_LIMIT = 10;

const toNumberOrNull = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;

  const numberValue =
    typeof value === "number" ? value : Number(String(value).replace(/[^0-9.-]/g, ""));

  return Number.isFinite(numberValue) ? numberValue : null;
};

const getProductName = (item: IMSBarcodeItem) =>
  item.product?.name || item.sku || item.barcode || "IMS Item";

const getSku = (item: IMSBarcodeItem) => item.sku || item.product?.sku || "—";

const getItemPrice = (item: IMSBarcodeItem): number | null => {
  const itemAny = item as any;
  const productAny = item.product as any;

  return (
    toNumberOrNull(itemAny.price) ??
    toNumberOrNull(itemAny.unitPrice) ??
    toNumberOrNull(itemAny.sellingPrice) ??
    toNumberOrNull(itemAny.retailPrice) ??
    toNumberOrNull(productAny?.unitPrice) ??
    toNumberOrNull(productAny?.price) ??
    toNumberOrNull(productAny?.sellingPrice) ??
    toNumberOrNull(productAny?.retailPrice)
  );
};

const formatCurrency = (amount: number | null) => {
  if (amount === null) return "Price not available";

  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(amount);
};

const getItemStatus = (item: IMSBarcodeItem) => {
  const status = String(item.status || "").toUpperCase();

  if (status === "SOLD" || status === "REMOVED" || status === "OUT_OF_STOCK") {
    return "unavailable";
  }

  return "available";
};

const getStatusLabel = (item: IMSBarcodeItem) => {
  if (item.status) return item.status.replace(/_/g, " ");
  return getItemStatus(item) === "available" ? "Available" : "Unavailable";
};

export default function Items() {
  const [items, setItems] = useState<IMSBarcodeItem[]>([]);
  const [pagination, setPagination] = useState<IMSBarcodeItemsPagination | undefined>();
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableItems = useMemo(
    () => items.filter((item) => getItemStatus(item) === "available"),
    [items]
  );

  const unavailableItems = useMemo(
    () => items.filter((item) => getItemStatus(item) === "unavailable"),
    [items]
  );

  const displayedItems =
    viewMode === "available"
      ? availableItems
      : viewMode === "unavailable"
      ? unavailableItems
      : items;

  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.total ?? items.length;

  const loadItems = useCallback(
    async (nextPage = page, search = activeSearch, showToast = false) => {
      setError(null);

      if (items.length === 0) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const result = await fetchIMSBarcodeItems(nextPage, ITEMS_LIMIT, search);

      if (!result.success) {
        setError(result.message);
        setItems([]);
        setPagination(undefined);

        if (showToast) {
          toast.error(result.message);
        }

        setLoading(false);
        setRefreshing(false);
        return;
      }

      setItems(result.items);
      setPagination(result.pagination);

      if (showToast) {
        toast.success("IMS items refreshed");
      }

      setLoading(false);
      setRefreshing(false);
    },
    [activeSearch, items.length, page]
  );

  useEffect(() => {
    loadItems(1, "");
  }, []);

  const handleSearch = () => {
    const cleanSearch = searchInput.trim();
    setActiveSearch(cleanSearch);
    setPage(1);
    loadItems(1, cleanSearch, true);
  };

  const clearSearch = () => {
    setSearchInput("");
    setActiveSearch("");
    setPage(1);
    loadItems(1, "", true);
  };

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;

    setPage(nextPage);
    loadItems(nextPage, activeSearch);
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
      <div className="min-h-screen patela-app-bg flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] items-center justify-center px-6 text-center">
        <PackageX className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-lg font-bold text-foreground mb-2">Unable to load IMS items</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => loadItems(page, activeSearch, true)}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen patela-app-bg pb-24">
      <header className="sticky top-0 z-40 bg-primary px-6 py-4 patela-shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-primary-foreground/70">IMS Inventory</p>
            <h1 className="text-2xl font-bold text-primary-foreground">My Items</h1>
          </div>

          <Button
            size="sm"
            onClick={() => loadItems(page, activeSearch, true)}
            disabled={refreshing}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4 mr-1" />
            )}
            Refresh
          </Button>
        </div>

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
            onClick={() => setViewMode("available")}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              viewMode === "available"
                ? "bg-success text-success-foreground"
                : "bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
            )}
          >
            <Package className="h-4 w-4" />
            Available ({availableItems.length})
          </button>

          <button
            onClick={() => setViewMode("unavailable")}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              viewMode === "unavailable"
                ? "bg-destructive text-destructive-foreground"
                : "bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
            )}
          >
            <PackageX className="h-4 w-4" />
            Unavailable ({unavailableItems.length})
          </button>
        </div>
      </header>

      <main className="px-6 py-4 space-y-4">
        <section className="bg-card rounded-2xl border border-primary/10 p-4 patela-shadow-sm space-y-3">
          <div className="flex gap-2">
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSearch();
              }}
              placeholder="Search barcode, SKU or product"
              className="h-11 flex-1 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />

            <Button size="icon" onClick={handleSearch} disabled={refreshing}>
              {refreshing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
            </Button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              IMS API: <span className="font-semibold text-foreground">{getIMSApiBaseUrl()}</span>
            </p>

            {activeSearch && (
              <button className="text-xs font-semibold text-accent" onClick={clearSearch}>
                Clear search
              </button>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Showing page {pagination?.page || page} of {totalPages}. Total IMS items: {totalItems}.
          </p>
        </section>

        {unavailableItems.length > 0 && viewMode === "all" && (
          <div className="p-3 bg-warning/15 border border-warning/30 rounded-xl flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0" />
            <p className="text-sm text-warning">
              <strong>{unavailableItems.length} item{unavailableItems.length === 1 ? "" : "s"}</strong> unavailable on this page
            </p>
          </div>
        )}

        <section>
          <div className="grid grid-cols-2 gap-3">
            {displayedItems.map((item, index) => {
              const status = getItemStatus(item);
              const price = getItemPrice(item);
              const warehouse = item.warehouse?.name || item.warehouse?.code;
              const category = item.product?.category?.name;
              const brand = item.product?.brand?.name;

              return (
                <div
                  key={item.id || item.barcode || `${getProductName(item)}-${index}`}
                  className={cn(
                    "bg-card rounded-xl p-4 border transition-all relative",
                    status === "unavailable" && "opacity-70 border-destructive/30",
                    status === "available" && "border-border"
                  )}
                >
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Package className="h-5 w-5 text-accent" />
                    </div>

                    <span
                      className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-bold border",
                        status === "unavailable" && "bg-destructive/10 text-destructive border-destructive/20",
                        status === "available" && "bg-success/10 text-success border-success/20"
                      )}
                    >
                      {getStatusLabel(item)}
                    </span>
                  </div>

                  <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">
                    {getProductName(item)}
                  </h3>

                  <p className="text-lg font-bold text-accent">{formatCurrency(price)}</p>

                  <div className="space-y-1 mt-3">
                    <p className="text-[11px] text-muted-foreground break-all">
                      Barcode: <span className="font-semibold text-foreground">{item.barcode || "—"}</span>
                    </p>

                    <p className="text-[11px] text-muted-foreground">
                      SKU: <span className="font-semibold text-foreground">{getSku(item)}</span>
                    </p>

                    {(item.color || item.size) && (
                      <p className="text-[11px] text-muted-foreground">
                        {item.color || "—"} {item.size ? `• ${item.size}` : ""}
                      </p>
                    )}

                    {(brand || category) && (
                      <p className="text-[11px] text-muted-foreground">
                        {[brand, category].filter(Boolean).join(" • ")}
                      </p>
                    )}

                    {warehouse && (
                      <p className="text-[11px] text-muted-foreground">
                        Warehouse: <span className="font-semibold text-foreground">{warehouse}</span>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {displayedItems.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No IMS items found</p>
              <p className="text-xs text-muted-foreground">
                Try another filter, refresh, or search using a barcode/SKU.
              </p>
            </div>
          )}
        </section>

        <section className="flex items-center justify-between gap-3">
          <Button variant="outline" onClick={() => goToPage(page - 1)} disabled={page <= 1 || refreshing}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <p className="text-xs text-muted-foreground">
            Page <span className="font-bold text-foreground">{page}</span> / {totalPages}
          </p>

          <Button variant="outline" onClick={() => goToPage(page + 1)} disabled={page >= totalPages || refreshing}>
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
