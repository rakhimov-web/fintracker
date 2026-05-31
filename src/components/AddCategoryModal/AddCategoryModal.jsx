import React, { useState } from "react";
import {
  FiX,
  FiShoppingCart,
  FiTruck,
  FiHome,
  FiSmile,
  FiCoffee,
  FiHeart,
  FiBriefcase,
  FiGift,
  FiLayers,
} from "react-icons/fi";
import styles from "./addCategoryModal.module.css";

export default function AddCategoryModal({ onClose, onRefresh }) {
  const [categoryName, setCategoryName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("shopping-cart");
  const [selectedColor, setSelectedColor] = useState("#2563eb");

  // LocalStorage dan foydalanuvchi ID sini olish
  const currentUserId =
    localStorage.getItem("userId") || localStorage.getItem("id") || "";

  const iconsList = [
    { id: "shopping-cart", component: <FiShoppingCart /> },
    { id: "truck", component: <FiTruck /> },
    { id: "home", component: <FiHome /> },
    { id: "gamepad", component: <FiSmile /> },
    { id: "coffee", component: <FiCoffee /> },
    { id: "heart", component: <FiHeart /> },
    { id: "briefcase", component: <FiBriefcase /> },
    { id: "gift", component: <FiGift /> },
    { id: "layers", component: <FiLayers /> },
  ];

  const colorsList = [
    "#2563eb",
    "#10b981",
    "#f97316",
    "#a855f7",
    "#ef4444",
    "#06b6d4",
    "#ec4899",
    "#14b8a6",
    "#64748b",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validatsiya: Agar nom bo'sh bo'lsa yoki user tizimga kirmagan bo'lsa to'xtatish
    if (!categoryName.trim() || !currentUserId) {
      alert("Xatolik: Ma'lumotlar to'liq emas yoki tizimga kirmagansiz!");
      return;
    }

    const newCategory = {
      name: categoryName.trim(),
      icon: selectedIcon,
      color: selectedColor,
      userId: currentUserId,
    };

    // DB.json ga saqlash uchun POST so'rovi
    fetch("http://localhost:5000/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCategory),
    })
      .then((res) => {
        if (res.ok) {
          onRefresh(); // Dashboard yoki Kategoriyalar sahifasini yangilash
          onClose(); // Modalni yopish
        } else {
          alert("Kategoriyani saqlashda xatolik yuz berdi.");
        }
      })
      .catch((err) => console.error("Xatolik:", err));
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Modal Tepadagi qismi */}
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Yangi kategoriya</h3>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* Form qismi */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Kategoriya nomi inputi */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Kategoriya nomi</label>
            <input
              type="text"
              placeholder="Masalan: Benzindagi xarajat"
              className={styles.input}
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>

          {/* Ikonka tanlash paneli */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Ikonka tanlang</label>
            <div className={styles.iconsGrid}>
              {iconsList.map((icon) => (
                <button
                  key={icon.id}
                  type="button"
                  className={`${styles.iconBtn} ${
                    selectedIcon === icon.id ? styles.activeIcon : ""
                  }`}
                  onClick={() => setSelectedIcon(icon.id)}
                >
                  {icon.component}
                </button>
              ))}
            </div>
          </div>

          {/* Rang tanlash paneli */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Rang tanlang</label>
            <div className={styles.colorGrid}>
              {colorsList.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`${styles.colorBtn} ${
                    selectedColor === color ? styles.activeColor : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Pastki tugmalar */}
          <div className={styles.actionsGrid}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Bekor qilish
            </button>
            <button type="submit" className={styles.submitBtn}>
              Qo'shish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
