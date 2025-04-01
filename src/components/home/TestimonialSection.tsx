import { useQuery } from "@tanstack/react-query";
import TestimonialCard from "@/components/ui/testimonial-card";
import { Testimonial } from "@shared/schema";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

const TestimonialSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const { data: testimonials, isLoading, error } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth / 2;
      
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from our satisfied customers who found their ideal land properties with Nainaland Deals.
          </p>
        </div>
        
        {isLoading ? (
          <div className="text-center py-10">Loading testimonials...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">Error loading testimonials</div>
        ) : (
          <>
            <div className="relative">
              <div 
                ref={scrollContainerRef} 
                className="flex overflow-x-auto pb-8 -mx-4 px-4 snap-x snap-mandatory scroll-smooth hide-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {testimonials && testimonials.length > 0 ? (
                  testimonials.map((testimonial) => (
                    <div 
                      key={testimonial.id} 
                      className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 px-4 snap-start"
                    >
                      <TestimonialCard testimonial={testimonial} />
                    </div>
                  ))
                ) : (
                  <div className="w-full text-center py-10">
                    No testimonials found.
                  </div>
                )}
              </div>
              
              {testimonials && testimonials.length > 1 && (
                <div className="flex justify-center mt-6 space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={() => scroll('left')}
                    className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => scroll('right')}
                    className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </Button>
                </div>
              )}
            </div>
            
            <style jsx>{`
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </>
        )}
      </div>
    </section>
  );
};

export default TestimonialSection;
