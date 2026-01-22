# tblx-ui

Copy-paste UI components for tblx data tables. Inspired by [shadcn/ui](https://ui.shadcn.com/).

## Requirements

- **React 18+**
- **tblx** core library (`npm install tblx`)

## Usage

```bash
# Add the main Tblx component with all sub-components
npx tblx-ui add tblx --with-base-styles

# Add individual components
npx tblx-ui add table
npx tblx-ui add pager
npx tblx-ui add search

# List all available components
npx tblx-ui list
```

Components are copied directly into your project — no additional dependencies required.

### Use in Your App

```tsx
import Tblx from "@/components/tblx/Tblx";
import "@/components/tblx/styles/index.css";

const columns = [
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
];

function UsersTable() {
  const [users, setUsers] = useState([]);

  const handleStateChange = async ({ nextState }) => {
    const data = await fetchUsers(nextState);
    setUsers(data);
  };

  return (
    <Tblx
      rows={users}
      columns={columns}
      onStateChange={handleStateChange}
      totalCount={100}
    >
      <div className="tblx__header">
        <Tblx.Search placeholder="Search users..." />
        <Tblx.SortBy
          options={[
            { key: "name", direction: "asc", label: "Name A-Z" },
            { key: "name", direction: "desc", label: "Name Z-A" },
          ]}
        />
        <Tblx.FilterToggler />
      </div>

      <Tblx.Filters>
        <Tblx.SelectFilter
          inputKey="role"
          label="Role"
          options={[
            { value: "admin", label: "Admin" },
            { value: "user", label: "User" },
          ]}
        />
      </Tblx.Filters>

      <div className="tblx__content">
        <Tblx.Loading />
        <Tblx.LoadingOverlay />
        <Tblx.Table columns={columns} />
        <Tblx.Empty>No users found</Tblx.Empty>
      </div>

      <Tblx.Pager limit={20} />
      <Tblx.TotalCount prefix="Total" suffix="users" />
    </Tblx>
  );
}
```

## Available Components

| Component | Description |
|-----------|-------------|
| `tblx` | Main Tblx component with all sub-components attached |
| `search` | Search input with debouncing |
| `table` | Data table with sorting and selection |
| `pager` | Pagination controls |
| `filters` | Filter container |
| `filter-toggler` | Toggle button for filter visibility |
| `sort-by` | Sort dropdown |
| `bulk-actions` | Bulk action buttons for selected rows |
| `column-config` | Column visibility and reorder panel |
| `loading` | Loading state and overlay components |
| `empty` | Empty state component |
| `total-count` | Total count display |
| `infinite-scroll` | Infinite scroll sentinel |
| `select-filter` | Single-select filter dropdown |
| `multiselect-filter` | Multi-select filter dropdown |

## Customization

Since components are copied into your project, you have full control:

1. **Modify styles**: Edit CSS files in `styles/` directory
2. **Customize components**: Edit TSX files directly
3. **Change colors**: Update CSS variables in `styles/variables.css`

### CSS Variables

The theme uses CSS custom properties for easy customization:

```css
.tblx {
  --tf-primary: #e4e4e7;
  --tf-bg: #0f0f0f;
  --tf-bg-elevated: #1a1a1a;
  --tf-border: #2a2a2a;
  --tf-text: #f4f4f5;
  /* ... see variables.css for all options */
}
```

## License

MIT
