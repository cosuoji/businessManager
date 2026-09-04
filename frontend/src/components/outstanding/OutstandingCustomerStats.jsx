import {
  AlertCircle,
  FileText,
  Wallet,
} from "lucide-react";

import { formatCurrency } from "../payments/paymentUtils";
import StatCard from "../dashboard/StatCard";



const OutstandingCustomerStats = ({
  totalOutstanding,
  orderCount,
  overdueAmount,
  overdueOrderCount,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        label="Outstanding"
        value={formatCurrency(totalOutstanding)}
        description="Current unpaid balance"
        icon={Wallet}
        accent
      />

      <StatCard
        label="Outstanding Orders"
        value={orderCount}
        description="Orders with an unpaid balance"
        icon={FileText}
        accent
      />

      <StatCard
        label="Overdue"
        value={formatCurrency(overdueAmount)}
        description={`${overdueOrderCount} overdue ${
          overdueOrderCount === 1
            ? "order"
            : "orders"
        }`}
        icon={AlertCircle}
        accent
      />
    </div>
  );
};

export default OutstandingCustomerStats;
