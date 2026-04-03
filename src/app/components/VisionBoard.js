"use client";

import { useCallback, useRef, useState } from "react";

const BOARD_CATEGORIES = [
  "All",
  "Career",
  "Health",
  "Travel",
  "Relationships",
  "Finance",
  "Personal Growth",
  "Creativity",
  "Other",
];

export default function VisionBoard({ items, onAdd, onDelete, onUpdate }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [newItem, setNewItem] = useState({ caption: "", category: "Personal Growth", note: "" });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [viewItem, setViewItem] = useState(null);

  const filteredItems = activeCategory === "All"
    ? items
    : items.filter((item) => item.category === activeCategory);

  const handleFileSelect = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
      if (!showModal) setShowModal(true);
    },
    [handleFileSelect, showModal]
  );

  const handleSave = () => {
    if (!previewUrl && !editItem) return;
    if (editItem) {
      onUpdate(editItem.id, {
        caption: newItem.caption,
        category: newItem.category,
        note: newItem.note,
        ...(previewUrl && previewUrl !== editItem.imageUrl ? { imageUrl: previewUrl } : {}),
      });
    } else {
      onAdd({
        id: Date.now(),
        imageUrl: previewUrl,
        caption: newItem.caption,
        category: newItem.category,
        note: newItem.note,
        createdAt: new Date().toISOString(),
      });
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditItem(null);
    setNewItem({ caption: "", category: "Personal Growth", note: "" });
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setNewItem({ caption: item.caption, category: item.category, note: item.note || "" });
    setPreviewUrl(item.imageUrl);
    setShowModal(true);
  };

  return (
    <div className="vision-board">
      <div className="vb-header">
        <div>
          <h2 className="vb-title">Vision Board</h2>
          <p className="vb-subtitle">Upload images that inspire you and represent your dreams</p>
        </div>
        <button className="vb-add-btn" onClick={() => setShowModal(true)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Image
        </button>
      </div>

      {/* Category Filter */}
      <div className="vb-filters">
        {BOARD_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`vb-filter-btn ${activeCategory === cat ? "vb-filter-btn--active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Drop Zone / Grid */}
      {filteredItems.length === 0 ? (
        <div
          className={`vb-dropzone ${dragOver ? "vb-dropzone--active" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => setShowModal(true)}
        >
          <div className="vb-dropzone-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
          <p className="vb-dropzone-text">Drag & drop images here or click to upload</p>
          <p className="vb-dropzone-hint">Build your vision board with images that inspire you</p>
        </div>
      ) : (
        <div
          className="vb-masonry"
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {/* Add new card */}
          <div
            className={`vb-add-card ${dragOver ? "vb-add-card--active" : ""}`}
            onClick={() => setShowModal(true)}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add Image</span>
          </div>

          {filteredItems.map((item) => (
            <div key={item.id} className="vb-card" onClick={() => setViewItem(item)}>
              <div className="vb-card-img-wrap">
                <img src={item.imageUrl} alt={item.caption} className="vb-card-img" />
                <div className="vb-card-overlay">
                  <button
                    className="vb-card-action"
                    onClick={(e) => { e.stopPropagation(); openEdit(item); }}
                    title="Edit"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button
                    className="vb-card-action vb-card-action--delete"
                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                    title="Delete"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                </div>
              </div>
              {item.caption && <p className="vb-card-caption">{item.caption}</p>}
              <span className="vb-card-category">{item.category}</span>
            </div>
          ))}
        </div>
      )}

      {/* View Modal */}
      {viewItem && (
        <div className="vb-modal-backdrop" onClick={() => setViewItem(null)}>
          <div className="vb-view-modal" onClick={(e) => e.stopPropagation()}>
            <button className="vb-modal-close" onClick={() => setViewItem(null)}>&times;</button>
            <img src={viewItem.imageUrl} alt={viewItem.caption} className="vb-view-img" />
            <div className="vb-view-info">
              {viewItem.caption && <h3 className="vb-view-caption">{viewItem.caption}</h3>}
              <span className="vb-view-category">{viewItem.category}</span>
              {viewItem.note && <p className="vb-view-note">{viewItem.note}</p>}
              <div className="vb-view-actions">
                <button className="vb-view-edit" onClick={() => { setViewItem(null); openEdit(viewItem); }}>Edit</button>
                <button className="vb-view-delete" onClick={() => { onDelete(viewItem.id); setViewItem(null); }}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="vb-modal-backdrop" onClick={closeModal}>
          <div className="vb-modal" onClick={(e) => e.stopPropagation()}>
            <button className="vb-modal-close" onClick={closeModal}>&times;</button>
            <h3 className="vb-modal-title">{editItem ? "Edit Vision Item" : "Add to Vision Board"}</h3>

            {/* Image upload area */}
            {previewUrl ? (
              <div className="vb-modal-preview">
                <img src={previewUrl} alt="Preview" />
                <button className="vb-modal-change-img" onClick={() => fileInputRef.current?.click()}>
                  Change Image
                </button>
              </div>
            ) : (
              <div
                className={`vb-modal-upload ${dragOver ? "vb-modal-upload--active" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileSelect(e.dataTransfer.files[0]); }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p>Click or drag an image here</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleFileSelect(e.target.files[0])}
            />

            <div className="vb-modal-fields">
              <input
                className="vb-modal-input"
                placeholder="Caption (e.g., My dream house)"
                value={newItem.caption}
                onChange={(e) => setNewItem({ ...newItem, caption: e.target.value })}
              />
              <select
                className="vb-modal-select"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              >
                {BOARD_CATEGORIES.filter((c) => c !== "All").map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <textarea
                className="vb-modal-textarea"
                placeholder="Add a note about why this inspires you..."
                value={newItem.note}
                onChange={(e) => setNewItem({ ...newItem, note: e.target.value })}
                rows={3}
              />
            </div>

            <div className="vb-modal-actions">
              <button className="vb-modal-cancel" onClick={closeModal}>Cancel</button>
              <button
                className="vb-modal-save"
                onClick={handleSave}
                disabled={!previewUrl}
              >
                {editItem ? "Save Changes" : "Add to Board"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
