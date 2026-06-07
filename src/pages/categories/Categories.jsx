import React, { useState, useEffect, useRef } from "react";
import {
  FiPlus,
  FiShoppingCart,
  FiTruck,
  FiHome,
  FiSmile,
  FiCoffee,
  FiHeart,
  FiBriefcase,
  FiLayers,
} from "react-icons/fi";
import AddCategoryModal from "../../components/AddCategoryModal/AddCategoryModal";
import styles from "./categories.module.css";

const DEFAULT_CATEGORIES = [
  { name: "Food", icon: "shopping-cart", color: "#2b7fff" },
  { name: "Transport", icon: "truck", color: "#00c950" },
  { name: "Payments", icon: "home", color: "#ff9f43" },
  { name: "Entertainment", icon: "gamepad", color: "#ad46ff" },
  { name: "Health", icon: "heart", color: "#ff3b30" },
  { name: "Work", icon: "briefcase", color: "#465eff" },
];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchedRef = useRef(false);

  const currentUserId =
    localStorage.getItem("userId") || localStorage.getItem("id") || "";

  const iconMap = {
    "shopping-cart": <FiShoppingCart />,
    truck: <FiTruck />,
    home: <FiHome />,
    gamepad: <FiSmile />,
    coffee: <FiCoffee />,
    heart: <FiHeart />,
    briefcase: <FiBriefcase />,
    layers: <FiLayers />,
  };

  const fetchCategoriesAndTransactions = async () => {
    if (!currentUserId) return;

    try {
      const response = await fetch(
        "https://api.jsonbin.io/v3/b/6a2579a0da38895dfe94f2fb/latest",
        {
          headers: {
            "X-Master-Key":
              "$2a$10$49JQn9KqhjJzG7.NmQS/web6eUaZEeIPAczvJF2hmWtPW3HDnQuUG",
          },
        },
      );

      const data = await response.json();
      const allCategories = data.record.categories || [];
      const txData = data.record.transactions || [];

      let userCategories = allCategories.filter(
        (cat) => String(cat.userId) === String(currentUserId),
      );

      const existingNames = userCategories.map((cat) =>
        cat.name.toLowerCase().trim(),
      );

      const missingCategories = DEFAULT_CATEGORIES.filter(
        (cat) => !existingNames.includes(cat.name.toLowerCase().trim()),
      );

      if (missingCategories.length > 0) {
        const newCatsToAdd = missingCategories.map((cat) => ({
          ...cat,
          id: Math.random().toString(36).substring(2, 6),
          userId: currentUserId,
        }));

        const updatedAllCategories = [...allCategories, ...newCatsToAdd];

        await fetch("https://api.jsonbin.io/v3/b/6a2579a0da38895dfe94f2fb", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Master-Key":
              "$2a$10$49JQn9KqhjJzG7.NmQS/web6eUaZEeIPAczvJF2hmWtPW3HDnQuUG",
          },
          body: JSON.stringify({
            ...data.record,
            categories: updatedAllCategories,
          }),
        });

        userCategories = [...userCategories, ...newCatsToAdd];
      }

      const userTransactions = txData.filter(
        (tx) => String(tx.userId) === String(currentUserId),
      );

      let totalExpense = 0;

      userTransactions.forEach((tx) => {
        if (
          tx.type === "expense" ||
          tx.type === "xarajat" ||
          tx.type === "chiqim"
        ) {
          totalExpense += Math.abs(parseFloat(tx.amount) || 0);
        }
      });

      const calculatedCategories = userCategories.map((cat) => {
        let catTotalExpense = 0;
        let catTotalIncome = 0;
        let catCount = 0;

        userTransactions.forEach((tx) => {
          if (
            tx.category &&
            cat.name &&
            tx.category.toLowerCase().trim() === cat.name.toLowerCase().trim()
          ) {
            catCount += 1;

            const amt = Math.abs(parseFloat(tx.amount) || 0);

            if (
              tx.type === "income" ||
              tx.type === "daromad" ||
              tx.type === "kirim"
            ) {
              catTotalIncome += amt;
            } else {
              catTotalExpense += amt;
            }
          }
        });

        const netAmount = catTotalIncome - catTotalExpense;

        const percent =
          totalExpense > 0 && catTotalExpense > 0
            ? Math.round((catTotalExpense / totalExpense) * 100)
            : 0;

        return {
          ...cat,
          count: catCount,
          netAmount,
          percentage: percent,
        };
      });

      setCategories(calculatedCategories);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!currentUserId || fetchedRef.current) return;

    fetchedRef.current = true;
    fetchCategoriesAndTransactions();
  }, [currentUserId]);

  const formatMoney = (num) => {
    const formatted = Math.abs(num).toLocaleString("en-US") + " UZS";
    return num < 0 ? `-${formatted}` : `+${formatted}`;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Categories</h1>
          <p className={styles.subtitle}>Manage your expenses by category</p>
        </div>

        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          <FiPlus />
          <span>New category</span>
        </button>
      </header>

      <div className={styles.grid}>
        {categories.map((cat, index) => {
          const uniqueKey = cat.id || `cat-key-${index}`;

          const amountClass =
            cat.netAmount === 0
              ? ""
              : cat.netAmount > 0
                ? styles.incomeColor
                : styles.expenseColor;

          return (
            <div key={uniqueKey} className={styles.card}>
              <div className={styles.cardHeader}>
                <div
                  className={styles.iconBg}
                  style={{
                    backgroundColor: `${cat.color}15`,
                    color: cat.color,
                  }}
                >
                  {iconMap[cat.icon] || <FiLayers />}
                </div>

                <span className={styles.percentage}>{cat.percentage}%</span>
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.catName}>{cat.name}</h3>

                <p className={styles.catCount}>{cat.count} transactions</p>

                <h4 className={`${styles.catAmount} ${amountClass}`}>
                  {cat.netAmount === 0 ? "0 UZS" : formatMoney(cat.netAmount)}
                </h4>
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
          );
        })}
      </div>

      <div className={styles.summaryCard}>
        <h3 className={styles.summaryTitle}>Total expenses</h3>

        <div className={styles.summaryList}>
          {categories.map((cat, index) => {
            const uniqueKey = cat.id ? `sum-${cat.id}` : `sum-key-${index}`;

            const amountClass =
              cat.netAmount === 0
                ? ""
                : cat.netAmount > 0
                  ? styles.incomeColor
                  : styles.expenseColor;

            return (
              <div key={uniqueKey} className={styles.summaryItem}>
                <div className={styles.summaryLeft}>
                  <div
                    className={styles.miniIconBg}
                    style={{ backgroundColor: cat.color }}
                  >
                    {iconMap[cat.icon] || <FiLayers />}
                  </div>

                  <span className={styles.summaryName}>{cat.name}</span>
                </div>

                <div className={styles.summaryCenter}>
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

                <div className={styles.summaryRight}>
                  <span className={`${styles.summaryAmount} ${amountClass}`}>
                    {cat.netAmount === 0 ? "0 UZS" : formatMoney(cat.netAmount)}
                  </span>

                  <span className={styles.summaryPercent}>
                    {cat.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isModalOpen && (
        <AddCategoryModal
          onClose={() => setIsModalOpen(false)}
          onRefresh={fetchCategoriesAndTransactions}
        />
      )}
    </div>
  );
}
