export const PLAN_LIMITS = {
  free: {
    customers: 20,
    ordersPerMonth: 10,
    invoicesPerMonth: 5,
    receiptsPerMonth: 5,
  },

  pro: {
    customers: Infinity,
    ordersPerMonth: Infinity,
    invoicesPerMonth: Infinity,
    receiptsPerMonth: Infinity,
  },
};

export const PLAN_FEATURES = {
  free: {
    dashboard: "basic",
    whatsapp: false,
    publicInvoiceLinks: false,
  },

  pro: {
    dashboard: "full",
    whatsapp: true,
    publicInvoiceLinks: true,
  },
};

export const PLANS = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    currency: "NGN",
    interval: null,
  },

  pro: {
    id: "pro",
    name: "Pro",
    price: 7000,
    currency: "NGN",
    interval: "monthly",
  },
};

export const BILLING = {
    provider: "flutterwave",

    pro: {
        amount: 7000,
        currency: "NGN",
        interval: "monthly",
    },
};
