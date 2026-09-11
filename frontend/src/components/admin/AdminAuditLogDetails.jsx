import { X } from "lucide-react";

const formatDateTime = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const AdminAuditLogDetails = ({
  log,
  onClose,
}) => {
  if (!log) return null;

  const admin = log.adminId;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside className="relative h-full w-full max-w-lg overflow-y-auto border-l border-command-border bg-command-surface">
        <div className="sticky top-0 flex items-center justify-between border-b border-command-border bg-command-surface px-5 py-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-command-muted">
              Audit record
            </p>

            <h2 className="mt-1 text-sm font-medium">
              {log.action}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-command-muted transition hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <div className="rounded-command-lg border border-command-border bg-command-black/30 p-4">
            <p className="text-xs leading-5">
              {log.description}
            </p>
          </div>

          <div className="mt-6">
            <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-command-muted">
              Record
            </p>

            <div className="divide-y divide-command-border rounded-command-lg border border-command-border">
              <div className="flex justify-between gap-5 px-4 py-3">
                <span className="text-[10px] text-command-muted">
                  Time
                </span>

                <span className="text-right font-mono text-[10px]">
                  {formatDateTime(log.createdAt)}
                </span>
              </div>

              <div className="flex justify-between gap-5 px-4 py-3">
                <span className="text-[10px] text-command-muted">
                  Admin
                </span>

                <span className="text-right text-[10px]">
                  {admin?.name ||
                    admin?.email ||
                    "Unknown"}
                </span>
              </div>

              <div className="flex justify-between gap-5 px-4 py-3">
                <span className="text-[10px] text-command-muted">
                  Action
                </span>

                <span className="text-right font-mono text-[10px]">
                  {log.action || "—"}
                </span>
              </div>

              <div className="flex justify-between gap-5 px-4 py-3">
                <span className="text-[10px] text-command-muted">
                  Target type
                </span>

                <span className="text-right text-[10px]">
                  {log.targetType || "System"}
                </span>
              </div>

              <div className="flex justify-between gap-5 px-4 py-3">
                <span className="text-[10px] text-command-muted">
                  Target ID
                </span>

                <span className="max-w-[230px] break-all text-right font-mono text-[9px]">
                  {log.targetId || "—"}
                </span>
              </div>

              <div className="flex justify-between gap-5 px-4 py-3">
                <span className="text-[10px] text-command-muted">
                  IP address
                </span>

                <span className="text-right font-mono text-[9px]">
                  {log.ipAddress || "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-command-muted">
              Metadata
            </p>

            <pre className="overflow-x-auto rounded-command-lg border border-command-border bg-command-black p-4 font-mono text-[9px] leading-5 text-command-muted">
              {JSON.stringify(
                log.metadata || {},
                null,
                2
              )}
            </pre>
          </div>

          <div className="mt-6">
            <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-command-muted">
              User agent
            </p>

            <p className="break-all rounded-command-lg border border-command-border bg-command-black/30 p-4 font-mono text-[9px] leading-5 text-command-muted">
              {log.userAgent || "—"}
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default AdminAuditLogDetails;
