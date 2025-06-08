import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/currency';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const RecentTransactions: React.FC = () => {
  const { transactions } = useFinance();
  const { user } = useAuth();

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const userCurrency = user?.currency || 'USD';

  if (recentTransactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No transactions yet</p>
        <p className="text-sm mt-1">Add your first transaction to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recentTransactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            transaction.type === 'income' 
              ? 'bg-green-100 text-green-600' 
              : 'bg-red-100 text-red-600'
          }`}>
            {transaction.type === 'income' ? (
              <ArrowUpRight className="h-5 w-5" />
            ) : (
              <ArrowDownRight className="h-5 w-5" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {transaction.description || transaction.category}
            </p>
            <p className="text-xs text-gray-500">
              {format(new Date(transaction.date), 'MMM dd, yyyy')}
            </p>
          </div>
          
          <div className="text-right">
            <p className={`text-sm font-semibold ${
              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, userCurrency)}
            </p>
            <p className="text-xs text-gray-500">{transaction.category}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentTransactions;