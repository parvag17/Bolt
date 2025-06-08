import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpRight, ArrowDownRight, Edit2, Trash2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/currency';
import { format } from 'date-fns';

const TransactionList: React.FC = () => {
  const { transactions, deleteTransaction, categories } = useFinance();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(transaction => {
        const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || transaction.type === filterType;
        const matchesCategory = !filterCategory || transaction.category === filterCategory;
        
        return matchesSearch && matchesType && matchesCategory;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm, filterType, filterCategory]);

  const userCurrency = user?.currency || 'USD';

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <p className="text-gray-600 mt-2">View and manage all your transactions</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No transactions found</p>
            <p className="text-sm mt-1">Try adjusting your filters or add a new transaction</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="h-6 w-6" />
                      ) : (
                        <ArrowDownRight className="h-6 w-6" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {transaction.description || transaction.category}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>{transaction.category}</span>
                        <span>•</span>
                        <span>{format(new Date(transaction.date), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className={`text-xl font-bold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, userCurrency)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(transaction.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;