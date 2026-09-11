import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ScrollText,
  ArrowLeft,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  const navItems = [
    {
      label: "Overview",
      to: "/admin",
      icon: LayoutDashboard,
      end: true,
    },
    {
      label: "Users",
      to: "/admin/users",
      icon: Users,
    },
    {
      label: "Audit Logs",
      to: "/admin/audit-logs",
      icon: ScrollText,
    },
  ];

  const closeMobileNav = () => {
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-command-black text-white">
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeMobileNav}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-72 border-r border-command-border",
          "bg-command-surface transition-transform duration-200",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-full flex-col">
          {/* Brand */}
          <div className="flex h-20 items-center justify-between border-b border-command-border px-6">
            <div>
              <div className="text-lg font-semibold tracking-tight">
                BizFlow
              </div>

              <div className="mt-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-command-muted">
                <ShieldCheck size={12} />
                Admin Console
              </div>
            </div>

            <button
              type="button"
              onClick={closeMobileNav}
              className="rounded-lg p-2 text-command-muted hover:bg-command-black hover:text-white lg:hidden"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Admin identity */}
          <div className="border-b border-command-border px-4 py-4">
            <div className="rounded-command-lg border border-command-border bg-command-black/40 px-3 py-3">
              <div className="text-sm font-medium">
                {user?.name || "Administrator"}
              </div>

              <div className="mt-1 truncate text-xs text-command-muted">
                {user?.email}
              </div>

              <div className="mt-3 inline-flex items-center rounded-full border border-command-border px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-command-muted">
                Administrator
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            <div className="mb-3 px-3 font-mono text-[9px] uppercase tracking-[0.2em] text-command-muted">
              Administration
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={closeMobileNav}
                  className={({ isActive }) =>
                    [
                      "group flex items-center gap-3 rounded-command-lg px-3 py-2.5",
                      "text-sm transition-all duration-150",
                      isActive
                        ? "bg-command-black text-white shadow-sm"
                        : "text-command-muted hover:bg-command-black/60 hover:text-white",
                    ].join(" ")
                  }
                >
                  <Icon
                    size={17}
                    strokeWidth={1.8}
                    className="transition-transform duration-150 group-hover:translate-x-0.5"
                  />

                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-command-border p-4">
            <NavLink
              to="/dashboard"
              onClick={closeMobileNav}
              className="flex items-center gap-3 rounded-command-lg px-3 py-2.5 text-sm text-command-muted transition-colors hover:bg-command-black/60 hover:text-white"
            >
              <ArrowLeft size={17} strokeWidth={1.8} />
              <span>Back to BizFlow</span>
            </NavLink>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="min-h-screen lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-command-border bg-command-black/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="rounded-lg p-2 text-command-muted hover:bg-command-surface hover:text-white lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>

              <div>
                <div className="text-sm font-medium">
                  Admin Console
                </div>

                <div className="hidden font-mono text-[9px] uppercase tracking-[0.18em] text-command-muted sm:block">
                  System administration
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="rounded-full border border-command-border px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-command-muted">
                ADMIN
              </div>
            </div>
          </div>
        </header>

        {/* Page */}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
