import {
    CheckCircle2,
    LoaderCircle,
    XCircle,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import {
    verifyProPayment,
} from "../../../services/billing";

import { getCurrentUser } from "../../../services/auth";
import { useAuth } from "../../../context/AuthContext";


const BillingCallbackPage =
    () => {
        const navigate =
            useNavigate();
        const { refreshUser } = useAuth();

      const [
            searchParams,
        ] = useSearchParams();

        const [status, setStatus] =
            useState("processing");

        const [
            errorMessage,
            setErrorMessage,
        ] = useState("");

        useEffect(() => {
            const verifyPayment =
                async () => {
                    const paymentStatus =
                        searchParams.get(
                            "status"
                        );

                    const txRef =
                        searchParams.get(
                            "tx_ref"
                        );

                    const transactionId =
                        searchParams.get(
                            "transaction_id"
                        );

                    if (
                        paymentStatus !==
                        "successful"
                    ) {
                        setStatus(
                            paymentStatus ===
                                "cancelled"
                                ? "cancelled"
                                : "failed"
                        );

                        return;
                    }

                    if (
                        !txRef ||
                        !transactionId
                    ) {
                        setStatus(
                            "failed"
                        );

                        setErrorMessage(
                            "The payment information returned by Flutterwave is incomplete."
                        );

                        return;
                    }

                    try {
                        setStatus(
                            "processing"
                        );

                        await verifyProPayment(
                            {
                                transactionId,
                                txRef,
                            }
                        );
                        await refreshUser();
                        setStatus(
                            "success"
                        );
                    } catch (error) {
                        console.error(
                            "Payment verification failed:",
                            error
                        );

                        setStatus(
                            "failed"
                        );

                        setErrorMessage(
                            error?.response
                                ?.data
                                ?.message ||
                                error?.message ||
                                "We could not verify your payment."
                        );
                    }
                };

            verifyPayment();
        }, [
            searchParams,
        ]);

        if (
            status ===
            "processing"
        ) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-command-black px-6">
                    <div className="text-center">
                        <LoaderCircle
                            size={28}
                            className="mx-auto animate-spin text-command-green"
                        />

                        <p className="mt-4 text-sm font-medium text-command-white">
                            Confirming your payment...
                        </p>

                        <p className="mt-1 text-xs text-command-muted">
                            We're securely verifying your transaction with Flutterwave.
                        </p>
                    </div>
                </div>
            );
        }

        if (
            status ===
            "success"
        ) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-command-black px-6">
                    <div className="w-full max-w-md text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-command-green/10">
                            <CheckCircle2
                                size={28}
                                className="text-command-green"
                            />
                        </div>

                        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-command-green">
                            Subscription active
                        </p>

                        <h1 className="mt-2 text-2xl font-semibold text-command-white">
                            Welcome to Pro
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-command-muted">
                            Your payment has been verified and your BizFlow Pro subscription is now active.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/dashboard"
                                )
                            }
                            className="mt-7 inline-flex h-10 items-center justify-center rounded-command-md bg-command-green px-5 text-xs font-semibold text-[#061008] transition hover:brightness-110"
                        >
                            Go to dashboard
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex min-h-screen items-center justify-center bg-command-black px-6">
                <div className="w-full max-w-md text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
                        <XCircle
                            size={28}
                            className="text-red-400"
                        />
                    </div>

                    <h1 className="mt-5 text-2xl font-semibold text-command-white">
                        Payment not completed
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-command-muted">
                        {errorMessage ||
                            "Your Pro subscription was not activated."}
                    </p>

                    <div className="mt-7 flex justify-center gap-3">
                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/dashboard"
                                )
                            }
                            className="inline-flex h-10 items-center justify-center rounded-command-md border border-command-border px-5 text-xs text-command-muted transition hover:border-command-green/30 hover:text-command-green"
                        >
                            Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    };

export default BillingCallbackPage;
