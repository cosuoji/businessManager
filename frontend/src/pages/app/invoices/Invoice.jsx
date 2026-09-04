import {
    ArrowLeft,
    AlertCircle,
} from "lucide-react";

import {
    Link,
    useParams,
} from "react-router-dom";

import useInvoice from "../../../hooks/useInvoice";
import { InvoicePreview } from "../../../components/invoices/InvoicePreview";

const Invoice = () => {
    const { orderId } = useParams();

    const {
        invoice,
        loading,
        error,
        refetch,
    } = useInvoice(orderId);

    console.log(invoice)

    if (loading) {
        return (
            <div>
                <Link
                    to="/invoices"
                    className="inline-flex items-center gap-2 text-xs text-command-muted transition hover:text-command-white"
                >
                    <ArrowLeft size={14} />
                    Back to invoices
                </Link>

                <div className="mt-6">
                    <div className="h-7 w-48 animate-pulse rounded bg-command-surface" />

                    <div className="mt-2 h-4 w-72 animate-pulse rounded bg-command-surface" />
                </div>

                <div className="mx-auto mt-8 max-w-4xl animate-pulse">
                    <div className="min-h-[700px] rounded-command-lg border border-command-border bg-command-surface" />
                </div>
            </div>
        );
    }

    if (error || !invoice) {
        return (
            <div>
                <Link
                    to="/invoices"
                    className="inline-flex items-center gap-2 text-xs text-command-muted transition hover:text-command-white"
                >
                    <ArrowLeft size={14} />
                    Back to invoices
                </Link>

                <div className="mx-auto mt-10 max-w-xl rounded-command-lg border border-red-500/20 bg-red-500/5 p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle
                            size={18}
                            className="mt-0.5 shrink-0 text-red-400"
                        />

                        <div>
                            <h1 className="text-sm font-semibold text-red-400">
                                Unable to load invoice
                            </h1>

                            <p className="mt-2 text-xs leading-5 text-command-muted">
                                {error?.message ||
                                    "The invoice could not be loaded."}
                            </p>

                            <button
                                type="button"
                                onClick={refetch}
                                className="mt-4 text-xs font-medium text-command-green transition hover:text-command-green/80"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* PAGE NAVIGATION */}

            <Link
                to="/invoices"
                className="inline-flex items-center gap-2 text-xs text-command-muted transition hover:text-command-white"
            >
                <ArrowLeft size={14} />
                Back to invoices
            </Link>

            {/* PAGE HEADER */}

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-command-green">
                        Finance
                    </p>

                    <h1 className="mt-1 font-mono text-2xl font-semibold tracking-tight">
                        Invoice
                    </h1>

                    <p className="mt-2 text-sm text-command-muted">
                        {invoice.invoiceNumber}
                    </p>
                </div>
            </div>

            {/* INVOICE */}

            <div className="mt-8">
                <InvoicePreview
                    invoice={invoice}
                    orderId={orderId}
                />
            </div>
        </div>
    );
};

export default Invoice;
