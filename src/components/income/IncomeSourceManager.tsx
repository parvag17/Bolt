import React, { useState } from 'react';
import { Plus, DollarSign, Briefcase, Calendar, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/currency';

const IncomeSourceManager: React.FC = () => {
  const { incomeSources, addIncomeSource, updateIncomeSource, deleteIncomeSource } = useFinance();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [type, setType] = useState<'salary' | 'freelance' | 'investment' | 'business' | 'other'>('salary');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userCurrency = user?.currency || 'USD';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    setIsSubmitting(true);
    
    addIncomeSource({
      name,
      amount: parseFloat(amount),
      frequency,
      type,
      isActive: true
    });

    // Reset form
    setName('');
    setAmount('');
    setFrequency('monthly');
    setType('salary');
    setIsSubmitting(false);
    setShowForm(false);
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    updateIncomeSource(id, { isActive: !isActive });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this income source?')) {
      deleteIncomeSource(id);
    }
  };

  const getMonthlyAmount = (amount: number, frequency: string) => {
    switch (frequency) {
      case 'weekly': return amount * 4.33;
      case 'bi-weekly': return amount * 2.17;
      case 'monthly': return amount;
      case 'quarterly': return amount / 3;
      case 'yearly': return amount / 12;
      default: return amount;
    }
  };

  const totalMonthlyIncome = incomeSources
    .filter(source => source.isActive)
    .reduce((sum, source) => sum + getMonthlyAmount(source.amount, source.frequency), 0);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Income Sources</h1>
          <p className="text-gray-600 mt-2">Manage your regular income streams</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-[1.02] flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Income Source</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Total Monthly Income</p>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(totalMonthlyIncome, userCurrency)}</p>
            <p className="text-sm text-gray-500 mt-1">{incomeSources.filter(s => s.isActive).length} active sources</p>
          </div>
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <DollarSign className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Add Income Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Add New Income Source</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Income Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Income Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'salary', label: 'Salary' },
                    { value: 'freelance', label: 'Freelance' },
                    { value: 'investment', label: 'Investment' },
                    { value: 'business', label: 'Business' },
                    { value: 'other', label: 'Other' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setType(option.value as any)}
                      className={`p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                        type === option.value
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency */}
              <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Frequency
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    id="frequency"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 appearance-none"
                    required
                  >
                    <option value="weekly">Weekly</option>
                    <option value="bi-weekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Income Source Name
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Main Job, Freelance Work"
                    required
                  />
                </div>
              </div>

              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Amount per {frequency.replace('-', ' ')}
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>{isSubmitting ? 'Adding...' : 'Add Income Source'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Income Sources List */}
      <div className="space-y-4">
        {incomeSources.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 text-center">
            <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Income Sources</h3>
            <p className="text-gray-600 mb-6">Add your income sources to track your total earnings</p>
          </div>
        ) : (
          incomeSources.map((source) => (
            <div key={source.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    source.isActive 
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                      : 'bg-gray-300'
                  }`}>
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{source.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span className="capitalize">{source.type}</span>
                      <span>•</span>
                      <span className="capitalize">{source.frequency.replace('-', ' ')}</span>
                      <span>•</span>
                      <span>{formatCurrency(getMonthlyAmount(source.amount, source.frequency), userCurrency)}/month</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(source.amount, userCurrency)}
                    </p>
                    <p className="text-sm text-gray-500">per {source.frequency.replace('-', ' ')}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleToggleActive(source.id, source.isActive)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        source.isActive 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {source.isActive ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(source.id)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IncomeSourceManager;