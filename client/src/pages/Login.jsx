import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try { await login(form.email, form.password); navigate("/dashboard"); }
    catch (err) { setError(err.response?.data?.message || "Login failed."); }
    finally { setLoading(false); }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>Welcome Back</h1><p>Sign in to manage your portfolio.</p>
        {error && <div className="error-box">{error}</div>}
        <label>Email<input type="email" value={form.email} onChange={(e) => setForm({...form,email:e.target.value})} required /></label>
        <label>Password<input type="password" value={form.password} onChange={(e) => setForm({...form,password:e.target.value})} required /></label>
        <button className="btn btn-primary full-width" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
        <p className="auth-footer">Don't have an account? <Link to="/register">Create one</Link></p>
      </form>
    </main>
  );
}
