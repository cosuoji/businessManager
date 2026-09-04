import { useEffect, useState } from "react";
import {
    FileText,
    Save,
} from "lucide-react";

import {
    getCurrentUser,
    updateCurrentUser,
} from "../../../services/users";

const DocumentPreferencesSection = () => {
    const [form, setForm] = useState({
        invoiceNotes: "",
        receiptNotes: "",
    });

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState(null);

    const [success, setSuccess] =
        useState(false);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const response =
                    await getCurrentUser();

                const settings =
                    response.user.settings ||
                    {};

                setForm({
                    invoiceNotes:
                        settings.invoiceNotes ||
                        "",
                    receiptNotes:
                        settings.receiptNotes ||
                        "",
                });
            } catch (error) {
                setError(
                    error.message ||
                        "Unable to load document settings."
                );
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));

        setSuccess(false);
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
                settings: {
                    invoiceNotes:
                        form.invoiceNotes,
                    receiptNotes:
                        form.receiptNotes,
                },
            });

            setSuccess(true);
        } catch (error) {
            setError(
                error.message ||
                    "Unable to update document settings."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="rounded-command-lg border border-command-border bg-command-surface">
            <div className="flex items-start gap-4 border-b border-command-border px-5 py-5 sm:px-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-command-md border border-command-border bg-command-black text-command-green">
                    <FileText
                        size={17}
                        strokeWidth={1.5}
                    />
                </div>

                <div>
                    <h2 className="text-sm font-semibold">
                        Document preferences
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-command-muted">
                        Customize the default notes added to invoices
                        and receipts.
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="p-5 sm:p-6"
            >
                {loading ? (
                    <div className="space-y-5 animate-pulse">
                        <div className="h-24 rounded-command-md bg-command-black" />
                        <div className="h-24 rounded-command-md bg-command-black" />
                    </div>
                ) : (
                    <>
                        <div className="space-y-5">
                            <div>
                                <label
                                    htmlFor="invoiceNotes"
                                    className="mb-2 block text-xs font-medium"
                                >
                                    Default invoice note
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
                                    maxLength={500}
                                    rows={3}
                                    placeholder="Thank you for your business."
                                    className="w-full resize-none rounded-command-md border border-command-border bg-command-black px-3 py-2.5 text-sm outline-none transition placeholder:text-command-muted/50 focus:border-command-green/40"
                                />

                                <p className="mt-1.5 text-[10px] text-command-muted">
                                    Used as the default note on new
                                    invoices.
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="receiptNotes"
                                    className="mb-2 block text-xs font-medium"
                                >
                                    Default receipt note
                                </label>

                                <textarea
                                    id="receiptNotes"
                                    name="receiptNotes"
                                    value={
                                        form.receiptNotes
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    maxLength={500}
                                    rows={3}
                                    placeholder="Payment received. Thank you."
                                    className="w-full resize-none rounded-command-md border border-command-border bg-command-black px-3 py-2.5 text-sm outline-none transition placeholder:text-command-muted/50 focus:border-command-green/40"
                                />

                                <p className="mt-1.5 text-[10px] text-command-muted">
                                    Used as the default note on new
                                    receipts.
                                </p>
                            </div>
                        </div>

                        {error && (
                            <p className="mt-4 text-xs text-red-400">
                                {error}
                            </p>
                        )}

                        {success && (
                            <p className="mt-4 text-xs text-command-green">
                                Document preferences updated
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
                    </>
                )}
            </form>
        </section>
    );
};

export default DocumentPreferencesSection;
