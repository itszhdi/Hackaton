import React, {useState} from "react";
import './GoalModal.css';

const GoalModal = ({ setModalOpen, addGoal }) => {
  const [goal, setGoal] = useState({ name: "", target: 0, progress: 0 });
  
  const handleSubmit = () => {
    addGoal(goal);
    setGoal({ name: "", target: 0, progress: 0 });
    setModalOpen(false);
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-header">Добавить цель</h2>
        <div className="modal-form">
          <div className="form-group">
            <label htmlFor="goal-name">Название цели</label>
            <input
              id="goal-name"
              type="text"
              placeholder="Например: Новый ноутбук"
              value={goal.name}
              onChange={(e) => setGoal({ ...goal, name: e.target.value })}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="goal-target">Сумма цели</label>
            <input
              id="goal-target"
              type="number"
              placeholder="50000"
              value={goal.target}
              onChange={(e) => setGoal({ ...goal, target: Number(e.target.value) })}
            />
          </div>
        </div>
        
        <div className="modal-actions">
          <button 
            onClick={() => setModalOpen(false)} 
            className="modal-cancel-btn"
          >
            Отмена
          </button>
          <button 
            onClick={handleSubmit} 
            className="submit-button"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalModal;