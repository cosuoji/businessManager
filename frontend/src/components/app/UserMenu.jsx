import { useState, useEffect, useRef } from "react";
import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    ChevronDown,
    LogOut,
    Settings,
    ShoppingBag
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import {
    useUsage,
} from "../../hooks/useUsage";

import UsageMeter from "../common/UsageMeter";
import UpgradeButton from "../common/UpgradeButton";


const UserMenu = () => {
    const navigate = useNavigate();

    const {
        user,
        logout,
  } = useAuth();

  const menuRef = useRef(null);


    const [open, setOpen] =
        useState(false);

    const {
        usage,
        loading: usageLoading,
        refreshUsage,
    } = useUsage({
        enabled: open,
    });

    useEffect(() => {
        if (!open) {
            return;
        }

        const handleClickAway = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(
                    event.target
                )
            ) {
                setOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickAway
        );

        document.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickAway
            );

            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, [open]);

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
        <div ref={menuRef} className="relative">
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
              <div className="absolute right-0 top-full mt-5 w-56 overflow-hidden rounded-command-md border border-command-border bg-command-surface">

                <div className="p-1.5">

                    {/* PLAN + USAGE */}

                    <div className="mb-1.5 border-b border-command-border px-3 pb-3">
                        <div className="mb-3 flex items-center justify-between">
                            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-command-muted/60">
                                Current plan
                            </span>

                            <span
                                className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider ${
                                    user?.subscription?.plan === "pro"
                                        ? "bg-command-green/10 text-command-green"
                                        : "bg-command-black text-command-muted"
                                }`}
                            >
                                {user?.subscription?.plan === "pro"
                                    ? "Pro"
                                    : "Free"}
                            </span>
                        </div>

                        {usageLoading && !usage ? (
                            <div className="space-y-3">
                                <div className="h-3 animate-pulse rounded bg-command-black" />
                                <div className="h-3 animate-pulse rounded bg-command-black" />
                                <div className="h-3 animate-pulse rounded bg-command-black" />
                                <div className="h-3 animate-pulse rounded bg-command-black" />
                            </div>
                        ) : usage ? (
                            <div className="space-y-3">
                                <UsageMeter
                                    label="Customers"
                                    used={
                                        usage?.customers?.used
                                    }
                                    limit={
                                        usage?.customers?.limit
                                    }
                                />

                                <UsageMeter
                                    label="Orders"
                                    used={
                                        usage?.orders?.used
                                    }
                                    limit={
                                        usage?.orders?.limit
                                    }
                                />

                                <UsageMeter
                                    label="Invoices"
                                    used={
                                        usage?.invoices?.used
                                    }
                                    limit={
                                        usage?.invoices?.limit
                                    }
                                />

                                <UsageMeter
                                    label="Receipts"
                                    used={
                                        usage?.receipts?.used
                                    }
                                    limit={
                                        usage?.receipts?.limit
                                    }
                                />

                                {user?.subscription?.plan ===
                                    "free" &&
                                    (
                                        <UpgradeButton />
                                    )}
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={refreshUsage}
                                className="text-[10px] text-command-muted transition hover:text-command-white"
                            >
                                Unable to load usage. Retry.
                            </button>
                        )}
                    </div>

                    {/* <Link
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
              </Link>*/}
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
