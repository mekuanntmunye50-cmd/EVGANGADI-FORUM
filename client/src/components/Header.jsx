import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { getToken, clearToken } from "../utils/auth";

function Header() {
  const navigate = useNavigate();
  const loggedIn = Boolean(getToken());

  function logout() {
    clearToken();
    navigate("/");
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Logo to={loggedIn ? "/home" : "/"} />
        <nav className="header-nav">
          <Link to={loggedIn ? "/home" : "/"}>Home</Link>
          <Link to="/how-it-works">How it Works</Link>
          {loggedIn ? (
            <button type="button" className="btn btn-blue nav-btn" onClick={logout}>LogOut</button>
          ) : (
            <Link to="/" className="btn btn-blue nav-btn">SIGN IN</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
export default Header;
