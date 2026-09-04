import {
    useState,
} from "react";

import {
    Save,
    UserRound,
} from "lucide-react";

import {
    updateCurrentUser,
} from "../../../services/users";

const AccountSection = ({
    user,
    onUpdated,
}) => {
    const [form, setForm] =
        useState({
            name: user.name || "",
            phone: user.phone || "",
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
                name: form.name,
                phone: form.phone,
            });

            await onUpdated();

            setSuccess(true);
        } catch (error) {
            setError(
                error.message ||
                    "Unable to update account settings."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="rounded-command-lg border border-command-border bg-command-surface">
            <div className="flex items-start gap-4 border-b border-command-border px-5 py-5 sm:px-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-command-md border border-command-border bg-command-black text-command-green">
                    <UserRound
                        size={17}
                        strokeWidth={1.5}
                    />
                </div>

                <div>
                    <h2 className="text-sm font-semibold">
                        Account
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-command-muted">
                        Manage your personal account information.
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="p-5 sm:p-6"
            >
                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-xs font-medium"
                        >
                            Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={
                                handleChange
                            }
                            maxLength={100}
                            required
                            className="h-10 w-full rounded-command-md border border-command-border bg-command-black px-3 text-sm outline-none transition focus:border-command-green/40"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="phone"
                            className="mb-2 block text-xs font-medium"
                        >
                            Phone
                        </label>

                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={
                                form.phone
                            }
                            onChange={
                                handleChange
                            }
                            required
                            className="h-10 w-full rounded-command-md border border-command-border bg-command-black px-3 text-sm outline-none transition focus:border-command-green/40"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label
                            htmlFor="accountEmail"
                            className="mb-2 block text-xs font-medium"
                        >
                            Email
                        </label>

                        <input
                            id="accountEmail"
                            type="email"
                            value={
                                user.email || ""
                            }
                            disabled
                            className="h-10 w-full cursor-not-allowed rounded-command-md border border-command-border bg-command-black/60 px-3 text-sm text-command-muted outline-none"
                        />

                        <p className="mt-1.5 text-[10px] text-command-muted">
                            Email address cannot be changed
                            from this page.
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
                        Account information updated
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

export default AccountSection;
