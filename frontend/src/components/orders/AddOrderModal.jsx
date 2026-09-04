import {
    ClipboardPlus,
    X,
} from "lucide-react";

import OrderForm from "./OrderForm";

const AddOrderModal = ({
    open,
    onClose,
    onSubmit,
    loading,
    customers,
}) => {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <button
                type="button"
                aria-label="Close modal"
                onClick={onClose}
                className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
            />

            <div className="relative z-10 max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-command-lg border border-command-border bg-command-black shadow-2xl">
                <div className="sticky top-0 z-20 flex items-start justify-between border-b border-command-border bg-command-surface/95 px-5 py-5 backdrop-blur-xl sm:px-6">
                    <div className="flex gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-command-md border border-command-border bg-command-black text-command-green">
                            <ClipboardPlus size={17} />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold">
                                Create order
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-command-muted">
                                Create a new order for one of your customers.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex h-8 w-8 items-center justify-center rounded-command-md text-command-muted transition hover:bg-command-black hover:text-command-white disabled:opacity-40"
                        aria-label="Close"
                    >
                        <X size={17} />
                    </button>
                </div>

                <div className="p-5 sm:p-6">
                    <OrderForm
                        customers={customers}
                        onSubmit={onSubmit}
                        loading={loading}
                        submitLabel="Create order"
                    />
                </div>
            </div>
        </div>
    );
};

export default AddOrderModal;
