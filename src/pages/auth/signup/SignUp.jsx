import React, { useState } from "react";
import styles from "./signUp.module.css";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/icons/logo.svg";
import Toast from "../../../components/Toast/Toast";
import { useToast } from "../../../components/Toast/useToast";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toasts, toast, removeToast } = useToast();

  const handleRegister = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({ message: "Passwords do not match.", type: "error" });
      return;
    }

    setLoading(true);

    const newAccount = {
      id: Math.random().toString(36).substring(2, 6),
      userName: name,
      userEmail: email,
      userPass: password,
    };

    fetch("https://api.jsonbin.io/v3/b/6a2579a0da38895dfe94f2fb/latest", {
      headers: {
        "X-Master-Key":
          "$2a$10$49JQn9KqhjJzG7.NmQS/web6eUaZEeIPAczvJF2hmWtPW3HDnQuUG",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const currentData = data.record || {};
        const updatedUsers = [...(currentData.users || []), newAccount];

        return fetch("https://api.jsonbin.io/v3/b/6a2579a0da38895dfe94f2fb", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Master-Key":
              "$2a$10$49JQn9KqhjJzG7.NmQS/web6eUaZEeIPAczvJF2hmWtPW3HDnQuUG",
          },
          body: JSON.stringify({
            ...currentData,
            users: updatedUsers,
          }),
        });
      })
      .then(() => {
        toast({ message: "Account created! Please sign in.", type: "success" });
        setTimeout(() => navigate("/login"), 1500);
      })
      .catch((err) => {
        console.error(err);
        toast({
          message: "An error occurred during registration.",
          type: "error",
        });
      })
      .finally(() => setLoading(false));
  };

  const EyeOpen = () => (
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
  );

  const EyeClosed = () => (
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
  );

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
          <h1 className={styles.cardTitle}>Create account</h1>
          <p className={styles.cardSubtitle}>
            Enter your details to get started
          </p>
        </div>

        <form onSubmit={handleRegister} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full name</label>
            <div className={styles.inputWrapper}>
              <svg
                className={styles.inputIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                type="text"
                placeholder="Your name"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

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
                {showPassword ? <EyeClosed /> : <EyeOpen />}
              </span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Confirm password</label>
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
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className={styles.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                className={styles.eyeIcon}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeClosed /> : <EyeOpen />}
              </span>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account?{" "}
          <span
            className={styles.footerLink}
            onClick={() => navigate("/login")}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
