import {
    FileText,
    Search,
    X,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import useInvoices from "../../../hooks/useInvoices";

import InvoiceTable from "../../../components/invoices/InvoiceTable";

const InvoicesPage = () => {
    const [searchInput, setSearchInput] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [page, setPage] =
        useState(1);

    const {
        invoices,
        pagination,
        loading,
        error,
        refetch,
    } = useInvoices({
        page,
        limit: 20,
        search,
    });

    /*
     * Debounced search
     */
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

    /*
     * Clear search
     */
    const clearSearch = () => {
        setSearchInput("");
        setSearch("");
        setPage(1);
    };

    const hasSearch =
        Boolean(search);

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
                            Invoices
                        </h1>

                        <FileText
                            size={19}
                            className="text-command-muted"
                        />
                    </div>

                    <p className="mt-2 text-sm text-command-muted">
                        View and manage invoices generated from your orders.
                    </p>
                </div>
            </div>

            {/* SEARCH */}

            <section className="mt-8 rounded-command-lg border border-command-border bg-command-surface">
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search
                            size={15}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-command-muted"
                        />

                        <input
                            type="text"
                            value={
                                searchInput
                            }
                            onChange={(
                                event
                            ) =>
                                setSearchInput(
                                    event
                                        .target
                                        .value
                                )
                            }
                            placeholder="Search invoice, order number, or customer..."
                            className="h-10 w-full rounded-command-md border border-command-border bg-command-black pl-10 pr-10 text-sm text-command-white outline-none placeholder:text-command-muted/50 focus:border-command-green/40"
                        />

                        {searchInput && (
                            <button
                                type="button"
                                onClick={
                                    clearSearch
                                }
                                className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-command-md text-command-muted transition hover:bg-command-surface hover:text-command-white"
                                aria-label="Clear search"
                            >
                                <X
                                    size={14}
                                />
                            </button>
                        )}
                    </div>

                    {hasSearch && (
                        <button
                            type="button"
                            onClick={
                                clearSearch
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

            {/* INVOICE TABLE */}

            <section className="mt-5 overflow-hidden rounded-command-lg border border-command-border bg-command-surface">
                <div className="border-b border-command-border px-5 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-sm font-semibold">
                                Invoice history
                            </h2>

                            <p className="mt-1 text-xs text-command-muted">
                                {pagination.total} invoice
                                {pagination.total ===
                                1
                                    ? ""
                                    : "s"}{" "}
                                found
                            </p>
                        </div>
                    </div>
                </div>

                {error ? (
                    <div className="p-6">
                        <p className="text-sm font-medium text-red-400">
                            Unable to load invoices
                        </p>

                        <p className="mt-2 text-xs text-command-muted">
                            {error.message ||
                                "Something went wrong while loading invoices."}
                        </p>

                        <button
                            type="button"
                            onClick={
                                refetch
                            }
                            className="mt-4 text-xs font-medium text-command-green transition hover:text-command-green/80"
                        >
                            Try again
                        </button>
                    </div>
                ) : (
                    <InvoiceTable
                        invoices={
                            invoices
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
                            {
                                pagination.page
                            }{" "}
                            of{" "}
                            {
                                pagination.totalPages
                            }
                        </p>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                disabled={
                                    !pagination.hasPreviousPage ||
                                    loading
                                }
                                onClick={() =>
                                    setPage(
                                        (
                                            current
                                        ) =>
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
                                    !pagination.hasNextPage ||
                                    loading
                                }
                                onClick={() =>
                                    setPage(
                                        (
                                            current
                                        ) =>
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

export default InvoicesPage;
