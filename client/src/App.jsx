import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AskQuestion from "./pages/AskQuestion";
import QuestionDetail from "./pages/QuestionDetail";
import HowItWorks from "./pages/HowItWorks";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/register" element={<Register />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/ask" element={<ProtectedRoute><AskQuestion /></ProtectedRoute>} />
      <Route path="/question/:id" element={<ProtectedRoute><QuestionDetail /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
export default App;
