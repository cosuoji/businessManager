import { AlertCircle, RefreshCw } from "lucide-react";

const AdminErrorState = ({
  message = "Something went wrong.",
  onRetry,
}) => {
  return (
    <div className="rounded-command-lg border border-red-500/20 bg-red-500/5 px-6 py-12 text-center">
      <AlertCircle
        size={18}
        className="mx-auto text-red-400"
      />

      <p className="mt-3 text-sm">
        Unable to load this section.
      </p>

      <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-command-muted">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-command-lg border border-command-border px-4 py-2.5 text-xs transition hover:bg-white/5"
        >
          <RefreshCw size={13} />
          Try again
        </button>
      )}
    </div>
  );
};

export default AdminErrorState;
