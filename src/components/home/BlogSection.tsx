import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import BlogCard from "@/components/ui/blog-card";
import { BlogPost } from "@shared/schema";

const BlogSection = () => {
  const { data: blogPosts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['/api/blogs'],
  });

  return (
    <section className="py-20 bg-[#F8F8F8]" id="blog">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Latest Insights</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest trends, investment opportunities, and expert advice in land property investment.
          </p>
        </div>
        
        {isLoading ? (
          <div className="text-center py-10">Loading blog posts...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">Error loading blog posts</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts && blogPosts.length > 0 ? (
              blogPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                No blog posts found.
              </div>
            )}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link href="/blog">
            <Button variant="outline" className="inline-block bg-white text-primary border border-primary py-3 px-8 rounded-md hover:bg-primary hover:text-white transition">
              View All Articles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
