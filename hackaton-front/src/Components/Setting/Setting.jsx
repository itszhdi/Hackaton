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
      
      <div className="user-info">
        <div className="user-data">
          <img src={"*"} alt="Фото профиля" />
          <div>
            <p>{firstName} {lastName}</p>
          </div>
        </div>
        <button className='profile-buttons user-profile'><FiEdit2 />Изменить</button>
      </div>
      
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
        <button className='profile-buttons'><FiEdit2 />Изменить</button>
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
        <button className='profile-buttons'><FiEdit2 />Изменить</button>
      </div>
    </div>
  );
}