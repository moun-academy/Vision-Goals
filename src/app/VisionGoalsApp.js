"use client";

import { useMemo, useState } from "react";

const starterGoals = [
  {
    id: 1,
    title: "Launch personal portfolio v2",
    category: "Career",
    dueDate: "2026-05-15",
    priority: "High",
    progress: 70,
    done: false,
  },
  {
    id: 2,
    title: "Run 10k in under 52 minutes",
    category: "Health",
    dueDate: "2026-06-30",
    priority: "Medium",
    progress: 45,
    done: false,
  },
  {
    id: 3,
    title: "Read 12 books this year",
    category: "Learning",
    dueDate: "2026-12-20",
    priority: "Low",
    progress: 33,
    done: false,
  },
];

const categoryColors = {
  Career: "#7C3AED",
  Health: "#059669",
  Learning: "#0EA5E9",
  Finance: "#F59E0B",
  Personal: "#F43F5E",
};

const priorityBoost = {
  High: 1.4,
  Medium: 1.15,
  Low: 1,
};

function getDaysLeft(dueDate) {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ScoreRing({ score }) {
  const clamped = Math.max(0, Math.min(100, score));
  const angle = (clamped / 100) * 360;

  return (
    <div className="score-ring" style={{ background: `conic-gradient(#8B5CF6 ${angle}deg, #E2E8F0 ${angle}deg)` }}>
      <div className="score-ring__inner">
        <strong>{clamped}%</strong>
        <span>Focus Score</span>
      </div>
    </div>
  );
}

export default function VisionGoalsApp() {
  const [goals, setGoals] = useState(starterGoals);
  const [form, setForm] = useState({
    title: "",
    category: "Career",
    dueDate: "",
    priority: "Medium",
  });
  const [dailyIntent, setDailyIntent] = useState("Finish one high-impact task before noon.");

  const completedCount = useMemo(() => goals.filter((goal) => goal.done).length, [goals]);
  const completionRate = goals.length ? Math.round((completedCount / goals.length) * 100) : 0;

  const visionScore = useMemo(() => {
    if (!goals.length) return 0;
    const weightedProgress = goals.reduce((sum, goal) => {
      const adjusted = (goal.done ? 100 : goal.progress) * priorityBoost[goal.priority];
      return sum + adjusted;
    }, 0);
    const maxScore = goals.reduce((sum, goal) => sum + 100 * priorityBoost[goal.priority], 0);
    return Math.round((weightedProgress / maxScore) * 100);
  }, [goals]);

  const upcoming = useMemo(
    () =>
      [...goals]
        .filter((goal) => !goal.done)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 3),
    [goals]
  );

  const addGoal = () => {
    if (!form.title.trim() || !form.dueDate) return;

    const newGoal = {
      id: Date.now(),
      title: form.title.trim(),
      category: form.category,
      dueDate: form.dueDate,
      priority: form.priority,
      progress: 0,
      done: false,
    };

    setGoals((current) => [...current, newGoal]);
    setForm((current) => ({ ...current, title: "", dueDate: "", priority: "Medium" }));
  };

  const toggleComplete = (id) => {
    setGoals((current) =>
      current.map((goal) =>
        goal.id === id
          ? { ...goal, done: !goal.done, progress: goal.done ? Math.max(0, goal.progress - 20) : 100 }
          : goal
      )
    );
  };

  const updateProgress = (id, direction) => {
    setGoals((current) =>
      current.map((goal) => {
        if (goal.id !== id || goal.done) return goal;
        const delta = direction === "up" ? 10 : -10;
        return { ...goal, progress: Math.max(0, Math.min(100, goal.progress + delta)) };
      })
    );
  };

  return (
    <main className="app-shell">
      <div className="aurora aurora--one" />
      <div className="aurora aurora--two" />

      <section className="hero panel">
        <div>
          <p className="eyebrow">VisionOS Dashboard</p>
          <h1>Design your future with clarity, rhythm, and momentum.</h1>
          <p className="subtitle">
            Translate your long-term vision into actionable milestones and track momentum with a premium goal cockpit.
          </p>
          <div className="hero-badges">
            <span>{goals.length} active goals</span>
            <span>{completedCount} achieved</span>
            <span>{completionRate}% completion</span>
          </div>
        </div>
        <ScoreRing score={visionScore} />
      </section>

      <section className="grid">
        <article className="panel goals-panel">
          <div className="panel-head">
            <h2>Goal Matrix</h2>
            <p>Prioritize what compounds your growth.</p>
          </div>

          <ul className="goal-list">
            {goals.map((goal) => (
              <li key={goal.id} className={`goal-item ${goal.done ? "is-complete" : ""}`}>
                <div className="goal-main">
                  <div className="goal-title-row">
                    <button
                      className={`check ${goal.done ? "on" : ""}`}
                      onClick={() => toggleComplete(goal.id)}
                      type="button"
                      aria-label="Toggle completed"
                    >
                      {goal.done ? "✓" : ""}
                    </button>
                    <div>
                      <h3>{goal.title}</h3>
                      <p>
                        <span
                          className="tag"
                          style={{
                            color: categoryColors[goal.category] || "#6366F1",
                            borderColor: `${categoryColors[goal.category] || "#6366F1"}55`,
                          }}
                        >
                          {goal.category}
                        </span>
                        <span className="meta">Due {formatDate(goal.dueDate)}</span>
                        <span className={`meta priority ${goal.priority.toLowerCase()}`}>{goal.priority} priority</span>
                      </p>
                    </div>
                  </div>

                  <div className="progress-row">
                    <div className="meter">
                      <div className="meter-fill" style={{ width: `${goal.progress}%` }} />
                    </div>
                    <span className="progress-value">{goal.progress}%</span>
                  </div>
                </div>

                <div className="goal-actions">
                  <button type="button" onClick={() => updateProgress(goal.id, "down")}>
                    -10%
                  </button>
                  <button type="button" onClick={() => updateProgress(goal.id, "up")}>
                    +10%
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <aside className="right-column">
          <article className="panel composer">
            <div className="panel-head">
              <h2>Add New Goal</h2>
              <p>Create an intentional next step.</p>
            </div>
            <div className="form-grid">
              <input
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Goal title"
              />
              <select
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
              >
                {Object.keys(categoryColors).map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
              <input
                type="date"
                value={form.dueDate}
                onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))}
              />
              <select
                value={form.priority}
                onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))}
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <button type="button" className="primary" onClick={addGoal}>
                Add to Matrix
              </button>
            </div>
          </article>

          <article className="panel insights">
            <div className="panel-head">
              <h2>Upcoming Milestones</h2>
              <p>Stay ahead of deadlines.</p>
            </div>
            <ul>
              {upcoming.length ? (
                upcoming.map((goal) => (
                  <li key={goal.id}>
                    <strong>{goal.title}</strong>
                    <span>{getDaysLeft(goal.dueDate)} days left</span>
                  </li>
                ))
              ) : (
                <li>
                  <strong>Everything complete 🎉</strong>
                  <span>You are fully caught up.</span>
                </li>
              )}
            </ul>
          </article>

          <article className="panel journal">
            <div className="panel-head">
              <h2>Daily Intention</h2>
              <p>Set your focus statement.</p>
            </div>
            <textarea
              value={dailyIntent}
              onChange={(event) => setDailyIntent(event.target.value)}
              rows={3}
            />
            <p className="intent-preview">“{dailyIntent || "Write one clear intention."}”</p>
          </article>
        </aside>
      </section>
    </main>
  );
}
