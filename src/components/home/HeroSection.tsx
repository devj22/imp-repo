import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <header 
      className="pt-24 bg-cover bg-center h-screen flex items-center relative" 
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1628624747186-a941c476b7ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')`
      }}
    >
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Find Your Perfect Land Investment
          </h1>
          <p className="text-white text-xl mb-8">
            Discover premium land properties for your dream home or investment with Nainaland Deals.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/properties">
              <Button className="bg-[#FF6B35] hover:bg-opacity-90 text-white py-3 px-8 rounded-lg font-medium text-center transition">
                Explore Properties
              </Button>
            </Link>
            <a href="#contact">
              <Button variant="outline" className="bg-white text-primary hover:bg-opacity-90 py-3 px-8 rounded-lg font-medium text-center transition">
                Contact Us
              </Button>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
