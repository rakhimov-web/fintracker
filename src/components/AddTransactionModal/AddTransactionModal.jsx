import React, { useState, useEffect } from "react";
import { FiX, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import styles from "./addTransactionModal.module.css";

export default function AddTransactionModal({ onClose, onRefresh, editData }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("expense");
  const [categoriesList, setCategoriesList] = useState([]);

  const currentUserId = localStorage.getItem("userId") || "";

  useEffect(() => {
    fetch("http://localhost:5000/categories")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setCategoriesList(data);
        if (!editData && data.length > 0) {
          setCategory(data[0].name);
        }
      })
      .catch((err) => console.error(err));
  }, [editData]);

  useEffect(() => {
    if (editData) {
      setName(editData.name);
      setAmount(editData.amount);
      setCategory(editData.category);
      setDate(editData.date);
      setType(editData.type);
    } else {
      setName("");
      setAmount("");
      setDate("");
      setType("expense");
    }
  }, [editData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !amount || !category || !date) {
      alert("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }

    const transactionData = {
      userId: String(currentUserId),
      name,
      category,
      amount: String(Math.abs(parseFloat(amount))),
      date,
      type,
    };

    const url = editData
      ? `http://localhost:5000/transactions/${editData.id}`
      : "http://localhost:5000/transactions";

    const method = editData ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        onRefresh();
        onClose();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {editData ? "Tranzaksiyani tahrirlash" : "Yangi tranzaksiya"}
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Nomi</label>
            <input
              type="text"
              placeholder="Masalan: Supermarket"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Summa (so'm)</label>
            <input
              type="number"
              placeholder="0"
              className={styles.input}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Kategoriya</label>
            <select
              className={styles.input}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categoriesList.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Sana</label>
            <input
              type="date"
              className={styles.input}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Turi</label>
            <div className={styles.typeGrid}>
              <button
                type="button"
                className={`${styles.typeBtn} ${
                  type === "expense" ? styles.activeExpense : ""
                }`}
                onClick={() => setType("expense")}
              >
                <FiTrendingDown /> Xarajat
              </button>
              <button
                type="button"
                className={`${styles.typeBtn} ${
                  type === "income" ? styles.activeIncome : ""
                }`}
                onClick={() => setType("income")}
              >
                <FiTrendingUp /> Daromad
              </button>
            </div>
          </div>

          <div className={styles.actionsGrid}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Bekor qilish
            </button>
            <button type="submit" className={styles.submitBtn}>
              {editData ? "Saqlash" : "Qo'shish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
