import { Plus, Minus, Package } from "lucide-react";
import { CatalogItem, CartItem } from "@/hooks/use-catalog";
import { cn } from "@/lib/utils";

interface ItemSelectorProps {
  items: CatalogItem[];
  cart: CartItem[];
  onAdd: (item: CatalogItem) => void;
  onRemove: (sku: string) => void;
}

export function ItemSelector({ items, cart, onAdd, onRemove }: ItemSelectorProps) {
  const getCartQuantity = (sku: string) => {
    return cart.find((c) => c.sku === sku)?.quantity || 0;
  };

  const inStockItems = items.filter((item) => item.in_stock);

  if (inStockItems.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">No items available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1.5">
      {inStockItems.map((item) => {
        const qty = getCartQuantity(item.sku);
        const isInCart = qty > 0;
        const isLowStock = item.available_qty > 0 && item.available_qty <= 5;

        return (
          <button
            key={item.sku}
            onClick={() => onAdd(item)}
            className={cn(
              "relative flex flex-col items-center p-2 rounded-lg border transition-all active:scale-95",
              isInCart
                ? "bg-accent/10 border-accent"
                : "bg-card border-border hover:border-accent/50"
            )}
          >
            {isInCart && (
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
                {qty}
              </div>
            )}

            {isLowStock && (
              <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-warning" />
            )}

            <div className="w-7 h-7 rounded-md bg-accent/10 flex items-center justify-center mb-1">
              <Package className="h-3.5 w-3.5 text-accent" />
            </div>
            <span className="text-[10px] font-medium text-foreground text-center line-clamp-1">
              {item.name}
            </span>
            <span className="text-xs font-bold text-accent">R{item.price}</span>

            {isInCart && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item.sku);
                }}
                className="absolute bottom-0.5 right-0.5 w-5 h-5 rounded-full bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-colors"
              >
                <Minus className="h-2.5 w-2.5" />
              </button>
            )}
          </button>
        );
      })}
    </div>
  );
}
