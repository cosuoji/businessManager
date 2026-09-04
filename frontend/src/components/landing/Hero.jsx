import Badge from "../ui/Badge";
import Button from "../ui/Button";

const Hero = () => {
    return (
        <section className="relative overflow-hidden">
            <div className="command-glow left-1/2 top-[-250px] -translate-x-1/2" />

            <div className="command-grid absolute inset-0 opacity-30" />

            <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-24 text-center sm:px-6 sm:pb-24 sm:pt-32 lg:px-8 lg:pb-28 lg:pt-40">
                <div className="animate-command-fade-up">
                    <Badge dot>
                        Business operating system
                    </Badge>
                </div>

                <h1 className="mx-auto mt-8 max-w-5xl animate-command-fade-up text-5xl font-semibold leading-[0.95] tracking-[-0.055em] [animation-delay:100ms] sm:text-6xl md:text-7xl lg:text-[6.5rem]">
                    Your entire business.
                    <br />

                    <span className="text-command-green">
                        Under control.
                    </span>
                </h1>

                <p className="mx-auto mt-7 max-w-2xl animate-command-fade-up text-base leading-7 text-command-muted [animation-delay:200ms] sm:text-lg">
                    Customers, orders, payments, invoices,
                    receipts and outstanding balances — all
                    in one simple place.
                </p>

                <div className="mt-9 flex animate-command-fade-up flex-col justify-center gap-3 [animation-delay:300ms] sm:flex-row">
                    <Button href="#signup">
                        Start for free
                        <span>→</span>
                    </Button>

                    <Button
                        href="#features"
                        variant="secondary"
                    >
                        See how it works
                    </Button>
                </div>


            </div>
        </section>
    );
};

export default Hero;
