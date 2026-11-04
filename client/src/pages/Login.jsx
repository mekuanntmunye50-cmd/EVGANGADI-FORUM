import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "./axiosConfig";
import AuthLayout from "../components/AuthLayout";
import PasswordInput from "../components/PasswordInput";
import { getToken, setToken } from "../utils/auth";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (getToken()) return <Navigate to="/home" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.post("/users/login", { email: email.trim(), PASSWORD: password });
      if (!data.token) {
        setError("Login failed: the server did not return a token.");
        return;
      }
      setToken(data.token);
      navigate("/home");
    } catch (err) {
      if (err.response) setError(err.response.data.msg || err.response.data.message || "Login failed.");
      else setError("Cannot connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <form className="auth-form login-form" onSubmit={handleSubmit}>
        <h2>Login to your account</h2>
        <p className="auth-sub">
          Don't have an account?<Link to="/register">Create a new account</Link>
        </p>
        <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        <PasswordInput id="password" placeholder="Your Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        {error && <p className="error-message" role="alert">{error}</p>}
        <button type="submit" className="btn btn-orange submit-btn" disabled={loading}>
          {loading ? "Logging in..." : "submit"}
        </button>
        <Link to="/register" className="text-link">Create an account?</Link>
      </form>
    </AuthLayout>
  );
}
export default Login;
