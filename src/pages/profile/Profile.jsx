import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiCreditCard,
  FiDollarSign,
  FiActivity,
  FiLock,
  FiEye,
  FiShield,
  FiSettings,
  FiBell,
  FiMoon,
  FiLogOut,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styles from "./profile.module.css";
import Toast from "../../components/Toast/Toast";
import { useToast } from "../../components/Toast/useToast";

export default function Profile() {
  const navigate = useNavigate();
  const { toasts, toast, removeToast } = useToast();
  const [currentUser, setCurrentUser] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [address, setAddress] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [isDark, setIsDark] = useState(
    () => document.documentElement.getAttribute("data-theme") === "dark",
  );

  const currentUserId = localStorage.getItem("userId") || "";

  useEffect(() => {
    fetch("https://api.jsonbin.io/v3/b/6a2579a0da38895dfe94f2fb/latest", {
      headers: {
        "X-Master-Key":
          "$2a$10$49JQn9KqhjJzG7.NmQS/web6eUaZEeIPAczvJF2hmWtPW3HDnQuUG",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const users = data.record.users || [];
        if (users.length > 0) {
          let user = users.find((u) => String(u.id) === String(currentUserId));
          if (!user) {
            user = users[users.length - 1];
          }
          setCurrentUser(user);
          setName(user.userName || "");
          setEmail(user.userEmail || "");
          setPhone(user.phone || "+998 ");
          setAddress(user.address || "");
        }
      })
      .catch((err) => console.error(err));
  }, [currentUserId]);

  const handleThemeToggle = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  };

  const handlePhoneChange = (e) => {
    let input = e.target.value;
    if (!input.startsWith("+998 ")) {
      input = "+998 ";
    }
    const digits = input.slice(5).replace(/\D/g, "");
    const truncated = digits.slice(0, 9);
    let formatted = "+998 ";
    if (truncated.length > 0) formatted += truncated.slice(0, 2);
    if (truncated.length > 2) formatted += " " + truncated.slice(2, 5);
    if (truncated.length > 5) formatted += " " + truncated.slice(5, 7);
    if (truncated.length > 7) formatted += " " + truncated.slice(7, 9);
    setPhone(formatted);
  };

  const handleSaveInfo = (e) => {
    e.preventDefault();
    if (!currentUser) return;

    fetch("https://api.jsonbin.io/v3/b/6a2579a0da38895dfe94f2fb/latest", {
      headers: {
        "X-Master-Key":
          "$2a$10$49JQn9KqhjJzG7.NmQS/web6eUaZEeIPAczvJF2hmWtPW3HDnQuUG",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const allUsers = data.record.users || [];
        const updatedUser = {
          ...currentUser,
          userName: name,
          userEmail: email,
          phone: phone,
          address: address,
        };
        const updatedUsers = allUsers.map((u) =>
          String(u.id) === String(currentUser.id) ? updatedUser : u,
        );

        return fetch("https://api.jsonbin.io/v3/b/6a2579a0da38895dfe94f2fb", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Master-Key":
              "$2a$10$49JQn9KqhjJzG7.NmQS/web6eUaZEeIPAczvJF2hmWtPW3HDnQuUG",
          },
          body: JSON.stringify({
            ...data.record,
            users: updatedUsers,
          }),
        }).then((res) => {
          if (res.ok) {
            setCurrentUser(updatedUser);
            toast({
              message: "Profile updated successfully.",
              type: "success",
            });
          }
        });
      })
      .catch((err) => console.error(err));
  };

  const handlePasswordUpdate = () => {
    if (!oldPassword || !newPassword) {
      toast({ message: "Please fill in both password fields.", type: "error" });
      return;
    }
    if (oldPassword !== newPassword) {
      toast({ message: "Passwords do not match.", type: "error" });
      return;
    }
    if (!currentUser) return;

    fetch("https://api.jsonbin.io/v3/b/6a2579a0da38895dfe94f2fb/latest", {
      headers: {
        "X-Master-Key":
          "$2a$10$49JQn9KqhjJzG7.NmQS/web6eUaZEeIPAczvJF2hmWtPW3HDnQuUG",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const allUsers = data.record.users || [];
        const updatedUser = { ...currentUser, userPass: newPassword };
        const updatedUsers = allUsers.map((u) =>
          String(u.id) === String(currentUser.id) ? updatedUser : u,
        );

        return fetch("https://api.jsonbin.io/v3/b/6a2579a0da38895dfe94f2fb", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Master-Key":
              "$2a$10$49JQn9KqhjJzG7.NmQS/web6eUaZEeIPAczvJF2hmWtPW3HDnQuUG",
          },
          body: JSON.stringify({
            ...data.record,
            users: updatedUsers,
          }),
        }).then((res) => {
          if (res.ok) {
            setOldPassword("");
            setNewPassword("");
            toast({
              message: "Password updated. Signing out...",
              type: "success",
            });
            setTimeout(() => {
              localStorage.removeItem("isAuth");
              navigate("/login");
            }, 1500);
          }
        });
      })
      .catch((err) => console.error(err));
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    navigate("/login");
  };

  const disabledStyle = {
    opacity: 0.4,
    pointerEvents: "none",
    cursor: "not-allowed",
  };

  return (
    <div className={styles.container}>
      <Toast toasts={toasts} removeToast={removeToast} />

      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Profile</h1>
          <p className={styles.subtitle}>Manage your personal information</p>
        </div>
      </header>

      <div className={styles.contentGrid}>
        <div className={styles.leftColumn}>
          <div className={styles.card}>
            <div className={styles.userHeader}>
              <div className={styles.avatarWrapper}>
                <div className={styles.avatar}>
                  <FiUser />
                </div>
              </div>
              <div className={styles.userInfo}>
                <h2 className={styles.userName}>{name || "User"}</h2>
                <p className={styles.userEmail}>
                  {email || "user@example.com"}
                </p>
                <div className={styles.badges}>
                  <span className={`${styles.badge} ${styles.premium}`}>
                    Premium
                  </span>
                  <span className={`${styles.badge} ${styles.active}`}>
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.sectionTitle}>
              <FiUser /> Personal information
            </h3>
            <form className={styles.form} onSubmit={handleSaveInfo}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={handlePhoneChange}
                  className={styles.input}
                  placeholder="+998 90 123 45 67"
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={styles.input}
                  placeholder="Enter your address"
                />
              </div>
              <button type="submit" className={styles.saveBtn}>
                Save changes
              </button>
            </form>
          </div>

          <div className={styles.card}>
            <h3 className={styles.sectionTitle}>
              <FiShield /> Security
            </h3>
            <div className={styles.securitySection}>
              <div className={styles.securityHeader}>
                <FiLock className={styles.securityIcon} />
                <div>
                  <h4 className={styles.securityTitle}>Change password</h4>
                  <p className={styles.securitySub}>Last changed 30 days ago</p>
                </div>
              </div>
              <div className={styles.passwordForm}>
                <div
                  className={styles.passwordWrapper}
                  style={{ position: "relative" }}
                >
                  <input
                    type={showOldPass ? "text" : "password"}
                    placeholder="New password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className={styles.input}
                    style={{ paddingRight: "40px" }}
                  />
                  <FiEye
                    className={styles.eyeIcon}
                    onClick={() => setShowOldPass(!showOldPass)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  />
                </div>
                <div
                  className={styles.passwordWrapper}
                  style={{ position: "relative" }}
                >
                  <input
                    type={showNewPass ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={styles.input}
                    style={{ paddingRight: "40px" }}
                  />
                  <FiEye
                    className={styles.eyeIcon}
                    onClick={() => setShowNewPass(!showNewPass)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handlePasswordUpdate}
                  className={styles.updatePasswordBtn}
                >
                  Update password
                </button>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.twoFactorRow} style={disabledStyle}>
              <div className={styles.twoFactorText}>
                <h4 className={styles.securityTitle}>
                  Two-factor authentication
                </h4>
                <p className={styles.securitySub}>
                  Add an extra layer of security
                </p>
              </div>
              <button className={styles.toggleBtn} disabled>
                Enable
              </button>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.sectionTitle}>
              <FiSettings /> Preferences
            </h3>
            <div className={styles.settingsList}>
              <div className={styles.settingsItem} style={disabledStyle}>
                <div className={styles.settingsLeft}>
                  <FiBell />
                  <div>
                    <span className={styles.settingName}>
                      Push notifications
                    </span>
                    <p className={styles.settingDesc}>
                      Alerts for new expenses
                    </p>
                  </div>
                </div>
                <label className={styles.switch}>
                  <input type="checkbox" disabled />
                  <span className={styles.slider} />
                </label>
              </div>

              <div className={styles.settingsItem} style={disabledStyle}>
                <div className={styles.settingsLeft}>
                  <FiMail />
                  <div>
                    <span className={styles.settingName}>
                      Email notifications
                    </span>
                    <p className={styles.settingDesc}>
                      Weekly spending reports
                    </p>
                  </div>
                </div>
                <label className={styles.switch}>
                  <input type="checkbox" disabled />
                  <span className={styles.slider} />
                </label>
              </div>

              <div className={styles.settingsItem}>
                <div className={styles.settingsLeft}>
                  <FiMoon />
                  <div>
                    <span className={styles.settingName}>Dark mode</span>
                    <p className={styles.settingDesc}>
                      Switch to dark interface
                    </p>
                  </div>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={isDark}
                    onChange={handleThemeToggle}
                  />
                  <span className={styles.slider} />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.card}>
            <h3 className={styles.sideTitle}>
              <FiActivity /> Statistics
            </h3>
            <div className={styles.sideStatsList}>
              <div className={styles.sideStatItem}>
                <div className={styles.statIconBg}>
                  <FiCalendar />
                </div>
                <div>
                  <p className={styles.statLabel}>Member since</p>
                  <h4 className={styles.statValue}>Jan 15, 2026</h4>
                </div>
              </div>
              <div className={styles.sideStatItem}>
                <div className={styles.statIconBg}>
                  <FiCreditCard />
                </div>
                <div>
                  <p className={styles.statLabel}>Total transactions</p>
                  <h4 className={styles.statValue}>847</h4>
                </div>
              </div>
              <div className={styles.sideStatItem}>
                <div
                  className={styles.statIconBg}
                  style={{
                    color: "var(--expense)",
                    backgroundColor: "var(--expense-bg)",
                    borderColor: "var(--expense-border)",
                  }}
                >
                  <FiDollarSign />
                </div>
                <div>
                  <p className={styles.statLabel}>Total expenses</p>
                  <h4
                    className={styles.statValue}
                    style={{ color: "var(--expense)" }}
                  >
                    12,450,000
                  </h4>
                </div>
              </div>
              <div className={styles.sideStatItem}>
                <div
                  className={styles.statIconBg}
                  style={{
                    color: "var(--income)",
                    backgroundColor: "var(--income-bg)",
                    borderColor: "var(--income-border)",
                  }}
                >
                  <FiDollarSign />
                </div>
                <div>
                  <p className={styles.statLabel}>Total income</p>
                  <h4
                    className={styles.statValue}
                    style={{ color: "var(--income)" }}
                  >
                    24,000,000
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.sideTitle}>Account actions</h3>
            <div className={styles.actionLinks}>
              <button className={styles.actionLink} style={disabledStyle}>
                <FiMapPin /> Update address
              </button>
              <button className={styles.actionLink} style={disabledStyle}>
                <FiCreditCard /> Manage payment methods
              </button>
              <button className={styles.actionLink} style={disabledStyle}>
                <FiShield /> Privacy settings
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className={`${styles.actionLink} ${styles.logout}`}
              >
                <FiLogOut /> Sign out
              </button>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.sideTitle}>Recent activity</h3>
            <div className={styles.timeline}>
              <div className={styles.timelineItem}>
                <div
                  className={styles.dot}
                  style={{ backgroundColor: "var(--income)" }}
                />
                <div className={styles.timelineContent}>
                  <p className={styles.timelineText}>Password updated</p>
                  <span className={styles.timelineTime}>2 hours ago</span>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div
                  className={styles.dot}
                  style={{ backgroundColor: "#3B82F6" }}
                />
                <div className={styles.timelineContent}>
                  <p className={styles.timelineText}>Profile edited</p>
                  <span className={styles.timelineTime}>1 day ago</span>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div
                  className={styles.dot}
                  style={{ backgroundColor: "#A855F7" }}
                />
                <div className={styles.timelineContent}>
                  <p className={styles.timelineText}>New device login</p>
                  <span className={styles.timelineTime}>3 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
