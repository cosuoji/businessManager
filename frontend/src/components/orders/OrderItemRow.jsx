import { Trash2 } from "lucide-react";

const OrderItemRow = ({
    item,
    index,
    onChange,
    onRemove,
    canRemove,
}) => {
    const updateField = (
        field,
        value
    ) => {
        onChange(index, {
            ...item,
            [field]: value,
        });
    };

    const quantity =
        Number(item.quantity) || 0;

    const sellingPrice =
        Number(item.sellingPrice) || 0;

    const total =
        quantity * sellingPrice;

    const inputClass =
        "h-10 w-full rounded-command-md border border-command-border bg-command-black px-3 text-sm text-command-white outline-none transition focus:border-command-green/40";

    return (
        <div className="rounded-command-md border border-command-border bg-command-black/30 p-4">
            <div className="mb-4 flex items-center justify-between">
                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                    Item {index + 1}
                </p>

                {canRemove && (
                    <button
                        type="button"
                        onClick={() =>
                            onRemove(index)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-command-md text-command-muted transition hover:bg-red-500/10 hover:text-red-400"
                        aria-label="Remove item"
                    >
                        <Trash2 size={15} />
                    </button>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-12">
                <div className="md:col-span-5">
                    <label className="text-xs font-medium text-command-text">
                        Item
                    </label>

                    <input
                        value={item.name}
                        onChange={(event) =>
                            updateField(
                                "name",
                                event.target.value
                            )
                        }
                        placeholder="Product or service"
                        className={`${inputClass} mt-2`}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="text-xs font-medium text-command-text">
                        Qty
                    </label>

                    <input
                        type="number"
                        min="1"
                        step="1"
                        value={item.quantity}
                        onChange={(event) =>
                            updateField(
                                "quantity",
                                event.target.value
                            )
                        }
                        className={`${inputClass} mt-2`}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="text-xs font-medium text-command-text">
                        Selling price
                    </label>

                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.sellingPrice}
                        onChange={(event) =>
                            updateField(
                                "sellingPrice",
                                event.target.value
                            )
                        }
                        className={`${inputClass} mt-2`}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="text-xs font-medium text-command-text">
                        Product cost
                    </label>

                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.productCost}
                        onChange={(event) =>
                            updateField(
                                "productCost",
                                event.target.value
                            )
                        }
                        className={`${inputClass} mt-2`}
                    />
                </div>

                <div className="md:col-span-1">
                    <label className="text-xs font-medium text-command-text">
                        Total
                    </label>

                    <div className="mt-2 flex h-10 items-center justify-end font-mono text-xs text-command-green">
                        {total.toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderItemRow;
