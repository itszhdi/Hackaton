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

import Logo2 from "/assets/MainElemets/Logo2.png";
import user from "/assets/MainElemets/user.png";

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

  // Функция для выхода из системы
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUserData(null);
  };

  // Функция для получения данных пользователя
  const fetchUserData = async () => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }
    
    const localUserData = localStorage.getItem('userData');
    
    if (localUserData) {
      try {
        const parsedData = JSON.parse(localUserData);
        setUserData(parsedData);
        setIsAuthenticated(true);
        setIsLoading(false);
        return; // Если есть данные в localStorage, не делаем запрос к API
      } catch (e) {
        console.error("Ошибка при парсинге данных из localStorage:", e);
      }
    }
    
    // Если данных нет в localStorage или произошла ошибка, делаем запрос к API
    try {
      const response = await axios.get(`${API_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      // Сохраняем данные в localStorage
      localStorage.setItem('userData', JSON.stringify(response.data));
      setUserData(response.data);
      setTimeout(() => {
        window.location.reload(); // Страница перезагрузится
      }, 1000);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
      
      if (error.response && error.response.status === 401) {
        await refreshToken();
      } else {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

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
      
      fetchUserData();
    } catch (error) {
      console.error("Error refreshing token:", error);
      handleLogout();
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const displayName = userData ? (userData.firstName || userData.userName || '') : '';
  const displayLastName = userData ? (userData.lastName || userData.userLastName || '') : '';
  const displayEmail = userData ? (userData.email || userData.userEmail || '') : '';

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

          {isLoading ? (
            <div className="loading-placeholder">Загрузка...</div>
          ) : isAuthenticated && userData ? (
              <div className="profile">
              <img src={user} alt="" className="user-photo" />
              <div className="user-information">
                <p className="user-name">{`${displayName} ${displayLastName}`}</p>
                <p className="email">{displayEmail}</p>
              </div>
            </div>
          ) : (
            <button 
              className="button button-border nav-button" 
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