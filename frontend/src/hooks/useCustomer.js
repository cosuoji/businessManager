import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getCustomer,
} from "../services/customers";

const useCustomer = (
    customerId
) => {
    const [customer, setCustomer] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    const fetchCustomer =
        useCallback(async () => {
            if (!customerId) {
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response =
                    await getCustomer(
                        customerId
                    );

              setCustomer(
                    response.customer
                );
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }, [customerId]);

    useEffect(() => {
        fetchCustomer();
    }, [fetchCustomer]);

    return {
        customer,
        loading,
        error,
        refetch: fetchCustomer,
    };
};

export default useCustomer;
