import { useCallback, useEffect, useState } from "react";
import { getCustomerOutstanding } from "../services/outstanding";

export const useCustomerOutstanding = (customerId) => {
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [totalOutstanding, setTotalOutstanding] = useState(0);
  const [pagination, setPagination] = useState(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOutstanding = useCallback(async () => {
    if (!customerId) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await getCustomerOutstanding(
        customerId,
        {
          page,
          limit,
        }
      );

      const data = response?.data;

      setCustomer(data?.customer || null);
      setOrders(data?.orders || []);
      setTotalOutstanding(
        data?.totalOutstanding || 0
      );
      setPagination(
        data?.pagination || null
      );
    } catch (error) {
      console.error(
        "Failed to fetch customer outstanding:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to load customer outstanding."
      );

      setCustomer(null);
      setOrders([]);
      setTotalOutstanding(0);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [customerId, page, limit]);

  useEffect(() => {
    fetchOutstanding();
  }, [fetchOutstanding]);

  const goToPage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const refetch = useCallback(async () => {
    await fetchOutstanding();
  }, [fetchOutstanding]);

  return {
    customer,
    orders,
    totalOutstanding,
    pagination,

    page,
    setPage: goToPage,

    loading,
    error,

    refetch,
  };
};
