import { useCallback, useEffect, useState } from "react";
import {
  getAdminUsers,
  getAdminAuditLogs,
} from "../services/admin";

const useAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersResponse, auditResponse] = await Promise.all([
        getAdminUsers({
          page: 1,
          limit: 100,
        }),
        getAdminAuditLogs({
          page: 1,
          limit: 10,
        }),
      ]);

      setUsers(usersResponse?.users || []);
      setAuditLogs(auditResponse?.auditLogs || []);
    } catch (err) {
      setError(
        err?.message || "Failed to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return {
    users,
    auditLogs,
    loading,
    error,
    refresh: loadDashboard,
  };
};

export default useAdminDashboard;
