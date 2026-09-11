import { Search, X } from "lucide-react";

const AdminFilterBar = ({
  search,
  onSearchChange,
  plan,
  onPlanChange,
  status,
  onStatusChange,
  onClear,
}) => {
  const hasFilters =
    search || plan || status;

  return (
    <div className="rounded-command-lg border border-command-border bg-command-surface p-4">
      <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_auto]">
        {/* Search */}
        <div className="relative">
          <Search
            size={16}
            strokeWidth={1.7}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-command-muted"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search name, email, business..."
            className="h-10 w-full rounded-lg border border-command-border bg-command-black pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-command-muted focus:border-white"
          />
        </div>

        {/* Plan */}
        <select
          value={plan}
          onChange={(event) =>
            onPlanChange(event.target.value)
          }
          className="h-10 rounded-lg border border-command-border bg-command-black px-3 text-sm outline-none focus:border-white"
        >
          <option value="">All plans</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value)
          }
          className="h-10 rounded-lg border border-command-border bg-command-black px-3 text-sm outline-none focus:border-white"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>

        {/* Clear */}
        <button
          type="button"
          onClick={onClear}
          disabled={!hasFilters}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-command-border px-4 text-sm text-command-muted transition-colors hover:bg-command-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <X size={15} />
          Clear
        </button>
      </div>
    </div>
  );
};

export default AdminFilterBar;
