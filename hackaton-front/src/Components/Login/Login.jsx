import React, { useState, useEffect, useRef } from "react";
import "./Login.css";
import { IoCloseOutline } from "react-icons/io5";
import axios from "axios";

// API base URL - adjust according to your backend configuration
const API_URL = "http://localhost:8000";

export default function Login({ setShowLogin, onLoginSuccess = () => {} }) {
  const [currentState, setCurrentState] = useState("Регистрация");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [step, setStep] = useState("main");
  const [isLoading, setIsLoading] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowLogin(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowLogin]);

  // Reset error message when changing states
  useEffect(() => {
    setErrorMessage("");
    setSuccessMessage("");
  }, [currentState, step]);

  // Функция для ручного вызова события изменения localStorage
  const triggerStorageEvent = (key, value) => {
    // Создаем и диспатчим пользовательское событие
    const event = new Event('storage');
    document.dispatchEvent(event);
    window.dispatchEvent(event);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);
    
    try {
      if (step === "main") {
        if (!email || !password) {
          setErrorMessage("Пожалуйста, заполните все поля");
          setIsLoading(false);
          return;
        }

        if (currentState === "Регистрация") {
          if (!firstName || !lastName) {
            setErrorMessage("Введите имя и фамилию");
            setIsLoading(false);
            return;
          }

          if (password.length < 8) {
            setErrorMessage("Пароль должен содержать минимум 8 символов");
            setIsLoading(false);
            return;
          }

          if (password !== confirmPassword) {
            setErrorMessage("Пароли не совпадают");
            setIsLoading(false);
            return;
          }

          // Registration API call
          const response = await axios.post(`${API_URL}/auth/register`, {
            userEmail: email,
            userName: firstName,
            userLastName: lastName,
            password: password
          });

          if (response.data.status === "success") {
            setSuccessMessage("Код подтверждения отправлен на вашу почту");
            setStep("verify");
          }
        } else {
          // Login API call
          const formData = new URLSearchParams();
          formData.append('username', email);
          formData.append('password', password);

          const response = await axios.post(`${API_URL}/auth/token`, formData, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
          
          // Save tokens in localStorage
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          
          // Вызываем событие хранилища после успешного входа
          triggerStorageEvent('accessToken', response.data.accessToken);
          
          // Загружаем данные пользователя сразу после авторизации
          try {
            const userResponse = await axios.get(`${API_URL}/user/me`, {
              headers: {
                Authorization: `Bearer ${response.data.accessToken}`
              }
            });
            
            // Сохраняем базовую информацию о пользователе для мгновенного отображения
            localStorage.setItem('currentUser', JSON.stringify(userResponse.data));
            triggerStorageEvent('currentUser', JSON.stringify(userResponse.data));
          } catch (error) {
            console.error("Error fetching user data after login:", error);
          }
          
          // Уведомляем родительский компонент об успешной авторизации
          if (typeof onLoginSuccess === 'function') {
            onLoginSuccess();
          }
          
          setSuccessMessage("Вход выполнен успешно");
          setTimeout(() => setShowLogin(false), 1000);
        }
      } 
      
      else if (step === "verify") {
        if (!verificationCode) {
          setErrorMessage("Введите код подтверждения");
          setIsLoading(false);
          return;
        }

        // Email verification API call
        const response = await axios.post(`${API_URL}/auth/verify`, {
          userEmail: email,
          userName: firstName,
          userLastName: lastName,
          verificationCode: verificationCode
        });

        if (response.data.status === "success") {
          setSuccessMessage("Email успешно подтвержден! Теперь вы можете войти");
          setTimeout(() => {
            setStep("main");
            setCurrentState("Авторизация");
          }, 1500);
        }
      } 
      
      else if (step === "reset-email") {
        if (!email) {
          setErrorMessage("Введите email");
          setIsLoading(false);
          return;
        }

        // Password recovery request API call
        const response = await axios.post(`${API_URL}/auth/recovery`, {
          userEmail: email
        });

        if (response.data.status === "success") {
          setSuccessMessage("Код для восстановления пароля отправлен на вашу почту");
          setStep("reset-verify");
        }
      } 
      
      else if (step === "reset-verify") {
        if (!verificationCode) {
          setErrorMessage("Введите код подтверждения");
          setIsLoading(false);
          return;
        }

        // Validation successful, move to password reset step
        setStep("reset-password");
      } 
      
      else if (step === "reset-password") {
        if (newPassword.length < 8) {
          setErrorMessage("Пароль должен содержать минимум 8 символов");
          setIsLoading(false);
          return;
        }

        if (newPassword !== confirmNewPassword) {
          setErrorMessage("Пароли не совпадают");
          setIsLoading(false);
          return;
        }

        // Password reset confirmation API call
        const response = await axios.post(`${API_URL}/auth/recovery/confirm`, {
          userEmail: email,
          verificationCode: verificationCode,
          newPassword: newPassword
        });

        if (response.data.status === "success") {
          setSuccessMessage("Пароль успешно изменен");
          setTimeout(() => {
            setStep("main");
            setCurrentState("Авторизация");
          }, 1500);
        }
      }
    } catch (error) {
      console.error("API Error:", error);
      if (error.response && error.response.data && error.response.data.detail) {
        setErrorMessage(error.response.data.detail);
      } else {
        setErrorMessage("Произошла ошибка. Пожалуйста, попробуйте снова.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" ref={popupRef} onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <h3>
            {step === "verify" && "Подтверждение email"}
            {step === "reset-email" && "Восстановление пароля"}
            {step === "reset-verify" && "Подтверждение email"}
            {step === "reset-password" && "Новый пароль"}
            {step === "main" && currentState}
          </h3>
          <IoCloseOutline onClick={() => setShowLogin(false)} />
        </div>

        {step === "main" && (
          <div className="login-popup-inputs">
            {currentState === "Регистрация" && (
              <>
                <input type="text" placeholder="Имя" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                <input type="text" placeholder="Фамилия" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </>
            )}

            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {currentState === "Авторизация" && (
              <span className="forget-pass">
                <a href="#" onClick={(e) => {e.preventDefault(); setStep("reset-email")}}>
                  Забыли пароль?
                </a>
              </span>
            )}

            {currentState === "Регистрация" && (
              <input type="password" placeholder="Повторите пароль" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            )}
          </div>
        )}

        {step === "verify" && (
          <div className="login-popup-inputs">
            <p className="info-message">Введите код подтверждения, который был отправлен на {email}</p>
            <input type="text" placeholder="Введите код с почты" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required />
          </div>
        )}

        {step === "reset-email" && (
          <div className="login-popup-inputs">
            <input type="email" placeholder="Введите ваш email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        )}

        {step === "reset-verify" && (
          <div className="login-popup-inputs">
            <p className="info-message">Введите код, отправленный на {email}</p>
            <input type="text" placeholder="Введите код с почты" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required />
          </div>
        )}

        {step === "reset-password" && (
          <div className="login-popup-inputs">
            <input type="password" placeholder="Введите новый пароль" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <input type="password" placeholder="Повторите новый пароль" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
          </div>
        )}

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <button type="submit" className="button button-border" disabled={isLoading}>
          {isLoading ? "Загрузка..." : 
            (step === "verify" || step === "reset-email" || step === "reset-verify" ? 
              "Подтвердить" : step === "reset-password" ? "Сохранить" : currentState)
          }
        </button>

        {step === "main" && (
          <p>
            {currentState === "Регистрация" ? "Уже есть аккаунт?" : "Нет аккаунта?"}{" "}
            <span onClick={() => { setCurrentState(currentState === "Регистрация" ? "Авторизация" : "Регистрация"); setErrorMessage(""); }}>
              {currentState === "Регистрация" ? "Войти" : "Зарегистрироваться"}
            </span>
          </p>
        )}

        {step !== "main" && (
          <p>
            <span onClick={() => { setStep("main"); setErrorMessage(""); }}>
              Вернуться назад
            </span>
          </p>
        )}
      </form>
    </div>
  );
}