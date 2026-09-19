import React from "react";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AssetForm from "../components/AssetForm";
import AssetTable from "../components/AssetTable";
import PortfolioSummary from "../components/PortfolioSummary";
import PortfolioChart from "../components/PortfolioChart";
import api from "../services/api";

export default function Dashboard() {
  const [summary, setSummary] = useState({ totalValue: 0, totalInvested: 0, assets: [] });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const[assets,setAssets] = useState([]);
  const loadPortfolio = async () => {
    try { const res = await api.get("/portfolio/summary"); setSummary(res.data); setAssets(res.data.assets || []); }
    catch (err) { setError(err.response?.data?.message || "Unable to load portfolio."); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadPortfolio(); }, []);

  const handleSubmit = async (asset) => {
    setSubmitting(true); setError("");
    try { await api.post("/portfolio", asset); await loadPortfolio(); }
    catch (err) { setError(err.response?.data?.message || "Unable to save asset."); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this asset?")) return;
    try { await api.delete(`/portfolio/${id}`); await loadPortfolio(); }
    catch (err) { setError(err.response?.data?.message || "Unable to delete asset."); }
  };

  return (
    <>
      <Navbar />
      <main className="container">
        <header className="page-header"><div><h1>Portfolio Dashboard</h1><p>Monitor investments, value and performance.</p></div></header>
        {error && <div className="error-box">{error}</div>}
        <PortfolioSummary summary={summary} />
        <AssetForm onSubmit={handleSubmit} submitting={submitting} />
        <section className="portfolio-section">
          <div className="section-heading"><div><h2>Your Assets</h2><p>Current holdings and estimated performance.</p></div></div>
          {loading ? <div className="loading">Loading portfolio...</div> : <AssetTable assets={summary.assets} onDelete={handleDelete} />}
          <PortfolioChart assets={assets}/>
        </section>
      </main>
    </>
  );
}
