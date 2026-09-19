import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setError("");
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try { await register(form.name, form.email, form.password); navigate("/dashboard"); }
    catch (err) { setError(err.response?.data?.message || "Registration failed."); }
    finally { setLoading(false); }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>Create Account</h1><p>Start tracking your investments.</p>
        {error && <div className="error-box">{error}</div>}
        <label>Full Name<input value={form.name} onChange={(e) => setForm({...form,name:e.target.value})} required /></label>
        <label>Email<input type="email" value={form.email} onChange={(e) => setForm({...form,email:e.target.value})} required /></label>
        <label>Password<input type="password" minLength="6" value={form.password} onChange={(e) => setForm({...form,password:e.target.value})} required /></label>
        <button className="btn btn-primary full-width" disabled={loading}>{loading ? "Creating..." : "Create Account"}</button>
        <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
      </form>
    </main>
  );
}
