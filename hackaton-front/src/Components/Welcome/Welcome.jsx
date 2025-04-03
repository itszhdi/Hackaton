import React, { useState } from 'react';
import './Welcome.css';
import { useNavigate } from 'react-router-dom';

const WelcomeHero = ({ setShowLogin, isAuthenticated }) => {
   const navigate = useNavigate();

  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1 className="hero-title">
        Финансовая грамотность 
          <br />
          для всех.
        </h1>
        
        <p className="hero-description">
          Финансовая грамотность играет ключевую роль в обеспечении стабильности и благополучия.
          Откройте для себя новый мир с планированием бюджета, управлении доходами и расходами. 
        </p>

        { isAuthenticated ? (
          <button 
            className="button welcome-button" 
            onClick={() => navigate('/analyse')}
          >
            Посмотреть отчеты
          </button>
        ) : (
          <button 
            className="button welcome-button" 
            onClick={() => setShowLogin(true)}
          >
            Начать работу
          </button>
        )}
      </div>
      
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon-container">
            <svg className="feature-icon" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="feature-title">Наглядная аналитика</h3>
          <p className="feature-description">Отслеживайте все ваши финансовые потоки с удобными визуальными отчетами</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon-container">
            <svg className="feature-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="feature-title">Планирование</h3>
          <p className="feature-description">Создавайте лимиты для бюджета и ставьте финансовые цели</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon-container">
            <svg className="feature-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="feature-title">Безопасность</h3>
          <p className="feature-description">Полная защита ваших данных и операций с использованием современных технологий</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHero;