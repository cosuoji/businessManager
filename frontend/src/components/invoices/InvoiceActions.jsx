import {
    ArrowLeft,
    Download,
} from "lucide-react";

const InvoiceActions = ({
    invoice,
    onBack,
    onDownload,
    downloading = false,
}) => {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
                type="button"
                onClick={onBack}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-command-md border border-command-border px-4 text-xs font-medium text-command-muted transition hover:bg-command-surface hover:text-command-white"
            >
                <ArrowLeft size={14} />

                Back to order
            </button>

            <button
                type="button"
                onClick={onDownload}
                disabled={downloading}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-command-md bg-command-green px-4 text-xs font-semibold text-[#061008] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <Download size={14} />

                {downloading
                    ? "Preparing PDF..."
                    : "Download PDF"}
            </button>
        </div>
    );
};

export default InvoiceActions;
