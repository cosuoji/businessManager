import Container from "../ui/Container";
import Button from "../ui/Button";

const FinalCTA = () => {
    return (
        <section className="relative overflow-hidden py-28 sm:py-40">
            <div className="command-glow left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />

            <Container className="relative text-center">
                <p className="font-mono text-[9px] uppercase tracking-[.22em] text-command-green">
                    05 / Get started
                </p>

                <h2 className="mx-auto mt-6 max-w-4xl text-5xl font-semibold leading-[.95] tracking-[-0.05em] sm:text-7xl lg:text-8xl">
                    Know what happened.
                    <br />
                    <span className="text-command-green">
                        Know what's next.
                    </span>
                </h2>

                <p className="mx-auto mt-7 max-w-lg text-sm leading-6 text-command-muted">
                    Put your customers, orders and money in one place.
                </p>

                <div className="mt-9 flex justify-center">
                    <Button href="/register">
                        Start for free →
                    </Button>
                </div>
            </Container>
        </section>
    );
};

export default FinalCTA;
