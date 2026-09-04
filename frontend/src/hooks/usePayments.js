import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getPayments,
} from "../services/payments";

const usePayments = ({
    page = 1,
    limit = 20,
    search = "",
    paymentMethod = "",
    dateFrom = "",
    dateTo = "",
} = {}) => {
    const [data, setData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    const fetchPayments =
        useCallback(async () => {
            setLoading(true);
            setError(null);

            try {
                const response =
                    await getPayments({
                        page,
                        limit,
                        search,
                        paymentMethod,
                        dateFrom,
                        dateTo,
                    });

                setData(response);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }, [
            page,
            limit,
            search,
            paymentMethod,
            dateFrom,
            dateTo,
        ]);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    return {
        payments:
            data?.payments || [],

        pagination:
            data?.pagination || {
                page: 1,
                limit,
                total: 0,
                totalPages: 0,
                hasNextPage: false,
                hasPreviousPage: false,
            },

        loading,
        error,

        refetch: fetchPayments,
    };
};

export default usePayments;
