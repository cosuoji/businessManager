import {
    CircleDollarSign,
    CreditCard,
    TrendingUp,
} from "lucide-react";

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

const PaymentStats = ({
    stats,
    loading = false,
}) => {
    const items = [
        {
            label: "Total collected",
            value: formatCurrency(
                stats?.totalCollected
            ),
            icon: CircleDollarSign,
            accent: true,
        },
        {
            label: "Payments recorded",
            value:
                stats?.paymentCount ||
                0,
            icon: CreditCard,
        },
        {
            label: "Average payment",
            value: formatCurrency(
                stats?.averagePayment
            ),
            icon: TrendingUp,
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-3">
            {items.map(
                ({
                    label,
                    value,
                    icon: Icon,
                    accent,
                }) => (
                    <div
                        key={label}
                        className="rounded-command-lg border border-command-border bg-command-surface p-5"
                    >
                        <div className="flex items-center justify-between">
                            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                                {label}
                            </p>

                            <Icon
                                size={15}
                                className={
                                    accent
                                        ? "text-command-green"
                                        : "text-command-muted"
                                }
                            />
                        </div>

                        {loading ? (
                            <div className="mt-3 h-7 w-28 animate-pulse rounded bg-command-black" />
                        ) : (
                            <p
                                className={`mt-3 text-xl font-semibold ${
                                    accent
                                        ? "text-command-green"
                                        : ""
                                }`}
                            >
                                {value}
                            </p>
                        )}
                    </div>
                )
            )}
        </div>
    );
};

export default PaymentStats;
