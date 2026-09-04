import Container from "../ui/Container";

const Footer = () => {
    return (
        <footer className="border-t border-command-border">
            <Container>
                <div className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-command-green text-[10px] font-black text-[#061008]">
                            B
                        </span>

                        <span className="text-sm font-semibold">
                            BizFlow
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-6 font-mono text-[9px] uppercase tracking-wider text-command-subtle">
                        <a
                            href="#features"
                            className="hover:text-command-white"
                        >
                            Features
                        </a>

                        <a
                            href="#pricing"
                            className="hover:text-command-white"
                        >
                            Pricing
                        </a>

                        <a
                            href="#faq"
                            className="hover:text-command-white"
                        >
                            FAQ
                        </a>

                        <a
                            href="#privacy"
                            className="hover:text-command-white"
                        >
                            Privacy
                        </a>
                    </div>

                    <p className="font-mono text-[9px] text-command-subtle">
                        © 2026 BizFlow
                    </p>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
