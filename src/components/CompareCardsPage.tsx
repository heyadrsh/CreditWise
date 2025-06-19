import { useState, useEffect } from "react";
import { getAllCards } from "../lib/creditCardApi";
import { CreditCard } from "../lib/database.types";
import CardDetailsModal from "./CardDetailsModal";

type Page = "home" | "summary" | "recommendations" | "simulator" | "compare" | "all-cards";

interface CompareCardsPageProps {
  onNavigate: (page: Page) => void;
  selectedCardIds?: string[];
}

export default function CompareCardsPage({ onNavigate, selectedCardIds = [] }: CompareCardsPageProps) {
  const [cards, setCards] = useState<CreditCard[] | null>(null);
  const [selectedCards, setSelectedCards] = useState<CreditCard[]>([]);
  const [modalCard, setModalCard] = useState<CreditCard | null>(null);
  const [showCardSelector, setShowCardSelector] = useState(false);

  // Fetch cards on mount
  useEffect(() => {
    (async () => {
      const data = await getAllCards();
      if (Array.isArray(data)) {
        setCards(data as CreditCard[]);
      }
    })();
  }, []);

  // Preselect cards when both cards and ids are available
  useEffect(() => {
    if (cards && selectedCardIds.length > 0) {
      const preselected = cards.filter((card: CreditCard) => selectedCardIds.includes(card.id));
      setSelectedCards(preselected);
    }
  }, [cards, selectedCardIds]);

  if (!cards) {
    return (
      <div className="min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg text-text-secondary">Loading cards...</p>
        </div>
      </div>
    );
  }

  const handleCardSelect = (card: CreditCard) => {
    if (selectedCards.find(c => c.id === card.id)) {
      setSelectedCards(selectedCards.filter(c => c.id !== card.id));
    } else if (selectedCards.length < 3) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const handleCardRemove = (cardId: string) => {
    setSelectedCards(selectedCards.filter(c => c.id !== cardId));
  };

  const handleCardClick = (cardId: string) => {
    const card = cards.find((c: CreditCard) => c.id === cardId);
    if (card) {
      setModalCard(card);
    }
  };

  // Helper function to get display values with enhanced schema support
  const getDisplayRewardRate = (card: CreditCard) => card.base_reward_rate || card.reward_rate || 0;
  const getDisplayCategory = (card: CreditCard) => card.card_category || card.category;

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'super premium':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'premium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'mid-premium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'mid-level':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'entry level':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-text-primary">
            Compare Credit Cards
          </h1>
          <p className="text-base lg:text-xl text-text-secondary">
            Professional side-by-side comparison of credit card features and benefits
          </p>
        </div>

        {/* Card Selection Header */}
        <div className="bg-background-card">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl lg:text-2xl font-semibold text-text-primary">
                Selected Cards ({selectedCards.length}/3)
              </h2>
              <p className="text-text-secondary">
                {selectedCards.length === 0 && "Select cards to start comparing"}
                {selectedCards.length === 1 && "Add at least one more card to compare"}
                {selectedCards.length >= 2 && "Perfect! Compare the cards below"}
                  </p>
                </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <button
                onClick={() => setShowCardSelector(true)}
                className="px-6 py-3 bg-primary hover:bg-primary-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined mr-2">add</span>
                Add Cards to Compare
              </button>
              {selectedCards.length >= 2 && (
                <button
                  onClick={() => onNavigate("all-cards")}
                  className="px-6 py-3 border border-border"
                >
                  <span className="material-symbols-outlined mr-2">view_module</span>
                  Browse All Cards
                </button>
              )}
            </div>
            </div>

          {/* Selected Cards Preview */}
            {selectedCards.length > 0 && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedCards.map((card) => (
                <div key={card.id} className="bg-background">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-text-primary">{card.name}</h3>
                      <p className="text-sm text-text-secondary">{card.issuer}</p>
                    </div>
                      <button
                      onClick={() => handleCardRemove(card.id)}
                      className="ml-2 p-1 text-text-secondary"
                      title="Remove card"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  <div className="flex items-center justify-between">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(getDisplayCategory(card))}`}>
                      {getDisplayCategory(card)}
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {getDisplayRewardRate(card)}% rewards
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        {/* Professional Comparison Table */}
        {selectedCards.length >= 2 && (
          <div className="bg-background-card">
            <div className="p-4 lg:p-6 border-b border-border">
              <h2 className="text-xl lg:text-2xl font-bold text-text-primary">
                Detailed Comparison
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-background-secondary">
                  <tr>
                    <th className="px-4 lg:px-6 py-4 text-left text-sm font-semibold text-text-primary">
                      Features
                    </th>
                    {selectedCards.map((card) => (
                      <th key={card.id} className="px-4 lg:px-6 py-4 text-left font-medium">
                        <div className="min-w-0">
                          <div className="font-semibold text-text-primary">
                        {card.name}
                          </div>
                          <div className="text-sm text-text-secondary">
                            {card.issuer}
                          </div>
                          <button
                            onClick={() => handleCardClick(card.id)}
                            className="mt-2 text-xs text-primary hover:text-primary-dark underline"
                          >
                            View Details
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {/* Card Category */}
                  <tr>
                    <td className="px-4 lg:px-6 py-4 text-sm font-medium text-text-primary">
                      Card Category
                    </td>
                    {selectedCards.map((card) => (
                      <td key={card.id} className="px-4 lg:px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(getDisplayCategory(card))}`}>
                          {getDisplayCategory(card)}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Network */}
                  <tr className="bg-background-secondary/20">
                    <td className="px-4 lg:px-6 py-4 text-sm font-medium text-text-primary">
                      Network
                    </td>
                    {selectedCards.map((card) => (
                      <td key={card.id} className="px-4 lg:px-6 py-4 text-sm text-text-secondary">
                        {card.network}
                      </td>
                    ))}
                  </tr>

                  {/* Reward Rate */}
                  <tr>
                    <td className="px-4 lg:px-6 py-4 text-sm font-medium text-text-primary">
                      Base Reward Rate
                    </td>
                    {selectedCards.map((card) => (
                      <td key={card.id} className="px-4 lg:px-6 py-4">
                        <div className="text-lg font-bold text-primary">
                          {getDisplayRewardRate(card)}%
                        </div>
                        <div className="text-xs text-text-secondary">
                          {card.reward_type}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Annual Fee */}
                  <tr className="bg-background-secondary/20">
                    <td className="px-4 lg:px-6 py-4 text-sm font-medium text-text-primary">
                      Annual Fee
                    </td>
                    {selectedCards.map((card) => (
                      <td key={card.id} className="px-4 lg:px-6 py-4">
                        <div className="text-lg font-bold text-text-primary">
                        {card.annual_fee === 0 ? 'Free' : `₹${card.annual_fee.toLocaleString()}`}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Joining Fee */}
                  <tr>
                    <td className="px-4 lg:px-6 py-4 text-sm font-medium text-text-primary">
                      Joining Fee
                    </td>
                    {selectedCards.map((card) => (
                      <td key={card.id} className="px-4 lg:px-6 py-4 text-sm text-text-secondary">
                        {card.joining_fee === 0 ? 'Free' : `₹${card.joining_fee.toLocaleString()}`}
                      </td>
                    ))}
                  </tr>

                  {/* Minimum Income */}
                  <tr className="bg-background-secondary/20">
                    <td className="px-4 lg:px-6 py-4 text-sm font-medium text-text-primary">
                      Minimum Income
                    </td>
                    {selectedCards.map((card) => (
                      <td key={card.id} className="px-4 lg:px-6 py-4 text-sm text-text-secondary">
                        ₹{(card.min_income / 100000).toFixed(1)}L/month
                      </td>
                    ))}
                  </tr>

                  {/* Credit Score */}
                  <tr>
                    <td className="px-4 lg:px-6 py-4 text-sm font-medium text-text-primary">
                      Credit Score Required
                    </td>
                    {selectedCards.map((card) => (
                      <td key={card.id} className="px-4 lg:px-6 py-4 text-sm text-text-secondary">
                        {card.credit_score}+
                      </td>
                    ))}
                  </tr>

                  {/* Age Range */}
                  <tr className="bg-background-secondary/20">
                    <td className="px-4 lg:px-6 py-4 text-sm font-medium text-text-primary">
                      Age Range
                    </td>
                    {selectedCards.map((card) => (
                      <td key={card.id} className="px-4 lg:px-6 py-4 text-sm text-text-secondary">
                        {card.age_min}-{card.age_max} years
                      </td>
                    ))}
                  </tr>

                  {/* Fee Waiver Condition */}
                  {selectedCards.some(card => card.fee_waiver_condition) && (
                    <tr>
                      <td className="px-4 lg:px-6 py-4 text-sm font-medium text-text-primary">
                        Fee Waiver Condition
                      </td>
                      {selectedCards.map((card) => (
                        <td key={card.id} className="px-4 lg:px-6 py-4 text-sm text-text-secondary">
                          {card.fee_waiver_condition || 'Not specified'}
                        </td>
                      ))}
                    </tr>
                  )}

                  {/* Key Benefits */}
                  <tr className="bg-background-secondary/20">
                    <td className="px-4 lg:px-6 py-4 text-sm font-medium text-text-primary">
                      Key Benefits
                    </td>
                    {selectedCards.map((card) => (
                      <td key={card.id} className="px-4 lg:px-6 py-4">
                        <div className="space-y-1">
                          {(card.special_perks || card.perks || []).slice(0, 3).map((perk, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm text-text-secondary">{perk}</span>
                            </div>
                          ))}
                          {(card.special_perks || card.perks || []).length > 3 && (
                            <div className="text-xs text-text-secondary">
                              +{(card.special_perks || card.perks || []).length - 3} more benefits
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Apply Actions */}
                  <tr>
                    <td className="px-4 lg:px-6 py-4 text-sm font-medium text-text-primary">
                      Apply Now
                    </td>
                    {selectedCards.map((card) => (
                      <td key={card.id} className="px-4 lg:px-6 py-4">
                        <a
                          href={card.apply_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-700 text-white font-medium rounded-lg transition-colors text-sm"
                        >
                          <span className="material-symbols-outlined mr-2 text-sm">open_in_new</span>
                          Apply
                        </a>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {selectedCards.length === 0 && (
          <div className="text-center py-12 lg:py-16">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-primary text-2xl lg:text-3xl">compare</span>
            </div>
            <h3 className="text-xl lg:text-2xl font-semibold text-text-primary">
              Start Your Comparison
            </h3>
            <p className="text-text-secondary">
              Select credit cards to compare their features, benefits, and costs side by side.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowCardSelector(true)}
                className="px-8 py-3 bg-primary hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined mr-2">add</span>
                Select Cards to Compare
              </button>
              <button
                onClick={() => onNavigate("all-cards")}
                className="px-8 py-3 border border-border"
              >
                <span className="material-symbols-outlined mr-2">view_module</span>
                Browse All Cards
              </button>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="mt-8 lg:mt-12 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate("home")}
              className="inline-flex items-center justify-center px-6 py-3 border border-border"
            >
              <span className="material-symbols-outlined mr-2">home</span>
              Back to Home
            </button>
            <button
              onClick={() => onNavigate("recommendations")}
              className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary hover:bg-primary/10 font-semibold rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined mr-2">lightbulb</span>
              Get AI Recommendations
            </button>
          </div>
        </div>

        {/* Card Selector Modal */}
        {showCardSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-background-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-text-primary">
                  Select Cards to Compare ({selectedCards.length}/3)
                </h3>
                <button
                  onClick={() => setShowCardSelector(false)}
                  className="p-2 text-text-secondary"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <div className="overflow-y-auto max-h-96">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cards.filter((card) => !selectedCards.find(c => c.id === card.id)).map((card) => (
                    <button
                key={card.id}
                      onClick={() => {
                        handleCardSelect(card);
                        if (selectedCards.length >= 2) {
                          setShowCardSelector(false);
                        }
                      }}
                      disabled={selectedCards.length >= 3}
                      className="p-4 text-left border border-border"
                    >
                      <div className="font-medium text-text-primary">{card.name}</div>
                      <div className="text-sm text-text-secondary">{card.issuer}</div>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(getDisplayCategory(card))}`}>
                          {getDisplayCategory(card)}
                        </span>
                        <span className="text-sm font-semibold text-primary">
                          {getDisplayRewardRate(card)}%
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowCardSelector(false)}
                  className="px-6 py-2 bg-primary hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        {modalCard && (
          <CardDetailsModal 
            card={modalCard} 
            onClose={() => setModalCard(null)} 
          />
        )}
      </div>
    </div>
  );
}

