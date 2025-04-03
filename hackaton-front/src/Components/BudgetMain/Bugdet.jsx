import { useState } from "react"
import AddBudgetModal from "../AddBudget/AddBudget"
import AddExpenseModal from "../AddExpense/AddExpense"
import UncategorizedBudgetCard from "../UnauthBudget/UnBud";
import ViewExpensesModal from "../ViewExpense/ViewExpense";
import TotalBudgetCard from "../Total/Total";
import BudgetCard from "../BudgetCard/BudgetCard";
import { useBudgets, UNCATEGORIZED_BUDGET_ID } from "../../Contexts/BudgetContext";
import './Budget.css'

export default function Bugdet() {
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false)
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false)
  const [viewExpensesModalBudgetId, setViewExpensesModalBudgetId] = useState()
  const [addExpenseModalBudgetId, setAddExpenseModalBudgetId] = useState()
  const { budgets, getBudgetExpenses } = useBudgets()

  function openAddExpenseModal(budgetId) {
    setShowAddExpenseModal(true)
    setAddExpenseModalBudgetId(budgetId)
  }

  return (
    <>
      <div className="budget-container">
        <div className="budget-header">
          <h1 className="title">Мой бюджет</h1>
          <div className="button-group">
            <button 
              className="submit-button" 
              onClick={() => setShowAddBudgetModal(true)}
            >
              Планировать
            </button>
            <button 
              className="button-outline" 
              onClick={openAddExpenseModal}
            >
              Добавить трату
            </button>
          </div>
        </div>
        
        <div className="budget-grid">
          {budgets.map(budget => {
            const amount = getBudgetExpenses(budget.id).reduce(
              (total, expense) => total + expense.amount,
              0
            )
            return (
              <BudgetCard
                key={budget.id}
                name={budget.name}
                amount={amount}
                max={budget.max}
                onAddExpenseClick={() => openAddExpenseModal(budget.id)}
                onViewExpensesClick={() =>
                  setViewExpensesModalBudgetId(budget.id)
                }
              />
            )
          })}
          <UncategorizedBudgetCard
            onAddExpenseClick={openAddExpenseModal}
            onViewExpensesClick={() =>
              setViewExpensesModalBudgetId(UNCATEGORIZED_BUDGET_ID)
            }
          />
          <TotalBudgetCard />
        </div>
      </div>
      
      <AddBudgetModal
        show={showAddBudgetModal}
        handleClose={() => setShowAddBudgetModal(false)}
      />
      <AddExpenseModal
        show={showAddExpenseModal}
        defaultBudgetId={addExpenseModalBudgetId}
        handleClose={() => setShowAddExpenseModal(false)}
      />
      <ViewExpensesModal
        budgetId={viewExpensesModalBudgetId}
        handleClose={() => setViewExpensesModalBudgetId()}
      />
    </>
  )
}