import InvoiceHeader from "./InvoiceHeader";
import InvoiceItems from "./InvoiceItems";
import InvoiceTotals from "./InvoiceTotals";
import InvoiceActions from "./InvoiceActions";

export const InvoicePreview = ({
    invoice,
    orderId,
}) => {
  console.log(invoice);
    return (
        <div className="mx-auto max-w-4xl">
            <div className="rounded-command-lg border border-command-border bg-command-surface shadow-2xl">

                <InvoiceHeader
                    invoice={invoice}
                />

                <InvoiceItems
                    items={invoice.items}
                    currency={invoice.currency}
                />

                <InvoiceTotals
                    invoice={invoice}
                />

            </div>
        </div>
    );
};
