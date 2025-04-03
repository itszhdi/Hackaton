import React, { useState, useEffect } from "react";
import "./Nav.css";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";

import { GoHome } from "react-icons/go";
import { CiDollar } from "react-icons/ci";
import { GoGoal } from "react-icons/go";
import { IoAnalyticsOutline } from "react-icons/io5";
import { IoIosNotificationsOutline } from "react-icons/io";
import { VscSettings } from "react-icons/vsc";
import { FiLogOut } from "react-icons/fi";

import Logo2 from "/assets/MainElemets/Logo2.png";
import user from "/assets/MainElemets/user.png";

// API base URL
const API_URL = "http://localhost:8000";

const navLinks = [
  { id: 1, name: "Главная", icon: <GoHome />, link: "/" },
  { id: 2, name: "Бюджет", icon: <CiDollar />, link: "/budget" },
  { id: 3, name: "Цели", icon: <GoGoal />, link: "/targets" },
  { id: 4, name: "Аналитика", icon: <IoAnalyticsOutline />, link: "/analyse" },
];

const userNav = [
  { id: 1, name: "Уведомления", icon: <IoIosNotificationsOutline />, link: "/notifications" },
  { id: 2, name: "Настройки", icon: <VscSettings />, link: "/profile" },
];

const Nav = ({ setShowLogin }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Функция для получения данных пользователя
  const fetchUserData = async () => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await axios.get(`${API_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      setUserData(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
      
      // Если токен истек, пробуем обновить его
      if (error.response && error.response.status === 401) {
        await refreshToken();
      } else {
        // Если другая ошибка или не удалось обновить токен, выходим из системы
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для обновления токена
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      handleLogout();
      return;
    }
    
    try {
      const response = await axios.post(`${API_URL}/auth/refresh`, { refresh_token: refreshToken });
      
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      
      // После успешного обновления токена, повторно запрашиваем данные пользователя
      fetchUserData();
    } catch (error) {
      console.error("Error refreshing token:", error);
      handleLogout();
    }
  };

  // Функция для выхода из системы
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setUserData(null);
  };

  // Добавляем слушатель события для обновления данных пользователя после авторизации
  useEffect(() => {
    const handleStorageChange = () => {
      fetchUserData();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Проверка наличия токена при загрузке компонента
    fetchUserData();
    
    // Добавляем интервальную проверку для подстраховки
    const authCheckInterval = setInterval(() => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken && !isAuthenticated) {
        fetchUserData();
      }
    }, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(authCheckInterval);
    };
  }, []);

  // Получаем первые буквы имени и фамилии для аватара
  const getInitials = () => {
    if (!userData) return "";
    return `${userData.userName.charAt(0)}${userData.userLastName.charAt(0)}`;
  };

  return (
    <aside className="left-sidebar">
      <div className="sidebar-container">
        <div className="logo">
          <img src={Logo2} alt="logo" />
        </div>
        <nav className="sidebar-nav">
          <ul className="site-nav">
            {navLinks.map(({ id, name, icon, link }) => (
              <SidebarItem key={id} name={name} icon={icon} link={link} />
            ))}
          </ul>
          <ul className="user-nav">
            {userNav.map(({ id, name, icon, link }) => (
              <SidebarItem key={id} name={name} icon={icon} link={link} />
            ))}
          </ul>

          {/* Блок профиля пользователя или кнопка "Войти" */}
          {isLoading ? (
            <div className="loading-placeholder">
              <div className="loading-spinner"></div>
              <span>Загрузка...</span>
            </div>
          ) : isAuthenticated && userData ? (
            <div className="user-profile">
              <div className="user-avatar">
                {userData.userPhoto ? (
                  <img src={userData.userPhoto} alt="Фото пользователя" />
                ) : (
                  <div className="user-initials">{getInitials()}</div>
                )}
              </div>
              <div className="user-data">
                <p className="user-name">{`${userData.userName} ${userData.userLastName}`}</p>
                <span className="email">{userData.userEmail}</span>
              </div>
              <button 
                className="logout-button" 
                onClick={handleLogout}
                title="Выйти"
                aria-label="Выйти из системы"
              >
                <FiLogOut />
              </button>
            </div>
          ) : (
            <button 
              className="button button-border login-button" 
              onClick={() => setShowLogin(true)}
            >
              Войти
            </button>
          )}
        </nav>
      </div>
    </aside>
  );
};

const SidebarItem = ({ name, icon, link }) => {
  return (
    <li className="sidebar-item">
      <NavLink
        to={link}
        className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
      >
        <span className="sidebar-icon">{icon}</span>
        <span className="hide-menu">{name}</span>
      </NavLink>
    </li>
  );
};

export default Nav;