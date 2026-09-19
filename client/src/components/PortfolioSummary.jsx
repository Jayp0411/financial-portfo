import React from "react";
export default function PortfolioSummary({ summary }) {
  const totalValue = Number(summary?.totalValue || 0);
  const totalInvested = Number(summary?.totalInvested || 0);
  const profitLoss = totalValue - totalInvested;

  const currency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency", currency: "INR", maximumFractionDigits: 2
    }).format(value);

  return (
    <section className="summary-grid">
      <div className="summary-card"><span>Total Portfolio Value</span><strong>{currency(totalValue)}</strong></div>
      <div className="summary-card"><span>Total Invested</span><strong>{currency(totalInvested)}</strong></div>
      <div className="summary-card"><span>Profit / Loss</span><strong className={profitLoss >= 0 ? "positive" : "negative"}>{currency(profitLoss)}</strong></div>
      <div className="summary-card"><span>Assets</span><strong>{summary?.assets?.length || 0}</strong></div>
    </section>
  );
}
