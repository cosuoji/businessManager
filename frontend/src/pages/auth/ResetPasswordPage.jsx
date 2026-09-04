import { useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/ui/Button";
import { resetPassword } from "../../services/auth";

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] =
        useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] =
        useState("");
    const [loading, setLoading] =
        useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError(
                "Passwords do not match."
            );
            return;
        }

        if (password.length < 8) {
            setError(
                "Password must be at least 8 characters."
            );
            return;
        }

        setLoading(true);

        try {
            await resetPassword(
                token,
                password
            );

            setSuccess(
                "Your password has been reset successfully."
            );
        } catch (error) {
            setError(
                error.message ||
                    "Unable to reset your password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create a new password"
            description="Choose a strong password for your BizFlow account."
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
                        htmlFor="password"
                        className="mb-2 block text-sm font-medium"
                    >
                        New password
                    </label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(
                                event.target.value
                            )
                        }
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
                        Confirm new password
                    </label>

                    <input
                        id="confirmPassword"
                        type="password"
                        value={
                            confirmPassword
                        }
                        onChange={(event) =>
                            setConfirmPassword(
                                event.target.value
                            )
                        }
                        required
                        minLength={8}
                        autoComplete="new-password"
                        className="w-full rounded-command-md border border-command-border bg-command-surface px-4 py-3 text-sm outline-none transition focus:border-command-green/60 focus:ring-1 focus:ring-command-green/30"
                        placeholder="••••••••"
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                >
                    {loading
                        ? "Resetting..."
                        : "Reset password"}
                </Button>

                {success && (
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/login")
                        }
                        className="w-full text-center text-sm text-command-green hover:text-command-white"
                    >
                        Continue to login →
                    </button>
                )}
            </form>

            <p className="mt-8 text-center text-sm text-command-muted">
                Remember your password?{" "}
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

export default ResetPasswordPage;
