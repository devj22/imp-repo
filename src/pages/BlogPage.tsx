import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogCard from "@/components/ui/blog-card";
import { BlogPost } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: blogPosts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['/api/blogs'],
  });
  
  // Filter blog posts based on search term
  const filteredBlogPosts = blogPosts?.filter(post => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      post.title.toLowerCase().includes(searchLower) ||
      post.excerpt.toLowerCase().includes(searchLower) ||
      post.author.toLowerCase().includes(searchLower)
    );
  });
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <>
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Blog Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Real Estate Insights & News</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay informed with our latest articles, guides, and market trends in the land property industry.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-12 py-3 w-full"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              {searchTerm && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearSearch} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Blog Posts */}
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4">Loading blog posts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">
              <p>Error loading blog posts. Please try again later.</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold">
                  {searchTerm ? `Search Results for "${searchTerm}"` : "Latest Articles"}
                </h2>
                {searchTerm && filteredBlogPosts && (
                  <p className="text-gray-600 mt-2">
                    {filteredBlogPosts.length} {filteredBlogPosts.length === 1 ? "result" : "results"} found
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogPosts && filteredBlogPosts.length > 0 ? (
                  filteredBlogPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-16 bg-white rounded-lg shadow-sm">
                    <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
                    <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                    <p className="text-gray-500">
                      {searchTerm 
                        ? "Try searching with different keywords" 
                        : "No blog posts available at the moment"}
                    </p>
                    {searchTerm && (
                      <Button onClick={clearSearch} className="mt-4 bg-primary">
                        Clear Search
                      </Button>
                    )}
                  </div>
                )}
              </div>
              
              {/* Featured Categories */}
              <div className="mt-16">
                <h2 className="text-2xl font-semibold mb-6">Featured Categories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <Button variant="outline" className="text-left p-6 h-auto flex flex-col items-start">
                    <i className="fas fa-landmark text-primary text-2xl mb-3"></i>
                    <h3 className="text-lg font-medium mb-1">Investment Tips</h3>
                    <p className="text-gray-600 text-sm">Expert advice on land investments</p>
                  </Button>
                  
                  <Button variant="outline" className="text-left p-6 h-auto flex flex-col items-start">
                    <i className="fas fa-file-contract text-primary text-2xl mb-3"></i>
                    <h3 className="text-lg font-medium mb-1">Legal Guidance</h3>
                    <p className="text-gray-600 text-sm">Navigate legal aspects of land purchase</p>
                  </Button>
                  
                  <Button variant="outline" className="text-left p-6 h-auto flex flex-col items-start">
                    <i className="fas fa-chart-line text-primary text-2xl mb-3"></i>
                    <h3 className="text-lg font-medium mb-1">Market Trends</h3>
                    <p className="text-gray-600 text-sm">Latest real estate market insights</p>
                  </Button>
                  
                  <Button variant="outline" className="text-left p-6 h-auto flex flex-col items-start">
                    <i className="fas fa-home text-primary text-2xl mb-3"></i>
                    <h3 className="text-lg font-medium mb-1">Buying Guides</h3>
                    <p className="text-gray-600 text-sm">Step-by-step property buying guides</p>
                  </Button>
                </div>
              </div>
              
              {/* Newsletter */}
              <div className="mt-16 bg-primary rounded-lg p-8 text-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-2xl font-bold mb-3">Subscribe to Our Newsletter</h2>
                    <p className="opacity-90 mb-4">
                      Stay updated with the latest trends, investment opportunities, and expert advice in land property investment.
                    </p>
                  </div>
                  <div>
                    <div className="flex">
                      <Input 
                        type="email" 
                        placeholder="Your email address" 
                        className="rounded-r-none text-black"
                      />
                      <Button className="rounded-l-none bg-[#FF6B35]">
                        Subscribe
                      </Button>
                    </div>
                    <p className="text-sm opacity-80 mt-2">
                      We respect your privacy and will never share your email with third parties.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default BlogPage;
