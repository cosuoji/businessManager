import {
    Check,
    CreditCard,
    Crown,
    ArrowUpRight,
} from "lucide-react";

import UpgradeButton from "../../../components/common/UpgradeButton"

const formatDate = (date) => {
    if (!date) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
};

const SubscriptionSection = ({
    user,
}) => {
    const subscription = user?.subscription;

    const plan = subscription?.plan || "free";
    const status = subscription?.status || "active";

    const isPro = plan === "pro";

    const cancelAtPeriodEnd =
        Boolean(subscription?.cancelAtPeriodEnd);

    const statusLabel = cancelAtPeriodEnd
        ? "Cancellation scheduled"
        : status === "active"
            ? "Active"
            : status.replace("_", " ");

    return (
        <section className="overflow-hidden rounded-command-lg border border-command-border bg-command-surface">
            <div className="border-b border-command-border px-5 py-4 sm:px-6">
                <div className="flex items-center gap-2">
                    <CreditCard
                        size={14}
                        strokeWidth={1.5}
                        className="text-command-green"
                    />

                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-command-green">
                        Subscription
                    </p>
                </div>

                <h2 className="mt-2 text-sm font-semibold text-command-white">
                    Plan & billing
                </h2>

                <p className="mt-1 text-xs leading-5 text-command-muted">
                    Manage your BizFlow plan and subscription.
                </p>
            </div>

            <div className="p-5 sm:p-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-command-md border border-command-border bg-command-black">
                                {isPro ? (
                                    <Crown
                                        size={17}
                                        strokeWidth={1.5}
                                        className="text-command-green"
                                    />
                                ) : (
                                    <CreditCard
                                        size={17}
                                        strokeWidth={1.5}
                                        className="text-command-muted"
                                    />
                                )}
                            </div>

                            <div>
                                <p className="text-base font-semibold capitalize text-command-white">
                                    {plan} plan
                                </p>

                                <div className="mt-1 flex items-center gap-2">
                                    <span
                                        className={`h-1.5 w-1.5 rounded-full ${
                                            cancelAtPeriodEnd
                                                ? "bg-yellow-400"
                                                : isPro
                                                    ? "bg-command-green"
                                                    : "bg-command-muted"
                                        }`}
                                    />

                                    <span className="text-xs capitalize text-command-muted">
                                        {statusLabel}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {isPro ? (
                            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                                <div>
                                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                                        Price
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-command-white">
                                        ₦7,000
                                        <span className="ml-1 text-xs font-normal text-command-muted">
                                            / month
                                        </span>
                                    </p>
                                </div>

                                <div>
                                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                                        Current period
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-command-white">
                                        {formatDate(
                                            subscription?.currentPeriodEnd
                                        )}
                                    </p>

                                    <p className="mt-0.5 text-[11px] text-command-muted">
                                        {cancelAtPeriodEnd ? "Pro access ends" : "Next renewal"}
                                    </p>
                                </div>

                                <div>
                                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                                        Last payment
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-command-white">
                                        {formatDate(
                                            subscription?.lastPaymentAt
                                        )}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-6">
                                <p className="text-sm leading-6 text-command-muted">
                                    You're currently using the Free plan.
                                    Upgrade to Pro for unlimited customers,
                                    orders, invoices and receipts, plus
                                    WhatsApp features.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="shrink-0">
                        {!isPro && (
                           <UpgradeButton />
                        )}

                        {isPro && cancelAtPeriodEnd && (
                            <div className="rounded-command-md border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">
                                <p className="text-xs font-medium text-yellow-300">
                                    Pro access ends on{" "}
                                    {formatDate(subscription?.currentPeriodEnd)}.
                                </p>

                                <button
                                    type="button"
                                    className="mt-3 text-xs font-medium text-command-green hover:underline"
                                >
                                    Resume subscription
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {isPro && !cancelAtPeriodEnd && (
                    <div className="mt-6 border-t border-command-border pt-5">
                        <div className="flex items-start gap-3">
                            <Check
                                size={15}
                                strokeWidth={1.5}
                                className="mt-0.5 shrink-0 text-command-green"
                            />

                            <p className="text-xs leading-5 text-command-muted">
                                Your Pro subscription is active. You have
                                access to all Pro features and your
                                subscription will renew automatically.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default SubscriptionSection;
