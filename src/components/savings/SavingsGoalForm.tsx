import React, { useState } from 'react';
import { Plus, Target, DollarSign, Calendar, FileText, Flag } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

const SavingsGoalForm: React.FC = () => {
  const { addSavingsGoal } = useFinance();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [targetDate, setTargetDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState<'emergency' | 'short-term' | 'medium-term' | 'long-term'>('short-term');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || !targetDate) return;

    setIsSubmitting(true);
    
    addSavingsGoal({
      name,
      description,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount),
      targetDate: new Date(targetDate),
      priority,
      category
    });

    // Reset form
    setName('');
    setDescription('');
    setTargetAmount('');
    setCurrentAmount('0');
    setTargetDate('');
    setPriority('medium');
    setCategory('short-term');
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Savings Goal</h1>
        <p className="text-gray-600 mt-2">Set a new financial milestone to work towards</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Goal Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Goal Category
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                type="button"
                onClick={() => setCategory('emergency')}
                className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                  category === 'emergency'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">Emergency</div>
                <div className="text-sm">3-6 months expenses</div>
              </button>
              <button
                type="button"
                onClick={() => setCategory('short-term')}
                className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                  category === 'short-term'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">Short-term</div>
                <div className="text-sm">3-12 months</div>
              </button>
              <button
                type="button"
                onClick={() => setCategory('medium-term')}
                className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                  category === 'medium-term'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">Medium-term</div>
                <div className="text-sm">1-5 years</div>
              </button>
              <button
                type="button"
                onClick={() => setCategory('long-term')}
                className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                  category === 'long-term'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">Long-term</div>
                <div className="text-sm">5+ years</div>
              </button>
            </div>
          </div>

          {/* Goal Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Goal Name
            </label>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., Emergency Fund, Vacation, New Car"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Describe your savings goal..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target Amount */}
            <div>
              <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 mb-2">
                Target Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="targetAmount"
                  type="number"
                  step="0.01"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Current Amount */}
            <div>
              <label htmlFor="currentAmount" className="block text-sm font-medium text-gray-700 mb-2">
                Current Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="currentAmount"
                  type="number"
                  step="0.01"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target Date */}
            <div>
              <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 mb-2">
                Target Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="targetDate"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level
              </label>
              <div className="relative">
                <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
                  required
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>{isSubmitting ? 'Creating...' : 'Create Savings Goal'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SavingsGoalForm;