import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiSearch,
  FiTrendingUp,
  FiTrendingDown,
  FiEdit2,
  FiTrash2,
  FiActivity,
} from "react-icons/fi";
import AddTransactionModal from "../../components/AddTransactionModal/AddTransactionModal";
import styles from "./transactions.module.css";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const currentUserId = localStorage.getItem("userId") || "";

  const filters = [
    { id: "all", label: "All" },
    { id: "income", label: "Income" },
    { id: "expense", label: "Expense" },
  ];

  const fetchTransactions = () => {
    if (!currentUserId) return;
    fetch("http://localhost:5000/transactions")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const userTransactions = data.filter(
          (tx) => String(tx.userId) === String(currentUserId),
        );
        setTransactions(userTransactions);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentUserId]);

  const handleDelete = (id) => {
    if (!window.confirm("Do you want to delete this transaction?")) return;

    fetch(`http://localhost:5000/transactions/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) fetchTransactions();
      })
      .catch((err) => console.error(err));
  };

  const handleOpenEditModal = (tx) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const formatMoney = (num, type) => {
    const formatted = num.toLocaleString("en-US") + " UZS";
    return type === "income" ? `+${formatted}` : `-${formatted}`;
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "all" || tx.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Transactions</h1>
          <p className={styles.subtitle}>All expenses and incomes</p>
        </div>
        <button className={styles.addBtn} onClick={handleOpenAddModal}>
          <FiPlus /> <span>New transaction</span>
        </button>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.filterGroup}>
          {filters.map((f) => (
            <button
              key={f.id}
              className={`${styles.filterBtn} ${
                activeFilter === f.id ? styles.activeFilter : ""
              }`}
              onClick={() => setActiveFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.mainCard}>
        <div className={styles.list}>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx, index) => (
              <div key={tx.id || index} className={styles.listItem}>
                <div className={styles.itemLeft}>
                  <div className={`${styles.iconBg} ${styles[tx.type]}`}>
                    {tx.type === "income" ? (
                      <FiTrendingUp />
                    ) : (
                      <FiTrendingDown />
                    )}
                  </div>
                  <div className={styles.itemInfo}>
                    <h4 className={styles.itemName}>{tx.name}</h4>
                    <p className={styles.itemMeta}>
                      {tx.category} <span className={styles.dot}>•</span>{" "}
                      {tx.date}
                    </p>
                  </div>
                </div>
                <div className={styles.itemRight}>
                  <span className={`${styles.amount} ${styles[tx.type]}`}>
                    {formatMoney(tx.amount, tx.type)}
                  </span>
                  <div className={styles.actions}>
                    <button
                      className={styles.actionBtn}
                      title="Edit"
                      onClick={() => handleOpenEditModal(tx)}
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.delete}`}
                      title="Delete"
                      onClick={() => handleDelete(tx.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <FiActivity className={styles.emptyIcon} />
              <h4 className={styles.emptyTitle}>No activity yet</h4>
              <p className={styles.emptyText}>
                Your income or expense transactions will appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <AddTransactionModal
          onClose={() => {
            setIsModalOpen(false);
            setEditingTransaction(null);
          }}
          onRefresh={fetchTransactions}
          editData={editingTransaction}
        />
      )}
    </div>
  );
}
