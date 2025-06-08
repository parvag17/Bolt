export interface User {
  id: string;
  email: string;
  name: string;
  currency: string;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  amount: number;
  period: 'monthly' | 'yearly';
  type: 'fixed' | 'variable' | 'debt';
  createdAt: Date;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  priority: 'low' | 'medium' | 'high';
  category: 'emergency' | 'short-term' | 'medium-term' | 'long-term';
  createdAt: Date;
}

export interface IncomeSource {
  id: string;
  userId: string;
  name: string;
  amount: number;
  frequency: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'yearly';
  type: 'salary' | 'freelance' | 'investment' | 'business' | 'other';
  isActive: boolean;
  createdAt: Date;
}

export interface BudgetAlert {
  id: string;
  userId: string;
  type: 'budget_exceeded' | 'goal_milestone' | 'bill_reminder' | 'savings_target';
  message: string;
  category?: string;
  amount?: number;
  isRead: boolean;
  createdAt: Date;
}

export interface DashboardConfig {
  id: string;
  userId: string;
  name: string;
  layout: {
    charts: string[];
    period: 'week' | 'month' | 'quarter' | 'year';
    colors: string[];
  };
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  locale: string;
}

export type TimePeriod = 'week' | 'month' | 'quarter' | 'year' | 'all';