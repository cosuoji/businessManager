import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";

import AdminInfoRow from "../../components/admin/AdminInfoRow";
import AdminSubscriptionBadge from "../../components/admin/AdminSubscriptionBadge";
import AdminUserStatus from "../../components/admin/AdminUserStatus";
import AdminConfirmModal from "../../components/admin/AdminConfirmModal";
import GrantProModal from "../../components/admin/GrantProModal";

import AdminLoadingState from "../../components/admin/AdminLoadingState";
import AdminErrorState from "../../components/admin/AdminErrorState";
import AdminEmptyState from "../../components/admin/AdminEmptyState";

import useAdminUser from "../../hooks/useAdminUser";
import useAdminUserActions from "../../hooks/useAdminUserActions";

const AdminUserDetailPage = () => {
  const { id } = useParams();

  const {
    user,
    loading,
    error,
    refresh,
  } = useAdminUser(id);

  const {
    suspendUser,
    restoreUser,
    grantPro,
    revokePro,
    loading: actionLoading,
    error: actionError,
    clearError,
  } = useAdminUserActions();

  const [confirmAction, setConfirmAction] = useState(null);
  const [actionSuccess, setActionSuccess] = useState("");
  const [grantProOpen, setGrantProOpen] = useState(false);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleGrantPro = async (days) => {
    if (!user) return;

    try {
      setActionSuccess("");
      clearError();

      await grantPro(user._id, days);

      setGrantProOpen(false);
      setActionSuccess(
        `Pro access granted for ${days} days.`
      );

      await refresh();
    } catch {
      // Error is already captured by the action hook.
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmAction || !user) return;

    try {
      setActionSuccess("");
      clearError();

      if (confirmAction === "suspend") {
        await suspendUser(user._id);

        setConfirmAction(null);
        setActionSuccess(
          "User account suspended successfully."
        );

        await refresh();
        return;
      }

      if (confirmAction === "restore") {
        await restoreUser(user._id);

        setConfirmAction(null);
        setActionSuccess(
          "User account restored successfully."
        );

        await refresh();
        return;
      }

      if (confirmAction === "revoke-pro") {
        await revokePro(user._id);

        setConfirmAction(null);
        setActionSuccess(
          "Admin-managed Pro access revoked."
        );

        await refresh();
      }
    } catch {
      // Error is already captured by the mutation hook.
    }
  };

  if (loading) {
    return (
      <div className="p-6 sm:p-8 lg:p-10">
        <AdminLoadingState message="Loading user account..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 sm:p-8 lg:p-10">
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 text-sm text-command-muted transition-colors hover:text-white"
        >
          <ArrowLeft size={15} />
          Back to users
        </Link>

        <div className="mt-8">
          <AdminErrorState
            message={error}
            onRetry={refresh}
          />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 sm:p-8 lg:p-10">
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 text-sm text-command-muted transition-colors hover:text-white"
        >
          <ArrowLeft size={15} />
          Back to users
        </Link>

        <div className="mt-8">
          <AdminEmptyState
            title="User not found."
            description="This user may no longer exist or the requested account could not be loaded."
          />
        </div>
      </div>
    );
  }

  const subscription = user.subscription || {};

  const isPro = subscription.plan === "pro";

  const isAdminManaged =
    isPro && subscription.source === "admin";

  const isSuspended =
    user.accountStatus === "suspended";

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      {/* Back */}
      <Link
        to="/admin/users"
        className="inline-flex items-center gap-2 text-sm text-command-muted transition-colors hover:text-white"
      >
        <ArrowLeft size={15} />
        Back to users
      </Link>

      {/* Header */}
      <div className="mt-8 flex flex-col gap-5 border-b border-command-border pb-8 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {user.name || "Unnamed user"}
            </h1>

            <AdminUserStatus
              status={user.accountStatus}
            />
          </div>

          <p className="mt-2 text-sm text-command-muted">
            {user.email}
          </p>

          {user.businessName && (
            <p className="mt-1 text-sm text-command-muted">
              {user.businessName}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <AdminSubscriptionBadge
            subscription={subscription}
          />
        </div>
      </div>

      {/* Information */}
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        {/* Account */}
        <section className="rounded-command-lg border border-command-border bg-command-surface">
          <div className="border-b border-command-border px-5 py-4">
            <h2 className="text-sm font-semibold">
              Account information
            </h2>

            <p className="mt-1 text-xs text-command-muted">
              Basic information associated with this account.
            </p>
          </div>

          <div className="px-5">
            <AdminInfoRow
              label="Name"
              value={user.name}
            />

            <AdminInfoRow
              label="Email"
              value={user.email}
            />

            <AdminInfoRow
              label="Phone"
              value={user.phone}
              mono
            />

            <AdminInfoRow
              label="Business"
              value={user.businessName}
            />

            <AdminInfoRow
              label="Joined"
              value={formatDate(user.createdAt)}
            />
          </div>
        </section>

        {/* Subscription */}
        <section className="rounded-command-lg border border-command-border bg-command-surface">
          <div className="border-b border-command-border px-5 py-4">
            <div className="flex items-center gap-3">
              <ShieldCheck
                size={17}
                strokeWidth={1.7}
                className="text-command-muted"
              />

              <div>
                <h2 className="text-sm font-semibold">
                  Subscription
                </h2>

                <p className="mt-1 text-xs text-command-muted">
                  Current entitlement and billing state.
                </p>
              </div>
            </div>
          </div>

          <div className="px-5">
            <AdminInfoRow
              label="Plan"
              value={
                subscription.plan
                  ? subscription.plan.toUpperCase()
                  : "FREE"
              }
              mono
            />

            <AdminInfoRow
              label="Status"
              value={
                subscription.status
                  ? subscription.status.toUpperCase()
                  : "ACTIVE"
              }
              mono
            />

            <AdminInfoRow
              label="Source"
              value={
                subscription.source === "admin"
                  ? "Admin managed"
                  : "Flutterwave"
              }
            />

            <AdminInfoRow
              label="Period start"
              value={formatDate(
                subscription.currentPeriodStart
              )}
            />

            <AdminInfoRow
              label="Period end"
              value={formatDate(
                subscription.currentPeriodEnd
              )}
            />

            <AdminInfoRow
              label="Last payment"
              value={formatDate(
                subscription.lastPaymentAt
              )}
            />

            <AdminInfoRow
              label="Cancellation"
              value={
                subscription.cancelAtPeriodEnd
                  ? "Cancels at period end"
                  : "Not scheduled"
              }
            />
          </div>
        </section>
      </div>

      {/* Action feedback */}
      {(actionSuccess || actionError) && (
        <div className="mt-6 space-y-3">
          {actionSuccess && (
            <div className="rounded-command-lg border border-command-border bg-white/[0.03] px-4 py-3 text-xs text-green-400">
              {actionSuccess}
            </div>
          )}

          {actionError && (
            <div className="rounded-command-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-400">
              {actionError}
            </div>
          )}
        </div>
      )}

      {/* Admin actions */}
      <section className="mt-6 rounded-command-lg border border-command-border bg-command-surface">
        <div className="border-b border-command-border px-5 py-4">
          <h2 className="text-sm font-semibold">
            Admin actions
          </h2>

          <p className="mt-1 text-xs text-command-muted">
            Account access and subscription controls.
          </p>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-2">
          {/* Access */}
          <div>
            <p className="text-sm font-medium">
              Account access
            </p>

            <p className="mt-1 max-w-md text-xs leading-5 text-command-muted">
              Suspending an account immediately prevents
              the user from accessing BizFlow. Their data
              remains intact.
            </p>

            <div className="mt-4">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => {
                  setActionSuccess("");
                  clearError();

                  setConfirmAction(
                    isSuspended
                      ? "restore"
                      : "suspend"
                  );
                }}
                className={[
                  "w-full rounded-command-lg border px-4 py-3 text-left transition",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  isSuspended
                    ? "border-command-border hover:bg-white/5"
                    : "border-red-500/20 hover:bg-red-500/5",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {isSuspended
                        ? "Restore user"
                        : "Suspend user"}
                    </p>

                    <p className="mt-1 text-xs text-command-muted">
                      {isSuspended
                        ? "Allow this user to access their account again."
                        : "Prevent this user from accessing their account."}
                    </p>
                  </div>

                  <ShieldCheck
                    size={17}
                    className="text-command-muted"
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Subscription */}
          <div>
            <p className="text-sm font-medium">
              Subscription
            </p>

            <p className="mt-1 max-w-md text-xs leading-5 text-command-muted">
              Admin-managed Pro access is independent of
              Flutterwave billing and does not create a
              recurring payment.
            </p>

            {isPro && !isAdminManaged && (
              <p className="mt-3 text-[11px] text-command-muted">
                This Pro subscription is managed by
                Flutterwave. Subscription changes must be
                handled through the billing flow.
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {!isPro && (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => {
                    setActionSuccess("");
                    clearError();
                    setGrantProOpen(true);
                  }}
                  className="w-full rounded-command-lg border border-command-border px-4 py-3 text-left transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <div>
                    <p className="text-sm font-medium">
                      Grant Pro
                    </p>

                    <p className="mt-1 text-xs text-command-muted">
                      Give this user temporary Pro access.
                    </p>
                  </div>
                </button>
              )}

              {isAdminManaged && (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => {
                    setActionSuccess("");
                    clearError();
                    setConfirmAction("revoke-pro");
                  }}
                  className="w-full rounded-command-lg border border-red-500/20 px-4 py-3 text-left transition hover:bg-red-500/5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <div>
                    <p className="text-sm font-medium text-red-400">
                      Revoke Pro
                    </p>

                    <p className="mt-1 text-xs text-command-muted">
                      Remove the administrator-granted Pro access.
                    </p>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Confirmation modal */}
      <AdminConfirmModal
        open={Boolean(confirmAction)}
        title={
          confirmAction === "suspend"
            ? "Suspend this user?"
            : confirmAction === "restore"
            ? "Restore this user?"
            : "Revoke Pro access?"
        }
        description={
          confirmAction === "suspend"
            ? "This will prevent the user from accessing their BizFlow account. Their data will not be deleted."
            : confirmAction === "restore"
            ? "This will restore the user's account and allow them to access BizFlow again."
            : "This will immediately remove the administrator-granted Pro access. The user will return to the Free plan."
        }
        confirmLabel={
          confirmAction === "suspend"
            ? "Suspend user"
            : confirmAction === "restore"
            ? "Restore user"
            : "Revoke Pro"
        }
        cancelLabel="Cancel"
        danger={
          confirmAction === "suspend" ||
          confirmAction === "revoke-pro"
        }
        loading={actionLoading}
        onCancel={() => {
          if (!actionLoading) {
            setConfirmAction(null);
            clearError();
          }
        }}
        onConfirm={handleConfirmAction}
      />

      {/* Grant Pro modal */}
      <GrantProModal
        open={grantProOpen}
        userName={user.name}
        loading={actionLoading}
        onCancel={() => {
          if (!actionLoading) {
            setGrantProOpen(false);
            clearError();
          }
        }}
        onConfirm={handleGrantPro}
      />
    </div>
  );
};

export default AdminUserDetailPage;
