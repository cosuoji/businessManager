import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getOrderPayments,
} from "../services/payments";

const useOrderPayments = (orderId) => {
    const [payments, setPayments] =
        useState([]);

    const [summary, setSummary] =
        useState({
            orderTotal: 0,
            totalPaid: 0,
            balance: 0,
            paymentStatus: "unpaid",
        });

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    const fetchPayments =
        useCallback(async () => {
            if (!orderId) {
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response =
                    await getOrderPayments(
                        orderId
                    );

                setPayments(
                    response.payments || []
                );


                setSummary(
                    response.summary || {
                        orderTotal: 0,
                        totalPaid: 0,
                        balance: 0,
                        paymentStatus:
                            "unpaid",
                    }
                );
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }, [orderId]);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    return {
        payments,
        summary,
        loading,
        error,
        refetch: fetchPayments,
    };
};

export default useOrderPayments;
