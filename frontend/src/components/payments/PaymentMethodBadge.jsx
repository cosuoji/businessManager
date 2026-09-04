import {
    Banknote,
    CreditCard,
    Smartphone,
    Wallet,
} from "lucide-react";

import {
    formatPaymentMethod,
} from "./paymentUtils";

const icons = {
    cash: Banknote,
    bank_transfer: Wallet,
    pos: CreditCard,
    mobile_money: Smartphone,
    card: CreditCard,
    other: Wallet,
};

const PaymentMethodBadge = ({
    method,
}) => {
    const Icon =
        icons[method] || Wallet;

    return (
        <span className="inline-flex items-center gap-1.5 rounded-command-sm border border-command-border bg-command-black px-2 py-1 text-[10px] font-medium text-command-muted">
            <Icon
                size={12}
                strokeWidth={1.5}
            />

            {formatPaymentMethod(
                method
            )}
        </span>
    );
};

export default PaymentMethodBadge;
