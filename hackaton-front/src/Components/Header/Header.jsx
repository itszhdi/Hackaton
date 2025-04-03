import React from "react";
import { useBudgets } from "../../Contexts/BudgetContext";
import './Header.css'

export default function BudgetAnalytics() {
  const { budgets, expenses } = useBudgets();

  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);

  return (
    <div className="container analytics-container">      
    <div className="notifications-header"><h1>Отчет по вашим финансам</h1></div>
      <div className="analytics-summary-budget">
        <div className="summary-item">
          <div className="summary-value">{totalExpenses.toLocaleString()} ₸</div>
          <div className="summary-label">Всего расходов</div>
        </div>
        <div className="summary-item">
          <div className="summary-value">{budgets.length}</div>
          <div className="summary-label">Категорий бюджета</div>
        </div>
        <div className="summary-item">
          <div className="summary-value">{expenses.length}</div>
          <div className="summary-label">Операций</div>
        </div>
      </div>
    </div>
  );
}