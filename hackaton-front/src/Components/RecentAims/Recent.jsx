import React from "react";
import useLocalStorage from "../../hooks/useLocalStorage";

const Recent = () => {
  const [goals] = useLocalStorage("financial-goals", []);
  
  const safeGoals = Array.isArray(goals) ? goals : [];

  const totalTargetAmount = safeGoals.reduce((sum, goal) => 
    sum + (Number(goal.target) || 0), 0);
    
  const totalProgressAmount = safeGoals.reduce((sum, goal) => 
    sum + (Number(goal.progress) || 0), 0);
    
  const overallProgress = totalTargetAmount > 0 
    ? ((totalProgressAmount / totalTargetAmount) * 100).toFixed(1) 
    : 0;
  
  const formatCurrency = (value) => {
    try {
      return new Intl.NumberFormat('kz-KZ', { 
        style: 'currency', 
        currency: 'KZT',
        maximumFractionDigits: 0
      }).format(value);
    } catch (error) {
      console.error(error);
      return value.toString();
    }
  };

  const progressData = safeGoals.map(goal => {
    const target = Number(goal.target) || 0;
    const progress = Number(goal.progress) || 0;
    const remaining = Math.max(0, target - progress);
    const percentComplete = target > 0 ? ((progress / target) * 100).toFixed(1) : 0;
    
    return {
      name: goal.name || "Без названия",
      target,
      progress,
      remaining,
      percentComplete
    };
  });

  return (
    <div className="container analytics-container">      
      {safeGoals.length === 0 ? (
        <div className="no-goals">
          <p>У вас пока нет финансовых целей. Добавьте цели, чтобы увидеть аналитику.</p>
        </div>
      ) : (
        <>
          <div className="stats-summary">
            <div className="stat-card">
              <h3>Всего целей</h3>
              <p className="stat-value">{safeGoals.length}</p>
            </div>
            <div className="stat-card">
              <h3>Общая сумма целей</h3>
              <p className="stat-value">{formatCurrency(totalTargetAmount)}</p>
            </div>
            <div className="stat-card">
              <h3>Накоплено</h3>
              <p className="stat-value">{formatCurrency(totalProgressAmount)}</p>
            </div>
            <div className="stat-card">
              <h3>Общий прогресс</h3>
              <p className="stat-value">{overallProgress}%</p>
            </div>
          </div>

          <div className="goals-table">
            <h2>Детальная информация</h2>
            <table>
              <thead>
                <tr>
                  <th>Цель</th>
                  <th>Целевая сумма</th>
                  <th>Накоплено</th>
                  <th>Осталось</th>
                  <th>Прогресс</th>
                </tr>
              </thead>
              <tbody>
                {progressData.map((goal, index) => (
                  <tr key={index}>
                    <td>{goal.name}</td>
                    <td>{formatCurrency(goal.target)}</td>
                    <td>{formatCurrency(goal.progress)}</td>
                    <td>{formatCurrency(goal.remaining)}</td>
                    <td>
                      <div className="progress-bar-container">
                        <div 
                          className="progress-bar" 
                          style={{ width: `${goal.percentComplete}%` }}
                        ></div>
                        <span>{goal.percentComplete}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Recent;