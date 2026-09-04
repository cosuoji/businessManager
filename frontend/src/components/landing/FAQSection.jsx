import { useState } from "react";
import Container from "../ui/Container";
import Badge from "../ui/Badge";
import { faqs } from "../../data/landingData";

const FAQSection = () => {
    const [openIndex, setOpenIndex] =
        useState(null);

    const toggle = (index) => {
        setOpenIndex(
            openIndex === index
                ? null
                : index
        );
    };

    return (
        <section
            id="faq"
            className="border-b border-command-border py-24 sm:py-32"
        >
            <Container>
                <div className="grid gap-14 lg:grid-cols-[.7fr_1.3fr]">
                    <div>
                        <Badge>04 / FAQ</Badge>

                        <h2 className="mt-6 max-w-sm text-4xl font-semibold tracking-tight sm:text-5xl">
                            Questions,
                            <br />
                            answered.
                        </h2>
                    </div>

                    <div className="border-t border-command-border">
                        {faqs.map(
                            (faq, index) => {
                                const isOpen =
                                    openIndex ===
                                    index;

                                return (
                                    <div
                                        key={
                                            faq.question
                                        }
                                        className="border-b border-command-border"
                                    >
                                        <button
                                            onClick={() =>
                                                toggle(
                                                    index
                                                )
                                            }
                                            className="flex w-full items-center justify-between gap-6 py-6 text-left"
                                        >
                                            <span className="text-sm font-medium sm:text-base">
                                                {
                                                    faq.question
                                                }
                                            </span>

                                            <span
                                                className={`shrink-0 text-xl font-light text-command-muted transition-transform duration-300 ${
                                                    isOpen
                                                        ? "rotate-45"
                                                        : ""
                                                }`}
                                            >
                                                +
                                            </span>
                                        </button>

                                        <div
                                            className={`grid transition-all duration-300 ${
                                                isOpen
                                                    ? "grid-rows-[1fr] pb-6 opacity-100"
                                                    : "grid-rows-[0fr] opacity-0"
                                            }`}
                                        >
                                            <div className="overflow-hidden">
                                                <p className="max-w-2xl text-sm leading-7 text-command-muted">
                                                    {
                                                        faq.answer
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default FAQSection;
