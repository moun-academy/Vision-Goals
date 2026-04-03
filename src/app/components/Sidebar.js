"use client";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "vision", label: "Vision Board", icon: "vision" },
  { id: "goals", label: "Goals", icon: "goals" },
];

function NavIcon({ type, active }) {
  const color = active ? "#fff" : "#94A3B8";
  if (type === "dashboard")
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    );
  if (type === "vision")
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    );
  if (type === "goals")
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    );
  return null;
}

export default function Sidebar({ activeView, onNavigate, goalCount, visionCount }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="24" y2="24">
                <stop offset="0%" stopColor="#818CF8" />
                <stop offset="100%" stopColor="#C084FC" />
              </linearGradient>
            </defs>
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#logoGrad)" />
          </svg>
        </div>
        <div className="sidebar-brand-text">
          <span className="sidebar-title">Vision & Goals</span>
          <span className="sidebar-subtitle">Dream. Plan. Achieve.</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`sidebar-nav-item ${activeView === item.id ? "sidebar-nav-item--active" : ""}`}
            onClick={() => onNavigate(item.id)}
          >
            <NavIcon type={item.icon} active={activeView === item.id} />
            <span>{item.label}</span>
            {item.id === "goals" && goalCount > 0 && (
              <span className="sidebar-badge">{goalCount}</span>
            )}
            {item.id === "vision" && visionCount > 0 && (
              <span className="sidebar-badge sidebar-badge--purple">{visionCount}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-quote">
          &ldquo;The future belongs to those who believe in the beauty of their dreams.&rdquo;
          <span className="sidebar-quote-author">&mdash; Eleanor Roosevelt</span>
        </div>
      </div>
    </aside>
  );
}
