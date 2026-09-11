const AdminSubscriptionBadge = ({ subscription }) => {
  const plan = subscription?.plan || "free";
  const source = subscription?.source;

  if (plan === "pro") {
    return (
      <div>
        <span className="inline-flex rounded-full border border-command-border px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider">
          Pro
        </span>

        {source && (
          <div className="mt-1 text-[10px] text-command-muted">
            {source === "admin"
              ? "Admin managed"
              : "Flutterwave"}
          </div>
        )}
      </div>
    );
  }

  return (
    <span className="inline-flex rounded-full border border-command-border px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-command-muted">
      Free
    </span>
  );
};

export default AdminSubscriptionBadge;
