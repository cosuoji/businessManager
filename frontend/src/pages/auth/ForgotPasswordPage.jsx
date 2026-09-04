import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/ui/Button";
import { forgotPassword } from "../../services/auth";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] =
        useState("");
    const [loading, setLoading] =
        useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await forgotPassword(email);

            setSuccess(
                "If an account exists with that email, a password reset link has been sent."
            );
        } catch (error) {
            setError(
                error.message ||
                    "Unable to process your request."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Forgot your password?"
            description="Enter your email and we'll help you get back into your account."
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

                {success && (
                    <div className="rounded-command-md border border-command-green/20 bg-command-green/5 px-4 py-3 text-sm text-command-green">
                        {success}
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
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(
                                event.target.value
                            )
                        }
                        required
                        autoComplete="email"
                        className="w-full rounded-command-md border border-command-border bg-command-surface px-4 py-3 text-sm outline-none transition focus:border-command-green/60 focus:ring-1 focus:ring-command-green/30"
                        placeholder="you@business.com"
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                >
                    {loading
                        ? "Sending..."
                        : "Send reset link"}
                </Button>
            </form>

            <div className="mt-8 text-center">
                <Link
                    to="/login"
                    className="text-sm text-command-green hover:text-command-white"
                >
                    ← Back to login
                </Link>
            </div>
        </AuthLayout>
    );
};

export default ForgotPasswordPage;
