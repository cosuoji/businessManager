import { ArrowRight, Package } from "lucide-react";
import { Link } from "react-router-dom";

import OutstandingDueBadge from "./OutstandingDueBadge";
import OutstandingStatusBadge from "./OutstandingStatusBadge";
import { formatCurrency } from "../payments/paymentUtils";

const OutstandingOrderTable = ({ orders, showCustomer = true }) => {
    if (!orders?.length) {
        return (
            <div className="rounded-command-lg border border-command-border bg-command-surface p-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-command-sm border border-command-border bg-command-black">
                    <Package
                        size={21}
                        strokeWidth={1.7}
                        className="text-command-muted"
                    />
                </div>

                <h3 className="mt-4 text-sm font-medium text-command-white">
                    No outstanding orders
                </h3>

                <p className="mt-1 text-sm text-command-muted">
                    There are no orders matching this view.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-command-lg border border-command-border bg-command-surface">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="border-b border-command-border">
                            <th className="px-5 py-3.5 text-left font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-command-muted">
                                Order
                            </th>

                            <th className="px-5 py-3.5 text-left font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-command-muted">
                                Customer
                            </th>

                            <th className="px-5 py-3.5 text-left font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-command-muted">
                                Due Date
                            </th>

                            <th className="px-5 py-3.5 text-left font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-command-muted">
                                Total
                            </th>

                            <th className="px-5 py-3.5 text-left font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-command-muted">
                                Paid
                            </th>

                            <th className="px-5 py-3.5 text-left font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-command-muted">
                                Balance
                            </th>

                            <th className="px-5 py-3.5 text-left font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-command-muted">
                                Status
                            </th>

                            <th className="px-5 py-3.5" />
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-command-border">
                        {orders.map((order) => {
                            const customerName =
                                order.customer?.name ||
                                order.customerId?.name ||
                                "Unknown customer";

                            const customerPhone =
                                order.customer?.phone ||
                                order.customerId?.phone;

                            const paymentStatus =
                                order.paymentStatus ||
                                (order.totalPaid > 0
                                    ? "partially_paid"
                                    : "unpaid");

                            return (
                                <tr
                                    key={order._id}
                                    className="group transition-colors duration-200 hover:bg-white/[0.025]"
                                >
                                    {/* Order */}
                                    <td className="px-5 py-4">
                                        <Link
                                            to={`/orders/${order._id}`}
                                            className="font-mono text-xs font-medium text-command-white transition-colors hover:text-command-green"
                                        >
                                            {order.orderNumber ||
                                                order._id}
                                        </Link>
                                    </td>

                                    {/* Customer */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-command-sm border border-command-border bg-command-black font-mono text-[10px] text-command-muted">
                                                {(
                                                    customerName?.[0] ||
                                                    "?"
                                                ).toUpperCase()}
                                            </div>

                                            <div className="min-w-0">
                                                <p className="font-medium text-command-white">
                                                    {customerName}
                                                </p>

                                                {customerPhone && (
                                                    <p className="mt-0.5 text-xs text-command-muted">
                                                        {customerPhone}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Due date */}
                                    <td className="px-5 py-4">
                                        <OutstandingDueBadge
                                            dueDate={order.dueDate}
                                        />
                                    </td>

                                    {/* Total */}
                                    <td className="px-5 py-4">
                                        <span className="font-mono text-xs font-medium text-command-white">
                                            {formatCurrency(
                                                order.total
                                            )}
                                        </span>
                                    </td>

                                    {/* Paid */}
                                    <td className="px-5 py-4">
                                        <span className="font-mono text-xs text-command-muted">
                                            {formatCurrency(
                                                order.totalPaid
                                            )}
                                        </span>
                                    </td>

                                    {/* Balance */}
                                    <td className="px-5 py-4">
                                        <span className="font-mono text-xs font-semibold text-command-white">
                                            {formatCurrency(
                                                order.balance
                                            )}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="px-5 py-4">
                                        <OutstandingStatusBadge
                                            status={paymentStatus}
                                        />
                                    </td>

                                    {/* Action */}
                                    <td className="px-5 py-4 text-right">
                                        <Link
                                            to={`/orders/${order._id}`}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-command-sm border border-command-border bg-command-black text-command-muted opacity-70 transition-all duration-200 hover:border-command-green/30 hover:bg-command-green/10 hover:text-command-green hover:opacity-100"
                                            title="View order"
                                        >
                                            <ArrowRight
                                                size={15}
                                                strokeWidth={1.7}
                                            />
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OutstandingOrderTable;
