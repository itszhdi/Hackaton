import './App.css'
import Router from './Router/Router'
import React, { useState } from "react";
import Nav from "./Components/Nav/Nav";
import Login from "./Components/Login/Login";


function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [loginTrigger, setLoginTrigger] = useState(0);

  // Функция для обновления Nav после успешной авторизации
  const handleLoginSuccess = () => {
    // Увеличиваем счетчик для обновления компонентов 
    setLoginTrigger(prev => prev + 1);
    
    // Создаем и отправляем пользовательское событие
    const event = new CustomEvent('userLoggedIn');
    window.dispatchEvent(event);
  };

  return (
    <Router>
      <div className="App">
        <Nav 
          setShowLogin={setShowLogin} 
          key={`nav-${loginTrigger}`} // Принудительное обновление компонента
        />
        
        {/* Остальные компоненты */}
        
        {showLogin && (
          <Login 
            setShowLogin={setShowLogin} 
            onLoginSuccess={handleLoginSuccess} 
          />
        )}
      </div>
    </Router>
  );
}

export default App;
