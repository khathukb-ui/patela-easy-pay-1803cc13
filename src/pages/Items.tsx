import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/patela/BottomNav";
import { Button } from "@/components/ui/button";
import { useCatalog, CatalogItem } from "@/hooks/use-catalog";
import { Plus, Package, AlertTriangle, PackageX, Pencil, Trash2, X, Check, Save } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ViewMode = "all" | "low" | "out";

export default function Items() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { items, addItem, updateItem, deleteItem, getLowStockItems, getOutOfStockItems } = useCatalog();
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formStock, setFormStock] = useState("");
  const [formCategory, setFormCategory] = useState("");

  const lowStockItems = getLowStockItems();
  const outOfStockItems = getOutOfStockItems();

  const displayedItems = viewMode === "low" 
    ? lowStockItems 
    : viewMode === "out" 
    ? outOfStockItems 
    : items;

  const resetForm = () => {
    setFormName("");
    setFormPrice("");
    setFormStock("");
    setFormCategory("");
    setShowAddForm(false);
    setEditingItem(null);
  };

  const handleSave = () => {
    if (!formName || !formPrice) return;

    if (editingItem) {
      updateItem(editingItem.id, {
        name: formName,
        price: parseFloat(formPrice),
        stock: parseInt(formStock) || 0,
        category: formCategory || undefined,
      });
      toast.success("Item updated successfully!");
    } else {
      addItem({
        name: formName,
        price: parseFloat(formPrice),
        stock: parseInt(formStock) || 0,
        lowStockThreshold: 5,
        category: formCategory || undefined,
      });
      toast.success("Item added successfully!");
    }

    setHasChanges(true);
    resetForm();
  };

  const handleSaveItems = () => {
    toast.success("Items saved successfully!");
    setHasChanges(false);
  };

  const handleCancelItems = () => {
    if (hasChanges && !confirm("Discard unsaved changes?")) return;
    navigate(-1);
  };

  const handleCancel = () => {
    resetForm();
  };

  const handleEdit = (item: CatalogItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormPrice(item.price.toString());
    setFormStock(item.stock.toString());
    setFormCategory(item.category || "");
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this item?")) {
      deleteItem(id);
      setHasChanges(true);
      toast.success("Item deleted");
    }
  };

  const getStockStatus = (item: CatalogItem) => {
    if (item.stock === 0) return "out";
    if (item.stock <= item.lowStockThreshold) return "low";
    return "ok";
  };

  return (
    <div className="min-h-screen patela-app-bg pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-primary px-6 py-4 patela-shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-primary-foreground">My Items</h1>
          <Button
            size="sm"
            variant="secondary"
            className="gap-2"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-4 w-4" />
            Add New Item
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
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </button>
                  </div>
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
            <p className="text-muted-foreground">No items found</p>
          </div>
        )}
      </main>


      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-[60]">
          <div className="bg-card w-full max-w-lg max-h-[85vh] rounded-t-2xl animate-patela-slide-up overflow-hidden flex flex-col">
            {/* Modal header (fixed) */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card">
              <h2 className="text-lg font-bold text-foreground">
                {editingItem ? "Edit Item" : "Add New Item"}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Modal body (scrolls) */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="patela-form-section">
                <h3 className="patela-section-heading">Item Details</h3>

                <div className="patela-form-field">
                  <label className="patela-label">Item Name *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Bread"
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="patela-form-field">
                    <label className="patela-label">Price (R) *</label>
                    <input
                      type="number"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>

                  <div className="patela-form-field">
                    <label className="patela-label">Stock Qty</label>
                    <input
                      type="number"
                      value={formStock}
                      onChange={(e) => setFormStock(e.target.value)}
                      placeholder="0"
                      className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                    <p className="patela-helper-text">Current inventory count</p>
                  </div>
                </div>

                <div className="patela-form-field">
                  <label className="patela-label">
                    Category <span className="text-muted-foreground font-normal text-xs">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="e.g. Groceries"
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                  <p className="patela-helper-text">Helps organize your items</p>
                </div>
              </div>
            </div>

            {/* Modal footer (fixed) */}
            <div className="px-5 py-4 border-t border-border bg-card">
              <div className="flex gap-3">
                <Button variant="outline" size="lg" className="flex-1" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  variant="hero"
                  size="lg"
                  className="flex-1"
                  onClick={handleSave}
                  disabled={!formName || !formPrice}
                >
                  <Check className="h-5 w-5 mr-2" />
                  {editingItem ? "Save" : "Save Item"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
