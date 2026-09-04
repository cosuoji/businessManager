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

const formatPaymentMethod = (
  method
) => {
  const labels = {
    cash: "Cash",
    bank_transfer: "Bank Transfer",
    pos: "POS",
    mobile_money: "Mobile Money",
    card: "Card",
    other: "Other",
  };

  return (
    labels[method] || method
  );
};

const escapeHTML = (value = "") => {
  return String(value)
    .replace(/&/g, "&amp;")
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

export const generateReceiptHTML =
  (receipt) => {
    const {
      business,
      customer,
      payment,
      order,
      currency,
      receiptNumber,
    } = receipt;

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
    Receipt ${escapeHTML(
      receiptNumber
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

    .receipt {
      max-width: 700px;
      margin: 0 auto;
    }

    .header {
      text-align: center;

      padding-bottom: 25px;

      border-bottom: 2px solid #222;
    }

    .business-name {
      font-size: 24px;
      font-weight: 700;

      margin-bottom: 8px;
    }

    .business-details {
      color: #666;
    }

    .receipt-title {
      margin-top: 25px;

      font-size: 28px;
      font-weight: 700;

      letter-spacing: 1px;
    }

    .receipt-number {
      margin-top: 5px;

      font-size: 13px;
      font-weight: 600;

      color: #666;
    }

    .amount-box {
      margin: 35px 0;

      padding: 25px;

      text-align: center;

      border: 1px solid #ddd;
      border-radius: 6px;
    }

    .amount-label {
      font-size: 11px;

      text-transform: uppercase;
      letter-spacing: 0.8px;

      color: #777;
    }

    .amount {
      margin-top: 8px;

      font-size: 32px;
      font-weight: 700;
    }

    .section {
      margin-top: 30px;
    }

    .section-title {
      margin-bottom: 10px;

      font-size: 11px;
      font-weight: 700;

      text-transform: uppercase;
      letter-spacing: 0.6px;

      color: #777;
    }

    .details {
      border-top: 1px solid #ddd;
    }

    .row {
      display: flex;
      justify-content: space-between;

      gap: 30px;

      padding: 10px 0;

      border-bottom: 1px solid #ddd;
    }

    .label {
      color: #666;
    }

    .value {
      text-align: right;
      font-weight: 600;
    }

    .customer-name {
      font-size: 15px;
      font-weight: 700;
      margin-bottom: 5px;
    }

    .notes {
      margin-top: 30px;

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

      .receipt {
        max-width: none;
      }
    }

  </style>

</head>

<body>

  <div class="receipt">

    <div class="header">

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

      <div class="receipt-title">
        PAYMENT RECEIPT
      </div>

      <div class="receipt-number">
        ${escapeHTML(
          receiptNumber
        )}
      </div>

    </div>

    <div class="amount-box">

      <div class="amount-label">
        Amount Received
      </div>

      <div class="amount">
        ${formatCurrency(
          payment.amount,
          currency
        )}
      </div>

    </div>

    <div class="section">

      <div class="section-title">
        Received From
      </div>

      <div>
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

    </div>

    <div class="section">

      <div class="section-title">
        Payment Details
      </div>

      <div class="details">

        <div class="row">

          <span class="label">
            Payment Date
          </span>

          <span class="value">
            ${formatDate(
              payment.paymentDate
            )}
          </span>

        </div>

        <div class="row">

          <span class="label">
            Payment Method
          </span>

          <span class="value">
            ${escapeHTML(
              formatPaymentMethod(
                payment.paymentMethod
              )
            )}
          </span>

        </div>

        <div class="row">

          <span class="label">
            Order
          </span>

          <span class="value">
            ${escapeHTML(
              order.orderNumber
            )}
          </span>

        </div>

        ${
          payment.reference
            ? `
              <div class="row">

                <span class="label">
                  Reference
                </span>

                <span class="value">
                  ${escapeHTML(
                    payment.reference
                  )}
                </span>

              </div>
            `
            : ""
        }

      </div>

    </div>

    ${
      payment.notes
        ? `
          <div class="notes">

            <div class="notes-title">
              Notes
            </div>

            <div>
              ${escapeHTML(
                payment.notes
              )}
            </div>

          </div>
        `
        : ""
    }

    <div class="footer">
      Thank you for your payment.
    </div>

  </div>

</body>

</html>
`;
  };
