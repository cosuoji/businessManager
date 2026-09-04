const formatCurrency = (
  amount,
  currency
) => {
  return new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }
  ).format(amount);
};

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-NG",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(new Date(date));
};

const escapeHTML = (value = "") => {
  return String(value)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
};

export const generateInvoiceHTML = (
  invoice
) => {
  const {
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

  const itemRows = items
    .map(
      (item) => `
        <tr>
          <td>${escapeHTML(
            item.name
          )}</td>

          <td class="center">
            ${item.quantity}
          </td>

          <td class="right">
            ${formatCurrency(
              item.sellingPrice,
              currency
            )}
          </td>

          <td class="right">
            ${formatCurrency(
              item.total,
              currency
            )}
          </td>
        </tr>
      `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>
    Invoice ${escapeHTML(
      invoice.invoiceNumber
    )}
  </title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 40px;
      font-family:
        Arial,
        Helvetica,
        sans-serif;

      color: #222;
      background: #fff;

      font-size: 13px;
      line-height: 1.5;
    }

    .invoice {
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      gap: 40px;

      padding-bottom: 30px;
      border-bottom: 2px solid #222;
    }

    .business-name {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .business-details {
      color: #555;
    }

    .invoice-title {
      text-align: right;
    }

    .invoice-title h1 {
      margin: 0 0 8px;
      font-size: 32px;
      letter-spacing: 1px;
    }

    .invoice-number {
      font-size: 14px;
      font-weight: 600;
    }

    .info-section {
      display: flex;
      justify-content: space-between;
      gap: 40px;

      margin: 30px 0;
    }

    .info-box {
      flex: 1;
    }

    .info-label {
      margin-bottom: 8px;

      font-size: 11px;
      font-weight: 700;

      text-transform: uppercase;
      letter-spacing: 0.5px;

      color: #777;
    }

    .customer-name {
      font-weight: 700;
      margin-bottom: 4px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 25px;
    }

    th {
      padding: 12px 10px;

      text-align: left;

      font-size: 11px;
      text-transform: uppercase;

      border-bottom: 1px solid #222;
    }

    td {
      padding: 12px 10px;

      border-bottom: 1px solid #ddd;
    }

    .center {
      text-align: center;
    }

    .right {
      text-align: right;
    }

    .totals {
      width: 320px;
      margin-left: auto;
      margin-top: 25px;
    }

    .total-row {
      display: flex;
      justify-content: space-between;

      padding: 6px 0;
    }

    .grand-total {
      margin-top: 8px;
      padding-top: 12px;

      border-top: 2px solid #222;

      font-size: 16px;
      font-weight: 700;
    }

    .payment-summary {
      margin-top: 10px;
      padding-top: 10px;

      border-top: 1px solid #ddd;
    }

    .balance {
      font-weight: 700;
    }

    .notes {
      margin-top: 35px;
      padding: 15px;

      background: #f7f7f7;

      border-radius: 4px;
    }

    .notes-title {
      font-weight: 700;
      margin-bottom: 5px;
    }

    .footer {
      margin-top: 50px;
      padding-top: 20px;

      border-top: 1px solid #ddd;

      text-align: center;

      color: #777;
      font-size: 11px;
    }

    @media print {
      body {
        padding: 0;
      }

      .invoice {
        max-width: none;
      }
    }
  </style>
</head>

<body>

  <div class="invoice">

    <div class="header">

      <div>
        <div class="business-name">
          ${escapeHTML(
            business.name
          )}
        </div>

        <div class="business-details">
          ${
            business.phone
              ? `${escapeHTML(
                  business.phone
                )}<br>`
              : ""
          }

          ${
            business.email
              ? `${escapeHTML(
                  business.email
                )}<br>`
              : ""
          }

          ${
            business.address
              ? escapeHTML(
                  business.address
                )
              : ""
          }
        </div>
      </div>

      <div class="invoice-title">

        <h1>INVOICE</h1>

        <div class="invoice-number">
          ${escapeHTML(
            invoice.invoiceNumber
          )}
        </div>

      </div>

    </div>

    <div class="info-section">

      <div class="info-box">

        <div class="info-label">
          Bill To
        </div>

        <div class="customer-name">
          ${escapeHTML(
            customer.name
          )}
        </div>

        ${
          customer.phone
            ? `<div>${escapeHTML(
                customer.phone
              )}</div>`
            : ""
        }

        ${
          customer.email
            ? `<div>${escapeHTML(
                customer.email
              )}</div>`
            : ""
        }

        ${
          customer.address
            ? `<div>${escapeHTML(
                customer.address
              )}</div>`
            : ""
        }

      </div>

      <div class="info-box">

        <div class="info-label">
          Invoice Details
        </div>

        <div>
          <strong>Order:</strong>
          ${escapeHTML(
            order.orderNumber
          )}
        </div>

        <div>
          <strong>Date:</strong>
          ${formatDate(order.date)}
        </div>

        <div>
          <strong>Due:</strong>
          ${formatDate(
            order.dueDate
          )}
        </div>

      </div>

    </div>

    <table>

      <thead>
        <tr>
          <th>Item</th>
          <th class="center">Qty</th>
          <th class="right">Price</th>
          <th class="right">Total</th>
        </tr>
      </thead>

      <tbody>
        ${itemRows}
      </tbody>

    </table>

    <div class="totals">

      <div class="total-row">
        <span>Subtotal</span>

        <span>
          ${formatCurrency(
            subtotal,
            currency
          )}
        </span>
      </div>

      ${
        discount > 0
          ? `
            <div class="total-row">
              <span>Discount</span>

              <span>
                -${formatCurrency(
                  discount,
                  currency
                )}
              </span>
            </div>
          `
          : ""
      }

      <div class="total-row grand-total">
        <span>Total</span>

        <span>
          ${formatCurrency(
            total,
            currency
          )}
        </span>
      </div>

      <div class="payment-summary">

        <div class="total-row">
          <span>Amount Paid</span>

          <span>
            ${formatCurrency(
              totalPaid,
              currency
            )}
          </span>
        </div>

        <div class="total-row balance">
          <span>Balance Due</span>

          <span>
            ${formatCurrency(
              balance,
              currency
            )}
          </span>
        </div>

      </div>

    </div>

    ${
      notes
        ? `
          <div class="notes">

            <div class="notes-title">
              Notes
            </div>

            <div>
              ${escapeHTML(notes)}
            </div>

          </div>
        `
        : ""
    }

    <div class="footer">
      Thank you for your business.
    </div>

  </div>

</body>
</html>
`;
};
