import { Link } from "react-router-dom";

// Text recreation of the Evangadi wordmark (orange "V" slash)
function Logo({ light = false, to = "/" }) {
  return (
    <Link to={to} className={`logo ${light ? "logo-light" : ""}`} aria-label="Evangadi home">
      <span className="logo-e">E</span>
      <span className="logo-v">V</span>
      <span>ANGADI</span>
    </Link>
  );
}
export default Logo;
