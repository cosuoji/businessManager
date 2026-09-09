const formatCurrency = (value = 0) => {
    return new Intl.NumberFormat(
        "en-NG",
        {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0,
        }
    ).format(value);
};

const BreakdownRow = ({
    label,
    amount,
    orderCount,
    percentage,
}) => {
    return (
        <div className="py-4">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm text-command-white">
                        {label}
                    </p>

                    <p className="mt-1 text-xs text-command-muted">
                        {orderCount}{" "}
                        {orderCount === 1
                            ? "order"
                            : "orders"}
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-sm font-medium text-command-white">
                        {formatCurrency(
                            amount
                        )}
                    </p>

                    <p className="mt-1 font-mono text-[10px] text-command-muted">
                        {percentage}%
                    </p>
                </div>
            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-command-border">
                <div
                    className="h-full rounded-full bg-command-green transition-all duration-500"
                    style={{
                        width: `${percentage}%`,
                    }}
                />
            </div>
        </div>
    );
};

const OutstandingBreakdown = ({
    data,
}) => {
    if (!data) {
        return null;
    }

    const total =
        data.totalOutstanding || 0;

    const getPercentage = (
        amount
    ) => {
        if (total === 0) {
            return 0;
        }

        return Math.round(
            (amount / total) * 100
        );
    };

    return (
        <section className="rounded-command-lg border border-command-border bg-command-surface">
            <div className="border-b border-command-border px-5 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-command-white">
                            Outstanding breakdown
                        </p>

                        <p className="mt-1 text-xs text-command-muted">
                            Where your outstanding balance stands.
                        </p>
                    </div>

                    <span className="rounded-full border border-command-border px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-command-muted">
                        Pro
                    </span>
                </div>
            </div>

            <div className="divide-y divide-command-border px-5">
                <BreakdownRow
                    label="Overdue"
                    amount={
                        data.overdue?.amount ||
                        0
                    }
                    orderCount={
                        data.overdue?.orderCount ||
                        0
                    }
                    percentage={getPercentage(
                        data.overdue?.amount ||
                            0
                    )}
                />

                <BreakdownRow
                    label="Due soon"
                    amount={
                        data.dueSoon?.amount ||
                        0
                    }
                    orderCount={
                        data.dueSoon?.orderCount ||
                        0
                    }
                    percentage={getPercentage(
                        data.dueSoon?.amount ||
                            0
                    )}
                />

                <BreakdownRow
                    label="Not due"
                    amount={
                        data.notDue?.amount ||
                        0
                    }
                    orderCount={
                        data.notDue?.orderCount ||
                        0
                    }
                    percentage={getPercentage(
                        data.notDue?.amount ||
                            0
                    )}
                />
            </div>

            <div className="border-t border-command-border px-5 py-4">
                <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-wider text-command-muted">
                        Total outstanding
                    </p>

                    <p className="text-sm font-semibold text-command-white">
                        {formatCurrency(
                            total
                        )}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default OutstandingBreakdown;
