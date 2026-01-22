import React from "react";
import { useTblxContext } from "tblx";

// =====================
// Types
// =====================

export type TblxTotalCountProps = {
  /** Prefix text (e.g., "Total") */
  prefix?: string;
  /** Suffix text (e.g., "users") */
  suffix?: string;
  /** Custom className */
  className?: string;
};

// =====================
// Component
// =====================

/**
 * Displays the total count from context.
 * Uses totalCount from context (passed to Tblx provider).
 *
 * @example
 * ```tsx
 * <Tblx rows={data} totalCount={100}>
 *   <Tblx.TotalCount prefix="Total" suffix="users" />
 * </Tblx>
 * ```
 */
export function TblxTotalCount({
  prefix = "",
  suffix = "",
  className = "",
}: TblxTotalCountProps) {
  const { totalCount } = useTblxContext();

  if (totalCount === undefined) {
    return null;
  }

  return (
    <span className={`tblx__total-count ${className}`}>
      {`${prefix} ${totalCount} ${suffix}`.trim()}
    </span>
  );
}

export default TblxTotalCount;
