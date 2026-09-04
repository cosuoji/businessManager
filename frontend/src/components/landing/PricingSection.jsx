import Container from "../ui/Container";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

const plans = [
    {
        name: "Free",
        description:
            "Everything you need to start organising your business.",
        price: "₦0",
        period: "forever",
        features: [
            "Customer management",
            "Order management",
            "Payment tracking",
            "Invoices & receipts",
            "Outstanding balances",
            "Business dashboard",
        ],
        featured: false,
    },
    {
        name: "Pro",
        description:
            "More visibility and control as your business grows.",
        price: "₦5,000",
        period: "per month",
        features: [
            "Everything in Free",
            "Advanced business insights",
            "Extended history",
            "Priority features",
            "More invoice & receipt customisation",
            "Priority support",
        ],
        featured: true,
    },
];

const PricingSection = () => {
    return (
        <section
            id="pricing"
            className="border-b border-command-border py-24 sm:py-32"
        >
            <Container>
                <div className="text-center">
                    <Badge>03 / Pricing</Badge>

                    <h2 className="mx-auto mt-6 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                        Start simple.
                        <br />
                        Grow when you need to.
                    </h2>

                    <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-command-muted">
                        No complicated plans. Start with the tools you need
                        and upgrade when your business requires more.
                    </p>
                </div>

                <div className="mx-auto mt-14 grid max-w-4xl gap-4 md:grid-cols-2">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative rounded-command-xl border p-7 sm:p-8 ${
                                plan.featured
                                    ? "border-command-green bg-command-surface-2"
                                    : "border-command-border bg-command-surface"
                            }`}
                        >
                            {plan.featured && (
                                <div className="absolute right-6 top-6 rounded-full bg-command-green px-2.5 py-1 font-mono text-[8px] font-bold uppercase tracking-wider text-[#061008]">
                                    Recommended
                                </div>
                            )}

                            <p className="text-sm font-semibold">
                                {plan.name}
                            </p>

                            <p className="mt-3 max-w-xs text-sm leading-6 text-command-muted">
                                {plan.description}
                            </p>

                            <div className="mt-8">
                                <span className="text-4xl font-semibold tracking-tight">
                                    {plan.price}
                                </span>

                                <span className="ml-2 text-xs text-command-muted">
                                    / {plan.period}
                                </span>
                            </div>

                            <Button
                                className="mt-8 w-full"
                                variant={
                                    plan.featured
                                        ? "primary"
                                        : "secondary"
                                }
                            >
                                {plan.featured
                                    ? "Start Pro"
                                    : "Start for free"}
                            </Button>

                            <div className="mt-8 border-t border-command-border pt-6">
                                <p className="font-mono text-[8px] uppercase tracking-widest text-command-subtle">
                                    Includes
                                </p>

                                <ul className="mt-4 space-y-3">
                                    {plan.features.map(
                                        (feature) => (
                                            <li
                                                key={
                                                    feature
                                                }
                                                className="flex gap-3 text-sm text-command-text"
                                            >
                                                <span className="text-command-green">
                                                    ✓
                                                </span>

                                                {feature}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default PricingSection;
