import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  FiCalendar,
  FiArrowDownRight,
  FiArrowUpRight,
  FiPercent,
  FiActivity,
} from "react-icons/fi";
import styles from "./statistics.module.css";

export default function Statistics() {
  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [totals, setTotals] = useState({ inc: 0, exp: 0, avg: 0, count: 0 });
  const currentUserId = localStorage.getItem("userId") || "";

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

        let totalIncome = 0;
        let totalExpense = 0;
        userTransactions.forEach((tx) => {
          const amt = parseFloat(tx.amount) || 0;
          if (tx.type === "income") totalIncome += amt;
          if (tx.type === "expense") totalExpense += amt;
        });

        const categoryMap = {};
        userCategories.forEach((c) => {
          categoryMap[c.name.toLowerCase().trim()] = {
            name: c.name,
            value: 0,
            color: c.color,
          };
        });

        userTransactions.forEach((tx) => {
          if (tx.type === "expense" && tx.category) {
            const key = tx.category.toLowerCase().trim();
            if (categoryMap[key]) {
              categoryMap[key].value += parseFloat(tx.amount) || 0;
            } else {
              categoryMap[key] = {
                name: tx.category,
                value: parseFloat(tx.amount) || 0,
                color: "#64748b",
              };
            }
          }
        });

        const calculatedPie = Object.values(categoryMap).filter(
          (item) => item.value > 0,
        );
        setPieData(calculatedPie);

        const monthlyMap = {
          Jan: { name: "Jan", Income: 0, Expense: 0 },
          Feb: { name: "Feb", Income: 0, Expense: 0 },
          Mar: { name: "Mar", Income: 0, Expense: 0 },
          Apr: { name: "Apr", Income: 0, Expense: 0 },
          May: { name: "May", Income: 0, Expense: 0 },
          Jun: { name: "Jun", Income: 0, Expense: 0 },
        };

        userTransactions.forEach((tx) => {
          if (tx.date) {
            const monthIndex = new Date(tx.date).getMonth();
            const monthsShort = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ];
            const mName = monthsShort[monthIndex];
            if (monthlyMap[mName]) {
              const amt = parseFloat(tx.amount) || 0;
              if (tx.type === "income") monthlyMap[mName].Income += amt;
              if (tx.type === "expense") monthlyMap[mName].Expense += amt;
            }
          }
        });

        setLineData(Object.values(monthlyMap));

        const calculatedBar = Object.values(categoryMap)
          .map((item) => ({
            name: item.name,
            expense: item.value,
          }))
          .filter((i) => i.expense > 0);
        setBarData(calculatedBar);

        setTotals({
          inc: totalIncome,
          exp: totalExpense,
          avg:
            userTransactions.length > 0
              ? Math.round(totalExpense / userTransactions.length)
              : 0,
          count: userTransactions.length,
        });
      })
      .catch((err) => console.error(err));
  }, [currentUserId]);

  const formatMoney = (num) => {
    return num.toLocaleString("uz-UZ") + " UZS";
  };

  const statsCards = [
    {
      id: 1,
      title: "Total Income",
      value: formatMoney(totals.inc),
      type: "income",
      icon: <FiArrowUpRight />,
    },
    {
      id: 2,
      title: "Total Expense",
      value: formatMoney(totals.exp),
      type: "expense",
      icon: <FiArrowDownRight />,
    },
    {
      id: 3,
      title: "Average Transaction",
      value: formatMoney(totals.avg),
      type: "average",
      icon: <FiPercent />,
    },
    {
      id: 4,
      title: "Number of Actions",
      value: `${totals.count} items`,
      type: "count",
      icon: <FiActivity />,
    },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Statistics</h1>
          <p className={styles.subtitle}>Expense analysis</p>
        </div>
        <div className={styles.datePicker}>
          <FiCalendar />
          <span>All periods</span>
        </div>
      </header>

      <div className={styles.chartCardFull}>
        <h3 className={styles.chartTitle}>Income and expense trends</h3>
        <div className={styles.lineChartWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                stroke="#a0a0a0"
              />
              <YAxis tickLine={false} axisLine={false} stroke="#a0a0a0" />
              <Tooltip />
              <Legend iconType="circle" />
              <Line
                type="monotone"
                dataKey="Income"
                stroke="#00c950"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Expense"
                stroke="#d4183d"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Category distribution</h3>
          <div className={styles.pieChartWrapper}>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatMoney(value)} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p
                style={{
                  textAlign: "center",
                  color: "#a0a0a0",
                  paddingTop: "100px",
                }}
              >
                No expenses available
              </p>
            )}
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Weekly expenses</h3>
          <div className={styles.barChartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  stroke="#a0a0a0"
                  fontSize={13}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  stroke="#a0a0a0"
                  fontSize={13}
                />
                <Tooltip formatter={(value) => formatMoney(value)} />
                <Bar
                  dataKey="expense"
                  fill="#2b7fff"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className={styles.cardsGrid}>
        {statsCards.map((card) => (
          <div key={card.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardLabel}>{card.title}</span>
              <span className={`${styles.cardIcon} ${styles[card.type]}`}>
                {card.icon}
              </span>
            </div>
            <h2 className={styles.cardValue}>{card.value}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
