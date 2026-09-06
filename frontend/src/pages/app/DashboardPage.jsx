import {
    Banknote,
    ShoppingBag,
    Wallet,
    TrendingUp,
    Users,
    ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";

import StatCard from "../../components/dashboard/StatCard";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import RecentActivity from "../../components/dashboard/RecentActivity";
import useDashboard from "../../hooks/useDashboard";

const formatCurrency = (
    amount = 0
) => {
    return new Intl.NumberFormat(
        "en-NG",
        {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0,
        }
    ).format(amount);
};

const getDateString = (date) => {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};



const DashboardPage = () => {
  const [period, setPeriod] = useState("today");

  const [customStartDate, setCustomStartDate] =
    useState("");

  const [customEndDate, setCustomEndDate] =
    useState("");

  const handlePeriodChange = (value) => {
    setPeriod(value);
  };


  const getReportingRange = () => {
    const now = new Date();

    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    if (period === "today") {
      const date = getDateString(today);

      return {
        startDate: date,
        endDate: date,
      };
    }

    if (period === "week") {
      const start = new Date(today);

      const day = start.getDay();

      const daysSinceMonday =
        day === 0 ? 6 : day - 1;

      start.setDate(
        start.getDate() - daysSinceMonday
      );

      return {
        startDate: getDateString(start),
        endDate: getDateString(today),
      };
    }

    if (period === "month") {
      const start = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

      return {
        startDate: getDateString(start),
        endDate: getDateString(today),
      };
    }

    if (period === "custom") {
      if (!customStartDate || !customEndDate) {
        return {
          startDate: undefined,
          endDate: undefined,
        };
      }

      return {
        startDate: customStartDate,
        endDate: customEndDate,
      };
    }

    return {
      startDate: customStartDate,
      endDate: customEndDate,
    };
};

  const {
    startDate,
    endDate,
  } = getReportingRange();

  const {
    data,
    loading,
    error,
  } = useDashboard({
    startDate,
    endDate,
  });



    const recentOrders =
      data?.recentOrders || [];

    const recentPayments =
      data?.recentPayments || [];




    if (loading) {
        return (
            <div className="space-y-6 ">
                <div className="h-24 animate-pulse rounded-command-lg bg-command-surface" />

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[1, 2, 3, 4].map(
                        (item) => (
                            <div
                                key={item}
                                className="h-36 animate-pulse rounded-command-lg bg-command-surface"
                            />
                        )
                    )}
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="h-72 animate-pulse rounded-command-lg bg-command-surface" />

                    <div className="h-72 animate-pulse rounded-command-lg bg-command-surface" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-command-lg border border-red-500/20 bg-red-500/5 p-6">
                <p className="text-sm font-medium text-red-400">
                    Unable to load dashboard
                </p>

                <p className="mt-2 text-xs text-command-muted">
                    {error.message ||
                        "Something went wrong while loading your business statistics."}
                </p>
            </div>
        );
    }

    const sales =
        data?.sales?.amount || 0;

    const orderCount =
        data?.sales?.orderCount || 0;

    const paymentAmount =
        data?.payments?.amount || 0;

    const paymentCount =
        data?.payments?.count || 0;

    const estimatedProfit =
        data?.estimatedProfit || 0;

    const totalOutstanding =
        data?.totalOutstanding || 0;

    const customerCount =
        data?.customerCount || 0;

    return (
        <div>
          <DashboardHeader
            startDate={data?.dateRange?.startDate}
            endDate={data?.dateRange?.endDate}
            period={period}
            onPeriodChange={handlePeriodChange}
            customStartDate={customStartDate}
            customEndDate={customEndDate}
            onCustomStartDateChange={setCustomStartDate}
            onCustomEndDateChange={setCustomEndDate}
          />

            {/* STATS */}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Sales"
                    value={formatCurrency(
                        sales
                    )}
                    meta={`${orderCount} ${
                        orderCount === 1
                            ? "order"
                            : "orders"
                    }`}
                    icon={Banknote}
                    accent
                />

                <StatCard
                    label="Orders"
                    value={orderCount}
                    meta="Orders created"
                    icon={ShoppingBag}
                />

                <StatCard
                    label="Payments"
                    value={formatCurrency(
                        paymentAmount
                    )}
                    meta={`${paymentCount} ${
                        paymentCount ===
                        1
                            ? "payment"
                            : "payments"
                    } recorded`}
                    icon={Wallet}
                />

                <StatCard
                    label="Estimated profit"
                    value={formatCurrency(
                        estimatedProfit
                    )}
                    meta="Based on product costs"
                    icon={TrendingUp}
                />
            </div>

            {/* SECONDARY INFORMATION */}

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
                {/* SALES PANEL */}

                <section className="rounded-command-lg border border-command-border bg-command-surface">
                    <div className="flex items-center justify-between border-b border-command-border px-5 py-4">
                        <div>
                            <p className="text-sm font-medium">
                                Today's activity
                            </p>

                            <p className="mt-1 text-xs text-command-muted">
                                Current business
                                performance
                            </p>
                        </div>

                        {/* <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-command-green">
                            <span className="h-1.5 w-1.5 rounded-full bg-command-green" />

                            Live
                        </span>*/}
                    </div>

                    <div className="grid divide-y divide-command-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                        <div className="p-6">
                            <p className="text-xs text-command-muted">
                                Sales generated
                            </p>

                            <p className="mt-3 text-3xl font-semibold tracking-tight">
                                {formatCurrency(
                                    sales
                                )}
                            </p>

                            <div className="mt-5 flex items-center gap-2 text-xs text-command-muted">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-command-green/10 text-command-green">
                                    <ArrowUpRight
                                        size={
                                            13
                                        }
                                    />
                                </span>

                                <span>
                                    {
                                        orderCount
                                    }{" "}
                                    orders
                                    contributing
                                    to sales
                                </span>
                            </div>
                        </div>

                        <div className="p-6">
                            <p className="text-xs text-command-muted">
                                Payments collected
                            </p>

                            <p className="mt-3 text-3xl font-semibold tracking-tight">
                                {formatCurrency(
                                    paymentAmount
                                )}
                            </p>

                            <p className="mt-5 text-xs text-command-muted">
                                {
                                    paymentCount
                                }{" "}
                                payments
                                recorded
                            </p>
                        </div>
                    </div>
                </section>

                {/* OUTSTANDING */}

                <section className="relative overflow-hidden rounded-command-lg border border-command-border bg-command-surface p-6">
                    <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-command-green/5 blur-3xl" />

                    <div className="relative">
                        <div className="flex items-center justify-between">
                            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-command-muted">
                                Outstanding
                            </p>

                            <Wallet
                                size={17}
                                className="text-command-muted"
                            />
                        </div>

                        <p className="mt-6 text-3xl font-semibold tracking-tight">
                            {formatCurrency(
                                totalOutstanding
                            )}
                        </p>

                        <p className="mt-2 text-xs leading-5 text-command-muted">
                            Total amount currently
                            owed across your
                            outstanding orders.
                        </p>

                        <Link
                            to="/outstanding"
                            className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-command-green transition hover:text-command-green/80"
                        >
                            View outstanding

                            <ArrowUpRight
                                size={13}
                            />
                        </Link>
                    </div>
                </section>
            </div>

            {/* CUSTOMERS + RECENT ACTIVITY */}

            <div className="mt-6 grid gap-6 xl:grid-cols-3">
                <section className="rounded-command-lg border border-command-border bg-command-surface p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-command-muted">
                                Customers
                            </p>

                            <p className="mt-4 text-3xl font-semibold">
                                {customerCount}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-command-sm border border-command-border text-command-muted">
                            <Users
                                size={17}
                            />
                        </div>
                    </div>

                    <p className="mt-3 text-xs text-command-muted">
                        Active customers in your
                        business.
                    </p>

                    <Link
                        to="/customers"
                        className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-command-green"
                    >
                        Manage customers

                        <ArrowUpRight
                            size={13}
                        />
                    </Link>
                </section>

                <div className="xl:col-span-2">
                  <RecentActivity
                    orders={recentOrders}
                    payments={recentPayments}
                  />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
