
const EmptyState = ({
    title,
    description,
}) => {
    return (
        <div className="flex min-h-52 flex-col items-center justify-center rounded-command-lg border border-dashed border-command-border bg-command-surface/40 px-6 text-center">
            <div className="mb-4 h-2 w-2 rounded-full bg-command-muted/40" />

            <p className="text-sm font-medium text-command-white">
                {title}
            </p>

            <p className="mt-2 max-w-sm text-xs leading-5 text-command-muted">
                {description}
            </p>
        </div>
    );
};

export default EmptyState;
