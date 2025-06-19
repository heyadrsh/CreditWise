export interface Database {
  public: {
    Tables: {
      credit_cards: {
        Row: {
          id: string;
          name: string;
          issuer: string;
          joining_fee: number;
          annual_fee: number;
          fee_currency: string;
          fee_waiver_condition?: string;
          reward_type: string;
          base_reward_rate: number;
          reward_rate: number;
          reward_details?: string;
          min_income: number;
          credit_score: number;
          age_min: number;
          age_max: number;
          invite_only: boolean;
          special_perks: string[];
          perks: string[];
          best_for: string[];
          card_category: string;
          category: string;
          network: string;
          image_url?: string;
          apply_link: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          name: string;
          issuer: string;
          joining_fee?: number;
          annual_fee?: number;
          fee_currency?: string;
          fee_waiver_condition?: string;
          reward_type?: string;
          base_reward_rate?: number;
          reward_rate?: number;
          reward_details?: string;
          min_income?: number;
          credit_score?: number;
          age_min?: number;
          age_max?: number;
          invite_only?: boolean;
          special_perks?: string[];
          perks?: string[];
          best_for?: string[];
          card_category?: string;
          category?: string;
          network?: string;
          image_url?: string;
          apply_link?: string;
        };
        Update: {
          id?: string;
          name?: string;
          issuer?: string;
          joining_fee?: number;
          annual_fee?: number;
          fee_currency?: string;
          fee_waiver_condition?: string;
          reward_type?: string;
          base_reward_rate?: number;
          reward_rate?: number;
          reward_details?: string;
          min_income?: number;
          credit_score?: number;
          age_min?: number;
          age_max?: number;
          invite_only?: boolean;
          special_perks?: string[];
          perks?: string[];
          best_for?: string[];
          card_category?: string;
          category?: string;
          network?: string;
          image_url?: string;
          apply_link?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
} 

// Enhanced credit card interface for better type safety
export type CreditCard = Database['public']['Tables']['credit_cards']['Row'];

export type CreditCardInput = Database['public']['Tables']['credit_cards']['Insert'];

export type CreditCardUpdate = Database['public']['Tables']['credit_cards']['Update'];

// Utility types for common card operations
export type CardCategory = 'Entry Level' | 'Mid-Level' | 'Mid-Premium' | 'Premium' | 'Super Premium';
export type RewardType = 'Cashback' | 'Reward Points' | 'Miles' | 'Value Back' | 'Fuel Points' | 'Membership Rewards Points' | 'EDGE Reward Points' | 'EDGE Miles' | '6E Rewards' | 'NeuCoins' | 'CashPoints' | 'Bonvoy Points' | 'Club Vistara Points';
export type NetworkType = 'Visa' | 'Mastercard' | 'American Express' | 'Diners Club' | 'RuPay'; 