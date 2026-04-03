"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import VisionBoard from "./components/VisionBoard";
import GoalsPanel from "./components/GoalsPanel";

const DEFAULT_GOALS = [
  { id: 1, text: "Define your 12-month vision", done: false, category: "Personal Growth", priority: "High", deadline: null, notes: "What does your ideal life look like one year from now?", milestones: [], createdAt: new Date().toISOString() },
  { id: 2, text: "Set 3 measurable quarterly goals", done: false, category: "Career", priority: "Medium", deadline: null, notes: "", milestones: [], createdAt: new Date().toISOString() },
  { id: 3, text: "Build your vision board with inspiring images", done: false, category: "Creativity", priority: "Medium", deadline: null, notes: "Add photos that represent your dreams and aspirations", milestones: [], createdAt: new Date().toISOString() },
];

function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // storage full or unavailable
    }
  }, [key, state]);

  return [state, setState];
}

export default function VisionGoalsApp() {
  const [activeView, setActiveView] = usePersistedState("vg-view", "dashboard");
  const [goals, setGoals] = usePersistedState("vg-goals", DEFAULT_GOALS);
  const [visionItems, setVisionItems] = usePersistedState("vg-vision", []);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = useCallback((view) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  }, [setActiveView]);

  // Goal operations
  const addGoal = useCallback((goal) => {
    setGoals((prev) => [...prev, goal]);
  }, [setGoals]);

  const updateGoal = useCallback((id, updates) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  }, [setGoals]);

  const deleteGoal = useCallback((id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, [setGoals]);

  // Vision board operations
  const addVisionItem = useCallback((item) => {
    setVisionItems((prev) => [...prev, item]);
  }, [setVisionItems]);

  const updateVisionItem = useCallback((id, updates) => {
    setVisionItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  }, [setVisionItems]);

  const deleteVisionItem = useCallback((id) => {
    setVisionItems((prev) => prev.filter((item) => item.id !== id));
  }, [setVisionItems]);

  return (
    <div className="app-layout">
      {/* Mobile header */}
      <div className="mobile-header">
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileMenuOpen
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            }
          </svg>
        </button>
        <span className="mobile-title">Vision & Goals</span>
      </div>

      {/* Sidebar overlay for mobile */}
      {mobileMenuOpen && <div className="sidebar-overlay" onClick={() => setMobileMenuOpen(false)} />}

      <div className={`sidebar-wrapper ${mobileMenuOpen ? "sidebar-wrapper--open" : ""}`}>
        <Sidebar
          activeView={activeView}
          onNavigate={handleNavigate}
          goalCount={goals.filter((g) => !g.done).length}
          visionCount={visionItems.length}
        />
      </div>

      <main className="app-main">
        <div className="app-content">
          {activeView === "dashboard" && (
            <Dashboard goals={goals} visionItems={visionItems} onNavigate={handleNavigate} />
          )}
          {activeView === "vision" && (
            <VisionBoard
              items={visionItems}
              onAdd={addVisionItem}
              onDelete={deleteVisionItem}
              onUpdate={updateVisionItem}
            />
          )}
          {activeView === "goals" && (
            <GoalsPanel
              goals={goals}
              onAdd={addGoal}
              onUpdate={updateGoal}
              onDelete={deleteGoal}
            />
          )}
        </div>
      </main>
    </div>
  );
}
