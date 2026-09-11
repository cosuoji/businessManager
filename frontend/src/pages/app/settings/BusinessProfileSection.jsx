import {
    useState,
} from "react";

import {
    Building2,
    Save,
} from "lucide-react";

import {
    updateCurrentUser,
} from "../../../services/users";

const currencies = [
    {
        value: "NGN",
        label: "₦ NGN — Nigerian Naira",
    },
    {
        value: "USD",
        label: "$ USD — US Dollar",
    },
    {
        value: "GBP",
        label: "£ GBP — British Pound",
    },
    {
        value: "EUR",
        label: "€ EUR — Euro",
    },
];

const BusinessProfileSection = ({
    user,
    onUpdated,
}) => {
    const [form, setForm] =
        useState({
            businessName:
                user.businessName || "",
            businessPhone:
                user.businessPhone || "",
            businessAddress:
                user.businessAddress || "",
            currency:
            user.currency || "NGN",
            invoiceNotes:
                user.settings?.invoiceNotes || "",

        });

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState(null);

    const [success, setSuccess] =
        useState(false);

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

        setSuccess(false);
        setError(null);
    };
    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError(null);
            setSuccess(false);

            await updateCurrentUser({
                businessName:
                    form.businessName,
                businessPhone:
                    form.businessPhone,
                businessAddress:
                    form.businessAddress,
                currency:
                    form.currency,
                settings: {
                    invoiceNotes:
                        form.invoiceNotes,
                },
            });

            await onUpdated();

            setSuccess(true);
        } catch (error) {
            setError(
                error.message ||
                    "Unable to update business settings."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="rounded-command-lg border border-command-border bg-command-surface">
            <div className="flex items-start gap-4 border-b border-command-border px-5 py-5 sm:px-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-command-md border border-command-border bg-command-black text-command-green">
                    <Building2
                        size={17}
                        strokeWidth={1.5}
                    />
                </div>

                <div>
                    <h2 className="text-sm font-semibold">
                        Business profile
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-command-muted">
                        This information appears on
                        your invoices and receipts.
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="p-5 sm:p-6"
            >
                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label
                            htmlFor="businessName"
                            className="mb-2 block text-xs font-medium"
                        >
                            Business name
                        </label>

                        <input
                            id="businessName"
                            name="businessName"
                            type="text"
                            value={
                                form.businessName
                            }
                            onChange={
                                handleChange
                            }
                            maxLength={150}
                            required
                            className="h-10 w-full rounded-command-md border border-command-border bg-command-black px-3 text-sm outline-none transition placeholder:text-command-muted/50 focus:border-command-green/40"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="businessPhone"
                            className="mb-2 block text-xs font-medium"
                        >
                            Business phone
                        </label>

                        <input
                            id="businessPhone"
                            name="businessPhone"
                            type="tel"
                            value={
                                form.businessPhone
                            }
                            onChange={
                                handleChange
                            }
                            className="h-10 w-full rounded-command-md border border-command-border bg-command-black px-3 text-sm outline-none transition focus:border-command-green/40"
                        />
                    </div>

                    {/* <div>
                        <label
                            htmlFor="currency"
                            className="mb-2 block text-xs font-medium"
                        >
                            Currency
                        </label>

                        <select
                            id="currency"
                            name="currency"
                            value={
                                form.currency
                            }
                            onChange={
                                handleChange
                            }
                            className="h-10 w-full rounded-command-md border border-command-border bg-command-black px-3 text-sm outline-none transition focus:border-command-green/40"
                        >
                            {currencies.map(
                                (
                                    currency
                                ) => (
                                    <option
                                        key={
                                            currency.value
                                        }
                                        value={
                                            currency.value
                                        }
                                    >
                                        {
                                            currency.label
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div>*/}

                    <div className="sm:col-span-2">
                        <label
                            htmlFor="businessAddress"
                            className="mb-2 block text-xs font-medium"
                        >
                            Business address
                        </label>

                        <textarea
                            id="businessAddress"
                            name="businessAddress"
                            value={
                                form.businessAddress
                            }
                            onChange={
                                handleChange
                            }
                            maxLength={300}
                            rows={3}
                            className="w-full resize-none rounded-command-md border border-command-border bg-command-black px-3 py-2.5 text-sm outline-none transition placeholder:text-command-muted/50 focus:border-command-green/40"
                        />
            </div>
            <div className="sm:col-span-2">
                <label
                    htmlFor="invoiceNotes"
                    className="mb-2 block text-xs font-medium"
                >
                    Invoice notes (Payment Details and other notes)
                </label>

                <textarea
                    id="invoiceNotes"
                    name="invoiceNotes"
                    value={
                        form.invoiceNotes
                    }
                    onChange={
                        handleChange
                    }
                    maxLength={300}
                    rows={3}
                    className="w-full resize-none rounded-command-md border border-command-border bg-command-black px-3 py-2.5 text-sm outline-none transition placeholder:text-command-muted/50 focus:border-command-green/40"
                />
            </div>
                </div>

                {error && (
                    <p className="mt-4 text-xs text-red-400">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="mt-4 text-xs text-command-green">
                        Business profile updated
                        successfully.
                    </p>
                )}

                <div className="mt-6 flex justify-end border-t border-command-border pt-5">
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex h-9 items-center gap-2 rounded-command-md bg-command-green px-4 text-xs font-semibold text-command-black transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Save
                            size={14}
                            strokeWidth={1.7}
                        />

                        {saving
                            ? "Saving..."
                            : "Save changes"}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default BusinessProfileSection;
