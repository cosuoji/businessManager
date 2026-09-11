import { Check, X } from "lucide-react";
import { useState } from "react";

const PRESETS = [7, 14, 30, 60, 90];

const GrantProModal = ({
  open,
  userName,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  const [days, setDays] = useState(30);
  const [customDays, setCustomDays] = useState("");

  if (!open) return null;

  const isCustom = days === "custom";

  const selectedDays = isCustom
    ? Number(customDays)
    : days;

  const isValid =
    Number.isInteger(selectedDays) &&
    selectedDays >= 1 &&
    selectedDays <= 3650;

  const handleConfirm = () => {
    if (!isValid) return;

    onConfirm(selectedDays);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={loading ? undefined : onCancel}
      />

      <div className="relative w-full max-w-md rounded-command-lg border border-command-border bg-command-surface shadow-2xl">
        <div className="flex items-start justify-between border-b border-command-border p-5">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-command-muted">
              Admin action
            </p>

            <h3 className="mt-1 text-sm font-medium">
              Grant Pro access
            </h3>

            <p className="mt-1 text-xs leading-5 text-command-muted">
              Give {userName || "this user"} temporary Pro access.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="text-command-muted transition hover:text-white disabled:opacity-50"
          >
            <X size={17} />
          </button>
        </div>

        <div className="p-5">
          <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-command-muted">
            Duration
          </p>

          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((preset) => {
              const selected = days === preset;

              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setDays(preset)}
                  disabled={loading}
                  className={[
                    "rounded-command-lg border px-3 py-3 text-xs transition",
                    selected
                      ? "border-white bg-white text-black"
                      : "border-command-border hover:bg-white/5",
                  ].join(" ")}
                >
                  {preset} days
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setDays("custom")}
              disabled={loading}
              className={[
                "rounded-command-lg border px-3 py-3 text-xs transition",
                isCustom
                  ? "border-white bg-white text-black"
                  : "border-command-border hover:bg-white/5",
              ].join(" ")}
            >
              Custom
            </button>
          </div>

          {isCustom && (
            <div className="mt-4">
              <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.16em] text-command-muted">
                Number of days
              </label>

              <input
                type="number"
                min="1"
                max="3650"
                value={customDays}
                onChange={(event) =>
                  setCustomDays(event.target.value)
                }
                disabled={loading}
                placeholder="Enter days"
                className="w-full rounded-command-lg border border-command-border bg-command-black px-3 py-3 text-sm outline-none transition focus:border-white"
              />

              <p className="mt-2 text-[11px] text-command-muted">
                Maximum 3650 days.
              </p>
            </div>
          )}

          <div className="mt-5 rounded-command-lg border border-command-border bg-white/[0.02] p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <Check size={15} className="text-command-muted" />
              </div>

              <div>
                <p className="text-xs font-medium">
                  Admin-managed access
                </p>

                <p className="mt-1 text-[11px] leading-5 text-command-muted">
                  This grants Pro access without creating a
                  recurring Flutterwave subscription.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-command-border p-5">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-command-lg border border-command-border px-4 py-2 text-xs font-medium transition hover:bg-white/5 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading || !isValid}
            className="rounded-command-lg bg-white px-4 py-2 text-xs font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Granting..." : "Grant Pro"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GrantProModal;
