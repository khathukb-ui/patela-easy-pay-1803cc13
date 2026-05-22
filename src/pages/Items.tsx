import { useState } from "react";
import { BottomNav } from "@/components/patela/BottomNav";
import { Button } from "@/components/ui/button";
import { ItemModal } from "@/components/patela/ItemModal";
import { useSupabaseCatalog, CatalogItem, CatalogItemInput } from "@/hooks/use-supabase-catalog";
import { Plus, Package, AlertTriangle, PackageX, Loader2, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ViewMode = "all" | "low" | "out";

export default function Items() {
  const { items, loading, error, refetch, addItem, updateItem, deleteItem, getLowStockItems, getOutOfStockItems } = useSupabaseCatalog();
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);

  const lowStockItems = getLowStockItems();
  const outOfStockItems = getOutOfStockItems();

  const displayedItems = viewMode === "low"
    ? lowStockItems
    : viewMode === "out"
    ? outOfStockItems
    : items;

  const getStockStatus = (item: CatalogItem) => {
    if (item.stock <= 0) return "out";
    if (item.stock <= item.low_stock_threshold) return "low";
    return "ok";
  };

  const handleSave = async (input: CatalogItemInput) => {
    if (editingItem) {
      await updateItem(editingItem.id, input);
      toast.success("Item updated");
    } else {
      await addItem(input);
      toast.success("Item added");
    }
  };

  const handleDelete = async (item: CatalogItem) => {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    try {
      await deleteItem(item.id);
      toast.success("Item deleted");
    } catch (e: any) {
      toast.error(e.message || "Failed to delete item");
    }
  };

  const openAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEdit = (item: CatalogItem) => {
    setEditingItem(item);
    setModalOpen(true);
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
          <Button
            size="sm"
            onClick={openAdd}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
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
                key={item.id}
                className={cn(
                  "bg-card rounded-xl p-4 border transition-all relative group",
                  status === "out" && "opacity-60 border-destructive/30",
                  status === "low" && "border-warning/30",
                  status === "ok" && "border-border"
                )}
              >
                {/* Action buttons */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(item)}
                    className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                  >
                    <Pencil className="h-3 w-3 text-foreground" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="h-7 w-7 rounded-full bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors"
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </button>
                </div>

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
                    {status === "out" ? "Out of stock" : `${item.stock} in stock`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {displayedItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No items found</p>
            <Button onClick={openAdd}>
              <Plus className="h-4 w-4 mr-1" />
              Add Your First Item
            </Button>
          </div>
        )}
      </main>

      {/* Item Modal */}
      <ItemModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
        item={editingItem}
      />

      <BottomNav />
    </div>
  );
}
