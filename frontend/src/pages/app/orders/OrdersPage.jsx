import {
    Archive,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    Plus,
  Search,
  Eye
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import useOrders from "../../../hooks/useOrders";
import Swal from 'sweetalert2';

import {
    archiveOrder,
    createOrder,
    restoreOrder,
} from "../../../services/orders";
import useCustomers from "../../../hooks/useCustomers";

import AddOrderModal from "../../../components/orders/AddOrderModal";
import OrderStatusBadge from "../../../components/orders/OrderStatusBadge";
import PaymentStatusBadge from "../../../components/orders/PaymentStatusBadge";
import OrderFilters from "../../../components/orders/OrderFilters";

const PAGE_SIZE = 10;

const formatAmount = (amount) =>
    `₦${Number(amount || 0).toLocaleString(
        undefined,
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    )}`;

const OrdersPage = () => {
    const [page, setPage] =
        useState(1);

    const [searchInput, setSearchInput] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [status, setStatus] =
        useState("");

    const [paymentStatus, setPaymentStatus] =
        useState("");

    const [showArchived, setShowArchived] =
        useState(false);

    const [addModalOpen, setAddModalOpen] =
        useState(false);

    const [creatingOrder, setCreatingOrder] =
        useState(false);

    const [createError, setCreateError] =
        useState(null);

    const [actionError, setActionError] =
        useState(null);

    const [processingOrderId, setProcessingOrderId] =
        useState(null);

    const {
        data: customerData,
    } = useCustomers({
        page: 1,
        limit: 100,
    });

  const {
        data,
        loading,
        error,
        refetch,
    } = useOrders({
        page,
        limit: PAGE_SIZE,
        search,
        status,
        paymentStatus,
        archived: showArchived,
    });

    const orders =
        data?.orders || [];

    const pagination =
        data?.pagination || {
            page: 1,
            limit: PAGE_SIZE,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
        };

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

    const handleCreateOrder =
        async (orderData) => {
            setCreatingOrder(true);
            setCreateError(null);

            try {
                await createOrder(
                    orderData
                );

                setAddModalOpen(false);

                await refetch();
            } catch (error) {
                setCreateError(
                    error.message ||
                        "Unable to create order."
                );
            } finally {
                setCreatingOrder(false);
            }
        };

    const handleArchive = async (
        orderId,
        orderNumber
    ) => {
      const result = await Swal.fire({
        title: 'Archive Order',
        text: `Archive ${orderNumber}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirm Archive',
        cancelButtonText: 'Abort',
        customClass: {
          popup: 'command-theme-popup',
          confirmButton: 'command-btn command-confirm-btn',
          cancelButton: 'command-btn command-cancel-btn'
        },
        buttonsStyling: false
      });

        if (!result.isConfirmed) {
            return;
        }

        setProcessingOrderId(
            orderId
        );

        setActionError(null);

        try {
            await archiveOrder(
                orderId
            );

            await refetch();
        } catch (error) {
            setActionError(
                error.message ||
                    "Unable to archive order."
            );
        } finally {
            setProcessingOrderId(null);
        }
    };

    const handleRestore = async (
        orderId
    ) => {
      const result = await Swal.fire({
        title: 'Restore Order',
        text: 'Are you sure you want to restore this order?',
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

        if (!result.isConfirmed) {
            return;
        }

        setProcessingOrderId(
            orderId
        );

        setActionError(null);

        try {
            await restoreOrder(
                orderId
            );

            await refetch();
        } catch (error) {
            setActionError(
                error.message ||
                    "Unable to restore order."
            );
        } finally {
            setProcessingOrderId(null);
        }
    };

    const clearFilters = () => {
        setSearchInput("");
        setSearch("");
        setStatus("");
        setPaymentStatus("");
        setPage(1);
    };

    const disableLink = (order) => {
        const handleClick = (e) => {
            if (order.isArchived) {
                e.preventDefault();
            }
        };
        return handleClick;
    };

    return (
        <div>
            {/* HEADER */}

            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-command-green">
                        Order management
                    </p>

                    <h1 className="text-2xl font-semibold tracking-tight">
                        {showArchived
                            ? "Archived orders"
                            : "Orders"}
                    </h1>

                    <p className="mt-1 text-sm text-command-muted">
                        {showArchived
                            ? "Orders you've archived."
                            : "Create and manage your customer orders."}
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
                        New order
                    </button>
                )}
            </div>

            {/* TABS */}

            <div className="mb-5 inline-flex rounded-command-md border border-command-border bg-command-surface p-1">
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

            {/* SEARCH / FILTERS */}

            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
                                event.target.value
                            )
                        }
                        placeholder="Search order number..."
                        className="h-11 w-full rounded-command-md border border-command-border bg-command-surface pl-10 pr-4 text-sm text-command-white outline-none transition placeholder:text-command-muted/60 focus:border-command-green/40"
                    />
                </div>

                <OrderFilters
                    status={status}
                    paymentStatus={
                        paymentStatus
                    }
                    onStatusChange={(
                        value
                    ) => {
                        setStatus(value);
                        setPage(1);
                    }}
                    onPaymentStatusChange={(
                        value
                    ) => {
                        setPaymentStatus(
                            value
                        );
                        setPage(1);
                    }}
                />
            </div>

            {/* ERRORS */}

            {(error ||
                createError ||
                actionError) && (
                <div className="mb-5 rounded-command-md border border-red-500/20 bg-red-500/5 px-4 py-3">
                    <p className="text-xs text-red-400">
                        {createError ||
                            actionError ||
                            error?.message ||
                            "Something went wrong."}
                    </p>
                </div>
            )}

            {/* COUNT */}

            {!loading &&
                pagination.total >
                    0 && (
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs text-command-muted">
                            {pagination.total}{" "}
                            {pagination.total ===
                            1
                                ? "order"
                                : "orders"}
                        </p>

                        {(search ||
                            status ||
                            paymentStatus) && (
                            <button
                                type="button"
                                onClick={
                                    clearFilters
                                }
                                className="text-xs text-command-green hover:text-command-green/80"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                )}

            {/* CONTENT */}

            {loading ? (
                <div className="overflow-hidden rounded-command-lg border border-command-border bg-command-surface">
                    <div className="divide-y divide-command-border">
                        {[1, 2, 3, 4, 5].map(
                            (item) => (
                                <div
                                    key={item}
                                    className="h-20 animate-pulse bg-command-surface"
                                />
                            )
                        )}
                    </div>
                </div>
            ) : orders.length === 0 ? (
                <div className="rounded-command-lg border border-command-border bg-command-surface">
                    <div className="flex min-h-[380px] flex-col items-center justify-center px-6 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-command-lg border border-command-border bg-command-black text-command-muted">
                            {showArchived ? (
                                <Archive size={22} />
                            ) : (
                                <ClipboardList size={22} />
                            )}
                        </div>

                        <p className="mt-5 text-sm font-medium">
                            {search ||
                            status ||
                            paymentStatus
                                ? "No matching orders"
                                : showArchived
                                ? "No archived orders"
                                : "No orders yet"}
                        </p>

                        <p className="mt-2 max-w-sm text-sm leading-6 text-command-muted">
                            {search ||
                            status ||
                            paymentStatus
                                ? "Try changing your search or filters."
                                : showArchived
                                ? "Orders you archive will appear here."
                                : "Create your first order to start tracking sales, payments and outstanding balances."}
                        </p>

                        {!showArchived &&
                            !search &&
                            !status &&
                            !paymentStatus && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setAddModalOpen(
                                            true
                                        )
                                    }
                                    className="mt-6 inline-flex h-10 items-center gap-2 rounded-command-md bg-command-green px-4 text-sm font-semibold text-[#061008]"
                                >
                                    <Plus size={16} />
                                    Create your first order
                                </button>
                            )}
                    </div>
                </div>
            ) : (
                <>
                    {/* DESKTOP */}

                    <div className="hidden overflow-hidden rounded-command-lg border border-command-border bg-command-surface md:block">
                        <div className="grid grid-cols-[1.1fr_1.5fr_1fr_1fr_1fr_auto] border-b border-command-border px-5 py-3">
                            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                                Order
                            </span>

                            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                                Customer
                            </span>

                            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                                Total
                            </span>

                            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                                Status
                            </span>

                            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                                Payment
                            </span>

                            <span />
                        </div>

                        {orders.map(
                            (order) => (
                                <div
                                    key={
                                        order._id
                                    }
                                    className="grid grid-cols-[1.1fr_1.5fr_1fr_1fr_1fr_auto] items-center border-b border-command-border px-5 py-4 last:border-b-0 transition hover:bg-command-black/20"
                                >
                                    <Link
                                        to={`/orders/${order._id}`}
                                        style={{ pointerEvents: order.isArchived ? "none" : "auto" }}
                                        className="font-mono text-xs text-command-green hover:text-command-green/80"
                                    >
                                        {
                                            order.orderNumber
                                        }
                                    </Link>

                                    <div>
                                        <p className="text-sm font-medium">
                                            {
                                                order
                                                    .customerId
                                                    ?.name ||
                                                "Unknown customer"
                                            }
                                        </p>

                                        <p className="mt-1 text-xs text-command-muted">
                                            {
                                                order
                                                    .customerId
                                                    ?.phone ||
                                                "—"
                                            }
                                        </p>
                                    </div>

                                    <p className="font-mono text-sm">
                                        {formatAmount(
                                            order.total
                                        )}
                                    </p>

                                    <OrderStatusBadge
                                        status={
                                            order.status
                                        }
                                    />

                                    <PaymentStatusBadge
                                        status={
                                            order.paymentStatus
                                        }
                                    />

                                    {showArchived ? (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRestore(
                                                    order._id
                                                )
                                            }
                                            disabled={
                                                processingOrderId ===
                                                order._id
                                            }
                                            className="text-xs font-medium text-command-green hover:text-command-green/80 disabled:opacity-50"
                                        >
                                            {processingOrderId ===
                                            order._id
                                                ? "Restoring..."
                                                : "Restore"}
                                        </button>
                                    ) : (
                                        <div className="flex items-center justify-end gap-3">
                                            <Link
                                                to={`/orders/${order._id}`}
                                                className="text-command-muted pl-5"
                                            >
                                              <Eye size={16} />
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleArchive(
                                                        order._id,
                                                        order.orderNumber
                                                    )
                                                }
                                                disabled={
                                                    processingOrderId ===
                                                    order._id
                                                }
                                                className="text-command-muted transition hover:text-red-400 disabled:opacity-50"
                                                aria-label="Archive order"
                                            >
                                                <Archive
                                                    size={
                                                        14
                                                    }
                                                />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )
                        )}
                    </div>

                    {/* MOBILE */}

                    <div className="space-y-3 md:hidden">
                        {orders.map(
                            (order) => (
                                <div
                                    key={
                                        order._id
                                    }
                                    className="rounded-command-lg border border-command-border bg-command-surface p-4"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <Link
                                                to={`/orders/${order._id}`}

                                                className="font-mono text-xs text-command-green"
                                            >
                                                {
                                                    order.orderNumber
                                                }
                                            </Link>

                                            <p className="mt-2 text-sm font-medium">
                                                {
                                                    order
                                                        .customerId
                                                        ?.name ||
                                                    "Unknown customer"
                                                }
                                            </p>

                                            <p className="mt-1 text-xs text-command-muted">
                                                {
                                                    order
                                                        .customerId
                                                        ?.phone ||
                                                    "—"
                                                }
                                            </p>
                                        </div>

                                        <p className="font-mono text-sm text-command-white">
                                            {formatAmount(
                                                order.total
                                            )}
                                        </p>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <OrderStatusBadge
                                            status={
                                                order.status
                                            }
                                        />

                                        <PaymentStatusBadge
                                            status={
                                                order.paymentStatus
                                            }
                                        />
                                    </div>

                                    <div className="mt-4 flex items-center justify-between border-t border-command-border pt-3">
                                        <Link
                                            to={`/orders/${order._id}`}
                                            className="text-xs font-medium text-command-green"
                                        >
                                            View order
                                        </Link>

                                        {showArchived ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRestore(
                                                        order._id
                                                    )
                                                }
                                                disabled={
                                                    processingOrderId ===
                                                    order._id
                                                }
                                                className="text-xs font-medium text-command-green disabled:opacity-50"
                                            >
                                                {processingOrderId ===
                                                order._id
                                                    ? "Restoring..."
                                                    : "Restore"}
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleArchive(
                                                        order._id,
                                                        order.orderNumber
                                                    )
                                                }
                                                className="text-xs text-command-muted hover:text-red-400"
                                            >
                                                Archive
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    {/* PAGINATION */}

                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-xs text-command-muted">
                            Showing{" "}
                            <span className="text-command-text">
                                {
                                    orders.length
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
                                onClick={() =>
                                    pagination.hasPreviousPage &&
                                    setPage(
                                        (current) =>
                                            current -
                                            1
                                    )
                                }
                                disabled={
                                    !pagination.hasPreviousPage ||
                                    loading
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-command-md border border-command-border text-command-muted transition hover:border-command-green/30 hover:text-command-white disabled:cursor-not-allowed disabled:opacity-30"
                                aria-label="Previous page"
                            >
                                <ChevronLeft size={15} />
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
                                onClick={() =>
                                    pagination.hasNextPage &&
                                    setPage(
                                        (current) =>
                                            current +
                                            1
                                    )
                                }
                                disabled={
                                    !pagination.hasNextPage ||
                                    loading
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-command-md border border-command-border text-command-muted transition hover:border-command-green/30 hover:text-command-white disabled:cursor-not-allowed disabled:opacity-30"
                                aria-label="Next page"
                            >
                                <ChevronRight size={15} />
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* CREATE MODAL */}

            <AddOrderModal
                open={addModalOpen}
                onClose={() => {
                    if (!creatingOrder) {
                        setAddModalOpen(false);
                    }
                }}
                onSubmit={
                    handleCreateOrder
                }
                loading={
                    creatingOrder
                }
                customers={
                    customerData?.customers || []
                }
            />
        </div>
    );
};

export default OrdersPage;
