import React from "react";
import { NavLink } from "react-router-dom";
import { links } from "../../components/constants/data";
import styles from "./aside.module.css";
import logo from "../../assets/icons/logo.svg";

export default function Aside({ isOpen, onClose }) {
  return (
    <aside className={`${styles.aside} ${isOpen ? styles.open : ""}`}>
      <div className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logoMark}>
            <img className={styles.logo} src={logo} alt="logo" />
            {/* <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
                stroke="#0D0D0C"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 11H17M12 15H15"
                stroke="#0D0D0C"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg> */}
          </div>
          <div>
            <p className={styles.brandName}>Expenses</p>
            <p className={styles.brandSub}>Management System</p>
          </div>
        </div>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 1l12 12M13 1L1 13"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <nav className={styles.nav}>
        <span className={styles.navLabel}>Navigation</span>
        <ul className={styles.menuList}>
          {links.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                end={item.path === "/dashboard"}
                onClick={onClose}
                className={({ isActive }) =>
                  `${styles.menuLink} ${isActive ? styles.active : ""}`
                }
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.label}>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.footer}>
        <span className={styles.footerBadge}>v1.0</span>
      </div>
    </aside>
  );
}
