import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/ui/Button";
import { login } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
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
        setLoading(true);

        try {
            await login(formData);

            await refreshUser();

            navigate("/dashboard");
        } catch (error) {
            setError(
                error.message ||
                    "Unable to log in."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            description="Log in to access your business workspace."
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
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-command-md border border-command-border bg-command-surface px-4 py-3 text-sm outline-none transition placeholder:text-command-muted/60 focus:border-command-green/60 focus:ring-1 focus:ring-command-green/30"
                        placeholder="you@business.com"
                    />
                </div>

                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium"
                        >
                            Password
                        </label>

                        <Link
                            to="/forgot-password"
                            className="text-xs text-command-green transition hover:text-command-white"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full rounded-command-md border border-command-border bg-command-surface px-4 py-3 text-sm outline-none transition placeholder:text-command-muted/60 focus:border-command-green/60 focus:ring-1 focus:ring-command-green/30"
                        placeholder="••••••••"
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                >
                    {loading
                        ? "Logging in..."
                        : "Log in"}
                </Button>
            </form>

            <p className="mt-8 text-center text-sm text-command-muted">
                Don't have an account?{" "}
                <Link
                    to="/register"
                    className="font-medium text-command-green hover:text-command-white"
                >
                    Create one
                </Link>
            </p>
        </AuthLayout>
    );
};

export default LoginPage;
