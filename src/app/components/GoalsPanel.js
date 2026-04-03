"use client";

import { useMemo, useState } from "react";

const CATEGORIES = ["All", "Career", "Health", "Travel", "Relationships", "Finance", "Personal Growth", "Creativity", "Other"];
const PRIORITIES = ["Low", "Medium", "High"];
const PRIORITY_COLORS = { Low: "#10B981", Medium: "#F59E0B", High: "#EF4444" };

function GoalCard({ goal, onToggle, onDelete, onEdit, onAddMilestone, onToggleMilestone, onDeleteMilestone }) {
  const [expanded, setExpanded] = useState(false);
  const [newMilestone, setNewMilestone] = useState("");

  const milestoneDone = (goal.milestones || []).filter((m) => m.done).length;
  const milestoneTotal = (goal.milestones || []).length;
  const milestonePct = milestoneTotal ? Math.round((milestoneDone / milestoneTotal) * 100) : 0;

  const isOverdue = goal.deadline && !goal.done && new Date(goal.deadline) < new Date();
  const daysLeft = goal.deadline
    ? Math.ceil((new Date(goal.deadline) - new Date()) / 86400000)
    : null;

  return (
    <div className={`goal-card ${goal.done ? "goal-card--done" : ""} ${isOverdue ? "goal-card--overdue" : ""}`}>
      <div className="goal-card-main" onClick={() => setExpanded(!expanded)}>
        <button
          className={`goal-check ${goal.done ? "goal-check--done" : ""}`}
          onClick={(e) => { e.stopPropagation(); onToggle(goal.id); }}
        >
          {goal.done && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
          )}
        </button>

        <div className="goal-card-body">
          <div className="goal-card-top">
            <span className={`goal-card-text ${goal.done ? "goal-card-text--done" : ""}`}>{goal.text}</span>
            <div className="goal-card-badges">
              <span className="goal-badge goal-badge--cat">{goal.category}</span>
              <span className="goal-badge goal-badge--pri" style={{ background: PRIORITY_COLORS[goal.priority] + "20", color: PRIORITY_COLORS[goal.priority] }}>
                {goal.priority}
              </span>
            </div>
          </div>

          <div className="goal-card-meta">
            {goal.deadline && (
              <span className={`goal-meta-item ${isOverdue ? "goal-meta-item--overdue" : ""}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {isOverdue
                  ? `Overdue by ${Math.abs(daysLeft)}d`
                  : daysLeft === 0
                    ? "Due today"
                    : daysLeft === 1
                      ? "Due tomorrow"
                      : `${daysLeft}d left`}
              </span>
            )}
            {milestoneTotal > 0 && (
              <span className="goal-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                {milestoneDone}/{milestoneTotal} milestones
              </span>
            )}
            {goal.notes && (
              <span className="goal-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Has notes
              </span>
            )}
          </div>

          {/* Milestone mini-bar */}
          {milestoneTotal > 0 && (
            <div className="goal-milestone-bar">
              <div className="goal-milestone-fill" style={{ width: `${milestonePct}%` }} />
            </div>
          )}
        </div>

        <div className="goal-card-actions">
          <button className="goal-action-btn" onClick={(e) => { e.stopPropagation(); onEdit(goal); }} title="Edit">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button className="goal-action-btn goal-action-btn--delete" onClick={(e) => { e.stopPropagation(); onDelete(goal.id); }} title="Delete">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
          <svg className="goal-expand-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="goal-expanded">
          {goal.notes && (
            <div className="goal-notes">
              <h4>Notes</h4>
              <p>{goal.notes}</p>
            </div>
          )}

          <div className="goal-milestones">
            <h4>Milestones</h4>
            <div className="goal-milestone-add">
              <input
                className="goal-milestone-input"
                placeholder="Add a milestone..."
                value={newMilestone}
                onChange={(e) => setNewMilestone(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newMilestone.trim()) {
                    onAddMilestone(goal.id, newMilestone.trim());
                    setNewMilestone("");
                  }
                }}
              />
              <button
                className="goal-milestone-add-btn"
                onClick={() => {
                  if (newMilestone.trim()) {
                    onAddMilestone(goal.id, newMilestone.trim());
                    setNewMilestone("");
                  }
                }}
              >
                +
              </button>
            </div>
            {(goal.milestones || []).length === 0 ? (
              <p className="goal-milestone-empty">Break this goal into smaller milestones</p>
            ) : (
              <ul className="goal-milestone-list">
                {(goal.milestones || []).map((m) => (
                  <li key={m.id} className="goal-milestone-item">
                    <button
                      className={`goal-ms-check ${m.done ? "goal-ms-check--done" : ""}`}
                      onClick={() => onToggleMilestone(goal.id, m.id)}
                    >
                      {m.done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                    </button>
                    <span className={m.done ? "goal-ms-text--done" : ""}>{m.text}</span>
                    <button className="goal-ms-delete" onClick={() => onDeleteMilestone(goal.id, m.id)}>&times;</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function GoalsPanel({ goals, onAdd, onUpdate, onDelete }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [form, setForm] = useState({
    text: "", category: "Personal Growth", priority: "Medium", deadline: "", notes: "",
  });

  const filteredGoals = useMemo(() => {
    let list = activeCategory === "All" ? goals : goals.filter((g) => g.category === activeCategory);
    if (sortBy === "newest") list = [...list].reverse();
    if (sortBy === "priority") {
      const priOrder = { High: 0, Medium: 1, Low: 2 };
      list = [...list].sort((a, b) => priOrder[a.priority] - priOrder[b.priority]);
    }
    if (sortBy === "deadline") {
      list = [...list].sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      });
    }
    if (sortBy === "progress") {
      list = [...list].sort((a, b) => {
        const ap = (a.milestones || []).length ? (a.milestones.filter((m) => m.done).length / a.milestones.length) : 0;
        const bp = (b.milestones || []).length ? (b.milestones.filter((m) => m.done).length / b.milestones.length) : 0;
        return bp - ap;
      });
    }
    return list;
  }, [goals, activeCategory, sortBy]);

  const handleSave = () => {
    if (!form.text.trim()) return;
    if (editGoal) {
      onUpdate(editGoal.id, {
        text: form.text.trim(),
        category: form.category,
        priority: form.priority,
        deadline: form.deadline || null,
        notes: form.notes,
      });
    } else {
      onAdd({
        id: Date.now(),
        text: form.text.trim(),
        category: form.category,
        priority: form.priority,
        deadline: form.deadline || null,
        notes: form.notes,
        done: false,
        milestones: [],
        createdAt: new Date().toISOString(),
      });
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditGoal(null);
    setForm({ text: "", category: "Personal Growth", priority: "Medium", deadline: "", notes: "" });
  };

  const openEdit = (goal) => {
    setEditGoal(goal);
    setForm({
      text: goal.text,
      category: goal.category,
      priority: goal.priority,
      deadline: goal.deadline || "",
      notes: goal.notes || "",
    });
    setShowModal(true);
  };

  const toggleGoal = (id) => {
    const goal = goals.find((g) => g.id === id);
    if (goal) onUpdate(id, { done: !goal.done });
  };

  const addMilestone = (goalId, text) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    const ms = [...(goal.milestones || []), { id: Date.now(), text, done: false }];
    onUpdate(goalId, { milestones: ms });
  };

  const toggleMilestone = (goalId, msId) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    const ms = (goal.milestones || []).map((m) => m.id === msId ? { ...m, done: !m.done } : m);
    onUpdate(goalId, { milestones: ms });
  };

  const deleteMilestone = (goalId, msId) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    const ms = (goal.milestones || []).filter((m) => m.id !== msId);
    onUpdate(goalId, { milestones: ms });
  };

  const activeGoals = filteredGoals.filter((g) => !g.done);
  const completedGoals = filteredGoals.filter((g) => g.done);

  return (
    <div className="goals-panel">
      <div className="gp-header">
        <div>
          <h2 className="gp-title">Goals</h2>
          <p className="gp-subtitle">Set meaningful goals, break them into milestones, and crush them</p>
        </div>
        <button className="gp-add-btn" onClick={() => setShowModal(true)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Goal
        </button>
      </div>

      {/* Filters & Sort */}
      <div className="gp-controls">
        <div className="gp-filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`gp-filter-btn ${activeCategory === cat ? "gp-filter-btn--active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <select className="gp-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="priority">By Priority</option>
          <option value="deadline">By Deadline</option>
          <option value="progress">By Progress</option>
        </select>
      </div>

      {/* Goal Cards */}
      {filteredGoals.length === 0 ? (
        <div className="gp-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
          <p>No goals yet in this category</p>
          <button className="gp-empty-btn" onClick={() => setShowModal(true)}>Create Your First Goal</button>
        </div>
      ) : (
        <>
          {activeGoals.length > 0 && (
            <div className="gp-section">
              <h3 className="gp-section-title">Active ({activeGoals.length})</h3>
              <div className="gp-goal-list">
                {activeGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onToggle={toggleGoal}
                    onDelete={onDelete}
                    onEdit={openEdit}
                    onAddMilestone={addMilestone}
                    onToggleMilestone={toggleMilestone}
                    onDeleteMilestone={deleteMilestone}
                  />
                ))}
              </div>
            </div>
          )}

          {completedGoals.length > 0 && (
            <div className="gp-section">
              <h3 className="gp-section-title gp-section-title--completed">Completed ({completedGoals.length})</h3>
              <div className="gp-goal-list">
                {completedGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onToggle={toggleGoal}
                    onDelete={onDelete}
                    onEdit={openEdit}
                    onAddMilestone={addMilestone}
                    onToggleMilestone={toggleMilestone}
                    onDeleteMilestone={deleteMilestone}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="gp-modal-backdrop" onClick={closeModal}>
          <div className="gp-modal" onClick={(e) => e.stopPropagation()}>
            <button className="gp-modal-close" onClick={closeModal}>&times;</button>
            <h3 className="gp-modal-title">{editGoal ? "Edit Goal" : "Create New Goal"}</h3>

            <div className="gp-modal-fields">
              <div className="gp-field">
                <label className="gp-label">What do you want to achieve?</label>
                <input
                  className="gp-modal-input"
                  placeholder="e.g., Run a marathon, Learn Spanish..."
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  autoFocus
                />
              </div>

              <div className="gp-field-row">
                <div className="gp-field">
                  <label className="gp-label">Category</label>
                  <select
                    className="gp-modal-select"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="gp-field">
                  <label className="gp-label">Priority</label>
                  <div className="gp-priority-btns">
                    {PRIORITIES.map((p) => (
                      <button
                        key={p}
                        className={`gp-pri-btn ${form.priority === p ? "gp-pri-btn--active" : ""}`}
                        style={form.priority === p ? { background: PRIORITY_COLORS[p] + "20", color: PRIORITY_COLORS[p], borderColor: PRIORITY_COLORS[p] } : {}}
                        onClick={() => setForm({ ...form, priority: p })}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="gp-field">
                <label className="gp-label">Deadline (optional)</label>
                <input
                  type="date"
                  className="gp-modal-input"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                />
              </div>

              <div className="gp-field">
                <label className="gp-label">Notes (optional)</label>
                <textarea
                  className="gp-modal-textarea"
                  placeholder="Why is this goal important to you? What's your plan?"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            <div className="gp-modal-actions">
              <button className="gp-modal-cancel" onClick={closeModal}>Cancel</button>
              <button className="gp-modal-save" onClick={handleSave} disabled={!form.text.trim()}>
                {editGoal ? "Save Changes" : "Create Goal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
