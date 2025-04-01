import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Property } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

const PropertyDetailPage = () => {
  const [match, params] = useRoute<{ id: string }>("/properties/:id");
  const propertyId = params?.id ? parseInt(params.id) : 0;
  const detailsRef = useRef<HTMLDivElement>(null);

  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: [`/api/properties/${propertyId}`],
    enabled: !!propertyId,
  });

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  // Convert YouTube URL to embed format
  const getEmbedUrl = (url: string | null): string => {
    if (!url) return "";
    
    // Handle different YouTube URL formats
    let videoId = "";
    
    // Regular YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID
    const regExpWatch = /^.*(youtu.be\/|v\/|u\/\w\/|watch\?v=|&v=)([^#&?]*).*/;
    const matchWatch = url.match(regExpWatch);
    
    if (matchWatch && matchWatch[2].length === 11) {
      videoId = matchWatch[2];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Already an embed URL
    const regExpEmbed = /^.*(youtube.com\/embed\/)([^#&?]*).*/;
    const matchEmbed = url.match(regExpEmbed);
    
    if (matchEmbed && matchEmbed[2].length === 11) {
      return url; // Already in correct format
    }
    
    // Shortened youtu.be URL: https://youtu.be/VIDEO_ID
    const regExpShort = /^.*(youtu.be\/)([^#&?]*).*/;
    const matchShort = url.match(regExpShort);
    
    if (matchShort && matchShort[2].length === 11) {
      videoId = matchShort[2];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // If no match, return original URL (fallback)
    return url;
  };
  
  const scrollToDetails = () => {
    if (detailsRef.current) {
      const yOffset = -20; // Add a small offset to account for any fixed headers
      const element = detailsRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

  // Format price in Indian currency format
  const formatPrice = (price?: number) => {
    if (!price) return "Price on request";
    
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} Lac`;
    } else {
      return `₹${price.toLocaleString('en-IN')}`;
    }
  };

  return (
    <>
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4">Loading property details...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">
              <p>Error loading property details. Please try again later.</p>
            </div>
          ) : property ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Property Images and Details */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                  {/* Property Images Carousel */}
                  <Carousel className="w-full">
                    <CarouselContent>
                      {property.images && property.images.length > 0 ? (
                        property.images.map((image, index) => (
                          <CarouselItem key={index}>
                            <div className="p-1">
                              <img
                                src={image}
                                alt={`${property.title} - Image ${index + 1}`}
                                className="w-full h-80 object-cover rounded-md"
                              />
                            </div>
                          </CarouselItem>
                        ))
                      ) : (
                        <CarouselItem>
                          <div className="p-1">
                            <div className="bg-gray-200 w-full h-80 flex items-center justify-center rounded-md">
                              <p className="text-gray-500">No images available</p>
                            </div>
                          </div>
                        </CarouselItem>
                      )}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                  
                  {property.videoUrl && (
                    <div className="flex justify-center mt-4 mb-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1 text-sm shadow-md hover:shadow-lg hover:bg-primary hover:text-white transition-all duration-300"
                        onClick={scrollToDetails}
                      >
                        <span className="font-medium">Watch Property Video</span> <ChevronDown className="h-4 w-4 ml-1 animate-bounce" />
                      </Button>
                    </div>
                  )}

                  {/* Property Details */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                      <div>
                        <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                        <p className="text-gray-600 mb-4">
                          <i className="fas fa-map-marker-alt mr-2"></i>
                          {property.location}
                        </p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <h2 className="text-2xl font-bold text-primary">{formatPrice(property.price)}</h2>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-gray-50 p-4 rounded-md text-center">
                        <i className="fas fa-ruler-combined text-primary text-xl mb-2"></i>
                        <p className="text-gray-600 text-sm">Size</p>
                        <p className="font-semibold">{property.size} {property.sizeUnit}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md text-center">
                        <i className="fas fa-building text-primary text-xl mb-2"></i>
                        <p className="text-gray-600 text-sm">Property Type</p>
                        <p className="font-semibold">{property.propertyType}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md text-center">
                        <i className="fas fa-certificate text-primary text-xl mb-2"></i>
                        <p className="text-gray-600 text-sm">Status</p>
                        <p className="font-semibold">{property.isFeatured ? "Featured" : "Available"}</p>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-4">Description</h3>
                      <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <h3 className="text-xl font-semibold mb-4">Features</h3>
                      <div className="flex flex-wrap gap-2">
                        {property.features && property.features.length > 0 ? (
                          property.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="px-3 py-1">
                              <i className="fas fa-check text-primary mr-2"></i>
                              {feature}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-gray-500">No features specified</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Property Video */}
                {property.videoUrl && (
                  <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 mb-8 border-2 border-primary" ref={detailsRef}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">Property Video</h3>
                      <Badge variant="default" className="bg-primary text-white px-3 py-1">
                        <i className="fas fa-video mr-2"></i> Video Tour
                      </Badge>
                    </div>
                    <div className="relative" style={{ paddingBottom: "56.25%" /* 16:9 Aspect Ratio */ }}>
                      <iframe 
                        src={getEmbedUrl(property.videoUrl)}
                        className="absolute top-0 left-0 w-full h-full rounded-md"
                        title="Property Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}

                {/* Map Section */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 mb-8">
                  <h3 className="text-xl font-semibold mb-4">Location Map</h3>
                  <div className="bg-gray-200 h-80 flex items-center justify-center rounded-md">
                    <p className="text-gray-500">Map view is not available. Please contact us for the exact location details.</p>
                  </div>
                </div>
              </div>

              {/* Contact and Related Properties */}
              <div className="lg:col-span-1">
                {/* Contact Card */}
                <Card className="mb-8">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">Interested in this property?</h3>
                    <p className="text-gray-600 mb-6">Fill out the form below and our agent will get in touch with you shortly.</p>

                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input 
                          type="text" 
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary" 
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input 
                          type="email" 
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary" 
                          placeholder="Your email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone</label>
                        <input 
                          type="tel" 
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary" 
                          placeholder="Your phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Message</label>
                        <textarea 
                          rows={4} 
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary" 
                          placeholder="I'm interested in this property..."
                        ></textarea>
                      </div>
                      <Button className="w-full bg-primary text-white">
                        Send Inquiry
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Agent Card */}
                <Card className="mb-8">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                        <img 
                          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80" 
                          alt="Property Agent" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">Raj Sharma</h4>
                        <p className="text-gray-600 text-sm">Senior Property Consultant</p>
                        <div className="text-[#FF6B35] text-sm mt-1">
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star-half-alt"></i>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <i className="fas fa-phone-alt text-primary mr-3"></i>
                        <span>+91 98765 43210</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-envelope text-primary mr-3"></i>
                        <span>raj@nainalanddeals.com</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">
                        <i className="fas fa-calendar-alt mr-2"></i> Schedule a Visit
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Links */}
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-3">
                      <li>
                        <a href="#" className="flex items-center text-gray-600 hover:text-primary transition">
                          <i className="fas fa-file-alt mr-3"></i>
                          Download Brochure
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center text-gray-600 hover:text-primary transition">
                          <i className="fas fa-share-alt mr-3"></i>
                          Share Property
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center text-gray-600 hover:text-primary transition">
                          <i className="fas fa-print mr-3"></i>
                          Print Details
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center text-gray-600 hover:text-primary transition">
                          <i className="fas fa-heart mr-3"></i>
                          Save to Favorites
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center text-gray-600 hover:text-primary transition">
                          <i className="fas fa-flag mr-3"></i>
                          Report This Property
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
              <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
              <Button asChild className="bg-primary">
                <a href="/properties">Browse All Properties</a>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default PropertyDetailPage;
