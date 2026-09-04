import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getPaymentStats,
} from "../services/payments";

const defaultStats = {
    totalCollected: 0,
    paymentCount: 0,
    averagePayment: 0,
};

const usePaymentStats = ({
    search = "",
    paymentMethod = "",
    dateFrom = "",
    dateTo = "",
} = {}) => {
    const [stats, setStats] =
        useState(defaultStats);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    const fetchStats =
        useCallback(async () => {
            setLoading(true);
            setError(null);

            try {
                const response =
                    await getPaymentStats({
                        search,
                        paymentMethod,
                        dateFrom,
                        dateTo,
                    });

                setStats(
                    response.stats ||
                        defaultStats
                );
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }, [
            search,
            paymentMethod,
            dateFrom,
            dateTo,
        ]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return {
        stats,
        loading,
        error,
        refetch: fetchStats,
    };
};

export default usePaymentStats;
