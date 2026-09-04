import { Link } from "react-router-dom";

const AuthLayout = ({
    children,
    title,
    description,
}) => {
    return (
        <main className="min-h-screen bg-command-black text-command-white">
            <div className="grid min-h-screen lg:grid-cols-[1fr_1.15fr]">
                {/* LEFT SIDE */}

                <div className="relative hidden overflow-hidden border-r border-command-border lg:flex">
                    {/* Background glow */}

                    <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-command-green/10 blur-3xl" />

                    <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-command-green/5 blur-3xl" />

                    <div className="relative flex w-full flex-col justify-between p-10 xl:p-14">
                        <Link
                            to="/"
                            className="flex items-center gap-3"
                        >
                            <span className="flex h-9 w-9 items-center justify-center rounded-command-sm bg-command-green text-sm font-black text-[#061008]">
                                B
                            </span>

                            <span className="font-semibold tracking-tight">
                                BizFlow
                            </span>
                        </Link>

                        <div className="max-w-md">
                            <div className="mb-6 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-command-green" />

                                <span className="font-mono text-xs uppercase tracking-[0.2em] text-command-muted">
                                    Business operating system
                                </span>
                            </div>

                            <h2 className="text-4xl font-semibold tracking-tight xl:text-5xl">
                                Run the business.
                                <br />
                                <span className="text-command-green">
                                    Not the paperwork.
                                </span>
                            </h2>

                            <p className="mt-6 leading-7 text-command-muted">
                                Keep customers, orders,
                                payments, invoices and
                                outstanding balances in one
                                place.
                            </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-command-border pt-5 text-xs text-command-muted">
                            <span>
                                © {new Date().getFullYear()}{" "}
                                BizFlow
                            </span>

                            <span className="font-mono">
                                SECURE ACCESS
                            </span>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE */}

                <div className="flex min-h-screen flex-col">
                    {/* Mobile logo */}

                    <div className="flex items-center justify-between p-5 lg:hidden">
                        <Link
                            to="/"
                            className="flex items-center gap-3"
                        >
                            <span className="flex h-9 w-9 items-center justify-center rounded-command-sm bg-command-green text-sm font-black text-[#061008]">
                                B
                            </span>

                            <span className="font-semibold tracking-tight">
                                BizFlow
                            </span>
                        </Link>
                    </div>

                    <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
                        <div className="w-full max-w-md">
                            <div className="mb-8">
                                <h1 className="text-3xl font-semibold tracking-tight">
                                    {title}
                                </h1>

                                <p className="mt-2 text-sm leading-6 text-command-muted">
                                    {description}
                                </p>
                            </div>

                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AuthLayout;
