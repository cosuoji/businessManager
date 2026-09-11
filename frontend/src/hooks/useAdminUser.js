import { useCallback, useEffect, useState } from "react";
import { getAdminUser } from "../services/admin";

const useAdminUser = (id) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUser = useCallback(async () => {
    if (!id) {
      setError("User ID is required.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await getAdminUser(id);

      setUser(response?.user || null);
    } catch (err) {
      setError(
        err?.message || "Failed to load user."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return {
    user,
    loading,
    error,
    refresh: loadUser,
  };
};

export default useAdminUser;
