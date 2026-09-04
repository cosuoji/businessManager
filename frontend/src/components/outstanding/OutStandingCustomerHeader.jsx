import {
    ArrowLeft,
    Phone,
    UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../payments/paymentUtils";

const OutstandingCustomerHeader = ({
    customer,
    totalOutstanding,
}) => {
    return (
        <div className="group relative overflow-hidden rounded-command-lg border border-command-green/20 bg-command-green/[0.04] p-5 transition duration-300">
            {/* subtle glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-command-green/10 blur-3xl" />

            <div className="relative">
                {/* Main content */}
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    {/* Customer */}
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-command-sm border border-command-green/20 bg-command-green/10 text-command-green">
                            <UserRound
                                size={20}
                                strokeWidth={1.7}
                            />
                        </div>

                        <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-command-muted">
                                Customer
                            </p>

                            <h1 className="mt-1 text-xl font-semibold tracking-tight text-command-white">
                                {customer?.name || "Customer"}
                            </h1>

                            {customer?.phone && (
                                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-command-muted">
                                    <Phone
                                        size={13}
                                        strokeWidth={1.7}
                                    />
                                    <span>{customer.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Outstanding */}
                    <div className="sm:text-right">
                        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-command-muted">
                            Total Outstanding
                        </p>

                        <p className="mt-2 text-2xl font-semibold tracking-tight text-command-white sm:text-3xl">
                            {formatCurrency(totalOutstanding)}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 border-t border-command-border pt-4">
                    <Link
                        to="/outstanding"
                        className="inline-flex items-center gap-2 text-xs text-command-muted transition hover:text-command-white"
                    >
                        <ArrowLeft
                            size={14}
                            strokeWidth={1.7}
                        />
                        Back to Outstanding
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OutstandingCustomerHeader;
