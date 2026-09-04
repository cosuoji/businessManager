const STATUS_CONFIG = {
    unpaid: {
        label: "Unpaid",
        className:
            "text-red-400 bg-red-400/10 border-red-400/20",
    },

    partially_paid: {
        label: "Partially Paid",
        className:
            "text-amber-400 bg-amber-400/10 border-amber-400/20",
    },

    paid: {
        label: "Paid",
        className:
            "text-command-green bg-command-green/10 border-command-green/20",
    },
};

const OutstandingStatusBadge = ({ status }) => {
    const config =
        STATUS_CONFIG[status] || STATUS_CONFIG.unpaid;

    return (
        <span
            className={`
                inline-flex
                items-center
                rounded-md
                border
                px-2
                py-1
                text-xs
                font-medium
                ${config.className}
            `}
        >
            {config.label}
        </span>
    );
};

export default OutstandingStatusBadge;
