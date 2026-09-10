export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          role: 'user' | 'admin';
          plan_type: string;
          is_pro: boolean;
          storage_limit_mb: number;
          subscription_expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'admin';
          plan_type?: string;
          is_pro?: boolean;
          storage_limit_mb?: number;
          subscription_expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'admin';
          plan_type?: string;
          is_pro?: boolean;
          storage_limit_mb?: number;
          subscription_expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      plans: {
        Row: {
          id: string;
          name: string;
          duration_days: number;
          price: number;
          currency: string;
          storage_mb: number;
          storage_label: string | null;
          description: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          duration_days: number;
          price?: number;
          currency?: string;
          storage_mb?: number;
          storage_label?: string | null;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          duration_days?: number;
          price?: number;
          currency?: string;
          storage_mb?: number;
          storage_label?: string | null;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string | null;
          plan_id: string | null;
          status: 'active' | 'expired' | 'canceled' | 'pending';
          starts_at: string;
          expires_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          plan_id?: string | null;
          status?: 'active' | 'expired' | 'canceled' | 'pending';
          starts_at?: string;
          expires_at: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          plan_id?: string | null;
          status?: 'active' | 'expired' | 'canceled' | 'pending';
          starts_at?: string;
          expires_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          user_id: string | null;
          subscription_id: string | null;
          plan_id: string | null;
          provider: string;
          provider_payment_id: string | null;
          amount: number;
          currency: string;
          status: 'pending' | 'completed' | 'failed' | 'refunded';
          paid_at: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          subscription_id?: string | null;
          plan_id?: string | null;
          provider?: string;
          provider_payment_id?: string | null;
          amount?: number;
          currency?: string;
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          paid_at?: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          subscription_id?: string | null;
          plan_id?: string | null;
          provider?: string;
          provider_payment_id?: string | null;
          amount?: number;
          currency?: string;
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          paid_at?: string;
          metadata?: Json;
          created_at?: string;
        };
      };
      payment_events: {
        Row: {
          id: string;
          event_id: string;
          provider: string;
          event_type: string;
          payload: Json;
          processed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          provider: string;
          event_type: string;
          payload: Json;
          processed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          provider?: string;
          event_type?: string;
          payload?: Json;
          processed?: boolean;
          created_at?: string;
        };
      };
      portfolios: {
        Row: {
          id: string;
          user_id: string | null;
          title: string | null;
          slug: string | null;
          template_id: string;
          template_version_id: string | null;
          status: 'draft' | 'published' | 'archived';
          published: boolean;
          published_at: string | null;
          custom_domain: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_id?: string | null;
          title?: string | null;
          slug?: string | null;
          template_id?: string;
          template_version_id?: string | null;
          status?: 'draft' | 'published' | 'archived';
          published?: boolean;
          published_at?: string | null;
          custom_domain?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string | null;
          slug?: string | null;
          template_id?: string;
          template_version_id?: string | null;
          status?: 'draft' | 'published' | 'archived';
          published?: boolean;
          published_at?: string | null;
          custom_domain?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      portfolio_content: {
        Row: {
          id: string;
          portfolio_id: string;
          profile: Json;
          about: Json;
          hero: Json;
          projects: Json;
          experience: Json;
          education: Json;
          skills: Json;
          certifications: Json;
          social_links: Json;
          contact: Json;
          custom_sections: Json;
          canonical_profile: Json;
          raw_data: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          portfolio_id: string;
          profile?: Json;
          about?: Json;
          hero?: Json;
          projects?: Json;
          experience?: Json;
          education?: Json;
          skills?: Json;
          certifications?: Json;
          social_links?: Json;
          contact?: Json;
          custom_sections?: Json;
          canonical_profile?: Json;
          raw_data?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          portfolio_id?: string;
          profile?: Json;
          about?: Json;
          hero?: Json;
          projects?: Json;
          experience?: Json;
          education?: Json;
          skills?: Json;
          certifications?: Json;
          social_links?: Json;
          contact?: Json;
          custom_sections?: Json;
          canonical_profile?: Json;
          raw_data?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      portfolio_design: {
        Row: {
          id: string;
          portfolio_id: string;
          template_id: string | null;
          accent_color: string | null;
          font_family: string | null;
          font_size: string | null;
          theme_mode: 'dark' | 'light';
          custom_settings: Json;
          custom_css: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          portfolio_id: string;
          template_id?: string | null;
          accent_color?: string | null;
          font_family?: string | null;
          font_size?: string | null;
          theme_mode?: 'dark' | 'light';
          custom_settings?: Json;
          custom_css?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          portfolio_id?: string;
          template_id?: string | null;
          accent_color?: string | null;
          font_family?: string | null;
          font_size?: string | null;
          theme_mode?: 'dark' | 'light';
          custom_settings?: Json;
          custom_css?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_activity: {
        Row: {
          id: string;
          user_id: string | null;
          portfolio_id: string | null;
          activity_type: string;
          details: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          portfolio_id?: string | null;
          activity_type: string;
          details?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          portfolio_id?: string | null;
          activity_type?: string;
          details?: Json;
          created_at?: string;
        };
      };
      custom_domains: {
        Row: {
          id: string;
          portfolio_id: string;
          user_id: string | null;
          domain: string;
          normalized_domain: string;
          status: 'pending' | 'verified' | 'active' | 'failed' | 'removed';
          verification_token: string | null;
          verified_at: string | null;
          ssl_status: 'pending' | 'provisioning' | 'active' | 'failed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          portfolio_id: string;
          user_id?: string | null;
          domain: string;
          normalized_domain: string;
          status?: 'pending' | 'verified' | 'active' | 'failed' | 'removed';
          verification_token?: string | null;
          verified_at?: string | null;
          ssl_status?: 'pending' | 'provisioning' | 'active' | 'failed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          portfolio_id?: string;
          user_id?: string | null;
          domain?: string;
          normalized_domain?: string;
          status?: 'pending' | 'verified' | 'active' | 'failed' | 'removed';
          verification_token?: string | null;
          verified_at?: string | null;
          ssl_status?: 'pending' | 'provisioning' | 'active' | 'failed';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
