import { useState } from 'react';
import CardDetailsModal from './CardDetailsModal';
import { CreditCard } from '../lib/database.types';

interface CardTileProps {
  card: CreditCard;
  featured?: boolean;
  reasons?: string[];
  onAddToCompare?: (cardId: string) => void;
  isSelected?: boolean;
  showCompareButton?: boolean;
}

export default function CardTile({ 
  card, 
  featured = false, 
  reasons = [], 
  onAddToCompare,
  isSelected = false,
  showCompareButton = true
}: CardTileProps) {
  const [showModal, setShowModal] = useState(false);

  const getNetworkGradient = (network: string) => {
    switch (network.toLowerCase()) {
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

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'super premium':
        return 'bg-purple-600 text-white';
      case 'premium':
        return 'bg-orange-500 text-white';
      case 'mid-premium':
        return 'bg-blue-500 text-white';
      case 'mid-level':
        return 'bg-gray-500 text-white';
      case 'entry level':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Use enhanced schema fields with fallbacks
  const displayCategory = card.card_category || card.category;
  const displayRewardRate = card.base_reward_rate || card.reward_rate || 0;

  return (
    <>
      <div className={`
        relative bg-white dark:bg-gray-900 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden
        ${featured ? 'ring-2 ring-primary' : ''}
        ${isSelected ? 'ring-2 ring-primary' : ''}
      `}>
        {/* Credit Card Visual - Clean & Professional */}
        <div className={`relative bg-gradient-to-br ${getNetworkGradient(card.network)} p-6 text-white min-h-[180px] flex flex-col justify-between`}>
          {/* Card Header - Minimal */}
          <div className="flex items-start justify-between">
            <div className="text-white font-semibold text-lg">
              {card.issuer}
            </div>
            <div className="bg-white/20 backdrop-blur rounded px-2 py-1">
              <span className="text-white text-sm font-medium">{card.network}</span>
            </div>
          </div>

          {/* Card Chip - Professional */}
          <div className="w-10 h-7 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded flex items-center justify-center">
            <div className="w-8 h-5 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded"></div>
          </div>

          {/* Card Name - Clean Typography */}
          <div>
            <div className="text-white/80 text-xs uppercase tracking-wider mb-1">Credit Card</div>
            <div className="text-white font-bold text-base leading-tight">{card.name}</div>
          </div>

          {/* Selection Button - If applicable */}
          {showCompareButton && onAddToCompare && (
            <button
              onClick={() => onAddToCompare(card.id)}
              className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                isSelected
                  ? 'bg-white text-primary'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              title={isSelected ? 'Remove from comparison' : 'Add to comparison'}
            >
              <span className="material-symbols-outlined text-xs">
                {isSelected ? 'check' : 'add'}
              </span>
            </button>
          )}
        </div>

        {/* Card Information - Minimal & Professional */}
        <div className="p-6 space-y-4">
          {/* Category and Reward Rate - Key Information Only */}
          <div className="flex items-center justify-between">
            <div className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {displayCategory}
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-gray-900 dark:text-white">{displayRewardRate}%</div>
              <div className="text-xs text-gray-500">{card.reward_type}</div>
            </div>
          </div>

          {/* Fees - Essential Information */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <div className="text-xs text-gray-500 mb-1">Joining Fee</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {card.joining_fee === 0 ? 'Free' : `₹${card.joining_fee.toLocaleString()}`}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <div className="text-xs text-gray-500 mb-1">Annual Fee</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {card.annual_fee === 0 ? 'Free' : `₹${card.annual_fee.toLocaleString()}`}
              </div>
            </div>
          </div>

          {/* Key Benefits - Only Top 2 */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Key Benefits</div>
            {(card.special_perks || card.perks || []).slice(0, 2).map((perk, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{perk}</span>
              </div>
            ))}
            {(card.special_perks || card.perks || []).length > 2 && (
              <div className="text-xs text-gray-500">
                +{(card.special_perks || card.perks || []).length - 2} more benefits
              </div>
            )}
          </div>

          {/* Eligibility - Minimal */}
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-600 dark:text-gray-400 font-medium">Min Income:</span>
                <div className="text-gray-800 dark:text-gray-200">₹{(card.min_income / 100000).toFixed(1)}L/mo</div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400 font-medium">Credit Score:</span>
                <div className="text-gray-800 dark:text-gray-200">{card.credit_score}+</div>
              </div>
            </div>
          </div>

          {/* AI Matching Reasons - Only if provided and featured */}
          {featured && reasons.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3">
              <div className="flex items-center space-x-2 mb-2">
                <span className="material-symbols-outlined text-gray-600 text-sm">psychology</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Why this matches you</span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {reasons[0]}
              </div>
            </div>
          )}

          {/* Action Buttons - Professional */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium rounded-lg transition-all duration-200 text-sm"
            >
              Know More
            </button>
            <a
              href={card.apply_link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-primary hover:bg-primary-700 text-white font-medium rounded-lg transition-all duration-200 text-center text-sm"
            >
              Apply Now
            </a>
          </div>
        </div>

        {/* Featured Badge - Minimal */}
        {featured && (
          <div className="absolute -top-2 -right-2">
            <div className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 px-3 py-1 rounded-full text-xs font-medium shadow">
              Top Pick
            </div>
          </div>
        )}
      </div>

      {/* Card Details Modal */}
      {showModal && (
        <CardDetailsModal
          card={card}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
