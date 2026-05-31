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
  { name: "Ovqat", icon: "shopping-cart", color: "#2b7fff" },
  { name: "Transport", icon: "truck", color: "#00c950" },
  { name: "To'lovlar", icon: "home", color: "#ff9f43" },
  { name: "O'yin-kulgi", icon: "gamepad", color: "#ad46ff" },
  { name: "Salomatlik", icon: "heart", color: "#ff3b30" },
  { name: "Ishxona", icon: "briefcase", color: "#465eff" },
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
      const [catRes, txRes] = await Promise.all([
        fetch("http://localhost:5000/categories"),
        fetch("http://localhost:5000/transactions"),
      ]);

      const allCategories = await catRes.json();
      const txData = await txRes.json();

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
        const createPromises = missingCategories.map((cat) =>
          fetch("http://localhost:5000/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...cat,
              userId: currentUserId,
            }),
          }).then((res) => res.json()),
        );

        const createdCategories = await Promise.all(createPromises);
        userCategories = [...userCategories, ...createdCategories];
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
    const formatted = Math.abs(num).toLocaleString("uz-UZ") + " so'm";
    return num < 0 ? `-${formatted}` : `+${formatted}`;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Kategoriyalar</h1>
          <p className={styles.subtitle}>
            Xarajatlaringizni kategoriyalar bo'yicha boshqaring
          </p>
        </div>

        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          <FiPlus />
          <span>Yangi kategoriya</span>
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

                <p className={styles.catCount}>{cat.count} ta tranzaksiya</p>

                <h4 className={`${styles.catAmount} ${amountClass}`}>
                  {cat.netAmount === 0 ? "0 so'm" : formatMoney(cat.netAmount)}
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
        <h3 className={styles.summaryTitle}>Umumiy xarajatlar</h3>

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
                    {cat.netAmount === 0
                      ? "0 so'm"
                      : formatMoney(cat.netAmount)}
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
