import { Navigate } from "react-router-dom";
import { getToken } from "../utils/auth";

function ProtectedRoute({ children }) {
  return getToken() ? children : <Navigate to="/" replace />;
}
export default ProtectedRoute;
