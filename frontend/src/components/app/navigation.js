import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    CreditCard,
    AlertCircle,
    FileText,
    Receipt,
    Settings,
} from "lucide-react";

export const appNavigation = [
    {
        label: "Overview",
        items: [
            {
                label: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
            },
        ],
    },

    {
        label: "Business",
        items: [
            {
                label: "Customers",
                href: "/customers",
                icon: Users,
            },
            {
                label: "Orders",
                href: "/orders",
                icon: ShoppingBag,
            },
            {
                label: "Payments",
                href: "/payments",
                icon: CreditCard,
            },
            {
                label: "Outstanding",
                href: "/outstanding",
                icon: AlertCircle,
          },

        ],
    },

    {
        label: "Documents",
        items: [
            {
                label: "Invoices",
                href: "/invoices",
                icon: FileText,
            },
            // {
            //     label: "Receipts",
            //     href: "/receipts",
            //     icon: Receipt,
            // },
        ],
    },

    {
        label: "System",
        items: [
            {
                label: "Settings",
                href: "/settings",
                icon: Settings,
            },
        ],
    },
];
