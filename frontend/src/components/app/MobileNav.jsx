import { Link, useLocation } from "react-router-dom";
import { appNavigation } from "./navigation";

const MobileNav = () => {
    const location = useLocation();

    const items = appNavigation
        .flatMap((section) => section.items)
        .filter(
            (item) =>
                item.href !== "/settings"
        );

    return (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-command-border bg-command-black/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
            <div className="mx-auto flex max-w-xl items-center justify-around">
                {items
                    .slice(0, 5)
                    .map((item) => {
                        const Icon =
                            item.icon;

                        const active =
                            location.pathname ===
                            item.href;

                        return (
                            <Link
                                key={
                                    item.href
                                }
                                to={
                                    item.href
                                }
                                className={`flex min-w-0 flex-1 flex-col items-center gap-1 px-2 py-3 text-[10px] transition ${
                                    active
                                        ? "text-command-green"
                                        : "text-command-muted"
                                }`}
                            >
                                <Icon
                                    size={18}
                                    strokeWidth={
                                        active
                                            ? 2
                                            : 1.7
                                    }
                                />

                                <span className="truncate">
                                    {
                                        item.label
                                    }
                                </span>
                            </Link>
                        );
                    })}
            </div>
        </nav>
    );
};

export default MobileNav;
