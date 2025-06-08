import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/currency';
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyTrendChart: React.FC = () => {
  const { transactions } = useFinance();
  const { user } = useAuth();

  const chartData = useMemo(() => {
    const now = new Date();
    const sixMonthsAgo = subMonths(now, 5);
    
    const months = eachMonthOfInterval({ start: sixMonthsAgo, end: now });
    
    const monthlyData = months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= monthStart && transactionDate <= monthEnd;
      });
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        month: format(month, 'MMM yyyy'),
        income,
        expenses,
        savings: income - expenses
      };
    });

    return {
      labels: monthlyData.map(d => d.month),
      datasets: [
        {
          label: 'Income',
          data: monthlyData.map(d => d.income),
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 3,
          fill: false,
          tension: 0.4,
        },
        {
          label: 'Expenses',
          data: monthlyData.map(d => d.expenses),
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 3,
          fill: false,
          tension: 0.4,
        },
        {
          label: 'Savings',
          data: monthlyData.map(d => d.savings),
          borderColor: '#8B5CF6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          borderWidth: 3,
          fill: false,
          tension: 0.4,
        },
      ],
    };
  }, [transactions]);

  const userCurrency = user?.currency || 'USD';

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = formatCurrency(context.raw, userCurrency);
            return `${context.dataset.label}: ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => {
            return formatCurrency(value, userCurrency).replace(/\.\d+/, '');
          },
        },
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  return (
    <div className="h-80">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MonthlyTrendChart;