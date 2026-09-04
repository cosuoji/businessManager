import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getOrderStats,
} from "../services/orders";


const useOrderStats = ({
    startDate = "",
    endDate = "",
} = {}) => {
    const [data, setData] =
        useState(null);

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
                    await getOrderStats({
                        startDate,
                        endDate,
                    });

                setData(response);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }, [
            startDate,
            endDate,
        ]);


    useEffect(() => {
        fetchStats();
    }, [fetchStats]);


    return {
        data,
        loading,
        error,
        refetch: fetchStats,
    };
};


export default useOrderStats;
