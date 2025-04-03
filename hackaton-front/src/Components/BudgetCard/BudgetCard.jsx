import React, { useState } from 'react';
import './BudgetCard.css';
import { currencyFormatter } from '../../utils';
import { BarChart, Bar, XAxis, YAxis, Cell, LabelList, ResponsiveContainer } from 'recharts';
import AddExpenseModal from '../AddExpense/AddExpense';
import ViewExpensesModal from '../ViewExpense/ViewExpense';

function getProgressBarColor(amount, max) {
  const ratio = amount / max;
  if (ratio < 0.5) return "#5a6066"; // primary
  if (ratio < 0.75) return "#f7931e"; // warning
  return "#dc3545"; // limit
}

export default function BudgetCard({ name, amount, max, onAddExpenseClick, onViewExpensesClick, budgetId }) {
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showViewExpensesModal, setShowViewExpensesModal] = useState(false);
  
  const percentSpent = Math.min(100, Math.round((amount / max) * 100));
  
  const data = [
    {
      name: name,
      value: amount,
      maxValue: max
    }
  ];

  function handleAddExpenseClick() {
    if (onAddExpenseClick) {
      onAddExpenseClick();
    } else {
      setShowAddExpenseModal(true);
    }
  }

  function handleViewExpensesClick() {
    if (onViewExpensesClick) {
      onViewExpensesClick();
    } else {
      setShowViewExpensesModal(true);
    }
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="card-title">
          <h4>{name}</h4>
          <div className="card-amount">
            <span className="current-amount">{currencyFormatter.format(amount)}</span>
            <span className="max-amount"> / {currencyFormatter.format(max)}</span>
          </div>
        </div>
        
        <div style={{ width: '100%', height: 40 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
              barSize={20}
            >
              <XAxis type="number" domain={[0, max]} hide />
              <YAxis type="category" dataKey="name" hide />
              <Bar 
                dataKey="value" 
                background={{ fill: '#eee' }}
              >
                <Cell fill={getProgressBarColor(amount, max)} />
                <LabelList 
                  dataKey="value" 
                  position="center"
                  content={({ x, y, width, height, value }) => {
                    return (
                      <text 
                        x={x + width / 2} 
                        y={y + height / 2} 
                        fill="#fff" 
                        textAnchor="middle" 
                        dominantBaseline="central"
                      >
                        {`${percentSpent}%`}
                      </text>
                    );
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="action-buttons">
          <button className="submit-button" onClick={handleAddExpenseClick}>
            Добавить траты
          </button>
          <button className="button-outline" onClick={handleViewExpensesClick}>
            Просмотреть все расходы
          </button>
        </div>
      </div>

      <AddExpenseModal
        show={showAddExpenseModal}
        handleClose={() => setShowAddExpenseModal(false)}
        defaultBudgetId={budgetId}
      />
      
      <ViewExpensesModal
        budgetId={budgetId}
        handleClose={() => setShowViewExpensesModal(false)}
        show={showViewExpensesModal}
      />
    </div>
  );
}