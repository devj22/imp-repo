import { Card, CardContent } from "@/components/ui/card";
import { Testimonial } from "@shared/schema";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  const { name, location, message, rating, image } = testimonial;
  
  // Convert rating to stars
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`star-${i}`} className="fas fa-star"></i>);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<i key="half-star" className="fas fa-star-half-alt"></i>);
    }
    
    // Add empty stars to make 5 stars total
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-star-${i}`} className="far fa-star"></i>);
    }
    
    return stars;
  };

  return (
    <Card className="bg-[#F8F8F8] p-8 rounded-lg h-full">
      <CardContent className="p-0">
        <div className="text-[#FF6B35] mb-4">
          {renderStars(rating)}
        </div>
        
        <p className="text-gray-600 mb-6 italic">"{message}"</p>
        
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
            <img 
              src={image} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-medium">{name}</h4>
            <p className="text-gray-500 text-sm">{location}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
