import React from "react";
export default function AssetTable({ assets, onDelete }) {
  const currency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency", currency: "INR", maximumFractionDigits: 2
    }).format(value);

  if (!assets?.length) return (
    <div className="empty-state"><h3>No assets yet</h3><p>Add your first investment using the form above.</p></div>
  );

  return (
    <div className="table-wrapper">
      <table>
        <thead><tr>
          <th>Asset</th><th>Ticker</th><th>Category</th><th>Units</th>
          <th>Buy Price</th><th>Current Price</th><th>Market Value</th><th>P/L</th><th>Action</th>
        </tr></thead>
        <tbody>
          {assets.map((asset) => {
            const invested = asset.sharesOwned * asset.avgBuyPrice;
            const marketValue = asset.sharesOwned * asset.currentPrice;
            const profitLoss = marketValue - invested;
            return (
              <tr key={asset._id}>
                <td>{asset.name}</td><td>{asset.ticker}</td><td>{asset.category}</td>
                <td>{asset.sharesOwned}</td><td>{currency(asset.avgBuyPrice)}</td>
                <td>{currency(asset.currentPrice)}</td><td>{currency(marketValue)}</td>
                <td className={profitLoss >= 0 ? "positive" : "negative"}>{currency(profitLoss)}</td>
                <td><button className="btn btn-danger" onClick={() => onDelete(asset._id)}>Delete</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
