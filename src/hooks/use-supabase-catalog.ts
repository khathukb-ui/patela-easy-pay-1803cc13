import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface CatalogItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  low_stock_threshold: number;
  category: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CatalogItemInput {
  name: string;
  price: number;
  stock: number;
  low_stock_threshold?: number;
  category?: string | null;
}

export function useSupabaseCatalog() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchItems = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: dbError } = await supabase
        .from("catalog_items")
        .select("*")
        .order("name");

      if (dbError) throw dbError;
      setItems(data || []);
    } catch (e: any) {
      setError(e.message || "Failed to load items");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = useCallback(async (input: CatalogItemInput) => {
    if (!user) throw new Error("Not authenticated");
    const { data, error } = await supabase
      .from("catalog_items")
      .insert({
        user_id: user.id,
        name: input.name,
        price: input.price,
        stock: input.stock,
        low_stock_threshold: input.low_stock_threshold ?? 5,
        category: input.category ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    setItems((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
    return data;
  }, [user]);

  const updateItem = useCallback(async (id: string, input: Partial<CatalogItemInput>) => {
    const { data, error } = await supabase
      .from("catalog_items")
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    setItems((prev) => prev.map((item) => (item.id === id ? data : item)));
    return data;
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    const { error } = await supabase
      .from("catalog_items")
      .delete()
      .eq("id", id);

    if (error) throw error;
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const getInStockItems = useCallback(() => items.filter((i) => i.stock > 0), [items]);
  const getLowStockItems = useCallback(() => items.filter((i) => i.stock > 0 && i.stock <= i.low_stock_threshold), [items]);
  const getOutOfStockItems = useCallback(() => items.filter((i) => i.stock <= 0), [items]);

  return {
    items,
    loading,
    error,
    refetch: fetchItems,
    addItem,
    updateItem,
    deleteItem,
    getInStockItems,
    getLowStockItems,
    getOutOfStockItems,
  };
}
