import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Category, Budget, SavingsGoal, IncomeSource, BudgetAlert } from '../types';
import { useAuth } from './AuthContext';

interface FinanceContextType {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  incomeSources: IncomeSource[];
  budgetAlerts: BudgetAlert[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id' | 'userId' | 'createdAt'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'userId' | 'createdAt'>) => void;
  updateSavingsGoal: (id: string, goal: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
  addIncomeSource: (source: Omit<IncomeSource, 'id' | 'userId' | 'createdAt'>) => void;
  updateIncomeSource: (id: string, source: Partial<IncomeSource>) => void;
  deleteIncomeSource: (id: string) => void;
  addBudgetAlert: (alert: Omit<BudgetAlert, 'id' | 'userId' | 'createdAt'>) => void;
  markAlertAsRead: (id: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

const defaultCategories: Category[] = [
  { id: '1', name: 'Food & Dining', type: 'expense', color: '#F59E0B', icon: 'UtensilsCrossed' },
  { id: '2', name: 'Transportation', type: 'expense', color: '#3B82F6', icon: 'Car' },
  { id: '3', name: 'Utilities', type: 'expense', color: '#EF4444', icon: 'Zap' },
  { id: '4', name: 'Entertainment', type: 'expense', color: '#8B5CF6', icon: 'Music' },
  { id: '5', name: 'Healthcare', type: 'expense', color: '#EC4899', icon: 'Heart' },
  { id: '6', name: 'Shopping', type: 'expense', color: '#10B981', icon: 'ShoppingBag' },
  { id: '7', name: 'Housing', type: 'expense', color: '#6B7280', icon: 'Home' },
  { id: '8', name: 'Insurance', type: 'expense', color: '#14B8A6', icon: 'Shield' },
  { id: '9', name: 'Salary', type: 'income', color: '#059669', icon: 'DollarSign' },
  { id: '10', name: 'Freelance', type: 'income', color: '#7C3AED', icon: 'Briefcase' },
  { id: '11', name: 'Investments', type: 'income', color: '#DC2626', icon: 'TrendingUp' },
];

interface FinanceProviderProps {
  children: ReactNode;
}

export const FinanceProvider: React.FC<FinanceProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [budgetAlerts, setBudgetAlerts] = useState<BudgetAlert[]>([]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = () => {
    if (!user) return;

    const savedTransactions = localStorage.getItem(`transactions_${user.id}`);
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions).map((t: any) => ({
        ...t,
        date: new Date(t.date),
        createdAt: new Date(t.createdAt)
      })));
    }

    const savedCategories = localStorage.getItem(`categories_${user.id}`);
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }

    const savedBudgets = localStorage.getItem(`budgets_${user.id}`);
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets).map((b: any) => ({
        ...b,
        createdAt: new Date(b.createdAt)
      })));
    }

    const savedGoals = localStorage.getItem(`savingsGoals_${user.id}`);
    if (savedGoals) {
      setSavingsGoals(JSON.parse(savedGoals).map((g: any) => ({
        ...g,
        targetDate: new Date(g.targetDate),
        createdAt: new Date(g.createdAt)
      })));
    }

    const savedIncomeSources = localStorage.getItem(`incomeSources_${user.id}`);
    if (savedIncomeSources) {
      setIncomeSources(JSON.parse(savedIncomeSources).map((s: any) => ({
        ...s,
        createdAt: new Date(s.createdAt)
      })));
    }

    const savedAlerts = localStorage.getItem(`budgetAlerts_${user.id}`);
    if (savedAlerts) {
      setBudgetAlerts(JSON.parse(savedAlerts).map((a: any) => ({
        ...a,
        createdAt: new Date(a.createdAt)
      })));
    }
  };

  const saveTransactions = (newTransactions: Transaction[]) => {
    if (!user) return;
    localStorage.setItem(`transactions_${user.id}`, JSON.stringify(newTransactions));
    setTransactions(newTransactions);
  };

  const saveCategories = (newCategories: Category[]) => {
    if (!user) return;
    localStorage.setItem(`categories_${user.id}`, JSON.stringify(newCategories));
    setCategories(newCategories);
  };

  const saveBudgets = (newBudgets: Budget[]) => {
    if (!user) return;
    localStorage.setItem(`budgets_${user.id}`, JSON.stringify(newBudgets));
    setBudgets(newBudgets);
  };

  const saveSavingsGoals = (newGoals: SavingsGoal[]) => {
    if (!user) return;
    localStorage.setItem(`savingsGoals_${user.id}`, JSON.stringify(newGoals));
    setSavingsGoals(newGoals);
  };

  const saveIncomeSources = (newSources: IncomeSource[]) => {
    if (!user) return;
    localStorage.setItem(`incomeSources_${user.id}`, JSON.stringify(newSources));
    setIncomeSources(newSources);
  };

  const saveBudgetAlerts = (newAlerts: BudgetAlert[]) => {
    if (!user) return;
    localStorage.setItem(`budgetAlerts_${user.id}`, JSON.stringify(newAlerts));
    setBudgetAlerts(newAlerts);
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      userId: user.id,
      createdAt: new Date()
    };
    saveTransactions([...transactions, newTransaction]);
  };

  const updateTransaction = (id: string, updatedTransaction: Partial<Transaction>) => {
    const updated = transactions.map(t => 
      t.id === id ? { ...t, ...updatedTransaction } : t
    );
    saveTransactions(updated);
  };

  const deleteTransaction = (id: string) => {
    const filtered = transactions.filter(t => t.id !== id);
    saveTransactions(filtered);
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID()
    };
    saveCategories([...categories, newCategory]);
  };

  const updateCategory = (id: string, updatedCategory: Partial<Category>) => {
    const updated = categories.map(c => 
      c.id === id ? { ...c, ...updatedCategory } : c
    );
    saveCategories(updated);
  };

  const deleteCategory = (id: string) => {
    const filtered = categories.filter(c => c.id !== id);
    saveCategories(filtered);
  };

  const addBudget = (budget: Omit<Budget, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    const newBudget: Budget = {
      ...budget,
      id: crypto.randomUUID(),
      userId: user.id,
      createdAt: new Date()
    };
    saveBudgets([...budgets, newBudget]);
  };

  const updateBudget = (id: string, updatedBudget: Partial<Budget>) => {
    const updated = budgets.map(b => 
      b.id === id ? { ...b, ...updatedBudget } : b
    );
    saveBudgets(updated);
  };

  const deleteBudget = (id: string) => {
    const filtered = budgets.filter(b => b.id !== id);
    saveBudgets(filtered);
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    const newGoal: SavingsGoal = {
      ...goal,
      id: crypto.randomUUID(),
      userId: user.id,
      createdAt: new Date()
    };
    saveSavingsGoals([...savingsGoals, newGoal]);
  };

  const updateSavingsGoal = (id: string, updatedGoal: Partial<SavingsGoal>) => {
    const updated = savingsGoals.map(g => 
      g.id === id ? { ...g, ...updatedGoal } : g
    );
    saveSavingsGoals(updated);
  };

  const deleteSavingsGoal = (id: string) => {
    const filtered = savingsGoals.filter(g => g.id !== id);
    saveSavingsGoals(filtered);
  };

  const addIncomeSource = (source: Omit<IncomeSource, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    const newSource: IncomeSource = {
      ...source,
      id: crypto.randomUUID(),
      userId: user.id,
      createdAt: new Date()
    };
    saveIncomeSources([...incomeSources, newSource]);
  };

  const updateIncomeSource = (id: string, updatedSource: Partial<IncomeSource>) => {
    const updated = incomeSources.map(s => 
      s.id === id ? { ...s, ...updatedSource } : s
    );
    saveIncomeSources(updated);
  };

  const deleteIncomeSource = (id: string) => {
    const filtered = incomeSources.filter(s => s.id !== id);
    saveIncomeSources(filtered);
  };

  const addBudgetAlert = (alert: Omit<BudgetAlert, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    const newAlert: BudgetAlert = {
      ...alert,
      id: crypto.randomUUID(),
      userId: user.id,
      createdAt: new Date()
    };
    saveBudgetAlerts([...budgetAlerts, newAlert]);
  };

  const markAlertAsRead = (id: string) => {
    const updated = budgetAlerts.map(a => 
      a.id === id ? { ...a, isRead: true } : a
    );
    saveBudgetAlerts(updated);
  };

  return (
    <FinanceContext.Provider value={{
      transactions,
      categories,
      budgets,
      savingsGoals,
      incomeSources,
      budgetAlerts,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addCategory,
      updateCategory,
      deleteCategory,
      addBudget,
      updateBudget,
      deleteBudget,
      addSavingsGoal,
      updateSavingsGoal,
      deleteSavingsGoal,
      addIncomeSource,
      updateIncomeSource,
      deleteIncomeSource,
      addBudgetAlert,
      markAlertAsRead
    }}>
      {children}
    </FinanceContext.Provider>
  );
};