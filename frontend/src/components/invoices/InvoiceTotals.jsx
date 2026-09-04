import {
    CheckCircle2,
    CircleDollarSign,
} from "lucide-react";

const formatCurrency = (
    amount,
    currency = "NGN"
) => {
    return new Intl.NumberFormat(
        undefined,
        {
            style: "currency",
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    ).format(Number(amount || 0));
};

const InvoiceTotals = ({
    invoice,
}) => {
    if (!invoice) {
        return null;
    }

    const {
        subtotal = 0,
        discount = 0,
        total = 0,
        totalPaid = 0,
        balance = 0,
        paymentStatus = "unpaid",
        currency = "NGN",
    } = invoice;

    const statusConfig = {
        unpaid: {
            label: "Unpaid",
            className:
                "text-command-muted",
        },

        partially_paid: {
            label: "Partially paid",
            className:
                "text-amber-400",
        },

        paid: {
            label: "Paid",
            className:
                "text-command-green",
        },
    };

    const config =
        statusConfig[paymentStatus] ||
        statusConfig.unpaid;

    return (
        <div className="border-t border-command-border px-5 py-6 sm:px-8 sm:py-7">
            <div className="ml-auto max-w-sm">
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-command-muted">
                            Subtotal
                        </span>

                        <span className="font-mono">
                            {formatCurrency(
                                subtotal,
                                currency
                            )}
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-command-muted">
                            Discount
                        </span>

                        <span className="font-mono">
                            -
                            {formatCurrency(
                                discount,
                                currency
                            )}
                        </span>
                    </div>

                    <div className="border-t border-command-border pt-3">
                        <div className="flex items-center justify-between">
                            <span className="font-medium">
                                Total
                            </span>

                            <span className="font-mono text-lg font-semibold text-command-green">
                                {formatCurrency(
                                    total,
                                    currency
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 rounded-command-md border border-command-border bg-command-black/40 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CircleDollarSign
                                size={15}
                                className={
                                    config.className
                                }
                            />

                            <span className="text-xs text-command-muted">
                                Payment status
                            </span>
                        </div>

                        <span
                            className={`text-xs font-medium ${config.className}`}
                        >
                            {config.label}
                        </span>
                    </div>

                    <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-command-muted">
                                Total paid
                            </span>

                            <span className="font-mono text-command-green">
                                {formatCurrency(
                                    totalPaid,
                                    currency
                                )}
                            </span>
                        </div>

                        <div className="flex items-center justify-between border-t border-command-border pt-3">
                            <span className="font-medium">
                                Balance
                            </span>

                            <span
                                className={`font-mono font-semibold ${
                                    balance > 0
                                        ? "text-command-white"
                                        : "text-command-green"
                                }`}
                            >
                                {formatCurrency(
                                    balance,
                                    currency
                                )}
                            </span>
                        </div>
                    </div>

                    {paymentStatus ===
                        "paid" && (
                        <div className="mt-4 flex items-center gap-2 text-xs text-command-green">
                            <CheckCircle2
                                size={14}
                            />

                            Payment complete
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvoiceTotals;
