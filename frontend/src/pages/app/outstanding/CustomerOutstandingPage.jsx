import {
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Navigate, useParams } from "react-router-dom";

import OutstandingCustomerStats from "../../../components/outstanding/OutstandingCustomerStats";
import OutstandingOrderTable from "../../../components/outstanding/OutstandingOrderTable";
import OutstandingCustomerHeader from "../../../components/outstanding/OutstandingCustomerHeader";


import { useCustomerOutstanding } from "../../../hooks/useCustomerOutstanding";

const CustomerOutstandingPage = () => {
  const { customerId } = useParams();

  const {
    customer,
    orders,
    totalOutstanding,
    pagination,
    page,
    setPage,
    loading,
    error,
    refetch,
  } = useCustomerOutstanding(customerId);

  if (!customerId) {
    return <Navigate to="/outstanding" replace />;
  }

  if (!loading && !customer && !error) {
    return <Navigate to="/outstanding" replace />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {customer && (
        <OutstandingCustomerHeader
          customer={customer}
          totalOutstanding={totalOutstanding}
        />
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-400">
          <AlertCircle
            size={17}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <CustomerOutstandingSkeleton />
      )}

      {/* Content */}
      {!loading && customer && (
        <>
          <OutstandingCustomerStats
            totalOutstanding={
              totalOutstanding
            }
            orderCount={
              pagination?.total || 0
            }
            overdueAmount={0}
            overdueOrderCount={0}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold">
                  Outstanding Orders
                </h2>

                <p className="mt-1 text-sm command-muted">
                  Orders that still have an unpaid
                  balance.
                </p>
              </div>

              <button
                type="button"
                onClick={refetch}
                disabled={loading}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border command-border command-surface command-muted transition hover:text-white disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw
                  size={15}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />
              </button>
            </div>

            <OutstandingOrderTable
              orders={orders}
              showCustomer={false}
            />
          </div>

          {pagination &&
            pagination.totalPages > 1 && (
              <OutstandingPagination
                pagination={pagination}
                onPageChange={setPage}
              />
            )}
        </>
      )}
    </div>
  );
};

const CustomerOutstandingSkeleton = () => (
  <div className="space-y-4">
    <div className="command-surface command-border rounded-xl border p-5">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl command-black animate-pulse" />

        <div className="space-y-2">
          <div className="h-5 w-40 rounded command-black animate-pulse" />
          <div className="h-3 w-28 rounded command-black animate-pulse" />
        </div>
      </div>
    </div>

    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map(
        (_, index) => (
          <div
            key={index}
            className="command-surface command-border rounded-xl border p-5"
          >
            <div className="h-4 w-24 rounded command-black animate-pulse" />
            <div className="mt-3 h-8 w-32 rounded command-black animate-pulse" />
          </div>
        )
      )}
    </div>

    <div className="h-64 rounded-xl command-surface command-border border animate-pulse" />
  </div>
);

const OutstandingPagination = ({
  pagination,
  onPageChange,
}) => {
  const {
    page,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  } = pagination;

  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        disabled={!hasPreviousPage}
        onClick={() =>
          onPageChange(page - 1)
        }
        className="rounded-lg border command-border command-surface px-3 py-2 text-sm command-muted transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      <span className="text-sm command-muted">
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        disabled={!hasNextPage}
        onClick={() =>
          onPageChange(page + 1)
        }
        className="rounded-lg border command-border command-surface px-3 py-2 text-sm command-muted transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
};

export default CustomerOutstandingPage;
