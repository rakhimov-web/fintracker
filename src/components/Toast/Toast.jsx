import React from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";
import styles from "./Toast.module.css";

export default function Toast({ toasts, removeToast }) {
  if (!toasts.length) return null;

  return (
    <div className={styles.container}>
      {toasts.map((t) => (
        <div key={t.id} className={`${styles.toast} ${styles[t.type]}`}>
          <span className={styles.icon}>
            {t.type === "success" && <FiCheckCircle />}
            {t.type === "error" && <FiAlertCircle />}
            {t.type === "info" && <FiInfo />}
          </span>
          <p className={styles.message}>{t.message}</p>
          <button className={styles.close} onClick={() => removeToast(t.id)}>
            <FiX />
          </button>
        </div>
      ))}
    </div>
  );
}
