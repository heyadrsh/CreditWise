import { useState, useEffect } from 'react';

interface SpendingProfile {
  dining: number;
  groceries: number;
  fuel: number;
  travel: number;
  others: number;
}

interface SpendingSimulatorProps {
  onConfirm?: (profile: SpendingProfile) => void;
}

const categories = [
  { key: 'dining', label: 'Dining & Food', icon: 'restaurant', rate: 5 },
  { key: 'groceries', label: 'Groceries', icon: 'shopping_cart', rate: 2 },
  { key: 'fuel', label: 'Fuel', icon: 'local_gas_station', rate: 1.5 },
  { key: 'travel', label: 'Travel', icon: 'flight', rate: 3 },
  { key: 'others', label: 'Others', icon: 'more_horiz', rate: 1 }
];

export default function SpendingSimulatorComponent({ onConfirm }: SpendingSimulatorProps) {
  const [spending, setSpending] = useState<SpendingProfile>({
    dining: 8000,
    groceries: 12000,
    fuel: 5000,
    travel: 3000,
    others: 7000
  });

  const [animatedTotal, setAnimatedTotal] = useState(0);

  const totalSpending = Object.values(spending).reduce((sum, value) => sum + value, 0);
  const annualSpending = totalSpending * 12;

  useEffect(() => {
    // Animate total
    const duration = 500;
    const steps = 30;
    const increment = totalSpending / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= totalSpending) {
        setAnimatedTotal(totalSpending);
        clearInterval(timer);
      } else {
        setAnimatedTotal(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [totalSpending]);

  const handleSliderChange = (category: keyof SpendingProfile, value: number) => {
    setSpending(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const calculateRewards = () => {
    return categories.reduce((total, category) => {
      const categorySpending = spending[category.key as keyof SpendingProfile];
      const monthlyReward = (categorySpending * category.rate) / 100;
      return total + (monthlyReward * 12);
    }, 0);
  };

  const handleConfirm = () => {
    onConfirm?.(spending);
  };

  return (
    <div className="bg-white rounded-lg p-6 card-shadow">
      <h3 className="text-xl font-semibold mb-6">Monthly Spending Simulator</h3>
      
      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-primary">{category.icon}</span>
                <span className="font-medium">{category.label}</span>
                <span className="text-sm text-text-secondary">({category.rate}% rewards)</span>
              </div>
              <span className="font-semibold">₹{spending[category.key as keyof SpendingProfile].toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="50000"
              step="500"
              value={spending[category.key as keyof SpendingProfile]}
              onChange={(e) => handleSliderChange(category.key as keyof SpendingProfile, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 p-4 bg-surface-subtle rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-text-secondary">Monthly Total</p>
            <p className="text-2xl font-bold text-primary">₹{animatedTotal.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-text-secondary">Annual Spending</p>
            <p className="text-2xl font-bold text-navy">₹{annualSpending.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-text-secondary">Estimated Annual Rewards</p>
          <p className="text-xl font-bold text-accent-green">₹{Math.floor(calculateRewards()).toLocaleString()}</p>
        </div>
      </div>

      {onConfirm && (
        <button
          onClick={handleConfirm}
          className="w-full mt-6 px-6 py-3 bg-primary hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
        >
          Confirm Spending Profile
        </button>
      )}
    </div>
  );
}

