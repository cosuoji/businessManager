const AdminInfoRow = ({
  label,
  value,
  mono = false,
}) => {
  return (
    <div className="flex flex-col gap-1 border-b border-command-border py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-command-muted">
        {label}
      </span>

      <span
        className={[
          "text-sm sm:text-right",
          mono ? "font-mono text-xs" : "",
        ].join(" ")}
      >
        {value || "—"}
      </span>
    </div>
  );
};

export default AdminInfoRow;
