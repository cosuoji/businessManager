import {
    createBrowserRouter,
} from "react-router-dom";

import LandingPage from "../pages/landing/LandingPage";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

import AppLayout from "../layouts/AppLayout";

import DashboardPage from "../pages/app/DashboardPage";
import CustomersPage from "../pages/app/customers/CustomersPage";
import OrdersPage from "../pages/app/orders/OrdersPage";
import PaymentsPage from "../pages/app/payments/PaymentsPage";
import OutstandingPage from "../pages/app/outstanding/OutstandingPage";
import InvoicePage from "../pages/app/invoices/InvoicePage";
import NotFoundPage from "../pages/app/NotFound";
import Invoice from "../pages/app/invoices/Invoice";
import ReceiptsPage from "../pages/app/ReceiptsPage";
import SettingsPage from "../pages/app/settings/SettingsPage";
import CustomerDetailsPage from "../pages/app/customers/CustomerDetailsPage";
import OrderDetailsPage from "../pages/app/orders/OrderDetailsPage";
import CustomerOutstandingPage from "../pages/app/outstanding/CustomerOutstandingPage";
import PublicInvoicePage from "../pages/app/public/PublicInvoicePage";
import BillingCallbackPage from "../pages/app/billing/BillingCallbackPage";





import ProtectedRoute from "../components/auth/ProtectedRoute";


const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />,
    },

    {
        path: "/login",
        element: <LoginPage />,
    },

    {
        path: "/register",
        element: <RegisterPage />,
    },

    {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
    },

    {
        path: "/reset-password/:token",
        element: <ResetPasswordPage />,
    },

    {
        path: "/invoice/:token",
        element: <PublicInvoicePage />,
    },

    {
        path: "/billing/callback",
        element: <BillingCallbackPage />,
    },

    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    {
                        path: "/dashboard",
                        element: <DashboardPage />,
                    },

                    {
                        path: "/customers",
                        element: <CustomersPage />,
                    },

                    {
                        path: "/customers/:id",
                        element: <CustomerDetailsPage />,
                    },

                    {
                        path: "/orders",
                        element: <OrdersPage />,
                    },

                    {
                        path: "/orders/:id",
                        element: <OrderDetailsPage />,
                  },

                    {
                        path: "/orders/:id/invoice",
                        element: <InvoicePage />,
                    },

                    {
                        path: "/payments",
                        element: <PaymentsPage />,
                    },

                    {
                        path: "/outstanding",
                        element: <OutstandingPage />,
                    },
                    {
                        path: "/outstanding/customers/:customerId",
                        element: <CustomerOutstandingPage />,
                    },

                    // {
                    //     path: "/invoices",
                    //     element: <InvoicesPage />,
                    // },
                    {
                        path: "/invoices/:orderId",
                        element: <Invoice />,
                    },

                    {
                        path: "/receipts",
                        element: <ReceiptsPage />,
                    },

                    {
                        path: "/settings",
                        element: <SettingsPage />,
                    },
            ],

            },
        ],
  },
    {
        path: "*",
        element: <NotFoundPage />,
    },
]);

export default router;
