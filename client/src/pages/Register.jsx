import React, { useRef, useState } from "react";
import axios from "axios";
// React — the library used to build your user interface.
// useRef — lets you access the actual input elements and read their current values.
// useState — lets React remember information that changes, such as loading, errors, and success messages.
// axios — a library that sends HTTP requests between your frontend and backend.
function Register() {
  // References to the input fields
  const userNameDom = useRef(null);
  const firstNameDom = useRef(null);
  const lastNameDom = useRef(null);
  const emailDom = useRef(null);
  const passwordDom = useRef(null);
  const confirmPasswordDom = useRef(null);

  // State for loading, success, and error messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const username = userNameDom.current.value.trim();
    const firstName = firstNameDom.current.value.trim();
    const lastName = lastNameDom.current.value.trim();
    const email = emailDom.current.value.trim();
    const password = passwordDom.current.value;
    const confirmPassword = confirmPasswordDom.current.value;

    // Validate passwords
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    // Prepare the data for the backend
   
const userData = {
  username,
  firstname: firstName,
  lastname: lastName,
  email,
  PASSWORD: password,
};


    try {
      setLoading(true);

      // Send registration data to your Express backend
      const response = await axios.post(
        "http://localhost:5500/api/users/register",
        userData
      );

      setSuccess(
        response.data.message || "Registration successful!"
      );

      // Clear the form after successful registration
      userNameDom.current.value = "";
      firstNameDom.current.value = "";
      lastNameDom.current.value = "";
      emailDom.current.value = "";
      passwordDom.current.value = "";
      confirmPasswordDom.current.value = "";
    } catch (err) {
      if (err.response) {
        setError(
          err.response.data.message ||
            err.response.data.msg ||
            "Registration failed. Please check your information."
        );
      } else if (err.request) {
        setError(
          "Cannot connect to the server. Check that your backend is running."
        );
      } else {
        setError("An unexpected error occurred.");
      }

      console.error("Registration error:", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="register-page">
      <div className="register-container">
        <h2>Create Your Evangadi Forum Account</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter username"
              ref={userNameDom}
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              placeholder="Enter first name"
              ref={firstNameDom}
              autoComplete="given-name"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              placeholder="Enter last name"
              ref={lastNameDom}
              autoComplete="family-name"
              required
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter email address"
              ref={emailDom}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create password"
              ref={passwordDom}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm password"
              ref={confirmPasswordDom}
              autoComplete="new-password"
              required
            />
          </div>

          {error && <p role="alert">{error}</p>}

          {success && <p role="status">{success}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Register;