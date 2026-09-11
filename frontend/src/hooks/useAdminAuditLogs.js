import { useCallback, useEffect, useState } from "react";
import { getAdminAuditLogs } from "../services/admin";

const useAdminAuditLogs = ({
  action = "",
  adminId = "",
  targetType = "",
  targetId = "",
  limit = 20,
} = {}) => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAuditLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAdminAuditLogs({
        page,
        limit,
        action,
        adminId,
        targetType,
        targetId,
      });

      setAuditLogs(response?.auditLogs || response?.logs || []);

      setPagination(response?.pagination || null);
    } catch (err) {
      setError(
        err?.message || "Failed to load audit logs."
      );
    } finally {
      setLoading(false);
    }
  }, [
    page,
    limit,
    action,
    adminId,
    targetType,
    targetId,
  ]);

  useEffect(() => {
    loadAuditLogs();
  }, [loadAuditLogs]);

  useEffect(() => {
    setPage(1);
  }, [action, adminId, targetType, targetId]);

  return {
    auditLogs,
    pagination,
    page,
    setPage,
    loading,
    error,
    refresh: loadAuditLogs,
  };
};

export default useAdminAuditLogs;
