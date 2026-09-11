import { useState } from "react";
import {
  suspendAdminUser,
  restoreAdminUser,
  grantProToUser,
  revokeProFromUser
} from "../services/admin";

const useAdminUserActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const suspendUser = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await suspendAdminUser(id);

      return response;
    } catch (err) {
      const message =
        err?.message || "Failed to suspend user.";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const restoreUser = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await restoreAdminUser(id);

      return response;
    } catch (err) {
      const message =
        err?.message || "Failed to restore user.";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const grantPro = async (id, days) => {
    try {
      setLoading(true);
      setError(null);

      const response = await grantProToUser(id, days);

      return response;
    } catch (err) {
      const message =
        err?.message || "Failed to grant Pro to user.";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const revokePro = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await revokeProFromUser(id);

      return response;
    } catch (err) {
      const message =
        err?.message || "Failed to revoke Pro from user.";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    suspendUser,
    restoreUser,
    grantPro,
    revokePro,
    loading,
    error,
    clearError,
  };
};

export default useAdminUserActions;
