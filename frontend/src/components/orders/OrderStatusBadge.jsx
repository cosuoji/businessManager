const statusConfig = {
    pending: {
        label: "Pending",
        className:
            "border-yellow-500/20 bg-yellow-500/5 text-yellow-400",
    },

    confirmed: {
        label: "Confirmed",
        className:
            "border-blue-500/20 bg-blue-500/5 text-blue-400",
    },

    processing: {
        label: "Processing",
        className:
            "border-purple-500/20 bg-purple-500/5 text-purple-400",
    },

    ready: {
        label: "Ready",
        className:
            "border-cyan-500/20 bg-cyan-500/5 text-cyan-400",
    },

    completed: {
        label: "Completed",
        className:
            "border-command-green/20 bg-command-green/5 text-command-green",
    },

    cancelled: {
        label: "Cancelled",
        className:
            "border-red-500/20 bg-red-500/5 text-red-400",
    },
};

const OrderStatusBadge = ({
    status,
}) => {
    const config =
        statusConfig[status] ||
        statusConfig.pending;

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] ${config.className}`}
        >
            {config.label}
        </span>
    );
};

export default OrderStatusBadge;
