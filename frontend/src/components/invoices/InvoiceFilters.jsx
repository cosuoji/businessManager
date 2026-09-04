import {
    Search,
    X,
} from "lucide-react";

const InvoiceFilters = ({
    searchInput,
    setSearchInput,
    paymentStatus,
    setPaymentStatus,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    onClear,
}) => {
    const hasFilters =
        searchInput ||
        paymentStatus ||
        dateFrom ||
        dateTo;

    return (
        <section className="rounded-command-lg border border-command-border bg-command-surface">
            <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                    <Search
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-command-muted"
                    />

                    <input
                        value={searchInput}
                        onChange={(event) =>
                            setSearchInput(
                                event.target.value
                            )
                        }
                        placeholder="Search invoices or order numbers..."
                        className="h-10 w-full rounded-command-md border border-command-border bg-command-black pl-10 pr-3 text-sm text-command-white outline-none placeholder:text-command-muted/50 focus:border-command-green/40"
                    />
                </div>

                <select
                    value={paymentStatus}
                    onChange={(event) =>
                        setPaymentStatus(
                            event.target.value
                        )
                    }
                    className="h-10 rounded-command-md border border-command-border bg-command-black px-3 text-xs text-command-white outline-none focus:border-command-green/40"
                >
                    <option value="">
                        All payment statuses
                    </option>

                    <option value="unpaid">
                        Unpaid
                    </option>

                    <option value="partially_paid">
                        Partially paid
                    </option>

                    <option value="paid">
                        Paid
                    </option>
                </select>

                <input
                    type="date"
                    value={dateFrom}
                    onChange={(event) =>
                        setDateFrom(
                            event.target.value
                        )
                    }
                    className="h-10 rounded-command-md border border-command-border bg-command-black px-3 text-xs text-command-white outline-none focus:border-command-green/40"
                />

                <input
                    type="date"
                    value={dateTo}
                    onChange={(event) =>
                        setDateTo(
                            event.target.value
                        )
                    }
                    className="h-10 rounded-command-md border border-command-border bg-command-black px-3 text-xs text-command-white outline-none focus:border-command-green/40"
                />

                {hasFilters && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-command-md border border-command-border px-3 text-xs text-command-muted transition hover:bg-command-black hover:text-command-white"
                    >
                        <X size={14} />

                        Clear
                    </button>
                )}
            </div>
        </section>
    );
};

export default InvoiceFilters;
