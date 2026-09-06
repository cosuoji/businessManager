import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getUsage,
} from "../services/usage";

export const useUsage = ({
    enabled = true,
} = {}) => {
    const [usage, setUsage] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState(null);

    const fetchUsage =
        useCallback(async () => {
            setLoading(true);
            setError(null);

            try {
                const data =
                    await getUsage();
                setUsage(data.usage);

                return data;
            } catch (error) {
                setError(error);

                return null;
            } finally {
                setLoading(false);
            }
        }, []);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        fetchUsage();
    }, [
        enabled,
        fetchUsage,
    ]);

    return {
        usage,
        loading,
        error,
        refreshUsage: fetchUsage,
    };
};
