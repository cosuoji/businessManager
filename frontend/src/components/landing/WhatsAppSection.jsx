import Container from "../ui/Container";
import Badge from "../ui/Badge";

const WhatsAppSection = () => {
    return (
        <section
            id="whatsapp"
            className="border-b border-command-border bg-command-surface py-24 sm:py-32"
        >
            <Container>
                <div className="grid items-center gap-16 lg:grid-cols-2">
                    <div>
                        <Badge>
                            02 / WhatsApp ready
                        </Badge>

                        <h2 className="mt-6 max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
                            Work where your customers already are.
                        </h2>

                        <p className="mt-6 max-w-lg text-base leading-7 text-command-muted">
                            Generate invoices, receipts and payment
                            reminders that are ready to send. One click
                            opens the conversation in WhatsApp.
                        </p>

                        <div className="mt-8 space-y-3">
                            {[
                                "Invoice messages",
                                "Receipt messages",
                                "Payment reminders",
                                "Outstanding balance messages",
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-3 text-sm text-command-text"
                                >
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-command-green-soft text-[10px] text-command-green">
                                        ✓
                                    </span>

                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* MESSAGE PREVIEW */}

                    <div className="rounded-command-xl border border-command-border bg-command-black p-3 shadow-2xl shadow-black/30">
                        <div className="rounded-command-lg border border-command-border bg-[#101712]">
                            <div className="flex items-center justify-between border-b border-command-border px-5 py-4">
                                <div>
                                    <p className="text-xs font-semibold">
                                        Payment reminder
                                    </p>

                                    <p className="mt-1 font-mono text-[8px] text-command-subtle">
                                        #ORD-1024
                                    </p>
                                </div>

                                <span className="rounded-full bg-command-green-soft px-2 py-1 font-mono text-[8px] text-command-green">
                                    READY
                                </span>
                            </div>

                            <div className="p-5">
                                <div className="rounded-command-lg rounded-bl-sm bg-[#1a2720] p-5">
                                    <p className="text-sm leading-7 text-command-text">
                                        Hello Adebayo 👋
                                        <br />
                                        <br />
                                        This is a reminder that{" "}
                                        <strong className="text-command-white">
                                            ₦100,000
                                        </strong>{" "}
                                        remains outstanding on your
                                        order #ORD-1024.
                                        <br />
                                        <br />
                                        Please let us know if you have
                                        any questions.
                                    </p>

                                    <p className="mt-4 text-right font-mono text-[8px] text-command-subtle">
                                        10:42 AM
                                    </p>
                                </div>

                                <button className="mt-4 w-full rounded-command-md bg-command-green py-3 text-sm font-semibold text-[#061008] transition hover:bg-command-green-dark">
                                    Open WhatsApp →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default WhatsAppSection;
