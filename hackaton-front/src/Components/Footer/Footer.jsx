import React from "react";
import './Footer.css';

import { Link } from 'react-router-dom';

import {  ImFacebook } from 'react-icons/im';
import {  FiInstagram } from 'react-icons/fi';
import {  RiTwitterXLine } from 'react-icons/ri';
import {  GrLinkedinOption } from 'react-icons/gr';

export const FootersLinksData = {

  Aboutus: [
    { linkname: 'Наша цель', link: "*", },
    { linkname: 'Политика конфиденциальности', link: "*", },    
    { linkname: 'Поддержать', link: "*", },   
   
  ],    
  Discover: [
    { linkname: 'Главная', link: "*", },    
    { linkname: 'Цели', link: "*", },       
    { linkname: 'Бюджет', link: "*", },   
    { linkname: 'Аналитика', link: "*", },    
  ],    
  Myaccount: [
    { linkname: 'Уведомления', link: "*", },    
    { linkname: 'Настройки', link: "*", },           
  ],  

  Help: [
    { linkname: 'Центр помощи', link: "*", },    
    { linkname: 'Сообщить о проблеме', link: "*", },    
    { linkname: 'Настройки', link: "/settings", },    
    { linkname: 'Предложить улучшения', link: '*' } 
  ],  

  socials: [
    { icon: ImFacebook, link: 'https://www.facebook.com' },
    { icon: GrLinkedinOption, link: 'https://www.instagram.com' },
    { icon: RiTwitterXLine, link: 'https://www.twitter.com' },
    { icon: FiInstagram, link: 'https://www.twitter.com' }
  ],    
    
};

export default function Footer() {
    return( 
        <footer>
            <div className="container footer-container">
                <div>
                    <h4>О нас</h4>
                    <ul className="about-params param-links">
                        {
                            FootersLinksData.Aboutus.map(({link,linkname},index) => {
                                return (
                                    <li key={index}><Link to={link}>{linkname}</Link></li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div>
                    <h4>Навигация</h4>
                    <ul className="discover-params param-links">
                        {
                            FootersLinksData.Discover.map(({link,linkname},index) => {
                                return (
                                    <li key={index}><Link to={link}>{linkname}</Link></li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div>
                    <h4>Аккаунт</h4>
                    <ul className="account-params param-links">
                        {
                            FootersLinksData.Myaccount.map(({link,linkname},index) => {
                                return (
                                    <li key={index}><Link to={link}>{linkname}</Link></li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div>
                    <h4>Помощь</h4>
                    <ul className="help-params param-links">
                        {
                            FootersLinksData.Help.map(({link,linkname},index) => {
                                return (
                                    <li key={index}><Link to={link}>{linkname}</Link></li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
            <div className="footer-copyright">
              <div className="container copyright-container">
                  <p>Inari | Все права защищены | 2025</p>
                  <div className="footer-socials">
                      {
                          FootersLinksData.socials.map((item,index) => {
                              return(
                                  <a href={item.link}>
                                      <item.icon />
                                  </a>
                              )
                          })
                      }
                  </div>
              </div>
          </div>
        </footer>
    )
}