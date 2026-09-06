const UsageMeter = ({
    label,
    used = 0,
    limit,
}) => {
    const isUnlimited =
        limit === null;

    const percentage =
        isUnlimited
            ? 0
            : Math.min(
                  (used / limit) * 100,
                  100
              );



    const isReached =
        !isUnlimited &&
        used >= limit;

    const isAlmostReached =
        !isUnlimited &&
        used >= limit * 0.8 &&
        !isReached;

    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] text-command-muted">
                    {label}
                </span>

                <span
                    className={`font-mono text-[10px] ${
                        isReached
                            ? "text-red-400"
                            : isAlmostReached
                            ? "text-amber-400"
                            : "text-command-muted"
                    }`}
                >
                    {isUnlimited
                        ? `${used} / Unlimited`
                        : `${used} / ${limit}`}
                </span>
            </div>

            {!isUnlimited && (
                <div className="h-1 overflow-hidden rounded-full bg-command-black">
                    <div
                        className={`h-full rounded-full transition-all ${
                            isReached
                                ? "bg-red-400"
                                : isAlmostReached
                                ? "bg-amber-400"
                                : "bg-command-green"
                        }`}
                        style={{
                            width: `${percentage}%`,
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default UsageMeter;
