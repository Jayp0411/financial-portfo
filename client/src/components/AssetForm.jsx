import React from "react";
import { useState } from "react";

const initialState = {
  name: "", ticker: "", category: "Stock",
  sharesOwned: "", avgBuyPrice: "", currentPrice: ""
};

export default function AssetForm({ onSubmit, submitting }) {
  const [form, setForm] = useState(initialState);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({
      ...form,
      ticker: form.ticker.toUpperCase().trim(),
      sharesOwned: Number(form.sharesOwned),
      avgBuyPrice: Number(form.avgBuyPrice),
      currentPrice: Number(form.currentPrice)
    });
    setForm(initialState);
  };

  return (
    <form className="asset-form" onSubmit={handleSubmit}>
      <div className="form-title">
        <h2>Add / Update Asset</h2>
        <p>Track your investments in one place.</p>
      </div>
      <div className="form-grid">
        <label>Asset Name<input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Reliance Industries" required /></label>
        <label>Ticker<input name="ticker" value={form.ticker} onChange={handleChange} placeholder="e.g. RELIANCE" required /></label>
        <label>Category<select name="category" value={form.category} onChange={handleChange}>
          <option>Stock</option><option>Crypto</option><option>Cash</option><option>Real Estate</option>
        </select></label>
        <label>Units / Shares<input type="number" name="sharesOwned" min="0.000001" step="any" value={form.sharesOwned} onChange={handleChange} required /></label>
        <label>Average Buy Price<input type="number" name="avgBuyPrice" min="0" step="0.01" value={form.avgBuyPrice} onChange={handleChange} required /></label>
        <label>Current Price<input type="number" name="currentPrice" min="0" step="0.01" value={form.currentPrice} onChange={handleChange} required /></label>
      </div>
      <button className="btn btn-primary" disabled={submitting}>{submitting ? "Saving..." : "Save Asset"}</button>
    </form>
  );
}
