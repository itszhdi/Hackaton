import React, { useState } from 'react';
import './Setting.css';
import { FiEdit2 } from "react-icons/fi";

export default function Setting() {
  const [email, setEmail] = useState("moera@mail.ru");
  const [password, setPassword] = useState("*********");
  const [firstName, setFirstName] = useState("Трофим");
  const [lastName, setLastName] = useState("Быстрицкий");

  return (
    <div className="settings-container">
      <h2>Мой профиль</h2>
      
      {/* Основная информация профиля */}
      <div className="user-info">
        <img src={"*"} alt="Фото профиля" />
        <div>
          <p>{firstName} {lastName}</p>
        </div>
        <button><FiEdit2 />Изменить</button>
      </div>

      {/* Личная информация */}
      <div className="section-title">
        <h3>Личная информация</h3>
        <button><FiEdit2 />Изменить</button>
      </div>
      
      <div className="user-info-grid">
        <div>
          <div className="field-label">Имя</div>
          <div className="field-value">{firstName}</div>
        </div>
        <div>
          <div className="field-label">Фамилия</div>
          <div className="field-value">{lastName}</div>
        </div>
        <div>
          <div className="field-label">Email адрес</div>
          <div className="field-value">{email}</div>
        </div>
      </div>
      
      {/* Безопасность (Email и пароль) */}
      <h2>Безопасность</h2>
      
      <div className="user-mail">
        <div>
          <div className="field-label">Email</div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly
          />
        </div>
        <button><FiEdit2 />Изменить</button>
      </div>
      
      <div className="user-password">
        <div>
          <div className="field-label">Пароль</div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            readOnly
          />
        </div>
        <button><FiEdit2 />Изменить</button>
      </div>
    </div>
  );
}