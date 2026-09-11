import { useCallback, useEffect, useState } from "react";
import { getAdminUsers } from "../services/admin";

const useAdminUsers = ({
  page = 1,
  limit = 20,
  search = "",
  plan = "",
  status = "",
} = {}) => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAdminUsers({
        page,
        limit,
        search,
        plan,
        status,
      });

      setUsers(response?.users || []);

      setPagination(
        response?.pagination || {
          page,
          limit,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        }
      );
    } catch (err) {
      setError(
        err?.message || "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, plan, status]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return {
    users,
    pagination,
    loading,
    error,
    refresh: loadUsers,
  };
};

export default useAdminUsers;
