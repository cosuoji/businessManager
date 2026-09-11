import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AdminUserStatus from "./AdminUserStatus";
import AdminSubscriptionBadge from "./AdminSubscriptionBadge";

const AdminUserTable = ({ users }) => {
  const navigate = useNavigate();

  if (users.length === 0) {
    return (
      <div className="px-5 py-12 text-center">
        <p className="text-sm font-medium">
          No users found
        </p>

        <p className="mt-2 text-xs text-command-muted">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] text-left">
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

            <th className="w-12 px-3 py-3" />
          </tr>
        </thead>

        <tbody className="divide-y divide-command-border">
          {users.map((user) => (
            <tr
              key={user._id}
              onClick={() =>
                navigate(`/admin/users/${user._id}`)
              }
              className="cursor-pointer transition-colors hover:bg-command-black/40"
            >
              <td className="px-5 py-4">
                <div className="text-sm font-medium">
                  {user.name || "Unnamed user"}
                </div>

                <div className="mt-1 text-xs text-command-muted">
                  {user.email}
                </div>
              </td>

              <td className="px-5 py-4">
                <div className="text-sm">
                  {user.businessName || "—"}
                </div>

                <div className="mt-1 text-xs text-command-muted">
                  {user.phone || "No phone"}
                </div>
              </td>

              <td className="px-5 py-4">
                <AdminSubscriptionBadge
                  subscription={user.subscription}
                />
              </td>

              <td className="px-5 py-4">
                <AdminUserStatus
                  status={user.accountStatus}
                />
              </td>

              <td className="px-5 py-4 font-mono text-xs text-command-muted">
                {formatDate(user.createdAt)}
              </td>

              <td className="px-3 py-4">
                <ChevronRight
                  size={16}
                  className="text-command-muted"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserTable;
