import { useState, useCallback } from "react";

export interface CatalogItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  stock: number;
  lowStockThreshold: number;
  category?: string;
}

export interface CartItem extends CatalogItem {
  quantity: number;
}

// Mock data - will be replaced with IMS integration
const mockItems: CatalogItem[] = [
  { id: "1", name: "Bread", price: 18, stock: 25, lowStockThreshold: 5, category: "Groceries" },
  { id: "2", name: "Milk 1L", price: 22, stock: 12, lowStockThreshold: 5, category: "Groceries" },
  { id: "3", name: "Eggs (6)", price: 35, stock: 3, lowStockThreshold: 5, category: "Groceries" },
  { id: "4", name: "Cold Drink", price: 15, stock: 45, lowStockThreshold: 10, category: "Drinks" },
  { id: "5", name: "Chips", price: 12, stock: 0, lowStockThreshold: 5, category: "Snacks" },
  { id: "6", name: "Sweets", price: 5, stock: 100, lowStockThreshold: 20, category: "Snacks" },
];

export function useCatalog() {
  const [items, setItems] = useState<CatalogItem[]>(mockItems);

  const addItem = useCallback((item: Omit<CatalogItem, "id">) => {
    const newItem: CatalogItem = {
      ...item,
      id: Date.now().toString(),
    };
    setItems((prev) => [...prev, newItem]);
    return newItem;
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<CatalogItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const getInStockItems = useCallback(() => {
    return items.filter((item) => item.stock > 0);
  }, [items]);

  const getLowStockItems = useCallback(() => {
    return items.filter((item) => item.stock > 0 && item.stock <= item.lowStockThreshold);
  }, [items]);

  const getOutOfStockItems = useCallback(() => {
    return items.filter((item) => item.stock === 0);
  }, [items]);

  return {
    items,
    addItem,
    updateItem,
    deleteItem,
    getInStockItems,
    getLowStockItems,
    getOutOfStockItems,
  };
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback((item: CatalogItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map((c) =>
          c.id === itemId ? { ...c, quantity: c.quantity - 1 } : c
        );
      }
      return prev.filter((c) => c.id !== itemId);
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
  };
}
