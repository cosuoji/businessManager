import {
    CreditCard,
    Search,
    X,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";


import usePayments from "../../../hooks/usePayments";
import usePaymentStats from "../../../hooks/usePaymentStats";

import PaymentStats from "../../../components/payments/PaymentStats";
import PaymentsTable from "../../../components/payments/PaymentsTable";

const PaymentsPage = () => {
    const [searchInput, setSearchInput] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [paymentMethod, setPaymentMethod] =
        useState("");

    const [dateFrom, setDateFrom] =
        useState("");

    const [dateTo, setDateTo] =
        useState("");

    const [page, setPage] =
        useState(1);

    const {
        payments,
        pagination,
        loading,
        error,
        refetch,
    } = usePayments({
        page,
        limit: 20,
        search,
        paymentMethod,
        dateFrom,
        dateTo,
    });


    const {
        stats,
        loading: statsLoading,
        error: statsError,
        refetch: refetchStats,
    } = usePaymentStats({
        search,
        paymentMethod,
        dateFrom,
        dateTo,
    });

    useEffect(() => {
        const timeout =
            setTimeout(() => {
                setPage(1);
                setSearch(
                    searchInput.trim()
                );
            }, 350);

        return () =>
            clearTimeout(timeout);
    }, [searchInput]);

    const clearFilters = () => {
        setSearchInput("");
        setSearch("");
        setPaymentMethod("");
        setDateFrom("");
        setDateTo("");
        setPage(1);
    };

    const hasFilters =
        search ||
        paymentMethod ||
        dateFrom ||
        dateTo;



  return (
        <div>
            {/* HEADER */}

            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-command-green">
                        Finance
                    </p>

                    <div className="mt-1 flex items-center gap-3">
                        <h1 className="font-mono text-2xl font-semibold tracking-tight">
                            Payments
                        </h1>

                        <CreditCard
                            size={19}
                            className="text-command-muted"
                        />
                    </div>

                    <p className="mt-2 text-sm text-command-muted">
                        Track money received across your orders.
                    </p>
                </div>
            </div>

            {/* STATS */}

            <div className="mt-8">
              <PaymentStats
                  stats={stats}
                  loading={statsLoading}
              />
            </div>

            {/* FILTERS */}

            <section className="mt-5 rounded-command-lg border border-command-border bg-command-surface">
                <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
                    <div className=" flex-1">
                        <Search
                            size={15}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-command-muted"
                        />

                        <input
                            value={
                                searchInput
                            }
                            onChange={(event) =>
                                setSearchInput(
                                    event.target
                                        .value
                                )
                            }
                            placeholder="Search payments or order number..."
                            className="h-10 w-full  rounded-command-md border border-command-border bg-command-black pl-10 pr-3 text-sm text-command-white outline-none placeholder:text-command-muted/50 focus:border-command-green/40"
                        />
                    </div>

                    <select
                        value={
                            paymentMethod
                        }
                        onChange={(event) => {
                            setPaymentMethod(
                                event.target
                                    .value
                            );
                            setPage(1);
                        }}
                        className="h-10 rounded-command-md border border-command-border bg-command-black px-3 text-xs text-command-white outline-none focus:border-command-green/40"
                    >
                        <option value="">
                            All methods
                        </option>

                        <option value="cash">
                            Cash
                        </option>

                        <option value="bank_transfer">
                            Bank transfer
                        </option>

                        <option value="pos">
                            POS
                        </option>

                        <option value="mobile_money">
                            Mobile money
                        </option>

                        <option value="card">
                            Card
                        </option>

                        <option value="other">
                            Other
                        </option>
                    </select>

                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(event) => {
                            setDateFrom(
                                event.target
                                    .value
                            );
                            setPage(1);
                        }}
                        className="h-10 rounded-command-md border border-command-border bg-command-black px-3 text-xs text-command-white outline-none focus:border-command-green/40"
                    />

                    <input
                        type="date"
                        value={dateTo}
                        onChange={(event) => {
                            setDateTo(
                                event.target
                                    .value
                            );
                            setPage(1);
                        }}
                        className="h-10 rounded-command-md border border-command-border bg-command-black px-3 text-xs text-command-white outline-none focus:border-command-green/40"
                    />

                    {hasFilters && (
                        <button
                            type="button"
                            onClick={
                                clearFilters
                            }
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-command-md border border-command-border px-3 text-xs text-command-muted transition hover:bg-command-black hover:text-command-white"
                        >
                            <X
                                size={14}
                            />

                            Clear
                        </button>
                    )}
                </div>
            </section>

            {/* TABLE */}

            <section className="mt-5 overflow-hidden rounded-command-lg border border-command-border bg-command-surface">
                <div className="border-b border-command-border px-5 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-semibold">
                                Recent payments
                            </h2>

                            <p className="mt-1 text-xs text-command-muted">
                                {pagination.total} payment
                                {pagination.total ===
                                1
                                    ? ""
                                    : "s"}{" "}
                                recorded
                            </p>
                        </div>
                    </div>
                </div>

                {error ? (
                    <div className="p-6">
                        <p className="text-sm font-medium text-red-400">
                            Unable to load payments
                        </p>

                        <p className="mt-2 text-xs text-command-muted">
                            {error.message}
                        </p>

                        <button
                            type="button"
                            onClick={refetch}
                            className="mt-4 text-xs font-medium text-command-green"
                        >
                            Try again
                        </button>
                    </div>
                ) : (
                    <PaymentsTable
                        payments={
                            payments
                        }
                        loading={
                            loading
                        }
                    />
                )}

                {/* PAGINATION */}

                {pagination.totalPages >
                    1 && (
                    <div className="flex items-center justify-between border-t border-command-border px-5 py-4">
                        <p className="text-xs text-command-muted">
                            Page{" "}
                            {pagination.page}{" "}
                            of{" "}
                            {
                                pagination.totalPages
                            }
                        </p>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                disabled={
                                    !pagination.hasPreviousPage
                                }
                                onClick={() =>
                                    setPage(
                                        (current) =>
                                            current -
                                            1
                                    )
                                }
                                className="rounded-command-md border border-command-border px-3 py-2 text-xs text-command-muted transition hover:bg-command-black hover:text-command-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Previous
                            </button>

                            <button
                                type="button"
                                disabled={
                                    !pagination.hasNextPage
                                }
                                onClick={() =>
                                    setPage(
                                        (current) =>
                                            current +
                                            1
                                    )
                                }
                                className="rounded-command-md border border-command-border px-3 py-2 text-xs text-command-muted transition hover:bg-command-black hover:text-command-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default PaymentsPage;
