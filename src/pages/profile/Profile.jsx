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
import profileImg from '../../assets/images/profile-img.png'
import styles from "./profile.module.css";

export default function Profile() {
  const navigate = useNavigate();
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
    document.body.classList.contains("darkTheme"),
  );

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((users) => {
        if (users.length > 0) {
          const user = users[users.length - 1];
          setCurrentUser(user);
          setName(user.userName || "");
          setEmail(user.userEmail || "");
          setPhone(user.phone || "+998 ");
          setAddress(user.address || "");
        }
      });
  }, []);

  const handleThemeToggle = () => {
    document.body.classList.toggle("darkTheme");
    setIsDark(!isDark);
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
    const updatedData = {
      userName: name,
      userEmail: email,
      phone: phone,
      address: address,
    };
    fetch(`http://localhost:5000/users/${currentUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((data) => {
        setCurrentUser(data);
        alert("Ma'lumotlaringiz bazada muvaffaqiyatli yangilandi, Bro!");
      });
  };

  const handlePasswordUpdate = () => {
    if (!oldPassword || !newPassword) {
      alert("Iltimos, ikkala parol maydonini ham to'ldiring!");
      return;
    }
    if (oldPassword !== newPassword) {
      alert("Kiritilgan parollar bir-biriga mos kelmadi!");
      return;
    }
    if (!currentUser) return;

    fetch(`http://localhost:5000/users/${currentUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userPass: newPassword }),
    }).then(() => {
      setOldPassword("");
      setNewPassword("");
      alert("Parolingiz muvaffaqiyatli o'zgartirildi! Tizimdan chiqiladi.");
      localStorage.removeItem("isAuth");
      navigate("/login");
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    navigate("/login");
  };

  const disabledStyle = {
    opacity: 0.5,
    pointerEvents: "none",
    cursor: "not-allowed",
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1>Profil</h1>
          <p className={styles.subtitle}>
            Shaxsiy ma'lumotlaringizni boshqaring
          </p>
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
                <h2 className={styles.userName}>{name || "Foydalanuvchi"}</h2>
                <p className={styles.userEmail}>
                  {email || "user@example.com"}
                </p>
                <div className={styles.badges}>
                  <span className={`${styles.badge} ${styles.premium}`}>
                    Premium foydalanuvchi
                  </span>
                  <span className={`${styles.badge} ${styles.active}`}>
                    Faol
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.sectionTitle}>
              <FiUser /> Shaxsiy ma'lumotlar
            </h3>
            <form className={styles.form} onSubmit={handleSaveInfo}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Ism</label>
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
                <label className={styles.label}>Telefon</label>
                <input
                  type="text"
                  value={phone}
                  onChange={handlePhoneChange}
                  className={styles.input}
                  placeholder="+998 90 123 45 67"
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Manzil</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={styles.input}
                  placeholder="Manzilingizni kiriting"
                />
              </div>
              <button type="submit" className={styles.saveBtn}>
                O'zgarishlarni saqlash
              </button>
            </form>
          </div>

          <div className={styles.card}>
            <h3 className={styles.sectionTitle}>
              <FiShield /> Xavfsizlik sozlamalari
            </h3>
            <div className={styles.securitySection}>
              <div className={styles.securityHeader}>
                <FiLock className={styles.securityIcon} />
                <div>
                  <h4 className={styles.securityTitle}>Parolni o'zgartirish</h4>
                  <p className={styles.securitySub}>
                    Oxirgi o'zgarish: 30 kun oldin
                  </p>
                </div>
              </div>
              <div className={styles.passwordForm}>
                <div
                  className={styles.passwordWrapper}
                  style={{ position: "relative" }}
                >
                  <input
                    type={showOldPass ? "text" : "password"}
                    placeholder="Yangi parol"
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
                    placeholder="Yangi parolni tasdiqlang"
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
                  Parolni yangilash
                </button>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.twoFactorRow} style={disabledStyle}>
              <div className={styles.twoFactorText}>
                <h4 className={styles.securityTitle}>
                  Ikki bosqichli autentifikatsiya
                </h4>
                <p className={styles.securitySub}>
                  Qo'shimcha xavfsizlik qatlami
                </p>
              </div>
              <button className={styles.toggleBtn} disabled>
                Yoqish
              </button>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.sectionTitle}>
              <FiSettings /> Sozlamalar
            </h3>
            <div className={styles.settingsList}>
              <div className={styles.settingsItem} style={disabledStyle}>
                <div className={styles.settingsLeft}>
                  <FiBell />
                  <div>
                    <span className={styles.settingName}>
                      Push bildirishnomalar
                    </span>
                    <p className={styles.settingDesc}>
                      Yangi xarajatlar haqida xabarnoma
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
                      Email xabarnomalar
                    </span>
                    <p className={styles.settingDesc}>Haftalik hisobotlar</p>
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
                    <span className={styles.settingName}>Tungi rejim</span>
                    <p className={styles.settingDesc}>Qorong'i interfeys</p>
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
              <FiActivity /> Statistika
            </h3>
            <div className={styles.sideStatsList}>
              <div className={styles.sideStatItem}>
                <div className={styles.statIconBg}>
                  <FiCalendar />
                </div>
                <div>
                  <p className={styles.statLabel}>Ro'yxatdan o'tgan</p>
                  <h4 className={styles.statValue}>15 Yanvar, 2026</h4>
                </div>
              </div>
              <div className={styles.sideStatItem}>
                <div className={styles.statIconBg}>
                  <FiCreditCard />
                </div>
                <div>
                  <p className={styles.statLabel}>Jami tranzaksiyalar</p>
                  <h4 className={styles.statValue}>847</h4>
                </div>
              </div>
              <div className={styles.sideStatItem}>
                <div
                  className={styles.statIconBg}
                  style={{
                    color: "var(--color-red)",
                    backgroundColor: "rgba(212, 24, 61, 0.1)",
                  }}
                >
                  <FiDollarSign />
                </div>
                <div>
                  <p className={styles.statLabel}>Jami xarajat</p>
                  <h4
                    className={styles.statValue}
                    style={{ color: "var(--color-red)" }}
                  >
                    12,450,000 so'm
                  </h4>
                </div>
              </div>
              <div className={styles.sideStatItem}>
                <div
                  className={styles.statIconBg}
                  style={{
                    color: "var(--color-green)",
                    backgroundColor: "rgba(0, 201, 80, 0.1)",
                  }}
                >
                  <FiDollarSign />
                </div>
                <div>
                  <p className={styles.statLabel}>Jami daromad</p>
                  <h4
                    className={styles.statValue}
                    style={{ color: "var(--color-green)" }}
                  >
                    24,000,000 so'm
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.sideTitle}>Hisob harakatlari</h3>
            <div className={styles.actionLinks}>
              <button className={styles.actionLink} style={disabledStyle}>
                <FiMapPin /> Manzilni yangilash
              </button>
              <button className={styles.actionLink} style={disabledStyle}>
                <FiCreditCard /> To'lov usullarini boshqarish
              </button>
              <button className={styles.actionLink} style={disabledStyle}>
                <FiShield /> Maxfiylik sozlamalari
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className={`${styles.actionLink} ${styles.logout}`}
              >
                <FiLogOut /> Hisobdan chiqish
              </button>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.sideTitle}>So'nggi faoliyat</h3>
            <div className={styles.timeline}>
              <div className={styles.timelineItem}>
                <div
                  className={styles.dot}
                  style={{ backgroundColor: "var(--color-green)" }}
                />
                <div className={styles.timelineContent}>
                  <p className={styles.timelineText}>Parol yangilandi</p>
                  <span className={styles.timelineTime}>2 soat oldin</span>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div
                  className={styles.dot}
                  style={{ backgroundColor: "var(--color-blue)" }}
                />
                <div className={styles.timelineContent}>
                  <p className={styles.timelineText}>Profil tahrirlandi</p>
                  <span className={styles.timelineTime}>1 kun oldin</span>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div
                  className={styles.dot}
                  style={{ backgroundColor: "var(--color-purple)" }}
                />
                <div className={styles.timelineContent}>
                  <p className={styles.timelineText}>Yangi qurilma</p>
                  <span className={styles.timelineTime}>3 kun oldin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
