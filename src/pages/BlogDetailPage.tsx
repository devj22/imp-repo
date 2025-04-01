import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BlogPost } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

const BlogDetailPage = () => {
  const [match, params] = useRoute<{ id: string }>("/blog/:id");
  const blogId = params?.id ? parseInt(params.id) : 0;

  const { data: blogPost, isLoading, error } = useQuery<BlogPost>({
    queryKey: [`/api/blogs/${blogId}`],
    enabled: !!blogId,
  });

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Format date to readable string
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "";
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  // Share blog post functionality
  const shareBlogPost = () => {
    if (navigator.share) {
      navigator.share({
        title: blogPost?.title,
        text: blogPost?.excerpt,
        url: window.location.href,
      })
      .catch(error => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(error => console.log('Error copying to clipboard:', error));
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
              <p className="mt-4">Loading article...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">
              <p>Error loading article. Please try again later.</p>
            </div>
          ) : blogPost ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                  {/* Featured Image */}
                  <img 
                    src={blogPost.image} 
                    alt={blogPost.title} 
                    className="w-full h-80 object-cover"
                  />

                  {/* Blog Content */}
                  <div className="p-8">
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span>
                        <i className="far fa-calendar-alt mr-2"></i>
                        {formatDate(blogPost.createdAt)}
                      </span>
                      <span className="mx-3">•</span>
                      <span>
                        <i className="far fa-user mr-2"></i>
                        {blogPost.author}
                      </span>
                    </div>

                    <h1 className="text-3xl font-bold mb-6">{blogPost.title}</h1>
                    
                    <div className="prose prose-lg max-w-none">
                      <p className="lead text-lg text-gray-600 mb-6">{blogPost.excerpt}</p>
                      
                      <div className="whitespace-pre-line">
                        {blogPost.content.split('\n\n').map((paragraph, i) => (
                          <p key={i} className="mb-4">{paragraph}</p>
                        ))}
                      </div>
                    </div>
                    
                    <Separator className="my-8" />
                    
                    {/* Author Info */}
                    <div className="flex items-center">
                      <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                        <img 
                          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80" 
                          alt={blogPost.author} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">About {blogPost.author}</h4>
                        <p className="text-gray-600 text-sm">
                          {blogPost.author} is a real estate expert with over 10 years of experience in land property investments.
                        </p>
                      </div>
                    </div>
                    
                    <Separator className="my-8" />
                    
                    {/* Share Links */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-4">Share:</span>
                        <div className="flex space-x-3">
                          <Button variant="ghost" size="sm" onClick={shareBlogPost}>
                            <i className="fab fa-facebook-f text-primary"></i>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={shareBlogPost}>
                            <i className="fab fa-twitter text-primary"></i>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={shareBlogPost}>
                            <i className="fab fa-linkedin-in text-primary"></i>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={shareBlogPost}>
                            <i className="fas fa-link text-primary"></i>
                          </Button>
                        </div>
                      </div>
                      
                      <Link href="/blog">
                        <Button variant="outline">
                          <i className="fas fa-arrow-left mr-2"></i> Back to Articles
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Search Card */}
                <Card className="mb-8">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">Search Articles</h3>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-search text-gray-400"></i>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Categories Card */}
                <Card className="mb-8">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">Categories</h3>
                    <ul className="space-y-3">
                      <li>
                        <a href="#" className="flex items-center justify-between text-gray-600 hover:text-primary transition">
                          <span>Investment Tips</span>
                          <span className="bg-gray-100 text-gray-600 text-xs py-1 px-2 rounded-full">14</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center justify-between text-gray-600 hover:text-primary transition">
                          <span>Legal Guidance</span>
                          <span className="bg-gray-100 text-gray-600 text-xs py-1 px-2 rounded-full">8</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center justify-between text-gray-600 hover:text-primary transition">
                          <span>Market Trends</span>
                          <span className="bg-gray-100 text-gray-600 text-xs py-1 px-2 rounded-full">12</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center justify-between text-gray-600 hover:text-primary transition">
                          <span>Buying Guides</span>
                          <span className="bg-gray-100 text-gray-600 text-xs py-1 px-2 rounded-full">9</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center justify-between text-gray-600 hover:text-primary transition">
                          <span>Success Stories</span>
                          <span className="bg-gray-100 text-gray-600 text-xs py-1 px-2 rounded-full">6</span>
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Recent Posts Card */}
                <Card className="mb-8">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">Recent Posts</h3>
                    <div className="space-y-6">
                      <div className="flex">
                        <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden mr-4">
                          <img 
                            src="https://images.unsplash.com/photo-1542879379-a2761ec6d9b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80" 
                            alt="Investment Tips" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">
                            <a href="#" className="hover:text-primary transition">5 Things to Consider Before Investing in Land</a>
                          </h4>
                          <p className="text-gray-500 text-sm">May 15, 2023</p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden mr-4">
                          <img 
                            src="https://images.unsplash.com/photo-1526948531399-320e7e40f0ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80" 
                            alt="Legal Checklist" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">
                            <a href="#" className="hover:text-primary transition">Legal Checklist for Land Purchase in India</a>
                          </h4>
                          <p className="text-gray-500 text-sm">April 23, 2023</p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden mr-4">
                          <img 
                            src="https://images.unsplash.com/photo-1594608661623-aa0bd3a69799?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80" 
                            alt="Market Trends" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">
                            <a href="#" className="hover:text-primary transition">Land Value Trends to Watch in 2023</a>
                          </h4>
                          <p className="text-gray-500 text-sm">March 10, 2023</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tags Card */}
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      <a href="#" className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-primary hover:text-white transition">Land</a>
                      <a href="#" className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-primary hover:text-white transition">Investment</a>
                      <a href="#" className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-primary hover:text-white transition">Property</a>
                      <a href="#" className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-primary hover:text-white transition">Real Estate</a>
                      <a href="#" className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-primary hover:text-white transition">Legal</a>
                      <a href="#" className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-primary hover:text-white transition">Agriculture</a>
                      <a href="#" className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-primary hover:text-white transition">Residential</a>
                      <a href="#" className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-primary hover:text-white transition">Commercial</a>
                      <a href="#" className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-primary hover:text-white transition">Tips</a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
              <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
              <Button asChild className="bg-primary">
                <Link href="/blog">Browse All Articles</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default BlogDetailPage;
