import React, { useState, useEffect } from 'react';
import './Setting.css';
import { FiEdit2 } from "react-icons/fi";
import user from "/assets/MainElemets/user.png";

export default function Setting() {
  const getStoredValue = (key, defaultValue) => {
    const stored = localStorage.getItem(key);
    return stored !== null ? JSON.parse(stored) : defaultValue;
  };


  const [email, setEmail] = useState(() => getStoredValue('userEmail', "moera@mail.ru"));
  const [password, setPassword] = useState(() => getStoredValue('userPassword', "userspassword"));
  const [firstName, setFirstName] = useState(() => getStoredValue('userFirstName', "Трофим"));
  const [lastName, setLastName] = useState(() => getStoredValue('userLastName', "Быстрицкий"));
  

  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  

  const [newFirstName, setNewFirstName] = useState(firstName);
  const [newLastName, setNewLastName] = useState(lastName);
  const [newEmail, setNewEmail] = useState(email);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });


  useEffect(() => {
    localStorage.setItem('userEmail', JSON.stringify(email));
    localStorage.setItem('userPassword', JSON.stringify(password));
    localStorage.setItem('userFirstName', JSON.stringify(firstName));
    localStorage.setItem('userLastName', JSON.stringify(lastName));
  }, [email, password, firstName, lastName]);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleNameUpdate = () => {
    setFirstName(newFirstName);
    setLastName(newLastName);
    setNameModalOpen(false);
    showNotification("Имя успешно обновлено");
  };

  const handleEmailUpdate = () => {
    // Здесь в реальном приложении отправили бы запрос на сервер для отправки кода
    // Имитируем успешную отправку кода
    setEmailModalOpen(false);
    setVerificationModalOpen(true);
    showNotification("Код подтверждения отправлен на " + newEmail, "info");
  };

  const handleEmailVerification = () => {
    // Здесь должна быть проверка кода
    // Для демонстрации принимаем любой код
    if (verificationCode) {
      const oldEmail = email;
      setEmail(newEmail);
      setVerificationModalOpen(false);
      showNotification(`Email успешно изменен с ${oldEmail} на ${newEmail}`);
    } else {
      showNotification("Введите код подтверждения", "error");
    }
  };

  const handlePasswordUpdate = () => {
    if (oldPassword !== password) {
      showNotification("Неверный старый пароль", "error");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      showNotification("Пароли не совпадают", "error");
      return;
    }
    
    if (newPassword.length < 6) {
      showNotification("Пароль должен содержать минимум 6 символов", "error");
      return;
    }
    
    setPassword(newPassword);
    setPasswordModalOpen(false);
    showNotification("Пароль успешно обновлен");
  };

  return (
    <div className="container settings-container">
      <div className="notifications-header"><h1>Мой профиль</h1></div>
      
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      
      <div className="user-info">
        <div className="user-data">
          <img src={user} alt="Фото профиля" />
          <div>
            <p>{firstName} {lastName}</p>
          </div>
        </div>
        <button 
          className="profile-buttons user-profile"
          onClick={() => {
            setNewFirstName(firstName);
            setNewLastName(lastName);
            setNameModalOpen(true);
          }}
        >
          <FiEdit2 /> Изменить
        </button>
      </div>
              
      <div className="user-mail">
        <div>
          <div className="field-label">Email</div>
          <input
            type="email"
            value={email}
            readOnly
          />
        </div>
        <button 
          className="profile-buttons"
          onClick={() => {
            setNewEmail(email);
            setConfirmEmail("");
            setEmailModalOpen(true);
          }}
        >
          <FiEdit2 /> Изменить
        </button>
      </div>
      
      <div className="user-password">
        <div>
          <div className="field-label">Пароль</div>
          <input
            type="password"
            value="*********"
            readOnly
          />
        </div>
        <button 
          className="profile-buttons"
          onClick={() => {
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setPasswordModalOpen(true);
          }}
        >
          <FiEdit2 /> Изменить
        </button>
      </div>

      {nameModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Изменение имени</h2>
            <div className="modal-field">
              <label>Имя</label>
              <input 
                type="text" 
                value={newFirstName} 
                onChange={(e) => setNewFirstName(e.target.value)} 
                placeholder="Введите имя"
              />
            </div>
            <div className="modal-field">
              <label>Фамилия</label>
              <input 
                type="text" 
                value={newLastName} 
                onChange={(e) => setNewLastName(e.target.value)} 
                placeholder="Введите фамилию"
              />
            </div>
            <div className="modal-buttons">
              <button onClick={() => setNameModalOpen(false)}>Отмена</button>
              <button 
                className="button" 
                onClick={handleNameUpdate}
                disabled={!newFirstName || !newLastName}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {emailModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Изменение email</h2>
            <div className="modal-field">
              <label>Новый email</label>
              <input 
                type="email" 
                value={newEmail} 
                onChange={(e) => setNewEmail(e.target.value)} 
                placeholder="Введите новый email"
              />
            </div>
            <div className="modal-buttons">
              <button onClick={() => setEmailModalOpen(false)}>Отмена</button>
              <button 
                className="button" 
                onClick={handleEmailUpdate}
              >
                Отправить код
              </button>
            </div>
          </div>
        </div>
      )}

      {verificationModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Подтверждение email</h2>
            <p>Код подтверждения отправлен на {newEmail}</p>
            <div className="modal-field">
              <label className='label'>Код подтверждения</label>
              <input 
                type="text" 
                value={verificationCode} 
                onChange={(e) => setVerificationCode(e.target.value)} 
                placeholder="Введите код подтверждения"
                required
              />
            </div>
            <div className="modal-buttons">
              <button onClick={() => setVerificationModalOpen(false)}>Отмена</button>
              <button 
                className="button" 
                onClick={handleEmailVerification}
                disabled={!verificationCode}
              >
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}

      {passwordModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Изменение пароля</h2>
            <div className="modal-field">
              <label>Старый пароль</label>
              <input 
                type="password" 
                value={oldPassword} 
                onChange={(e) => setOldPassword(e.target.value)} 
                placeholder="Введите старый пароль"
              />
            </div>
            <div className="modal-field">
              <label>Новый пароль</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                placeholder="Введите новый пароль"
              />
            </div>
            <div className="modal-field">
              <label>Подтвердите новый пароль</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="Повторите новый пароль"
              />
            </div>
            <div className="modal-buttons">
              <button onClick={() => setPasswordModalOpen(false)}>Отмена</button>
              <button 
                className="button" 
                onClick={handlePasswordUpdate}
                disabled={!oldPassword || !newPassword || newPassword !== confirmPassword}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}