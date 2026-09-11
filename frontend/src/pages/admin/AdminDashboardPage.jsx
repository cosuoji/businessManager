import {
  Activity,
  ShieldCheck,
  UserCheck,
  UserMinus,
  Users,
} from "lucide-react";

import AdminStatCard from "../../components/admin/AdminStatCard";
import useAdminDashboard from "../../hooks/useAdminDashboard";

const AdminDashboardPage = () => {
  const {
    users,
    auditLogs,
    loading,
    error,
    refresh,
  } = useAdminDashboard();

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.accountStatus === "active"
  ).length;

  const suspendedUsers = users.filter(
    (user) => user.accountStatus === "suspended"
  ).length;

  const proUsers = users.filter(
    (user) => user.subscription?.plan === "pro"
  ).length;

  const freeUsers = users.filter(
    (user) => user.subscription?.plan === "free"
  ).length;

  const flutterwaveProUsers = users.filter(
    (user) =>
      user.subscription?.plan === "pro" &&
      user.subscription?.source === "flutterwave"
  ).length;

  const adminProUsers = users.filter(
    (user) =>
      user.subscription?.plan === "pro" &&
      user.subscription?.source === "admin"
  ).length;

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="animate-pulse">
          <div className="h-8 w-40 rounded bg-command-surface" />
          <div className="mt-3 h-4 w-72 rounded bg-command-surface" />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 rounded-command-lg border border-command-border bg-command-surface"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="rounded-command-lg border border-command-border bg-command-surface p-6">
          <h2 className="text-sm font-semibold">
            Unable to load admin dashboard
          </h2>

          <p className="mt-2 text-sm text-command-muted">
            {error}
          </p>

          <button
            type="button"
            onClick={refresh}
            className="mt-5 rounded-lg border border-command-border px-4 py-2 text-sm transition-colors hover:bg-command-black"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      {/* Header */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-command-muted">
          System overview
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          Admin Dashboard
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-command-muted">
          Monitor users, account access, subscriptions and recent
          administrative activity.
        </p>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Total users"
          value={totalUsers}
          description="Registered BizFlow accounts"
          icon={Users}
        />

        <AdminStatCard
          label="Active users"
          value={activeUsers}
          description="Accounts currently accessible"
          icon={UserCheck}
        />

        <AdminStatCard
          label="Pro users"
          value={proUsers}
          description="All active Pro accounts"
          icon={ShieldCheck}
        />

        <AdminStatCard
          label="Suspended"
          value={suspendedUsers}
          description="Accounts with access blocked"
          icon={UserMinus}
        />
      </div>

      {/* Secondary information */}
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        {/* Subscription breakdown */}
        <section className="rounded-command-lg border border-command-border bg-command-surface">
          <div className="border-b border-command-border px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">
                  Subscription breakdown
                </h2>

                <p className="mt-1 text-xs text-command-muted">
                  Current plan distribution across users.
                </p>
              </div>

              <Activity
                size={17}
                strokeWidth={1.7}
                className="text-command-muted"
              />
            </div>
          </div>

          <div className="divide-y divide-command-border">
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-sm">Free</span>
              <span className="font-mono text-sm text-command-muted">
                {freeUsers}
              </span>
            </div>

            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-sm">
                Flutterwave-managed Pro
              </span>
              <span className="font-mono text-sm text-command-muted">
                {flutterwaveProUsers}
              </span>
            </div>

            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-sm">
                Admin-managed Pro
              </span>
              <span className="font-mono text-sm text-command-muted">
                {adminProUsers}
              </span>
            </div>
          </div>
        </section>

        {/* Recent activity */}
        <section className="rounded-command-lg border border-command-border bg-command-surface">
          <div className="border-b border-command-border px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">
                  Recent activity
                </h2>

                <p className="mt-1 text-xs text-command-muted">
                  Latest administrative actions.
                </p>
              </div>

              <Activity
                size={17}
                strokeWidth={1.7}
                className="text-command-muted"
              />
            </div>
          </div>

          {auditLogs.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-command-muted">
              No administrative activity yet.
            </div>
          ) : (
            <div className="divide-y divide-command-border">
              {auditLogs.slice(0, 5).map((log) => (
                <div
                  key={log._id}
                  className="px-5 py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">
                        {log.action}
                      </p>

                      <p className="mt-1 text-xs text-command-muted">
                        {log.description}
                      </p>
                    </div>

                    <time className="shrink-0 font-mono text-[10px] text-command-muted">
                      {formatDate(log.createdAt)}
                    </time>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Recent users */}
      <section className="mt-6 rounded-command-lg border border-command-border bg-command-surface">
        <div className="flex items-center justify-between border-b border-command-border px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold">
              Recent users
            </h2>

            <p className="mt-1 text-xs text-command-muted">
              Most recently registered BizFlow accounts.
            </p>
          </div>

          <span className="font-mono text-[10px] uppercase tracking-wider text-command-muted">
            {totalUsers} total
          </span>
        </div>

        {users.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-command-muted">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-command-border">
                  <th className="px-5 py-3 font-mono text-[9px] uppercase tracking-wider text-command-muted">
                    User
                  </th>

                  <th className="px-5 py-3 font-mono text-[9px] uppercase tracking-wider text-command-muted">
                    Business
                  </th>

                  <th className="px-5 py-3 font-mono text-[9px] uppercase tracking-wider text-command-muted">
                    Plan
                  </th>

                  <th className="px-5 py-3 font-mono text-[9px] uppercase tracking-wider text-command-muted">
                    Status
                  </th>

                  <th className="px-5 py-3 font-mono text-[9px] uppercase tracking-wider text-command-muted">
                    Joined
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-command-border">
                {users.slice(0, 8).map((user) => (
                  <tr
                    key={user._id}
                    className="transition-colors hover:bg-command-black/30"
                  >
                    <td className="px-5 py-4">
                      <div className="text-sm font-medium">
                        {user.name || "Unnamed user"}
                      </div>

                      <div className="mt-1 text-xs text-command-muted">
                        {user.email}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-command-muted">
                      {user.businessName || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-mono text-xs uppercase">
                        {user.subscription?.plan || "free"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-mono text-xs uppercase text-command-muted">
                        {user.accountStatus || "active"}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-mono text-xs text-command-muted">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboardPage;
