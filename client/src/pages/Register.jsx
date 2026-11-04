import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "./axiosConfig";
import AuthLayout from "../components/AuthLayout";
import PasswordInput from "../components/PasswordInput";
import { getToken } from "../utils/auth";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", firstname: "", lastname: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (getToken()) return <Navigate to="/home" replace />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.post("/users/register", {
        username: form.username.trim(),
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        email: form.email.trim(),
        PASSWORD: form.password,
      });
      setSuccess(data.msg || "Registered successfully! Redirecting to login...");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      if (err.response) setError(err.response.data.msg || err.response.data.message || "Registration failed.");
      else setError("Cannot connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Join the network</h2>
        <p className="auth-sub">
          Already have an account? <Link to="/">Sign in</Link>
        </p>
        <input type="email" placeholder="Email" value={form.email} onChange={set("email")} autoComplete="email" required />
        <div className="name-row">
          <input type="text" placeholder="First Name" value={form.firstname} onChange={set("firstname")} autoComplete="given-name" required />
          <input type="text" placeholder="Last Name" value={form.lastname} onChange={set("lastname")} autoComplete="family-name" required />
        </div>
        <input type="text" placeholder="User Name" value={form.username} onChange={set("username")} autoComplete="username" required />
        <PasswordInput id="password" placeholder="Password" value={form.password} onChange={set("password")} autoComplete="new-password" />
        {error && <p className="error-message" role="alert">{error}</p>}
        {success && <p className="success-message" role="status">{success}</p>}
        <button type="submit" className="btn btn-blue join-btn" disabled={loading}>
          {loading ? "Joining..." : "Agree and Join"}
        </button>
        <p className="agree">
          I agree to the <a href="/" onClick={(e) => e.preventDefault()}>privacy policy</a> and{" "}
          <a href="/" onClick={(e) => e.preventDefault()}>terms of serivice.</a>
        </p>
        <Link to="/" className="text-link">Already have an account?</Link>
      </form>
    </AuthLayout>
  );
}
export default Register;
