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

  const completed = useMemo(() => goals.filter((goal) => goal.done).length, [goals]);
  const progress = goals.length ? Math.round((completed / goals.length) * 100) : 0;

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

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "2rem",
        background: "linear-gradient(135deg, #EEF2FF 0%, #F8FAFC 100%)",
        color: "#0F172A",
      }}
    >
      <section
        style={{
          maxWidth: 680,
          margin: "0 auto",
          background: "white",
          borderRadius: 16,
          boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
          padding: "1.5rem",
        }}
      >
        <h1 style={{ marginTop: 0 }}>Vision & Goals</h1>
        <p style={{ marginTop: 0, color: "#334155" }}>
          Keep your goals visible and track progress daily.
        </p>

        <div style={{ marginBottom: "1rem" }}>
          <div
            style={{
              width: "100%",
              height: 10,
              background: "#E2E8F0",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "#6366F1",
                transition: "width 0.2s ease",
              }}
            />
          </div>
          <small style={{ color: "#475569" }}>
            {completed} / {goals.length} complete ({progress}%)
          </small>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && addGoal()}
            placeholder="Add a new goal"
            style={{
              flex: 1,
              padding: "0.65rem 0.75rem",
              borderRadius: 10,
              border: "1px solid #CBD5E1",
            }}
          />
          <button
            type="button"
            onClick={addGoal}
            style={{
              padding: "0.65rem 1rem",
              border: "none",
              borderRadius: 10,
              background: "#4F46E5",
              color: "white",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {goals.map((goal) => (
            <li
              key={goal.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                padding: "0.55rem 0",
                borderBottom: "1px solid #F1F5F9",
              }}
            >
              <input
                type="checkbox"
                checked={goal.done}
                onChange={() => toggleGoal(goal.id)}
              />
              <span
                style={{
                  textDecoration: goal.done ? "line-through" : "none",
                  color: goal.done ? "#94A3B8" : "#0F172A",
                }}
              >
                {goal.text}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
