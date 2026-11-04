function Avatar({ name, size = 90 }) {
  return (
    <div className="avatar-wrap" title={name}>
      <svg className="avatar" width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="46" fill="#e6e6e6" stroke="#a6a6a6" strokeWidth="8" />
        <circle cx="50" cy="40" r="15" fill="#a6a6a6" />
        <path d="M22 80c4-17 16-24 28-24s24 7 28 24c-8 8-18 12-28 12S30 88 22 80z" fill="#a6a6a6" />
      </svg>
      {name && <span className="avatar-name">{name}</span>}
    </div>
  );
}
export default Avatar;
