import React, { useState } from "react";
import GoalCard from "../GoalCard/GoalCard";
import './FinancialGoals.css'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import GoalModal from "../GoalModal/GoalModal";
import useLocalStorage from "../../hooks/useLocalStorage";

const FinancialGoals = () => {
  const [goals, setGoals] = useLocalStorage("financial-goals", []);
  const [modalOpen, setModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: "", target: 0, progress: 0 });

  const addGoal = (goal) => {
    if (!goal.name || goal.target <= 0) return;
    setGoals([...goals, { ...goal, id: Date.now() }]);
  };

  const updateProgress = (id, amount) => {
    setGoals(goals.map(goal => goal.id === id ? { ...goal, progress: Math.min(goal.progress + amount, goal.target) } : goal));
  };

  return (
    <div className="container goals-container">
      <div className="target-header">
      <h1 className="title">Финансовые цели</h1>
      <button onClick={() => setModalOpen(true)} className="submit-button">Добавить цель</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map(goal => (
          <GoalCard key={goal.id} goal={goal} updateProgress={updateProgress} />
        ))}
      </div>
      
      {modalOpen && <GoalModal setModalOpen={setModalOpen} addGoal={addGoal} />}
    </div>
  );
};

export default FinancialGoals;