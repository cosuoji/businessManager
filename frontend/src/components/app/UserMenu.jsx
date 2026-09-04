import { useState } from "react";
import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    ChevronDown,
    LogOut,
    Settings,
  Receipt,
    ShoppingBag
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const UserMenu = () => {
    const navigate = useNavigate();

    const {
        user,
        logout,
    } = useAuth();

    const [open, setOpen] =
        useState(false);

    const [loggingOut, setLoggingOut] =
        useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);

        try {
            await logout();
        } finally {
            navigate("/login", {
                replace: true,
            });
        }
    };

    const initials =
        user?.name
            ?.split(" ")
            .map((part) =>
                part.charAt(0)
            )
            .join("")
            .slice(0, 2)
            .toUpperCase() || "B";

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() =>
                    setOpen(
                        (current) =>
                            !current
                    )
                }
                className="flex items-center gap-3 rounded-command-md border border-transparent px-2 py-1.5 transition hover:border-command-border hover:bg-command-surface"
            >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-command-green/10 font-mono text-xs font-medium text-command-green">
                    {initials}
                </span>

                <div className="hidden text-left sm:block">
                    <p className="max-w-32 truncate text-xs font-medium text-command-white">
                        {user?.name ||
                            "Account"}
                    </p>

                    <p className="max-w-32 truncate text-[11px] text-command-muted">
                        {user?.businessName ||
                            "Business"}
                    </p>
                </div>

                <ChevronDown
                    size={15}
                    className="text-command-muted"
                />
            </button>

            {open && (
              <div className="absolute right-0 top-full z-999 mt-5 w-56 overflow-hidden rounded-command-md border border-command-border bg-command-surface">

                    <div className="p-1.5">
                        <Link
                            to="/invoices"
                            onClick={() =>
                                setOpen(false)
                            }
                            className="flex items-center gap-3 rounded-command-sm px-3 py-2.5 text-xs text-command-muted transition hover:bg-command-black hover:text-command-white"
                        >
                            <ShoppingBag
                                size={15}
                            />
                            Invoices
              </Link>
              <Link
                  to="/settings"
                  onClick={() =>
                      setOpen(false)
                  }
                  className="flex items-center gap-3 rounded-command-sm px-3 py-2.5 text-xs text-command-muted transition hover:bg-command-black hover:text-command-white"
              >
                  <Settings
                      size={15}
                  />

                  Settings
              </Link>

                        <button
                            type="button"
                            onClick={
                                handleLogout
                            }
                            disabled={
                                loggingOut
                            }
                            className="flex w-full items-center gap-3 rounded-command-sm px-3 py-2.5 text-xs text-red-400 transition hover:bg-red-500/5 disabled:opacity-50"
                        >
                            <LogOut
                                size={15}
                            />

                            {loggingOut
                                ? "Logging out..."
                                : "Log out"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
