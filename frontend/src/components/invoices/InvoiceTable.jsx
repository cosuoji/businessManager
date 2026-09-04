import {
    Download,
    Eye,
    FileText,
} from "lucide-react";
import {
    useState,
} from "react";
import {
    Link,
} from "react-router-dom";

import InvoiceStatusBadge from "./InvoiceStatusBadge";
import { downloadInvoice } from "../../services/invoices";

const formatAmount = (
    amount
) =>
    `₦${Number(
        amount || 0
    ).toLocaleString(
        undefined,
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    )}`;

const formatDate = (
    date
) => {
    if (!date) {
        return "—";
    }

    return new Date(
        date
    ).toLocaleDateString(
        undefined,
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        }
    );
};

const InvoiceTable = ({
    invoices,
    loading,
}) => {
  const [downloadingId, setDownloadingId] =
      useState(null);

  const handleDownload = async (
      orderId
  ) => {
      try {
          setDownloadingId(orderId);

          await downloadInvoice(orderId);
      } catch (error) {
          console.error(
              "Unable to download invoice",
              error
          );
      } finally {
          setDownloadingId(null);
      }
  };

    if (loading) {
        return (
            <div className="divide-y divide-command-border">
                {Array.from({
                    length: 5,
                }).map((_, index) => (
                    <div
                        key={index}
                        className="grid animate-pulse grid-cols-5 gap-4 px-5 py-5"
                    >
                        <div className="h-4 rounded bg-command-black" />
                        <div className="h-4 rounded bg-command-black" />
                        <div className="h-4 rounded bg-command-black" />
                        <div className="h-4 rounded bg-command-black" />
                        <div className="h-4 rounded bg-command-black" />
                    </div>
                ))}
            </div>
        );
    }

    if (!invoices.length) {
        return (
            <div className="px-5 py-14 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-command-md border border-command-border bg-command-black text-command-muted">
                    <FileText size={18} />
                </div>

                <p className="mt-4 text-sm font-medium">
                    No invoices found
                </p>

                <p className="mt-1 text-xs text-command-muted">
                    Generated invoices will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
                <thead>
                    <tr className="border-b border-command-border text-left">
                        <th className="px-5 py-3 font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                            Invoice
                        </th>

                        <th className="px-5 py-3 font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                            Customer
                        </th>

                        <th className="px-5 py-3 font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                            Order
                        </th>

                        <th className="px-5 py-3 font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                            Amount
                        </th>

                        <th className="px-5 py-3 font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                            Status
                        </th>

                        <th className="px-5 py-3 text-right font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-command-border">
                    {invoices.map(
                        (invoice) => (
                            <tr
                                key={
                                    invoice._id
                                }
                                className="transition hover:bg-command-black/30"
                            >
                                <td className="px-5 py-4">
                                    <Link
                                        to={`/invoices/${invoice._id}`}
                                        className="font-mono text-xs font-medium text-command-green hover:text-command-green/80"
                                    >
                                        {
                                            invoice.invoiceNumber
                                        }
                                    </Link>

                                    <p className="mt-1 text-[10px] text-command-muted">
                                        {
                                            formatDate(
                                                invoice.createdAt
                                            )
                                        }
                                    </p>
                                </td>

                                <td className="px-5 py-4">
                                    <p className="text-sm font-medium">
                                        {
                                            invoice
                                                .customerId
                                                ?.name ||
                                            "Unknown customer"
                                        }
                                    </p>

                                    <p className="mt-1 text-[10px] text-command-muted">
                                        {
                                            invoice
                                                .customerId
                                                ?.phone ||
                                            "—"
                                        }
                                    </p>
                                </td>

                                <td className="px-5 py-4">
                                    <Link
                                        to={`/orders/${invoice._id}`}
                                        className="font-mono text-xs text-command-muted hover:text-command-white"
                                    >
                                        {
                                            invoice.orderNumber
                                        }
                                    </Link>
                                </td>

                                <td className="px-5 py-4">
                                    <span className="font-mono text-sm">
                                        {formatAmount(
                                            invoice.total
                                        )}
                                    </span>
                                </td>

                                <td className="px-5 py-4">
                                    <InvoiceStatusBadge
                                        status={
                                            invoice.paymentStatus
                                        }
                                    />
                                </td>

                                <td className="px-5 py-4">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            to={`/invoices/${invoice._id}`}
                                            className="inline-flex h-8 items-center gap-1.5 rounded-command-md border border-command-border px-2.5 text-[10px] text-command-muted transition hover:bg-command-black hover:text-command-white"
                                        >
                                            <Eye
                                                size={
                                                    13
                                                }
                                            />

                                            {/* Preview*/}
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDownload(
                                                    invoice._id
                                                )
                                            }
                                            className="inline-flex h-8 items-center gap-1.5 rounded-command-md border border-command-border px-2.5 text-[10px] text-command-muted transition hover:bg-command-black hover:text-command-white"
                                        >
                                            <Download
                                                size={
                                                    13
                                                }
                                            />

                                            {/* Download*/}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default InvoiceTable;
