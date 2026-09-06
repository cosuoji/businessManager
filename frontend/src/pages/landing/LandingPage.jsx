import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import Hero from "../../components/landing/Hero";
import DashboardPreview from "../../components/landing/DashboardPreview";
import TrustStrip from "../../components/landing/TrustStrip";
import FeatureSection from "../../components/landing/FeatureSection";
import WhatsAppSection from "../../components/landing/WhatsAppSection";
import PricingSection from "../../components/landing/PricingSection";
import FAQSection from "../../components/landing/FAQSection";
import FinalCTA from "../../components/landing/FinalCTA";


function App() {

    return (
        <div className="min-h-screen overflow-x-hidden bg-command-black text-command-white">
            <Navbar />
            <main>
                <Hero />
                <DashboardPreview />
                <div className="mt-20">
                    <TrustStrip />
                </div>
                <FeatureSection />
                <WhatsAppSection />
                <PricingSection />
                <FAQSection />
                <FinalCTA />
            </main>
            <Footer />
        </div>
    );
}

export default App;
