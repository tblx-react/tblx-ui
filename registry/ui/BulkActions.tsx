import React, { useEffect } from "react";
import { useTblxContext } from "tblx";

// =====================
// Types
// =====================

export type TblxBulkActionProps<T extends { id: string | number }> = {
  label: string;
  onClick: (selectedIds: T["id"][]) => void;
  className?: string;
  disabled?: boolean;
};

export type TblxBulkActionsProps<T extends { id: string | number }> = {
  /** Array of action buttons to display */
  actions: TblxBulkActionProps<T>[];
  /** Custom className */
  className?: string;
  /** Clear selection after action */
  clearOnAction?: boolean;
};

// =====================
// Component
// =====================

export function TblxBulkActions<T extends { id: string | number }>({
  actions,
  className = "",
  clearOnAction = false,
}: TblxBulkActionsProps<T>) {
  const { selectedRowIds, clearSelection, registerBulkActions } = useTblxContext<T>();

  // Register this component in context so Table knows to enable selection
  useEffect(() => {
    const unregister = registerBulkActions();
    return unregister;
  }, [registerBulkActions]);

  if (selectedRowIds.length === 0) {
    return null;
  }

  const handleActionClick = (action: TblxBulkActionProps<T>) => {
    action.onClick(selectedRowIds);
    if (clearOnAction) {
      clearSelection();
    }
  };

  return (
    <div className={`tblx__bulk-actions ${className}`}>
      {actions.map((action, index) => (
        <button
          key={index}
          type="button"
          className={`tblx__bulk-action ${action.className || ""}`}
          onClick={() => handleActionClick(action)}
          disabled={action.disabled}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}

export default TblxBulkActions;
