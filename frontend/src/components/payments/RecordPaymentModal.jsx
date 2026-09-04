import {
    useEffect,
    useState,
} from "react";

import {
    CreditCard,
    X,
} from "lucide-react";

import {
    formatCurrency,
} from "./paymentUtils";

const emptyForm = {
    amount: "",
    paymentMethod: "cash",
    paymentDate: "",
    reference: "",
    notes: "",
};

const RecordPaymentModal = ({
    open,
    onClose,
    onSubmit,
    loading = false,
    balance = 0,
}) => {
    const [form, setForm] =
        useState(emptyForm);

    const [errors, setErrors] =
        useState({});

    useEffect(() => {
        if (open) {
            const today =
                new Date()
                    .toISOString()
                    .split("T")[0];

            setForm({
                ...emptyForm,
                paymentDate: today,
            });

            setErrors({});
        }
    }, [open]);

    if (!open) {
        return null;
    }

    const handleChange = (
        event
    ) => {
        const {
            name,
            value,
        } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));

        setErrors((current) => ({
            ...current,
            [name]: "",
        }));
    };

    const validate = () => {
        const nextErrors = {};

        const amount =
            Number(form.amount);

        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            nextErrors.amount =
                "Enter a valid payment amount.";
        } else if (
            amount > balance
        ) {
            nextErrors.amount = `Payment cannot exceed the remaining balance of ${formatCurrency(
                balance
            )}.`;
        }

        if (!form.paymentMethod) {
            nextErrors.paymentMethod =
                "Select a payment method.";
        }

        if (!form.paymentDate) {
            nextErrors.paymentDate =
                "Payment date is required.";
        }

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
            amount: Number(
                form.amount
            ),
            paymentMethod:
                form.paymentMethod,
            paymentDate:
                form.paymentDate,
            reference:
                form.reference.trim() ||
                undefined,
            notes:
                form.notes.trim() ||
                undefined,
        });
    };

    const inputClass =
        "mt-2 h-11 w-full rounded-command-md border border-command-border bg-command-black px-3.5 text-sm text-command-white outline-none transition placeholder:text-command-muted/50 focus:border-command-green/40";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <button
                type="button"
                aria-label="Close modal"
                onClick={onClose}
                disabled={loading}
                className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
            />

            <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-command-lg border border-command-border bg-command-surface shadow-2xl">
                <div className="flex items-start justify-between border-b border-command-border px-5 py-5 sm:px-6">
                    <div className="flex gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-command-md border border-command-border bg-command-black text-command-green">
                            <CreditCard
                                size={17}
                            />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold">
                                Record payment
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-command-muted">
                                Record a payment received for this order.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex h-8 w-8 items-center justify-center rounded-command-md text-command-muted transition hover:bg-command-black hover:text-command-white disabled:opacity-40"
                        aria-label="Close"
                    >
                        <X size={17} />
                    </button>
                </div>

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="space-y-5 p-5 sm:p-6"
                >
                    <div className="rounded-command-md border border-command-border bg-command-black/40 p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-command-muted">
                                Remaining balance
                            </span>

                            <span className="text-base font-semibold text-command-green">
                                {formatCurrency(
                                    balance
                                )}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="payment-amount"
                            className="text-xs font-medium text-command-text"
                        >
                            Amount
                            <span className="ml-1 text-command-green">
                                *
                            </span>
                        </label>

                        <input
                            id="payment-amount"
                            name="amount"
                            type="number"
                            min="0.01"
                            max={balance}
                            step="0.01"
                            value={
                                form.amount
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="0.00"
                            className={inputClass}
                            autoFocus
                        />

                        {errors.amount && (
                            <p className="mt-1.5 text-xs text-red-400">
                                {
                                    errors.amount
                                }
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="payment-method"
                            className="text-xs font-medium text-command-text"
                        >
                            Payment method
                            <span className="ml-1 text-command-green">
                                *
                            </span>
                        </label>

                        <select
                            id="payment-method"
                            name="paymentMethod"
                            value={
                                form.paymentMethod
                            }
                            onChange={
                                handleChange
                            }
                            className={inputClass}
                        >
                            <option value="cash">
                                Cash
                            </option>

                            <option value="bank_transfer">
                                Bank transfer
                            </option>

                            <option value="pos">
                                POS
                            </option>

                            <option value="mobile_money">
                                Mobile money
                            </option>

                            <option value="card">
                                Card
                            </option>

                            <option value="other">
                                Other
                            </option>
                        </select>

                        {errors.paymentMethod && (
                            <p className="mt-1.5 text-xs text-red-400">
                                {
                                    errors.paymentMethod
                                }
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="payment-date"
                            className="text-xs font-medium text-command-text"
                        >
                            Payment date
                            <span className="ml-1 text-command-green">
                                *
                            </span>
                        </label>

                        <input
                            id="payment-date"
                            name="paymentDate"
                            type="date"
                            value={
                                form.paymentDate
                            }
                            onChange={
                                handleChange
                            }
                            className={inputClass}
                        />

                        {errors.paymentDate && (
                            <p className="mt-1.5 text-xs text-red-400">
                                {
                                    errors.paymentDate
                                }
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="payment-reference"
                            className="text-xs font-medium text-command-text"
                        >
                            Reference
                            <span className="ml-1 text-[10px] text-command-muted">
                                optional
                            </span>
                        </label>

                        <input
                            id="payment-reference"
                            name="reference"
                            value={
                                form.reference
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="e.g. transfer reference"
                            maxLength={100}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="payment-notes"
                            className="text-xs font-medium text-command-text"
                        >
                            Notes
                            <span className="ml-1 text-[10px] text-command-muted">
                                optional
                            </span>
                        </label>

                        <textarea
                            id="payment-notes"
                            name="notes"
                            value={
                                form.notes
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Additional payment details..."
                            rows={3}
                            maxLength={500}
                            className="mt-2 w-full resize-none rounded-command-md border border-command-border bg-command-black px-3.5 py-3 text-sm text-command-white outline-none transition placeholder:text-command-muted/50 focus:border-command-green/40"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={
                            loading ||
                            balance <= 0
                        }
                        className="flex h-11 w-full items-center justify-center rounded-command-md bg-command-green px-4 text-sm font-semibold text-[#061008] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "Recording payment..."
                            : "Record payment"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RecordPaymentModal;
