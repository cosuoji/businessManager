const Badge = ({
    children,
    dot = false,
}) => {
    return (
        <span className="inline-flex items-center gap-2 rounded-command-pill border border-command-border bg-command-surface px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-command-muted">
            {dot && (
                <span className="h-1.5 w-1.5 animate-command-pulse rounded-full bg-command-green" />
            )}

            {children}
        </span>
    );
};

export default Badge;
