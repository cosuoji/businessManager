import Container from "../ui/Container";
import Badge from "../ui/Badge";
import FeatureGrid from "./FeatureGrid";

const FeatureSection = () => {
    return (
        <section
            id="features"
            className="border-b border-command-border py-24 sm:py-32"
        >
            <Container>
                <div className="grid gap-14 lg:grid-cols-[.65fr_1.35fr]">
                    <div>
                        <Badge>
                            01 / Everything connected
                        </Badge>

                        <h2 className="mt-6 max-w-md text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                            One system.
                            <br />
                            Every number.
                        </h2>

                        <p className="mt-6 max-w-sm text-sm leading-6 text-command-muted">
                            Stop jumping between notebooks,
                            spreadsheets and WhatsApp conversations.
                        </p>
                    </div>

                    <FeatureGrid />
                </div>
            </Container>
        </section>
    );
};

export default FeatureSection;
