import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getCustomers,
} from "../services/customers";

const useCustomers = ({
    page = 1,
    limit = 10,
  search = "",
    archived = false,
} = {}) => {
    const [data, setData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    const fetchCustomers =
        useCallback(async () => {
            setLoading(true);
            setError(null);

            try {
                const response =
                    await getCustomers({
                        page,
                        limit,
                        search,
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
            archived,
        ]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    return {
        data,
        loading,
        error,
        refetch: fetchCustomers,
    };
};

export default useCustomers;
