import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getInvoice,
    downloadInvoice,
} from "../services/invoices";

const useInvoice = (orderId) => {
    const [invoice, setInvoice] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    const fetchInvoice =
        useCallback(async () => {
            if (!orderId) {
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response =
                    await getInvoice(orderId);

                setInvoice(
                    response.data
                );
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }, [orderId]);

    const download = useCallback(
        async () => {
            if (!orderId) {
                return;
            }

            const response =
                await downloadInvoice(
                    orderId
                );

            const blob =
                new Blob(
                    [response],
                    {
                        type: "application/pdf",
                    }
                );

            const url =
                window.URL.createObjectURL(
                    blob
                );

            const link =
                document.createElement(
                    "a"
                );

            link.href = url;

            link.download =
                invoice?.invoiceNumber
                    ? `${invoice.invoiceNumber}.pdf`
                    : "invoice.pdf";

            document.body.appendChild(
                link
            );

            link.click();

            link.remove();

            window.URL.revokeObjectURL(
                url
            );
        },
        [orderId, invoice]
    );

    useEffect(() => {
        fetchInvoice();
    }, [fetchInvoice]);

    return {
        invoice,
        loading,
        error,
        refetch: fetchInvoice,
        download,
    };
};

export default useInvoice;
