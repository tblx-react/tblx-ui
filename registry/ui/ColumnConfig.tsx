import React, { useState, useRef, useEffect } from "react";
import { useTblxContext, TblxColumn } from "tblx";

// =====================
// Types
// =====================

export type TblxColumnConfigProps<T = unknown> = {
  /** Column definitions (for labels) */
  columns: TblxColumn<T>[];
  /** Enable show/hide columns (default: true) */
  enableVisibility?: boolean;
  /** Enable drag-to-reorder columns (default: true) */
  enableReorder?: boolean;
  /** Custom className */
  className?: string;
  /** Label for the toggle button */
  buttonLabel?: string;
};

// =====================
// Component
// =====================

export function TblxColumnConfig<T>({
  columns,
  enableVisibility = true,
  enableReorder = true,
  className = "",
  buttonLabel = "Columns",
}: TblxColumnConfigProps<T>) {
  const {
    columnConfig,
    toggleColumnVisibility,
    reorderColumns,
    resetColumnConfig,
  } = useTblxContext();

  const [isOpen, setIsOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Don't render if both features are disabled
  if (!enableVisibility && !enableReorder) {
    return null;
  }

  // Sort columns by their current order
  const sortedConfig = [...columnConfig].sort((a, b) => a.order - b.order);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      reorderColumns(draggedIndex, index);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Create a map from column key to label
  const columnLabels = new Map(
    columns.map((col) => [String(col.key), col.label])
  );

  return (
    <div className={`tblx__column-config ${className}`} ref={dropdownRef}>
      <button
        className="tblx__column-config-trigger"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-expanded={isOpen}
        aria-label={buttonLabel}
        title={buttonLabel}
      >
        <svg
          className="tblx__column-config-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      </button>

      {isOpen && (
        <div className="tblx__column-config-dropdown">
          <div className="tblx__column-config-header">
            <span>Configure Columns</span>
            <button
              className="tblx__column-config-reset"
              onClick={resetColumnConfig}
              type="button"
            >
              Reset
            </button>
          </div>

          <ul className="tblx__column-config-list">
            {sortedConfig.map((config, index) => (
              <li
                key={config.key}
                className={`tblx__column-config-item ${
                  draggedIndex === index ? "tblx__column-config-item--dragging" : ""
                } ${dragOverIndex === index ? "tblx__column-config-item--drag-over" : ""}${
                  enableVisibility ? " tblx__column-config-item--clickable" : ""
                }`}
                draggable={enableReorder}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
                onClick={enableVisibility ? () => toggleColumnVisibility(config.key) : undefined}
                role={enableVisibility ? "button" : undefined}
                tabIndex={enableVisibility ? 0 : undefined}
                onKeyDown={enableVisibility ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleColumnVisibility(config.key);
                  }
                } : undefined}
              >
                {enableReorder && (
                  <span
                    className="tblx__column-config-drag-handle"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <circle cx="9" cy="6" r="2" />
                      <circle cx="15" cy="6" r="2" />
                      <circle cx="9" cy="12" r="2" />
                      <circle cx="15" cy="12" r="2" />
                      <circle cx="9" cy="18" r="2" />
                      <circle cx="15" cy="18" r="2" />
                    </svg>
                  </span>
                )}

                {enableVisibility && (
                  <input
                    type="checkbox"
                    checked={config.visible}
                    onChange={() => {}} // Handled by row click
                    onClick={(e) => e.stopPropagation()}
                  />
                )}

                <span className="tblx__column-config-label">
                  {columnLabels.get(config.key) || config.key}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TblxColumnConfig;
