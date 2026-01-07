import { Plus, Minus, Package } from "lucide-react";
import { CatalogItem, CartItem } from "@/hooks/use-catalog";
import { cn } from "@/lib/utils";

interface ItemSelectorProps {
  items: CatalogItem[];
  cart: CartItem[];
  onAdd: (item: CatalogItem) => void;
  onRemove: (itemId: string) => void;
}

export function ItemSelector({ items, cart, onAdd, onRemove }: ItemSelectorProps) {
  const getCartQuantity = (itemId: string) => {
    return cart.find((c) => c.id === itemId)?.quantity || 0;
  };

  const inStockItems = items.filter((item) => item.stock > 0);

  if (inStockItems.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">No items available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {inStockItems.map((item) => {
        const qty = getCartQuantity(item.id);
        const isInCart = qty > 0;
        const isLowStock = item.stock <= item.lowStockThreshold;

        return (
          <button
            key={item.id}
            onClick={() => onAdd(item)}
            className={cn(
              "relative flex flex-col items-center p-3 rounded-xl border transition-all active:scale-95",
              isInCart
                ? "bg-accent/10 border-accent"
                : "bg-card border-border hover:border-accent/50"
            )}
          >
            {/* Quantity Badge */}
            {isInCart && (
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">
                {qty}
              </div>
            )}

            {/* Low Stock Indicator */}
            {isLowStock && (
              <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-warning" />
            )}

            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center mb-2">
              <Package className="h-4 w-4 text-accent" />
            </div>
            <span className="text-xs font-medium text-foreground text-center line-clamp-1">
              {item.name}
            </span>
            <span className="text-sm font-bold text-accent">R{item.price}</span>

            {/* Remove Button (only when in cart) */}
            {isInCart && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item.id);
                }}
                className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-colors"
              >
                <Minus className="h-3 w-3" />
              </button>
            )}
          </button>
        );
      })}
    </div>
  );
}
