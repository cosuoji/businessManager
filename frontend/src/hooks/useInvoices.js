import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getInvoices,
} from "../services/invoices";

const defaultPagination = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const useInvoices = ({
  page = 1,
  limit = 20,
  search = "",
  dateFrom = "",
  dateTo = "",
} = {}) => {
  const [invoices, setInvoices] =
    useState([]);

  const [pagination, setPagination] =
    useState(defaultPagination);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const fetchInvoices =
    useCallback(async () => {
      setLoading(true);
      setError(null);

      try {
        const response =
          await getInvoices({
            page,
            limit,
            search,
            dateFrom,
            dateTo,
          });

        setInvoices(
          response.invoices || []
        );

        setPagination(
          response.pagination ||
            defaultPagination
        );
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }, [
      page,
      limit,
      search,
      dateFrom,
      dateTo,
    ]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return {
    invoices,
    pagination,
    loading,
    error,
    refetch: fetchInvoices,
  };
};

export default useInvoices;
