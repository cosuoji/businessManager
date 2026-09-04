import { ArrowRight, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../components/payments/paymentUtils";


const OutstandingCustomerTable = ({ customers }) => {
    if (!customers?.length) {
        return (
            <div className="rounded-command-lg border border-command-border bg-command-surface p-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-command-sm border border-command-border bg-command-black">
                    <Users
                        size={21}
                        strokeWidth={1.7}
                        className="text-command-muted"
                    />
                </div>

                <h3 className="mt-4 text-sm font-medium text-command-white">
                    No customers with outstanding balances
                </h3>

                <p className="mt-1 text-sm text-command-muted">
                    Everyone is currently up to date.
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
                                Customer
                            </th>

                            <th className="px-5 py-3.5 text-left font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-command-muted">
                                Outstanding Orders
                            </th>

                            <th className="px-5 py-3.5 text-left font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-command-muted">
                                Outstanding
                            </th>

                            <th className="px-5 py-3.5 text-left font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-command-muted">
                                Overdue
                            </th>

                            <th className="px-5 py-3.5" />
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-command-border">
                        {customers.map((customer) => (
                            <tr
                                key={customer._id}
                                className="group transition-colors duration-200 hover:bg-white/[0.025]"
                            >
                                {/* Customer */}
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-command-sm border border-command-border bg-command-black font-mono text-[10px] text-command-muted">
                                            {(customer.name?.[0] || "?").toUpperCase()}
                                        </div>

                                        <div className="min-w-0">
                                            <Link
                                                to={`/customers/${customer._id}`}
                                                className="font-medium text-command-white transition-colors hover:text-command-green"
                                            >
                                                {customer.name ||
                                                    "Unknown customer"}
                                            </Link>

                                            {customer.phone && (
                                                <p className="mt-0.5 text-xs text-command-muted">
                                                    {customer.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                {/* Outstanding orders */}
                                <td className="px-5 py-4">
                                    <span className="font-mono text-xs text-command-muted">
                                        {String(customer.orderCount).padStart(
                                            2,
                                            "0"
                                        )}
                                    </span>
                                </td>

                                {/* Outstanding */}
                                <td className="px-5 py-4">
                                    <span className="font-mono text-sm font-medium text-command-white">
                                        {formatCurrency(
                                            customer.totalOutstanding
                                        )}
                                    </span>
                                </td>

                                {/* Overdue */}
                                <td className="px-5 py-4">
                                    {customer.overdueAmount > 0 ? (
                                        <span className="font-mono text-sm font-medium text-red-400">
                                            {formatCurrency(
                                                customer.overdueAmount
                                            )}
                                        </span>
                                    ) : (
                                        <span className="font-mono text-xs text-command-muted">
                                            —
                                        </span>
                                    )}
                                </td>

                                {/* Action */}
                                <td className="px-5 py-4 text-right">
                                    <Link
                                        to={`/outstanding/customers/${customer._id}`}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-command-sm border border-command-border bg-command-black text-command-muted opacity-70 transition-all duration-200 hover:border-command-green/30 hover:bg-command-green/10 hover:text-command-green hover:opacity-100"
                                        title="View outstanding orders"
                                    >
                                        <ArrowRight
                                            size={15}
                                            strokeWidth={1.7}
                                        />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OutstandingCustomerTable;
