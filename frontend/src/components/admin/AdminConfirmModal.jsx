import { AlertTriangle, X } from "lucide-react";

const AdminConfirmModal = ({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
  danger = false,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={loading ? undefined : onCancel}
      />

      <div className="relative w-full max-w-md rounded-command-lg border border-command-border bg-command-surface shadow-2xl">
        <div className="flex items-start justify-between border-b border-command-border p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-command-border">
              <AlertTriangle
                size={17}
                className={
                  danger
                    ? "text-red-400"
                    : "text-command-muted"
                }
              />
            </div>

            <div>
              <h3 className="text-sm font-medium">
                {title}
              </h3>

              <p className="mt-1 text-xs leading-5 text-command-muted">
                {description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="text-command-muted transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        <div className="flex justify-end gap-3 p-5">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-command-lg border border-command-border px-4 py-2 text-xs font-medium transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={[
              "rounded-command-lg px-4 py-2 text-xs font-medium transition",
              danger
                ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                : "bg-white text-black hover:bg-white/90",
              "disabled:cursor-not-allowed disabled:opacity-50",
            ].join(" ")}
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminConfirmModal;
