import { RefreshCw } from "lucide-react";
import { useState } from "react";

import AdminAuditLogDetails from "../../components/admin/AdminAuditLogDetails";
import AdminAuditLogFilters from "../../components/admin/AdminAuditLogFilters";
import AdminAuditLogTable from "../../components/admin/AdminAuditLogTable";
import AdminPagination from "../../components/admin/AdminPagination";

import AdminLoadingState from "../../components/admin/AdminLoadingState";
import AdminErrorState from "../../components/admin/AdminErrorState";
import AdminEmptyState from "../../components/admin/AdminEmptyState";

import useAdminAuditLogs from "../../hooks/useAdminAuditLogs";

const AdminAuditLogsPage = () => {
  const [action, setAction] = useState("");
  const [adminId, setAdminId] = useState("");
  const [targetType, setTargetType] = useState("");
  const [targetId, setTargetId] = useState("");

  const [selectedLog, setSelectedLog] = useState(null);

  const {
    auditLogs,
    pagination,
    page,
    setPage,
    loading,
    error,
    refresh,
  } = useAdminAuditLogs({
    action,
    adminId,
    targetType,
    targetId,
    limit: 20,
  });

  const clearFilters = () => {
    setAction("");
    setAdminId("");
    setTargetType("");
    setTargetId("");
    setPage(1);
  };

  const hasFilters =
    Boolean(action) ||
    Boolean(adminId) ||
    Boolean(targetType) ||
    Boolean(targetId.trim());

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-command-muted">
            Administration / Audit
          </p>

          <h1 className="mt-2 text-2xl font-medium tracking-tight">
            Audit logs
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-command-muted">
            Review administrative activity across the
            BizFlow platform.
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-command-lg border border-command-border px-4 py-2.5 text-xs transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={13}
            className={loading ? "animate-spin" : ""}
          />

          Refresh
        </button>
      </div>

      {/* Filters */}
      <AdminAuditLogFilters
        action={action}
        setAction={setAction}
        adminId={adminId}
        setAdminId={setAdminId}
        targetType={targetType}
        setTargetType={setTargetType}
        targetId={targetId}
        setTargetId={setTargetId}
        onClear={clearFilters}
      />

      {/* Audit logs */}
      <div className="mt-6">
        {loading ? (
          <AdminLoadingState message="Loading audit activity..." />
        ) : error ? (
          <AdminErrorState
            message={error}
            onRetry={refresh}
          />
        ) : auditLogs.length === 0 ? (
          <AdminEmptyState
            title="No audit activity found."
            description={
              hasFilters
                ? "Try changing or clearing your filters."
                : "Administrative activity will appear here as actions are performed."
            }
          />
        ) : (
          <>
            <AdminAuditLogTable
              auditLogs={auditLogs}
              onSelect={setSelectedLog}
            />

            {pagination?.totalPages > 1 && (
              <div className="mt-5">
                <AdminPagination
                  pagination={pagination}
                  page={page}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Details drawer */}
      <AdminAuditLogDetails
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
};

export default AdminAuditLogsPage;
