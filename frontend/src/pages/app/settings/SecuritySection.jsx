import {
    LockKeyhole,
    ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";

const SecuritySection = () => {
    return (
        <section className="rounded-command-lg border border-command-border bg-command-surface">
            <div className="flex items-start gap-4 border-b border-command-border px-5 py-5 sm:px-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-command-md border border-command-border bg-command-black text-command-green">
                    <LockKeyhole
                        size={17}
                        strokeWidth={1.5}
                    />
                </div>

                <div>
                    <h2 className="text-sm font-semibold">
                        Security
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-command-muted">
                        Manage your password and account security.
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                    <p className="text-sm font-medium">
                        Password
                    </p>

                    <p className="mt-1 text-xs leading-5 text-command-muted">
                        Change your password regularly to keep
                        your account secure.
                    </p>
                </div>

                <Link
                    to="/forgot-password"
                    className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-command-md border border-command-border px-4 text-xs font-medium text-command-muted transition hover:border-command-green/30 hover:bg-command-black hover:text-command-green"
                >
                    Change password

                    <ArrowRight
                        size={13}
                        strokeWidth={1.5}
                    />
                </Link>
            </div>
        </section>
    );
};

export default SecuritySection;
