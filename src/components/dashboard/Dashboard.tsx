import React, { useMemo } from 'react';
import { DollarSign, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/currency';
import StatsCard from './StatsCard';
import ExpenseChart from './ExpenseChart';
import IncomeChart from './IncomeChart';
import MonthlyTrendChart from './MonthlyTrendChart';
import RecentTransactions from './RecentTransactions';
import { format, subMonths, isWithinInterval } from 'date-fns';

const Dashboard: React.FC = () => {
  const { transactions } = useFinance();
  const { user } = useAuth();

  const stats = useMemo(() => {
    const now = new Date();
    const lastMonth = subMonths(now, 1);
    const currentMonth = { start: new Date(now.getFullYear(), now.getMonth(), 1), end: now };
    const previousMonth = { 
      start: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1), 
      end: new Date(now.getFullYear(), now.getMonth(), 0) 
    };

    const currentMonthTransactions = transactions.filter(t => 
      isWithinInterval(new Date(t.date), currentMonth)
    );
    const previousMonthTransactions = transactions.filter(t => 
      isWithinInterval(new Date(t.date), previousMonth)
    );

    const currentIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const currentExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const previousIncome = previousMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const previousExpenses = previousMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = transactions.reduce((sum, t) => 
      sum + (t.type === 'income' ? t.amount : -t.amount), 0
    );

    const incomeChange = previousIncome > 0 
      ? ((currentIncome - previousIncome) / previousIncome * 100).toFixed(1)
      : '0';
    
    const expenseChange = previousExpenses > 0 
      ? ((currentExpenses - previousExpenses) / previousExpenses * 100).toFixed(1)
      : '0';

    return {
      totalBalance,
      currentIncome,
      currentExpenses,
      incomeChange: parseFloat(incomeChange),
      expenseChange: parseFloat(expenseChange),
      savings: currentIncome - currentExpenses
    };
  }, [transactions]);

  const userCurrency = user?.currency || 'USD';

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Your financial overview for {format(new Date(), 'MMMM yyyy')}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Balance"
          value={formatCurrency(stats.totalBalance, userCurrency)}
          icon={DollarSign}
          gradient="bg-gradient-to-br from-blue-500 to-purple-600"
        />
        <StatsCard
          title="Monthly Income"
          value={formatCurrency(stats.currentIncome, userCurrency)}
          change={`${stats.incomeChange >= 0 ? '+' : ''}${stats.incomeChange}% from last month`}
          changeType={stats.incomeChange >= 0 ? 'positive' : 'negative'}
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-green-500 to-emerald-600"
        />
        <StatsCard
          title="Monthly Expenses"
          value={formatCurrency(stats.currentExpenses, userCurrency)}
          change={`${stats.expenseChange >= 0 ? '+' : ''}${stats.expenseChange}% from last month`}
          changeType={stats.expenseChange <= 0 ? 'positive' : 'negative'}
          icon={TrendingDown}
          gradient="bg-gradient-to-br from-red-500 to-pink-600"
        />
        <StatsCard
          title="Monthly Savings"
          value={formatCurrency(stats.savings, userCurrency)}
          icon={PiggyBank}
          gradient="bg-gradient-to-br from-purple-500 to-indigo-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
          <ExpenseChart />
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Income Sources</h3>
          <IncomeChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          <MonthlyTrendChart />
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;