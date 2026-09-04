import {
    CheckCircle2,
    CircleDollarSign,
    Clock3,
} from "lucide-react";

const statusConfig = {
    unpaid: {
        label: "Unpaid",
        icon: Clock3,
        className:
            "border-command-border bg-command-black text-command-muted",
    },

    partially_paid: {
        label: "Partially paid",
        icon: CircleDollarSign,
        className:
            "border-amber-500/20 bg-amber-500/5 text-amber-400",
    },

    paid: {
        label: "Paid",
        icon: CheckCircle2,
        className:
            "border-command-green/20 bg-command-green/5 text-command-green",
    },
};

const InvoiceStatusBadge = ({
    status,
}) => {
    const config =
        statusConfig[status] ||
        statusConfig.unpaid;

    const Icon = config.icon;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium ${config.className}`}
        >
            <Icon
                size={12}
                strokeWidth={1.7}
            />

            {config.label}
        </span>
    );
};

export default InvoiceStatusBadge;
