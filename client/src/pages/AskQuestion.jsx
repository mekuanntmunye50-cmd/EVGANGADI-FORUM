import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "./axiosConfig";
import Header from "../components/Header";
import { authHeaders, clearToken } from "../utils/auth";

function AskQuestion() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Please enter both a title and a description.");
      return;
    }
    try {
      setSubmitting(true);
      setError("");
      await axios.post("/question", { title: title.trim(), description: description.trim() }, authHeaders());
      navigate("/home");
    } catch (err) {
      if (err.response?.status === 401) {
        clearToken();
        navigate("/");
        return;
      }
      setError(err.response?.data?.message || err.response?.data?.msg || "Failed to post your question.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <main className="page-container narrow">
        <section className="steps">
          <h2>Steps to write a good question</h2>
          <ul>
            <li>Summerize your problem in a one-line title.</li>
            <li>Describe your problem in more detail.</li>
            <li>Describe what you tried and what you expected to happen.</li>
            <li>Review your question and post it to the site.</li>
          </ul>
        </section>

        <section className="form-card">
          <h2>Ask a public question</h2>
          <Link to="/home" className="goto">Go to Question page</Link>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Title" value={title} maxLength={200} onChange={(e) => setTitle(e.target.value)} required />
            <textarea placeholder="Question Description..." rows={7} value={description} onChange={(e) => setDescription(e.target.value)} required />
            {error && <p className="error-message" role="alert">{error}</p>}
            <button type="submit" className="btn btn-blue post-btn" disabled={submitting}>
              {submitting ? "Posting..." : "Post Your Question"}
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
export default AskQuestion;
