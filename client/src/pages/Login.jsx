import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  // Form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Loading and messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Frontend validation
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      // Connect to the Express backend
      const response = await axios.post(
        "http://localhost:5500/api/users/login",
        {
          email: email.trim(),
          PASSWORD: password,
        }
      );

      // Save the JWT token returned by the backend
      const token = response.data.token;

      if (!token) {
        setError("Login failed: the server did not return a token.");
        return;
      }

      localStorage.setItem("token", token);

      setSuccess(
        response.data.msg || "Login successful!"
      );

      // Navigate to the home page
      navigate("/");

    } catch (err) {
      if (err.response) {
        setError(
          err.response.data.msg ||
          err.response.data.message ||
          "Login failed. Please check your credentials."
        );
      } else if (err.request) {
        setError(
          "Cannot connect to the server. Please check your connection."
        );
      } else {
        setError("An unexpected error occurred.");
      }

      console.error("Login error:", err.message);

    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="login-page">
      <div className="login-container">
        <h2>Welcome Back to Evangadi Forum</h2>

        <p>Log in to continue your learning journey.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          {success && (
            <p className="success-message" role="status">
              {success}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="register-link">
          Don't have an account?{" "}
          <Link to="/register">Register here</Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
