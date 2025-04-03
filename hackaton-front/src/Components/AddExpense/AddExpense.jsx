import { useRef } from "react";
import { useBudgets, UNCATEGORIZED_BUDGET_ID } from "../../Contexts/BudgetContext";
import "../AddBudget/AddBudget.css";

export default function AddExpenseModal({
  show,
  handleClose,
  defaultBudgetId,
}) {
  const descriptionRef = useRef();
  const amountRef = useRef();
  const budgetIdRef = useRef();
  const { addExpense, budgets } = useBudgets();

  function handleSubmit(e) {
    e.preventDefault();
    addExpense({
      description: descriptionRef.current.value,
      amount: parseFloat(amountRef.current.value),
      budgetId: budgetIdRef.current.value,
    });
    handleClose();
  }

  if (!show) return null;

  return (
    <div className="modal-overlay">
        <div className="modal-content">
        <div className="modal-header">
          <h2 className="title">Новая трата</h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="description">Описание</label>
              <input 
                id="description"
                ref={descriptionRef} 
                type="text" 
                required 
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="amount">Сумма</label>
              <input 
                id="amount"
                ref={amountRef} 
                type="number" 
                required 
                min={0} 
                step={10} 
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="budgetId">Категория</label>
              <select 
                id="budgetId"
                className="form-select" 
                defaultValue={defaultBudgetId} 
                ref={budgetIdRef}
              >
                <option value={UNCATEGORIZED_BUDGET_ID}>Без категории</option>
                {budgets.map(budget => (
                  <option key={budget.id} value={budget.id}>
                    {budget.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="button-container">
              <button className="submit-button" type="submit">
                Добавить
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}