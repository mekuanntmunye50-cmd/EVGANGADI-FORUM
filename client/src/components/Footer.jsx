import { Link } from "react-router-dom";
import Logo from "./Logo";

const icons = {
  facebook: <path d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v7h4v-7H16l.5-4h-3V9c0-.6.4-1 1-1z" />,
  instagram: <><rect x="4" y="4" width="16" height="16" rx="5" /><circle cx="12" cy="12" r="3.6" /><circle cx="17" cy="7" r=".8" /></>,
  youtube: <><rect x="3" y="5.5" width="18" height="13" rx="4" /><path d="M10.5 9.5v5l4-2.5z" /></>,
};

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <Logo light />
          <div className="socials">
            {Object.entries(icons).map(([n, p]) => (
              <a key={n} href="/" aria-label={n} onClick={(e) => e.preventDefault()}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="1.6">{p}</svg>
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4>Useful Link</h4>
          <ul>
            <li><Link to="/how-it-works">How it works</Link></li>
            <li><a href="/" onClick={(e) => e.preventDefault()}>Terms of Service</a></li>
            <li><a href="/" onClick={(e) => e.preventDefault()}>Privacy policy</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact Info</h4>
          <ul>
            <li>Evangadi Networks</li>
            <li>support@evangadi.com</li>
            <li>+1-202-386-2702</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
