
import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const PortfolioChart = ({ assets = [] }) => {
  const getValue = (category) =>
    assets
      .filter((asset) => asset.category === category)
      .reduce(
        (total, asset) =>
          total + (Number(asset.sharesOwned) * Number(asset.currentPrice)),
        0
      );

  const data = {
    labels: ["Stocks", "Crypto", "Cash", "Real Estate"],
    datasets: [
      {
        data: [
          getValue("Stock"),
          getValue("Crypto"),
          getValue("Cash"),
          getValue("Real Estate"),
        ],
        backgroundColor: [
          "#4F46E5",
          "#F59E0B",
          "#10B981",
          "#EF4444",
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div style={{ height: "300px", position: "relative" }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default PortfolioChart;

