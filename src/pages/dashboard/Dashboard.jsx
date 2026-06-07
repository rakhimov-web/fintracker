import React, { useState, useEffect } from "react";
import {
  FiCreditCard,
  FiTrendingUp,
  FiTrendingDown,
  FiEye,
  FiCalendar,
  FiActivity,
  FiPieChart,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styles from "./dashboard.module.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const currentUserId = localStorage.getItem("userId") || "";

  const [totals, setTotals] = useState({
    balance: 0,
    income: 0,
    expense: 0,
  });

  useEffect(() => {
    if (!currentUserId) return;

    fetch("https://api.jsonbin.io/v3/b/6a2579a0da38895dfe94f2fb/latest", {
      headers: {
        "X-Master-Key":
          "$2a$10$49JQn9KqhjJzG7.NmQS/web6eUaZEeIPAczvJF2hmWtPW3HDnQuUG",
      },
    })
      .then((res) =>
        res.ok ? res.json() : { record: { transactions: [], categories: [] } },
      )
      .then((data) => {
        const txData = data.record.transactions || [];
        const catData = data.record.categories || [];

        const userTransactions = txData.filter(
          (tx) => String(tx.userId) === String(currentUserId),
        );

        const userCategories = catData.filter(
          (cat) => String(cat.userId) === String(currentUserId),
        );

        let inc = 0;
        let exp = 0;

        userTransactions.forEach((tx) => {
          const amt = parseFloat(tx.amount) || 0;
          if (tx.type === "income") {
            inc += amt;
          } else if (tx.type === "expense") {
            exp += amt;
          }
        });

        const calculatedCategories = userCategories.map((cat) => {
          let catAmount = 0;
          userTransactions.forEach((tx) => {
            if (
              tx.type === "expense" &&
              tx.category &&
              cat.name &&
              tx.category.toLowerCase().trim() === cat.name.toLowerCase().trim()
            ) {
              catAmount += parseFloat(tx.amount) || 0;
            }
          });

          const pct = exp > 0 ? Math.round((catAmount / exp) * 100) : 0;
          return {
            ...cat,
            calculatedAmount: catAmount,
            percentage: pct,
          };
        });

        setTotals({
          income: inc,
          expense: exp,
          balance: inc - exp,
        });
        setTransactions(userTransactions.slice(-4).reverse());
        setCategories(calculatedCategories);
      })
      .catch((err) => console.error(err));
  }, [currentUserId]);

  const formatMoney = (num) => {
    return num.toLocaleString("en-US") + " UZS";
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Manage your expenses</p>
        </div>
        <div className={styles.datePicker}>
          <FiCalendar />
          <span>{new Date().toLocaleDateString("en-US")}</span>
        </div>
      </header>

      <div className={styles.cardsGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>Balans</span>
            <span className={styles.cardIcon}>
              <FiCreditCard />
            </span>
          </div>
          <h2 className={styles.cardValue}>{formatMoney(totals.balance)}</h2>
          <div className={styles.cardFooter}>
            <span className={styles.footerLink}>Total balance</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>Daromad</span>
            <span className={`${styles.cardIcon} ${styles.income}`}>
              <FiTrendingUp />
            </span>
          </div>
          <h2 className={`${styles.cardValue} ${styles.incomeText}`}>
            {formatMoney(totals.income)}
          </h2>
          <div className={styles.cardFooter}>
            <span className={styles.trendUp}>This month</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>Xarajat</span>
            <span className={`${styles.cardIcon} ${styles.expense}`}>
              <FiTrendingDown />
            </span>
          </div>
          <h2 className={`${styles.cardValue} ${styles.expenseText}`}>
            {formatMoney(totals.expense)}
          </h2>
          <div className={styles.cardFooter}>
            <span className={styles.trendDown}>This month</span>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Recent transactions</h3>
            <button
              className={styles.viewAllBtn}
              onClick={() => navigate("/dashboard/transaction")}
            >
              View all
            </button>
          </div>
          <div className={styles.listContainer}>
            {transactions.length > 0 ? (
              transactions.map((tx, index) => (
                <div key={tx.id || index} className={styles.transactionItem}>
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
                  <span className={`${styles.itemAmount} ${styles[tx.type]}`}>
                    {tx.type === "income" ? "+" : "-"}
                    {formatMoney(tx.amount)}
                  </span>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <FiActivity className={styles.emptyIcon} />
                <h4 className={styles.emptyTitle}>No transactions</h4>
                <p className={styles.emptyText}>
                  No income or expense has been added yet.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>By categories</h3>
          </div>
          <div className={styles.listContainer}>
            {totals.expense > 0 && categories.length > 0 ? (
              categories
                .filter((cat) => cat.calculatedAmount > 0)
                .map((cat, index) => (
                  <div key={cat.id || index} className={styles.categoryItem}>
                    <div className={styles.categoryInfo}>
                      <span className={styles.itemName}>{cat.name}</span>
                      <span className={styles.categoryAmount}>
                        {formatMoney(cat.calculatedAmount || 0)}
                      </span>
                    </div>
                    <div className={styles.progressBg}>
                      <div
                        className={styles.progressBar}
                        style={{
                          width: `${cat.percentage}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                ))
            ) : (
              <div className={styles.emptyState}>
                <FiPieChart className={styles.emptyIcon} />
                <h4 className={styles.emptyTitle}>No categories</h4>
                <p className={styles.emptyText}>
                  When expenses are recorded, their statistics will be grouped
                  here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
