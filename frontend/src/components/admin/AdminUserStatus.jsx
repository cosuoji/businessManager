const AdminUserStatus = ({ status }) => {
  const isSuspended = status === "suspended";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1",
        "font-mono text-[9px] uppercase tracking-wider",
        isSuspended
          ? "border-command-border text-command-muted"
          : "border-command-border text-white",
      ].join(" ")}
    >
      <span
        className={[
          "mr-1.5 h-1.5 w-1.5 rounded-full",
          isSuspended
            ? "bg-command-muted"
            : "bg-white",
        ].join(" ")}
      />

      {isSuspended ? "Suspended" : "Active"}
    </span>
  );
};

export default AdminUserStatus;
