import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/ui/property-card";
import { Property } from "@shared/schema";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const PropertiesPage = () => {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  const defaultType = params.get('type') || "all";
  
  const [filters, setFilters] = useState({
    type: defaultType,
    location: "Any Location",
    priceRange: [0, 50000000], // 0 to 5 Cr
    sizeRange: [0, 20], // 0 to 20 (Guntha/Acres)
    sizeUnit: "Guntha",
    searchTerm: ""
  });
  
  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });
  
  // Filter properties based on selected filters
  const filteredProperties = properties?.filter(property => {
    // Filter by type
    if (filters.type !== "all" && property.propertyType !== filters.type) {
      return false;
    }
    
    // Filter by location (if not "Any Location")
    if (filters.location !== "Any Location" && !property.location.includes(filters.location)) {
      return false;
    }
    
    // Filter by price range
    if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) {
      return false;
    }
    
    // Filter by size (only if size unit matches)
    if (property.sizeUnit === filters.sizeUnit && 
       (property.size < filters.sizeRange[0] || property.size > filters.sizeRange[1])) {
      return false;
    }
    
    // Filter by search term
    if (filters.searchTerm && !property.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
       !property.location.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Format price for display
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} Lac`;
    } else {
      return `₹${price.toLocaleString('en-IN')}`;
    }
  };
  
  // Update filters
  const handleTypeChange = (value: string) => {
    setFilters({...filters, type: value});
  };
  
  const handleLocationChange = (value: string) => {
    setFilters({...filters, location: value});
  };
  
  const handlePriceChange = (value: number[]) => {
    setFilters({...filters, priceRange: value});
  };
  
  const handleSizeChange = (value: number[]) => {
    setFilters({...filters, sizeRange: value});
  };
  
  const handleSizeUnitChange = (value: string) => {
    setFilters({...filters, sizeUnit: value});
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({...filters, searchTerm: e.target.value});
  };
  
  const resetFilters = () => {
    setFilters({
      type: "all",
      location: "Any Location",
      priceRange: [0, 50000000],
      sizeRange: [0, 20],
      sizeUnit: "Guntha",
      searchTerm: ""
    });
  };
  
  useEffect(() => {
    // Set filter from URL parameter when component mounts
    if (defaultType !== "all" && defaultType !== filters.type) {
      setFilters(prev => ({...prev, type: defaultType}));
    }
  }, [defaultType]);

  return (
    <>
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Your Perfect Land</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our extensive portfolio of premium land properties and find the perfect investment opportunity.
            </p>
          </div>
          
          {/* Search and Filter Section */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Search</label>
                <Input 
                  type="text" 
                  placeholder="Search by title or location" 
                  value={filters.searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Property Type</label>
                <Select 
                  value={filters.type} 
                  onValueChange={handleTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    <SelectItem value="Residential">Residential Plots</SelectItem>
                    <SelectItem value="Agricultural">Agricultural Land</SelectItem>
                    <SelectItem value="Commercial">Commercial Plots</SelectItem>
                    <SelectItem value="FarmHouse">Farm Houses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Select 
                  value={filters.location} 
                  onValueChange={handleLocationChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any Location">Any Location</SelectItem>
                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                    <SelectItem value="Mysore">Mysore</SelectItem>
                    <SelectItem value="Chennai">Chennai</SelectItem>
                    <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Size Unit</label>
                <Select 
                  value={filters.sizeUnit} 
                  onValueChange={handleSizeUnitChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Guntha">Guntha</SelectItem>
                    <SelectItem value="Acres">Acres</SelectItem>
                    <SelectItem value="Sq.ft">Sq.ft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Price Range: {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
                </label>
                <Slider
                  defaultValue={[0, 50000000]}
                  min={0}
                  max={50000000}
                  step={500000}
                  value={filters.priceRange}
                  onValueChange={handlePriceChange}
                  className="mt-4"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Size ({filters.sizeUnit}): {filters.sizeRange[0]} - {filters.sizeRange[1]}
                </label>
                <Slider
                  defaultValue={[0, 20]}
                  min={0}
                  max={filters.sizeUnit === "Acres" ? 10 : 40}
                  step={filters.sizeUnit === "Acres" ? 0.5 : 1}
                  value={filters.sizeRange}
                  onValueChange={handleSizeChange}
                  className="mt-4"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" onClick={resetFilters} className="mr-2">
                Reset Filters
              </Button>
            </div>
          </div>
          
          {/* Property Listings */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">
              {isLoading ? "Loading properties..." : 
               filteredProperties?.length ? `${filteredProperties.length} Properties Found` : 
               "No properties match your criteria"}
            </h2>
          </div>
          
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4">Loading properties...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">
              <p>Error loading properties. Please try again later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties && filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))
              ) : (
                <div className="col-span-3 text-center py-16 bg-white rounded-lg shadow-sm">
                  <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
                  <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search criteria</p>
                  <Button onClick={resetFilters} className="mt-4 bg-primary">
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default PropertiesPage;
