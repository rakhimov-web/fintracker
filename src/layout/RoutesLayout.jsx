import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Aside from "./aside/Aside";
import styles from "./RoutesLayout.module.css";

export default function RoutesLayout() {
  const isAuth = localStorage.getItem("isAuth") === "true";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  if (!isAuth) return <Navigate to="/login" replace />;

  return (
    <div className={styles.layout}>
      <Aside isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className={styles.body}>
        <header className={styles.topbar}>
          <button
            className={styles.menuBtn}
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 4h12M2 8h12M2 12h8"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div className={styles.topbarBrand}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 5H5C3.895 5 3 5.895 3 7v10c0 1.105.895 2 2 2h14c1.105 0 2-.895 2-2V7c0-1.105-.895-2-2-2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 11h5M12 15h3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span>Expenses</span>
          </div>
          <div className={styles.topbarSpacer} />
        </header>

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
