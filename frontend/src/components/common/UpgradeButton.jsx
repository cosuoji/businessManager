import {
    useState,
} from "react";

import {
    initializeProCheckout,
} from "../../services/billing";

const UpgradeButton = () => {
    const [
        loading,
        setLoading,
    ] = useState(false);

    const handleUpgrade =
        async () => {
            try {
                setLoading(true);

                const response =
                    await initializeProCheckout();

                window.location.href =
                    response.checkoutUrl;
            } catch (error) {
                console.error(
                    "Unable to start checkout:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

    return (
        <button
            type="button"
            onClick={handleUpgrade}
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 rounded-command-md border border-command-border px-4 text-sm text-white transition hover:border-command-green/30 hover:text-command-green disabled:cursor-not-allowed disabled:opacity-50"
        >
            {loading
                ? "Opening checkout..."
                : "Upgrade to Pro"}
        </button>
    );
};

export default UpgradeButton;
