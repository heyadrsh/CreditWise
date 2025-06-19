import { useState } from 'react';
import { CreditCard } from '../lib/database.types';

interface CardDetailsModalProps {
  card: CreditCard;
  onClose: () => void;
}

export default function CardDetailsModal({ card, onClose }: CardDetailsModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const getNetworkColor = (network: string) => {
    switch (network.toLowerCase()) {
      case 'visa':
        return 'bg-times-blue-600 text-white';
      case 'mastercard':
        return 'bg-accent-red text-white';
      case 'rupay':
        return 'bg-accent-green text-white';
      case 'diners club':
        return 'bg-times-gray-700 text-white';
      case 'american express':
        return 'bg-times-blue-800 text-white';
      default:
        return 'bg-times-gray-600 text-white';
    }
  };

  const handleApply = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.open(card.apply_link, '_blank');
    }, 1000);
  };

  // Use enhanced schema fields with fallbacks
  const displayCategory = card.card_category || card.category;
  const displayRewardRate = card.base_reward_rate || card.reward_rate || 0;
  const displayPerks = card.special_perks || card.perks || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-background-card">
          {/* Header */}
          <div className="times-hero-bg px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getNetworkColor(card.network)}`}>
                  {card.network}
                </div>
                <div className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
                  {displayCategory}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{card.name}</h3>
                  <p className="text-primary-100">{card.issuer}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-primary-200 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-accent-blue/10">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="material-symbols-outlined text-accent-blue">percent</span>
                  <h4 className="font-semibold text-accent-blue">Reward Rate</h4>
                </div>
                <p className="text-2xl font-bold text-accent-blue">{displayRewardRate}%</p>
                <p className="text-sm text-accent-blue">{card.reward_type}</p>
              </div>

              <div className="bg-accent-green/10">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="material-symbols-outlined text-accent-green">payments</span>
                  <h4 className="font-semibold text-accent-green">Annual Fee</h4>
                </div>
                <p className="text-2xl font-bold text-accent-green">
                  {card.annual_fee === 0 ? 'Free' : `₹${card.annual_fee.toLocaleString()}`}
                </p>
                <p className="text-sm text-accent-green">
                  {card.joining_fee === 0 ? 'No joining fee' : `₹${card.joining_fee} joining fee`}
                </p>
              </div>
            </div>

            {/* Enhanced Schema: Fee Waiver Condition */}
            {card.fee_waiver_condition && (
              <div className="bg-accent-orange/10">
                <h4 className="font-semibold text-accent-orange">
                  <span className="material-symbols-outlined mr-2">money_off</span>
                  Fee Waiver Condition
                </h4>
                <p className="text-accent-orange">{card.fee_waiver_condition}</p>
              </div>
            )}

            {/* Enhanced Schema: Reward Details */}
            {card.reward_details && (
              <div className="bg-accent-blue/10">
                <h4 className="font-semibold text-accent-blue">
                  <span className="material-symbols-outlined mr-2">currency_exchange</span>
                  Detailed Reward Structure
                </h4>
                <p className="text-accent-blue">{card.reward_details}</p>
              </div>
            )}

            {/* Perks */}
            <div>
              <h4 className="font-semibold text-text-primary">
                <span className="material-symbols-outlined mr-2 text-accent-green">verified</span>
                Key Benefits
              </h4>
              <div className="space-y-2">
                {displayPerks.map((perk, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-background-secondary">
                    <span className="material-symbols-outlined text-accent-green">check_circle</span>
                    <span className="text-text-secondary">{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Best For */}
            <div>
              <h4 className="font-semibold text-text-primary">
                <span className="material-symbols-outlined mr-2 text-accent-blue">star</span>
                Best For
              </h4>
              <div className="flex flex-wrap gap-2">
                {card.best_for.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-accent-blue/10"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Eligibility */}
            <div>
              <h4 className="font-semibold text-text-primary">
                <span className="material-symbols-outlined mr-2 text-accent-orange">how_to_reg</span>
                Eligibility Criteria
              </h4>
              <div className="bg-accent-orange/10">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-accent-orange">Minimum Income</p>
                    <p className="text-accent-orange">₹{card.min_income.toLocaleString()}/month</p>
                  </div>
                  <div>
                    <p className="text-accent-orange">Credit Score</p>
                    <p className="text-accent-orange">{card.credit_score}+</p>
                  </div>
                  <div>
                    <p className="text-accent-orange">Age Range</p>
                    <p className="text-accent-orange">{card.age_min}-{card.age_max} years</p>
                  </div>
                  <div>
                    <p className="text-accent-orange">Application</p>
                    <p className="text-accent-orange">
                      {card.invite_only ? 'Invite Only' : 'Open Application'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-background-secondary">
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-background"
              >
                Close
              </button>
              <button
                onClick={handleApply}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-primary"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Redirecting...
                  </span>
                ) : (
                  'Apply Now'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

