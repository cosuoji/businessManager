import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

const formatDate = (date) => {
    return new Date(
        `${date}T00:00:00`
    ).toLocaleDateString(
        "en-NG",
        {
            day: "numeric",
            month: "short",
        }
    );
};

const CustomerGrowth = ({
    data = [],
    totalCustomers = 0,
}) => {
    const newCustomers =
        data.reduce(
            (total, item) =>
                total + item.count,
            0
        );

    return (
        <section className="rounded-command-lg border border-command-border bg-command-surface">
            <div className="border-b border-command-border px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-command-white">
                            Customer growth
                        </p>

                        <p className="mt-1 text-xs text-command-muted">
                            New customers added during this period.
                        </p>
                    </div>

                    <span className="rounded-full border border-command-border px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-command-muted">
                        Pro
                    </span>
                </div>
            </div>

            <div className="grid border-b border-command-border sm:grid-cols-2">
                <div className="border-b border-command-border p-5 sm:border-b-0 sm:border-r">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-command-muted">
                        Total customers
                    </p>

                    <p className="mt-4 text-3xl font-semibold tracking-tight text-command-white">
                        {totalCustomers.toLocaleString()}
                    </p>

                    <p className="mt-2 text-xs text-command-muted">
                        Active customers
                    </p>
                </div>

                <div className="p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-command-muted">
                        New customers
                    </p>

                    <p className="mt-4 text-3xl font-semibold tracking-tight text-command-white">
                        {newCustomers.toLocaleString()}
                    </p>

                    <p className="mt-2 text-xs text-command-muted">
                        Added this period
                    </p>
                </div>
            </div>

            <div className="h-64 p-5">
                {data.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-xs text-command-muted">
                            No customer growth data available.
                        </p>
                    </div>
                ) : (
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <AreaChart
                            data={data}
                            margin={{
                                top: 10,
                                right: 10,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <defs>
                                <linearGradient
                                    id="customerGrowthGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="currentColor"
                                        stopOpacity={0.2}
                                    />

                                    <stop
                                        offset="100%"
                                        stopColor="currentColor"
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="currentColor"
                                className="text-command-border"
                            />

                            <XAxis
                                dataKey="date"
                                tickFormatter={
                                    formatDate
                                }
                                tick={{
                                    fontSize: 11,
                                }}
                                tickLine={false}
                                axisLine={false}
                                className="fill-command-muted"
                            />

                            <YAxis
                                allowDecimals={false}
                                tick={{
                                    fontSize: 11,
                                }}
                                tickLine={false}
                                axisLine={false}
                                className="fill-command-muted"
                            />

                            <Tooltip
                                formatter={(
                                    value
                                ) => [
                                    value,
                                    value ===
                                    1
                                        ? "New customer"
                                        : "New customers",
                                ]}
                                labelFormatter={(
                                    label
                                ) =>
                                    formatDate(
                                        label
                                    )
                                }
                                contentStyle={{
                                    background:
                                        "rgb(17 24 39)",
                                    border: "1px solid rgb(55 65 81)",
                                    borderRadius:
                                        "8px",
                                    fontSize:
                                        "12px",
                                }}
                            />

                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke="currentColor"
                                fill="url(#customerGrowthGradient)"
                                className="text-command-green"
                                strokeWidth={
                                    2
                                }
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </section>
    );
};

export default CustomerGrowth;
