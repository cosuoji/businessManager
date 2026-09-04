import {
  AlertCircle,
  ArrowLeft,
  Check,
  Copy,
  FileText,
  Loader2,
  MessageCircle,
  Send,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  getInvoiceMessage,
  getPaymentReminder,
} from "../../services/whatsapp";

const MESSAGE_TYPES = {
  invoice: {
    label: "Invoice",
    description: "Send the customer their order invoice.",
    icon: FileText,
  },

  payment_reminder: {
    label: "Payment reminder",
    description: "Remind the customer about an outstanding balance.",
    icon: AlertCircle,
  },
};

const WhatsAppModal = ({
  open,
  onClose,
  orderId,
  order,
}) => {
  const [selectedType, setSelectedType] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) {
      setSelectedType(null);
      setMessageData(null);
      setLoading(false);
      setError(null);
      setCopied(false);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleSelectType = async (type) => {
    setSelectedType(type);
    setMessageData(null);
    setError(null);
    setCopied(false);
    setLoading(true);

    try {
      let response;

      if (type === "invoice") {
        response = await getInvoiceMessage(orderId);
      }

      if (type === "payment_reminder") {
        response = await getPaymentReminder(orderId);
      }

      setMessageData(response.data);
    } catch (error) {
      setError(
        error.message ||
          "Unable to generate WhatsApp message."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedType(null);
    setMessageData(null);
    setError(null);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!messageData?.message) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        messageData.message
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setError("Unable to copy message.");
    }
  };

  const handleOpenWhatsApp = () => {
    if (
      !messageData?.phone ||
      !messageData?.message
    ) {
      return;
    }

    const phone = messageData.phone
      .replace(/\D/g, "");

    const url =
      `https://wa.me/${phone}` +
      `?text=${encodeURIComponent(
        messageData.message
      )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const selectedMessage =
    selectedType
      ? MESSAGE_TYPES[selectedType]
      : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-command-lg border border-command-border bg-command-surface shadow-2xl">
        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-command-border px-5 py-4">
          <div className="flex items-center gap-3">
            {selectedType && !loading && (
              <button
                type="button"
                onClick={handleBack}
                className="flex h-8 w-8 items-center justify-center rounded-command-md text-command-muted transition hover:bg-command-black hover:text-command-white"
              >
                <ArrowLeft size={15} />
              </button>
            )}

            <div>
              <p className="flex items-center gap-2 text-sm font-semibold">
                <MessageCircle
                  size={16}
                  className="text-command-green"
                />

                {selectedMessage
                  ? selectedMessage.label
                  : "Send via WhatsApp"}
              </p>

              <p className="mt-1 text-xs text-command-muted">
                {selectedMessage
                  ? `Order ${order?.orderNumber || ""}`
                  : "Choose a message to send"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="text-command-muted transition hover:text-command-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="text-xl leading-none">
              ×
            </span>
          </button>
        </div>

        {/* CONTENT */}

        <div className="p-5">
          {!selectedType && (
            <div>
              <p className="mb-4 text-xs text-command-muted">
                Choose what you'd like to send to{" "}
                <span className="text-command-white">
                  {order?.customerId?.name ||
                    "the customer"}
                </span>
                .
              </p>

              <div className="space-y-3">
                {Object.entries(
                  MESSAGE_TYPES
                ).map(
                  ([
                    type,
                    config,
                  ]) => {
                    const Icon =
                      config.icon;

                    const isReminder =
                      type ===
                      "payment_reminder";

                    const disabled =
                      isReminder &&
                      Number(
                        order?.balance ??
                          0
                      ) <= 0;

                    return (
                      <button
                        key={type}
                        type="button"
                        disabled={
                          disabled ||
                          loading
                        }
                        onClick={() =>
                          handleSelectType(
                            type
                          )
                        }
                        className="flex w-full items-center gap-4 rounded-command-md border border-command-border p-4 text-left transition hover:border-command-green/30 hover:bg-command-black/40 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-command-md bg-command-black text-command-green">
                          <Icon size={17} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-medium">
                            {config.label}
                          </p>

                          <p className="mt-1 text-xs text-command-muted">
                            {
                              config.description
                            }
                          </p>

                          {disabled && (
                            <p className="mt-1 text-[10px] text-command-muted">
                              Order is fully paid
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {selectedType &&
            loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2
                  size={22}
                  className="animate-spin text-command-green"
                />

                <p className="mt-4 text-sm">
                  Preparing message...
                </p>

                <p className="mt-1 text-xs text-command-muted">
                  Getting the latest order
                  information.
                </p>
              </div>
            )}

          {selectedType &&
            !loading &&
            error && (
              <div className="rounded-command-md border border-red-500/20 bg-red-500/5 p-4">
                <p className="text-sm font-medium text-red-400">
                  Unable to prepare message
                </p>

                <p className="mt-2 text-xs text-command-muted">
                  {error}
                </p>
              </div>
            )}

          {selectedType &&
            !loading &&
            !error &&
            messageData && (
              <div>
                {/* RECIPIENT */}

                <div className="mb-4 rounded-command-md border border-command-border bg-command-black/30 p-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                    Recipient
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {messageData.customerName ||
                      "Customer"}
                  </p>

                  <p className="mt-1 text-xs text-command-muted">
                    {messageData.phone}
                  </p>
                </div>

                {/* MESSAGE */}

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-command-muted">
                      Message
                    </p>

                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 text-xs text-command-muted transition hover:text-command-green"
                    >
                      {copied ? (
                        <>
                          <Check size={13} />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          Copy
                        </>
                      )}
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-command-md border border-command-border bg-command-black p-4 text-sm leading-6 text-command-white">
                    {messageData.message}
                  </div>
                </div>
              </div>
            )}
        </div>

        {/* FOOTER */}

        {selectedType &&
          !loading &&
          !error &&
          messageData && (
            <div className="flex items-center justify-between gap-3 border-t border-command-border px-5 py-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-3 py-2 text-xs text-command-muted transition hover:text-command-white"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="inline-flex items-center gap-2 rounded-command-md bg-command-green px-4 py-2.5 text-xs font-semibold text-command-black transition hover:bg-command-green/90"
              >
                <Send size={14} />
                Open WhatsApp
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default WhatsAppModal;
