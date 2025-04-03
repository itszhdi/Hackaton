import React, { useEffect, useState } from "react";
import { useBudgets, UNCATEGORIZED_BUDGET_ID } from "../../Contexts/BudgetContext";
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./BudgetAnalyse.css";

const COLORS = ['#f7931e', '#2f3133', '#5a6066'];

export default function BudgetAnalytics() {
  const { budgets, expenses, getBudgetExpenses } = useBudgets();
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);

  useEffect(() => {
    const pieData = budgets.map(budget => {
      const amount = getBudgetExpenses(budget.id)
        .reduce((total, expense) => total + expense.amount, 0);
      
      return {
        name: budget.name,
        value: amount
      };
    });

    const uncategorizedAmount = getBudgetExpenses(UNCATEGORIZED_BUDGET_ID)
      .reduce((total, expense) => total + expense.amount, 0);
    
    if (uncategorizedAmount > 0) {
      pieData.push({
        name: "Без категории",
        value: uncategorizedAmount
      });
    }

    const filteredPieData = pieData.filter(item => item.value > 0);
    setPieChartData(filteredPieData);

    const barData = budgets.map(budget => {
      const spent = getBudgetExpenses(budget.id)
        .reduce((total, expense) => total + expense.amount, 0);
      
      return {
        name: budget.name,
        max: budget.max,
        spent: spent,
        remaining: budget.max - spent > 0 ? budget.max - spent : 0
      };
    });
    setBarChartData(barData);
    const expensesByDate = {};
    
    expenses.forEach(expense => {
      const creationDate = new Date();
      
      const dateKey = `${creationDate.getMonth() + 1}-${creationDate.getDate()}`;
      
      if (!expensesByDate[dateKey]) {
        expensesByDate[dateKey] = 0;
      }
      
      expensesByDate[dateKey] += expense.amount;
    });
    

    const sortedDates = Object.keys(expensesByDate).sort((a, b) => {
      const [monthA, dayA] = a.split('-').map(Number);
      const [monthB, dayB] = b.split('-').map(Number);
      
      if (monthA !== monthB) return monthA - monthB;
      return dayA - dayB;
    });
    
    const lineData = sortedDates.map(date => ({
      date,
      amount: expensesByDate[date]
    }));
    
    setLineChartData(lineData);
  }, [budgets, expenses, getBudgetExpenses]);


  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);

  return (
    <div className="analytics-container">
      <div className="target-header"><h2 className="title">Анализ использования бюджета</h2></div>
      
      <div className="analytics-summary">
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
      
      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Распределение расходов по категориям</h3>
          <div className="chart-container pie-chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toLocaleString()} ₸`} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="chart-legend">
              {pieChartData.map((entry, index) => (
                <div key={`legend-${index}`} className="legend-item">
                  <div 
                    className="legend-color" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <div className="legend-text">
                    {entry.name}: {entry.value.toLocaleString()} ₸
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="chart-card">
          <h3 className="chart-title">Сравнение бюджета и расходов</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toLocaleString()} ₸`} />
                <Legend />
                <Bar dataKey="spent" name="Потрачено" stackId="a" fill="#2f3133" />
                <Bar dataKey="remaining" name="Осталось" stackId="a" fill="#f7931e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        </div>
      </div>
  );
}