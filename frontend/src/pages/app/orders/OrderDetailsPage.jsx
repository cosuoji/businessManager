import {
    ArrowLeft,
    Archive,
    CalendarDays,
    FileText,
    CreditCard,
    UserRound,
    Pencil,
    MessageCircle,
} from "lucide-react";

import {
    useState,
} from "react";

import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import useOrder from "../../../hooks/useOrder";

import {
    updateOrder,
} from "../../../services/orders";

import Swal from "sweetalert2";

import {
    formatCurrency,
} from "../../../components/payments/paymentUtils";

import useOrderPayments from "../../../hooks/useOrderPayments";

import EditOrderModal from "./EditOrderModal";

import {
    recordPayment,
    deletePayment,
} from "../../../services/payments";

import PaymentSummary from "../../../components/payments/PaymentSummary";

import PaymentHistory from "../../../components/payments/PaymentHistory";

import RecordPaymentModal from "../../../components/payments/RecordPaymentModal";

import OrderStatusBadge from "../../../components/orders/OrderStatusBadge";

import PaymentStatusBadge from "../../../components/orders/PaymentStatusBadge";

import WhatsAppModal from "../../../components/whatsapp/WhatsAppModal";

import {
    useUsage,
} from "../../../hooks/useUsage";

const formatAmount = (amount) =>
    `₦${Number(amount || 0).toLocaleString(
        undefined,
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    )}`;

const OrderDetailsPage = () => {
    const {
        id,
    } = useParams();

    const navigate =
        useNavigate();

    const [
        paymentModalOpen,
        setPaymentModalOpen,
    ] = useState(false);

    const [
        recordingPayment,
        setRecordingPayment,
    ] = useState(false);

    const [
        paymentError,
        setPaymentError,
    ] = useState(null);

    const [
        deletingPaymentId,
        setDeletingPaymentId,
    ] = useState(null);

    const [
        paymentDeleteError,
        setPaymentDeleteError,
    ] = useState(null);

    const [
        whatsappModalOpen,
        setWhatsappModalOpen,
    ] = useState(false);

    const {
        order,
        loading,
        error,
        refetch,
    } = useOrder(id);

    const {
        payments,
        summary,
        loading: paymentsLoading,
        error: paymentsError,
        refetch: refetchPayments,
    } = useOrderPayments(id);

    const {
        usage,
    } = useUsage();

    const [
        editModalOpen,
        setEditModalOpen,
    ] = useState(false);

    const [
        updatingOrder,
        setUpdatingOrder,
    ] = useState(false);

    const [
        updateError,
        setUpdateError,
    ] = useState(null);

    const invoiceUsage =
        usage?.invoices;

    const invoiceLimitReached =
        invoiceUsage &&
        invoiceUsage.limit !== null &&
        invoiceUsage.used >=
            invoiceUsage.limit;

    const hasInvoice =
        Boolean(
            order?.invoiceNumber
        );

    const canCreateInvoice =
        hasInvoice ||
        !invoiceLimitReached;

    const handleUpdateOrder =
        async (orderData) => {
            setUpdatingOrder(true);
            setUpdateError(null);

            try {
                await updateOrder(
                    id,
                    orderData
                );

                setEditModalOpen(false);

                await Promise.all([
                    refetch(),
                    refetchPayments(),
                ]);

                await Swal.fire({
                    icon: "success",
                    title: "Order updated",
                    text: "The order has been updated successfully.",
                    timer: 1800,
                    showConfirmButton: false,
                    background: "#111111",
                    color: "#ffffff",
                });
            } catch (error) {
                setUpdateError(
                    error.message ||
                        "Unable to update order."
                );
            } finally {
                setUpdatingOrder(
                    false
                );
            }
        };

    const handleRecordPayment =
        async (paymentData) => {
            setRecordingPayment(true);
            setPaymentError(null);

            try {
                await recordPayment({
                    orderId: id,
                    ...paymentData,
                });

                setPaymentModalOpen(
                    false
                );

                await Promise.all([
                    refetchPayments(),
                    refetch(),
                ]);
            } catch (error) {
                setPaymentError(
                    error.message ||
                        "Unable to record payment."
                );
            } finally {
                setRecordingPayment(
                    false
                );
            }
        };

    const handleDeletePayment =
        async (paymentId) => {
            const payment =
                payments.find(
                    (item) =>
                        item._id ===
                        paymentId
                );

            if (!payment) {
                return;
            }

            const result =
                await Swal.fire({
                    icon: "warning",
                    title: "Delete payment?",
                    text: `This will remove ${formatCurrency(
                        payment.amount
                    )} from this order's payment history.`,
                    showCancelButton: true,
                    confirmButtonText:
                        "Delete payment",
                    cancelButtonText:
                        "Cancel",
                    confirmButtonColor:
                        "#dc2626",
                    background: "#111111",
                    color: "#ffffff",
                });

            if (!result.isConfirmed) {
                return;
            }

            setDeletingPaymentId(
                paymentId
            );

            try {
                await deletePayment(
                    paymentId
                );

                await Promise.all([
                    refetchPayments(),
                    refetch(),
                ]);

                await Swal.fire({
                    icon: "success",
                    title: "Payment deleted",
                    text: "The payment has been removed successfully.",
                    timer: 1800,
                    showConfirmButton: false,
                    background: "#111111",
                    color: "#ffffff",
                });
            } catch (error) {
                await Swal.fire({
                    icon: "error",
                    title: "Unable to delete payment",
                    text:
                        error.message ||
                        "Something went wrong.",
                    background: "#111111",
                    color: "#ffffff",
                });
            } finally {
                setDeletingPaymentId(
                    null
                );
            }
        };

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="h-4 w-28 rounded bg-command-surface" />

                <div className="mt-6 h-8 w-64 rounded bg-command-surface" />

                <div className="mt-3 h-4 w-80 rounded bg-command-surface" />

                <div className="mt-8 grid gap-5 lg:grid-cols-3">
                    <div className="h-72 rounded-command-lg border border-command-border bg-command-surface lg:col-span-2" />

                    <div className="h-72 rounded-command-lg border border-command-border bg-command-surface" />
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div>
                <Link
                    to="/orders"
                    className="inline-flex items-center gap-2 text-xs text-command-muted hover:text-command-white"
                >
                    <ArrowLeft
                        size={14}
                    />

                    Back to orders
                </Link>

                <div className="mt-8 rounded-command-lg border border-red-500/20 bg-red-500/5 p-6">
                    <p className="text-sm font-medium text-red-400">
                        Unable to load order
                    </p>

                    <p className="mt-2 text-xs text-command-muted">
                        {error?.message ||
                            "Order not found."}
                    </p>
                </div>
            </div>
        );
    }

    const totalCost =
        order.items?.reduce(
            (sum, item) =>
                sum +
                Number(
                    item.productCost ||
                        0
                ) *
                    Number(
                        item.quantity ||
                            0
                    ),
            0
        ) || 0;

    const estimatedProfit =
        Number(
            order.total || 0
        ) -
        totalCost;

    return (
        <div>
            <Link
                to="/orders"
                className="inline-flex items-center gap-2 text-xs text-command-muted transition hover:text-command-white"
            >
                <ArrowLeft
                    size={14}
                />

                Back to orders
            </Link>

            {/* HEADER */}

            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-command-green">
                        Order
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-3">
                        <h1 className="font-mono text-2xl font-semibold tracking-tight">
                            {
                                order.orderNumber
                            }
                        </h1>

                        <OrderStatusBadge
                            status={
                                order.status
                            }
                        />
                    </div>

                    <p className="mt-2 text-sm text-command-muted">
                        Created{" "}
                        {new Date(
                            order.createdAt
                        ).toLocaleDateString(
                            undefined,
                            {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            }
                        )}
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            setUpdateError(
                                null
                            );

                            setEditModalOpen(
                                true
                            );
                        }}
                        className="inline-flex h-10 items-center gap-2 rounded-command-md border border-command-border px-4 text-sm text-command-muted transition hover:border-command-green/30 hover:text-command-green"
                    >
                        Edit order
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            const confirmed =
                                window.confirm(
                                    "Archive this order?"
                                );

                            if (!confirmed) {
                                return;
                            }

                            // Archive logic
                        }}
                        className="inline-flex h-10 items-center gap-2 rounded-command-md border border-command-border px-4 text-sm text-command-muted transition hover:border-red-500/30 hover:text-red-400"
                    >
                        <Archive
                            size={15}
                        />

                        Archive
                    </button>
                </div>
            </div>

            {/* SUMMARY */}

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
                <section className="rounded-command-lg border border-command-border bg-command-surface lg:col-span-2">
                    <div className="border-b border-command-border px-5 py-4">
                        <h2 className="text-sm font-semibold">
                            Order items
                        </h2>
                    </div>

                    <div className="divide-y divide-command-border">
                        {order.items.map(
                            (item) => (
                                <div
                                    key={
                                        item._id
                                    }
                                    className="grid grid-cols-[1fr_auto] gap-4 px-5 py-4"
                                >
                                    <div>
                                        <p className="text-sm font-medium">
                                            {
                                                item.name
                                            }
                                        </p>

                                        <p className="mt-1 text-xs text-command-muted">
                                            {
                                                item.quantity
                                            }{" "}
                                            ×{" "}
                                            {formatAmount(
                                                item.sellingPrice
                                            )}
                                        </p>
                                    </div>

                                    <p className="font-mono text-sm">
                                        {formatAmount(
                                            item.total
                                        )}
                                    </p>
                                </div>
                            )
                        )}
                    </div>

                    <div className="border-t border-command-border p-5">
                        <div className="ml-auto max-w-xs space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-command-muted">
                                    Subtotal
                                </span>

                                <span className="font-mono">
                                    {formatAmount(
                                        order.subtotal
                                    )}
                                </span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-command-muted">
                                    Discount
                                </span>

                                <span className="font-mono">
                                    -
                                    {formatAmount(
                                        order.discount
                                    )}
                                </span>
                            </div>

                            <div className="border-t border-command-border pt-3">
                                <div className="flex justify-between">
                                    <span className="font-medium">
                                        Total
                                    </span>

                                    <span className="font-mono text-lg font-semibold text-command-green">
                                        {formatAmount(
                                            order.total
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CUSTOMER */}

                <section className="rounded-command-lg border border-command-border bg-command-surface">
                    <div className="border-b border-command-border px-5 py-4">
                        <h2 className="text-sm font-semibold">
                            Customer
                        </h2>
                    </div>

                    <div className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-command-md border border-command-border bg-command-black text-command-green">
                                <UserRound
                                    size={17}
                                />
                            </div>

                            <div>
                                <p className="text-sm font-medium">
                                    {
                                        order
                                            .customerId
                                            ?.name
                                    }
                                </p>

                                <p className="mt-1 text-xs text-command-muted">
                                    {
                                        order
                                            .customerId
                                            ?.phone
                                    }
                                </p>
                            </div>
                        </div>

                        {order.customerId
                            ?.email && (
                            <p className="mt-5 text-xs text-command-muted">
                                {
                                    order
                                        .customerId
                                        .email
                                }
                            </p>
                        )}

                        <Link
                            to={`/customers/${order.customerId?._id}`}
                            className="mt-5 block text-xs font-medium text-command-green hover:text-command-green/80"
                        >
                            View customer
                        </Link>
                    </div>
                </section>
            </div>

            {/* FINANCIAL */}

            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-command-lg border border-command-border bg-command-surface p-5">
                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                        Order total
                    </p>

                    <p className="mt-2 text-xl font-semibold">
                        {formatAmount(
                            order.total
                        )}
                    </p>
                </div>

                <div className="rounded-command-lg border border-command-border bg-command-surface p-5">
                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                        Payment status
                    </p>

                    <div className="mt-3">
                        <PaymentStatusBadge
                            status={
                                order.paymentStatus
                            }
                        />
                    </div>
                </div>

                <div className="rounded-command-lg border border-command-border bg-command-surface p-5">
                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                        Estimated profit
                    </p>

                    <p className="mt-2 text-xl font-semibold text-command-green">
                        {formatAmount(
                            estimatedProfit
                        )}
                    </p>
                </div>

                <div className="rounded-command-lg border border-command-border bg-command-surface p-5">
                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                        Due date
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                        <CalendarDays
                            size={15}
                            className="text-command-muted"
                        />

                        <p className="text-sm">
                            {order.dueDate
                                ? new Date(
                                      order.dueDate
                                  ).toLocaleDateString(
                                      undefined,
                                      {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                      }
                                  )
                                : "No due date"}
                        </p>
                    </div>
                </div>
            </div>

            {/* PAYMENTS */}

            <section className="mt-5">
                <PaymentSummary
                    summary={summary}
                    loading={
                        paymentsLoading
                    }
                    onRecordPayment={() =>
                        setPaymentModalOpen(
                            true
                        )
                    }
                />

                <div className="mt-5">
                    <PaymentHistory
                        payments={
                            payments
                        }
                        loading={
                            paymentsLoading
                        }
                        onDelete={
                            handleDeletePayment
                        }
                        deletingPaymentId={
                            deletingPaymentId
                        }
                    />
                </div>
            </section>

            {/* ORDER ACTIONS */}

            <section className="mt-5 rounded-command-lg border border-command-border bg-command-surface">
                <div className="border-b border-command-border px-5 py-4">
                    <h2 className="text-sm font-semibold">
                        Order actions
                    </h2>

                    <p className="mt-1 text-xs text-command-muted">
                        Financial and customer communication tools.
                    </p>
                </div>

                <div className="grid gap-3 p-5 sm:grid-cols-3 lg:grid-cols-3">

                    {/* INVOICE */}

                    {canCreateInvoice ? (
                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/orders/${id}/invoice`
                                )
                            }
                            disabled={
                                order.status ===
                                "cancelled"
                            }
                            className="flex items-center gap-3 rounded-command-md border border-command-border p-4 text-left transition hover:border-command-green/30 hover:bg-command-black/40 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <FileText
                                size={17}
                                className="text-command-green"
                            />

                            <div className="min-w-0">
                                <p className="text-xs font-medium">
                                    Invoice
                                </p>

                                <p className="mt-1 text-[10px] text-command-muted">
                                    {order.status ===
                                    "cancelled"
                                        ? "Unavailable for cancelled order"
                                        : hasInvoice
                                        ? "View and download invoice"
                                        : "Create and download invoice"}
                                </p>

                                {hasInvoice &&
                                    order.invoiceNumber && (
                                        <p className="mt-1 font-mono text-[9px] text-command-green">
                                            {
                                                order.invoiceNumber
                                            }
                                        </p>
                                    )}
                            </div>
                        </button>
                    ) : (
                        <Link
                            to="/pricing"
                            className="flex items-center gap-3 rounded-command-md border border-red-400/20 bg-red-400/[0.03] p-4 text-left transition hover:border-red-400/30 hover:bg-red-400/[0.06]"
                        >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-command-sm border border-red-400/20 bg-red-400/10 text-red-400">
                                <FileText
                                    size={15}
                                />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs font-medium text-command-white">
                                    Invoice
                                </p>

                                <p className="mt-1 text-[10px] text-red-400">
                                    Monthly limit reached
                                </p>

                                <p className="mt-1 text-[10px] text-command-muted">
                                    {invoiceUsage.used}{" "}
                                    /{" "}
                                    {
                                        invoiceUsage.limit
                                    }{" "}
                                    invoices used
                                </p>

                                <p className="mt-2 text-[10px] font-medium text-command-green">
                                    Upgrade to Pro →
                                </p>
                            </div>
                        </Link>
                    )}

                    {/* RECORD PAYMENT */}

                    <button
                        type="button"
                        onClick={() =>
                            setPaymentModalOpen(
                                true
                            )
                        }
                        disabled={
                            paymentsLoading ||
                            summary?.balance <=
                                0 ||
                            order.status ===
                                "cancelled"
                        }
                        className="flex items-center gap-3 rounded-command-md border border-command-border p-4 text-left transition hover:border-command-green/30 hover:bg-command-black/40 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <CreditCard
                            size={17}
                            className="text-command-green"
                        />

                        <div>
                            <p className="text-xs font-medium">
                                Record payment
                            </p>

                            <p className="mt-1 text-[10px] text-command-muted">
                                {summary?.balance <=
                                0
                                    ? "Order fully paid"
                                    : order.status ===
                                      "cancelled"
                                    ? "Cancelled order"
                                    : "Add a payment"}
                            </p>
                        </div>
                    </button>

                    {/* WHATSAPP */}

                    <button
                        type="button"
                        onClick={() =>
                            setWhatsappModalOpen(
                                true
                            )
                        }
                        disabled={
                            order.status ===
                            "cancelled"
                        }
                        className="flex items-center gap-3 rounded-command-md border border-command-border p-4 text-left transition hover:border-command-green/30 hover:bg-command-black/40 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <MessageCircle
                            size={17}
                            className="text-command-green"
                        />

                        <div>
                            <p className="text-xs font-medium">
                                WhatsApp
                            </p>

                            <p className="mt-1 text-[10px] text-command-muted">
                                Send invoice or payment reminder
                            </p>
                        </div>
                    </button>
                </div>
            </section>

            <RecordPaymentModal
                open={
                    paymentModalOpen
                }
                onClose={() => {
                    if (
                        !recordingPayment
                    ) {
                        setPaymentModalOpen(
                            false
                        );

                        setPaymentError(
                            null
                        );
                    }
                }}
                onSubmit={
                    handleRecordPayment
                }
                loading={
                    recordingPayment
                }
                balance={
                    summary?.balance ||
                    0
                }
            />

            <EditOrderModal
                open={
                    editModalOpen
                }
                order={order}
                onClose={() => {
                    if (
                        !updatingOrder
                    ) {
                        setEditModalOpen(
                            false
                        );

                        setUpdateError(
                            null
                        );
                    }
                }}
                onSubmit={
                    handleUpdateOrder
                }
                loading={
                    updatingOrder
                }
                error={
                    updateError
                }
            />

            <WhatsAppModal
                open={
                    whatsappModalOpen
                }
                onClose={() =>
                    setWhatsappModalOpen(
                        false
                    )
                }
                orderId={id}
                order={{
                    ...order,
                    balance:
                        summary?.balance ||
                        0,
                }}
            />
        </div>
    );
};

export default OrderDetailsPage;
