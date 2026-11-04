import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "./axiosConfig";
import Header from "../components/Header";
import Avatar from "../components/Avatar";
import { authHeaders, clearToken } from "../utils/auth";

function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");

  const load = useCallback(async () => {
    try {
      const [q, a] = await Promise.all([axios.get(`/question/${id}`), axios.get(`/answer/${id}`)]);
      setQuestion(q.data.question);
      setAnswers(a.data.answers || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.msg || "Failed to load this question.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!draft.trim()) {
      setPostError("Please write your answer first.");
      return;
    }
    try {
      setPosting(true);
      setPostError("");
      await axios.post("/answer", { questionid: Number(id), answer: draft.trim() }, authHeaders());
      setDraft("");
      await load();
    } catch (err) {
      if (err.response?.status === 401) {
        clearToken();
        navigate("/");
        return;
      }
      setPostError(err.response?.data?.message || err.response?.data?.msg || "Failed to post your answer.");
    } finally {
      setPosting(false);
    }
  }

  return (
    <>
      <Header />
      <main className="page-container narrow">
        {loading && <p className="muted">Loading...</p>}
        {error && <p className="error-message" role="alert">{error}</p>}

        {question && (
          <>
            <section className="detail-question">
              <h2>Question</h2>
              <h3>{question.title}</h3>
              <p>{question.content}</p>
            </section>

            <h2 className="section-title bordered">Answer From The Community</h2>

            {answers.length === 0 && <p className="muted">No answers yet. Be the first to answer!</p>}
            <div className="answer-list">
              {answers.map((a) => (
                <div className="answer-row" key={a.answer_id}>
                  <Avatar name={a.user_name} />
                  <p>{a.content}</p>
                </div>
              ))}
            </div>

            <section className="form-card answer-card">
              <h2>Answer The Top Question</h2>
              <Link to="/home" className="goto">Go to Question page</Link>
              <form onSubmit={handleSubmit}>
                <textarea placeholder="Your Answer..." rows={7} value={draft} onChange={(e) => setDraft(e.target.value)} required />
                {postError && <p className="error-message" role="alert">{postError}</p>}
                <button type="submit" className="btn btn-blue post-btn" disabled={posting}>
                  {posting ? "Posting..." : "Post Your Answer"}
                </button>
              </form>
            </section>
          </>
        )}
      </main>
    </>
  );
}
export default QuestionDetail;
