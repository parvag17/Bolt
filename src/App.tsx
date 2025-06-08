import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import AuthPage from './components/auth/AuthPage';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import AddTransactionForm from './components/transactions/AddTransactionForm';
import TransactionList from './components/transactions/TransactionList';
import BudgetOverview from './components/budgets/BudgetOverview';
import BudgetForm from './components/budgets/BudgetForm';
import SavingsGoals from './components/savings/SavingsGoals';
import SavingsGoalForm from './components/savings/SavingsGoalForm';
import IncomeSourceManager from './components/income/IncomeSourceManager';
import ProgressReports from './components/reports/ProgressReports';
import SettingsPage from './components/settings/SettingsPage';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto animate-pulse">
            <div className="w-8 h-8 bg-white rounded-lg"></div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <TransactionList />;
      case 'add-transaction':
        return <AddTransactionForm />;
      case 'budgets':
        return <BudgetOverview />;
      case 'create-budget':
        return <BudgetForm />;
      case 'goals':
        return <SavingsGoals />;
      case 'create-goal':
        return <SavingsGoalForm />;
      case 'income':
        return <IncomeSourceManager />;
      case 'reports':
        return <ProgressReports />;
      case 'analytics':
        return <Dashboard />; // For now, analytics is same as dashboard
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="ml-64 p-8">
        {renderActiveView()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <AppContent />
      </FinanceProvider>
    </AuthProvider>
  );
}

export default App;