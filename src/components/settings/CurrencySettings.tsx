import React, { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SUPPORTED_CURRENCIES, formatCurrency } from '../../utils/currency';

const CurrencySettings: React.FC = () => {
  const { user, updateUserCurrency } = useAuth();
  const [selectedCurrency, setSelectedCurrency] = useState(user?.currency || 'USD');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleCurrencyChange = async (currencyCode: string) => {
    setIsUpdating(true);
    setSelectedCurrency(currencyCode);
    updateUserCurrency(currencyCode);
    
    // Simulate a brief loading state
    setTimeout(() => {
      setIsUpdating(false);
    }, 500);
  };

  const currentCurrency = SUPPORTED_CURRENCIES.find(c => c.code === selectedCurrency);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Currency Settings</h3>
        <p className="text-gray-600">Choose your preferred currency for displaying amounts</p>
      </div>

      {/* Current Currency Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-blue-900">Current Currency</p>
            <p className="text-blue-700">
              {currentCurrency?.symbol} {currentCurrency?.name} ({currentCurrency?.code})
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Example: {formatCurrency(1234.56, selectedCurrency)}
            </p>
          </div>
        </div>
      </div>

      {/* Currency Selection Grid */}
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Select Currency</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
          {SUPPORTED_CURRENCIES.map((currency) => (
            <button
              key={currency.code}
              onClick={() => handleCurrencyChange(currency.code)}
              disabled={isUpdating}
              className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                selectedCurrency === currency.code
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-lg">{currency.symbol}</span>
                    <span className="font-medium">{currency.code}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{currency.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatCurrency(100, currency.code)}
                  </p>
                </div>
                {selectedCurrency === currency.code && (
                  <Check className="h-5 w-5 text-blue-500" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {isUpdating && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Updating currency settings...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySettings;