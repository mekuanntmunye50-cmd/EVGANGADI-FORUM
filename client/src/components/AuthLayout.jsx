import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

// Shared layout for Login and Register (form card + About text)
function AuthLayout({ children }) {
  return (
    <>
      <Header />
      <main className="auth-page">
        <div className="blob blob-blue" />
        <div className="blob blob-pink" />
        <div className="auth-inner">
          <div className="auth-card">{children}</div>
          <section className="auth-about">
            <span className="about-label">About</span>
            <h1>Evangadi Networks Q&amp;A</h1>
            <p>Evangadi Networks is a community where learners and developers ask questions, share what they know, and help each other grow.</p>
            <p>Browse questions from other members, post your own, and get answers from people who have solved the same problems.</p>
            <p>Join the network to start learning together and building your skills one question at a time.</p>
            <Link to="/how-it-works" className="btn btn-orange">HOW IT WORKS</Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
export default AuthLayout;
