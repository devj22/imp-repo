import { Button } from "@/components/ui/button";

const AboutSection = () => {
  return (
    <section className="py-20 bg-white" id="about">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80" 
              alt="Team of Nainaland Deals" 
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-6">About Nainaland Deals</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Since 2010, Nainaland Deals has been a pioneer in the land property market, helping thousands of customers find their ideal land investments across South India.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Our team of experienced real estate professionals is committed to providing personalized guidance throughout your property buying journey, from initial search to final purchase.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center">
                <i className="fas fa-check-circle text-primary text-xl mr-3"></i>
                <span>10+ Years of Experience</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check-circle text-primary text-xl mr-3"></i>
                <span>1000+ Happy Customers</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check-circle text-primary text-xl mr-3"></i>
                <span>Legal Documentation</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check-circle text-primary text-xl mr-3"></i>
                <span>Premium Properties</span>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button className="bg-primary text-white hover:bg-opacity-90">
                Our Story
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                Meet Our Team
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
