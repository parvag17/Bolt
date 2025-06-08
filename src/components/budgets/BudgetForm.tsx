import React, { useState } from 'react';
import { Plus, Target, DollarSign, Tag, Calendar } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

const BudgetForm: React.FC = () => {
  const { addBudget, categories } = useFinance();
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [type, setType] = useState<'fixed' | 'variable' | 'debt'>('variable');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const expenseCategories = categories.filter(c => c.type === 'expense');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount) return;

    setIsSubmitting(true);
    
    addBudget({
      category,
      amount: parseFloat(amount),
      period,
      type
    });

    // Reset form
    setCategory('');
    setAmount('');
    setPeriod('monthly');
    setType('variable');
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Budget</h1>
        <p className="text-gray-600 mt-2">Set spending limits for your expense categories</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Budget Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Budget Type
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setType('fixed')}
                className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                  type === 'fixed'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">Fixed</div>
                <div className="text-sm">Rent, utilities, insurance</div>
              </button>
              <button
                type="button"
                onClick={() => setType('variable')}
                className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                  type === 'variable'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">Variable</div>
                <div className="text-sm">Groceries, entertainment</div>
              </button>
              <button
                type="button"
                onClick={() => setType('debt')}
                className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                  type === 'debt'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">Debt</div>
                <div className="text-sm">Credit cards, loans</div>
              </button>
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
                required
              >
                <option value="">Select a category</option>
                {expenseCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Budget Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Period */}
          <div>
            <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-2">
              Budget Period
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                id="period"
                value={period}
                onChange={(e) => setPeriod(e.target.value as 'monthly' | 'yearly')}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
                required
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>{isSubmitting ? 'Creating...' : 'Create Budget'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default BudgetForm;