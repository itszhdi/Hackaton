import { useRef } from "react"
import { useBudgets } from "../../Contexts/BudgetContext";
import "./AddBudget.css"

export default function AddBudgetModal({ show, handleClose }) {
  const nameRef = useRef()
  const maxRef = useRef()
  const { addBudget } = useBudgets()
  
  function handleSubmit(e) {
    e.preventDefault()
    addBudget({
      name: nameRef.current.value,
      max: parseFloat(maxRef.current.value),
    })
    handleClose()
  }

  if (!show) return null

  return (
    <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="title">Запланировать расходы</h2>
            <button className="close-button" onClick={handleClose}>×</button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Категория</label>
                <input
                  id="name"
                  ref={nameRef}
                  type="text"
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="max">Лимит на затраты</label>
                <input
                  id="max"
                  ref={maxRef}
                  type="number"
                  className="form-control"
                  required
                  min={0}
                  step={10}
                />
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
  )
}