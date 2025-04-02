import React, { useState, useEffect, useRef } from "react";
import "./Login.css";
import { IoCloseOutline } from "react-icons/io5";

export default function Login({ setShowLogin }) {
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
  const [step, setStep] = useState("main"); // main, verify, reset-email, reset-verify, reset-password
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (step === "main") {
      if (!email || !password) {
        setErrorMessage("Пожалуйста, заполните все поля");
        return;
      }

      if (currentState === "Регистрация") {
        if (!firstName || !lastName) {
          setErrorMessage("Введите имя и фамилию");
          return;
        }

        if (password.length < 8) {
          setErrorMessage("Пароль должен содержать минимум 8 символов");
          return;
        }

        if (password !== confirmPassword) {
          setErrorMessage("Пароли не совпадают");
          return;
        }

        console.log("Регистрация:", { email, password, firstName, lastName });

        // Имитируем отправку кода на email
        setStep("verify");
      } else {
        console.log("Авторизация:", { email, password });
        // Авторизация прошла успешно
        setShowLogin(false);
      }
    } 
    
    else if (step === "verify") {
      if (!verificationCode) {
        setErrorMessage("Введите код подтверждения");
        return;
      }

      console.log("Код подтверждения:", verificationCode);
      setShowLogin(false);
    } 
    
    else if (step === "reset-email") {
      if (!email) {
        setErrorMessage("Введите email");
        return;
      }

      console.log("Восстановление пароля - email:", email);
      setStep("reset-verify");
    } 
    
    else if (step === "reset-verify") {
      if (!verificationCode) {
        setErrorMessage("Введите код подтверждения");
        return;
      }

      console.log("Восстановление пароля - код:", verificationCode);
      setStep("reset-password");
    } 
    
    else if (step === "reset-password") {
      if (newPassword.length < 8) {
        setErrorMessage("Пароль должен содержать минимум 8 символов");
        return;
      }

      if (newPassword !== confirmNewPassword) {
        setErrorMessage("Пароли не совпадают");
        return;
      }

      console.log("Новый пароль установлен");
      setStep("main");
      setCurrentState("Авторизация");
    }

    setErrorMessage("");
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
                <a href="#" onClick={() => setStep("reset-email")}>
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

        <button type="submit" className="button button-border">
          {step === "verify" || step === "reset-email"|| step === "reset-verify" ? "Подтвердить" : step === "reset-password" ? "Сохранить" : currentState}
        </button>

        {step === "main" && (
          <p>
            {currentState === "Регистрация" ? "Уже есть аккаунт?" : "Нет аккаунта?"}{" "}
            <span onClick={() => { setCurrentState(currentState === "Регистрация" ? "Авторизация" : "Регистрация"); setErrorMessage(""); }}>
              {currentState === "Регистрация" ? "Войти" : "Зарегистрироваться"}
            </span>
          </p>
        )}
      </form>
    </div>
  );
}
