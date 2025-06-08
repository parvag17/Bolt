import React, { useMemo } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Target } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/currency';
import { format, startOfMonth, endOfMonth } from 'date-fns';

const BudgetOverview: React.FC = () => {
  const { budgets, transactions, incomeSources } = useFinance();
  const { user } = useAuth();

  const budgetAnalysis = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const monthlyTransactions = transactions.filter(t => 
      t.type === 'expense' && 
      new Date(t.date) >= monthStart && 
      new Date(t.date) <= monthEnd
    );

    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpent = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = incomeSources
      .filter(source => source.isActive)
      .reduce((sum, source) => {
        const monthlyAmount = source.frequency === 'monthly' ? source.amount :
                            source.frequency === 'weekly' ? source.amount * 4.33 :
                            source.frequency === 'bi-weekly' ? source.amount * 2.17 :
                            source.frequency === 'quarterly' ? source.amount / 3 :
                            source.amount / 12;
        return sum + monthlyAmount;
      }, 0);

    const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpent) / totalIncome) * 100 : 0;

    const categoryBreakdown = budgets.map(budget => {
      const spent = monthlyTransactions
        .filter(t => t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);
      
      const utilization = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
      
      return {
        ...budget,
        spent,
        remaining: budget.amount - spent,
        utilization,
        status: utilization > 100 ? 'over' : utilization > 80 ? 'warning' : 'good'
      };
    });

    return {
      totalBudget,
      totalSpent,
      totalIncome,
      remaining: totalBudget - totalSpent,
      budgetUtilization,
      savingsRate,
      categoryBreakdown
    };
  }, [budgets, transactions, incomeSources]);

  const userCurrency = user?.currency || 'USD';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Budget Overview</h1>
        <p className="text-gray-600 mt-2">Track your spending against your budget for {format(new Date(), 'MMMM yyyy')}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(budgetAnalysis.totalBudget, userCurrency)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(budgetAnalysis.totalSpent, userCurrency)}</p>
              <p className="text-sm text-gray-500 mt-1">
                {budgetAnalysis.budgetUtilization.toFixed(1)}% of budget
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Remaining</p>
              <p className={`text-2xl font-bold ${budgetAnalysis.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(budgetAnalysis.remaining, userCurrency)}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              budgetAnalysis.remaining >= 0 
                ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                : 'bg-gradient-to-br from-red-500 to-pink-600'
            }`}>
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Savings Rate</p>
              <p className={`text-2xl font-bold ${budgetAnalysis.savingsRate >= 20 ? 'text-green-600' : budgetAnalysis.savingsRate >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                {budgetAnalysis.savingsRate.toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Budget Progress by Category</h3>
        <div className="space-y-6">
          {budgetAnalysis.categoryBreakdown.map((item) => (
            <div key={item.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'over' ? 'bg-red-500' :
                    item.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <span className="font-medium text-gray-900">{item.category}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.status === 'over' ? 'bg-red-100 text-red-700' :
                    item.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {item.status === 'over' ? 'Over Budget' : 
                     item.status === 'warning' ? 'Near Limit' : 'On Track'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(item.spent, userCurrency)} / {formatCurrency(item.amount, userCurrency)}
                  </p>
                  <p className="text-sm text-gray-500">{item.utilization.toFixed(1)}% used</p>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    item.status === 'over' ? 'bg-red-500' :
                    item.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(item.utilization, 100)}%` }}
                ></div>
              </div>
              
              {item.status === 'over' && (
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Over budget by {formatCurrency(item.spent - item.amount, userCurrency)}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetOverview;