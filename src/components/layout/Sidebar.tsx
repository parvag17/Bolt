import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  PieChart, 
  Target, 
  Settings, 
  LogOut,
  TrendingUp,
  Wallet,
  DollarSign,
  BarChart3,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Wallet },
    { id: 'add-transaction', label: 'Add Transaction', icon: PlusCircle },
    { id: 'budgets', label: 'Budget Overview', icon: TrendingUp },
    { id: 'create-budget', label: 'Create Budget', icon: Plus },
    { id: 'goals', label: 'Savings Goals', icon: Target },
    { id: 'create-goal', label: 'Create Goal', icon: Plus },
    { id: 'income', label: 'Income Sources', icon: DollarSign },
    { id: 'reports', label: 'Progress Reports', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="bg-white shadow-lg h-screen w-64 fixed left-0 top-0 z-10 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Moneyset</h1>
            <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  activeView === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;