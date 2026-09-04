import {
    useState,
} from "react";

import {
    Archive,
    ArrowLeft,
    Edit3,
    Mail,
    MapPin,
    Phone,
    User,
} from "lucide-react";

import {
    Link,
    useParams,
    useNavigate,
} from "react-router-dom";

import useCustomer from "../../../hooks/useCustomer";
import Swal from 'sweetalert2';


import {
  updateCustomer,
  archiveCustomer,
} from "../../../services/customers";

import EditCustomerModal from "../../../components/customers/EditCustomerModal";

const CustomerDetailsPage = () => {
    const { id } =
        useParams();

    const {
        customer,
        loading,
        error,
        refetch: fetchCustomer,
    } = useCustomer(id);

    const navigate =
        useNavigate();

    const [editModalOpen, setEditModalOpen] =
        useState(false);

    const [updatingCustomer, setUpdatingCustomer] =
        useState(false);

    const [updateError, setUpdateError] =
        useState(null);

    const [archivingCustomer, setArchivingCustomer] =
        useState(false);

    const [archiveError, setArchiveError] =
        useState(null);


  const handleUpdateCustomer =
        async (customerData) => {
            setUpdatingCustomer(true);
            setUpdateError(null);

            try {
                await updateCustomer(
                    id,
                    customerData
                );

                setEditModalOpen(false);

                await fetchCustomer();
            } catch (error) {
                setUpdateError(
                    error.message ||
                        "Unable to update customer."
                );
            } finally {
                setUpdatingCustomer(false);
            }
        };

  const handleArchiveCustomer =
      async () => {
          const result = await Swal.fire({
              title: 'Archive Customer',
              text: `Archive ${customer.name}? They will no longer appear in your active customer list.`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Confirm Archive',
              cancelButtonText: 'Abort',
              customClass: {
                  popup: 'command-theme-popup',
                  confirmButton: 'command-btn command-confirm-btn',
                  cancelButton: 'command-btn command-cancel-btn'
              },
              buttonsStyling: false
          });

          if (!result.isConfirmed) {
              return;
          }

          setArchivingCustomer(true);
          setArchiveError(null);

          try {
              await archiveCustomer(id);

              navigate("/customers");
          } catch (error) {
              setArchiveError(
                  error.message ||
                      "Unable to archive customer."
              );
          } finally {
              setArchivingCustomer(false);
          }
      };

  if (loading) {
        return (
            <div className="animate-pulse">
                <div className="h-4 w-24 rounded bg-command-surface" />

                <div className="mt-6 h-8 w-56 rounded bg-command-surface" />

                <div className="mt-3 h-4 w-80 rounded bg-command-surface" />

                <div className="mt-8 grid gap-5 lg:grid-cols-2">
                    <div className="h-52 rounded-command-lg border border-command-border bg-command-surface" />

                    <div className="h-52 rounded-command-lg border border-command-border bg-command-surface" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Link
                    to="/customers"
                    className="inline-flex items-center gap-2 text-xs text-command-muted transition hover:text-command-white"
                >
                    <ArrowLeft
                        size={14}
                    />

                    Back to customers
                </Link>

                <div className="mt-8 rounded-command-lg border border-red-500/20 bg-red-500/5 p-6">
                    <h1 className="text-sm font-semibold text-red-400">
                        Unable to load customer
                    </h1>

                    <p className="mt-2 text-xs text-command-muted">
                        {error.message ||
                            "Something went wrong while loading this customer."}
                    </p>
                </div>
            </div>
        );
    }

    if (!customer) {
        return (
            <div>
                <Link
                    to="/customers"
                    className="inline-flex items-center gap-2 text-xs text-command-muted transition hover:text-command-white"
                >
                    <ArrowLeft
                        size={14}
                    />

                    Back to customers
                </Link>

                <div className="mt-8 rounded-command-lg border border-command-border bg-command-surface p-8 text-center">
                    <p className="text-sm font-medium">
                        Customer not found
                    </p>

                    <p className="mt-2 text-xs text-command-muted">
                        This customer may have
                        been removed or you may
                        not have access to it.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* BACK */}

            <Link
                to="/customers"
                className="inline-flex items-center gap-2 text-xs text-command-muted transition hover:text-command-white"
            >
                <ArrowLeft
                    size={14}
                />

                Back to customers
            </Link>

            {/* HEADER */}

            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-command-lg border border-command-border bg-command-surface text-command-green">
                        <User
                            size={20}
                            strokeWidth={1.5}
                        />
                    </div>

                    <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-command-green">
                            Customer
                        </p>

                        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                            {customer.name}
                        </h1>

                        <p className="mt-1 text-sm text-command-muted">
                            Added{" "}
                            {new Date(
                                customer.createdAt
                            ).toLocaleDateString(
                                undefined,
                                {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                }
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => {
                            setUpdateError(null);
                            setEditModalOpen(true);
                        }}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-command-md border border-command-border px-4 text-sm text-command-text transition hover:border-command-green/30 hover:text-command-white"
                    >
                        <Edit3 size={15} />

                        Edit customer
                    </button>

                    <button
                        type="button"
                        onClick={handleArchiveCustomer}
                        disabled={archivingCustomer}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-command-md border border-command-border px-4 text-sm text-command-muted transition hover:border-red-500/30 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Archive size={15} />

                        {archivingCustomer
                            ? "Archiving..."
                            : "Archive"}
                    </button>
                </div>
        </div>

        {updateError && (
            <div className="mt-5 flex items-center justify-between rounded-command-md border border-red-500/20 bg-red-500/5 px-4 py-3">
                <p className="text-xs text-red-400">
                    {updateError}
                </p>

                <button
                    type="button"
                    onClick={() =>
                        setUpdateError(null)
                    }
                    className="text-xs text-command-muted transition hover:text-command-white"
                >
                    Dismiss
                </button>
            </div>
        )}

        {archiveError && (
            <div className="mt-5 flex items-center justify-between rounded-command-md border border-red-500/20 bg-red-500/5 px-4 py-3">
                <p className="text-xs text-red-400">
                    {archiveError}
                </p>

                <button
                    type="button"
                    onClick={() =>
                        setArchiveError(null)
                    }
                    className="text-xs text-command-muted transition hover:text-command-white"
                >
                    Dismiss
                </button>
            </div>
        )}

            {/* INFORMATION */}

            <div className="mt-8 grid gap-5 lg:grid-cols-2">
                {/* CONTACT */}

                <section className="rounded-command-lg border border-command-border bg-command-surface">
                    <div className="border-b border-command-border px-5 py-4">
                        <h2 className="text-sm font-semibold">
                            Contact information
                        </h2>
                    </div>

                    <div className="divide-y divide-command-border">
                        <div className="flex items-center gap-3 px-5 py-4">
                            <Phone
                                size={16}
                                className="text-command-muted"
                                strokeWidth={
                                    1.5
                                }
                            />

                            <div>
                                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                                    Phone
                                </p>

                                <p className="mt-1 text-sm">
                                    {
                                        customer.phone
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-5 py-4">
                            <Mail
                                size={16}
                                className="text-command-muted"
                                strokeWidth={
                                    1.5
                                }
                            />

                            <div>
                                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                                    Email
                                </p>

                                <p className="mt-1 text-sm">
                                    {customer.email ||
                                        "Not provided"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 px-5 py-4">
                            <MapPin
                                size={16}
                                className="mt-0.5 text-command-muted"
                                strokeWidth={
                                    1.5
                                }
                            />

                            <div>
                                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                                    Address
                                </p>

                                <p className="mt-1 text-sm leading-6">
                                    {customer.address ||
                                        "Not provided"}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* NOTES */}

                <section className="rounded-command-lg border border-command-border bg-command-surface">
                    <div className="border-b border-command-border px-5 py-4">
                        <h2 className="text-sm font-semibold">
                            Notes
                        </h2>
                    </div>

                    <div className="p-5">
                        {customer.notes ? (
                            <p className="whitespace-pre-wrap text-sm leading-7 text-command-text">
                                {
                                    customer.notes
                                }
                            </p>
                        ) : (
                            <p className="text-sm text-command-muted">
                                No notes have been
                                added for this
                                customer.
                            </p>
                        )}
                    </div>
                </section>
        </div>
        <EditCustomerModal
            open={editModalOpen}
            onClose={() => {
                if (!updatingCustomer) {
                    setEditModalOpen(false);
                }
            }}
            onSubmit={
                handleUpdateCustomer
            }
            loading={
                updatingCustomer
            }
            customer={customer}
        />
        </div>
    );
};

export default CustomerDetailsPage;
