const StatCard = ({
    label,
    value,
    meta,
    icon: Icon,
    accent = false,
}) => {
    return (
        <div
            className={`group relative overflow-hidden rounded-command-lg border p-5 transition duration-300 ${
                accent
                    ? "border-command-green/20 bg-command-green/[0.04]"
                    : "border-command-border bg-command-surface"
            }`}
        >
            {/* subtle glow */}

            {accent && (
                <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-command-green/10 blur-3xl" />
            )}

            <div className="relative">
                <div className="flex items-start justify-between">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-command-muted">
                        {label}
                    </p>

                    {Icon && (
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-command-sm border ${
                                accent
                                    ? "border-command-green/20 bg-command-green/10 text-command-green"
                                    : "border-command-border text-command-muted"
                            }`}
                        >
                            <Icon
                                size={15}
                                strokeWidth={1.7}
                            />
                        </div>
                    )}
                </div>

                <p className="mt-5 text-2xl font-semibold tracking-tight text-command-white sm:text-3xl">
                    {value}
                </p>

                {meta && (
                    <p className="mt-2 text-xs text-command-muted">
                        {meta}
                    </p>
                )}
            </div>
        </div>
    );
};

export default StatCard;
