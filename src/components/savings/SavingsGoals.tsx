import React, { useMemo } from 'react';
import { Target, Calendar, TrendingUp, Plus, Edit2, Trash2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/currency';
import { format, differenceInDays, differenceInMonths } from 'date-fns';

const SavingsGoals: React.FC = () => {
  const { savingsGoals, deleteSavingsGoal } = useFinance();
  const { user } = useAuth();

  const goalsAnalysis = useMemo(() => {
    return savingsGoals.map(goal => {
      const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
      const remaining = goal.targetAmount - goal.currentAmount;
      const daysLeft = differenceInDays(new Date(goal.targetDate), new Date());
      const monthsLeft = differenceInMonths(new Date(goal.targetDate), new Date());
      
      const monthlyRequired = monthsLeft > 0 ? remaining / monthsLeft : remaining;
      
      return {
        ...goal,
        progress,
        remaining,
        daysLeft,
        monthsLeft,
        monthlyRequired,
        status: progress >= 100 ? 'completed' : 
                daysLeft < 0 ? 'overdue' :
                daysLeft < 30 ? 'urgent' : 'on-track'
      };
    });
  }, [savingsGoals]);

  const userCurrency = user?.currency || 'USD';

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emergency': return 'bg-red-500';
      case 'short-term': return 'bg-blue-500';
      case 'medium-term': return 'bg-purple-500';
      case 'long-term': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this savings goal?')) {
      deleteSavingsGoal(id);
    }
  };

  const totalSavings = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTargets = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const overallProgress = totalTargets > 0 ? (totalSavings / totalTargets) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Savings Goals</h1>
          <p className="text-gray-600 mt-2">Track your progress towards financial milestones</p>
        </div>
        <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-[1.02] flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Saved</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSavings, userCurrency)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Targets</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalTargets, userCurrency)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Overall Progress</p>
              <p className="text-2xl font-bold text-gray-900">{overallProgress.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-6">
        {goalsAnalysis.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 text-center">
            <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Savings Goals Yet</h3>
            <p className="text-gray-600 mb-6">Start building your financial future by setting your first savings goal</p>
            <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-[1.02] flex items-center space-x-2 mx-auto">
              <Plus className="h-5 w-5" />
              <span>Create Your First Goal</span>
            </button>
          </div>
        ) : (
          goalsAnalysis.map((goal) => (
            <div key={goal.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl ${getCategoryColor(goal.category)} flex items-center justify-center`}>
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{goal.name}</h3>
                    <p className="text-gray-600 mt-1">{goal.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(goal.priority)}`}>
                        {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} Priority
                      </span>
                      <span className="text-xs text-gray-500">
                        {goal.category.charAt(0).toUpperCase() + goal.category.slice(1).replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(goal.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Current Amount</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(goal.currentAmount, userCurrency)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Target Amount</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(goal.targetAmount, userCurrency)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Remaining</p>
                  <p className="text-lg font-bold text-blue-600">{formatCurrency(goal.remaining, userCurrency)}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-bold text-gray-900">{goal.progress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      goal.status === 'completed' ? 'bg-green-500' :
                      goal.status === 'overdue' ? 'bg-red-500' :
                      goal.status === 'urgent' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(goal.progress, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Target Date:</span>
                  <span className="font-medium">{format(new Date(goal.targetDate), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Days Left:</span>
                  <span className={`font-medium ${
                    goal.daysLeft < 0 ? 'text-red-600' :
                    goal.daysLeft < 30 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {goal.daysLeft < 0 ? `${Math.abs(goal.daysLeft)} days overdue` : `${goal.daysLeft} days`}
                  </span>
                </div>
                {goal.monthsLeft > 0 && (
                  <div className="flex items-center justify-between md:col-span-2">
                    <span className="text-gray-600">Monthly Required:</span>
                    <span className="font-medium text-blue-600">{formatCurrency(goal.monthlyRequired, userCurrency)}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SavingsGoals;