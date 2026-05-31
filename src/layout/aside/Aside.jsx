import React from "react";
import { NavLink } from "react-router-dom";
import { links } from "../../components/constants/data";
import styles from "./aside.module.css";

export default function Aside() {
  return (
    <aside className={styles.aside}>
      <div className={styles.header}>
        <div className={styles.logoIcon}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 11H17M12 15H15"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className={styles.brand}>
          <h1 className={styles.title}>Xarajatlar</h1>
          <p className={styles.subtitle}>Boshqaruv tizimi</p>
        </div>
      </div>

      <nav className={styles.nav}>
        <ul className={styles.menuList}>
          {links.map((item, index) => {
            return (
              <li key={index}>
                <NavLink
                  to={item.path}
                  end={item.path === "/dashboard"}
                  className={({ isActive }) =>
                    `${styles.menuLink} ${isActive ? styles.active : ""}`
                  }
                >
                  <span className={styles.icon}>{item.icon}</span>
                  <span>{item.title}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
