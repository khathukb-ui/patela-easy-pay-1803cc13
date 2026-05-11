export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      catalog_items: {
        Row: {
          category: string | null
          created_at: string
          id: string
          low_stock_threshold: number
          name: string
          price: number
          stock: number
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          low_stock_threshold?: number
          name: string
          price: number
          stock?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          low_stock_threshold?: number
          name?: string
          price?: number
          stock?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      merchant_api_keys: {
        Row: {
          created_at: string
          environment: string
          id: string
          is_active: boolean
          last_used_at: string | null
          merchant_id: string
          public_key: string
          secret_key: string
        }
        Insert: {
          created_at?: string
          environment: string
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          merchant_id: string
          public_key: string
          secret_key: string
        }
        Update: {
          created_at?: string
          environment?: string
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          merchant_id?: string
          public_key?: string
          secret_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "merchant_api_keys_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      merchant_documents: {
        Row: {
          document_type: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          merchant_id: string
          rejection_reason: string | null
          status: string
          uploaded_at: string
        }
        Insert: {
          document_type: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          merchant_id: string
          rejection_reason?: string | null
          status?: string
          uploaded_at?: string
        }
        Update: {
          document_type?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          merchant_id?: string
          rejection_reason?: string | null
          status?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "merchant_documents_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      merchant_payouts: {
        Row: {
          account_holder: string | null
          account_number: string | null
          amount: number
          bank_name: string | null
          branch_code: string | null
          currency: string
          id: string
          merchant_id: string
          processed_at: string | null
          reference: string | null
          requested_at: string
          status: string
        }
        Insert: {
          account_holder?: string | null
          account_number?: string | null
          amount: number
          bank_name?: string | null
          branch_code?: string | null
          currency?: string
          id?: string
          merchant_id: string
          processed_at?: string | null
          reference?: string | null
          requested_at?: string
          status?: string
        }
        Update: {
          account_holder?: string | null
          account_number?: string | null
          amount?: number
          bank_name?: string | null
          branch_code?: string | null
          currency?: string
          id?: string
          merchant_id?: string
          processed_at?: string | null
          reference?: string | null
          requested_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "merchant_payouts_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      merchant_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          customer_email: string | null
          customer_name: string | null
          environment: string
          id: string
          merchant_id: string
          metadata: Json | null
          payment_method: string
          reference: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_name?: string | null
          environment?: string
          id?: string
          merchant_id: string
          metadata?: Json | null
          payment_method?: string
          reference?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_name?: string | null
          environment?: string
          id?: string
          merchant_id?: string
          metadata?: Json | null
          payment_method?: string
          reference?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "merchant_transactions_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      merchants: {
        Row: {
          approved_at: string | null
          business_address: string | null
          business_city: string | null
          business_name: string
          business_postal_code: string | null
          business_province: string | null
          business_type: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          environment: string
          id: string
          is_live_enabled: boolean
          registration_number: string | null
          rejected_reason: string | null
          status: string
          tax_number: string | null
          trading_name: string | null
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          approved_at?: string | null
          business_address?: string | null
          business_city?: string | null
          business_name: string
          business_postal_code?: string | null
          business_province?: string | null
          business_type: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          environment?: string
          id?: string
          is_live_enabled?: boolean
          registration_number?: string | null
          rejected_reason?: string | null
          status?: string
          tax_number?: string | null
          trading_name?: string | null
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          approved_at?: string | null
          business_address?: string | null
          business_city?: string | null
          business_name?: string
          business_postal_code?: string | null
          business_province?: string | null
          business_type?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          environment?: string
          id?: string
          is_live_enabled?: boolean
          registration_number?: string | null
          rejected_reason?: string | null
          status?: string
          tax_number?: string | null
          trading_name?: string | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      payout_settings: {
        Row: {
          bank_linked: boolean
          created_at: string
          device_paired: boolean
          id: string
          payout_speed: string
          same_day_fee_percent: number
          standard_fee_percent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          bank_linked?: boolean
          created_at?: string
          device_paired?: boolean
          id?: string
          payout_speed?: string
          same_day_fee_percent?: number
          standard_fee_percent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          bank_linked?: boolean
          created_at?: string
          device_paired?: boolean
          id?: string
          payout_speed?: string
          same_day_fee_percent?: number
          standard_fee_percent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          business_name: string | null
          business_type: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          id_number: string | null
          last_name: string | null
          phone: string | null
          pin_hash: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_name?: string | null
          business_type?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          id_number?: string | null
          last_name?: string | null
          phone?: string | null
          pin_hash?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_name?: string | null
          business_type?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          id_number?: string | null
          last_name?: string | null
          phone?: string | null
          pin_hash?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      refunds: {
        Row: {
          amount: number
          created_at: string
          email_sent: boolean | null
          flagged_suspicious: boolean | null
          id: string
          next_settlement_adjustment: number | null
          original_transaction_reference: string | null
          payment_method: string
          processed_at: string | null
          reason: string
          reason_note: string | null
          refund_reference: string
          refund_type: string
          refunded_by_user_id: string
          sale_id: string
          same_day_refund_deduction: number | null
          sms_sent: boolean | null
          status: string
          updated_at: string
          user_id: string
          whatsapp_sent: boolean | null
        }
        Insert: {
          amount: number
          created_at?: string
          email_sent?: boolean | null
          flagged_suspicious?: boolean | null
          id?: string
          next_settlement_adjustment?: number | null
          original_transaction_reference?: string | null
          payment_method?: string
          processed_at?: string | null
          reason?: string
          reason_note?: string | null
          refund_reference?: string
          refund_type?: string
          refunded_by_user_id: string
          sale_id: string
          same_day_refund_deduction?: number | null
          sms_sent?: boolean | null
          status?: string
          updated_at?: string
          user_id: string
          whatsapp_sent?: boolean | null
        }
        Update: {
          amount?: number
          created_at?: string
          email_sent?: boolean | null
          flagged_suspicious?: boolean | null
          id?: string
          next_settlement_adjustment?: number | null
          original_transaction_reference?: string | null
          payment_method?: string
          processed_at?: string | null
          reason?: string
          reason_note?: string | null
          refund_reference?: string
          refund_type?: string
          refunded_by_user_id?: string
          sale_id?: string
          same_day_refund_deduction?: number | null
          sms_sent?: boolean | null
          status?: string
          updated_at?: string
          user_id?: string
          whatsapp_sent?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "refunds_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_items: {
        Row: {
          created_at: string
          id: string
          item_name: string
          line_total: number
          quantity: number
          sale_id: string
          sku: string | null
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          item_name: string
          line_total: number
          quantity?: number
          sale_id: string
          sku?: string | null
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          item_name?: string
          line_total?: number
          quantity?: number
          sale_id?: string
          sku?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          amount: number
          cashier_id: string | null
          created_at: string
          id: string
          last_four_digits: string | null
          note: string | null
          payment_method: string
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          cashier_id?: string | null
          created_at?: string
          id?: string
          last_four_digits?: string | null
          note?: string | null
          payment_method?: string
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          cashier_id?: string | null
          created_at?: string
          id?: string
          last_four_digits?: string | null
          note?: string | null
          payment_method?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string | null
          id: string
          invited_at: string
          is_active: boolean
          member_user_id: string | null
          name: string
          owner_user_id: string
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email?: string | null
          id?: string
          invited_at?: string
          is_active?: boolean
          member_user_id?: string | null
          name: string
          owner_user_id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string | null
          id?: string
          invited_at?: string
          is_active?: boolean
          member_user_id?: string | null
          name?: string
          owner_user_id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_merchant_api_keys: {
        Args: { p_environment: string; p_merchant_id: string }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_team_member: {
        Args: { _owner_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "cashier"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manager", "cashier"],
    },
  },
} as const
