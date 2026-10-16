
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css"

const API_URL = "http://localhost:5500/api";

function Home() {
  const navigate = useNavigate();

  // Question state
  const [questions, setQuestions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionDescription, setQuestionDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Answer state
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [answersLoading, setAnswersLoading] = useState({});
  const [answerErrors, setAnswerErrors] = useState({});
  const [answerDrafts, setAnswerDrafts] = useState({});
  const [answerSubmitting, setAnswerSubmitting] = useState({});
  const [answerSuccess, setAnswerSuccess] = useState({});

  // Fetch questions
  async function fetchQuestions() {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_URL}/question`);

      if (!Array.isArray(response.data.questions)) {
        throw new Error("Invalid questions response from server.");
      }

      setQuestions(response.data.questions);
    } catch (err) {
      console.error("Fetch questions error:", err);

      setError(
        err.response?.data?.msg ||
          err.response?.data?.message ||
          err.message ||
          "Failed to load questions."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Filter questions
  const filteredQuestions = questions.filter((question) => {
    const search = searchText.toLowerCase().trim();

    return (
      String(question.title || "").toLowerCase().includes(search) ||
      String(question.content || question.description || "")
        .toLowerCase()
        .includes(search) ||
      String(question.user_name || "").toLowerCase().includes(search)
    );
  });

  // Fetch answers for a question
  async function fetchAnswers(questionId) {
    setAnswersLoading((previous) => ({
      ...previous,
      [questionId]: true,
    }));

    setAnswerErrors((previous) => ({
      ...previous,
      [questionId]: "",
    }));

    try {
      const response = await axios.get(
        `${API_URL}/answer/${encodeURIComponent(questionId)}`
      );

      if (!Array.isArray(response.data.answers)) {
        throw new Error("Invalid answers response from server.");
      }

      setAnswers((previous) => ({
        ...previous,
        [questionId]: response.data.answers,
      }));

      return true;
    } catch (err) {
      console.error("Fetch answers error:", err);

      setAnswerErrors((previous) => ({
        ...previous,
        [questionId]:
          err.response?.data?.msg ||
          err.response?.data?.message ||
          "Failed to load answers.",
      }));

      return false;
    } finally {
      setAnswersLoading((previous) => ({
        ...previous,
        [questionId]: false,
      }));
    }
  }

  // Show or hide answers
  async function handleViewAnswers(questionId) {
    if (expandedQuestionId === questionId) {
      setExpandedQuestionId(null);
      return;
    }

    setExpandedQuestionId(questionId);

    if (Array.isArray(answers[questionId])) {
      return;
    }

    await fetchAnswers(questionId);
  }

  // Update answer text for the selected question
  function handleAnswerChange(questionId, value) {
    setAnswerDrafts((previous) => ({
      ...previous,
      [questionId]: value,
    }));

    setAnswerErrors((previous) => ({
      ...previous,
      [questionId]: "",
    }));

    setAnswerSuccess((previous) => ({
      ...previous,
      [questionId]: "",
    }));
  }

  // Submit an answer
  async function handleSubmitAnswer(event, questionId) {
    event.preventDefault();

    const answerText = (answerDrafts[questionId] || "").trim();

    if (!answerText) {
      setAnswerErrors((previous) => ({
        ...previous,
        [questionId]: "Please write your answer before submitting.",
      }));
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setAnswerSubmitting((previous) => ({
        ...previous,
        [questionId]: true,
      }));

      setAnswerErrors((previous) => ({
        ...previous,
        [questionId]: "",
      }));

      setAnswerSuccess((previous) => ({
        ...previous,
        [questionId]: "",
      }));

      // Send the answer to the backend
      await axios.post(
        `${API_URL}/answer`,
        {
          questionid: questionId,
          answer: answerText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Clear the input after successful submission
      setAnswerDrafts((previous) => ({
        ...previous,
        [questionId]: "",
      }));

      // Refresh answers so the new answer appears
      const refreshed = await fetchAnswers(questionId);

      if (refreshed) {
        setAnswerSuccess((previous) => ({
          ...previous,
          [questionId]: "Your answer was posted successfully!",
        }));
      }
    } catch (err) {
      console.error("Submit answer error:", err);

      if (err.response?.status === 401) {
        setAnswerErrors((previous) => ({
          ...previous,
          [questionId]: "Your session has expired. Please log in again.",
        }));
      } else {
        setAnswerErrors((previous) => ({
          ...previous,
          [questionId]:
            err.response?.data?.msg ||
            err.response?.data?.message ||
            "Failed to post your answer. Please try again.",
        }));
      }
    } finally {
      setAnswerSubmitting((previous) => ({
        ...previous,
        [questionId]: false,
      }));
    }
  }

  // Submit a new question
  async function handleSubmitQuestion(event) {
    event.preventDefault();

    const title = questionTitle.trim();
    const description = questionDescription.trim();

    if (!title || !description) {
      setError("Please enter both a question title and description.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await axios.post(
        `${API_URL}/question`,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setQuestionTitle("");
      setQuestionDescription("");

      await fetchQuestions();
    } catch (err) {
      console.error("Submit question error:", err);

      setError(
        err.response?.data?.msg ||
          err.response?.data?.message ||
          "Failed to submit your question."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Ask-question button
  function handleAskQuestion() {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    document
      .getElementById("ask-question-form")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  // Logout
  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  // Format dates
  function formatDate(dateValue) {
    if (!dateValue) return "Date unavailable";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleDateString();
  }

  return (
    <main className="home-page">
      <header className="home-header">
        <Link to="/" className="home-logo">
          Evangadi Forum
        </Link>

        <nav className="home-navigation">
          <Link to="/">Home</Link>

          {!localStorage.getItem("token") ? (
            <Link to="/login">Login</Link>
          ) : (
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          )}

          <Link to="/register">Register</Link>
        </nav>
      </header>

      <section className="home-welcome">
        <h1>Welcome to Evangadi Forum</h1>
        <p>
          Ask questions, share knowledge, and learn from the community.
        </p>

        <button type="button" onClick={handleAskQuestion}>
          Ask a Question
        </button>
      </section>

      {/* Ask a question */}
      <section id="ask-question-form" className="ask-question-section">
        <h2>Ask Your Question</h2>

        <form onSubmit={handleSubmitQuestion}>
          <div className="form-group">
            <label htmlFor="question-title">Question title</label>
            <input
              id="question-title"
              type="text"
              placeholder="Enter your question title"
              value={questionTitle}
              onChange={(event) => setQuestionTitle(event.target.value)}
              maxLength={200}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="question-description">
              Question description
            </label>
            <textarea
              id="question-description"
              placeholder="Explain your question in detail"
              value={questionDescription}
              onChange={(event) =>
                setQuestionDescription(event.target.value)
              }
              rows={5}
              required
            />
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Post Question"}
          </button>
        </form>
      </section>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {/* Community questions */}
      <section className="questions-section">
        <div className="questions-heading">
          <h2>Community Questions</h2>

          <button type="button" onClick={fetchQuestions}>
            Refresh
          </button>
        </div>

        <div className="search-container">
          <label htmlFor="question-search">Search questions</label>
          <input
            id="question-search"
            type="search"
            placeholder="Search by title, description, or author..."
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading questions...</p>
        ) : questions.length === 0 ? (
          <p>No questions have been posted yet.</p>
        ) : filteredQuestions.length === 0 ? (
          <p>No questions match your search.</p>
        ) : (
          <div className="questions-list">
            {filteredQuestions.map((question) => {
              const questionId = question.question_id;
              const isExpanded = expandedQuestionId === questionId;
              const isLoggedIn = Boolean(localStorage.getItem("token"));

              return (
                <article className="question-card" key={questionId}>
                  <div className="question-author">
                    <strong>
                      {question.user_name || "Community member"}
                    </strong>
                    <small>{formatDate(question.created_at)}</small>
                  </div>

                  <h3>{question.title}</h3>
                  <p>{question.content || question.description}</p>

                  <button
                    type="button"
                    onClick={() => handleViewAnswers(questionId)}
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? "Hide Answers" : "View Answers"}
                  </button>

                  {isExpanded && (
                    <section className="answers-section">
                      <h4>Answers</h4>

                      {answersLoading[questionId] && (
                        <p>Loading answers...</p>
                      )}

                      {answerErrors[questionId] && (
                        <div className="error-message" role="alert">
                          <p>{answerErrors[questionId]}</p>
                          <button
                            type="button"
                            onClick={() => fetchAnswers(questionId)}
                          >
                            Try Again
                          </button>
                        </div>
                      )}

                      {!answersLoading[questionId] &&
                        !answerErrors[questionId] &&
                        Array.isArray(answers[questionId]) &&
                        answers[questionId].length === 0 && (
                          <p>
                            No answers posted yet. Be the first to answer!
                          </p>
                        )}

                      {!answersLoading[questionId] &&
                        !answerErrors[questionId] &&
                        (answers[questionId] || []).map((answer, index) => (
                          <article
                            className="answer-card"
                            key={answer.answer_id ?? answer.answerid ?? index}
                          >
                            <p>
                              {answer.content ??
                                answer.answer ??
                                "Answer content unavailable."}
                            </p>

                            <small>
                              Answered by{" "}
                              {answer.user_name ||
                                answer.username ||
                                "Community member"}
                            </small>

                            {answer.created_at && (
                              <small>
                                {" "}· {formatDate(answer.created_at)}
                              </small>
                            )}
                          </article>
                        ))}

                      {/* Answer submission form */}
                      <div className="post-answer-section">
                        <h4>Your Answer</h4>

                        {isLoggedIn ? (
                          <form
                            onSubmit={(event) =>
                              handleSubmitAnswer(event, questionId)
                            }
                          >
                            <div className="form-group">
                              <label htmlFor={`answer-${questionId}`}>
                                Write your answer
                              </label>

                              <textarea
                                id={`answer-${questionId}`}
                                placeholder="Share your knowledge and explain your answer..."
                                value={answerDrafts[questionId] || ""}
                                onChange={(event) =>
                                  handleAnswerChange(
                                    questionId,
                                    event.target.value
                                  )
                                }
                                rows={4}
                                maxLength={10000}
                                required
                              />
                            </div>

                            <button
                              type="submit"
                              disabled={Boolean(
                                answerSubmitting[questionId]
                              )}
                            >
                              {answerSubmitting[questionId]
                                ? "Posting Answer..."
                                : "Post Answer"}
                            </button>
                          </form>
                        ) : (
                          <p>
                            Please <Link to="/login">log in</Link> to post
                            an answer.
                          </p>
                        )}

                        {answerSuccess[questionId] && (
                          <p role="status" className="success-message">
                            {answerSuccess[questionId]}
                          </p>
                        )}
                      </div>
                    </section>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;
