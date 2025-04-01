import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Ruler, LayoutGrid, Trees, Video } from "lucide-react";
import { Property } from "@shared/schema";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const { 
    id, 
    title, 
    price, 
    location, 
    size, 
    sizeUnit, 
    features, 
    images, 
    videoUrl,
    isFeatured,
    propertyType 
  } = property;

  // Format price in Indian currency format (e.g., ₹1.2 Cr for 12000000)
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} Lac`;
    } else {
      return `₹${price.toLocaleString('en-IN')}`;
    }
  };

  // Default image if none available
  const imageUrl = images && images.length > 0 
    ? images[0] 
    : "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80";

  return (
    <Card className="property-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-transform hover:-translate-y-1">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-56 object-cover"
        />
        {isFeatured && (
          <span className="absolute top-4 left-4 bg-[#FF6B35] text-white text-sm font-medium px-3 py-1 rounded-md">
            Featured
          </span>
        )}
        {propertyType === "Agricultural" && (
          <span className="absolute top-4 left-4 bg-[#A67C52] text-white text-sm font-medium px-3 py-1 rounded-md">
            Agricultural
          </span>
        )}
        {propertyType === "Commercial" && (
          <span className="absolute top-4 left-4 bg-[#333333] text-white text-sm font-medium px-3 py-1 rounded-md">
            Commercial
          </span>
        )}
        {videoUrl && (
          <span className="absolute top-4 right-4 bg-red-600 text-white text-sm font-medium px-3 py-1 rounded-md flex items-center">
            <Video className="h-3 w-3 mr-1" /> Video
          </span>
        )}
      </div>

      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <span className="text-primary font-bold">{formatPrice(price)}</span>
        </div>
        
        <p className="text-gray-500 mb-4 flex items-center">
          <MapPin className="h-4 w-4 mr-2" /> {location}
        </p>
        
        <div className="flex justify-between text-sm text-gray-600 mb-6">
          <span className="flex items-center">
            <Ruler className="h-4 w-4 mr-1" /> {size} {sizeUnit}
          </span>
          {features && features.length > 0 && (
            <>
              <span className="flex items-center">
                <LayoutGrid className="h-4 w-4 mr-1" /> {features[0]}
              </span>
              {features.length > 1 && (
                <span className="flex items-center">
                  <Trees className="h-4 w-4 mr-1" /> {features[1]}
                </span>
              )}
            </>
          )}
        </div>
        
        <Link href={`/properties/${id}`} className="block text-center bg-white text-primary border border-primary py-2 rounded-md hover:bg-primary hover:text-white transition">
          View Details
        </Link>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;