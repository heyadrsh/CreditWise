import { useState, useEffect } from 'react';
import { getAllCards } from '../lib/creditCardApi';
import { CreditCard } from '../lib/database.types';

type Page = "home" | "summary" | "recommendations" | "simulator" | "compare";

interface SpendingSimulatorProps {
  onNavigate: (page: Page) => void;
}

interface SpendingProfile {
  dining: number;
  groceries: number;
  fuel: number;
  travel: number;
  shopping: number;
  utilities: number;
}

export default function SpendingSimulator({ onNavigate }: SpendingSimulatorProps) {
  const [cards, setCards] = useState<CreditCard[] | null>(null);
  const [spendingProfile, setSpendingProfile] = useState<SpendingProfile>({
    dining: 8000,
    groceries: 12000,
    fuel: 5000,
    travel: 3000,
    shopping: 7000,
    utilities: 2000
  });

  const [selectedCard, setSelectedCard] = useState<string>('');
  const [inputValues, setInputValues] = useState<{[key: string]: string}>({});

  const totalSpending = Object.values(spendingProfile).reduce((sum, amount) => sum + amount, 0);

  const calculateRewards = (card: CreditCard) => {
    if (!card) return 0;
    // Use enhanced schema fields with fallbacks
    const rewardRate = card.base_reward_rate || card.reward_rate || 0;
    const baseReward = totalSpending * (rewardRate / 100);
    return Math.round(baseReward);
  };

  const calculateAnnualValue = (card: CreditCard) => {
    if (!card) return 0;
    const rewards = calculateRewards(card);
    const annualFee = card.annual_fee || 0;
    return rewards - annualFee;
  };

  const handleSliderChange = (category: keyof SpendingProfile, value: number) => {
    setSpendingProfile(prev => ({
      ...prev,
      [category]: value
    }));
    // Clear input value when slider is used
    setInputValues(prev => ({
      ...prev,
      [category]: ''
    }));
  };

  const handleInputChange = (category: keyof SpendingProfile, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleInputSubmit = (category: keyof SpendingProfile) => {
    const value = inputValues[category];
    if (value) {
      const numValue = parseInt(value.replace(/[^\d]/g, '')) || 0;
      const clampedValue = Math.min(Math.max(numValue, 0), 50000);
      setSpendingProfile(prev => ({
        ...prev,
        [category]: clampedValue
      }));
      setInputValues(prev => ({
        ...prev,
        [category]: ''
      }));
    }
  };

  const handleKeyPress = (category: keyof SpendingProfile, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputSubmit(category);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllCards();
        if (Array.isArray(data)) {
          setCards(data);
        }
      } catch (error) {
        console.error('Error loading cards:', error);
      }
    })();
  }, []);

  if (!cards) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-times">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-6 shadow-times"></div>
          <p className="text-xl text-text-secondary font-times">Loading calculator...</p>
        </div>
      </div>
    );
  }

  const selectedCardData = cards.find(card => card.id === selectedCard);

  return (
    <div className="min-h-screen bg-background py-4 sm:py-6 lg:py-8 font-times">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile-First Responsive Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-primary rounded-lg mb-4 sm:mb-6 lg:mb-8 shadow-times-lg">
            <span className="material-symbols-outlined text-white text-xl sm:text-2xl lg:text-3xl">calculate</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-text-primary mb-3 sm:mb-4 lg:mb-6 font-times">
            Rewards Calculator
          </h1>
          <div className="w-16 sm:w-24 lg:w-32 h-1 bg-primary mx-auto mb-3 sm:mb-4 lg:mb-6"></div>
          <p className="text-sm sm:text-base lg:text-xl text-text-secondary max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto font-times leading-relaxed px-2 sm:px-0">
            Adjust your spending and see how different cards perform with real calculations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 mb-6 sm:mb-8 lg:mb-12">
          {/* Mobile-First Responsive Spending Controls */}
          <div className="bg-background-card rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-times-lg border border-border">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary mb-4 sm:mb-6 lg:mb-8 font-times">Monthly Spending</h2>
            
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              {Object.entries(spendingProfile).map(([category, amount]) => (
                <div key={category} className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                    <label className="text-base sm:text-lg font-semibold text-text-primary capitalize font-times">
                      {category}
                    </label>
                    <div className="relative w-full sm:w-auto">
                      <input
                        type="text"
                        placeholder={`₹${amount.toLocaleString()}`}
                        value={inputValues[category] || ''}
                        onChange={(e) => handleInputChange(category as keyof SpendingProfile, e.target.value)}
                        onKeyPress={(e) => handleKeyPress(category as keyof SpendingProfile, e)}
                        onBlur={() => handleInputSubmit(category as keyof SpendingProfile)}
                        className="w-full sm:w-32 lg:w-36 px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg font-bold text-primary bg-primary/5 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-primary/10 hover:border-primary/40 hover:bg-primary/8 transition-all duration-200 font-times text-center placeholder-primary/60"
                        style={{ fontSize: '16px' }}
                      />
                      {!inputValues[category] && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-base sm:text-lg font-bold text-primary bg-primary/5 rounded-lg border-2 border-primary/20">
                          ₹{amount.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="slider-container"
                    style={{
                      '--slider-progress': `${(amount / 50000) * 100}%`
                    } as React.CSSProperties}
                  >
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="1000"
                      value={amount}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value);
                        handleSliderChange(category as keyof SpendingProfile, newValue);
                      }}
                      className="w-full h-3 slider shadow-times hover:shadow-times-md transition-all duration-100"
                    />
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm text-text-tertiary font-times">
                    <span>₹0</span>
                    <span>₹50,000</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 sm:mt-8 lg:mt-10 p-4 sm:p-6 times-accent-bg rounded-lg border border-primary/30 shadow-times">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                <span className="text-base sm:text-lg lg:text-xl font-semibold text-primary font-times">Total Monthly Spending</span>
                <span className="text-2xl sm:text-2xl lg:text-3xl font-bold text-text-primary font-times">
                  ₹{totalSpending.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile-First Responsive Card Selection and Results */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Card Selector */}
            <div className="bg-background-card rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-times-lg border border-border">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary mb-4 sm:mb-5 lg:mb-6 font-times">Select a Card</h2>
              
              <div className="relative">
                <select
                  value={selectedCard}
                  onChange={(e) => setSelectedCard(e.target.value)}
                  className="w-full px-4 sm:px-5 lg:px-6 py-3 sm:py-3 lg:py-4 border-2 border-border rounded-lg times-focus bg-background-card text-text-primary text-base sm:text-lg font-times shadow-times hover:shadow-times-md transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="">Choose a card to analyze</option>
                  {cards.map((card) => (
                    <option key={card.id} value={card.id}>
                      {card.name} - {card.issuer}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 pointer-events-none">
                  <span className="material-symbols-outlined text-text-secondary text-lg sm:text-xl">
                    keyboard_arrow_down
                  </span>
                </div>
              </div>
            </div>

            {/* Results */}
            {selectedCardData && (
              <div className="bg-background-card rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-times-lg border border-border">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-text-primary mb-4 sm:mb-5 lg:mb-6 font-times">
                  Analysis for {selectedCardData.name}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
                  <div className="bg-accent-green/10 border border-accent-green/30 rounded-lg p-4 sm:p-5 lg:p-6">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-accent-green rounded-lg flex items-center justify-center shadow-times">
                        <span className="material-symbols-outlined text-white text-sm sm:text-base lg:text-xl">star</span>
                      </div>
                      <h4 className="font-semibold text-accent-green text-sm sm:text-base lg:text-lg font-times">Annual Rewards</h4>
                    </div>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary font-times">
                      ₹{(calculateRewards(selectedCardData) * 12).toLocaleString()}
                    </p>
                  </div>

                  <div className="times-accent-bg border border-primary/30 rounded-lg p-4 sm:p-5 lg:p-6">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-primary rounded-lg flex items-center justify-center shadow-times">
                        <span className="material-symbols-outlined text-white text-sm sm:text-base lg:text-xl">account_balance</span>
                      </div>
                      <h4 className="font-semibold text-primary text-sm sm:text-base lg:text-lg font-times">Net Annual Value</h4>
                    </div>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary font-times">
                      ₹{(calculateAnnualValue(selectedCardData) * 12).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between py-3 sm:py-4 border-b border-border">
                    <span className="text-text-secondary font-medium text-sm sm:text-base font-times">Monthly Rewards</span>
                    <span className="font-bold text-text-primary text-base sm:text-lg font-times">
                      ₹{calculateRewards(selectedCardData).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 sm:py-4 border-b border-border">
                    <span className="text-text-secondary font-medium text-sm sm:text-base font-times">Annual Fee</span>
                    <span className="font-bold text-text-primary text-base sm:text-lg font-times">
                      {selectedCardData.annual_fee === 0 ? (
                        <span className="text-accent-green">Free</span>
                      ) : (
                        `₹${selectedCardData.annual_fee.toLocaleString()}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 sm:py-4 border-b border-border">
                    <span className="text-text-secondary font-medium text-sm sm:text-base font-times">Reward Rate</span>
                    <span className="font-bold text-primary text-base sm:text-lg font-times">
                      {selectedCardData.base_reward_rate || selectedCardData.reward_rate}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile-First Responsive All Cards Comparison */}
        <div className="bg-background-card rounded-lg sm:rounded-xl shadow-times-lg border border-border overflow-hidden mb-6 sm:mb-8 lg:mb-12">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 times-hero-bg">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white font-times">All Cards Performance</h3>
          </div>
          
          {/* Mobile: Card List View */}
          <div className="block sm:hidden">
            <div className="divide-y divide-border">
              {cards
                .sort((a, b) => calculateAnnualValue(b) * 12 - calculateAnnualValue(a) * 12)
                .map((card, index) => (
                <div key={card.id} className={`p-4 ${index === 0 ? 'bg-accent-green/5 border-l-4 border-accent-green' : ''}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-base font-semibold text-text-primary font-times">{card.name}</div>
                      <div className="text-sm text-text-secondary font-times">{card.issuer}</div>
                    </div>
                    <button
                      onClick={() => setSelectedCard(card.id)}
                      className="times-btn-secondary text-xs font-times px-3 py-1"
                    >
                      Analyze
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-text-secondary">Monthly Rewards</span>
                      <div className="font-bold text-accent-green">₹{calculateRewards(card).toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-text-secondary">Annual Fee</span>
                      <div className="font-medium">
                        {card.annual_fee === 0 ? (
                          <span className="text-accent-green">Free</span>
                        ) : (
                          `₹${card.annual_fee.toLocaleString()}`
                        )}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-text-secondary">Net Annual Value</span>
                      <div className="font-bold text-primary">₹{(calculateAnnualValue(card) * 12).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Desktop/Tablet: Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
                              <thead className="bg-background-secondary">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-text-secondary uppercase tracking-wider font-times">
                      Card
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-text-secondary uppercase tracking-wider font-times">
                      Monthly Rewards
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-text-secondary uppercase tracking-wider font-times">
                      Annual Fee
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-text-secondary uppercase tracking-wider font-times">
                      Net Annual Value
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-text-secondary uppercase tracking-wider font-times">
                      Action
                    </th>
                  </tr>
                </thead>
              <tbody className="divide-y divide-border">
                {cards
                  .sort((a, b) => calculateAnnualValue(b) * 12 - calculateAnnualValue(a) * 12)
                  .map((card, index) => (
                  <tr key={card.id} className={`transition-colors duration-200 hover:bg-background-secondary ${index === 0 ? 'bg-accent-green/5 border-l-4 border-accent-green' : ''}`}>
                    <td className="px-4 sm:px-6 py-4 sm:py-5 whitespace-nowrap">
                      <div>
                        <div className="text-sm sm:text-base lg:text-lg font-semibold text-text-primary font-times">{card.name}</div>
                        <div className="text-xs sm:text-sm text-text-secondary font-times">{card.issuer}</div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5 whitespace-nowrap text-sm sm:text-base lg:text-lg font-bold text-accent-green font-times">
                      ₹{calculateRewards(card).toLocaleString()}
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5 whitespace-nowrap text-sm sm:text-base lg:text-lg text-text-secondary font-times">
                      {card.annual_fee === 0 ? (
                        <span className="text-accent-green font-semibold">Free</span>
                      ) : (
                        `₹${card.annual_fee.toLocaleString()}`
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5 whitespace-nowrap text-sm sm:text-base lg:text-lg font-bold text-primary font-times">
                      ₹{(calculateAnnualValue(card) * 12).toLocaleString()}
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedCard(card.id)}
                        className="times-btn-secondary text-xs sm:text-sm font-times"
                      >
                        <span className="material-symbols-outlined mr-1 sm:mr-2 text-sm">calculate</span>
                        <span className="hidden sm:inline">Analyze</span>
                        <span className="sm:hidden">Calc</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile-First Responsive CTA Section */}
        <div className="text-center bg-background-card rounded-lg sm:rounded-xl p-6 sm:p-8 lg:p-10 shadow-times-lg border border-border">
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-times-blue-600 rounded-lg mb-4 sm:mb-5 lg:mb-6 shadow-times">
              <span className="material-symbols-outlined text-white text-2xl sm:text-2xl lg:text-3xl">psychology</span>
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-text-primary mb-3 sm:mb-4 font-times">
            Ready for personalized recommendations?
          </h3>
          <p className="text-text-secondary mb-6 sm:mb-7 lg:mb-8 max-w-xs sm:max-w-xl lg:max-w-2xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed font-times px-2 sm:px-0">
            Let our AI analyze your profile and recommend the best cards for your needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="times-btn-primary text-sm sm:text-base lg:text-lg w-full sm:w-auto"
            >
              <span className="material-symbols-outlined mr-2 sm:mr-3">psychology</span>
              Get AI Recommendations
            </button>
            <button
              onClick={() => onNavigate('compare')}
              className="times-btn-secondary text-sm sm:text-base lg:text-lg w-full sm:w-auto"
            >
              <span className="material-symbols-outlined mr-2 sm:mr-3">compare</span>
              Compare Cards
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

