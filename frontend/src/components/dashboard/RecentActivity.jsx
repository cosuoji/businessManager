import {
  ArrowUpRight,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";

const formatCurrency = (amount = 0) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date) => {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const RecentActivity = ({
  orders = [],
  payments = [],
}) => {

  const activities = [
    ...orders.map((order) => ({
      id: `order-${order._id}`,
      type: "order",
      date: order.createdAt,
      title:
        order.customerId?.name ||
        order.customer?.name ||
        "Unknown customer",
      subtitle: `Order ${
        order.orderNumber || order._id
      }`,
      amount: order.total || 0,
      href: `/orders/${order._id}`,
    })),

    ...payments.map((payment) => ({
      id: `payment-${payment._id}`,
      type: "payment",
      date: payment.paymentDate,
      title:
        payment.orderId?.customerId?.name ||
        payment.orderId?.customer?.name ||
        "Unknown customer",
      subtitle: `Payment for ${
        payment.orderId?.orderNumber ||
        "order"
      }`,
      amount: payment.amount || 0,
      href: payment.orderId?._id
        ? `/orders/${payment.orderId._id}`
        : "/payments",
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    )
    .slice(0, 8);

  if (!activities.length) {
    return (
      <div className="rounded-command-lg border border-command-border bg-command-surface p-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-command-muted">
            Recent activity
          </p>

          <p className="mt-1 text-xs text-command-muted">
            Your latest orders and payments will
            appear here.
          </p>
        </div>

        <div className="py-10 text-center">
          <p className="text-sm font-medium">
            No recent activity
          </p>

          <p className="mt-1 text-xs text-command-muted">
            Orders and payments will appear here
            as your business activity grows.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="rounded-command-lg border border-command-border bg-command-surface">
      <div className="flex items-center justify-between border-b border-command-border px-5 py-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-command-muted">
            Recent activity
          </p>

          <p className="mt-1 text-xs text-command-muted">
            Latest orders and payments
          </p>
        </div>
      </div>

      <div className="divide-y divide-command-border">
        {activities.map((activity) => {
          const isOrder =
            activity.type === "order";



          return (
            <Link
              key={activity.id}
              to={activity.href}
              className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-white/[0.02]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-command-sm bg-command-black text-command-muted">
                  {isOrder ? (
                    <ShoppingBag size={15} />
                  ) : (
                    <CreditCard size={15} />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {activity.title}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-command-muted">
                    {activity.subtitle}
                    {" · "}
                    {formatDate(activity.date)}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {formatCurrency(
                      activity.amount
                    )}
                  </p>

                  <p className="text-[10px] uppercase tracking-wider text-command-muted">
                    {isOrder
                      ? "Order"
                      : "Payment"}
                  </p>
                </div>

                <ArrowUpRight
                  size={13}
                  className="text-command-muted"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default RecentActivity;
