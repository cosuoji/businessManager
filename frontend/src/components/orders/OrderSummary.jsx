const OrderSummary = ({
    items,
    discount,
    onDiscountChange,
}) => {
    const subtotal = items.reduce(
        (sum, item) =>
            sum +
            (Number(item.quantity) || 0) *
                (Number(item.sellingPrice) || 0),
        0
    );

    const normalizedDiscount = Math.min(
        Math.max(
            Number(discount) || 0,
            0
        ),
        subtotal
    );

    const total =
        subtotal - normalizedDiscount;

    const formatAmount = (amount) =>
        `₦${amount.toLocaleString(
            undefined,
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )}`;

    return (
        <div className="rounded-command-lg border border-command-border bg-command-surface">
            <div className="border-b border-command-border px-5 py-4">
                <h2 className="text-sm font-semibold">
                    Order summary
                </h2>
            </div>

            <div className="space-y-4 p-5">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-command-muted">
                        Subtotal
                    </span>

                    <span className="font-mono text-sm">
                        {formatAmount(subtotal)}
                    </span>
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <label
                            htmlFor="discount"
                            className="text-sm text-command-muted"
                        >
                            Discount
                        </label>

                        <div className="w-32">
                            <input
                                id="discount"
                                type="number"
                                min="0"
                                max={subtotal}
                                step="0.01"
                                value={discount}
                                onChange={(event) =>
                                    onDiscountChange(
                                        event.target.value
                                    )
                                }
                                className="h-9 w-full rounded-command-md border border-command-border bg-command-black px-3 text-right font-mono text-xs text-command-white outline-none focus:border-command-green/40"
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t border-command-border pt-4">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                                Total
                            </p>

                            <p className="mt-1 text-2xl font-semibold tracking-tight text-command-green">
                                {formatAmount(total)}
                            </p>
                        </div>

                        <p className="text-xs text-command-muted">
                            {items.length}{" "}
                            {items.length === 1
                                ? "item"
                                : "items"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
