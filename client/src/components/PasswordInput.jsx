import { useState } from "react";

function PasswordInput({ id, value, onChange, placeholder, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div className="password-field">
      <input id={id} type={show ? "text" : "password"} placeholder={placeholder} value={value}
        onChange={onChange} autoComplete={autoComplete} required />
      <button type="button" className="eye" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#555" strokeWidth="1.6" strokeLinecap="round">
          <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
          {!show && <path d="M4 20L20 4" />}
        </svg>
      </button>
    </div>
  );
}
export default PasswordInput;
