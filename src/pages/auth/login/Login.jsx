import React, { useState, useEffect } from "react";
import styles from "./login.module.css";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/icons/logo.svg";
import Toast from "../../../components/Toast/Toast";
import { useToast } from "../../../components/Toast/useToast";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toasts, toast, removeToast } = useToast();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    fetch("https://api.jsonbin.io/v3/b/6a2579a0da38895dfe94f2fb/latest", {
      headers: {
        "X-Master-Key":
          "$2a$10$49JQn9KqhjJzG7.NmQS/web6eUaZEeIPAczvJF2hmWtPW3HDnQuUG",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const usersList = data.record.users || [];
        const foundUser = usersList.find(
          (u) => u.userEmail === email && u.userPass === password,
        );
        if (foundUser) {
          localStorage.setItem("isAuth", "true");
          localStorage.setItem("userId", String(foundUser.id));
          navigate("/dashboard");
        } else {
          toast({
            message: "User not found or incorrect password. Please sign up.",
            type: "error",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        toast({
          message: "An error occurred during sign in.",
          type: "error",
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className={styles.wrapper}>
      <Toast toasts={toasts} removeToast={removeToast} />

      <div className={styles.formCard}>
        <div className={styles.cardLogo}>
          <div className={styles.logoBg}>
            <img className={styles.logo} src={logo} alt="logo" />
          </div>
        </div>

        <div className={styles.cardHeading}>
          <h1 className={styles.cardTitle}>Welcome back</h1>
          <p className={styles.cardSubtitle}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email address</label>
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
                placeholder="you@example.com"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
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
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </span>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className={styles.footerText}>
          Don't have an account?{" "}
          <span
            className={styles.footerLink}
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
