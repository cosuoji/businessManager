export const formatCurrency = (
    amount = 0
) => {
    return new Intl.NumberFormat(
        "en-NG",
        {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 2,
        }
    ).format(Number(amount) || 0);
};

export const formatPaymentDate = (
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

export const formatPaymentMethod = (
    method
) => {
    const labels = {
        cash: "Cash",
        bank_transfer:
            "Bank transfer",
        pos: "POS",
        mobile_money:
            "Mobile money",
        card: "Card",
        other: "Other",
    };

    return (
        labels[method] ||
        method
    );
};
