import { RotateCcw, Search } from "lucide-react";

const ACTION_OPTIONS = [
  { value: "", label: "All actions" },
  { value: "ADMIN_LOGIN", label: "Admin login" },
  { value: "USER_VIEWED", label: "User viewed" },
  { value: "USER_SUSPENDED", label: "User suspended" },
  { value: "USER_RESTORED", label: "User restored" },
  { value: "USER_PLAN_CHANGED", label: "Plan changed" },
  { value: "USER_PLAN_GRANTED", label: "Pro granted" },
  { value: "USER_PLAN_REVOKED", label: "Pro revoked" },
  {
    value: "SUBSCRIPTION_CANCELLED",
    label: "Subscription cancelled",
  },
  {
    value: "SUBSCRIPTION_RESUMED",
    label: "Subscription resumed",
  },
  {
    value: "USER_DATA_MODIFIED",
    label: "User modified",
  },
  {
    value: "ORDER_MODIFIED",
    label: "Order modified",
  },
  {
    value: "ORDER_DELETED",
    label: "Order deleted",
  },
  {
    value: "INVOICE_MODIFIED",
    label: "Invoice modified",
  },
];

const TARGET_OPTIONS = [
  { value: "", label: "All targets" },
  { value: "User", label: "User" },
  { value: "Order", label: "Order" },
  { value: "Invoice", label: "Invoice" },
  { value: "Subscription", label: "Subscription" },
];

const AdminAuditLogFilters = ({
  action,
  setAction,
  adminId,
  setAdminId,
  targetType,
  setTargetType,
  targetId,
  setTargetId,
  onClear,
}) => {
  const hasFilters =
    action ||
    adminId ||
    targetType ||
    targetId;

  return (
    <div className="rounded-command-lg border border-command-border bg-command-surface">
      <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-end">
        <div className="min-w-0 flex-1">
          <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.16em] text-command-muted">
            Action
          </label>

          <select
            value={action}
            onChange={(event) =>
              setAction(event.target.value)
            }
            className="w-full rounded-command-lg border border-command-border bg-command-black px-3 py-2.5 text-xs outline-none focus:border-white"
          >
            {ACTION_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-0 flex-1">
          <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.16em] text-command-muted">
            Admin ID
          </label>

          <input
            value={adminId}
            onChange={(event) =>
              setAdminId(event.target.value)
            }
            placeholder="MongoDB ObjectId"
            className="w-full rounded-command-lg border border-command-border bg-command-black px-3 py-2.5 font-mono text-xs outline-none focus:border-white"
          />
        </div>

        <div className="min-w-0 flex-1">
          <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.16em] text-command-muted">
            Target
          </label>

          <select
            value={targetType}
            onChange={(event) =>
              setTargetType(event.target.value)
            }
            className="w-full rounded-command-lg border border-command-border bg-command-black px-3 py-2.5 text-xs outline-none focus:border-white"
          >
            {TARGET_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-0 flex-1">
          <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.16em] text-command-muted">
            Target ID
          </label>

          <div className="relative">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-command-muted"
            />

            <input
              value={targetId}
              onChange={(event) =>
                setTargetId(event.target.value)
              }
              placeholder="ObjectId"
              className="w-full rounded-command-lg border border-command-border bg-command-black py-2.5 pl-9 pr-3 font-mono text-xs outline-none focus:border-white"
            />
          </div>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="flex shrink-0 items-center justify-center gap-2 rounded-command-lg border border-command-border px-4 py-2.5 text-xs transition hover:bg-white/5"
          >
            <RotateCcw size={13} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminAuditLogFilters;
