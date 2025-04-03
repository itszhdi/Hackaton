import React, { useState } from "react";
import './GoalCard.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const GoalCard = ({ goal, updateProgress }) => {
  const [amount, setAmount] = useState(1000); // Устанавливаем начальное значение 1000
  const progressPercent = (goal.progress / goal.target) * 100;
  
  const data = [
    { name: 'Прогресс', value: goal.progress },
    { name: 'Осталось', value: goal.target - goal.progress }
  ];
  
  // Обработчик для добавления суммы
  const handleAddAmount = () => {
    if (amount > 0) {
      updateProgress(goal.id, Number(amount));
    }
  };
  
  return (
    <div className="goal-card">
      <div className="goal-card-header">{goal.name}</div>
      
      <div className="goal-info">
        <div className="goal-target">Цель: {goal.target.toLocaleString()} ₸</div>
        <div className="goal-progress">Прогресс: {goal.progress.toLocaleString()} ₸</div>
        <div className="goal-remaining">Осталось: {(goal.target - goal.progress).toLocaleString()} ₸</div>
      </div>
      
      <div className="progress-bar-goal">
        <div 
          className="progress-fill" 
          style={{ width: `${Math.min(progressPercent, 100)}%` }}
        />
      </div>
      <div className="progress-percent">{progressPercent.toFixed(1)}%</div>
      
      <div className="goal-chart-container">
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `${value.toLocaleString()} ₸`} />
            <Bar dataKey="value" fill="#f7931e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="goal-actions">
        <div className="amount-input-group">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="amount-input"
            min="1"
          />
          <span className="amount-currency">₸</span>
        </div>
        <button 
          onClick={handleAddAmount} 
          className="add-btn"
          disabled={progressPercent >= 100}
        >
          {progressPercent >= 100 ? "Цель достигнута!" : "Добавить"}
        </button>
      </div>
      
      {progressPercent >= 100 && (
        <div className="goal-completed"> Поздравляем! Вы достигли своей цели!</div>
      )}
    </div>
  );
};

export default GoalCard;