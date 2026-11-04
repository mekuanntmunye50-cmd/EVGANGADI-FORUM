import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "./axiosConfig";
import Header from "../components/Header";
import Avatar from "../components/Avatar";
import { authHeaders, clearToken } from "../utils/auth";

function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [me, qs] = await Promise.all([
          axios.get("/users/check", authHeaders()),
          axios.get("/question"),
        ]);
        setUsername(me.data.username);
        setQuestions(qs.data.questions || []);
      } catch (err) {
        if (err.response?.status === 401) {
          clearToken();
          navigate("/");
          return;
        }
        setError(err.response?.data?.message || err.response?.data?.msg || "Failed to load questions.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [navigate]);

  return (
    <>
      <Header />
      <main className="page-container">
        <div className="home-top">
          <Link to="/ask" className="btn btn-blue ask-btn">Ask Question</Link>
          <h3 className="welcome">Welcome: {username}</h3>
        </div>

        <h2 className="section-title">Questions</h2>

        {loading && <p className="muted">Loading questions...</p>}
        {error && <p className="error-message" role="alert">{error}</p>}
        {!loading && !error && questions.length === 0 && <p className="muted">No questions have been posted yet.</p>}

        <div className="question-list">
          {questions.map((q) => (
            <Link to={`/question/${q.question_id}`} className="question-row" key={q.question_id}>
              <Avatar name={q.user_name} />
              <span className="question-title">{q.title}</span>
              <svg className="chevron" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 4l8 8-8 8" /></svg>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
export default Home;
