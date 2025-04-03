import React from "react";
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from "../../Contexts/BudgetContext";
import { currencyFormatter } from "../../utils";
import './ViewExpense.css';

export default function ViewExpensesModal({ budgetId, handleClose }) {
  const { getBudgetExpenses, budgets, deleteBudget, deleteExpense } = useBudgets();

  const expenses = getBudgetExpenses(budgetId);
  const budget =
    UNCATEGORIZED_BUDGET_ID === budgetId
      ? { name: "Uncategorized", id: UNCATEGORIZED_BUDGET_ID }
      : budgets.find(b => b.id === budgetId);

  if (budgetId == null) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <div className="stack-horizontal">
              <div>Траты - {budget?.name}</div>
              {budgetId !== UNCATEGORIZED_BUDGET_ID && (
                <button
                  onClick={() => {
                    deleteBudget(budget);
                    handleClose();
                  }}
                  className="btn btn-outline-danger"
                >
                  Удалить
                </button>
              )}
            </div>
          </h2>
          <button className="btn-close" onClick={handleClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="stack-vertical">
            {expenses.length === 0 ? (
              <p>Нет записанных трат</p>
            ) : (
              expenses.map(expense => (
                <div className="expense-item" key={expense.id}>
                  <div className="expense-description">{expense.description}</div>
                  <div className="expense-amount">
                    {currencyFormatter.format(expense.amount)}
                  </div>
                  <button
                    onClick={() => deleteExpense(expense)}
                    className="btn btn-sm btn-outline-danger"
                  >
                    &times;
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}