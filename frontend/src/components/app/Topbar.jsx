import { useLocation } from "react-router-dom";
import UserMenu from "./UserMenu";

const pageTitles = {
    "/dashboard": {
        title: "Dashboard",
        description:
            "A clear view of how your business is performing.",
    },

    "/customers": {
        title: "Customers",
        description:
            "Manage your customer relationships.",
    },

    "/orders": {
        title: "Orders",
        description:
            "Track orders and their payment status.",
    },

    "/payments": {
        title: "Payments",
        description:
            "Record and manage business payments.",
    },

    "/outstanding": {
        title: "Outstanding",
        description:
            "Keep track of money your customers owe.",
    },

    "/invoices": {
        title: "Invoices",
        description:
            "Create and manage customer invoices.",
    },

    "/receipts": {
        title: "Receipts",
        description:
            "View and manage payment receipts.",
    },

    "/settings": {
        title: "Settings",
        description:
            "Manage your business and account.",
    },
};

const Topbar = () => {
    const location = useLocation();

    const page =
        pageTitles[location.pathname] ||
        pageTitles["/dashboard"];

    return (
        <header className="flex relative z-50 h-18 shrink-0 items-center justify-between border-b border-command-border bg-command-black/80 px-5 backdrop-blur-xl sm:px-6 lg:px-8">
            <div>
                {/* <h1 className="text-sm font-semibold sm:text-base">
                    {page.title}
                </h1>*/}

                <p className="hidden text-xs text-command-muted sm:block">
                    {page.description}
                </p>
            </div>

            <UserMenu />
        </header>
    );
};

export default Topbar;
