import {
    Search,
    Plus,
    Users,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import {
    useEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';


import useCustomers from "../../../hooks/useCustomers";
import AddCustomerModal from "../../../components/customers/AddCustomerModal";
import { createCustomer } from "../../../services/customers";
import { restoreCustomer } from "../../../services/customers";



const PAGE_SIZE = 10;

const CustomersPage = () => {
    const [page, setPage] =
        useState(1);

    const [searchInput, setSearchInput] =
        useState("");

    const [search, setSearch] =
        useState("");

  const [addModalOpen, setAddModalOpen] =
        useState(false);

    const [creatingCustomer, setCreatingCustomer] =
        useState(false);

    const [createError, setCreateError] =
        useState(null);
    const [showArchived, setShowArchived] =
        useState(false);

    const [restoringCustomerId, setRestoringCustomerId] =
        useState(null);

    const [restoreError, setRestoreError] =
        useState(null);

  const {
        data,
        loading,
        error,
        refetch,
    } = useCustomers({
        page,
        limit: PAGE_SIZE,
      search,
      archived: showArchived,
    });

    const customers =
        data?.customers || [];

    const pagination =
        data?.pagination || {
            page: 1,
            limit: PAGE_SIZE,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
        };

    /*
     * Search debounce
     *
     * We don't want to send an API request
     * on every single keystroke.
     */



    useEffect(() => {
        const timeout =
            setTimeout(() => {
                setSearch(
                    searchInput.trim()
                );

                setPage(1);
            }, 350);

        return () =>
            clearTimeout(timeout);
    }, [searchInput]);

    const handlePrevious =
        () => {
            if (
                pagination.hasPreviousPage
            ) {
                setPage(
                    (current) =>
                        current - 1
                );
            }
        };


    const handleCreateCustomer =
        async (customerData) => {
            setCreatingCustomer(true);
            setCreateError(null);

            try {
                await createCustomer(
                    customerData
                );

                setAddModalOpen(false);

                await refetch();
            } catch (error) {
                setCreateError(
                    error.message ||
                        "Unable to create customer."
                );
            } finally {
                setCreatingCustomer(false);
            }
        };

    const handleRestoreCustomer = async (customerId) => {
        // Replace window.confirm with SweetAlert2
        const result = await Swal.fire({
          title: 'Restore Customer',
          text: 'Are you sure you want to restore this customer?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Confirm Restore',
          cancelButtonText: 'Abort',
          customClass: {
            popup: 'command-theme-popup',
            confirmButton: 'command-btn command-confirm-btn',
            cancelButton: 'command-btn command-cancel-btn'
          },
          buttonsStyling: false
        });


        // Check if the user clicked cancel
        if (!result.isConfirmed) {
            return;
        }

        setRestoringCustomerId(customerId);
        setRestoreError(null);

        try {
            await restoreCustomer(customerId);
            await refetch();
        } catch (error) {
            setRestoreError(error.message || "Unable to restore customer.");
        } finally {
            setRestoringCustomerId(null);
        }
    };

  const handleNext = () => {
        if (
            pagination.hasNextPage
        ) {
            setPage(
                (current) =>
                    current + 1
            );
        }
    };

    return (
        <div>
            {/* HEADER */}

            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-command-green">
                        Customer management
                    </p>

                    <h1 className="text-2xl font-semibold tracking-tight">
                        {showArchived
                            ? "Archived customers"
                            : "Customers"}
                    </h1>

                    <p className="mt-1 text-sm text-command-muted">
                        {showArchived
                            ? "Customers you've archived."
                            : "Manage your customer relationships."}
                    </p>
                </div>

                {!showArchived && (
                    <button
                        type="button"
                        onClick={() => {
                            setCreateError(null);
                            setAddModalOpen(true);
                        }}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-command-md bg-command-green px-4 text-sm font-semibold text-[#061008] transition hover:brightness-110"
                >
                    <Plus size={16} />

                    Add customer
            </button>
            )}
            </div>

            {/* SEARCH */}

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative max-w-md flex-1">
                    <Search
                        size={16}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-command-muted"
                    />

                    <input
                        type="search"
                        value={
                            searchInput
                        }
                        onChange={(event) =>
                            setSearchInput(
                                event
                                    .target
                                    .value
                            )
                        }
                        placeholder="Search customers..."
                        className="h-11 w-full rounded-command-md border border-command-border bg-command-surface pl-10 pr-4 text-sm text-command-white outline-none transition placeholder:text-command-muted/60 focus:border-command-green/40"
                    />
                </div>

                {pagination.total >
                    0 && (
                    <p className="text-xs text-command-muted">
                        {pagination.total}{" "}
                        {pagination.total ===
                        1
                            ? "customer"
                            : "customers"}
                    </p>
                )}
            </div>

            <div className="inline-flex rounded-command-md border border-command-border bg-command-surface p-1">
              <button
                  type="button"
                  onClick={() => {
                      setShowArchived(false);
                      setPage(1);
                  }}
                  className={`rounded-command-sm px-3 py-1.5 text-xs font-medium transition ${
                      !showArchived
                          ? "bg-command-green text-[#061008]"
                          : "text-command-muted hover:text-command-white"
                  }`}
              >
                  Active
              </button>

              <button
                  type="button"
                  onClick={() => {
                      setShowArchived(true);
                      setPage(1);
                  }}
                  className={`rounded-command-sm px-3 py-1.5 text-xs font-medium transition ${
                      showArchived
                          ? "bg-command-green text-[#061008]"
                          : "text-command-muted hover:text-command-white"
                  }`}
              >
                  Archived
              </button>
        </div>

            {/* ERROR */}

            {error && (
                <div className="mb-5 rounded-command-lg border border-red-500/20 bg-red-500/5 p-5">
                    <p className="text-sm font-medium text-red-400">
                        Unable to load customers
                    </p>

                    <p className="mt-1 text-xs text-command-muted">
                        {error.message ||
                            "Something went wrong."}
                    </p>
                </div>
        )}

            {createError && (
                <div className="mb-5 flex items-center justify-between rounded-command-md border border-red-500/20 bg-red-500/5 px-4 py-3">
                    <p className="text-xs text-red-400">
                        {createError}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            setCreateError(null)
                        }
                        className="text-xs text-command-muted transition hover:text-command-white"
                    >
                        Dismiss
                    </button>
                </div>
        )}

            {restoreError && (
                <div className="mb-5 flex items-center justify-between rounded-command-md border border-red-500/20 bg-red-500/5 px-4 py-3">
                    <p className="text-xs text-red-400">
                        {restoreError}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            setRestoreError(null)
                        }
                        className="text-xs text-command-muted transition hover:text-command-white"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* LOADING */}

            {loading ? (
                <div className="overflow-hidden rounded-command-lg border border-command-border bg-command-surface">
                    {/* DESKTOP */}

                    <div className="hidden divide-y divide-command-border md:block">
                        {[
                            1,
                            2,
                            3,
                            4,
                            5,
                        ].map((item) => (
                            <div
                                key={item}
                                className="h-16 animate-pulse bg-command-surface"
                            />
                        ))}
                    </div>

                    {/* MOBILE */}

                    <div className="space-y-3 p-4 md:hidden">
                        {[
                            1,
                            2,
                            3,
                        ].map((item) => (
                            <div
                                key={item}
                                className="h-28 animate-pulse rounded-command-md bg-command-black/30"
                            />
                        ))}
                    </div>
                </div>
            ) : customers.length ===
              0 ? (
                /* EMPTY STATE */

                <div className="rounded-command-lg border border-command-border bg-command-surface">
                    <div className="flex min-h-[380px] flex-col items-center justify-center px-6 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-command-lg border border-command-border bg-command-black text-command-muted">
                            <Users
                                size={22}
                                strokeWidth={1.5}
                            />
                        </div>

                        {showArchived ? (
                            <>
                                <p className="text-sm font-medium">
                                    No archived customers
                                </p>

                                <p className="mt-2 text-xs text-command-muted">
                                    Customers you archive will
                                    appear here.
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-medium">
                                    No customers yet
                                </p>

                            </>
                        )}

                        <p className="mt-2 max-w-sm text-sm leading-6 text-command-muted">
                            {search
                                ? `We couldn't find any customers matching "${search}".`
                                : "Add your first customer to start keeping track of orders, payments and outstanding balances."}
                        </p>

                        {!showArchived && !search && (
                            <button
                                type="button"
                                onClick={() => {
                                    setCreateError(null);
                                    setAddModalOpen(true);
                                }}
                                className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-command-md bg-command-green px-4 text-sm font-semibold text-[#061008] transition hover:brightness-110"
                            >
                                <Plus size={16} />

                                Add your first customer
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    {/* CUSTOMER LIST */}

                    <div className="overflow-hidden rounded-command-lg border border-command-border bg-command-surface">
                        {/* DESKTOP */}

                        <div className="hidden md:block">
                            <div className="grid grid-cols-[1.5fr_1fr_1.5fr_auto] border-b border-command-border px-5 py-3">
                                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                                    Customer
                                </span>

                                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                                    Phone
                                </span>

                                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                                    Email
                                </span>

                                <span />
                            </div>

                            {customers.map(
                                (
                                    customer
                                ) => (
                                    <div
                                        key={
                                            customer._id
                                        }
                                        className="grid grid-cols-[1.5fr_1fr_1.5fr_auto] items-center border-b border-command-border px-5 py-4 last:border-b-0 transition hover:bg-command-black/20"
                                    >
                                        <div>
                                            <p className="text-sm font-medium">
                                                {
                                                    customer.name
                                                }
                                            </p>

                                            <p className="mt-1 text-xs text-command-muted">
                                                Customer
                                            </p>
                                        </div>

                                        <p className="text-sm text-command-text">
                                            {
                                                customer.phone
                                            }
                                        </p>

                                        <p className="truncate pr-5 text-sm text-command-muted">
                                            {
                                                customer.email ||
                                                "—"
                                            }
                                        </p>

                                        {showArchived ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRestoreCustomer(
                                                        customer._id
                                                    )
                                                }
                                                disabled={
                                                    restoringCustomerId ===
                                                    customer._id
                                                }
                                                className="text-xs font-medium text-command-green transition hover:text-command-green/80 disabled:opacity-50"
                                            >
                                                {restoringCustomerId ===
                                                customer._id
                                                    ? "Restoring..."
                                                    : "Restore"}
                                            </button>
                                        ) : (
                                            <Link
                                                to={`/customers/${customer._id}`}
                                                className="text-xs font-medium text-command-green transition hover:text-command-green/80"
                                            >
                                                View
                                            </Link>
                                        )}
                                    </div>
                                )
                            )}
                        </div>

                        {/* MOBILE */}

                        <div className="divide-y divide-command-border md:hidden">
                            {customers.map(
                                (
                                    customer
                                ) => (
                                    <div
                                        key={
                                            customer._id
                                        }
                                        className="p-4"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {
                                                        customer.name
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs text-command-muted">
                                                    {
                                                        customer.phone
                                                    }
                                                </p>
                                            </div>

                                            {showArchived ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRestoreCustomer(
                                                            customer._id
                                                        )
                                                    }
                                                    disabled={
                                                        restoringCustomerId ===
                                                        customer._id
                                                    }
                                                    className="text-xs font-medium text-command-green transition hover:text-command-green/80 disabled:opacity-50"
                                                >
                                                    {restoringCustomerId ===
                                                    customer._id
                                                        ? "Restoring..."
                                                        : "Restore"}
                                                </button>
                                            ) : (
                                                <Link
                                                    to={`/customers/${customer._id}`}
                                                    className="text-xs font-medium text-command-green transition hover:text-command-green/80"
                                                >
                                                    View
                                                </Link>
                                            )}
                                        </div>

                                        {customer.email && (
                                            <p className="mt-3 truncate text-xs text-command-muted">
                                                {
                                                    customer.email
                                                }
                                            </p>
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* PAGINATION */}

                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-xs text-command-muted">
                            Showing{" "}
                            <span className="text-command-text">
                                {
                                    customers.length
                                }
                            </span>{" "}
                            of{" "}
                            <span className="text-command-text">
                                {
                                    pagination.total
                                }
                            </span>
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={
                                    handlePrevious
                                }
                                disabled={
                                    !pagination.hasPreviousPage ||
                                    loading
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-command-md border border-command-border text-command-muted transition hover:border-command-green/30 hover:text-command-white disabled:cursor-not-allowed disabled:opacity-30"
                                aria-label="Previous page"
                            >
                                <ChevronLeft
                                    size={
                                        15
                                    }
                                />
                            </button>

                            <span className="min-w-16 text-center font-mono text-[10px] text-command-muted">
                                {
                                    pagination.page
                                }{" "}
                                /{" "}
                                {
                                    pagination.totalPages
                                }
                            </span>

                            <button
                                type="button"
                                onClick={
                                    handleNext
                                }
                                disabled={
                                    !pagination.hasNextPage ||
                                    loading
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-command-md border border-command-border text-command-muted transition hover:border-command-green/30 hover:text-command-white disabled:cursor-not-allowed disabled:opacity-30"
                                aria-label="Next page"
                            >
                                <ChevronRight
                                    size={
                                        15
                                    }
                                />
                            </button>
                        </div>
                    </div>
                </>
        )}
        <AddCustomerModal
            open={addModalOpen}
            onClose={() => {
                if (!creatingCustomer) {
                    setAddModalOpen(false);
                }
            }}
            onSubmit={
                handleCreateCustomer
            }
            loading={
                creatingCustomer
            }
        />
        </div>
    );
};

export default CustomersPage;
