const AdminStatCard = ({
  label,
  value,
  description,
  icon: Icon,
}) => {
  return (
    <div className="rounded-command-lg border border-command-border bg-command-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-command-muted">
            {label}
          </p>

          <p className="mt-3 text-3xl font-semibold tracking-tight">
            {value}
          </p>

          {description && (
            <p className="mt-2 text-xs text-command-muted">
              {description}
            </p>
          )}
        </div>

        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-command-border bg-command-black">
            <Icon size={17} strokeWidth={1.7} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStatCard;
