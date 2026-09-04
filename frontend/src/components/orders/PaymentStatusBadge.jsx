const paymentConfig = {
    unpaid: {
        label: "Unpaid",
        className:
            "border-red-500/20 bg-red-500/5 text-red-400",
    },

    partially_paid: {
        label: "Partial",
        className:
            "border-yellow-500/20 bg-yellow-500/5 text-yellow-400",
    },

    paid: {
        label: "Paid",
        className:
            "border-command-green/20 bg-command-green/5 text-command-green",
    },
};

const PaymentStatusBadge = ({
    status,
}) => {
    const config =
        paymentConfig[status] ||
        paymentConfig.unpaid;

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] ${config.className}`}
        >
            {config.label}
        </span>
    );
};

export default PaymentStatusBadge;
