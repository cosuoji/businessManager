import {
    AlertCircle,
    FileText,
} from "lucide-react";

import {
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import useInvoice from "../../../hooks/useInvoice";

import {
    downloadInvoice,
} from "../../../services/invoices";

import { InvoicePreview } from "../../../components/invoices/InvoicePreview";
import InvoiceActions from "../../../components/invoices/InvoiceActions";

const InvoicePage = () => {
    const { id } =
        useParams();

    const navigate =
        useNavigate();

    const {
        invoice,
        loading,
        error,
    } = useInvoice(id);

    const [downloading, setDownloading] =
        useState(false);

    const handleDownload =
        async () => {
            if (!invoice) {
                return;
            }

            setDownloading(true);

            try {
                const response =
                    await downloadInvoice(
                        id
                    );

                const blob =
                    response.data ||
                    response;

                const url =
                    window.URL.createObjectURL(
                        blob
                    );

                const link =
                    document.createElement(
                        "a"
                    );

                link.href = url;

                link.download =
                    `${invoice.invoiceNumber}.pdf`;

                document.body.appendChild(
                    link
                );

                link.click();

                link.remove();

                window.URL.revokeObjectURL(
                    url
                );
            } catch (error) {
                console.error(
                    "Unable to download invoice:",
                    error
                );
            } finally {
                setDownloading(false);
            }
        };

    if (loading) {
        return (
            <div>
                <div className="animate-pulse">
                    <div className="h-4 w-32 rounded bg-command-surface" />

                    <div className="mt-6 h-8 w-56 rounded bg-command-surface" />

                    <div className="mt-3 h-4 w-72 rounded bg-command-surface" />

                    <div className="mt-8 overflow-hidden rounded-command-lg border border-command-border bg-command-surface">
                        <div className="h-48 border-b border-command-border bg-command-black/30" />

                        <div className="h-72 bg-command-surface" />

                        <div className="h-48 border-t border-command-border bg-command-black/20" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !invoice) {
        return (
            <div>
                <div className="flex items-center gap-2 text-command-green">
                    <FileText size={16} />

                    <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
                        Invoice
                    </span>
                </div>

                <div className="mt-8 rounded-command-lg border border-red-500/20 bg-red-500/5 p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle
                            size={18}
                            className="mt-0.5 shrink-0 text-red-400"
                        />

                        <div>
                            <p className="text-sm font-medium text-red-400">
                                Unable to load invoice
                            </p>

                            <p className="mt-2 text-xs leading-5 text-command-muted">
                                {error?.message ||
                                    "Invoice could not be loaded."}
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/orders/${id}`
                                    )
                                }
                                className="mt-4 text-xs font-medium text-command-green hover:text-command-green/80"
                            >
                                Return to order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl">
            {/* PAGE HEADER */}

            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-command-green">
                        <FileText size={15} />

                        <p className="font-mono text-[10px] uppercase tracking-[0.2em]">
                            Finance / Invoice
                        </p>
                    </div>

                    <h1 className="mt-2 font-mono text-2xl font-semibold tracking-tight">
                        {invoice.invoiceNumber}
                    </h1>

                    <p className="mt-2 text-sm text-command-muted">
                        Invoice for order{" "}
                        {invoice.order?.orderNumber}
                    </p>
                </div>
            </div>

            {/* ACTIONS */}

            <div className="mt-6">
                <InvoiceActions
                    invoice={invoice}
                    onBack={() =>
                        navigate(
                            `/orders/${id}`
                        )
                    }
                    onDownload={
                        handleDownload
                    }
                    downloading={
                        downloading
                    }
                />
            </div>

            {/* INVOICE */}

            <div className="mt-6">
                <InvoicePreview
                    invoice={invoice}
                />
            </div>
        </div>
    );
};

export default InvoicePage;
