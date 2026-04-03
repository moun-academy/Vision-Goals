"use client";

import { useMemo } from "react";

const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
  { text: "A goal without a plan is just a wish.", author: "Antoine de Saint-Exupery" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Dream big. Start small. Act now.", author: "Robin Sharma" },
  { text: "Your limitation—it's only your imagination.", author: "Unknown" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Vision without action is merely a dream. Action without vision just passes the time.", author: "Joel A. Barker" },
];

function StatCard({ icon, value, label, color, gradient }) {
  return (
    <div className="dash-stat" style={{ background: gradient }}>
      <div className="dash-stat-icon" style={{ background: color }}>{icon}</div>
      <div className="dash-stat-value">{value}</div>
      <div className="dash-stat-label">{label}</div>
    </div>
  );
}

export default function Dashboard({ goals, visionItems, onNavigate }) {
  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.done).length;
  const inProgressGoals = goals.filter((g) => !g.done).length;
  const totalVision = visionItems.length;
  const overallProgress = totalGoals ? Math.round((completedGoals / totalGoals) * 100) : 0;

  const quote = useMemo(() => {
    const idx = Math.floor(Date.now() / 86400000) % QUOTES.length;
    return QUOTES[idx];
  }, []);

  const categoryBreakdown = useMemo(() => {
    const cats = {};
    goals.forEach((g) => {
      const cat = g.category || "General";
      if (!cats[cat]) cats[cat] = { total: 0, done: 0 };
      cats[cat].total++;
      if (g.done) cats[cat].done++;
    });
    return Object.entries(cats).map(([name, data]) => ({
      name,
      ...data,
      pct: Math.round((data.done / data.total) * 100),
    }));
  }, [goals]);

  const upcomingGoals = useMemo(() => {
    return goals
      .filter((g) => !g.done && g.deadline)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 5);
  }, [goals]);

  const recentlyCompleted = useMemo(() => {
    return goals.filter((g) => g.done).slice(-3).reverse();
  }, [goals]);

  return (
    <div className="dashboard">
      {/* Hero / Quote */}
      <div className="dash-hero">
        <div className="dash-hero-content">
          <h2 className="dash-hero-greeting">Welcome back!</h2>
          <p className="dash-hero-quote">&ldquo;{quote.text}&rdquo;</p>
          <p className="dash-hero-author">&mdash; {quote.author}</p>
        </div>
        <div className="dash-hero-visual">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <defs>
              <linearGradient id="circGrad" x1="0" y1="0" x2="120" y2="120">
                <stop offset="0%" stopColor="#818CF8" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#C084FC" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="58" stroke="url(#circGrad)" strokeWidth="4" fill="none" />
            <circle
              cx="60" cy="60" r="58"
              stroke="#818CF8" strokeWidth="4" fill="none"
              strokeDasharray={`${overallProgress * 3.64} 364`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              style={{ transition: "stroke-dasharray 0.6s ease" }}
            />
            <text x="60" y="55" textAnchor="middle" fill="#4F46E5" fontSize="28" fontWeight="700">{overallProgress}%</text>
            <text x="60" y="75" textAnchor="middle" fill="#94A3B8" fontSize="11" fontWeight="500">COMPLETE</text>
          </svg>
        </div>
      </div>

      {/* Stats */}
      <div className="dash-stats-grid">
        <StatCard
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>}
          value={totalGoals}
          label="Total Goals"
          color="linear-gradient(135deg, #6366F1, #818CF8)"
          gradient="linear-gradient(135deg, #EEF2FF, #E0E7FF)"
        />
        <StatCard
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
          value={completedGoals}
          label="Completed"
          color="linear-gradient(135deg, #10B981, #34D399)"
          gradient="linear-gradient(135deg, #ECFDF5, #D1FAE5)"
        />
        <StatCard
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
          value={inProgressGoals}
          label="In Progress"
          color="linear-gradient(135deg, #F59E0B, #FBBF24)"
          gradient="linear-gradient(135deg, #FFFBEB, #FEF3C7)"
        />
        <StatCard
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>}
          value={totalVision}
          label="Vision Items"
          color="linear-gradient(135deg, #8B5CF6, #A78BFA)"
          gradient="linear-gradient(135deg, #F5F3FF, #EDE9FE)"
        />
      </div>

      {/* Category Breakdown + Upcoming */}
      <div className="dash-two-col">
        <div className="dash-card">
          <h3 className="dash-card-title">Progress by Category</h3>
          {categoryBreakdown.length === 0 ? (
            <p className="dash-empty-text">Add goals with categories to see breakdown</p>
          ) : (
            <div className="dash-categories">
              {categoryBreakdown.map((cat) => (
                <div key={cat.name} className="dash-cat-row">
                  <div className="dash-cat-header">
                    <span className="dash-cat-name">{cat.name}</span>
                    <span className="dash-cat-pct">{cat.done}/{cat.total}</span>
                  </div>
                  <div className="dash-cat-bar">
                    <div className="dash-cat-fill" style={{ width: `${cat.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dash-card">
          <h3 className="dash-card-title">Upcoming Deadlines</h3>
          {upcomingGoals.length === 0 ? (
            <p className="dash-empty-text">No upcoming deadlines. Set deadlines on your goals!</p>
          ) : (
            <ul className="dash-upcoming">
              {upcomingGoals.map((g) => (
                <li key={g.id} className="dash-upcoming-item">
                  <span className="dash-upcoming-text">{g.text}</span>
                  <span className="dash-upcoming-date">
                    {new Date(g.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recently Completed */}
      {recentlyCompleted.length > 0 && (
        <div className="dash-card">
          <h3 className="dash-card-title">Recently Completed</h3>
          <div className="dash-completed-list">
            {recentlyCompleted.map((g) => (
              <div key={g.id} className="dash-completed-item">
                <span className="dash-completed-check">&#10003;</span>
                <span>{g.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="dash-actions">
        <button className="dash-action-btn dash-action-btn--vision" onClick={() => onNavigate("vision")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          Add to Vision Board
        </button>
        <button className="dash-action-btn dash-action-btn--goal" onClick={() => onNavigate("goals")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          Create New Goal
        </button>
      </div>
    </div>
  );
}
