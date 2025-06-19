import { supabase, handleSupabaseError } from './supabase';
import { CreditCard, CreditCardInput, CreditCardUpdate } from './database.types';

// READ OPERATIONS

/**
 * Get all credit cards
 */
export async function getAllCards() {
  try {
    const { data, error } = await supabase
      .from('credit_cards')
      .select('*');
    
    if (error) throw error;
    return data;
  } catch (error) {
    return handleSupabaseError(error);
  }
}

/**
 * Get a credit card by ID
 */
export async function getCardById(id: string) {
  try {
    const { data, error } = await supabase
      .from('credit_cards')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    return handleSupabaseError(error);
  }
}

/**
 * Search credit cards with filters
 */
export async function searchCards({ 
  searchTerm, 
  category, 
  network,
  minIncome,
  maxIncome,
  cardCategory
}: {
  searchTerm?: string;
  category?: string;
  cardCategory?: string;
  network?: string;
  minIncome?: number;
  maxIncome?: number;
}) {
  try {
    let query = supabase.from('credit_cards').select('*');
    
    // Apply filters
    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,issuer.ilike.%${searchTerm}%`);
    }
    
    if (category) {
      query = query.eq('category', category);
    }

    if (cardCategory) {
      query = query.eq('card_category', cardCategory);
    }
    
    if (network) {
      query = query.eq('network', network);
    }
    
    if (minIncome) {
      query = query.gte('min_income', minIncome);
    }
    
    if (maxIncome) {
      query = query.lte('min_income', maxIncome);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  } catch (error) {
    return handleSupabaseError(error);
  }
}

/**
 * Get cards by category (supports both old and new category fields)
 */
export async function getCardsByCategory(category: string) {
  try {
    const { data, error } = await supabase
      .from('credit_cards')
      .select('*')
      .or(`category.eq.${category},card_category.eq.${category}`);
    
    if (error) throw error;
    return data;
  } catch (error) {
    return handleSupabaseError(error);
  }
}

/**
 * Get cards by issuer
 */
export async function getCardsByIssuer(issuer: string) {
  try {
    const { data, error } = await supabase
      .from('credit_cards')
      .select('*')
      .ilike('issuer', `%${issuer}%`);
    
    if (error) throw error;
    return data;
  } catch (error) {
    return handleSupabaseError(error);
  }
}

/**
 * Get cards by reward type
 */
export async function getCardsByRewardType(rewardType: string) {
  try {
    const { data, error } = await supabase
      .from('credit_cards')
      .select('*')
      .ilike('reward_type', `%${rewardType}%`);
    
    if (error) throw error;
    return data;
  } catch (error) {
    return handleSupabaseError(error);
  }
}

/**
 * Get cards by income eligibility
 */
export async function getCardsByIncome(userIncome: number) {
  try {
    const { data, error } = await supabase
      .from('credit_cards')
      .select('*')
      .lte('min_income', userIncome)
      .order('base_reward_rate', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    return handleSupabaseError(error);
  }
}

/**
 * Get card statistics
 */
export async function getCardStatistics() {
  try {
    const { data: cards, error } = await supabase
      .from('credit_cards')
      .select('*');
    
    if (error) throw error;
    
    if (!cards || cards.length === 0) {
      return {
        totalCards: 0,
        byCategory: {},
        byCardCategory: {},
        byNetwork: {},
        byIssuer: {},
        averageFees: { joining: 0, annual: 0 },
        rewardTypes: {}
      };
    }
    
    const byCategory: Record<string, number> = {};
    const byCardCategory: Record<string, number> = {};
    const byNetwork: Record<string, number> = {};
    const byIssuer: Record<string, number> = {};
    const rewardTypes: Record<string, number> = {};
    
    let totalJoiningFee = 0;
    let totalAnnualFee = 0;
    
    for (const card of cards) {
      // Count both old and new category fields
      byCategory[card.category] = (byCategory[card.category] || 0) + 1;
      byCardCategory[card.card_category] = (byCardCategory[card.card_category] || 0) + 1;
      byNetwork[card.network] = (byNetwork[card.network] || 0) + 1;
      byIssuer[card.issuer] = (byIssuer[card.issuer] || 0) + 1;
      rewardTypes[card.reward_type] = (rewardTypes[card.reward_type] || 0) + 1;
      
      totalJoiningFee += card.joining_fee || 0;
      totalAnnualFee += card.annual_fee || 0;
    }
    
    return {
      totalCards: cards.length,
      byCategory,
      byCardCategory,
      byNetwork,
      byIssuer,
      averageFees: {
        joining: cards.length > 0 ? totalJoiningFee / cards.length : 0,
        annual: cards.length > 0 ? totalAnnualFee / cards.length : 0,
      },
      rewardTypes,
    };
  } catch (error) {
    return handleSupabaseError(error);
  }
}

// CREATE OPERATIONS

/**
 * Create a new credit card
 */
export async function createCard(card: CreditCardInput) {
  try {
    // Ensure backward compatibility by copying enhanced fields to legacy fields
    const cardData = {
      ...card,
      reward_rate: card.base_reward_rate || card.reward_rate || 0,
      perks: card.special_perks || card.perks || [],
      category: card.card_category || card.category || 'Entry Level',
    };

    const { data, error } = await supabase
      .from('credit_cards')
      .insert([cardData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    return handleSupabaseError(error);
  }
}

// UPDATE OPERATIONS

/**
 * Update a credit card
 */
export async function updateCard(id: string, updates: CreditCardUpdate) {
  try {
    // Ensure backward compatibility
    const updateData = {
      ...updates,
      reward_rate: updates.base_reward_rate || updates.reward_rate,
      perks: updates.special_perks || updates.perks,
      category: updates.card_category || updates.category,
    };

    const { data, error } = await supabase
      .from('credit_cards')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    return handleSupabaseError(error);
  }
}

// DELETE OPERATIONS

/**
 * Delete a credit card
 */
export async function deleteCard(id: string) {
  try {
    console.log('🗑️ Attempting to delete card with ID:', id);
    
    const { data, error } = await supabase
      .from('credit_cards')
      .delete()
      .eq('id', id)
      .select(); // Return deleted rows for confirmation
    
    if (error) {
      console.error('❌ Delete error:', error);
      throw error;
    }
    
    console.log('✅ Delete result:', data);
    return { success: true, deletedCount: data?.length || 0 };
  } catch (error) {
    console.error('💥 Delete failed:', error);
    return handleSupabaseError(error);
  }
}

/**
 * Delete all credit cards
 */
export async function deleteAllCards() {
  try {
    const { error } = await supabase
      .from('credit_cards')
      .delete()
      .neq('id', ''); // Delete all rows
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return handleSupabaseError(error);
  }
}

/**
 * Seed database with sample cards (deprecated - use bulk insert SQL instead)
 */
export async function seedCards() {
  try {
    // Check if cards already exist
    const { data: existing } = await supabase
      .from('credit_cards')
      .select('id')
      .limit(1);
    
    if (existing && existing.length > 0) {
      return "Cards already seeded. Use bulk insert SQL for comprehensive data.";
    }

    const sampleCards = [
      {
        name: "HDFC Infinia Metal Card",
        issuer: "HDFC Bank",
        joining_fee: 12500,
        annual_fee: 12500,
        fee_currency: "INR",
        fee_waiver_condition: "Annual spend above Rs. 10 lakh",
        reward_type: "Reward Points",
        base_reward_rate: 3.3,
        reward_rate: 3.3,
        reward_details: "3.3% base rate (5 points per ₹150 spent), Up to 10X rewards via SmartBuy",
        special_perks: ["Unlimited domestic and international lounge access", "Club Marriott membership", "12,500 reward points on activation"],
        perks: ["Unlimited domestic and international lounge access", "Club Marriott membership", "12,500 reward points on activation"],
        best_for: ["Travel", "Premium Lifestyle", "High Spenders"],
        card_category: "Super Premium",
        category: "Super Premium",
        network: "Visa",
        apply_link: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card",
        min_income: 2500000,
        credit_score: 750,
        age_min: 21,
        age_max: 65,
        invite_only: true
      }
    ];

    const { data, error } = await supabase
      .from('credit_cards')
      .insert(sampleCards);
    
    if (error) throw error;
    return "Sample card seeded successfully. Use SQL bulk insert for full dataset.";
  } catch (error) {
    console.error('Error seeding cards:', error);
    return handleSupabaseError(error);
  }
}

// Export types for use in other components
export type { CreditCard, CreditCardInput, CreditCardUpdate }; 