"use client";

import { useEffect, useMemo, useState } from "react";

const GOALS_KEY = "vision_goals_v2";
const BOARD_KEY = "vision_board_v2";

const starterGoals = [
  {
    id: 1,
    title: "Build a meaningful product people love",
    category: "Career",
    dueDate: "2026-08-15",
    progress: 55,
    done: false,
  },
  {
    id: 2,
    title: "Achieve elite health consistency",
    category: "Health",
    dueDate: "2026-07-01",
    progress: 40,
    done: false,
  },
  {
    id: 3,
    title: "Design a calm dream home aesthetic",
    category: "Lifestyle",
    dueDate: "2026-11-30",
    progress: 20,
    done: false,
  },
];

const starterBoard = [
  {
    id: 1,
    title: "Dream workspace",
    note: "Creative, minimal, and full of light",
    image:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
    theme: "Career",
  },
  {
    id: 2,
    title: "Strong body, clear mind",
    note: "Daily movement and recovery",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
    theme: "Health",
  },
  {
    id: 3,
    title: "Travel and wonder",
    note: "One soul-filling trip each quarter",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    theme: "Lifestyle",
  },
];

function formatDate(dateValue) {
  return new Date(dateValue).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function readLocalStorage(key, fallback) {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export default function VisionGoalsApp() {
  const [view, setView] = useState("board");

  const [goals, setGoals] = useState(starterGoals);
  const [boardItems, setBoardItems] = useState(starterBoard);

  const [goalDraft, setGoalDraft] = useState({
    title: "",
    category: "Career",
    dueDate: "",
  });

  const [boardDraft, setBoardDraft] = useState({
    title: "",
    note: "",
    image: "",
    theme: "Career",
  });

  useEffect(() => {
    setGoals(readLocalStorage(GOALS_KEY, starterGoals));
    setBoardItems(readLocalStorage(BOARD_KEY, starterBoard));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    window.localStorage.setItem(BOARD_KEY, JSON.stringify(boardItems));
  }, [boardItems]);

  const completed = useMemo(() => goals.filter((goal) => goal.done).length, [goals]);
  const momentum = goals.length ? Math.round((completed / goals.length) * 100) : 0;

  const boardThemes = useMemo(
    () => [...new Set(boardItems.map((item) => item.theme))],
    [boardItems]
  );

  const addGoal = () => {
    if (!goalDraft.title.trim() || !goalDraft.dueDate) return;

    setGoals((current) => [
      ...current,
      {
        id: Date.now(),
        title: goalDraft.title.trim(),
        category: goalDraft.category,
        dueDate: goalDraft.dueDate,
        progress: 0,
        done: false,
      },
    ]);

    setGoalDraft((current) => ({ ...current, title: "", dueDate: "" }));
  };

  const toggleGoal = (id) => {
    setGoals((current) =>
      current.map((goal) =>
        goal.id === id ? { ...goal, done: !goal.done, progress: goal.done ? goal.progress : 100 } : goal
      )
    );
  };

  const adjustGoal = (id, delta) => {
    setGoals((current) =>
      current.map((goal) => {
        if (goal.id !== id || goal.done) return goal;
        const next = Math.max(0, Math.min(100, goal.progress + delta));
        return { ...goal, progress: next };
      })
    );
  };

  const addBoardCard = () => {
    if (!boardDraft.title.trim() || !boardDraft.image.trim()) return;

    setBoardItems((current) => [
      {
        id: Date.now(),
        title: boardDraft.title.trim(),
        note: boardDraft.note.trim(),
        image: boardDraft.image.trim(),
        theme: boardDraft.theme,
      },
      ...current,
    ]);

    setBoardDraft((current) => ({ ...current, title: "", note: "", image: "" }));
  };

  const uploadImageFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setBoardDraft((current) => ({ ...current, image: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const deleteCard = (id) => {
    setBoardItems((current) => current.filter((item) => item.id !== id));
  };

  return (
    <main className="vb-shell">
      <section className="vb-hero">
        <div>
          <p className="vb-kicker">Vision Board Studio</p>
          <h1>Build a visual life operating system that grows with you.</h1>
          <p>
            Curate inspiring images, tie them to meaningful goals, and track momentum in one beautifully organized space.
          </p>
          <div className="vb-metrics">
            <span>{boardItems.length} board cards</span>
            <span>{goals.length} goals</span>
            <span>{momentum}% momentum</span>
          </div>
        </div>
      </section>

      <nav className="vb-tabs">
        <button className={view === "board" ? "active" : ""} onClick={() => setView("board")} type="button">
          Vision Board
        </button>
        <button className={view === "goals" ? "active" : ""} onClick={() => setView("goals")} type="button">
          Goal Planner
        </button>
      </nav>

      {view === "board" ? (
        <section className="vb-layout">
          <aside className="vb-panel vb-form-panel">
            <h2>Add Vision Card</h2>
            <p>Add image URL or upload a file from your device.</p>

            <input
              placeholder="Card title"
              value={boardDraft.title}
              onChange={(event) => setBoardDraft((current) => ({ ...current, title: event.target.value }))}
            />
            <textarea
              placeholder="Why this matters to me"
              rows={3}
              value={boardDraft.note}
              onChange={(event) => setBoardDraft((current) => ({ ...current, note: event.target.value }))}
            />
            <input
              placeholder="Paste image URL"
              value={boardDraft.image}
              onChange={(event) => setBoardDraft((current) => ({ ...current, image: event.target.value }))}
            />

            <label className="upload-label" htmlFor="vision-upload">
              Upload image file
            </label>
            <input id="vision-upload" type="file" accept="image/*" onChange={uploadImageFile} />

            <select
              value={boardDraft.theme}
              onChange={(event) => setBoardDraft((current) => ({ ...current, theme: event.target.value }))}
            >
              <option>Career</option>
              <option>Health</option>
              <option>Lifestyle</option>
              <option>Finance</option>
              <option>Travel</option>
            </select>

            <button className="primary" onClick={addBoardCard} type="button">
              Add to Vision Board
            </button>

            {boardDraft.image ? <img className="preview" src={boardDraft.image} alt="Vision preview" /> : null}
          </aside>

          <div className="vb-board-wrap">
            <div className="vb-themes">
              {boardThemes.map((theme) => (
                <span key={theme}>{theme}</span>
              ))}
            </div>

            <div className="vb-board">
              {boardItems.map((item) => (
                <article className="card" key={item.id}>
                  <img src={item.image} alt={item.title} />
                  <div className="card-content">
                    <span className="theme">{item.theme}</span>
                    <h3>{item.title}</h3>
                    <p>{item.note || "No note yet."}</p>
                    <button onClick={() => deleteCard(item.id)} type="button">
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="vb-layout">
          <aside className="vb-panel vb-form-panel">
            <h2>Create Goal</h2>
            <p>Turn your vision cards into measurable outcomes.</p>

            <input
              placeholder="Goal title"
              value={goalDraft.title}
              onChange={(event) => setGoalDraft((current) => ({ ...current, title: event.target.value }))}
            />
            <input
              type="date"
              value={goalDraft.dueDate}
              onChange={(event) => setGoalDraft((current) => ({ ...current, dueDate: event.target.value }))}
            />
            <select
              value={goalDraft.category}
              onChange={(event) => setGoalDraft((current) => ({ ...current, category: event.target.value }))}
            >
              <option>Career</option>
              <option>Health</option>
              <option>Lifestyle</option>
              <option>Finance</option>
              <option>Travel</option>
            </select>
            <button className="primary" onClick={addGoal} type="button">
              Add Goal
            </button>
          </aside>

          <div className="vb-panel vb-goal-list">
            <h2>Growth Roadmap</h2>
            <p>{completed} completed — keep your streak alive.</p>

            <ul>
              {goals.map((goal) => (
                <li key={goal.id} className={goal.done ? "done" : ""}>
                  <div className="goal-row">
                    <button onClick={() => toggleGoal(goal.id)} type="button" className="check">
                      {goal.done ? "✓" : ""}
                    </button>
                    <div>
                      <h3>{goal.title}</h3>
                      <p>
                        {goal.category} • {goal.dueDate ? formatDate(goal.dueDate) : "No date"}
                      </p>
                    </div>
                  </div>

                  <div className="meter">
                    <div style={{ width: `${goal.progress}%` }} />
                  </div>

                  <div className="goal-actions">
                    <button onClick={() => adjustGoal(goal.id, -10)} type="button">
                      -10%
                    </button>
                    <button onClick={() => adjustGoal(goal.id, 10)} type="button">
                      +10%
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
