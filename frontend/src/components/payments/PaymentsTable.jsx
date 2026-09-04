import {
    ArrowUpRight,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import PaymentMethodBadge from "./PaymentMethodBadge";

const formatCurrency = (
    amount
) =>
    `₦${Number(
        amount || 0
    ).toLocaleString(
        undefined,
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    )}`;

const PaymentsTable = ({
    payments,
    loading,
}) => {
    if (loading) {
        return (
            <div className="divide-y divide-command-border">
                {Array.from({
                    length: 6,
                }).map((_, index) => (
                    <div
                        key={index}
                        className="grid animate-pulse grid-cols-[1.4fr_1fr_1fr_auto] gap-4 px-5 py-4"
                    >
                        <div className="h-4 rounded bg-command-black" />
                        <div className="h-4 rounded bg-command-black" />
                        <div className="h-4 rounded bg-command-black" />
                        <div className="h-4 w-24 rounded bg-command-black" />
                    </div>
                ))}
            </div>
        );
    }

    if (!payments.length) {
        return (
            <div className="px-5 py-16 text-center">
                <p className="text-sm font-medium">
                    No payments found
                </p>

                <p className="mt-2 text-xs text-command-muted">
                    Payments you record will appear here.
                </p>
            </div>
        );
  }


    return (
        <div className="overflow-x-auto">
            <div className="min-w-[760px]">
                <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_auto] gap-4 border-b border-command-border px-5 py-3">
                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                        Customer
                    </p>

                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                        Order
                    </p>

                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                        Method
                    </p>

                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                        Date
                    </p>

                    <p className="text-right font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                        Amount
                    </p>
                </div>

                <div className="divide-y divide-command-border">
                    {payments.map(
                        (payment) => (
                            <div
                                key={
                                    payment._id
                                }
                                className="grid grid-cols-[1.4fr_1fr_1fr_1fr_auto] items-center gap-4 px-5 py-4 transition hover:bg-command-black/30"
                            >
                                <div>
                                    <p className="text-sm font-medium">
                                        {payment
                                            .customer
                                            ?.name ||
                                            "Unknown customer"}
                                    </p>

                                    {payment
                                        .customer
                                        ?.phone && (
                                        <p className="mt-1 text-[10px] text-command-muted">
                                            {
                                                payment
                                                    .customer
                                                    .phone
                                            }
                                        </p>
                                    )}
                                </div>

                                {payment.orderId?.isArchived ? (
                                    <span className="inline-flex items-center gap-1 text-xs text-command-muted/50">
                                        {payment.orderId?.orderNumber}

                                        <ArrowUpRight
                                            size={12}
                                        />
                                    </span>
                                ) : (
                                    <Link
                                        to={`/orders/${payment.orderId?._id}`}
                                        className="inline-flex items-center gap-1 text-xs text-command-muted transition hover:text-command-green"
                                    >
                                        {payment.orderId?.orderNumber}

                                        <ArrowUpRight
                                            size={12}
                                        />
                                    </Link>
                                )}

                                <PaymentMethodBadge
                                    method={
                                        payment.paymentMethod
                                    }
                                />

                                <p className="text-xs text-command-muted">
                                    {new Date(
                                        payment.paymentDate
                                    ).toLocaleDateString(
                                        undefined,
                                        {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        }
                                    )}
                                </p>

                                <p className="text-right font-mono text-sm font-semibold text-command-green">
                                    {formatCurrency(
                                        payment.amount
                                    )}
                                </p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentsTable;
