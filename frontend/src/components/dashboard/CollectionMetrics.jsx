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

const CollectionMetrics = ({
    collection,
    averageOrder,
}) => {
    if (
        !collection &&
        !averageOrder
    ) {
        return null;
    }

    const collectionRate =
        collection?.collectionRate;

    return (
        <section className="rounded-command-lg border border-command-border bg-command-surface">
            <div className="border-b border-command-border px-5 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-command-white">
                            Business performance
                        </p>

                        <p className="mt-1 text-xs text-command-muted">
                            How efficiently sales are being converted into cash.
                        </p>
                    </div>

                    <span className="rounded-full border border-command-border px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-command-muted">
                        Pro
                    </span>
                </div>
            </div>

            <div className="grid divide-y divide-command-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                <div className="p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-command-muted">
                        Collection rate
                    </p>

                    <p className="mt-4 text-3xl font-semibold tracking-tight text-command-white">
                        {collectionRate ===
                        null
                            ? "—"
                            : `${collectionRate}%`}
                    </p>

                    <p className="mt-2 text-xs text-command-muted">
                        {collectionRate ===
                        null
                            ? "No sales for this period"
                            : `${formatCurrency(
                                  collection?.totalPayments
                              )} collected from ${formatCurrency(
                                  collection?.totalSales
                              )} in sales`}
                    </p>
                </div>

                <div className="p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-command-muted">
                        Average order value
                    </p>

                    <p className="mt-4 text-3xl font-semibold tracking-tight text-command-white">
                        {formatCurrency(
                            averageOrder?.averageOrderValue
                        )}
                    </p>

                    <p className="mt-2 text-xs text-command-muted">
                        Based on{" "}
                        {
                            averageOrder?.orderCount
                        }{" "}
                        {averageOrder?.orderCount ===
                        1
                            ? "order"
                            : "orders"}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default CollectionMetrics;
