import { SlidersHorizontal } from "lucide-react";

const OrderFilters = ({
    status,
    paymentStatus,
    onStatusChange,
    onPaymentStatusChange,
}) => {
    const selectClass =
        "h-10 rounded-command-md border border-command-border bg-command-surface px-3 text-xs text-command-text outline-none transition focus:border-command-green/40";

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-command-muted">
                <SlidersHorizontal size={14} />

                <span className="font-mono text-[9px] uppercase tracking-[0.15em]">
                    Filter
                </span>
            </div>

            <select
                value={status}
                onChange={(event) =>
                    onStatusChange(
                        event.target.value
                    )
                }
                className={selectClass}
            >
                <option value="">
                    All order statuses
                </option>

                <option value="pending">
                    Pending
                </option>

                <option value="confirmed">
                    Confirmed
                </option>

                <option value="processing">
                    Processing
                </option>

                <option value="ready">
                    Ready
                </option>

                <option value="completed">
                    Completed
                </option>

                <option value="cancelled">
                    Cancelled
                </option>
            </select>

            <select
                value={paymentStatus}
                onChange={(event) =>
                    onPaymentStatusChange(
                        event.target.value
                    )
                }
                className={selectClass}
            >
                <option value="">
                    All payment statuses
                </option>

                <option value="unpaid">
                    Unpaid
                </option>

                <option value="partially_paid">
                    Partially paid
                </option>

                <option value="paid">
                    Paid
                </option>
            </select>
        </div>
    );
};

export default OrderFilters;
