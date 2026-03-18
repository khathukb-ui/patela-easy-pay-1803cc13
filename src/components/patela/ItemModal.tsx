import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CatalogItem, CatalogItemInput } from "@/hooks/use-supabase-catalog";

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (input: CatalogItemInput) => Promise<void>;
  item?: CatalogItem | null;
}

export function ItemModal({ isOpen, onClose, onSave, item }: ItemModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState("5");
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!item;

  useEffect(() => {
    if (item) {
      setName(item.name);
      setPrice(item.price.toString());
      setStock(item.stock.toString());
      setLowStockThreshold(item.low_stock_threshold.toString());
      setCategory(item.category || "");
    } else {
      setName("");
      setPrice("");
      setStock("");
      setLowStockThreshold("5");
      setCategory("");
    }
    setError(null);
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Item name is required");
      return;
    }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      setError("Enter a valid price");
      return;
    }
    const stockNum = parseInt(stock);
    if (isNaN(stockNum) || stockNum < 0) {
      setError("Enter a valid stock quantity");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSave({
        name: name.trim(),
        price: priceNum,
        stock: stockNum,
        low_stock_threshold: parseInt(lowStockThreshold) || 5,
        category: category.trim() || null,
      });
      onClose();
    } catch (e: any) {
      setError(e.message || "Failed to save item");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col z-10 animate-patela-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">
            {isEdit ? "Edit Item" : "Add New Item"}
          </h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <X className="h-4 w-4 text-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="item-name">Item Name *</Label>
            <Input
              id="item-name"
              placeholder="e.g. Airtime R10"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="item-price">Price (R) *</Label>
              <Input
                id="item-price"
                type="number"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min={0}
                step={0.01}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-stock">Stock Qty *</Label>
              <Input
                id="item-stock"
                type="number"
                placeholder="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min={0}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="item-category">Category</Label>
            <Input
              id="item-category"
              placeholder="e.g. Airtime, Snacks"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="item-threshold">Low Stock Alert Threshold</Label>
            <Input
              id="item-threshold"
              type="number"
              placeholder="5"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(e.target.value)}
              min={0}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="hero" className="flex-1" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Update Item" : "Add Item"}
          </Button>
        </div>
      </div>
    </div>
  );
}
