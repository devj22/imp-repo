import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { BlogPost } from "@shared/schema";
import { format } from "date-fns";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  const { id, title, excerpt, author, image, createdAt } = post;
  
  // Format the date
  const formattedDate = format(new Date(createdAt), 'MMMM d, yyyy');

  return (
    <Card className="bg-white rounded-lg overflow-hidden shadow-md">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>
            <i className="far fa-calendar-alt mr-2"></i>{formattedDate}
          </span>
          <span className="mx-3">•</span>
          <span>
            <i className="far fa-user mr-2"></i>{author}
          </span>
        </div>
        
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-gray-600 mb-4">{excerpt}</p>
        
        <Link href={`/blog/${id}`}>
          <a className="text-primary font-medium hover:underline">
            Read More <i className="fas fa-arrow-right ml-1"></i>
          </a>
        </Link>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
