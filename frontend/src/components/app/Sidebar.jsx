import { Link, useLocation } from "react-router-dom";
import { appNavigation } from "./navigation";

const Sidebar = () => {
    const location = useLocation();

    const isActive = (href) => {
        return location.pathname === href;
    };

    return (
        <aside className="hidden w-64 shrink-0 border-r border-command-border bg-command-black lg:flex lg:flex-col">
            {/* LOGO */}

            <div className="flex h-18 items-center border-b border-command-border px-6">
                <Link
                    to="/dashboard"
                    className="flex items-center gap-3"
                >
                    <span className="flex h-9 w-9 items-center justify-center rounded-command-sm bg-command-green text-sm font-black text-[#061008]">
                        B
                    </span>

                    <span className="font-semibold tracking-tight">
                        BizFlow
                    </span>
                </Link>
            </div>

            {/* NAVIGATION */}

            <nav className="flex-1 overflow-y-auto px-3 py-5">
                {appNavigation.map((section) => (
                    <div
                        key={section.label}
                        className="mb-7"
                    >
                        <p className="mb-2 px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-command-muted/60">
                            {section.label}
                        </p>

                        <div className="space-y-1">
                            {section.items.map(
                                (item) => {
                                    const Icon =
                                        item.icon;

                                    const active =
                                        isActive(
                                            item.href
                                        );

                                    return (
                                        <Link
                                            key={
                                                item.href
                                            }
                                            to={
                                                item.href
                                            }
                                            className={`group flex items-center gap-3 rounded-command-md px-3 py-2.5 text-sm transition ${
                                                active
                                                    ? "bg-command-green/10 text-command-green"
                                                    : "text-command-muted hover:bg-command-surface hover:text-command-white"
                                            }`}
                                        >
                                            <Icon
                                                size={
                                                    17
                                                }
                                                strokeWidth={
                                                    1.8
                                                }
                                                className={
                                                    active
                                                        ? "text-command-green"
                                                        : "text-command-muted group-hover:text-command-white"
                                                }
                                            />

                                            <span>
                                                {
                                                    item.label
                                                }
                                            </span>
                                        </Link>
                                    );
                                }
                            )}
                        </div>
                    </div>
                ))}
            </nav>

            {/* BOTTOM STATUS */}

            {/* <div className="border-t border-command-border p-4">
                <div className="rounded-command-md border border-command-border bg-command-surface/50 px-3 py-3">
                    <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-command-green shadow-[0_0_8px_rgba(91,214,126,0.7)]" />

                        <span className="font-mono text-[10px] uppercase tracking-wider text-command-muted">
                            System operational
                        </span>
                    </div>
                </div>
            </div>*/}
        </aside>
    );
};

export default Sidebar;
