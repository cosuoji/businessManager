import Container from "../ui/Container";

const TrustStrip = () => {
    const items = [
        "CUSTOMERS",
        "ORDERS",
        "PAYMENTS",
        "INVOICES",
        "RECEIPTS",
        "OUTSTANDING",
    ];

    return (
        <section className="border-y border-command-border bg-command-surface">
            <Container>
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 py-7 sm:justify-between">
                    {items.map((item) => (
                        <span
                            key={item}
                            className="font-mono text-[9px] tracking-[.18em] text-command-subtle"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default TrustStrip;
