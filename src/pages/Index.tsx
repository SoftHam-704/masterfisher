import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import GuidesSection from "@/components/GuidesSection";
import GallerySection from "@/components/GallerySection";
import SponsorsSection from "@/components/SponsorsSection";
import CTASection from "@/components/CTASection";
import FloatingCTA from "@/components/FloatingCTA";
import Footer from "@/components/Footer";

const Index = () => {
    return (
        <main className="min-h-screen bg-background">
            <Header />
            <HeroSection />
            <FeaturesSection />
            <GuidesSection />
            <GallerySection />
            <SponsorsSection />
            <CTASection />
            <Footer />
            <FloatingCTA />
        </main>
    );
};

export default Index;
