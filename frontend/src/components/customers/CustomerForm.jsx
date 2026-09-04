import {
    useEffect,
    useState,
} from "react";

const emptyForm = {
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
};

const CustomerForm = ({
    onSubmit,
    loading = false,
    initialValues = emptyForm,
    submitLabel = "Add customer",
    loadingLabel = "Saving...",
}) => {
    const [form, setForm] =
        useState({
            ...emptyForm,
            ...initialValues,
        });

    const [errors, setErrors] =
        useState({});

    useEffect(() => {
        setForm({
            ...emptyForm,
            ...initialValues,
        });
    }, [initialValues]);

    const handleChange = (event) => {
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

        if (!form.name.trim()) {
            nextErrors.name =
                "Customer name is required.";
        }

        if (!form.phone.trim()) {
            nextErrors.phone =
                "Phone number is required.";
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
            name: form.name.trim(),
            phone: form.phone.trim(),
            email:
                form.email.trim() ||
                undefined,
            address:
                form.address.trim() ||
                undefined,
            notes:
                form.notes.trim() ||
                undefined,
        });
    };

    const inputClass =
        "mt-2 h-11 w-full rounded-command-md border border-command-border bg-command-black px-3.5 text-sm text-command-white outline-none transition placeholder:text-command-muted/50 focus:border-command-green/40";

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >
            <div>
                <label
                    htmlFor="name"
                    className="text-xs font-medium text-command-text"
                >
                    Customer name
                    <span className="ml-1 text-command-green">
                        *
                    </span>
                </label>

                <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={
                        handleChange
                    }
                    placeholder="e.g. Adewale Johnson"
                    className={inputClass}
                    autoComplete="name"
                />

                {errors.name && (
                    <p className="mt-1.5 text-xs text-red-400">
                        {errors.name}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="phone"
                    className="text-xs font-medium text-command-text"
                >
                    Phone number
                    <span className="ml-1 text-command-green">
                        *
                    </span>
                </label>

                <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={
                        handleChange
                    }
                    placeholder="e.g. 08012345678"
                    className={inputClass}
                    autoComplete="tel"
                />

                {errors.phone && (
                    <p className="mt-1.5 text-xs text-red-400">
                        {errors.phone}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="email"
                    className="text-xs font-medium text-command-text"
                >
                    Email
                    <span className="ml-1 text-[10px] text-command-muted">
                        optional
                    </span>
                </label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={
                        handleChange
                    }
                    placeholder="customer@example.com"
                    className={inputClass}
                    autoComplete="email"
                />
            </div>

            <div>
                <label
                    htmlFor="address"
                    className="text-xs font-medium text-command-text"
                >
                    Address
                    <span className="ml-1 text-[10px] text-command-muted">
                        optional
                    </span>
                </label>

                <input
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={
                        handleChange
                    }
                    placeholder="Customer address"
                    className={inputClass}
                    autoComplete="street-address"
                />
            </div>

            <div>
                <label
                    htmlFor="notes"
                    className="text-xs font-medium text-command-text"
                >
                    Notes
                    <span className="ml-1 text-[10px] text-command-muted">
                        optional
                    </span>
                </label>

                <textarea
                    id="notes"
                    name="notes"
                    value={form.notes}
                    onChange={
                        handleChange
                    }
                    placeholder="Anything useful to remember about this customer..."
                    rows={4}
                    className="mt-2 w-full resize-none rounded-command-md border border-command-border bg-command-black px-3.5 py-3 text-sm text-command-white outline-none transition placeholder:text-command-muted/50 focus:border-command-green/40"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-full items-center justify-center rounded-command-md bg-command-green px-4 text-sm font-semibold text-[#061008] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                  ? loadingLabel
                  : submitLabel}
            </button>
        </form>
    );
};

export default CustomerForm;
