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
      alert("Please fill in all fields!");
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
            {editData ? "Edit Transaction" : "New Transaction"}
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Name</label>
            <input
              type="text"
              placeholder="Example: Supermarket"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Amount (UZS)</label>
            <input
              type="number"
              placeholder="0"
              className={styles.input}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Category</label>
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
            <label className={styles.label}>Date</label>
            <input
              type="date"
              className={styles.input}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Type</label>
            <div className={styles.typeGrid}>
              <button
                type="button"
                className={`${styles.typeBtn} ${
                  type === "expense" ? styles.activeExpense : ""
                }`}
                onClick={() => setType("expense")}
              >
                <FiTrendingDown /> Expense
              </button>
              <button
                type="button"
                className={`${styles.typeBtn} ${
                  type === "income" ? styles.activeIncome : ""
                }`}
                onClick={() => setType("income")}
              >
                <FiTrendingUp /> Income
              </button>
            </div>
          </div>

          <div className={styles.actionsGrid}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              {editData ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
