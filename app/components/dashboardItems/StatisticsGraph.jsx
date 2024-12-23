import React, { useState, useRef } from "react";
import styles from "@/app/styles/statistics.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      align: "start",
      labels: {
        padding: 20,
        font: {
          size: 14,
          weight: "bold",
        },
        color: "#6cd7ff",
        usePointStyle: true,
        pointStyle: "rect",
      },
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        font: {
          size: 12,
        },
        color: "#6cd7ff",
      },
      grid: {
        color: "rgb(28, 43, 75)",
      },
    },
    x: {
      ticks: {
        font: {
          size: 12,
        },
        color: "#6cd7ff",
      },
      grid: {
        color: "rgb(28, 43, 75)",
      },
    },
  },
};

const labels = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);

const generateMonthlyEarningsData = (month) => {
  // Replace this with actual data fetching or calculation logic for the selected month
  return labels.map(() => Math.floor(Math.random() * 500) + 500); // Mock earnings data
};

export default function StatisticGraph() {
  const [date, setDate] = useState();
  const [monthlyData, setMonthlyData] = useState(generateMonthlyEarningsData("January"));
  const dateInputRef = useRef(null);

  const handleDateIconClick = () => {
    dateInputRef.current?.showPicker();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const month = selectedDate.toLocaleString("default", { month: "long" });
    setDate(formatDate(e.target.value));
    setMonthlyData(generateMonthlyEarningsData(month));
  };

  const data = {
    labels,
    datasets: [
      {
        label: `Earnings for ${date ? date : "Selected Month"}`,
        data: monthlyData,
        backgroundColor: "rgb(0, 237, 161)",
        borderColor: "#00eda1",
      },
    ],
  };

  return (
    <div className={styles.StatisticsComponent}>
      <div className={styles.StatisticsHeader}>
        <div className={styles.dateFilter}>
          <input
            type="month"
            name="date"
            className={styles.dateInputFilter}
            ref={dateInputRef}
            onChange={handleDateChange}
          />
        </div>
      </div>
      <div className={styles.barGraph}>
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}
