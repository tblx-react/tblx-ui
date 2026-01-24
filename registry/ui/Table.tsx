import React from "react";
import { useTblxContext, TblxColumn, useTblxTable } from "tblx";

// =====================
// Types
// =====================

export type { TblxColumn };

export type SortByOption = {
  key: string;
  label?: string;
  direction: "desc" | "asc";
};

type ColumnSortState = "inactive" | "asc" | "desc";

export type TblxTableProps<T = unknown> = {
  /** Column definitions */
  columns: TblxColumn<T>[];
  /** Custom row renderer */
  rowRenderer?: (columns: TblxColumn<T>[], row: T) => React.ReactNode;
  /** Custom className */
  className?: string;
  /**
   * @deprecated Selection is now automatically enabled when BulkActions is present.
   * This prop will be removed in a future version.
   */
  enableSelection?: boolean;
};

// =====================
// Helper Components
// =====================

function SortIcon({ state }: { state: ColumnSortState }) {
  if (state === "inactive") {
    return (
      <svg
        className="tblx__sort-icon tblx__sort-icon--inactive"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M7 2L10 6H4L7 2Z" fill="currentColor" />
        <path d="M7 12L4 8H10L7 12Z" fill="currentColor" />
      </svg>
    );
  }
  if (state === "asc") {
    return (
      <svg
        className="tblx__sort-icon tblx__sort-icon--asc"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M7 2L10 6H4L7 2Z" fill="currentColor" />
        <path d="M7 12L4 8H10L7 12Z" fill="currentColor" opacity="0.25" />
      </svg>
    );
  }
  return (
    <svg
      className="tblx__sort-icon tblx__sort-icon--desc"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7 2L10 6H4L7 2Z" fill="currentColor" opacity="0.25" />
      <path d="M7 12L4 8H10L7 12Z" fill="currentColor" />
    </svg>
  );
}

// =====================
// Component
// =====================

export function TblxTable<T extends { id: string | number }>({
  columns,
  rowRenderer,
  className = "",
  enableSelection,
}: TblxTableProps<T>) {
  const { hasBulkActions, isLoading, state } = useTblxContext<T>();
  const {
    rows,
    configuredColumns,
    getColumnSortState,
    handleColumnHeaderClick,
    selectedRowIds,
    allSelected,
    someSelected,
    handleRowSelect,
    handleSelectAll,
  } = useTblxTable({ columns });

  // Auto-enable selection when BulkActions is present, or use explicit prop as override
  const showSelection = enableSelection ?? hasBulkActions;
  
  // Show skeleton when loading and no data
  const showSkeleton = isLoading && rows.length === 0;
  const skeletonRowCount = state?.limit || 20;

  return (
    <table className={`tblx__table ${className}`}>
      <thead>
        <tr>
          {showSelection && (
            <th className="tblx__select-column">
              <input
                type="checkbox"
                className="tblx__checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected;
                }}
                onChange={(e) => handleSelectAll(e.target.checked)}
                aria-label="Select all rows"
                disabled={showSkeleton}
              />
            </th>
          )}
          {configuredColumns.map((col) => {
            const columnKey = String(col.key);
            const isAction = col.type === "action";
            const sortState = isAction ? "inactive" : getColumnSortState(columnKey);
            const isSortable = !isAction && col.sortable;

            return (
              <th
                key={columnKey}
                className={`${col.className || ""} ${isSortable ? "tblx__th--sortable" : ""} ${sortState !== "inactive" ? "tblx__th--sorted" : ""} ${isAction ? "tblx__th--action" : ""}`}
                onClick={
                  isSortable ? () => handleColumnHeaderClick(columnKey) : undefined
                }
                role={isSortable ? "button" : undefined}
                tabIndex={isSortable ? 0 : undefined}
                onKeyDown={
                  isSortable
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleColumnHeaderClick(columnKey);
                        }
                      }
                    : undefined
                }
                aria-sort={
                  sortState === "asc"
                    ? "ascending"
                    : sortState === "desc"
                      ? "descending"
                      : undefined
                }
              >
                <span className="tblx__th-content">
                  {col.label}
                  {isSortable && <SortIcon state={sortState} />}
                </span>
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody>
        {showSkeleton ? (
          // Skeleton loading rows
          Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
            <tr key={`skeleton-${rowIndex}`} className="tblx__row--skeleton">
              {showSelection && (
                <td className="tblx__select-column">
                  <div className="tblx__skeleton tblx__skeleton--checkbox" />
                </td>
              )}
              {configuredColumns.map((col, colIndex) => {
                const columnKey = String(col.key);
                const isAction = col.type === "action";
                // Deterministic width variation based on row and column index
                const widthPercent = 60 + ((rowIndex * 7 + colIndex * 13) % 35);
                return (
                  <td
                    key={columnKey}
                    className={`${col.className || ""} ${isAction ? "tblx__td--action" : ""}`}
                  >
                    <div 
                      className={`tblx__skeleton ${isAction ? "tblx__skeleton--action" : ""}`}
                      style={{ width: isAction ? "60px" : `${widthPercent}%` }}
                    />
                  </td>
                );
              })}
            </tr>
          ))
        ) : (
          // Actual data rows
          rows.map((row) => {
            const isSelected = selectedRowIds.includes(row.id);
            return (
              <tr
                key={row.id}
                className={isSelected ? "tblx__row--selected" : ""}
              >
                {showSelection && (
                  <td className="tblx__select-column">
                    <input
                      type="checkbox"
                      className="tblx__checkbox"
                      checked={isSelected}
                      onChange={(e) => handleRowSelect(row.id, e.target.checked)}
                      aria-label={`Select row ${row.id}`}
                    />
                  </td>
                )}
                {configuredColumns.map((col) => {
                  if (rowRenderer) {
                    return rowRenderer(configuredColumns, row);
                  }

                  const columnKey = String(col.key);
                  const isAction = col.type === "action";

                  // Custom render function - both column types use same signature
                  if (col.render) {
                    return (
                      <td
                        key={columnKey}
                        className={`${col.className || ""} ${isAction ? "tblx__td--action" : ""}`}
                      >
                        {col.render(row) as React.ReactNode}
                      </td>
                    );
                  }

                  // Default rendering for data columns (no render function)
                  const value = row[col.key as keyof T];
                  const content =
                    value !== undefined && value !== null ? String(value) : "";
                  return (
                    <td key={columnKey} className={col.className}>
                      {content}
                    </td>
                  );
                })}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}

// Keep the old name for backwards compatibility
export const TblxTableCompound = TblxTable;

export default TblxTable;
