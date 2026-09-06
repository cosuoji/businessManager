import { useState } from "react";
import Button from "../ui/Button";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";


const navItems = [
    {
        label: "Features",
        href: "#features",
    },
    {
        label: "WhatsApp",
        href: "#whatsapp",
    },
    {
        label: "Pricing",
        href: "#pricing",
    },
    {
        label: "FAQ",
        href: "#faq",
    },
];

const Navbar = () => {
    const [mobileOpen, setMobileOpen] =
        useState(false);

    const closeMobileMenu = () => {
        setMobileOpen(false);
  };

    const { user } = useAuth();


    return (
        <header className="relative z-50 border-b border-command-border bg-command-black/90 backdrop-blur-xl">
            <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
                {/* LOGO */}

                <a
                    href="#"
                    className="flex items-center gap-3"
                >
                    <span className="flex h-9 w-9 items-center justify-center rounded-command-sm bg-command-green text-sm font-black text-[#061008]">
                        B
                    </span>

                    <span className="font-semibold tracking-tight">
                        BizFlow
                    </span>
                </a>

                {/* DESKTOP NAV */}

                <nav className="hidden items-center gap-8 md:flex">
                    {navItems.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="text-sm text-command-muted transition hover:text-command-white"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* DESKTOP ACTIONS */}


                <div className="hidden items-center gap-3 md:flex">
                  {user ? (
                    <Link to="/dashboard">
                      <Button>
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/login">
                        <Button variant="ghost">
                          Log in
                        </Button>
                      </Link>

                      <Link to="/register">
                        <Button>
                          Start free
                        </Button>
                      </Link>
                    </>
                  )}
                </div>

                {/* MOBILE MENU BUTTON */}

                <button
                    type="button"
                    onClick={() =>
                        setMobileOpen(!mobileOpen)
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-command-md border border-command-border md:hidden"
                    aria-label="Toggle navigation"
                >
                    <div className="space-y-1.5">
                        <span
                            className={`block h-px w-5 bg-command-white transition ${
                                mobileOpen
                                    ? "translate-y-2 rotate-45"
                                    : ""
                            }`}
                        />

                        <span
                            className={`block h-px w-5 bg-command-white transition ${
                                mobileOpen
                                    ? "opacity-0"
                                    : ""
                            }`}
                        />

                        <span
                            className={`block h-px w-5 bg-command-white transition ${
                                mobileOpen
                                    ? "-translate-y-2 -rotate-45"
                                    : ""
                            }`}
                        />
                    </div>
                </button>
            </div>

            {/* MOBILE MENU */}

            <div
                className={`overflow-hidden border-t border-command-border bg-command-surface transition-all duration-300 md:hidden ${
                    mobileOpen
                        ? "max-h-[500px] opacity-100"
                        : "max-h-0 opacity-0"
                }`}
            >
                <nav className="flex flex-col px-5 py-5">
                    {navItems.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            onClick={closeMobileMenu}
                            className="border-b border-command-border py-4 text-sm text-command-text"
                        >
                            {item.label}
                        </a>
                    ))}
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      {user ? (
                        <Link
                          to="/dashboard"
                          onClick={closeMobileMenu}
                          className="col-span-2"
                        >
                          <Button className="w-full">
                            Dashboard
                          </Button>
                        </Link>
                      ) : (
                        <>
                          <Link
                            to="/login"
                            onClick={closeMobileMenu}
                          >
                            <Button
                              variant="secondary"
                              className="w-full"
                            >
                              Log in
                            </Button>
                          </Link>

                          <Link
                            to="/register"
                            onClick={closeMobileMenu}
                          >
                            <Button className="w-full">
                              Start free
                            </Button>
                          </Link>
                        </>
                      )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
