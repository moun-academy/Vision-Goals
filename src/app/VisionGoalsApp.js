"use client";

import { useMemo, useState } from "react";

const initialGoals = [
  { id: 1, text: "Define your 12-month vision", done: false },
  { id: 2, text: "Set 3 measurable quarterly goals", done: false },
  { id: 3, text: "Review progress every Friday", done: false },
];

export default function VisionGoalsApp() {
  const [goals, setGoals] = useState(initialGoals);
  const [draft, setDraft] = useState("");

  const completed = useMemo(
    () => goals.filter((goal) => goal.done).length,
    [goals]
  );
  const progress = goals.length
    ? Math.round((completed / goals.length) * 100)
    : 0;

  const addGoal = () => {
    const text = draft.trim();
    if (!text) return;
    setGoals((current) => [
      ...current,
      { id: Date.now(), text, done: false },
    ]);
    setDraft("");
  };

  const toggleGoal = (id) => {
    setGoals((current) =>
      current.map((goal) =>
        goal.id === id ? { ...goal, done: !goal.done } : goal
      )
    );
  };

  const deleteGoal = (id) => {
    setGoals((current) => current.filter((goal) => goal.id !== id));
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        .vg-main {
          min-height: 100vh;
          padding: 2rem 1rem;
          background: linear-gradient(160deg, #EEF2FF 0%, #E0E7FF 30%, #F8FAFC 70%, #EEF2FF 100%);
          color: #0F172A;
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }

        .vg-container {
          width: 100%;
          max-width: 640px;
          margin-top: 2rem;
        }

        .vg-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .vg-header h1 {
          font-size: 2rem;
          font-weight: 800;
          margin: 0 0 0.25rem;
          background: linear-gradient(135deg, #4F46E5, #7C3AED);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.025em;
        }

        .vg-header p {
          margin: 0;
          color: #64748B;
          font-size: 0.95rem;
          font-weight: 400;
        }

        .vg-card {
          background: white;
          border-radius: 20px;
          box-shadow:
            0 1px 3px rgba(15, 23, 42, 0.04),
            0 8px 32px rgba(15, 23, 42, 0.08);
          padding: 1.75rem;
          animation: slideUp 0.4s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .vg-progress-section {
          margin-bottom: 1.5rem;
        }

        .vg-progress-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 0.5rem;
        }

        .vg-progress-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .vg-progress-count {
          font-size: 0.85rem;
          font-weight: 600;
          color: #6366F1;
        }

        .vg-progress-track {
          width: 100%;
          height: 8px;
          background: #F1F5F9;
          border-radius: 999px;
          overflow: hidden;
        }

        .vg-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366F1, #8B5CF6);
          border-radius: 999px;
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .vg-input-row {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }

        .vg-input {
          flex: 1;
          padding: 0.7rem 1rem;
          border-radius: 12px;
          border: 1.5px solid #E2E8F0;
          font-family: inherit;
          font-size: 0.9rem;
          color: #0F172A;
          background: #F8FAFC;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }

        .vg-input::placeholder {
          color: #94A3B8;
        }

        .vg-input:focus {
          border-color: #818CF8;
          background: white;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .vg-add-btn {
          padding: 0.7rem 1.25rem;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #4F46E5, #6366F1);
          color: white;
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          white-space: nowrap;
        }

        .vg-add-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.35);
        }

        .vg-add-btn:active {
          transform: translateY(0);
        }

        .vg-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .vg-goal {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 0.5rem;
          border-radius: 10px;
          transition: background 0.15s;
          position: relative;
          group: true;
        }

        .vg-goal:hover {
          background: #F8FAFC;
        }

        .vg-goal + .vg-goal {
          border-top: 1px solid #F1F5F9;
        }

        .vg-checkbox {
          appearance: none;
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 7px;
          border: 2px solid #CBD5E1;
          cursor: pointer;
          position: relative;
          flex-shrink: 0;
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
        }

        .vg-checkbox:hover {
          border-color: #818CF8;
          transform: scale(1.05);
        }

        .vg-checkbox:checked {
          background: linear-gradient(135deg, #6366F1, #8B5CF6);
          border-color: transparent;
        }

        .vg-checkbox:checked::after {
          content: "";
          position: absolute;
          left: 6px;
          top: 3px;
          width: 6px;
          height: 10px;
          border: solid white;
          border-width: 0 2.5px 2.5px 0;
          transform: rotate(45deg);
        }

        .vg-goal-text {
          flex: 1;
          font-size: 0.925rem;
          line-height: 1.4;
          transition: color 0.2s;
        }

        .vg-goal-text--done {
          text-decoration: line-through;
          color: #94A3B8;
        }

        .vg-delete-btn {
          opacity: 0;
          border: none;
          background: none;
          color: #94A3B8;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 6px;
          font-size: 1.1rem;
          line-height: 1;
          transition: opacity 0.15s, color 0.15s;
          flex-shrink: 0;
        }

        .vg-goal:hover .vg-delete-btn {
          opacity: 1;
        }

        .vg-delete-btn:hover {
          color: #EF4444;
        }

        .vg-empty {
          text-align: center;
          padding: 2.5rem 1rem;
          color: #94A3B8;
        }

        .vg-empty-icon {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          opacity: 0.5;
        }

        .vg-empty p {
          margin: 0;
          font-size: 0.9rem;
        }

        .vg-footer {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.78rem;
          color: #94A3B8;
        }

        @media (max-width: 480px) {
          .vg-main { padding: 1rem 0.75rem; }
          .vg-container { margin-top: 1rem; }
          .vg-header h1 { font-size: 1.65rem; }
          .vg-card { padding: 1.25rem; border-radius: 16px; }
        }
      `}</style>

      <main className="vg-main">
        <div className="vg-container">
          <header className="vg-header">
            <h1>Vision &amp; Goals</h1>
            <p>Keep your goals visible and track progress daily.</p>
          </header>

          <div className="vg-card">
            <div className="vg-progress-section">
              <div className="vg-progress-header">
                <span className="vg-progress-label">Progress</span>
                <span className="vg-progress-count">
                  {completed} / {goals.length} complete &middot; {progress}%
                </span>
              </div>
              <div className="vg-progress-track">
                <div
                  className="vg-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="vg-input-row">
              <input
                className="vg-input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addGoal()}
                placeholder="Add a new goal..."
              />
              <button type="button" className="vg-add-btn" onClick={addGoal}>
                Add
              </button>
            </div>

            {goals.length === 0 ? (
              <div className="vg-empty">
                <div className="vg-empty-icon">&#9898;</div>
                <p>No goals yet. Add one above to get started!</p>
              </div>
            ) : (
              <ul className="vg-list">
                {goals.map((goal) => (
                  <li key={goal.id} className="vg-goal">
                    <input
                      type="checkbox"
                      className="vg-checkbox"
                      checked={goal.done}
                      onChange={() => toggleGoal(goal.id)}
                    />
                    <span
                      className={`vg-goal-text ${goal.done ? "vg-goal-text--done" : ""}`}
                    >
                      {goal.text}
                    </span>
                    <button
                      type="button"
                      className="vg-delete-btn"
                      onClick={() => deleteGoal(goal.id)}
                      aria-label="Delete goal"
                    >
                      &#x2715;
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="vg-footer">
            Track your vision, goals, and milestones
          </div>
        </div>
      </main>
    </>
  );
}
