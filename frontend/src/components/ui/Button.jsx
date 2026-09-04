const Button = ({
    children,
    variant = "primary",
    className = "",
    href,
}) => {
    const base =
        "inline-flex items-center justify-center gap-2 rounded-command-md px-5 py-3 text-sm font-semibold transition-all duration-200";

    const variants = {
        primary:
            "bg-command-green text-[#061008] hover:bg-command-green-dark hover:-translate-y-0.5",

        secondary:
            "border border-command-border bg-command-surface text-command-white hover:border-command-border-light hover:bg-command-surface-2",

        ghost:
            "text-command-muted hover:text-command-white",
    };

    const classes = `${base} ${variants[variant]} ${className}`;

    if (href) {
        return (
            <a href={href} className={classes}>
                {children}
            </a>
        );
    }

    return (
        <button className={classes}>
            {children}
        </button>
    );
};

export default Button;
