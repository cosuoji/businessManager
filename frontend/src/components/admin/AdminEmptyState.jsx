import { RefreshCw } from "lucide-react";

const AdminLoadingState = ({
  message = "Loading...",
}) => {
  return (
    <div className="rounded-command-lg border border-command-border bg-command-surface px-6 py-16 text-center">
      <RefreshCw
        size={18}
        className="mx-auto animate-spin text-command-muted"
      />

      <p className="mt-3 text-xs text-command-muted">
        {message}
      </p>
    </div>
  );
};

export default AdminLoadingState;
