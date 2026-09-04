import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getOrder,
} from "../services/orders";

const useOrder = (orderId) => {
    const [order, setOrder] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    const fetchOrder =
        useCallback(async () => {
            if (!orderId) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response =
                    await getOrder(orderId);

                setOrder(
                    response.order
                );
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }, [orderId]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    return {
        order,
        loading,
        error,
        refetch: fetchOrder,
    };
};

export default useOrder;
