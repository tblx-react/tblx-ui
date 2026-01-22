/**
 * Tblx - A headless, composable datatable component library
 *
 * Uses Context + Compound Components pattern for maximum flexibility.
 * Requires `tblx` npm package for state management.
 *
 * @example
 * ```tsx
 * import Tblx from '@/components/tblx/Tblx';
 *
 * <Tblx
 *   rows={users}
 *   columns={columns}
 *   initialState={initialState}
 *   onStateChange={handleStateChange}
 * >
 *   <div className="my-header">
 *     <Tblx.Search placeholder="Search..." />
 *     <Tblx.SortBy options={sortOptions} />
 *     <Tblx.FilterToggler />
 *   </div>
 *
 *   <Tblx.Filters>
 *     <Tblx.SelectFilter inputKey="status" label="Status" options={statusOptions} />
 *   </Tblx.Filters>
 *
 *   <div className="my-content">
 *     <Tblx.Loading />
 *     <Tblx.LoadingOverlay />
 *     <Tblx.Table columns={columns} />
 *     <Tblx.Empty>No users found</Tblx.Empty>
 *   </div>
 *
 *   <Tblx.Pager />
 *   <Tblx.TotalCount prefix="Total" suffix="users" />
 * </Tblx>
 * ```
 */

import { TblxProvider, TblxProviderProps } from "tblx";
import "../styles/index.css";

// Import compound components
import { TblxSearch } from "./Search";
import { TblxSortBy } from "./SortBy";
import { TblxFilters } from "./Filters";
import { TblxFilterToggler } from "./FilterToggler";
import { TblxTable } from "./Table";
import { TblxPager } from "./Pager";
import { TblxInfiniteScroll } from "./InfiniteScroll";
import { TblxBulkActions } from "./BulkActions";
import { TblxColumnConfig } from "./ColumnConfig";
import { TblxTotalCount } from "./TotalCount";
import { TblxLoading, TblxLoadingOverlay } from "./Loading";
import { TblxEmpty } from "./Empty";
import { TblxSelectFilter } from "./inputs/SelectFilter";
import { TblxMultiselectFilter } from "./inputs/MultiselectFilter";

// =====================
// Main Component (Provider with attached child components)
// =====================

/**
 * Tblx - The root provider component.
 * All Tblx child components must be nested within this provider.
 */
function Tblx<T extends { id: string | number }>(props: TblxProviderProps<T>) {
  return <TblxProvider {...props} />;
}

// =====================
// Attach Child Components
// =====================

/** Search input with debouncing */
Tblx.Search = TblxSearch;

/** Sort dropdown */
Tblx.SortBy = TblxSortBy;

/** Filter components container */
Tblx.Filters = TblxFilters;

/** Toggle button for filter visibility */
Tblx.FilterToggler = TblxFilterToggler;

/** Data table */
Tblx.Table = TblxTable;

/** Pagination controls */
Tblx.Pager = TblxPager;

/** Infinite scroll sentinel */
Tblx.InfiniteScroll = TblxInfiniteScroll;

/** Bulk action buttons */
Tblx.BulkActions = TblxBulkActions;

/** Column visibility and reorder panel */
Tblx.ColumnConfig = TblxColumnConfig;

/** Total count display */
Tblx.TotalCount = TblxTotalCount;

/** Loading state (shown when no data) */
Tblx.Loading = TblxLoading;

/** Loading overlay (shown when refreshing with existing data) */
Tblx.LoadingOverlay = TblxLoadingOverlay;

/** Empty state (shown when no data and not loading) */
Tblx.Empty = TblxEmpty;

/** Single-select filter dropdown */
Tblx.SelectFilter = TblxSelectFilter;

/** Multi-select filter dropdown */
Tblx.MultiselectFilter = TblxMultiselectFilter;

export default Tblx;

// =====================
// Named Exports
// =====================

// Re-export from tblx package
export { useTblxContext } from "tblx";
export type { TblxContextValue, TblxProviderProps } from "tblx";

// Compound component exports
export {
  TblxSearch,
  TblxSortBy,
  TblxFilters,
  TblxFilterToggler,
  TblxTable,
  TblxPager,
  TblxInfiniteScroll,
  TblxBulkActions,
  TblxColumnConfig,
  TblxTotalCount,
  TblxLoading,
  TblxLoadingOverlay,
  TblxEmpty,
  TblxSelectFilter,
  TblxMultiselectFilter,
};
