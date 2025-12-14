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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      app_visits: {
        Row: {
          id: string
          ip_address: string | null
          page_path: string | null
          session_id: string
          user_agent: string | null
          user_id: string | null
          visited_at: string
        }
        Insert: {
          id?: string
          ip_address?: string | null
          page_path?: string | null
          session_id: string
          user_agent?: string | null
          user_id?: string | null
          visited_at?: string
        }
        Update: {
          id?: string
          ip_address?: string | null
          page_path?: string | null
          session_id?: string
          user_agent?: string | null
          user_id?: string | null
          visited_at?: string
        }
        Relationships: []
      }
      badges: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          requirement: number
        }
        Insert: {
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
          requirement: number
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          requirement?: number
        }
        Relationships: []
      }
      bookings: {
        Row: {
          created_at: string | null
          end_date: string
          end_time: string
          guests_count: number
          id: string
          notes: string | null
          service_id: string
          start_date: string
          start_time: string
          status: string
          total_price: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date?: string
          end_time: string
          guests_count?: number
          id?: string
          notes?: string | null
          service_id: string
          start_date?: string
          start_time: string
          status?: string
          total_price?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string
          end_time?: string
          guests_count?: number
          id?: string
          notes?: string | null
          service_id?: string
          start_date?: string
          start_time?: string
          status?: string
          total_price?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      gallery_photos: {
        Row: {
          caption: string | null
          created_at: string
          fish_species: string | null
          fishing_date: string | null
          id: string
          location: string | null
          river_name: string | null
          storage_path: string
          updated_at: string
          user_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          fish_species?: string | null
          fishing_date?: string | null
          id?: string
          location?: string | null
          river_name?: string | null
          storage_path: string
          updated_at?: string
          user_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          fish_species?: string | null
          fishing_date?: string | null
          id?: string
          location?: string | null
          river_name?: string | null
          storage_path?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      guides: {
        Row: {
          additional_services: string | null
          address: string
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          availability: string
          birth_date: string
          certifications: string | null
          cpf: string
          created_at: string | null
          equipment_images: string[] | null
          equipment_list: string
          experience_years: number
          full_day_price: number
          full_name: string
          half_day_price: number
          id: string
          languages: string
          phone: string
          service_areas: string
          specialties: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          additional_services?: string | null
          address: string
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          availability: string
          birth_date: string
          certifications?: string | null
          cpf: string
          created_at?: string | null
          equipment_images?: string[] | null
          equipment_list: string
          experience_years: number
          full_day_price: number
          full_name: string
          half_day_price: number
          id?: string
          languages: string
          phone: string
          service_areas: string
          specialties: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          additional_services?: string | null
          address?: string
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          availability?: string
          birth_date?: string
          certifications?: string | null
          cpf?: string
          created_at?: string | null
          equipment_images?: string[] | null
          equipment_list?: string
          experience_years?: number
          full_day_price?: number
          full_name?: string
          half_day_price?: number
          id?: string
          languages?: string
          phone?: string
          service_areas?: string
          specialties?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      loyalty_points: {
        Row: {
          created_at: string
          id: string
          level: string
          points: number
          total_earned: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          level?: string
          points?: number
          total_earned?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          level?: string
          points?: number
          total_earned?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          booking_id: string | null
          created_at: string
          id: string
          message: string
          read: boolean
          receiver_id: string
          sender_id: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          id?: string
          message: string
          read?: boolean
          receiver_id: string
          sender_id: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      partner_payments: {
        Row: {
          amount: number
          area: string | null
          company: string | null
          created_at: string | null
          email: string
          expires_at: string | null
          id: string
          name: string
          paid_at: string | null
          payment_status: string
          phone: string | null
          plan_type: string
          registration_completed: boolean | null
          registration_token: string | null
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          area?: string | null
          company?: string | null
          created_at?: string | null
          email: string
          expires_at?: string | null
          id?: string
          name: string
          paid_at?: string | null
          payment_status?: string
          phone?: string | null
          plan_type: string
          registration_completed?: boolean | null
          registration_token?: string | null
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          area?: string | null
          company?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string | null
          id?: string
          name?: string
          paid_at?: string | null
          payment_status?: string
          phone?: string | null
          plan_type?: string
          registration_completed?: boolean | null
          registration_token?: string | null
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      points_history: {
        Row: {
          action: string
          created_at: string
          description: string | null
          id: string
          points: number
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          description?: string | null
          id?: string
          points: number
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          description?: string | null
          id?: string
          points?: number
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
          user_type: string | null
        }
        Insert: {
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Update: {
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          rating: number
          service_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating: number
          service_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number
          service_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      rewards: {
        Row: {
          active: boolean
          created_at: string
          description: string
          discount_percentage: number | null
          id: string
          points_required: number
          title: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description: string
          discount_percentage?: number | null
          id?: string
          points_required: number
          title: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          discount_percentage?: number | null
          id?: string
          points_required?: number
          title?: string
        }
        Relationships: []
      }
      service_availability: {
        Row: {
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean | null
          service_id: string
          start_time: string
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean | null
          service_id: string
          start_time: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean | null
          service_id?: string
          start_time?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string
          email: string | null
          features: Json | null
          id: string
          image_url: string | null
          location: string
          name: string
          phone: string | null
          type: string
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description: string
          email?: string | null
          features?: Json | null
          id?: string
          image_url?: string | null
          location: string
          name: string
          phone?: string | null
          type: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          email?: string | null
          features?: Json | null
          id?: string
          image_url?: string | null
          location?: string
          name?: string
          phone?: string | null
          type?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      sponsor_analytics: {
        Row: {
          created_at: string
          event_type: string
          id: string
          partner_name: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          partner_name: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          partner_name?: string
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          banner_url: string | null
          created_at: string | null
          custom_page_url: string | null
          description: string | null
          display_order: number | null
          featured: boolean | null
          id: string
          is_active: boolean | null
          logo_url: string
          name: string
          priority_order: number | null
          tier: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          banner_url?: string | null
          created_at?: string | null
          custom_page_url?: string | null
          description?: string | null
          display_order?: number | null
          featured?: boolean | null
          id?: string
          is_active?: boolean | null
          logo_url: string
          name: string
          priority_order?: number | null
          tier?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          banner_url?: string | null
          created_at?: string | null
          custom_page_url?: string | null
          description?: string | null
          display_order?: number | null
          featured?: boolean | null
          id?: string
          is_active?: boolean | null
          logo_url?: string
          name?: string
          priority_order?: number | null
          tier?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          address: string
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          category: string
          cnpj: string
          company_name: string
          created_at: string | null
          delivery_options: string | null
          description: string
          email: string
          facade_image: string | null
          id: string
          operating_hours: string
          payment_methods: string
          phone: string
          products_services: string
          responsible_cpf: string
          responsible_name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address: string
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          category: string
          cnpj: string
          company_name: string
          created_at?: string | null
          delivery_options?: string | null
          description: string
          email: string
          facade_image?: string | null
          id?: string
          operating_hours: string
          payment_methods: string
          phone: string
          products_services: string
          responsible_cpf: string
          responsible_name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          category?: string
          cnpj?: string
          company_name?: string
          created_at?: string | null
          delivery_options?: string | null
          description?: string
          email?: string
          facade_image?: string | null
          id?: string
          operating_hours?: string
          payment_methods?: string
          phone?: string
          products_services?: string
          responsible_cpf?: string
          responsible_name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
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
      get_app_visit_stats: { Args: never; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_article_views: {
        Args: { article_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "supervisor" | "admin" | "moderator" | "user"
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
      app_role: ["supervisor", "admin", "moderator", "user"],
    },
  },
} as const
