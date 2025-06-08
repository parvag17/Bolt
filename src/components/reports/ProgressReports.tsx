import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/currency';
import { format, startOfMonth, endOfMonth, subMonths, differenceInDays } from 'date-fns';

const ProgressReports: React.FC = () => {
  const { transactions, budgets, savingsGoals, incomeSources } = useFinance();
  const { user } = useAuth();

  const userCurrency = user?.currency || 'USD';

  const monthlyReport = useMemo(() => {
    const now = new Date();
    const currentMonth = { start: startOfMonth(now), end: endOfMonth(now) };
    const lastMonth = { 
      start: startOfMonth(subMonths(now, 1)), 
      end: endOfMonth(subMonths(now, 1)) 
    };

    const getCurrentMonthData = (period: { start: Date; end: Date }) => {
      const monthTransactions = transactions.filter(t => 
        new Date(t.date) >= period.start && new Date(t.date) <= period.end
      );
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return { income, expenses, savings: income - expenses };
    };

    const current = getCurrentMonthData(currentMonth);
    const previous = getCurrentMonthData(lastMonth);

    const incomeChange = previous.income > 0 ? ((current.income - previous.income) / previous.income) * 100 : 0;
    const expenseChange = previous.expenses > 0 ? ((current.expenses - previous.expenses) / previous.expenses) * 100 : 0;
    const savingsChange = previous.savings !== 0 ? ((current.savings - previous.savings) / Math.abs(previous.savings)) * 100 : 0;

    // Budget analysis
    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const budgetUtilization = totalBudget > 0 ? (current.expenses / totalBudget) * 100 : 0;

    const categoryPerformance = budgets.map(budget => {
      const spent = transactions
        .filter(t => 
          t.type === 'expense' && 
          t.category === budget.category &&
          new Date(t.date) >= currentMonth.start && 
          new Date(t.date) <= currentMonth.end
        )
        .reduce((sum, t) => sum + t.amount, 0);
      
      const utilization = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
      
      return {
        category: budget.category,
        budget: budget.amount,
        spent,
        utilization,
        variance: spent - budget.amount,
        status: utilization > 100 ? 'over' : utilization > 80 ? 'warning' : 'good'
      };
    });

    return {
      current,
      previous,
      changes: { income: incomeChange, expenses: expenseChange, savings: savingsChange },
      budget: { total: totalBudget, utilization: budgetUtilization, categories: categoryPerformance }
    };
  }, [transactions, budgets]);

  const savingsProgress = useMemo(() => {
    return savingsGoals.map(goal => {
      const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
      const daysLeft = differenceInDays(new Date(goal.targetDate), new Date());
      const monthsLeft = Math.max(0, Math.ceil(daysLeft / 30));
      const remaining = goal.targetAmount - goal.currentAmount;
      const monthlyRequired = monthsLeft > 0 ? remaining / monthsLeft : remaining;
      
      return {
        ...goal,
        progress,
        daysLeft,
        monthsLeft,
        remaining,
        monthlyRequired,
        status: progress >= 100 ? 'completed' : 
                daysLeft < 0 ? 'overdue' :
                daysLeft < 30 ? 'urgent' : 'on-track'
      };
    });
  }, [savingsGoals]);

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <div className="h-4 w-4" />;
  };

  const getChangeColor = (change: number, isExpense = false) => {
    if (isExpense) {
      return change > 0 ? 'text-red-600' : 'text-green-600';
    }
    return change > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Progress Reports</h1>
        <p className="text-gray-600 mt-2">Track your financial progress and performance</p>
      </div>

      {/* Monthly Summary */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Monthly Summary - {format(new Date(), 'MMMM yyyy')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Income</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(monthlyReport.current.income, userCurrency)}</p>
            <div className="flex items-center justify-center space-x-1 mt-2">
              {getChangeIcon(monthlyReport.changes.income)}
              <span className={`text-sm font-medium ${getChangeColor(monthlyReport.changes.income)}`}>
                {monthlyReport.changes.income >= 0 ? '+' : ''}{monthlyReport.changes.income.toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Expenses</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(monthlyReport.current.expenses, userCurrency)}</p>
            <div className="flex items-center justify-center space-x-1 mt-2">
              {getChangeIcon(monthlyReport.changes.expenses)}
              <span className={`text-sm font-medium ${getChangeColor(monthlyReport.changes.expenses, true)}`}>
                {monthlyReport.changes.expenses >= 0 ? '+' : ''}{monthlyReport.changes.expenses.toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Net Savings</p>
            <p className={`text-2xl font-bold ${monthlyReport.current.savings >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(monthlyReport.current.savings, userCurrency)}
            </p>
            <div className="flex items-center justify-center space-x-1 mt-2">
              {getChangeIcon(monthlyReport.changes.savings)}
              <span className={`text-sm font-medium ${getChangeColor(monthlyReport.changes.savings)}`}>
                {monthlyReport.changes.savings >= 0 ? '+' : ''}{monthlyReport.changes.savings.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Budget Performance</h4>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
              monthlyReport.budget.utilization <= 80 ? 'bg-green-100 text-green-700' :
              monthlyReport.budget.utilization <= 100 ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {monthlyReport.budget.utilization.toFixed(1)}% of budget used
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                monthlyReport.budget.utilization <= 80 ? 'bg-green-500' :
                monthlyReport.budget.utilization <= 100 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${Math.min(monthlyReport.budget.utilization, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Budget Category Performance */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Budget Category Performance</h3>
        <div className="space-y-4">
          {monthlyReport.budget.categories.map((category, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  category.status === 'over' ? 'bg-red-500' :
                  category.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <span className="font-medium text-gray-900">{category.category}</span>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {formatCurrency(category.spent, userCurrency)} / {formatCurrency(category.budget, userCurrency)}
                  </p>
                  <p className="text-xs text-gray-500">{category.utilization.toFixed(1)}% used</p>
                </div>
                
                <div className={`text-right ${category.variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  <p className="text-sm font-medium">
                    {category.variance >= 0 ? '+' : ''}{formatCurrency(category.variance, userCurrency)}
                  </p>
                  <p className="text-xs">variance</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Savings Goals Progress */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Savings Goals Progress</h3>
        {savingsProgress.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No savings goals set</p>
          </div>
        ) : (
          <div className="space-y-6">
            {savingsProgress.map((goal) => (
              <div key={goal.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      goal.status === 'completed' ? 'bg-green-500' :
                      goal.status === 'overdue' ? 'bg-red-500' :
                      goal.status === 'urgent' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}>
                      {goal.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-white" />
                      ) : goal.status === 'overdue' || goal.status === 'urgent' ? (
                        <AlertTriangle className="h-5 w-5 text-white" />
                      ) : (
                        <Target className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{goal.name}</h4>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(goal.currentAmount, userCurrency)} / {formatCurrency(goal.targetAmount, userCurrency)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{goal.progress.toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">
                      {goal.daysLeft < 0 ? 'Overdue' : `${goal.daysLeft} days left`}
                    </p>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      goal.status === 'completed' ? 'bg-green-500' :
                      goal.status === 'overdue' ? 'bg-red-500' :
                      goal.status === 'urgent' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(goal.progress, 100)}%` }}
                  ></div>
                </div>
                
                {goal.monthsLeft > 0 && goal.status !== 'completed' && (
                  <p className="text-sm text-gray-600">
                    Need to save {formatCurrency(goal.monthlyRequired, userCurrency)}/month to reach goal
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressReports;