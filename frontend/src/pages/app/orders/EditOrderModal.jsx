import {
    CalendarDays,
    Plus,
    Trash2,
    X,
} from "lucide-react";

import { useEffect, useState } from "react";

const formatAmount = (amount) =>
    `₦${Number(amount || 0).toLocaleString(
        undefined,
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    )}`;

const createEmptyItem = () => ({
    name: "",
    quantity: 1,
    sellingPrice: "",
    productCost: "",
});

const EditOrderModal = ({
    open,
    order,
    onClose,
    onSubmit,
    loading = false,
    error = null,
}) => {
    const [customerId, setCustomerId] =
        useState("");

    const [items, setItems] =
        useState([]);

    const [discount, setDiscount] =
        useState("");

    const [dueDate, setDueDate] =
        useState("");

    const [status, setStatus] =
        useState("pending");

    const [notes, setNotes] =
        useState("");

    const [formError, setFormError] =
        useState(null);

    useEffect(() => {
        if (!open || !order) {
            return;
        }

        setCustomerId(
            order.customerId?._id ||
                order.customerId ||
                ""
        );

        setItems(
            (order.items || []).map((item) => ({
                _id: item._id,
                name: item.name || "",
                quantity: Number(
                    item.quantity || 1
                ),
                sellingPrice:
                    item.sellingPrice ?? "",
                productCost:
                    item.productCost ?? "",
            }))
        );

        setDiscount(
            order.discount ?? ""
        );

        setDueDate(
            order.dueDate
                ? new Date(order.dueDate)
                      .toISOString()
                      .split("T")[0]
                : ""
        );

        setStatus(
            order.status || "pending"
        );

        setNotes(
            order.notes || ""
        );

        setFormError(null);
    }, [open, order]);

    if (!open || !order) {
        return null;
    }

    const subtotal = items.reduce(
        (sum, item) =>
            sum +
            Number(item.quantity || 0) *
                Number(item.sellingPrice || 0),
        0
    );

    const discountAmount = Math.min(
        Math.max(
            Number(discount || 0),
            0
        ),
        subtotal
    );

    const total =
        subtotal - discountAmount;

    const updateItem = (
        index,
        field,
        value
    ) => {
        setItems((currentItems) =>
            currentItems.map(
                (item, itemIndex) =>
                    itemIndex === index
                        ? {
                              ...item,
                              [field]: value,
                          }
                        : item
            )
        );
    };

    const addItem = () => {
        setItems((currentItems) => [
            ...currentItems,
            createEmptyItem(),
        ]);
    };

    const removeItem = (index) => {
        setItems((currentItems) =>
            currentItems.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setFormError(null);

        if (!customerId) {
            setFormError(
                "Please select a customer."
            );
            return;
        }

        if (items.length === 0) {
            setFormError(
                "Order must contain at least one item."
            );
            return;
        }

        const cleanedItems = items.map(
            (item) => ({
                ...(item._id
                    ? { _id: item._id }
                    : {}),
                name: item.name.trim(),
                quantity: Number(
                    item.quantity
                ),
                sellingPrice: Number(
                    item.sellingPrice
                ),
                productCost: Number(
                    item.productCost || 0
                ),
            })
        );

        const invalidItem =
            cleanedItems.find(
                (item) =>
                    !item.name ||
                    !Number.isFinite(
                        item.quantity
                    ) ||
                    item.quantity <= 0 ||
                    !Number.isFinite(
                        item.sellingPrice
                    ) ||
                    item.sellingPrice < 0 ||
                    !Number.isFinite(
                        item.productCost
                    ) ||
                    item.productCost < 0
            );

        if (invalidItem) {
            setFormError(
                "Please check the item details. Quantity must be greater than zero and prices cannot be negative."
            );
            return;
        }

        const numericDiscount = Number(
            discount || 0
        );

        if (
            !Number.isFinite(
                numericDiscount
            ) ||
            numericDiscount < 0
        ) {
            setFormError(
                "Discount cannot be negative."
            );
            return;
        }

        if (
            numericDiscount > subtotal
        ) {
            setFormError(
                "Discount cannot be greater than the order subtotal."
            );
            return;
        }

        await onSubmit({
            customerId,
            items: cleanedItems,
            discount: numericDiscount,
            dueDate: dueDate || null,
            status,
            notes: notes.trim(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-sm sm:px-6">
            <div
                className="my-auto w-full max-w-3xl overflow-hidden rounded-command-lg border border-command-border bg-command-surface shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-order-title"
            >
                {/* HEADER */}

                <div className="flex items-start justify-between border-b border-command-border px-5 py-4 sm:px-6">
                    <div>
                        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-command-green">
                            Edit order
                        </p>

                        <h2
                            id="edit-order-title"
                            className="mt-1 font-mono text-lg font-semibold"
                        >
                            {order.orderNumber}
                        </h2>

                        <p className="mt-1 text-xs text-command-muted">
                            Update the order details
                            below.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex h-8 w-8 items-center justify-center rounded-command-md text-command-muted transition hover:bg-command-black hover:text-command-white disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Close"
                    >
                        <X size={17} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                >
                    <div className="max-h-[75vh] space-y-6 overflow-y-auto px-5 py-5 sm:px-6">
                        {/* ERROR */}

                        {(formError ||
                            error) && (
                            <div className="rounded-command-md border border-red-500/20 bg-red-500/5 px-4 py-3">
                                <p className="text-xs font-medium text-red-400">
                                    {formError ||
                                        error}
                                </p>
                            </div>
                        )}

                        {/* CUSTOMER */}

                        <div>
                            <label className="mb-2 block text-xs font-medium">
                                Customer
                            </label>

                            <select
                                value={
                                    customerId
                                }
                                onChange={(event) =>
                                    setCustomerId(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                disabled={loading}
                                className="h-10 w-full rounded-command-md border border-command-border bg-command-black px-3 text-sm text-command-white outline-none transition focus:border-command-green/50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {order.customerId?._id ? (
                                    <option
                                        value={
                                            order
                                                .customerId
                                                ._id
                                        }
                                    >
                                        {
                                            order
                                                .customerId
                                                .name
                                        }
                                    </option>
                                ) : (
                                    <option value="">
                                        Select customer
                                    </option>
                                )}
                            </select>

                            <p className="mt-1.5 text-[10px] text-command-muted">
                                Customer selection can
                                be expanded to your
                                customer list when you
                                connect the customer
                                selector.
                            </p>
                        </div>

                        {/* ITEMS */}

                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <div>
                                    <label className="text-xs font-medium">
                                        Order items
                                    </label>

                                    <p className="mt-1 text-[10px] text-command-muted">
                                        Update quantities,
                                        prices and costs.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        addItem
                                    }
                                    disabled={
                                        loading
                                    }
                                    className="inline-flex h-8 items-center gap-1.5 rounded-command-md border border-command-border px-3 text-[11px] font-medium text-command-green transition hover:border-command-green/30 hover:bg-command-black disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <Plus
                                        size={13}
                                    />
                                    Add item
                                </button>
                            </div>

                            <div className="space-y-3">
                                {items.map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <div
                                            key={
                                                item._id ||
                                                index
                                            }
                                            className="rounded-command-md border border-command-border bg-command-black/30 p-4"
                                        >
                                            <div className="grid gap-3 sm:grid-cols-2">
                                                {/* NAME */}

                                                <div className="sm:col-span-2">
                                                    <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-command-muted">
                                                        Item name
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={
                                                            item.name
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            updateItem(
                                                                index,
                                                                "name",
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        disabled={
                                                            loading
                                                        }
                                                        className="h-9 w-full rounded-command-md border border-command-border bg-command-surface px-3 text-xs outline-none transition focus:border-command-green/50 disabled:opacity-50"
                                                        placeholder="e.g. T-Shirt"
                                                    />
                                                </div>

                                                {/* QUANTITY */}

                                                <div>
                                                    <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-command-muted">
                                                        Quantity
                                                    </label>

                                                    <input
                                                        type="number"
                                                        min="1"
                                                        step="1"
                                                        value={
                                                            item.quantity
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            updateItem(
                                                                index,
                                                                "quantity",
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        disabled={
                                                            loading
                                                        }
                                                        className="h-9 w-full rounded-command-md border border-command-border bg-command-surface px-3 text-xs outline-none transition focus:border-command-green/50 disabled:opacity-50"
                                                    />
                                                </div>

                                                {/* SELLING PRICE */}

                                                <div>
                                                    <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-command-muted">
                                                        Selling price
                                                    </label>

                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={
                                                            item.sellingPrice
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            updateItem(
                                                                index,
                                                                "sellingPrice",
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        disabled={
                                                            loading
                                                        }
                                                        className="h-9 w-full rounded-command-md border border-command-border bg-command-surface px-3 text-xs outline-none transition focus:border-command-green/50 disabled:opacity-50"
                                                    />
                                                </div>

                                                {/* PRODUCT COST */}

                                                <div>
                                                    <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-command-muted">
                                                        Product cost
                                                    </label>

                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={
                                                            item.productCost
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            updateItem(
                                                                index,
                                                                "productCost",
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        disabled={
                                                            loading
                                                        }
                                                        className="h-9 w-full rounded-command-md border border-command-border bg-command-surface px-3 text-xs outline-none transition focus:border-command-green/50 disabled:opacity-50"
                                                    />
                                                </div>

                                                {/* ITEM TOTAL */}

                                                <div className="flex items-end justify-between gap-3">
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-wider text-command-muted">
                                                            Item total
                                                        </p>

                                                        <p className="mt-1 font-mono text-sm">
                                                            {formatAmount(
                                                                Number(
                                                                    item.quantity ||
                                                                        0
                                                                ) *
                                                                    Number(
                                                                        item.sellingPrice ||
                                                                            0
                                                                    )
                                                            )}
                                                        </p>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeItem(
                                                                index
                                                            )
                                                        }
                                                        disabled={
                                                            loading ||
                                                            items.length ===
                                                                1
                                                        }
                                                        className="inline-flex h-8 items-center gap-1.5 rounded-command-md border border-command-border px-2.5 text-[10px] text-command-muted transition hover:border-red-500/30 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
                                                    >
                                                        <Trash2
                                                            size={
                                                                13
                                                            }
                                                        />
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* ORDER SETTINGS */}

                        <div className="grid gap-4 sm:grid-cols-2">
                            {/* DISCOUNT */}

                            <div>
                                <label className="mb-2 block text-xs font-medium">
                                    Discount
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={
                                        discount
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setDiscount(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    disabled={
                                        loading
                                    }
                                    className="h-10 w-full rounded-command-md border border-command-border bg-command-black px-3 text-sm outline-none transition focus:border-command-green/50 disabled:opacity-50"
                                    placeholder="0"
                                />
                            </div>

                            {/* STATUS */}

                            <div>
                                <label className="mb-2 block text-xs font-medium">
                                    Order status
                                </label>

                                <select
                                    value={
                                        status
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setStatus(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    disabled={
                                        loading
                                    }
                                    className="h-10 w-full rounded-command-md border border-command-border bg-command-black px-3 text-sm outline-none transition focus:border-command-green/50 disabled:opacity-50"
                                >
                                    <option value="pending">
                                        Pending
                                    </option>
                                    <option value="processing">
                                        Processing
                                    </option>
                                    <option value="completed">
                                        Completed
                                    </option>
                                    <option value="cancelled">
                                        Cancelled
                                    </option>
                                </select>
                            </div>

                            {/* DUE DATE */}

                            <div className="sm:col-span-2">
                                <label className="mb-2 block text-xs font-medium">
                                    Due date
                                </label>

                                <div className="relative">
                                    <CalendarDays
                                        size={
                                            15
                                        }
                                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-command-muted"
                                    />

                                    <input
                                        type="date"
                                        value={
                                            dueDate
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setDueDate(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        disabled={
                                            loading
                                        }
                                        className="h-10 w-full rounded-command-md border border-command-border bg-command-black pl-9 pr-3 text-sm outline-none transition focus:border-command-green/50 disabled:opacity-50"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* NOTES */}

                        <div>
                            <label className="mb-2 block text-xs font-medium">
                                Notes
                            </label>

                            <textarea
                                value={notes}
                                onChange={(
                                    event
                                ) =>
                                    setNotes(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                disabled={
                                    loading
                                }
                                rows={3}
                                placeholder="Add any notes for this order..."
                                className="w-full resize-none rounded-command-md border border-command-border bg-command-black px-3 py-2.5 text-sm outline-none transition focus:border-command-green/50 disabled:opacity-50"
                            />
                        </div>

                        {/* TOTAL PREVIEW */}

                        <div className="rounded-command-md border border-command-border bg-command-black/50 p-4">
                            <div className="ml-auto max-w-xs space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-command-muted">
                                        Subtotal
                                    </span>

                                    <span className="font-mono">
                                        {formatAmount(
                                            subtotal
                                        )}
                                    </span>
                                </div>

                                <div className="flex justify-between text-xs">
                                    <span className="text-command-muted">
                                        Discount
                                    </span>

                                    <span className="font-mono">
                                        -
                                        {formatAmount(
                                            discountAmount
                                        )}
                                    </span>
                                </div>

                                <div className="border-t border-command-border pt-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">
                                            New total
                                        </span>

                                        <span className="font-mono text-lg font-semibold text-command-green">
                                            {formatAmount(
                                                total
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PAYMENT WARNING */}

                        <div className="rounded-command-md border border-command-border bg-command-black/30 px-4 py-3">
                            <p className="text-[11px] font-medium text-command-white">
                                Existing payments will
                                not be changed.
                            </p>

                            <p className="mt-1 text-[10px] leading-relaxed text-command-muted">
                                Changing the order total
                                may change the remaining
                                balance. Payment history
                                remains intact.
                            </p>
                        </div>
                    </div>

                    {/* FOOTER */}

                    <div className="flex flex-col-reverse gap-2 border-t border-command-border px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                        <button
                            type="button"
                            onClick={
                                onClose
                            }
                            disabled={
                                loading
                            }
                            className="h-10 rounded-command-md border border-command-border px-4 text-xs font-medium text-command-muted transition hover:bg-command-black hover:text-command-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                loading
                            }
                            className="h-10 rounded-command-md bg-command-green px-5 text-xs font-semibold text-command-black transition hover:bg-command-green/90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading
                                ? "Saving changes..."
                                : "Save changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditOrderModal;
