import {
    CheckCircle2,
    CircleDollarSign,
    Clock3,
    CreditCard,
} from "lucide-react";

import {
    formatCurrency,
} from "./paymentUtils";

const PaymentSummary = ({
    summary,
    loading = false,
    onRecordPayment,
}) => {
    const {
        orderTotal = 0,
        totalPaid = 0,
        balance = 0,
        paymentStatus = "unpaid",
    } = summary || {};

    const progress =
        orderTotal > 0
            ? Math.min(
                  (totalPaid / orderTotal) * 100,
                  100
              )
            : 0;

    const statusConfig = {
        unpaid: {
            label: "Unpaid",
            icon: Clock3,
            className:
                "text-command-muted",
        },

        partially_paid: {
            label: "Partially paid",
            icon: CircleDollarSign,
            className:
                "text-amber-400",
        },

        paid: {
            label: "Paid",
            icon: CheckCircle2,
            className:
                "text-command-green",
        },
    };

    const config =
        statusConfig[paymentStatus] ||
        statusConfig.unpaid;

    const StatusIcon = config.icon;

    if (loading) {
        return (
            <section className="rounded-command-lg border border-command-border bg-command-surface">
                <div className="border-b border-command-border px-5 py-4">
                    <div className="h-4 w-32 animate-pulse rounded bg-command-black" />

                    <div className="mt-2 h-3 w-48 animate-pulse rounded bg-command-black" />
                </div>

                <div className="p-5">
                    <div className="grid gap-4 sm:grid-cols-3">
                        {[1, 2, 3].map((item) => (
                            <div key={item}>
                                <div className="h-3 w-20 animate-pulse rounded bg-command-black" />

                                <div className="mt-2 h-6 w-28 animate-pulse rounded bg-command-black" />
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 h-2 animate-pulse rounded-full bg-command-black" />
                </div>
            </section>
        );
    }

    return (
        <section className="rounded-command-lg border border-command-border bg-command-surface">
            <div className="border-b border-command-border px-5 py-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-sm font-semibold">
                            Payment summary
                        </h2>

                        <p className="mt-1 text-xs text-command-muted">
                            Current payment position
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div
                            className={`flex items-center gap-1.5 text-xs font-medium ${config.className}`}
                        >
                            <StatusIcon
                                size={14}
                                strokeWidth={1.5}
                            />

                            {config.label}
                        </div>

                        {onRecordPayment &&
                            balance > 0 && (
                                <button
                                    type="button"
                                    onClick={
                                        onRecordPayment
                                    }
                                    className="inline-flex h-9 items-center gap-2 rounded-command-md bg-command-green px-3.5 text-xs font-semibold text-[#061008] transition hover:brightness-110"
                                >
                                    <CreditCard
                                        size={14}
                                    />

                                    Record payment
                                </button>
                            )}
                    </div>
                </div>
            </div>

            <div className="p-5">
                <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                        <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                            Order total
                        </p>

                        <p className="mt-2 text-lg font-semibold">
                            {formatCurrency(
                                orderTotal
                            )}
                        </p>
                    </div>

                    <div>
                        <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                            Total paid
                        </p>

                        <p className="mt-2 text-lg font-semibold text-command-green">
                            {formatCurrency(
                                totalPaid
                            )}
                        </p>
                    </div>

                    <div>
                        <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                            Balance
                        </p>

                        <p
                            className={`mt-2 text-lg font-semibold ${
                                balance > 0
                                    ? "text-command-white"
                                    : "text-command-green"
                            }`}
                        >
                            {formatCurrency(
                                balance
                            )}
                        </p>
                    </div>
                </div>

                <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-[10px] text-command-muted">
                            Payment progress
                        </span>

                        <span className="font-mono text-[10px] text-command-muted">
                            {Math.round(
                                progress
                            )}
                            %
                        </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-command-black">
                        <div
                            className="h-full rounded-full bg-command-green transition-all duration-500"
                            style={{
                                width: `${progress}%`,
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PaymentSummary;
