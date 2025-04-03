import React from "react";
import { 
  BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, Tooltip, Legend, 
  ResponsiveContainer, CartesianGrid
} from "recharts";
import useLocalStorage from "../../hooks/useLocalStorage";
import './TargetAnalyse.css';
import { currencyFormatter as importedFormatter } from "../../utils";

const GoalAnalytics = () => {
  const [goals] = useLocalStorage("financial-goals", []);
  const safeGoals = Array.isArray(goals) ? goals : [];

  const currencyFormatter = (value) => {
    try {
      return importedFormatter(value);
    } catch (error) {
      return new Intl.NumberFormat('kz-KZ', { 
        style: 'currency', 
        currency: 'KZT',
        maximumFractionDigits: 0 
      }).format(value);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    return (
      <div className="custom-tooltip" style={{ 
        backgroundColor: '#fff', 
        padding: '10px', 
        border: '1px solid #ccc' 
      }}>
        <p className="label">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${
              typeof entry.value === 'number' 
                ? currencyFormatter(entry.value) 
                : entry.value
            }`}
          </p>
        ))}
      </div>
    );
  };

  const totalTargetAmount = safeGoals.reduce((sum, goal) => 
    sum + (Number(goal.target) || 0), 0);
    
  const totalProgressAmount = safeGoals.reduce((sum, goal) => 
    sum + (Number(goal.progress) || 0), 0);
    
  const overallProgress = totalTargetAmount > 0 
    ? ((totalProgressAmount / totalTargetAmount) * 100).toFixed(1) 
    : 0;

  const progressData = safeGoals.map(goal => {
    const target = Number(goal.target) || 0;
    const progress = Number(goal.progress) || 0;
    const remaining = Math.max(0, target - progress);
    const percentComplete = target > 0 ? ((progress / target) * 100).toFixed(1) : 0;
    
    return {
      name: goal.name || "Цель",
      target,
      progress,
      remaining,
      percentComplete
    };
  });

  const pieData = safeGoals
    .filter(goal => goal.target > 0)
    .map(goal => ({
      name: goal.name || "Цель",
      value: Number(goal.target) || 0
    }));

  const COLORS = ['#f7931e', '#2f3133', '#5a6066'];

  return (
    <div className="container">
        <div className="target-header"><h1 className="title">Анализ финансовых целей</h1></div>
      
      {safeGoals.length === 0 ? (
        <div className="no-goals">
          <p>У вас пока нет финансовых целей. Добавьте цели, чтобы увидеть аналитику.</p>
        </div>
      ) : (
        <>
          {progressData.length > 0 && (
            <div className="chart-section">
              <h2>Прогресс по целям</h2>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={progressData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="progress" name="Накоплено" fill="#f7931e" />
                    <Bar dataKey="remaining" name="Осталось" fill="#2f3133" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {pieData.length > 0 && (
            <div className="chart-section">
              <h2>Распределение целей</h2>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => {
                        const formattedPercent = typeof percent === 'number' ? 
                          (percent * 100).toFixed(1) : '0';
                        return `${name}: ${formattedPercent}%`;
                      }}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GoalAnalytics;