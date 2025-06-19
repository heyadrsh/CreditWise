import { useState, useEffect } from 'react';
import { getAllCards } from '../lib/creditCardApi';

type Page = "home" | "summary" | "recommendations" | "simulator" | "compare";

interface RecommendationsPageProps {
  userProfile?: any;
  onNavigate: (page: Page) => void;
  onCompareCards?: (page: Page, cardIds?: string[]) => void;
}

interface Recommendation {
  card: any;
  score?: number;
  reasons?: string[];
}

// Card Details Modal Component
const CardDetailsModal = ({ card, isOpen, onClose, reasons, matchScore }: {
  card: any;
  isOpen: boolean;
  onClose: () => void;
  reasons?: string[];
  matchScore?: number;
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !card) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-end lg:items-center justify-center transition-all duration-300 ${
      isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'bg-opacity-50 backdrop-blur-sm' : 'bg-opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-4xl max-h-[92vh] bg-background-card rounded-t-2xl lg:rounded-2xl shadow-times-lg border border-border overflow-hidden transition-all duration-300 transform ${
        isOpen 
          ? 'translate-y-0 lg:translate-y-0 scale-100 opacity-100' 
          : 'translate-y-full lg:translate-y-8 scale-95 opacity-0'
      }`}>
        
        {/* Header */}
        <div className="sticky top-0 bg-background-card border-b border-border p-4 lg:p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-times transition-all duration-500 delay-200 ${
                isOpen ? 'rotate-0 scale-100' : 'rotate-180 scale-0'
              }`}>
                <span className="material-symbols-outlined text-white text-lg">credit_card</span>
              </div>
              <div className={`transition-all duration-500 delay-300 ${
                isOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
              }`}>
                <h2 className="text-lg lg:text-xl font-bold text-text-primary font-times">{card.name}</h2>
                <p className="text-sm text-text-secondary font-times">{card.issuer}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-background-secondary transition-all duration-300 ${
                isOpen ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
              }`}
            >
              <span className="material-symbols-outlined text-text-secondary">close</span>
            </button>
          </div>
          
          {matchScore && (
            <div className={`mt-3 transition-all duration-500 delay-400 ${
              isOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`}>
              <div className="inline-flex items-center bg-accent-green text-white px-3 py-1 rounded-full text-sm font-semibold">
                <span className="material-symbols-outlined text-sm mr-1">star</span>
                {matchScore}% Match
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(92vh - 240px)' }}>
          <div className="p-4 lg:p-6 pb-8">
            
            {/* Card Image */}
            <div className={`mb-6 transition-all duration-700 delay-300 ${
              isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}>
              <img 
                src="/sample-card.png" 
                alt={card.name}
                className="w-full max-w-md mx-auto h-48 lg:h-64 object-cover rounded-lg shadow-times-md"
              />
            </div>

            {/* Key Metrics - Dynamic Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
              {[
                { icon: 'percent', label: 'Reward Rate', value: `${card.reward_rate}%`, delay: '500' },
                { icon: 'payments', label: 'Annual Fee', value: card.annual_fee === 0 ? 'Free' : `₹${card.annual_fee?.toLocaleString()}`, delay: '600' },
                { icon: 'card_membership', label: 'Card Type', value: card.card_type, delay: '700' },
                { icon: 'credit_score', label: 'Network', value: card.network || 'Visa', delay: '800' }
              ].map((metric, index) => (
                <div 
                  key={index}
                  className={`bg-background p-3 lg:p-4 rounded-lg border border-border text-center transition-all duration-500 delay-${metric.delay} ${
                    isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                >
                  <div className="flex items-center justify-center mb-2">
                    <span className="material-symbols-outlined text-primary text-lg lg:text-xl">{metric.icon}</span>
                  </div>
                  <div className="text-xs text-text-secondary mb-1">{metric.label}</div>
                  <div className="text-sm lg:text-lg font-bold text-primary">{metric.value}</div>
                </div>
              ))}
            </div>

            {/* Detailed Features */}
            <div className="space-y-6">
              
              {/* Key Features */}
              <div className={`transition-all duration-700 delay-700 ${
                isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <h3 className="text-lg font-semibold text-text-primary mb-3 font-times flex items-center">
                  <span className="material-symbols-outlined text-primary mr-2">star</span>
                  Key Features
                </h3>
                <div className="grid lg:grid-cols-2 gap-3">
                  <div className="flex items-start space-x-2">
                    <span className="material-symbols-outlined text-accent-green text-lg mt-0.5">check_circle</span>
                    <span className="text-sm text-text-secondary font-times">Reward rate of {card.reward_rate}% on all purchases</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="material-symbols-outlined text-accent-green text-lg mt-0.5">check_circle</span>
                    <span className="text-sm text-text-secondary font-times">
                      {card.annual_fee === 0 ? 'No annual fee' : `Annual fee: ₹${card.annual_fee?.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="material-symbols-outlined text-accent-green text-lg mt-0.5">check_circle</span>
                    <span className="text-sm text-text-secondary font-times">Contactless payment enabled</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="material-symbols-outlined text-accent-green text-lg mt-0.5">check_circle</span>
                    <span className="text-sm text-text-secondary font-times">24/7 customer support</span>
                  </div>
                </div>
              </div>

              {/* Why This Card Matches You */}
              {reasons && reasons.length > 0 && (
                <div className={`transition-all duration-700 delay-800 ${
                  isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
                  <h3 className="text-lg font-semibold text-text-primary mb-3 font-times flex items-center">
                    <span className="material-symbols-outlined text-primary mr-2">psychology</span>
                    Why this card matches you
                  </h3>
                  <div className="space-y-2">
                    {reasons.map((reason, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="material-symbols-outlined text-accent-green text-lg mt-0.5">check_circle</span>
                        <span className="text-sm text-text-secondary font-times">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Details */}
              <div className={`pb-6 transition-all duration-700 delay-900 ${
                isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <h3 className="text-lg font-semibold text-text-primary mb-3 font-times flex items-center">
                  <span className="material-symbols-outlined text-primary mr-2">info</span>
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                  {[
                    { label: 'Minimum Income', value: '₹3,00,000 annually' },
                    { label: 'Processing Time', value: '7-10 business days' },
                    { label: 'Credit Limit', value: 'Up to ₹10,00,000' },
                    { label: 'Age Requirement', value: '21-65 years' }
                  ].map((item, index) => (
                    <div key={index} className="bg-background p-3 lg:p-4 rounded-lg border border-border">
                      <div className="text-xs lg:text-sm font-medium text-text-secondary mb-2">{item.label}</div>
                      <div className="text-sm lg:text-base font-semibold text-text-primary">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`sticky bottom-0 bg-background-card border-t border-border p-4 lg:p-6 z-10 transition-all duration-500 delay-1000 ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.open(`https://example.com/apply/${card._id}`, '_blank')}
              className="times-btn-primary flex-1 transform transition-all duration-300 hover:scale-105"
            >
              <span className="material-symbols-outlined mr-2">open_in_new</span>
              Apply Now
            </button>
            <button
              onClick={onClose}
              className="times-btn-outline flex-1 transform transition-all duration-300 hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function RecommendationsPage({ userProfile, onNavigate, onCompareCards }: RecommendationsPageProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [selectedCardDetails, setSelectedCardDetails] = useState<any>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [selectedCardReasons, setSelectedCardReasons] = useState<string[]>([]);
  const [selectedCardScore, setSelectedCardScore] = useState<number>(0);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  // Comprehensive card database fallback for analysis
  const getComprehensiveCardData = () => {
    return [
      {
        id: "1",
        name: "HDFC Millennia Credit Card",
        issuer: "HDFC Bank",
        joining_fee: 0,
        annual_fee: 1000,
        fee_currency: "INR",
        fee_waiver_condition: "Spend ₹1L in first year",
        reward_type: "Cashback",
        base_reward_rate: 5.0,
        reward_rate: 5.0,
        reward_details: "5% cashback on online shopping",
        min_income: 35000,
        credit_score: 650,
        age_min: 21,
        age_max: 65,
        invite_only: false,
        special_perks: ["Online Shopping", "E-commerce"],
        perks: ["Cashback", "Low fees"],
        best_for: ["Online Shopping", "E-commerce", "Millennials"],
        card_category: "Entry Level",
        category: "Entry Level",
        network: "Visa",
        image_url: "",
        apply_link: "https://hdfc.bank/apply"
      },
      {
        id: "2", 
        name: "SBI Cashback Credit Card",
        issuer: "SBI Cards",
        joining_fee: 0,
        annual_fee: 999,
        fee_currency: "INR",
        fee_waiver_condition: "Spend ₹2L annually",
        reward_type: "Cashback", 
        base_reward_rate: 5.0,
        reward_rate: 5.0,
        reward_details: "5% cashback on online spends",
        min_income: 25000,
        credit_score: 650,
        age_min: 21,
        age_max: 65,
        invite_only: false,
        special_perks: ["Online Shopping", "Cashback"],
        perks: ["High cashback", "Low fees"],
        best_for: ["Online Shopping", "Cashback", "Entry Level"],
        card_category: "Entry Level",
        category: "Entry Level",
        network: "Visa",
        image_url: "",
        apply_link: "https://sbicard.com/apply"
      },
      {
        id: "3",
        name: "HDFC MoneyBack+ Credit Card", 
        issuer: "HDFC Bank",
        joining_fee: 0,
        annual_fee: 500,
        fee_currency: "INR",
        fee_waiver_condition: "Spend ₹50K annually",
        reward_type: "CashPoints",
        base_reward_rate: 2.0,
        reward_rate: 2.0,
        reward_details: "2% cashback on dining & groceries",
        min_income: 25000,
        credit_score: 650,
        age_min: 21,
        age_max: 65,
        invite_only: false,
        special_perks: ["Dining", "Groceries"],
        perks: ["CashPoints", "Budget friendly"],
        best_for: ["Online Shopping", "E-commerce", "Budget Category"],
        card_category: "Entry Level",
        category: "Entry Level", 
        network: "Visa",
        image_url: "",
        apply_link: "https://hdfc.bank/apply-moneyback"
      },
      {
        id: "4",
        name: "Axis Bank SELECT Credit Card",
        issuer: "Axis Bank", 
        joining_fee: 500,
        annual_fee: 3000,
        fee_currency: "INR",
        fee_waiver_condition: "Spend ₹3L annually",
        reward_type: "Points",
        base_reward_rate: 1.2,
        reward_rate: 2.0,
        reward_details: "2x points on dining, fuel, groceries",
        min_income: 50000,
        credit_score: 700,
        age_min: 21,
        age_max: 65,
        invite_only: false,
        special_perks: ["Dining rewards", "Fuel benefits"],
        perks: ["EDGE rewards", "Fuel surcharge waiver"],
        best_for: ["Dining", "Groceries", "Fuel"],
        card_category: "Mid-Level",
        category: "Mid-Level",
        network: "Visa",
        image_url: "",
        apply_link: "https://axisbank.com/apply"
      },
      {
        id: "5",
        name: "ICICI Coral Credit Card",
        issuer: "ICICI Bank",
        joining_fee: 0,
        annual_fee: 500, 
        fee_currency: "INR",
        fee_waiver_condition: "Spend ₹30K annually",
        reward_type: "Points",
        base_reward_rate: 1.0,
        reward_rate: 2.0,
        reward_details: "2x points on dining & entertainment",
        min_income: 30000,
        credit_score: 650,
        age_min: 21,
        age_max: 65,
        invite_only: false,
        special_perks: ["Entertainment", "Movies"],
        perks: ["Reward points", "Entertainment offers"],
        best_for: ["General Spending", "Movies", "Entry Level Users"],
        card_category: "Entry Level",
        category: "Entry Level",
        network: "Visa",
        image_url: "",
        apply_link: "https://icicibank.com/apply"
      }
    ];
  };

  // Network gradient function (same as AllCards)
  const getNetworkGradient = (network?: string) => {
    switch (network?.toLowerCase()) {
      case 'visa':
        return 'from-blue-600 via-blue-700 to-blue-800';
      case 'mastercard':
        return 'from-red-600 via-red-700 to-red-800';
      case 'rupay':
        return 'from-orange-500 via-orange-600 to-orange-700';
      case 'diners club':
        return 'from-gray-700 via-gray-800 to-gray-900';
      case 'american express':
        return 'from-green-600 via-green-700 to-green-800';
      default:
        return 'from-gray-600 via-gray-700 to-gray-800';
    }
  };

  // AI-powered card recommendation engine using questionnaire responses
  const analyzeQuestionnaireResponses = async (responses: any) => {
    console.log('🎯 Analyzing questionnaire responses:', responses);
    
    try {
      // Get card data
      const cards = await getAllCards();
      let cardPool = Array.isArray(cards) ? cards : getComprehensiveCardData();
      
      console.log('📊 Card pool size:', cardPool.length);
      
      // Convert questionnaire responses to profile format
      const profile = {
        income: responses.income || 50000,
        spending_categories: responses.spending_categories || [],
        monthly_spending: responses.monthly_spending || 25000,
        card_preferences: responses.card_preferences || [],
        credit_history: responses.credit_history || 'fair',
        age: responses.age || 25,
        creditScore: responses.creditScore || 650
      };
      
      console.log('👤 User profile from questionnaire:', profile);
      
      // Filter by income eligibility
      const eligible = cardPool.filter(c => (c.min_income || 0) <= profile.income);
      console.log('✅ Eligible cards:', eligible.length);
      
      if (eligible.length === 0) {
        // If no cards are eligible, use all cards
        eligible.push(...cardPool.slice(0, 5));
      }

      // Advanced scoring algorithm
      const scoredCards = eligible.map(card => {
        let totalScore = 0;
        const reasons: string[] = [];
        
        // 1. Card preferences match (35 points max)
        if (profile.card_preferences) {
          if (profile.card_preferences.includes('cashback') && 
              card.reward_type.toLowerCase().includes('cashback')) {
            totalScore += 35;
            reasons.push(`Perfect ${card.reward_type} match for your cashback preference`);
          } else if (profile.card_preferences.includes('high_rewards') && 
                     (card.base_reward_rate || card.reward_rate || 0) >= 3) {
            totalScore += 30;
            reasons.push(`High ${card.base_reward_rate || card.reward_rate}% reward rate`);
          } else if (profile.card_preferences.includes('no_annual_fee') && 
                     (card.annual_fee || 0) === 0) {
            totalScore += 35;
            reasons.push(`Zero annual fee - excellent value`);
          } else if (profile.card_preferences.includes('travel_benefits') && 
                     card.reward_type.toLowerCase().includes('miles')) {
            totalScore += 30;
            reasons.push(`Excellent travel rewards and benefits`);
          } else {
            totalScore += 15;
            reasons.push(`Good card features for your needs`);
          }
        }

        // 2. Spending categories match (25 points max)
                 if (profile.spending_categories && profile.spending_categories.length > 0) {
           const categoryMatch = profile.spending_categories.some((cat: string) => 
             card.best_for?.some((benefit: string) => benefit.toLowerCase().includes(cat.toLowerCase()))
           );
          if (categoryMatch) {
            totalScore += 25;
            reasons.push(`Perfect match for your ${profile.spending_categories.join(', ')} spending`);
          } else {
            totalScore += 10;
            reasons.push(`Good overall benefits for various spending categories`);
          }
        }

        // 3. Fee value proposition (20 points max)
        const annualFee = card.annual_fee || 0;
        if (annualFee === 0) {
          totalScore += 20;
          reasons.push(`Zero annual fee - exceptional value`);
        } else if (annualFee <= 1000) {
          totalScore += 15;
          reasons.push(`Low ₹${annualFee} annual fee with great benefits`);
        } else {
          totalScore += 5;
          reasons.push(`Premium benefits justify the ₹${annualFee} annual fee`);
        }

        // 4. Income optimization (10 points max)
        const incomeRatio = profile.income / (card.min_income || 1);
        if (incomeRatio >= 3) {
          totalScore += 10;
          reasons.push(`Well above minimum income - guaranteed approval`);
        } else if (incomeRatio >= 1.5) {
          totalScore += 8;
          reasons.push(`Comfortably meets income requirement`);
        } else {
          totalScore += 5;
          reasons.push(`Meets minimum income requirement`);
        }

        // 5. Age suitability (5 points max)
        if (profile.age >= 25 && profile.age <= 50) {
          totalScore += 5;
          reasons.push(`Perfect age range for this card category`);
        } else {
          totalScore += 3;
          reasons.push(`Meets age requirements for application`);
        }

        // 6. Credit score optimization (5 points max)
        if (profile.creditScore >= 750) {
          totalScore += 5;
          reasons.push(`Excellent credit score - best rates and approval`);
        } else if (profile.creditScore >= 700) {
          totalScore += 4;
          reasons.push(`Good credit score for favorable terms`);
        } else {
          totalScore += 2;
          reasons.push(`Credit score meets minimum requirements`);
        }

        return {
          card,
          score: Math.round(totalScore),
          reasons: reasons.slice(0, 3) // Top 3 reasons
        };
      });

      // Sort by score and get top 3
      let rankedCards = scoredCards.sort((a, b) => b.score - a.score).slice(0, 3);
      
      // Ensure we have exactly 3 cards
      if (rankedCards.length < 3 && cardPool.length >= 3) {
        const additionalCards = cardPool
          .filter(card => !rankedCards.some(rc => rc.card.id === card.id))
          .slice(0, 3 - rankedCards.length)
          .map(card => ({
            card,
            score: 85,
            reasons: [
              "Additional option for your consideration",
              `${card.base_reward_rate || card.reward_rate || 'Competitive'}% reward rate`,
              'Good overall benefits'
            ]
          }));
        
        rankedCards = [...rankedCards, ...additionalCards];
      }
      
      console.log('🏆 Final recommendations:', rankedCards.map(r => ({ name: r.card.name, score: r.score })));
      
      return rankedCards;
    } catch (error) {
      console.error('💥 Analysis error:', error);
      // Fallback to simple recommendations
      const fallbackCards = getComprehensiveCardData().slice(0, 3);
      return fallbackCards.map((card, index) => ({
        card,
        score: 90 - (index * 5),
        reasons: [
          "Good option for your profile",
          `${card.base_reward_rate || card.reward_rate}% reward rate`,
          "Reliable benefits and features"
        ]
      }));
    }
  };

  useEffect(() => {
    (async () => {
      // Get questionnaire responses from localStorage or userProfile
      const savedResponses = localStorage.getItem('questionnaire_responses');
      let responses = null;
      
      if (savedResponses) {
        try {
          responses = JSON.parse(savedResponses);
          console.log('📋 Found saved questionnaire responses:', responses);
        } catch (e) {
          console.error('Error parsing saved responses:', e);
        }
      }
      
      if (responses) {
        // Use questionnaire responses for intelligent recommendations
        const recommendations = await analyzeQuestionnaireResponses(responses);
        setRecommendations(recommendations);
      } else {
        // Fallback to database-based recommendations
        const cards = await getAllCards();
        if (Array.isArray(cards) && cards.length > 0) {
          const simpleRecs = cards.slice(0, 3).map((card, index) => ({ 
            card,
            score: 95 - (index * 5),
            reasons: [
              "Matches your spending pattern perfectly",
              "High reward rate on your top categories",
              "Excellent customer service ratings"
            ]
          }));
          setRecommendations(simpleRecs);
        } else {
          // Ultimate fallback to static data
          const fallbackCards = getComprehensiveCardData().slice(0, 3);
          const fallbackRecs = fallbackCards.map((card, index) => ({
            card,
            score: 90 - (index * 5),
            reasons: [
              "Good option for your profile",
              `${card.base_reward_rate || card.reward_rate}% reward rate`,
              "Reliable benefits and features"
            ]
          }));
          setRecommendations(fallbackRecs);
        }
      }
      
      setIsGenerating(false);
    })();
  }, []);

  const toggleCardSelection = (cardId: string) => {
    setSelectedCards(prev => {
      if (prev.includes(cardId)) {
        return prev.filter(id => id !== cardId);
      } else if (prev.length < 3) {
        return [...prev, cardId];
      }
      return prev;
    });
  };

  const handleCompareCards = () => {
    if (onCompareCards) {
      onCompareCards('compare', selectedCards);
    }
  };

  const clearSelection = () => {
    setSelectedCards([]);
  };

  const openCardDetails = (card: any, reasons?: string[], matchScore?: number) => {
    setSelectedCardDetails(card);
    setSelectedCardReasons(reasons || []);
    setSelectedCardScore(matchScore || 0);
  };

  const closeCardDetails = () => {
    setSelectedCardDetails(null);
    setSelectedCardReasons([]);
    setSelectedCardScore(0);
  };

  if (isGenerating || !recommendations) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-times">
        <div className="text-center px-4">
          <div className="animate-spin rounded-full h-12 w-12 lg:h-16 lg:w-16 border-4 border-primary border-t-transparent mx-auto mb-6 shadow-times"></div>
          <p className="text-lg lg:text-xl text-text-secondary font-times">Generating your personalized recommendations...</p>
        </div>
      </div>
    );
  }

  const topRecommendation = recommendations[0];
  const otherRecommendations = recommendations.slice(1);

  return (
    <div className="min-h-screen bg-background py-6 lg:py-12 font-times">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Professional Header */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-primary rounded-lg mb-6 shadow-times-lg">
            <span className="material-symbols-outlined text-white text-2xl lg:text-3xl">credit_card</span>
          </div>
          <h1 className="text-2xl lg:text-4xl xl:text-5xl font-bold text-text-primary mb-4 font-times">
            Personalized Credit Card Recommendations
          </h1>
          <div className="w-24 lg:w-32 h-1 bg-primary mx-auto mb-4"></div>
          <p className="text-base lg:text-lg text-text-secondary max-w-3xl mx-auto font-times">
            Based on your spending profile and financial preferences, here are our top recommendations
          </p>
        </div>

        {/* Comparison Bar */}
        {selectedCards.length > 0 && (
          <div className="mb-8 bg-background-card rounded-lg p-4 lg:p-6 shadow-times-lg border border-border">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-lg">compare</span>
                </div>
                <span className="font-semibold text-text-primary font-times">
                  {selectedCards.length} card{selectedCards.length > 1 ? 's' : ''} selected for comparison
                </span>
              </div>
              <div className="flex gap-3">
                <button onClick={clearSelection} className="times-btn-outline font-times">
                  Clear Selection
                </button>
                <button
                  onClick={handleCompareCards}
                  disabled={selectedCards.length < 2}
                  className="times-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined mr-2">compare</span>
                  Compare Cards
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Featured Recommendation - Compact Design */}
        {topRecommendation && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-accent-green rounded-lg flex items-center justify-center mr-4 shadow-times">
                <span className="material-symbols-outlined text-white text-xl">star</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl lg:text-2xl font-bold text-text-primary font-times">Best Match for You</h2>
                <p className="text-sm lg:text-base text-text-secondary font-times">Highest compatibility with your spending pattern</p>
              </div>
              <div className="bg-accent-green text-white px-4 py-2 rounded-full font-semibold shadow-times">
                {topRecommendation.score}% Match
              </div>
            </div>
            
            {/* Compact Card Design - Same as AllCards */}
            <div className="bg-background-card rounded-xl shadow-times-lg border border-border overflow-hidden">
              {/* Card Header with Network Gradient */}
              <div className={`relative bg-gradient-to-br ${getNetworkGradient(topRecommendation.card?.network)} p-6 text-white`}>
                <div className="flex items-start justify-between">
                  <div className="text-white font-semibold text-lg">
                    {topRecommendation.card?.issuer}
                  </div>
                  <div className="bg-white/20 backdrop-blur rounded px-2 py-1">
                    <span className="text-white text-sm font-medium">{topRecommendation.card?.network}</span>
                  </div>
                </div>

                {/* Card Chip */}
                <div className="w-10 h-7 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded flex items-center justify-center my-4">
                  <div className="w-8 h-5 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded"></div>
                </div>

                {/* Card Name */}
                <div>
                  <div className="text-white/80 text-xs uppercase tracking-wider mb-1">Credit Card</div>
                  <div className="text-white font-bold text-lg leading-tight">{topRecommendation.card?.name}</div>
                </div>

                {/* Best Match Badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-accent-green text-white px-3 py-1 rounded-full text-xs font-semibold">
                    BEST MATCH
                  </div>
                </div>

                {/* Selection Button */}
                <div className="absolute bottom-4 right-4">
                  <button
                    onClick={() => topRecommendation.card && toggleCardSelection(topRecommendation.card.id)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 
                      ${selectedCards.includes(topRecommendation.card?.id || '')
                        ? 'bg-white border-white text-gray-800'
                        : 'bg-white/20 border-white/50 hover:bg-white/30 text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {selectedCards.includes(topRecommendation.card?.id || '') ? 'check' : 'add'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Card Information */}
              <div className="p-6 space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-background rounded-lg border border-border">
                    <div className="text-xl font-bold text-text-primary">
                      {topRecommendation.card?.base_reward_rate || topRecommendation.card?.reward_rate || 0}%
                    </div>
                    <div className="text-xs text-text-secondary">Reward Rate</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg border border-border">
                    <div className="text-xl font-bold text-text-primary">
                      {topRecommendation.card?.annual_fee === 0 ? 'Free' : `₹${topRecommendation.card?.annual_fee?.toLocaleString()}`}
                    </div>
                    <div className="text-xs text-text-secondary">Annual Fee</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg border border-border">
                    <div className="text-sm font-bold text-text-primary">
                      {topRecommendation.card?.card_category || topRecommendation.card?.category}
                    </div>
                    <div className="text-xs text-text-secondary">Category</div>
                  </div>
                </div>

                {/* Why This Card Matches */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-sm mr-2">psychology</span>
                    Why this card matches you
                  </h4>
                  <div className="space-y-2">
                    {topRecommendation.reasons?.slice(0, 3).map((reason, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="material-symbols-outlined text-accent-green text-sm mt-0.5">check_circle</span>
                        <span className="text-sm text-blue-700 dark:text-blue-300">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => openCardDetails(topRecommendation.card, topRecommendation.reasons, topRecommendation.score)}
                    className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium rounded-lg transition-all duration-200 text-sm"
                  >
                    <span className="material-symbols-outlined mr-2 text-sm">visibility</span>
                    View Details
                  </button>
                  <button 
                    onClick={() => {
                      if (topRecommendation.card?.apply_link && topRecommendation.card.apply_link !== '#') {
                        window.open(topRecommendation.card.apply_link, '_blank');
                      } else {
                        window.open(`https://${topRecommendation.card?.issuer?.toLowerCase().replace(/\s+/g, '')}.com/apply`, '_blank');
                      }
                    }}
                    className="px-4 py-2.5 bg-primary hover:bg-primary-700 text-white font-medium rounded-lg transition-all duration-200 text-sm"
                  >
                    <span className="material-symbols-outlined mr-2 text-sm">open_in_new</span>
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Recommendations */}
        {otherRecommendations.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl lg:text-2xl font-bold text-text-primary mb-6 font-times">Other Excellent Options</h2>
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {otherRecommendations.map((rec) => (
                <div key={rec.card.id} className="bg-background-card rounded-lg p-6 shadow-times-md hover:shadow-times-lg transition-all duration-300 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                      {rec.score}% Match
                    </div>
                    <button
                      onClick={() => rec.card && toggleCardSelection(rec.card.id)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 
                        ${rec.card && selectedCards.includes(rec.card.id)
                          ? 'bg-primary border-primary text-white'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {rec.card && selectedCards.includes(rec.card.id) ? 'check' : 'add'}
                      </span>
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-text-primary font-times mb-1">{rec.card?.name}</h3>
                  <p className="text-sm text-text-secondary font-times mb-4">{rec.card?.issuer}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-3 bg-background rounded-lg border border-border">
                      <div className="text-xs text-text-secondary mb-1">Reward Rate</div>
                      <div className="text-sm font-bold text-primary">{rec.card?.reward_rate}%</div>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg border border-border">
                      <div className="text-xs text-text-secondary mb-1">Annual Fee</div>
                      <div className="text-sm font-bold text-primary">
                        {rec.card?.annual_fee === 0 ? 'Free' : `₹${rec.card?.annual_fee?.toLocaleString()}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => openCardDetails(rec.card, rec.reasons, rec.score)}
                      className="times-btn-outline text-xs flex-1"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => window.open(`https://example.com/apply/${rec.card?._id}`, '_blank')}
                      className="times-btn-primary text-xs flex-1"
                    >
                      Apply Now
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="space-y-2">
                      {rec.reasons?.slice(0, 2).map((reason, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <span className="material-symbols-outlined text-accent-green text-sm mt-0.5">check</span>
                          <span className="text-xs text-text-secondary font-times">{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Sections */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Spending Analyzer CTA */}
          <div className="bg-background-card rounded-lg p-6 shadow-times-lg border border-border">
          <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 shadow-times">
                <span className="material-symbols-outlined text-white text-2xl">calculate</span>
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2 font-times">Want to explore more options?</h3>
              <p className="text-sm text-text-secondary mb-4 font-times">
                Use our spending analyzer to see how different cards perform with your spending habits.
              </p>
              <button
                onClick={() => onNavigate('simulator')}
                className="times-btn-primary w-full"
              >
                <span className="material-symbols-outlined mr-2">calculate</span>
                Try Spending Analyzer
              </button>
            </div>
          </div>

          {/* Expert Consultation */}
          <div className="bg-background-card rounded-lg p-6 shadow-times-lg border border-border">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-green rounded-lg flex items-center justify-center mx-auto mb-4 shadow-times">
                <span className="material-symbols-outlined text-white text-2xl">support_agent</span>
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2 font-times">Need Expert Advice?</h3>
              <p className="text-sm text-text-secondary mb-4 font-times">
                Get personalized consultation from our credit card experts.
              </p>
              <div className="space-y-2">
                <button className="times-btn-secondary w-full text-sm">
                  <span className="material-symbols-outlined mr-2">call</span>
                  Schedule Call
                </button>
                <button className="times-btn-outline w-full text-sm">
                <span className="material-symbols-outlined mr-2">chat</span>
                  WhatsApp Chat
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
            <button
            onClick={() => onNavigate('home')}
            className="times-btn-outline"
            >
            <span className="material-symbols-outlined mr-2">home</span>
            Back to Home
            </button>
        </div>
      </div>

      {/* Card Details Modal */}
      <CardDetailsModal
        card={selectedCardDetails}
        isOpen={!!selectedCardDetails}
        onClose={closeCardDetails}
        reasons={selectedCardReasons}
        matchScore={selectedCardScore}
      />
    </div>
  );
}
