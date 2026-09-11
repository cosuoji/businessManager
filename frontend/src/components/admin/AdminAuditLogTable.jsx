import { ChevronRight } from "lucide-react";

const formatDateTime = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatAction = (action = "") => {
  return action
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};

const AdminAuditLogTable = ({
  auditLogs,
  onSelect,
}) => {
  if (!auditLogs.length) {
    return (
      <div className="rounded-command-lg border border-command-border bg-command-surface px-6 py-16 text-center">
        <p className="text-sm">
          No audit activity found.
        </p>

        <p className="mt-2 text-xs text-command-muted">
          Try changing or clearing your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-command-lg border border-command-border bg-command-surface">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-command-border">
              <th className="px-5 py-4 text-left font-mono text-[9px] uppercase tracking-[0.16em] text-command-muted">
                Time
              </th>

              <th className="px-5 py-4 text-left font-mono text-[9px] uppercase tracking-[0.16em] text-command-muted">
                Admin
              </th>

              <th className="px-5 py-4 text-left font-mono text-[9px] uppercase tracking-[0.16em] text-command-muted">
                Action
              </th>

              <th className="px-5 py-4 text-left font-mono text-[9px] uppercase tracking-[0.16em] text-command-muted">
                Target
              </th>

              <th className="w-10 px-5 py-4" />
            </tr>
          </thead>

          <tbody>
            {auditLogs.map((log) => {
              const admin = log.adminId;
              const adminName =
                admin?.name ||
                admin?.email ||
                "Unknown admin";

              return (
                <tr
                  key={log._id}
                  className="border-b border-command-border last:border-b-0 transition hover:bg-white/[0.02]"
                >
                  <td className="whitespace-nowrap px-5 py-4">
                    <span className="font-mono text-[10px] text-command-muted">
                      {formatDateTime(log.createdAt)}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div>
                      <p className="text-xs font-medium">
                        {adminName}
                      </p>

                      {admin?.email && (
                        <p className="mt-1 text-[10px] text-command-muted">
                          {admin.email}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full border border-command-border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.08em]">
                      {formatAction(log.action)}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div>
                      <p className="text-xs">
                        {log.targetType || "System"}
                      </p>

                      {log.targetId && (
                        <p className="mt-1 max-w-[180px] truncate font-mono text-[9px] text-command-muted">
                          {log.targetId}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => onSelect(log)}
                      className="text-command-muted transition hover:text-white"
                      aria-label="View audit log details"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="divide-y divide-command-border md:hidden">
        {auditLogs.map((log) => {
          const admin = log.adminId;

          return (
            <button
              key={log._id}
              type="button"
              onClick={() => onSelect(log)}
              className="block w-full px-4 py-4 text-left transition hover:bg-white/[0.02]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <span className="inline-flex rounded-full border border-command-border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.08em]">
                    {formatAction(log.action)}
                  </span>

                  <p className="mt-3 text-xs font-medium">
                    {log.description}
                  </p>

                  <div className="mt-2 space-y-1">
                    <p className="text-[10px] text-command-muted">
                      {admin?.name ||
                        admin?.email ||
                        "Unknown admin"}
                    </p>

                    <p className="font-mono text-[9px] text-command-muted">
                      {formatDateTime(log.createdAt)}
                    </p>
                  </div>
                </div>

                <ChevronRight
                  size={16}
                  className="mt-1 shrink-0 text-command-muted"
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AdminAuditLogTable;
