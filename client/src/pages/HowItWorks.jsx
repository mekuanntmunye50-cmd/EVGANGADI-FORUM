import Header from "../components/Header";
import Footer from "../components/Footer";

function HowItWorks() {
  return (
    <>
      <Header />
      <main className="page-container narrow how-page">
        <h1>How Evangadi Q&amp;A works</h1>
        <ol>
          <li>Create an account and log in.</li>
          <li>Browse the questions other members have asked.</li>
          <li>Open a question to read the answers from the community.</li>
          <li>Ask your own question, or share your knowledge by answering.</li>
        </ol>
      </main>
      <Footer />
    </>
  );
}
export default HowItWorks;
