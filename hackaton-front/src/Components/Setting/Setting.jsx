import React, { useState, useEffect } from 'react';
import './Setting.css';
import { FiEdit2 } from "react-icons/fi";
import user from "/assets/MainElemets/user.png";
import axios from "axios";
const API_URL = "http://localhost:8000";

export default function Setting() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Модальные окна состояния
  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [codeVerificationModalOpen, setCodeVerificationModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  // Состояния для данных
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const [passwordForDeletion, setPasswordForDeletion] = useState("");

  const fetchUserData = async () => {
    // Сначала проверяем, есть ли данные в localStorage
    const localUserData = localStorage.getItem('userData');
    
    if (localUserData) {
      try {
        const parsedData = JSON.parse(localUserData);
        setUserData(parsedData);
        
        // Устанавливаем поля формы из данных localStorage
        setNewFirstName(parsedData.firstName || parsedData.userName || '');
        setNewLastName(parsedData.lastName || parsedData.userLastName || '');
        setNewEmail(parsedData.email || parsedData.userEmail || '');
        
        setIsLoading(false);
        return; // Если данные есть в localStorage, не делаем запрос к API
      } catch (e) {
        console.error("Ошибка при парсинге данных из localStorage:", e);
        // Если возникла ошибка при парсинге, продолжаем и делаем запрос к API
      }
    }
    
    // Если данных в localStorage нет или произошла ошибка, делаем запрос к API
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      setIsLoading(false);
      setNotification({ show: true, message: "Не удалось получить данные: отсутствует токен", type: "error" });
      return;
    }
  
    try {
      const response = await axios.get(`${API_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      // Сохраняем полученные данные в localStorage
      localStorage.setItem('userData', JSON.stringify(response.data));
      setUserData(response.data);

      // Унифицируем формат данных, используя как firstName/lastName, так и userName/userLastName
      const firstName = response.data.firstName || response.data.userName || '';
      const lastName = response.data.lastName || response.data.userLastName || '';
      const email = response.data.email || response.data.userEmail || '';
      
      setNewFirstName(firstName);
      setNewLastName(lastName);
      setNewEmail(email);
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoading(false);
  
      if (error.response && error.response.status === 401) {
        setNotification({ show: true, message: "Ошибка авторизации. Пожалуйста, войдите снова.", type: "error" });
      } else {
        setNotification({ show: true, message: "Ошибка при загрузке данных", type: "error" });
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
    setUserData(null);
  };

  const handleDeleteAccount = async () => {
    if (!passwordForDeletion) {
      setNotification({ show: true, message: "Введите пароль", type: "error" });
      return;
    }

    try {
      const storedPassword = userData.password || '';
      if (storedPassword && storedPassword !== passwordForDeletion) {
        setNotification({ show: true, message: "Неверный пароль", type: "error" });
        return;
      }

      await axios.delete(`${API_URL}/user/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        data: { password: passwordForDeletion }
      });

      localStorage.clear();
      setUserData(null);
      setDeleteAccountModalOpen(false);
      setNotification({ show: true, message: "Аккаунт удален", type: "success" });
    } catch (error) {
      console.error("Ошибка при удалении аккаунта:", error);
      setNotification({ show: true, message: "Ошибка при удалении", type: "error" });
    }
  };
  
  useEffect(() => {
    fetchUserData();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleNameUpdate = async () => {
    try {
      const updatedUserData = {
        ...userData,
        firstName: newFirstName,
        lastName: newLastName,
        userName: newFirstName,
        userLastName: newLastName
      };
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      setUserData(updatedUserData);
      setNameModalOpen(false);
      showNotification("Имя успешно обновлено");
    } catch (error) {
      console.error("Error updating name:", error);
      showNotification("Ошибка при обновлении имени", "error");
    }
  };

  const handleEmailUpdateRequest = async () => {
    try {
      // Генерируем 6-значный код подтверждения
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Сохраняем код и новый email в localStorage
      localStorage.setItem('emailVerificationCode', generatedCode);
      localStorage.setItem('pendingEmail', newEmail);
      
      // Для тестирования выводим код в консоль
      console.log("Код подтверждения для тестирования:", generatedCode);
      
      setCodeVerificationModalOpen(true);
      setEmailModalOpen(false);
    } catch (error) {
      console.error("Error requesting email update:", error);
      showNotification("Ошибка при обновлении email", "error");
    }
  };

  const handleVerifyEmailUpdate = async () => {
    try {
      const storedCode = localStorage.getItem('emailVerificationCode');
      const pendingEmail = localStorage.getItem('pendingEmail');
      
      if (verificationCode !== storedCode) {
        showNotification("Неверный код подтверждения", "error");
        return;
      }
    
      // Обновляем оба формата email
      const updatedUserData = {
        ...userData,
        email: pendingEmail,
        userEmail: pendingEmail
      };
      
      // Сохраняем обновленные данные
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      setUserData(updatedUserData);
      setNewEmail(pendingEmail);

      // Удаляем временные данные
      localStorage.removeItem('emailVerificationCode');
      localStorage.removeItem('pendingEmail');
      
      setCodeVerificationModalOpen(false);
      showNotification("Email успешно обновлен", "success");
    } catch (error) {
      console.error("Error verifying email update:", error);
      showNotification("Ошибка при подтверждении кода", "error");
    }
  };

  const handlePasswordUpdate = async () => {
    // Валидация паролей
    if (newPassword !== confirmPassword) {
      showNotification("Пароли не совпадают", "error");
      return;
    }

    if (newPassword.length < 8) {
      showNotification("Пароль должен содержать минимум 8 символов", "error");
      return;
    }

    try {
      const storedPassword = userData.password || '';
      if (storedPassword && storedPassword !== oldPassword) {
        showNotification("Неверный старый пароль", "error");
        return;
      }
      const updatedUserData = {
        ...userData,
        password: newPassword
      };
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      setUserData(updatedUserData);
      
      setPasswordModalOpen(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      showNotification("Пароль успешно обновлен");
    } catch (error) {
      console.error("Error updating password:", error);
      showNotification("Ошибка при обновлении пароля", "error");
    }
  };

  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (!userData) {
    return <div className="error-message">Не удалось загрузить данные пользователя.</div>;
  }

  const displayName = userData.firstName || userData.userName || '';
  const displayLastName = userData.lastName || userData.userLastName || '';
  const displayEmail = userData.email || userData.userEmail || '';

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
            <p>{displayName} {displayLastName}</p>
          </div>
        </div>
        <button 
          className="profile-buttons user-profile"
          onClick={() => setNameModalOpen(true)}
        >
          <FiEdit2 /> Изменить
        </button>
      </div>
              
      <div className="user-mail">
        <div>
          <div className="field-label">Email</div>
          <input
            type="email"
            value={displayEmail}
            readOnly
          />
        </div>
        <button 
          className="profile-buttons"
          onClick={() => setEmailModalOpen(true)}
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
          onClick={() => setPasswordModalOpen(true)}
        >
          <FiEdit2 /> Изменить
        </button>
      </div>

      <div className="buttons-container">
        <button className="delete-account-btn" onClick={() => setDeleteAccountModalOpen(true)}>
          Удалить аккаунт
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          Выйти из аккаунта
        </button>
      </div>

      {deleteAccountModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Удаление аккаунта</h2>
            <p>Введите пароль для подтверждения удаления аккаунта.</p>
            <div className="modal-field">
              <label>Пароль</label>
              <input 
                type="password" 
                value={passwordForDeletion} 
                onChange={(e) => setPasswordForDeletion(e.target.value)} 
                placeholder="Введите пароль"
              />
            </div>
            <div className="modal-buttons">
              <button onClick={() => setDeleteAccountModalOpen(false)}>Отмена</button>
              <button className="button delete-button" onClick={handleDeleteAccount} disabled={!passwordForDeletion}>
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}

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
                onClick={handleEmailUpdateRequest}
                disabled={!newEmail}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {codeVerificationModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Подтверждение email</h2>
            <p>Введите код, который был отправлен на ваш новый email.</p>
            <p className="verification-hint">Посмотрите код в консоли браузера (F12)</p>
            <div className="modal-field">
              <label>Код подтверждения</label>
              <input 
                type="text" 
                value={verificationCode} 
                onChange={(e) => setVerificationCode(e.target.value)} 
                placeholder="Введите код"
              />
            </div>
            <div className="modal-buttons">
              <button onClick={() => setCodeVerificationModalOpen(false)}>Отмена</button>
              <button 
                className="button" 
                onClick={handleVerifyEmailUpdate}
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