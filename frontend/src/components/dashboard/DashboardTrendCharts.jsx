import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

const formatCurrency = (
    value = 0
) => {
    return new Intl.NumberFormat(
        "en-NG",
        {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0,
        }
    ).format(value);
};

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

const DashboardTrendChart = ({
    title,
    description,
    data = [],
    dataKey,
}) => {
    return (
        <section className="rounded-command-lg border border-command-border bg-command-surface">
            <div className="border-b border-command-border px-5 py-4">
                <p className="text-sm font-medium text-command-white">
                    {title}
                </p>

                <p className="mt-1 text-xs text-command-muted">
                    {description}
                </p>
            </div>

            <div className="h-72 p-5">
                {data.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-xs text-command-muted">
                            No data available for this period.
                        </p>
                    </div>
                ) : (
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <LineChart
                            data={data}
                            margin={{
                                top: 10,
                                right: 10,
                                left: 0,
                                bottom: 0,
                            }}
                        >
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
                                tickFormatter={
                                    (value) =>
                                        `₦${(
                                            value /
                                            1000
                                        ).toLocaleString()}k`
                                }
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
                                ) =>
                                    formatCurrency(
                                        value
                                    )
                                }
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

                            <Line
                                type="monotone"
                                dataKey={
                                    dataKey
                                }
                                stroke="currentColor"
                                className="text-command-green"
                                strokeWidth={
                                    2
                                }
                                dot={false}
                                activeDot={{
                                    r: 4,
                                }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </section>
    );
};

export default DashboardTrendChart;
