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

const TopCustomers = ({
    customers = [],
}) => {
    return (
        <section className="rounded-command-lg border border-command-border bg-command-surface">
            <div className="border-b border-command-border px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-command-white">
                            Top customers
                        </p>

                        <p className="mt-1 text-xs text-command-muted">
                            Customers generating the most sales.
                        </p>
                    </div>

                    <span className="rounded-full border border-command-border px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-command-muted">
                        Pro
                    </span>
                </div>
            </div>

            {customers.length === 0 ? (
                <div className="px-5 py-10 text-center">
                    <p className="text-xs text-command-muted">
                        No customer sales for this period.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-command-border">
                    {customers.map(
                        (
                            customer,
                            index
                        ) => (
                            <div
                                key={
                                    customer.customerId
                                }
                                className="flex items-center gap-4 px-5 py-4"
                            >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-command-sm border border-command-border font-mono text-[10px] text-command-muted">
                                    {String(
                                        index + 1
                                    ).padStart(
                                        2,
                                        "0"
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-command-white">
                                        {
                                            customer.name
                                        }
                                    </p>

                                    <p className="mt-1 text-xs text-command-muted">
                                        {
                                            customer.orderCount
                                        }{" "}
                                        {customer.orderCount ===
                                        1
                                            ? "order"
                                            : "orders"}
                                    </p>
                                </div>

                                <p className="shrink-0 text-sm font-semibold text-command-white">
                                    {formatCurrency(
                                        customer.sales
                                    )}
                                </p>
                            </div>
                        )
                    )}
                </div>
            )}
        </section>
    );
};

export default TopCustomers;
