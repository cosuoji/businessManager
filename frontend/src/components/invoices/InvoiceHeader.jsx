import {
    FileText,
} from "lucide-react";

const formatDate = (date) => {
    if (!date) {
        return "—";
    }

    return new Date(date).toLocaleDateString(
        undefined,
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        }
    );
};

const InvoiceHeader = ({
    invoice,
}) => {
    if (!invoice) {
        return null;
    }

    const {
        invoiceNumber,
        business,
        customer,
        order,
    } = invoice;

    return (
        <div className="border-b border-command-border px-5 py-6 sm:px-8 sm:py-7">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                {/* BUSINESS */}

                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-command-md border border-command-border bg-command-black text-command-green">
                            <FileText size={18} />
                        </div>

                        <div>
                            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-command-green">
                                Invoice
                            </p>

                            <h1 className="mt-1 font-mono text-xl font-semibold tracking-tight">
                                {invoiceNumber}
                            </h1>
                        </div>
                    </div>

                    <div className="mt-6">
                        <p className="text-sm font-semibold">
                            {business?.name ||
                                "Business"}
                        </p>

                        {business?.address && (
                            <p className="mt-1 max-w-sm whitespace-pre-line text-xs leading-5 text-command-muted">
                                {business.address}
                            </p>
                        )}

                        {business?.phone && (
                            <p className="mt-1 text-xs text-command-muted">
                                {business.phone}
                            </p>
                        )}

                        {business?.email && (
                            <p className="mt-1 text-xs text-command-muted">
                                {business.email}
                            </p>
                        )}
                    </div>
                </div>

                {/* INVOICE META */}

                <div className="grid grid-cols-2 gap-x-8 gap-y-4 md:text-right">
                    <div>
                        <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                            Invoice date
                        </p>

                        <p className="mt-1 text-sm">
                            {formatDate(
                                order?.date
                            )}
                        </p>
                    </div>

                    <div>
                        <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                            Due date
                        </p>

                        <p className="mt-1 text-sm">
                            {formatDate(
                                order?.dueDate
                            )}
                        </p>
                    </div>

                    <div>
                        <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                            Order
                        </p>

                        <p className="mt-1 font-mono text-sm">
                            {order?.orderNumber ||
                                "—"}
                        </p>
                    </div>

                    <div>
                        <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                            Bill to
                        </p>

                        <p className="mt-1 text-sm">
                            {customer?.name ||
                                "—"}
                        </p>
                    </div>
                </div>
            </div>

            {/* CUSTOMER */}

            <div className="mt-7 border-t border-command-border pt-6">
                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                    Customer
                </p>

                <div className="mt-2">
                    <p className="text-sm font-medium">
                        {customer?.name}
                    </p>

                    <div className="mt-1 flex flex-col gap-1 text-xs text-command-muted sm:flex-row sm:gap-4">
                        {customer?.phone && (
                            <span>
                                {customer.phone}
                            </span>
                        )}

                        {customer?.email && (
                            <span>
                                {customer.email}
                            </span>
                        )}
                    </div>

                    {customer?.address && (
                        <p className="mt-1 whitespace-pre-line text-xs text-command-muted">
                            {customer.address}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvoiceHeader;
