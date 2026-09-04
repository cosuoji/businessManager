import {
    CreditCard,
  Receipt,
  Trash,
  LoaderCircle,
} from "lucide-react";

import {
    useState,
} from "react";

import PaymentMethodBadge from "./PaymentMethodBadge";

import {
    formatCurrency,
    formatPaymentDate,
} from "./paymentUtils";

import {
    downloadReceipt,
} from "../../services/receipts";

const PaymentHistory = ({
  payments = [],
  onDelete,
  deletingPaymentId,
  loading = false,
}) => {
    const [
        downloadingReceipt,
        setDownloadingReceipt,
    ] = useState(null);

    const handleDownloadReceipt = async (paymentId, receiptNumber) => {
        try {
            setDownloadingReceipt(paymentId);

            const response =
                await downloadReceipt(paymentId);

            const blob =
                response.data ||
                response;

            const url =
                window.URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `${receiptNumber}.pdf`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(
                "Unable to download receipt:",
                error
            );
        } finally {
            setDownloadingReceipt(null);
        }
    };

    return (
        <section className="rounded-command-lg border border-command-border bg-command-surface">
            <div className="flex items-center justify-between border-b border-command-border px-5 py-4">
                <div>
                    <h2 className="text-sm font-semibold">
                        Payment history
                    </h2>

                    <p className="mt-1 text-xs text-command-muted">
                        Recorded payments for this order
                    </p>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-command-md border border-command-border bg-command-black text-command-muted">
                    <Receipt
                        size={15}
                        strokeWidth={1.5}
                    />
                </div>
            </div>

            {loading ? (
                <div className="divide-y divide-command-border">
                    {[1, 2, 3].map(
                        (item) => (
                            <div
                                key={item}
                                className="flex h-20 animate-pulse items-center gap-4 px-5"
                            >
                                <div className="h-9 w-9 rounded-command-md bg-command-black" />

                                <div className="flex-1">
                                    <div className="h-3 w-32 rounded bg-command-black" />

                                    <div className="mt-2 h-2 w-24 rounded bg-command-black" />
                                </div>
                            </div>
                        )
                    )}
                </div>
            ) : payments.length === 0 ? (
                <div className="flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-command-md border border-command-border bg-command-black text-command-muted">
                        <CreditCard
                            size={18}
                            strokeWidth={1.5}
                        />
                    </div>

                    <p className="mt-4 text-sm font-medium">
                        No payments recorded
                    </p>

                    <p className="mt-1 max-w-xs text-xs leading-5 text-command-muted">
                        Payments recorded against this order will appear here.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-command-border">
                    {payments.map(
                        (payment) => {
                            const isDownloading =
                                downloadingReceipt ===
                                payment._id;

                            return (
                                <div
                                    key={
                                        payment._id
                                    }
                                    className="px-5 py-4 transition hover:bg-command-black/20"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex min-w-0 items-start gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-command-md border border-command-border bg-command-black text-command-green">
                                                <CreditCard
                                                    size={
                                                        15
                                                    }
                                                    strokeWidth={
                                                        1.5
                                                    }
                                                />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-sm font-medium">
                                                    {formatCurrency(
                                                        payment.amount
                                                    )}
                                                </p>

                                                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                                                    <PaymentMethodBadge
                                                        method={
                                                            payment.paymentMethod
                                                        }
                                                    />

                                                    <span className="text-[10px] text-command-muted">
                                                        {formatPaymentDate(
                                                            payment.paymentDate
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 items-start gap-4">
                                            <div className="hidden text-right sm:block">
                                                <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-command-muted">
                                                    Reference
                                                </p>

                                                <p className="mt-1 max-w-[140px] truncate text-xs text-command-text">
                                                    {payment.reference ||
                                                        "—"}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDownloadReceipt(
                                                      payment._id,
                                                      payment.receiptNumber,
                                                    )
                                                }
                                                disabled={
                                                    isDownloading
                                                }
                                                className="inline-flex h-8 items-center gap-1.5 rounded-command-md border border-command-border px-2.5 text-[10px] font-medium text-command-muted transition hover:border-command-green/30 hover:bg-command-black hover:text-command-green disabled:cursor-not-allowed disabled:opacity-50"
                                                title="Download receipt"
                                            >
                                                <Receipt
                                                    size={
                                                        13
                                                    }
                                                    strokeWidth={
                                                        1.5
                                                    }
                                                />

                                                {isDownloading
                                                    ? "Downloading..."
                                                    : "Receipt"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onDelete(payment._id)
                                        }
                                        disabled={
                                            deletingPaymentId ===
                                            payment._id
                                        }
                                        className="inline-flex h-8 items-center gap-1.5 rounded-command-md border border-red-500/20 px-2.5 text-[10px] font-medium text-red-400 transition hover:border-red-500/40 hover:bg-red-500/5 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                                        title="Delete payment"
                                    >
                                        {deletingPaymentId ===
                                        payment._id ? (
                                            <LoaderCircle
                                                size={13}
                                                strokeWidth={1.5}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <Trash
                                                size={13}
                                                strokeWidth={1.5}
                                            />
                                        )}

                                        {deletingPaymentId ===
                                        payment._id
                                            ? "Deleting..."
                                            : "Delete"}
                                    </button>

                                        </div>
                                    </div>

                                    {payment.notes && (
                                        <p className="mt-3 pl-12 text-xs leading-5 text-command-muted">
                                            {
                                                payment.notes
                                            }
                                        </p>
                                    )}
                                </div>
                            );
                        }
                    )}
                </div>
            )}
        </section>
    );
};

export default PaymentHistory;
