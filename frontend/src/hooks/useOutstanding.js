import { useCallback, useEffect, useState } from "react";

import {
  getOutstandingSummary,
  getOutstandingOrders,
  getDueSoonOrders,
  getOverdueOrders,
  getOutstandingCustomers,
} from "../services/outstanding";

const VIEW = {
  ALL: "all",
  DUE_SOON: "due-soon",
  OVERDUE: "overdue",
};

const MODE = {
  ORDERS: "orders",
  CUSTOMERS: "customers",
};

export const useOutstanding = () => {
  const [mode, setMode] = useState(MODE.ORDERS);
  const [view, setView] = useState(VIEW.ALL);

  // -------------------------
  // Orders
  // -------------------------

  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -------------------------
  // Customers
  // -------------------------

  const [customerPage, setCustomerPage] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [customerPagination, setCustomerPagination] =
    useState(null);

  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerError, setCustomerError] = useState(null);

  // -------------------------
  // Summary
  // -------------------------

  const [summary, setSummary] = useState({
    totalOutstanding: 0,
    dueSoon: 0,
    overdue: 0,
  });

  const [summaryLoading, setSummaryLoading] = useState(true);

  // -------------------------
  // Fetch summary
  // -------------------------

  const fetchSummary = useCallback(async () => {
    try {
      setSummaryLoading(true);

      const response = await getOutstandingSummary();

      setSummary({
        totalOutstanding:
          response?.data?.totalOutstanding || 0,

        dueSoon: response?.data?.dueSoon || 0,

        overdue: response?.data?.overdue || 0,
      });
    } catch (error) {
      console.error(
        "Failed to fetch outstanding summary:",
        error
      );
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // -------------------------
  // Fetch orders
  // -------------------------

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let response;

      if (view === VIEW.DUE_SOON) {
        response = await getDueSoonOrders({
          page,
          limit,
        });
      } else if (view === VIEW.OVERDUE) {
        response = await getOverdueOrders({
          page,
          limit,
        });
      } else {
        response = await getOutstandingOrders({
          page,
          limit,
        });
      }

      setOrders(response?.data?.orders || []);

      setPagination(
        response?.data?.pagination || null
      );
    } catch (error) {
      console.error(
        "Failed to fetch outstanding orders:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to load outstanding orders."
      );

      setOrders([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [view, page, limit]);

  // -------------------------
  // Fetch customers
  // -------------------------

  const fetchCustomers = useCallback(async () => {
    try {
      setCustomerLoading(true);
      setCustomerError(null);

      const response = await getOutstandingCustomers({
        page: customerPage,
        limit,
      });

      setCustomers(
        response?.data?.customers || []
      );

      setCustomerPagination(
        response?.data?.pagination || null
      );
    } catch (error) {
      console.error(
        "Failed to fetch outstanding customers:",
        error
      );

      setCustomerError(
        error?.response?.data?.message ||
          "Failed to load outstanding customers."
      );

      setCustomers([]);
      setCustomerPagination(null);
    } finally {
      setCustomerLoading(false);
    }
  }, [customerPage, limit]);

  // -------------------------
  // Effects
  // -------------------------

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    if (mode === MODE.ORDERS) {
      fetchOrders();
    }
  }, [mode, fetchOrders]);

  useEffect(() => {
    if (mode === MODE.CUSTOMERS) {
      fetchCustomers();
    }
  }, [mode, fetchCustomers]);

  // -------------------------
  // Navigation
  // -------------------------

  const changeMode = useCallback((newMode) => {
    setMode(newMode);

    if (newMode === MODE.ORDERS) {
      setPage(1);
    }

    if (newMode === MODE.CUSTOMERS) {
      setCustomerPage(1);
    }
  }, []);

  const changeView = useCallback((newView) => {
    setView(newView);
    setPage(1);
  }, []);

  const goToPage = useCallback(
    (newPage) => setPage(newPage),
    []
  );

  const goToCustomerPage = useCallback(
    (newPage) => setCustomerPage(newPage),
    []
  );

  // -------------------------
  // Refresh
  // -------------------------

  const refetch = useCallback(async () => {
    await fetchSummary();

    if (mode === MODE.ORDERS) {
      await fetchOrders();
    } else {
      await fetchCustomers();
    }
  }, [
    mode,
    fetchSummary,
    fetchOrders,
    fetchCustomers,
  ]);

  return {
    mode,
    setMode: changeMode,

    view,
    setView: changeView,

    orders,
    pagination,

    customers,
    customerPagination,

    summary,

    loading,
    summaryLoading,

    customerLoading,

    error,
    customerError,

    page,
    setPage: goToPage,

    customerPage,
    setCustomerPage: goToCustomerPage,

    refetch,

    VIEW,
    MODE,
  };
};
