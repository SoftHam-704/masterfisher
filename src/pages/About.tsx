import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Handshake, Smartphone, Megaphone, DollarSign } from "lucide-react";
import manuBoatImage from "@/assets/manu-boat.png";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
    const { t } = useLanguage();
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-ocean-deep text-white py-16">
                    <div className="container mx-auto px-4">
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-center">
                            {t("about.title")}
                        </h1>
                    </div>
                </section>

                {/* Main Content */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-12 items-start">
                            {/* Left Column - Text Content */}
                            <div>
                                <h2 className="font-display text-3xl font-bold text-ocean-deep mb-6">
                                    {t("about.whatIsTitle")}
                                </h2>

                                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                                    {t("about.whatIsDesc1")}
                                </p>

                                <p className="text-lg text-gray-700 mb-8 leading-relaxed">{t("about.whatIsDesc2")}</p>

                                {/* Features Grid */}
                                <div className="grid grid-cols-1 gap-6 mb-8">
                                    {/* Feature 1 */}
                                    <div className="flex gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border-l-4 border-emerald-500">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-ocean-deep rounded-full flex items-center justify-center">
                                                <Handshake className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-display text-lg font-semibold text-emerald-700 mb-2">
                                                {t("about.feature1Title")}
                                            </h3>
                                            <p className="text-gray-700">
                                                {t("about.feature1Desc")}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Feature 2 */}
                                    <div className="flex gap-4 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border-l-4 border-cyan-500">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-ocean-deep rounded-full flex items-center justify-center">
                                                <Smartphone className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-display text-lg font-semibold text-cyan-700 mb-2">
                                                {t("about.feature2Title")}
                                            </h3>
                                            <p className="text-gray-700">
                                                {t("about.feature2Desc")}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Feature 3 */}
                                    <div className="flex gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-500">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-ocean-deep rounded-full flex items-center justify-center">
                                                <Megaphone className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-display text-lg font-semibold text-green-700 mb-2">
                                                {t("about.feature3Title")}
                                            </h3>
                                            <p className="text-gray-700">
                                                {t("about.feature3Desc")}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Feature 4 */}
                                    <div className="flex gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-l-4 border-amber-500">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-ocean-deep rounded-full flex items-center justify-center">
                                                <DollarSign className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-display text-lg font-semibold text-amber-700 mb-2">
                                                {t("about.feature4Title")}
                                            </h3>
                                            <p className="text-gray-700">
                                                {t("about.feature4Desc")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Image and Quote */}
                            <div className="space-y-6">
                                {/* Hero Image */}
                                <div className="rounded-2xl overflow-hidden shadow-2xl">
                                    <img
                                        src={manuBoatImage}
                                        alt="Manu M. no barco"
                                        className="w-full h-auto object-cover"
                                    />
                                </div>

                                {/* Quote Box */}
                                <div className="bg-ocean-deep text-white p-8 rounded-2xl shadow-xl relative">
                                    <div className="absolute top-6 left-6 text-6xl text-turquoise opacity-30 font-serif">
                                        "
                                    </div>
                                    <blockquote className="relative z-10">
                                        <p className="text-lg italic leading-relaxed">
                                            {t("about.quote")}
                                        </p>
                                    </blockquote>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-ocean py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
                            {t("about.readyTitle")}
                        </h2>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            {t("about.readyDesc")}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/cadastrar"
                                className="inline-block bg-white text-ocean-deep px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                            >
                                {t("about.registerFree")}
                            </a>
                            <a
                                href="/encontrar-servicos"
                                className="inline-block bg-turquoise text-white px-8 py-4 rounded-full font-semibold hover:bg-turquoise/90 transition-colors shadow-lg"
                            >
                                {t("about.findGuides")}
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default About;

