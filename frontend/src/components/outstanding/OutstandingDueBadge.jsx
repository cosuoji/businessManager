import { AlertCircle, CalendarClock, CheckCircle2 } from "lucide-react";

const getDueState = (dueDate) => {
    if (!dueDate) {
        return {
            type: "none",
            label: "No due date",
            icon: CalendarClock,
        };
    }

    const now = new Date();

    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    const difference =
        Math.ceil(
            (due.getTime() - today.getTime()) /
                (1000 * 60 * 60 * 24)
        );

    if (difference < 0) {
        return {
            type: "overdue",
            label: `${Math.abs(difference)} day${
                Math.abs(difference) === 1 ? "" : "s"
            } overdue`,
            icon: AlertCircle,
        };
    }

    if (difference === 0) {
        return {
            type: "today",
            label: "Due today",
            icon: AlertCircle,
        };
    }

    return {
        type: "upcoming",
        label: `${difference} day${
            difference === 1 ? "" : "s"
        }`,
        icon: CheckCircle2,
    };
};

const OutstandingDueBadge = ({ dueDate }) => {
    const state = getDueState(dueDate);

    const Icon = state.icon;

    const styles = {
        overdue:
            "text-red-400 bg-red-400/10 border-red-400/20",

        today:
            "text-amber-400 bg-amber-400/10 border-amber-400/20",

        upcoming:
            "text-command-green bg-command-green/10 border-command-green/20",

        none:
            "command-muted bg-command-black border-command-border",
    };

    return (
        <span
            className={`
                inline-flex
                items-center
                gap-1.5
                rounded-md
                border
                px-2
                py-1
                text-xs
                font-medium
                ${styles[state.type]}
            `}
        >
            <Icon size={13} />
            {state.label}
        </span>
    );
};

export default OutstandingDueBadge;
