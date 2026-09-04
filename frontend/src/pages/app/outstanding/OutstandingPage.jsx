import { RefreshCw, Wallet } from "lucide-react";

import OutstandingStats from "../../../components/outstanding/OutstandingStats";
import OutstandingFilters from "../../../components/outstanding/OutstandingFilters";
import OutstandingOrderTable from "../../../components/outstanding/OutstandingOrderTable";
import OutstandingCustomerTable from "../../../components/outstanding/OutstandingCustomerTable";

import { useOutstanding } from "../../../hooks/useOutstanding";

const OutstandingPage = () => {
  const {
    mode,
    setMode,

    view,
    setView,

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
    setPage,

    customerPage,
    setCustomerPage,

    refetch,

    MODE,
  } = useOutstanding();

  const activeLoading =
    mode === MODE.ORDERS
      ? loading
      : customerLoading;

  const activeError =
    mode === MODE.ORDERS
      ? error
      : customerError;

  const activePagination =
    mode === MODE.ORDERS
      ? pagination
      : customerPagination;

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between pt-5">
        <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-command-green">
                Debt Tracker
            </p>

            <div className="mt-1 flex items-center gap-3">
                <h1 className="font-mono text-2xl font-semibold tracking-tight">
                   Outstanding
                </h1>

                <Wallet
                    size={19}
                    className="text-command-muted"
                />
            </div>

            <p className="mt-2 text-sm text-command-muted">
                Who owes me what?
            </p>
        </div>

        <button
          type="button"
          onClick={refetch}
          disabled={
            activeLoading || summaryLoading
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg border-command-green/20 bg-command-green/[0.04] command-surface px-3 py-2 text-sm font-medium transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={15}
            className={
              activeLoading
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>
      </div>

      {/* Stats */}
      <OutstandingStats
        summary={summary}
        loading={summaryLoading}
      />

      {/* Filters */}
      <div className="border-b command-border pb-4">
        <OutstandingFilters
          mode={mode}
          view={view}
          onModeChange={setMode}
          onViewChange={setView}
        />
      </div>

      {/* Error */}
      {activeError && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-400">
          {activeError}
        </div>
      )}

      {/* Content */}
      {activeLoading ? (
        <OutstandingTableSkeleton />
      ) : mode === MODE.ORDERS ? (
        <OutstandingOrderTable
          orders={orders}
        />
      ) : (
        <OutstandingCustomerTable
          customers={customers}
        />
      )}

      {/* Pagination */}
      {!activeLoading &&
        activePagination &&
        activePagination.totalPages > 1 && (
          <OutstandingPagination
            pagination={activePagination}
            onPageChange={
              mode === MODE.ORDERS
                ? setPage
                : setCustomerPage
            }
          />
        )}
    </div>
  );
};

const OutstandingTableSkeleton = () => (
    <div className="overflow-hidden rounded-command-lg border border-command-border bg-command-surface">
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr className="border-b border-command-border">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <th
                                key={index}
                                className="px-5 py-3.5"
                            >
                                <div
                                    className={`h-2.5 animate-pulse rounded bg-command-black ${
                                        index === 0
                                            ? "w-24"
                                            : index === 4
                                              ? "w-8"
                                              : "w-20"
                                    }`}
                                />
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="divide-y divide-command-border">
                    {Array.from({ length: 6 }).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {/* Customer */}
                            <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 shrink-0 animate-pulse rounded-command-sm bg-command-black" />

                                    <div className="space-y-2">
                                        <div className="h-3.5 w-28 animate-pulse rounded bg-command-black" />

                                        <div className="h-2.5 w-20 animate-pulse rounded bg-command-black" />
                                    </div>
                                </div>
                            </td>

                            {/* Outstanding orders */}
                            <td className="px-5 py-4">
                                <div className="h-3.5 w-8 animate-pulse rounded bg-command-black" />
                            </td>

                            {/* Outstanding */}
                            <td className="px-5 py-4">
                                <div className="h-3.5 w-24 animate-pulse rounded bg-command-black" />
                            </td>

                            {/* Overdue */}
                            <td className="px-5 py-4">
                                <div className="h-3.5 w-20 animate-pulse rounded bg-command-black" />
                            </td>

                            {/* Action */}
                            <td className="px-5 py-4 text-right">
                                <div className="ml-auto h-8 w-8 animate-pulse rounded-command-sm bg-command-black" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
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
        <div className="flex items-center justify-between border-t border-command-border pt-4">
            <button
                type="button"
                disabled={!hasPreviousPage}
                onClick={() =>
                    onPageChange(page - 1)
                }
                className="rounded-command-sm border border-command-border bg-command-surface px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-command-muted transition-all duration-200 hover:border-command-green/30 hover:bg-command-green/[0.04] hover:text-command-green disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-command-border disabled:hover:bg-command-surface disabled:hover:text-command-muted"
            >
                Previous
            </button>

            <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-command-muted">
                    Page
                </span>

                <span className="font-mono text-xs font-medium text-command-white">
                    {String(page).padStart(2, "0")}
                </span>

                <span className="text-command-muted">
                    /
                </span>

                <span className="font-mono text-xs text-command-muted">
                    {String(totalPages).padStart(2, "0")}
                </span>
            </div>

            <button
                type="button"
                disabled={!hasNextPage}
                onClick={() =>
                    onPageChange(page + 1)
                }
                className="rounded-command-sm border border-command-border bg-command-surface px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-command-muted transition-all duration-200 hover:border-command-green/30 hover:bg-command-green/[0.04] hover:text-command-green disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-command-border disabled:hover:bg-command-surface disabled:hover:text-command-muted"
            >
                Next
            </button>
        </div>
    );
};



export default OutstandingPage;
