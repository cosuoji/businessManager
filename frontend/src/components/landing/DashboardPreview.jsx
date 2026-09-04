const metrics = [
    {
        label: "Today's sales",
        value: "₦284,500",
        change: "+18.4%",
        positive: true,
    },
    {
        label: "Today's orders",
        value: "17",
        change: "+5 today",
        positive: true,
    },
    {
        label: "Today's payments",
        value: "₦198,000",
        change: "+12.2%",
        positive: true,
    },
    {
        label: "Estimated profit",
        value: "₦96,500",
        change: "+9.7%",
        positive: true,
    },
];

const orders = [
    {
        customer: "Adebayo Stores",
        number: "#ORD-1024",
        amount: "₦150,000",
        status: "Partial",
    },
    {
        customer: "Mariam Couture",
        number: "#ORD-1023",
        amount: "₦84,500",
        status: "Paid",
    },
    {
        customer: "Tunde Electricals",
        number: "#ORD-1022",
        amount: "₦50,000",
        status: "Unpaid",
    },
];

const bars = [
    32, 48, 39, 62, 52, 71, 58,
    76, 61, 83, 72, 91, 77, 96,
    84, 72, 88, 68, 94, 82,
];

const DashboardPreview = () => {
    return (
        <section className="relative mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
            <div className="absolute left-1/2 top-1/2 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-command-green opacity-[0.025] blur-3xl" />

            <div className="relative overflow-hidden rounded-command-xl border border-command-border bg-command-surface shadow-2xl shadow-black/40">
                {/* APP TOP BAR */}

                <div className="flex h-12 items-center justify-between border-b border-command-border px-4 sm:px-5">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-command-red" />
                            <span className="h-2 w-2 rounded-full bg-command-yellow" />
                            <span className="h-2 w-2 rounded-full bg-command-green" />
                        </div>

                        <span className="hidden font-mono text-[9px] uppercase tracking-wider text-command-subtle sm:block">
                            app.bizflow / dashboard
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 animate-command-pulse rounded-full bg-command-green" />

                        {/* <span className="font-mono text-[9px] text-command-green">
                            LIVE
                        </span>*/}
                    </div>
                </div>

                <div className="flex">
                    {/* SIDEBAR */}

                    <aside className="hidden w-48 shrink-0 border-r border-command-border bg-command-surface px-3 py-5 md:block">
                        <div className="mb-7 flex items-center gap-2 px-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-command-green text-[10px] font-black text-black">
                                B
                            </div>

                            <span className="text-xs font-semibold">
                                BizFlow
                            </span>
                        </div>

                        <p className="mb-2 px-2 font-mono text-[8px] uppercase tracking-widest text-command-subtle">
                            Workspace
                        </p>

                        <div className="space-y-1">
                            {[
                                "Overview",
                                "Customers",
                                "Orders",
                                "Payments",
                                "Invoices",
                                "Receipts",
                            ].map(
                                (
                                    item,
                                    index
                                ) => (
                                    <div
                                        key={item}
                                        className={`rounded-md px-2 py-2 text-[11px] ${
                                            index === 0
                                                ? "bg-command-green-soft font-medium text-command-green"
                                                : "text-command-muted"
                                        }`}
                                    >
                                        {item}
                                    </div>
                                )
                            )}
                        </div>

                        <div className="mt-8 border-t border-command-border pt-5">
                            <p className="px-2 font-mono text-[8px] uppercase tracking-widest text-command-subtle">
                                Business
                            </p>

                            <div className="mt-2 rounded-md px-2 py-2 text-[11px] text-command-muted">
                                Settings
                            </div>
                        </div>
                    </aside>

                    {/* MAIN */}

                    <div className="min-w-0 flex-1">
                        {/* HEADER */}

                        <div className="flex flex-col gap-4 border-b border-command-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                            <div>
                                <p className="text-sm font-semibold">
                                    Good morning, Kelvin
                                </p>

                                <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-command-subtle">
                                    Sunday · August 30, 2026
                                </p>
                            </div>

                            <button className="rounded-md border border-command-border bg-command-surface-2 px-3 py-2 text-left font-mono text-[9px] text-command-muted">
                                Last 30 days ▾
                            </button>
                        </div>

                        {/* METRICS */}

                        <div className="grid border-b border-command-border sm:grid-cols-2 lg:grid-cols-4">
                            {metrics.map(
                                (metric) => (
                                    <div
                                        key={metric.label}
                                        className="border-b border-command-border p-5 last:border-b-0 sm:border-r lg:border-b-0"
                                    >
                                        <p className="font-mono text-[8px] uppercase tracking-wider text-command-subtle">
                                            {metric.label}
                                        </p>

                                        <p className="mt-2 text-xl font-semibold tracking-tight">
                                            {metric.value}
                                        </p>

                                        <p className="mt-2 font-mono text-[8px] text-command-green">
                                            ↑ {metric.change}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>

                        {/* CONTENT */}

                        <div className="grid lg:grid-cols-[1.4fr_.6fr]">
                            {/* REVENUE */}

                            <div className="border-b border-command-border p-5 sm:p-7 lg:border-b-0 lg:border-r">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-semibold">
                                            Revenue
                                        </p>

                                        <p className="mt-1 font-mono text-[8px] uppercase tracking-wider text-command-subtle">
                                            Last 30 days
                                        </p>
                                    </div>

                                    <span className="font-mono text-xs text-command-green">
                                        ₦1.82M
                                    </span>
                                </div>

                                <div className="mt-8 flex h-36 items-end gap-1 sm:h-44 sm:gap-1.5">
                                    {bars.map(
                                        (
                                            height,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    index
                                                }
                                                className="group relative flex-1"
                                            >
                                                <div
                                                    className="absolute bottom-0 w-full rounded-t-sm bg-command-green opacity-50 transition hover:opacity-100"
                                                    style={{
                                                        height: `${height}%`,
                                                    }}
                                                />
                                            </div>
                                        )
                                    )}
                                </div>

                                <div className="mt-3 flex justify-between font-mono text-[7px] text-command-subtle">
                                    <span>01 AUG</span>
                                    <span>15 AUG</span>
                                    <span>30 AUG</span>
                                </div>
                            </div>

                            {/* OUTSTANDING */}

                            <div className="p-5 sm:p-7">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold">
                                            Outstanding
                                        </p>

                                        <p className="mt-1 font-mono text-[8px] uppercase tracking-wider text-command-subtle">
                                            Requires attention
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-command-red/10 px-2 py-1 font-mono text-[8px] text-command-red">
                                        12 open
                                    </span>
                                </div>

                                <p className="mt-7 text-3xl font-semibold tracking-tight">
                                    ₦624,500
                                </p>

                                <div className="mt-7 space-y-3">
                                    <div className="flex justify-between text-[10px]">
                                        <span className="text-command-muted">
                                            Overdue
                                        </span>

                                        <span className="font-mono text-command-red">
                                            ₦382,000
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-[10px]">
                                        <span className="text-command-muted">
                                            Due soon
                                        </span>

                                        <span className="font-mono text-command-yellow">
                                            ₦242,500
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-5 h-1 overflow-hidden rounded-full bg-command-border">
                                    <div className="h-full w-[61%] rounded-full bg-command-red" />
                                </div>
                            </div>
                        </div>

                        {/* RECENT ORDERS */}

                        <div className="border-t border-command-border p-5 sm:p-7">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold">
                                        Recent orders
                                    </p>

                                    <p className="mt-1 font-mono text-[8px] uppercase tracking-wider text-command-subtle">
                                        Latest activity
                                    </p>
                                </div>

                                <span className="font-mono text-[9px] text-command-green">
                                    View all →
                                </span>
                            </div>

                            <div className="mt-5 divide-y divide-command-border">
                                {orders.map(
                                    (order) => (
                                        <div
                                            key={
                                                order.number
                                            }
                                            className="flex items-center justify-between gap-4 py-3"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-[10px] font-medium sm:text-xs">
                                                    {
                                                        order.customer
                                                    }
                                                </p>

                                                <p className="mt-1 font-mono text-[8px] text-command-subtle">
                                                    {
                                                        order.number
                                                    }
                                                </p>
                                            </div>

                                            <div className="flex shrink-0 items-center gap-3">
                                                <span className="hidden font-mono text-[10px] text-command-muted sm:block">
                                                    {
                                                        order.amount
                                                    }
                                                </span>

                                                <span
                                                    className={`rounded-full px-2 py-1 font-mono text-[7px] ${
                                                        order.status ===
                                                        "Paid"
                                                            ? "bg-command-green-soft text-command-green"
                                                            : order.status ===
                                                              "Partial"
                                                            ? "bg-command-yellow/10 text-command-yellow"
                                                            : "bg-command-red/10 text-command-red"
                                                    }`}
                                                >
                                                    {
                                                        order.status
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DashboardPreview;
