import {
    AlertCircle,
    Clock3,
    Wallet,
} from "lucide-react";

import { formatCurrency } from "../payments/paymentUtils";
import StatCard from "../dashboard/StatCard";


const OutstandingStats = ({
    summary,
    loading,
}) => {
    return (
        <div className="grid gap-4 md:grid-cols-3 rounded-command-lg bg-command-surface">
            <StatCard
                label="Total Outstanding"
                value={formatCurrency(
                    summary?.totalOutstanding
                )}
                icon={Wallet}
                meta="Across all unpaid balances"
          loading={loading}
          accent
            />

            <StatCard
                label="Due Soon"
                value={formatCurrency(
                    summary?.dueSoon
                )}
                icon={Clock3}
                meta="Due within 7 days"
          loading={loading}
          accent
            />

            <StatCard
                label="Overdue"
                value={formatCurrency(
                    summary?.overdue
                )}
                icon={AlertCircle}
                meta="Past their due date"
          loading={loading}
          accent
            />
        </div>
    );
};

export default OutstandingStats;
