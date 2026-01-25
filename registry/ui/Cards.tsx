import React, { useMemo, useCallback, useState } from "react";
import { useTblxContext, TblxColumn, useTblxTable } from "tblx";

// =====================
// Types
// =====================

export type { TblxColumn };

export type TblxCardsProps<T = unknown> = {
  /** Column definitions */
  columns: TblxColumn<T>[];
  /** Custom card renderer (overrides default card layout) */
  cardRenderer?: (columns: TblxColumn<T>[], row: T) => React.ReactNode;
  /** Custom className for the cards container */
  className?: string;
  /** Maximum number of fields to show before collapsing into a toggle (excludes primary column) */
  maxVisibleFields?: number;
};

// =====================
// Helper: Get primary column
// =====================

function getPrimaryColumn<T>(columns: TblxColumn<T>[]): TblxColumn<T> | null {
  // Find first column marked as primary
  const primary = columns.find(
    (col) => col.type !== "action" && "isPrimary" in col && col.isPrimary
  );
  if (primary) return primary;

  // Fallback to first non-action column
  return columns.find((col) => col.type !== "action") || null;
}

// =====================
// Helper: Get cell value
// =====================

function getCellValue<T>(column: TblxColumn<T>, row: T): React.ReactNode {
  // Custom render function
  if (column.render) {
    return column.render(row) as React.ReactNode;
  }

  // Default rendering for data columns
  if (column.type !== "action") {
    const value = row[column.key as keyof T];
    if (value !== undefined && value !== null) {
      return String(value);
    }
  }

  return "";
}

// =====================
// Helper: Get mobile label
// =====================

function getMobileLabel<T>(column: TblxColumn<T>): string {
  if (column.type !== "action" && "mobileLabel" in column && column.mobileLabel) {
    return column.mobileLabel;
  }
  return column.label;
}

// =====================
// Helper: Filter visible mobile columns
// =====================

function getVisibleMobileColumns<T>(columns: TblxColumn<T>[]): TblxColumn<T>[] {
  return columns.filter((col) => {
    // Skip columns marked as mobileHidden
    if ("mobileHidden" in col && col.mobileHidden) {
      return false;
    }
    return true;
  });
}

// =====================
// Component
// =====================

export function TblxCards<T extends { id: string | number }>({
  columns,
  cardRenderer,
  className = "",
  maxVisibleFields,
}: TblxCardsProps<T>) {
  const { hasBulkActions, isLoading, state } = useTblxContext<T>();
  const {
    rows,
    configuredColumns,
    selectedRowIds,
    handleRowSelect,
    handleSelectAll,
    allSelected,
    someSelected,
  } = useTblxTable({ columns });

  // Track which cards are expanded (by row id)
  const [expandedCards, setExpandedCards] = useState<Set<string | number>>(new Set());

  // Toggle expand state for a card
  const toggleCardExpand = useCallback((rowId: string | number) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }
      return next;
    });
  }, []);

  // Auto-enable selection when BulkActions is present
  const showSelection = hasBulkActions;

  // Show skeleton when loading
  const showSkeleton = isLoading;
  const skeletonRowCount = rows.length || 50;

  // Get columns visible on mobile (memoized for performance)
  const mobileColumns = useMemo(
    () => getVisibleMobileColumns(configuredColumns),
    [configuredColumns]
  );

  // Get primary column for card title
  const primaryColumn = useMemo(
    () => getPrimaryColumn(mobileColumns),
    [mobileColumns]
  );

  // Separate data columns from action columns
  const dataColumns = useMemo(
    () => mobileColumns.filter((col) => col.type !== "action"),
    [mobileColumns]
  );

  const actionColumns = useMemo(
    () => mobileColumns.filter((col) => col.type === "action"),
    [mobileColumns]
  );

  // Memoized handlers to prevent re-renders
  const handleCheckboxChange = useCallback(
    (rowId: T["id"], checked: boolean) => {
      handleRowSelect(rowId, checked);
    },
    [handleRowSelect]
  );

  const handleSelectAllChange = useCallback(
    (checked: boolean) => {
      handleSelectAll(checked);
    },
    [handleSelectAll]
  );

  return (
    <div
      className={`tblx__cards ${className}`}
      role="list"
      aria-label="Data cards"
    >
      {/* Select all header (when selection enabled) */}
      {showSelection && rows.length > 0 && !showSkeleton && (
        <div className="tblx__cards-header">
          <label className="tblx__cards-select-all">
            <input
              type="checkbox"
              className="tblx__checkbox"
              checked={allSelected}
              ref={(el) => {
                if (el) el.indeterminate = someSelected;
              }}
              onChange={(e) => handleSelectAllChange(e.target.checked)}
              aria-label="Select all items"
            />
            <span className="tblx__cards-select-all-label">
              {allSelected ? "Deselect all" : "Select all"}
            </span>
          </label>
        </div>
      )}

      {showSkeleton
        ? // Skeleton loading cards
          Array.from({ length: skeletonRowCount }).map((_, index) => (
            <article
              key={`skeleton-${index}`}
              className="tblx__card tblx__card--skeleton"
              aria-hidden="true"
            >
              {showSelection && (
                <div className="tblx__card-select">
                  <div className="tblx__skeleton tblx__skeleton--checkbox" />
                </div>
              )}
              <div className="tblx__card-content">
                <div className="tblx__card-header">
                  <div
                    className="tblx__skeleton"
                    style={{ width: `${60 + (index * 13) % 30}%`, height: "1.25rem" }}
                  />
                </div>
                <dl className="tblx__card-fields">
                  {Array.from({ length: 3 }).map((_, fieldIndex) => (
                    <div key={fieldIndex} className="tblx__card-field">
                      <dt>
                        <div
                          className="tblx__skeleton"
                          style={{ width: "4rem", height: "0.75rem" }}
                        />
                      </dt>
                      <dd>
                        <div
                          className="tblx__skeleton"
                          style={{
                            width: `${50 + ((index + fieldIndex) * 17) % 40}%`,
                            height: "1rem",
                          }}
                        />
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          ))
        : // Actual data cards
          rows.map((row) => {
            const isSelected = selectedRowIds.includes(row.id);
            const primaryValue = primaryColumn
              ? getCellValue(primaryColumn, row)
              : String(row.id);
            const cardLabelId = `card-${row.id}-label`;

            // Use custom renderer if provided
            if (cardRenderer) {
              return (
                <article
                  key={row.id}
                  className={`tblx__card ${isSelected ? "tblx__card--selected" : ""}`}
                  role="listitem"
                  aria-labelledby={cardLabelId}
                >
                  {cardRenderer(configuredColumns, row)}
                </article>
              );
            }

            return (
              <article
                key={row.id}
                className={`tblx__card ${isSelected ? "tblx__card--selected" : ""}`}
                role="listitem"
                aria-labelledby={cardLabelId}
              >
                {showSelection && (
                  <div className="tblx__card-select">
                    <input
                      type="checkbox"
                      className="tblx__checkbox"
                      checked={isSelected}
                      onChange={(e) =>
                        handleCheckboxChange(row.id, e.target.checked)
                      }
                      aria-label={`Select ${primaryValue}`}
                    />
                  </div>
                )}

                <div className="tblx__card-content">
                  {/* Card header with primary value */}
                  {primaryColumn && (
                    <div className="tblx__card-header">
                      <h3 id={cardLabelId} className="tblx__card-title">
                        {primaryValue}
                      </h3>
                    </div>
                  )}

                  {/* Card fields as definition list for accessibility */}
                  {(() => {
                    const fieldsToRender = dataColumns.filter((col) => col !== primaryColumn);
                    const hasOverflow = maxVisibleFields !== undefined && fieldsToRender.length > maxVisibleFields;
                    const isExpanded = expandedCards.has(row.id);
                    // Always show only the first maxVisibleFields in the visible section
                    const visibleFields = hasOverflow
                      ? fieldsToRender.slice(0, maxVisibleFields)
                      : fieldsToRender;
                    const overflowFields = hasOverflow
                      ? fieldsToRender.slice(maxVisibleFields)
                      : [];
                    const overflowCount = overflowFields.length;

                    return (
                      <>
                        <dl className="tblx__card-fields">
                          {visibleFields.map((col) => {
                            const columnKey = String(col.key);
                            const label = getMobileLabel(col);
                            const value = getCellValue(col, row);

                            return (
                              <div key={columnKey} className="tblx__card-field">
                                <dt>{label}</dt>
                                <dd>{value}</dd>
                              </div>
                            );
                          })}
                        </dl>

                        {/* Overflow fields (shown when expanded) */}
                        {hasOverflow && isExpanded && (
                          <dl
                            id={`card-${row.id}-overflow`}
                            className="tblx__card-fields tblx__card-fields--overflow"
                          >
                            {overflowFields.map((col) => {
                              const columnKey = String(col.key);
                              const label = getMobileLabel(col);
                              const value = getCellValue(col, row);

                              return (
                                <div key={columnKey} className="tblx__card-field">
                                  <dt>{label}</dt>
                                  <dd>{value}</dd>
                                </div>
                              );
                            })}
                          </dl>
                        )}

                        {/* Overflow toggle - always at the bottom */}
                        {hasOverflow && (
                          <button
                            type="button"
                            className="tblx__card-expand-toggle"
                            onClick={() => toggleCardExpand(row.id)}
                            aria-expanded={isExpanded}
                            aria-controls={`card-${row.id}-overflow`}
                          >
                            <span>
                              {isExpanded
                                ? "Show less"
                                : `+${overflowCount} more field${overflowCount > 1 ? "s" : ""}`}
                            </span>
                            <svg
                              className={`tblx__card-expand-icon ${isExpanded ? "tblx__card-expand-icon--open" : ""}`}
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </button>
                        )}
                      </>
                    );
                  })()}

                  {/* Actions footer */}
                  {actionColumns.length > 0 && (
                    <div className="tblx__card-actions">
                      {actionColumns.map((col) => (
                        <React.Fragment key={String(col.key)}>
                          {col.render(row) as React.ReactNode}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
    </div>
  );
}

export default TblxCards;
