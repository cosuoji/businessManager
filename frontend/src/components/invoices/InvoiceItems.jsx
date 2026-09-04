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

const InvoiceItems = ({
    items = [],
    currency = "NGN",
}) => {
    return (
        <section>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[560px]">
                    <thead>
                        <tr className="border-b border-command-border">
                            <th className="px-5 py-3 text-left font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted sm:px-8">
                                Item
                            </th>

                            <th className="px-4 py-3 text-center font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                                Qty
                            </th>

                            <th className="px-4 py-3 text-right font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                                Unit price
                            </th>

                            <th className="px-5 py-3 text-right font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted sm:px-8">
                                Total
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-command-border">
                        {items.map(
                            (item, index) => (
                                <tr
                                    key={
                                        item._id ||
                                        `${item.name}-${index}`
                                    }
                                >
                                    <td className="px-5 py-4 sm:px-8">
                                        <p className="text-sm font-medium">
                                            {
                                                item.name
                                            }
                                        </p>
                                    </td>

                                    <td className="px-4 py-4 text-center font-mono text-sm">
                                        {
                                            item.quantity
                                        }
                                    </td>

                                    <td className="px-4 py-4 text-right font-mono text-sm text-command-muted">
                                        {formatCurrency(
                                            item.sellingPrice,
                                            currency
                                        )}
                                    </td>

                                    <td className="px-5 py-4 text-right font-mono text-sm font-medium sm:px-8">
                                        {formatCurrency(
                                            item.total,
                                            currency
                                        )}
                                    </td>
                                </tr>
                            )
                        )}

                        {!items.length && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-5 py-10 text-center text-xs text-command-muted"
                                >
                                    No invoice items.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default InvoiceItems;
