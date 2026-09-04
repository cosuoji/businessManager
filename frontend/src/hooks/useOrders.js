import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getOrders,
} from "../services/orders";

const useOrders = ({
    page = 1,
    limit = 10,
    search = "",
    customerId = "",
    status = "",
    paymentStatus = "",
    archived = false,
} = {}) => {
    const [data, setData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    const fetchOrders =
        useCallback(async () => {
            setLoading(true);
            setError(null);

            try {
                const response =
                    await getOrders({
                        page,
                        limit,
                        search,
                        customerId,
                        status,
                        paymentStatus,
                        archived,
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
            customerId,
            status,
            paymentStatus,
            archived,
        ]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return {
        data,
        loading,
        error,
        refetch: fetchOrders,
    };
};

export default useOrders;
