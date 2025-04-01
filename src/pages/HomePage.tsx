import HeroSection from "@/components/home/HeroSection";
import PropertySection from "@/components/home/PropertySection";
import ParallaxSection from "@/components/home/ParallaxSection";
import AboutSection from "@/components/home/AboutSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import ContactSection from "@/components/home/ContactSection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <PropertySection />
        <ParallaxSection />
        <AboutSection />
        <TestimonialSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
