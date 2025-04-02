import React, { useState, useEffect } from "react";
import "./Nav.css";
import { Link, NavLink } from "react-router-dom";

import { GoHome } from "react-icons/go";
import { CiDollar } from "react-icons/ci";
import { GoGoal } from "react-icons/go";
import { IoAnalyticsOutline } from "react-icons/io5";
import { IoIosNotificationsOutline } from "react-icons/io";
import { VscSettings } from "react-icons/vsc";

import Logo2 from "/assets/MainElemets/Logo2.png";
import user from "/assets/MainElemets/user.png"

const navLinks = [
  { id: 1, name: "Главная", icon: <GoHome />, link: "/" },
  { id: 2, name: "Бюджет", icon: <CiDollar />, link: "/budget" },
  { id: 3, name: "Цели", icon: <GoGoal />, link: "/targets" },
  { id: 4, name: "Аналитика", icon: <IoAnalyticsOutline />, link: "/wallet" },
];

const userNav = [
  { id: 1, name: "Уведомления", icon: <IoIosNotificationsOutline />, link: "/notifications" },
  { id: 2, name: "Настройки", icon: <VscSettings />, link: "/profile" },
];

const Nav = ( {setShowLogin} ) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
          {isAuthenticated ? (
            <div className="user-profile">
              <img src={user} alt="" className="user-photo" />
              <div className="user-data">
                <p className="user-name">Трофим Быстрицкий</p>
                <span className="email">moera@mail.ru</span>
              </div>
            </div>
          ) : (
            <button className="button button-border nav-button" onClick={() => setShowLogin(true)}>
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