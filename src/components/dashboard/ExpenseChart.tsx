import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/currency';
import { format, startOfMonth, endOfMonth } from 'date-fns';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart: React.FC = () => {
  const { transactions, categories } = useFinance();
  const { user } = useAuth();

  const chartData = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const monthlyExpenses = transactions.filter(t => 
      t.type === 'expense' && 
      new Date(t.date) >= monthStart && 
      new Date(t.date) <= monthEnd
    );

    const expensesByCategory = monthlyExpenses.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    const labels = Object.keys(expensesByCategory);
    const data = Object.values(expensesByCategory);
    const colors = labels.map(label => {
      const category = categories.find(c => c.name === label);
      return category?.color || '#6B7280';
    });

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderColor: colors.map(color => color + '20'),
          borderWidth: 2,
          hoverBorderWidth: 3,
        },
      ],
    };
  }, [transactions, categories]);

  const userCurrency = user?.currency || 'USD';

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = formatCurrency(context.raw, userCurrency);
            return `${context.label}: ${value}`;
          },
        },
      },
    },
    cutout: '60%',
  };

  if (chartData.labels.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <p>No expense data for {format(new Date(), 'MMMM yyyy')}</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default ExpenseChart;