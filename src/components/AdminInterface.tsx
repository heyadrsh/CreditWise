import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getAllCards,
  getCardStatistics,
  searchCards,
  createCard,
  updateCard,
  deleteCard,
  deleteAllCards,
  getCardsByCategory,
  getCardsByIssuer,
  getCardsByRewardType,
  type CreditCard,
  type CreditCardInput
} from '../lib/creditCardApi';
import { CardCategory, RewardType, NetworkType } from '../lib/database.types';

const AdminInterface: React.FC = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'view' | 'create' | 'stats'>('view');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());

  // Form state with enhanced schema support
  const [formData, setFormData] = useState<Partial<CreditCardInput>>({
    name: '',
    issuer: '',
    joining_fee: 0,
    annual_fee: 0,
    fee_currency: 'INR',
    fee_waiver_condition: '',
    reward_type: 'Cashback',
    base_reward_rate: 0,
    reward_rate: 0,
    reward_details: '',
    special_perks: [],
    perks: [],
    best_for: [],
    card_category: 'Entry Level',
    category: 'Entry Level',
    network: 'Visa',
    image_url: '',
    apply_link: '',
    min_income: 0,
    credit_score: 650,
    age_min: 21,
    age_max: 65,
    invite_only: false,
  });

  const categories: CardCategory[] = ['Entry Level', 'Mid-Level', 'Mid-Premium', 'Premium', 'Super Premium'];
  const networks: NetworkType[] = ['Visa', 'Mastercard', 'RuPay', 'American Express', 'Diners Club'];
  const rewardTypes: RewardType[] = [
    'Cashback', 'Reward Points', 'Miles', 'Value Back', 'Fuel Points',
    'Membership Rewards Points', 'EDGE Reward Points', 'EDGE Miles'
  ];

  // Auto-refresh data function
  const refreshData = async () => {
    console.log('🔄 Auto-syncing data with database...');
    try {
      if (activeTab === 'view' || activeTab === 'create') {
        const result = await getAllCards();
        if (Array.isArray(result)) {
          setCards(result);
          console.log(`✅ Synced ${result.length} cards`);
        }
      }
      
      if (activeTab === 'stats') {
        const stats = await getCardStatistics();
        setStatistics(stats);
        console.log('✅ Synced statistics');
      }
      
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('❌ Sync failed:', error);
    }
  };

  // Load data initially
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await refreshData();
      setLoading(false);
    };

    fetchData();
  }, [activeTab]);

  // Auto-sync every 3 seconds to keep data fresh
  useEffect(() => {
    const autoSyncInterval = setInterval(() => {
      if (!loading) {
        refreshData();
      }
    }, 3000); // Sync every 3 seconds

    // Cleanup interval on unmount
    return () => clearInterval(autoSyncInterval);
  }, [activeTab, loading]);

  // Handle search and filters
  useEffect(() => {
    const fetchFilteredCards = async () => {
      if (searchTerm || selectedCategory) {
        const result = await searchCards({
          searchTerm: searchTerm || undefined,
          category: selectedCategory || undefined,
          cardCategory: selectedCategory || undefined,
        });
        
        if (Array.isArray(result)) {
          setCards(result);
        }
      } else {
        const result = await getAllCards();
        if (Array.isArray(result)) {
          setCards(result);
        }
      }
    };

    fetchFilteredCards();
  }, [searchTerm, selectedCategory]);

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name || !formData.issuer) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare perks arrays (both special_perks and perks for backward compatibility)
      const perksArray = typeof formData.special_perks === 'string' 
        ? (formData.special_perks as string).split(',').map(p => p.trim())
        : (Array.isArray(formData.special_perks) ? formData.special_perks : []);
        
      const bestForArray = typeof formData.best_for === 'string'
        ? (formData.best_for as string).split(',').map(b => b.trim())
        : (Array.isArray(formData.best_for) ? formData.best_for : []);
      
      const cardData: CreditCardInput = {
        name: formData.name || '',
        issuer: formData.issuer || '',
        joining_fee: Number(formData.joining_fee) || 0,
        annual_fee: Number(formData.annual_fee) || 0,
        fee_currency: formData.fee_currency || 'INR',
        fee_waiver_condition: formData.fee_waiver_condition || undefined,
        reward_type: formData.reward_type || 'Cashback',
        base_reward_rate: Number(formData.base_reward_rate) || Number(formData.reward_rate) || 0,
        reward_rate: Number(formData.reward_rate) || Number(formData.base_reward_rate) || 0,
        reward_details: formData.reward_details || undefined,
        special_perks: perksArray,
        perks: perksArray, // Backward compatibility
        best_for: bestForArray,
        card_category: formData.card_category || formData.category || 'Entry Level',
        category: formData.category || formData.card_category || 'Entry Level',
        network: formData.network || 'Visa',
        image_url: formData.image_url || undefined,
        apply_link: formData.apply_link || '#',
        min_income: Number(formData.min_income) || 0,
        credit_score: Number(formData.credit_score) || 650,
        age_min: Number(formData.age_min) || 21,
        age_max: Number(formData.age_max) || 65,
        invite_only: Boolean(formData.invite_only) || false,
      };
      
      const result = await createCard(cardData);
      
      if (result) {
        console.log('✅ Card created successfully, auto-syncing...');
        // Reset form
        setFormData({
          name: '', issuer: '', joining_fee: 0, annual_fee: 0, fee_currency: 'INR',
          fee_waiver_condition: '', reward_type: 'Cashback', base_reward_rate: 0, reward_rate: 0,
          reward_details: '', special_perks: [], perks: [], best_for: [],
          card_category: 'Entry Level', category: 'Entry Level', network: 'Visa',
          image_url: '', apply_link: '', min_income: 0, credit_score: 650,
          age_min: 21, age_max: 65, invite_only: false,
        });
        
        // Auto-refresh data
        await refreshData();
        setActiveTab('view');
      } else {
        alert('Error creating card');
      }
    } catch (error) {
      console.error('Error creating card:', error);
      alert(`Error creating card: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
      try {
        const result = await deleteCard(cardId);
        
        if (result && 'success' in result && result.success) {
        console.log('✅ Card deleted successfully, auto-syncing...');
        // Auto-refresh data immediately
        await refreshData();
        } else {
          alert('Error deleting card');
        }
      } catch (error) {
        console.error('Error deleting card:', error);
        alert(`Error deleting card: ${error}`);
    }
  };

  const handleDeleteAllCards = async () => {
    try {
      const result = await deleteAllCards();
      
      if (result && 'success' in result && result.success) {
        console.log('✅ All cards deleted successfully, auto-syncing...');
        // Auto-refresh data immediately
        await refreshData();
      } else {
        alert('Error deleting all cards');
      }
    } catch (error) {
      console.error('Error deleting all cards:', error);
      alert(`Error deleting all cards: ${error}`);
    }
  };

  const handleSyncDatabase = async () => {
      try {
        setLoading(true);
      console.log('🔄 Manual sync requested...');
      await refreshData();
      console.log('✅ Manual sync completed');
      } catch (error) {
      console.error('❌ Manual sync failed:', error);
      alert(`Sync failed: ${error}`);
      } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">Credit Card Admin Dashboard</h1>
              <p className="text-text-secondary">Manage your credit card database with Supabase</p>
              {user && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="material-symbols-outlined text-green-500 text-sm">verified_user</span>
                  <span className="text-sm text-text-secondary">
                    Authenticated as: <span className="font-medium text-text-primary">{user.email}</span>
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Auto-sync active</span>
                </div>
                <span>•</span>
                <span>Last sync: {lastSyncTime.toLocaleTimeString()}</span>
              </div>
              {user && (
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-6">
          {['view', 'create', 'stats'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-primary text-white'
                  : 'bg-background-card text-text-secondary hover:bg-background-secondary hover:text-text-primary'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {!loading && activeTab === 'view' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-background-card p-4 rounded-lg">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search cards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 p-2 rounded bg-background text-text-primary border border-border focus:border-primary"
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="p-2 rounded bg-background text-text-primary border border-border"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button
                  onClick={handleSyncDatabase}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Sync Database
                </button>
                <button
                  onClick={handleDeleteAllCards}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete All
                </button>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid gap-4">
              {cards.map((card) => (
                <div key={card.id} className="bg-background-card p-4 rounded-lg border border-border">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-text-primary">{card.name}</h3>
                      <p className="text-text-secondary">{card.issuer} • {card.network}</p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="text-text-primary">Joining: ₹{card.joining_fee}</span>
                        <span className="text-text-primary">Annual: ₹{card.annual_fee}</span>
                        <span className="text-text-primary">Reward: {card.base_reward_rate || card.reward_rate}%</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-1 bg-background text-text-primary text-xs rounded border">
                          {card.card_category || card.category}
                        </span>
                        <span className="px-2 py-1 bg-background text-text-primary text-xs rounded border">
                          {card.reward_type}
                        </span>
                      </div>
                      {card.fee_waiver_condition && (
                        <div className="mt-2 text-xs text-text-secondary">
                          Fee Waiver: {card.fee_waiver_condition}
                        </div>
                      )}
                      {card.reward_details && (
                        <div className="mt-2 text-xs text-text-secondary">
                          Rewards: {card.reward_details}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {cards.length === 0 && (
                <div className="text-center py-12 text-text-secondary">
                  No cards found. Use the "Seed Database" button to add sample cards.
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && activeTab === 'create' && (
          <div className="bg-background-card p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Create New Card</h2>
            <form onSubmit={handleCreateCard} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Card Name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="p-2 rounded bg-background text-text-primary border border-border"
                  required
                />
                <input
                  type="text"
                  placeholder="Issuer"
                  value={formData.issuer || ''}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  className="p-2 rounded bg-background text-text-primary border border-border"
                  required
                />
                <input
                  type="number"
                  placeholder="Joining Fee"
                  value={formData.joining_fee || 0}
                  onChange={(e) => setFormData({ ...formData, joining_fee: Number(e.target.value) })}
                  className="p-2 rounded bg-background text-text-primary border border-border"
                />
                <input
                  type="number"
                  placeholder="Annual Fee"
                  value={formData.annual_fee || 0}
                  onChange={(e) => setFormData({ ...formData, annual_fee: Number(e.target.value) })}
                  className="p-2 rounded bg-background text-text-primary border border-border"
                />
                <select
                  value={formData.reward_type || 'Cashback'}
                  onChange={(e) => setFormData({ ...formData, reward_type: e.target.value })}
                  className="p-2 rounded bg-background text-text-primary border border-border"
                >
                  {rewardTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Base Reward Rate"
                  value={formData.base_reward_rate || 0}
                  onChange={(e) => setFormData({ ...formData, base_reward_rate: Number(e.target.value), reward_rate: Number(e.target.value) })}
                  className="p-2 rounded bg-background text-text-primary border border-border"
                />
                <select
                  value={formData.card_category || 'Entry Level'}
                  onChange={(e) => setFormData({ ...formData, card_category: e.target.value as CardCategory, category: e.target.value })}
                  className="p-2 rounded bg-background text-text-primary border border-border"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <select
                  value={formData.network || 'Visa'}
                  onChange={(e) => setFormData({ ...formData, network: e.target.value as NetworkType })}
                  className="p-2 rounded bg-background text-text-primary border border-border"
                >
                  {networks.map(net => (
                    <option key={net} value={net}>{net}</option>
                  ))}
                </select>
              </div>
              
              {/* Enhanced Schema Fields */}
              <input
                type="text"
                placeholder="Fee Waiver Condition (optional)"
                value={formData.fee_waiver_condition || ''}
                onChange={(e) => setFormData({ ...formData, fee_waiver_condition: e.target.value })}
                className="w-full p-2 rounded bg-background text-text-primary border border-border"
              />
              
              <textarea
                placeholder="Reward Details (optional)"
                value={formData.reward_details || ''}
                onChange={(e) => setFormData({ ...formData, reward_details: e.target.value })}
                className="w-full p-2 rounded bg-background text-text-primary border border-border"
                rows={2}
              />
              <textarea
                placeholder="Perks (comma separated)"
                value={Array.isArray(formData.special_perks) ? formData.special_perks.join(', ') : formData.special_perks || ''}
                onChange={(e) => setFormData({ ...formData, special_perks: e.target.value.split(',').map(p => p.trim()) })}
                className="w-full p-2 rounded bg-background text-text-primary border border-border"
                rows={3}
              />
              <textarea
                placeholder="Best For (comma separated)"
                value={Array.isArray(formData.best_for) ? formData.best_for.join(', ') : formData.best_for || ''}
                onChange={(e) => setFormData({ ...formData, best_for: e.target.value.split(',').map(b => b.trim()) })}
                className="w-full p-2 rounded bg-background text-text-primary border border-border"
                rows={2}
              />
              <input
                type="url"
                placeholder="Apply Link"
                value={formData.apply_link || ''}
                onChange={(e) => setFormData({ ...formData, apply_link: e.target.value })}
                className="w-full p-2 rounded bg-background text-text-primary border border-border"
                required
              />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <input
                  type="number"
                  placeholder="Min Income"
                  value={formData.min_income || 0}
                  onChange={(e) => setFormData({ ...formData, min_income: Number(e.target.value) })}
                  className="p-2 rounded bg-background text-text-primary border border-border"
                />
                <input
                  type="number"
                  placeholder="Credit Score"
                  value={formData.credit_score || 650}
                  onChange={(e) => setFormData({ ...formData, credit_score: Number(e.target.value) })}
                  className="p-2 rounded bg-background text-text-primary border border-border"
                />
                <input
                  type="number"
                  placeholder="Min Age"
                  value={formData.age_min || 21}
                  onChange={(e) => setFormData({ ...formData, age_min: Number(e.target.value) })}
                  className="p-2 rounded bg-background text-text-primary border border-border"
                />
                <input
                  type="number"
                  placeholder="Max Age"
                  value={formData.age_max || 65}
                  onChange={(e) => setFormData({ ...formData, age_max: Number(e.target.value) })}
                  className="p-2 rounded bg-background text-text-primary border border-border"
                />
              </div>
              <label className="flex items-center text-text-primary">
                <input
                  type="checkbox"
                  checked={formData.invite_only || false}
                  onChange={(e) => setFormData({ ...formData, invite_only: e.target.checked })}
                  className="mr-2"
                />
                Invite Only
              </label>
              <button
                type="submit"
                className="w-full p-3 bg-green-600 text-white rounded font-medium hover:bg-green-700"
              >
                Create Card
              </button>
            </form>
          </div>
        )}

        {!loading && activeTab === 'stats' && statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-background-card p-6 rounded-lg">
              <h3 className="text-xl font-bold text-text-primary mb-4">Overview</h3>
              <p className="text-2xl font-bold text-green-400">{statistics.totalCards}</p>
              <p className="text-text-secondary">Total Cards</p>
            </div>
            <div className="bg-background-card p-6 rounded-lg">
              <h3 className="text-xl font-bold text-text-primary mb-4">By Category</h3>
              {Object.entries(statistics.byCategory || {}).map(([category, count]) => (
                <div key={category} className="flex justify-between text-text-primary">
                  <span>{category}</span>
                  <span>{String(count)}</span>
                </div>
              ))}
            </div>
            <div className="bg-background-card p-6 rounded-lg">
              <h3 className="text-xl font-bold text-text-primary mb-4">By Network</h3>
              {Object.entries(statistics.byNetwork || {}).map(([network, count]) => (
                <div key={network} className="flex justify-between text-text-primary">
                  <span>{network}</span>
                  <span>{String(count)}</span>
                </div>
              ))}
            </div>
            <div className="bg-background-card p-6 rounded-lg">
              <h3 className="text-xl font-bold text-text-primary mb-4">Average Fees</h3>
              <div className="space-y-2 text-text-primary">
                <div className="flex justify-between">
                  <span>Joining Fee</span>
                  <span>₹{Math.round(statistics.averageFees.joining)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Fee</span>
                  <span>₹{Math.round(statistics.averageFees.annual)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInterface; 