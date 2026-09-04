import {
    X,
    UserPlus,
} from "lucide-react";

import CustomerForm from "./CustomerForm";

const AddCustomerModal = ({
    open,
    onClose,
    onSubmit,
    loading,
}) => {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* BACKDROP */}

            <button
                type="button"
                aria-label="Close modal"
                onClick={onClose}
                className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
            />

            {/* MODAL */}

            <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-command-lg border border-command-border bg-command-surface shadow-2xl">
                {/* HEADER */}

                <div className="flex items-start justify-between border-b border-command-border px-5 py-5 sm:px-6">
                    <div className="flex gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-command-md border border-command-border bg-command-black text-command-green">
                            <UserPlus
                                size={17}
                            />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold">
                                Add customer
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-command-muted">
                                Add a customer to your
                                business records.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-command-md text-command-muted transition hover:bg-command-black hover:text-command-white"
                        aria-label="Close"
                    >
                        <X size={17} />
                    </button>
                </div>

                {/* FORM */}

                <div className="p-5 sm:p-6">
                  <CustomerForm
                      onSubmit={onSubmit}
                      loading={loading}
                      submitLabel="Add customer"
                      loadingLabel="Adding customer..."
                  />
                </div>
            </div>
        </div>
    );
};

export default AddCustomerModal;
