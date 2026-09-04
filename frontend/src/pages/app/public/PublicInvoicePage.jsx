import {
  AlertCircle,
  ArrowDownToLine,
  Building2,
  CalendarDays,
  CheckCircle2,
  FileText,
  Loader2,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getPublicInvoice,
  downloadPublicInvoice,
} from "../../../services/invoice.public";

const formatCurrency = (
  amount,
  currency = "NGN"
) => {
  return new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }
  ).format(amount || 0);
};

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-NG",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(new Date(date));
};

const PublicInvoicePage = () => {
  const { token } = useParams();

  const [invoice, setInvoice] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [downloading, setDownloading] =
    useState(false);

  useEffect(() => {
    const loadInvoice = async () => {
      if (!token) {
        setError(
          "This invoice link is invalid."
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response =
          await getPublicInvoice(token);

        setInvoice(response.data);
      } catch (error) {
        console.error(
          "Unable to load invoice:",
          error
        );

        setError(
          error.message ||
            "Unable to load this invoice."
        );
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [token]);

  const handleDownload = async () => {
    if (!token || !invoice) {
      return;
    }

    try {
      setDownloading(true);

      const response =
        await downloadPublicInvoice(
          token
        );

      const blob =
        response.data || response;

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `${invoice.invoiceNumber}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Unable to download invoice:",
        error
      );

      setError(
        "Unable to download the invoice. Please try again."
      );
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-command-black px-4 py-12 text-command-white">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <div className="text-center">
            <Loader2
              size={28}
              className="mx-auto animate-spin text-command-green"
            />

            <p className="mt-4 text-sm font-medium">
              Loading invoice...
            </p>

            <p className="mt-1 text-xs text-command-muted">
              Please wait a moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-command-black px-4 py-12 text-command-white">
        <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center">
          <div className="w-full rounded-command-lg border border-command-border bg-command-surface p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
              <AlertCircle size={22} />
            </div>

            <h1 className="mt-5 text-lg font-semibold">
              Invoice unavailable
            </h1>

            <p className="mt-2 text-sm leading-6 text-command-muted">
              {error ||
                "We couldn't find this invoice."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const {
    invoiceNumber,
    business,
    customer,
    order,
    items,
    subtotal,
    discount,
    total,
    totalPaid,
    balance,
    paymentStatus,
    currency,
    notes,
  } = invoice;

  const isPaid =
    paymentStatus === "paid";

  const isPartiallyPaid =
    paymentStatus ===
    "partially_paid";

  return (
    <div className="min-h-screen bg-command-black text-command-white">
      {/* HEADER */}

      <header className="border-b border-command-border bg-command-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-command-md bg-command-green text-command-black">
              <FileText size={18} />
            </div>

            <div>
              <p className="text-sm font-semibold">
                {business?.name ||
                  "BizFlow"}
              </p>

              <p className="text-[10px] uppercase tracking-[0.15em] text-command-muted">
                Invoice
              </p>
            </div>
          </div>

          <div className="hidden text-right sm:block">
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
              Invoice number
            </p>

            <p className="mt-1 text-sm font-semibold">
              {invoiceNumber}
            </p>
          </div>
        </div>
      </header>

      {/* CONTENT */}

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* INVOICE HEADER */}

        <section className="rounded-command-lg border border-command-border bg-command-surface shadow-2xl">
          <div className="border-b border-command-border p-5 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-command-muted">
                  Invoice
                </p>

                <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {invoiceNumber}
                </h1>

                <div className="mt-4 flex items-center gap-2 text-xs text-command-muted">
                  <CalendarDays
                    size={14}
                  />

                  <span>
                    Issued{" "}
                    {formatDate(
                      order?.date
                    )}
                  </span>
                </div>

                {order?.dueDate && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-command-muted">
                    <CalendarDays
                      size={14}
                    />

                    <span>
                      Due{" "}
                      {formatDate(
                        order.dueDate
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* STATUS */}

              <div>
                {isPaid ? (
                  <div className="inline-flex items-center gap-2 rounded-full border border-command-green/20 bg-command-green/10 px-3 py-1.5 text-xs font-medium text-command-green">
                    <CheckCircle2
                      size={14}
                    />
                    Paid
                  </div>
                ) : isPartiallyPaid ? (
                  <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1.5 text-xs font-medium text-yellow-400">
                    Partially paid
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-full border border-command-border bg-command-black/40 px-3 py-1.5 text-xs font-medium text-command-muted">
                    Unpaid
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* BUSINESS / CUSTOMER */}

          <div className="grid border-b border-command-border sm:grid-cols-2">
            <div className="border-b border-command-border p-5 sm:border-b-0 sm:border-r sm:p-8">
              <div className="flex items-center gap-2">
                <Building2
                  size={14}
                  className="text-command-green"
                />

                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                  From
                </p>
              </div>

              <p className="mt-3 text-sm font-semibold">
                {business?.name ||
                  "—"}
              </p>

              {business?.address && (
                <p className="mt-2 whitespace-pre-line text-xs leading-5 text-command-muted">
                  {business.address}
                </p>
              )}

              {business?.phone && (
                <p className="mt-2 text-xs text-command-muted">
                  {business.phone}
                </p>
              )}

              {business?.email && (
                <p className="mt-1 text-xs text-command-muted">
                  {business.email}
                </p>
              )}
            </div>

            <div className="p-5 sm:p-8">
              <div className="flex items-center gap-2">
                <UserRound
                  size={14}
                  className="text-command-green"
                />

                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                  Bill to
                </p>
              </div>

              <p className="mt-3 text-sm font-semibold">
                {customer?.name ||
                  "—"}
              </p>

              {customer?.address && (
                <p className="mt-2 whitespace-pre-line text-xs leading-5 text-command-muted">
                  {customer.address}
                </p>
              )}

              {customer?.phone && (
                <p className="mt-2 text-xs text-command-muted">
                  {customer.phone}
                </p>
              )}

              {customer?.email && (
                <p className="mt-1 text-xs text-command-muted">
                  {customer.email}
                </p>
              )}
            </div>
          </div>

          {/* ITEMS */}

          <div className="p-5 sm:p-8">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px]">
                <thead>
                  <tr className="border-b border-command-border">
                    <th className="pb-3 text-left font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                      Item
                    </th>

                    <th className="pb-3 text-right font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                      Qty
                    </th>

                    <th className="pb-3 text-right font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                      Price
                    </th>

                    <th className="pb-3 text-right font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {items?.map(
                    (item, index) => (
                      <tr
                        key={`${item.name}-${index}`}
                        className="border-b border-command-border last:border-0"
                      >
                        <td className="py-4 pr-4 text-sm">
                          {item.name}
                        </td>

                        <td className="py-4 text-right text-xs text-command-muted">
                          {item.quantity}
                        </td>

                        <td className="py-4 text-right text-xs text-command-muted">
                          {formatCurrency(
                            item.sellingPrice,
                            currency
                          )}
                        </td>

                        <td className="py-4 text-right text-sm font-medium">
                          {formatCurrency(
                            item.total,
                            currency
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* TOTALS */}

            <div className="mt-8 ml-auto max-w-sm space-y-3">
              <div className="flex items-center justify-between text-xs text-command-muted">
                <span>
                  Subtotal
                </span>

                <span>
                  {formatCurrency(
                    subtotal,
                    currency
                  )}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between text-xs text-command-muted">
                  <span>
                    Discount
                  </span>

                  <span>
                    -
                    {formatCurrency(
                      discount,
                      currency
                    )}
                  </span>
                </div>
              )}

              <div className="border-t border-command-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Total
                  </span>

                  <span className="text-lg font-semibold">
                    {formatCurrency(
                      total,
                      currency
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-command-muted">
                <span>
                  Paid
                </span>

                <span>
                  {formatCurrency(
                    totalPaid,
                    currency
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm font-semibold">
                <span>
                  Balance
                </span>

                <span
                  className={
                    balance > 0
                      ? "text-command-green"
                      : ""
                  }
                >
                  {formatCurrency(
                    balance,
                    currency
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* NOTES */}

          {notes && (
            <div className="border-t border-command-border px-5 py-5 sm:px-8">
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                Notes
              </p>

              <p className="mt-2 whitespace-pre-line text-xs leading-6 text-command-muted">
                {notes}
              </p>
            </div>
          )}

          {/* DOWNLOAD */}

          <div className="border-t border-command-border bg-command-black/20 p-5 sm:p-8">
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-command-md bg-command-green px-5 py-3 text-sm font-semibold text-command-black transition hover:bg-command-green/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {downloading ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  Preparing PDF...
                </>
              ) : (
                <>
                  <ArrowDownToLine
                    size={16}
                  />
                  Download Invoice PDF
                </>
              )}
            </button>

            <p className="mt-3 text-[10px] text-command-muted">
              This invoice was generated
              through BizFlow.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PublicInvoicePage;
