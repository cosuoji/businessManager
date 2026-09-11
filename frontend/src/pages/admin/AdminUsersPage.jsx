import { RefreshCw, Users } from "lucide-react";
import { useEffect, useState } from "react";

import AdminFilterBar from "../../components/admin/AdminFilterBar";
import AdminPagination from "../../components/admin/AdminPagination";
import AdminUserTable from "../../components/admin/AdminUserTable";

import AdminLoadingState from "../../components/admin/AdminLoadingState";
import AdminErrorState from "../../components/admin/AdminErrorState";
import AdminEmptyState from "../../components/admin/AdminEmptyState";

import useAdminUsers from "../../hooks/useAdminUsers";

const AdminUsersPage = () => {
  const [page, setPage] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [plan, setPlan] = useState("");
  const [status, setStatus] = useState("");

  /*
   * Small debounce so we don't fire an API request
   * on every individual keystroke.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const {
    users,
    pagination,
    loading,
    error,
    refresh,
  } = useAdminUsers({
    page,
    limit: 20,
    search,
    plan,
    status,
  });

  const handlePlanChange = (value) => {
    setPlan(value);
    setPage(1);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setPlan("");
    setStatus("");
    setPage(1);
  };

  const hasFilters =
    Boolean(search) ||
    Boolean(plan) ||
    Boolean(status);

  const totalUsers = pagination?.total || 0;

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users
              size={17}
              strokeWidth={1.7}
              className="text-command-muted"
            />

            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-command-muted">
              Account management
            </p>
          </div>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Users
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-command-muted">
            Search and manage BizFlow user accounts,
            subscriptions and access.
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-command-border px-4 py-2.5 text-sm transition-colors hover:bg-command-surface disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={15}
            className={loading ? "animate-spin" : ""}
          />

          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="mt-8">
        <AdminFilterBar
          search={searchInput}
          onSearchChange={setSearchInput}
          plan={plan}
          onPlanChange={handlePlanChange}
          status={status}
          onStatusChange={handleStatusChange}
          onClear={clearFilters}
        />
      </div>

      {/* Users */}
      <section className="mt-6 rounded-command-lg border border-command-border bg-command-surface">
        <div className="flex items-center justify-between border-b border-command-border px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold">
              All users
            </h2>

            <p className="mt-1 text-xs text-command-muted">
              {totalUsers} total account
              {totalUsers === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <div className="p-5">
          {loading ? (
            <AdminLoadingState message="Loading users..." />
          ) : error ? (
            <AdminErrorState
              message={error}
              onRetry={refresh}
            />
          ) : totalUsers === 0 ? (
            <AdminEmptyState
              title={
                hasFilters
                  ? "No users found."
                  : "No users yet."
              }
              description={
                hasFilters
                  ? "Try changing or clearing your search and filters."
                  : "User accounts will appear here as businesses sign up for BizFlow."
              }
            />
          ) : (
            <>
              <AdminUserTable users={users} />

              {pagination?.totalPages > 1 && (
                <div className="mt-5">
                  <AdminPagination
                    pagination={pagination}
                    onPrevious={() =>
                      setPage(
                        (current) => current - 1
                      )
                    }
                    onNext={() =>
                      setPage(
                        (current) => current + 1
                      )
                    }
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminUsersPage;
