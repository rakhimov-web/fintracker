import React, { useState, useEffect } from "react";
import styles from "./login.module.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((usersList) => {
        const foundUser = usersList.find(
          (u) => u.userEmail === email && u.userPass === password,
        );

        if (foundUser) {
          localStorage.setItem("isAuth", "true");
          localStorage.setItem("userId", String(foundUser.id));
          navigate("/dashboard");
        } else {
          alert(
            "Foydalanuvchi topilmadi yoki parol xato. Iltimos ro'yxatdan o'ting!",
          );
        }
      });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.loginCard}>
        <div className={styles.logoContainer}>
          <div className={styles.logoBg}>
            <svg
              className={styles.logoIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>

        <h2 className={styles.title}>Xush kelibsiz</h2>
        <p className={styles.subtitle}>Hisobingizga kiring</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email manzil</label>
            <div className={styles.inputWrapper}>
              <svg
                className={styles.inputIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                type="email"
                placeholder="example@mail.com"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Parol</label>
            <div className={styles.inputWrapper}>
              <svg
                className={styles.inputIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type="password"
                placeholder="••••••••"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Kirish
          </button>
        </form>

        <p className={styles.footerText}>
          Hisobingiz yo'qmi?{" "}
          <span
            className={styles.registerLink}
            onClick={() => navigate("/signup")}
            style={{ cursor: "pointer" }}
          >
            Ro'yxatdan o'tish
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
