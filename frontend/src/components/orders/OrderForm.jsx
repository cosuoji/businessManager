import {
    Plus,
    UserRound,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import OrderItemRow from "./OrderItemRow";
import OrderSummary from "./OrderSummary";

const emptyItem = {
    name: "",
    quantity: 1,
    sellingPrice: "",
    productCost: "",
};

const emptyForm = {
    customerId: "",
    items: [
        {
            ...emptyItem,
        },
    ],
    discount: 0,
    dueDate: "",
    status: "pending",
    notes: "",
};

const OrderForm = ({
    customers = [],
    initialValues,
    onSubmit,
    loading = false,
    submitLabel = "Create order",
}) => {
    const [form, setForm] =
        useState({
            ...emptyForm,
            ...initialValues,
            items:
                initialValues?.items?.length
                    ? initialValues.items
                    : [
                          {
                              ...emptyItem,
                          },
                      ],
        });

    const [errors, setErrors] =
        useState({});

    useEffect(() => {
        setForm({
            ...emptyForm,
            ...initialValues,
            items:
                initialValues?.items?.length
                    ? initialValues.items
                    : [
                          {
                              ...emptyItem,
                          },
                      ],
        });
    }, [initialValues]);

    const updateField = (
        field,
        value
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setErrors((current) => ({
            ...current,
            [field]: "",
        }));
    };

    const updateItem = (
        index,
        item
    ) => {
        setForm((current) => ({
            ...current,
            items: current.items.map(
                (currentItem, itemIndex) =>
                    itemIndex === index
                        ? item
                        : currentItem
            ),
        }));
    };

    const addItem = () => {
        setForm((current) => ({
            ...current,
            items: [
                ...current.items,
                {
                    ...emptyItem,
                },
            ],
        }));
    };

    const removeItem = (index) => {
        if (form.items.length <= 1) {
            return;
        }

        setForm((current) => ({
            ...current,
            items: current.items.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            ),
        }));
    };

    const validate = () => {
        const nextErrors = {};

        if (!form.customerId) {
            nextErrors.customerId =
                "Select a customer.";
        }

        if (
            !form.items.length
        ) {
            nextErrors.items =
                "Add at least one item.";
        }

        form.items.forEach(
            (item, index) => {
                if (
                    !item.name.trim()
                ) {
                    nextErrors[
                        `items.${index}.name`
                    ] =
                        "Item name is required.";
                }

                if (
                    Number(item.quantity) <=
                    0
                ) {
                    nextErrors[
                        `items.${index}.quantity`
                    ] =
                        "Quantity must be greater than 0.";
                }

                if (
                    Number(
                        item.sellingPrice
                    ) < 0
                ) {
                    nextErrors[
                        `items.${index}.sellingPrice`
                    ] =
                        "Selling price cannot be negative.";
                }

                if (
                    Number(
                        item.productCost
                    ) < 0
                ) {
                    nextErrors[
                        `items.${index}.productCost`
                    ] =
                        "Product cost cannot be negative.";
                }
            }
        );

        setErrors(nextErrors);

        return (
            Object.keys(nextErrors)
                .length === 0
        );
    };

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        await onSubmit({
            customerId:
                form.customerId,

            items: form.items.map(
                (item) => ({
                    name: item.name.trim(),
                    quantity:
                        Number(
                            item.quantity
                        ),
                    sellingPrice:
                        Number(
                            item.sellingPrice
                        ),
                    productCost:
                        Number(
                            item.productCost
                        ),
                })
            ),

            discount:
                Number(form.discount) ||
                0,

            dueDate:
                form.dueDate || undefined,

            status: form.status,

            notes:
                form.notes.trim() ||
                undefined,
        });
    };

    const inputClass =
        "mt-2 h-11 w-full rounded-command-md border border-command-border bg-command-black px-3.5 text-sm text-command-white outline-none transition focus:border-command-green/40";

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {/* CUSTOMER */}

            <section className="rounded-command-lg border border-command-border bg-command-surface">
                <div className="border-b border-command-border px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-command-md border border-command-border bg-command-black text-command-green">
                            <UserRound size={15} />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold">
                                Customer
                            </h2>

                            <p className="mt-0.5 text-xs text-command-muted">
                                Who is this order for?
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-5">
                    <label
                        htmlFor="customerId"
                        className="text-xs font-medium text-command-text"
                    >
                        Customer
                    </label>

                    <select
                        id="customerId"
                        value={form.customerId}
                        onChange={(event) =>
                            updateField(
                                "customerId",
                                event.target.value
                            )
                        }
                        className={`${inputClass} appearance-none`}
                    >
                        <option value="">
                            Select customer
                        </option>

                        {customers.map(
                            (customer) => (
                                <option
                                    key={
                                        customer._id
                                    }
                                    value={
                                        customer._id
                                    }
                                >
                                    {
                                        customer.name
                                    }{" "}
                                    —{" "}
                                    {
                                        customer.phone
                                    }
                                </option>
                            )
                        )}
                    </select>

                    {errors.customerId && (
                        <p className="mt-1.5 text-xs text-red-400">
                            {
                                errors.customerId
                            }
                        </p>
                    )}
                </div>
            </section>

            {/* ITEMS */}

            <section className="rounded-command-lg border border-command-border bg-command-surface">
                <div className="flex items-center justify-between border-b border-command-border px-5 py-4">
                    <div>
                        <h2 className="text-sm font-semibold">
                            Order items
                        </h2>

                        <p className="mt-0.5 text-xs text-command-muted">
                            Add products or services.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={addItem}
                        className="inline-flex h-9 items-center gap-2 rounded-command-md border border-command-border px-3 text-xs font-medium text-command-text transition hover:border-command-green/30 hover:text-command-green"
                    >
                        <Plus size={14} />
                        Add item
                    </button>
                </div>

                <div className="space-y-3 p-5">
                    {form.items.map(
                        (item, index) => (
                            <OrderItemRow
                                key={index}
                                item={item}
                                index={index}
                                onChange={
                                    updateItem
                                }
                                onRemove={
                                    removeItem
                                }
                                canRemove={
                                    form.items
                                        .length >
                                    1
                                }
                            />
                        )
                    )}

                    {errors.items && (
                        <p className="text-xs text-red-400">
                            {errors.items}
                        </p>
                    )}
                </div>
            </section>

            {/* ORDER SETTINGS */}

            <div className="grid gap-6 lg:grid-cols-2">
                <section className="rounded-command-lg border border-command-border bg-command-surface">
                    <div className="border-b border-command-border px-5 py-4">
                        <h2 className="text-sm font-semibold">
                            Order details
                        </h2>
                    </div>

                    <div className="space-y-5 p-5">
                        <div>
                            <label
                                htmlFor="dueDate"
                                className="text-xs font-medium text-command-text"
                            >
                                Due date
                            </label>

                            <input
                                id="dueDate"
                                type="date"
                                value={
                                    form.dueDate
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        "dueDate",
                                        event
                                            .target
                                            .value
                                    )
                                }
                                className={
                                    inputClass
                                }
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="status"
                                className="text-xs font-medium text-command-text"
                            >
                                Order status
                            </label>

                            <select
                                id="status"
                                value={
                                    form.status
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        "status",
                                        event
                                            .target
                                            .value
                                    )
                                }
                                className={`${inputClass} appearance-none`}
                            >
                                <option value="pending">
                                    Pending
                                </option>

                                <option value="confirmed">
                                    Confirmed
                                </option>

                                <option value="processing">
                                    Processing
                                </option>

                                <option value="ready">
                                    Ready
                                </option>

                                <option value="completed">
                                    Completed
                                </option>

                                <option value="cancelled">
                                    Cancelled
                                </option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="notes"
                                className="text-xs font-medium text-command-text"
                            >
                                Notes
                            </label>

                            <textarea
                                id="notes"
                                value={
                                    form.notes
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        "notes",
                                        event
                                            .target
                                            .value
                                    )
                                }
                                rows={5}
                                placeholder="Anything useful about this order..."
                                className="mt-2 w-full resize-none rounded-command-md border border-command-border bg-command-black px-3.5 py-3 text-sm text-command-white outline-none placeholder:text-command-muted/50 focus:border-command-green/40"
                            />
                        </div>
                    </div>
                </section>

                <div>
                    <OrderSummary
                        items={form.items}
                        discount={
                            form.discount
                        }
                        onDiscountChange={(
                            value
                        ) =>
                            updateField(
                                "discount",
                                value
                            )
                        }
                    />
                </div>
            </div>

            {/* SUBMIT */}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-11 items-center justify-center rounded-command-md bg-command-green px-6 text-sm font-semibold text-[#061008] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading
                        ? "Saving..."
                        : submitLabel}
                </button>
            </div>
        </form>
    );
};

export default OrderForm;
