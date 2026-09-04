import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/ui/Button";
import { register } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";


const RegisterPage = () => {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        businessName: "",
        businessPhone: "",
        businessAddress: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (
            formData.password !==
            formData.confirmPassword
        ) {
            setError(
                "Passwords do not match."
            );
            return;
        }

        setLoading(true);
        try {
            const {
                confirmPassword,
                ...registrationData
            } = formData;

            await register(
                registrationData
            );

            await refreshUser();

            navigate("/dashboard");
        } catch (error) {
            setError(
                error.message ||
                    "Unable to create your account."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create your account"
            description="Set up your business workspace in a few minutes."
        >
            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >
                {error && (
                    <div className="rounded-command-md border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-medium"
                        >
                            Your name
                        </label>

                        <input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            autoComplete="name"
                            className="w-full rounded-command-md border border-command-border bg-command-surface px-4 py-3 text-sm outline-none transition focus:border-command-green/60 focus:ring-1 focus:ring-command-green/30"
                            placeholder="Kelvin"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="phone"
                            className="mb-2 block text-sm font-medium"
                        >
                            Phone number
                        </label>

                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            autoComplete="tel"
                            className="w-full rounded-command-md border border-command-border bg-command-surface px-4 py-3 text-sm outline-none transition focus:border-command-green/60 focus:ring-1 focus:ring-command-green/30"
                            placeholder="080..."
                        />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium"
                    >
                        Email address
                    </label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        className="w-full rounded-command-md border border-command-border bg-command-surface px-4 py-3 text-sm outline-none transition focus:border-command-green/60 focus:ring-1 focus:ring-command-green/30"
                        placeholder="you@business.com"
                    />
                </div>

                <div>
                    <label
                        htmlFor="businessName"
                        className="mb-2 block text-sm font-medium"
                    >
                        Business name
                    </label>

                    <input
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        required
                        autoComplete="organization"
                        className="w-full rounded-command-md border border-command-border bg-command-surface px-4 py-3 text-sm outline-none transition focus:border-command-green/60 focus:ring-1 focus:ring-command-green/30"
                        placeholder="Your business"
                    />
                </div>

                <div>
                    <label
                        htmlFor="businessPhone"
                        className="mb-2 block text-sm font-medium"
                    >
                        Business phone
                        <span className="ml-2 text-xs text-command-muted">
                            Optional
                        </span>
                    </label>

                    <input
                        id="businessPhone"
                        name="businessPhone"
                        type="tel"
                        value={formData.businessPhone}
                        onChange={handleChange}
                        autoComplete="tel"
                        className="w-full rounded-command-md border border-command-border bg-command-surface px-4 py-3 text-sm outline-none transition focus:border-command-green/60 focus:ring-1 focus:ring-command-green/30"
                        placeholder="080..."
                    />
                </div>

                <div>
                    <label
                        htmlFor="businessAddress"
                        className="mb-2 block text-sm font-medium"
                    >
                        Business address
                        <span className="ml-2 text-xs text-command-muted">
                            Optional
                        </span>
                    </label>

                    <input
                        id="businessAddress"
                        name="businessAddress"
                        value={
                            formData.businessAddress
                        }
                        onChange={handleChange}
                        autoComplete="street-address"
                        className="w-full rounded-command-md border border-command-border bg-command-surface px-4 py-3 text-sm outline-none transition focus:border-command-green/60 focus:ring-1 focus:ring-command-green/30"
                        placeholder="Business location"
                    />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={8}
                            autoComplete="new-password"
                            className="w-full rounded-command-md border border-command-border bg-command-surface px-4 py-3 text-sm outline-none transition focus:border-command-green/60 focus:ring-1 focus:ring-command-green/30"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="mb-2 block text-sm font-medium"
                        >
                            Confirm password
                        </label>

                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={
                                formData.confirmPassword
                            }
                            onChange={handleChange}
                            required
                            minLength={8}
                            autoComplete="new-password"
                            className="w-full rounded-command-md border border-command-border bg-command-surface px-4 py-3 text-sm outline-none transition focus:border-command-green/60 focus:ring-1 focus:ring-command-green/30"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                >
                    {loading
                        ? "Creating account..."
                        : "Create account"}
                </Button>
            </form>

            <p className="mt-8 text-center text-sm text-command-muted">
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="font-medium text-command-green hover:text-command-white"
                >
                    Log in
                </Link>
            </p>
        </AuthLayout>
    );
};

export default RegisterPage;
