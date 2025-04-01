import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { insertBlogPostSchema, BlogPost } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getAuthHeader } from "@/lib/auth";

// Extend the blog schema with validation
const blogFormSchema = insertBlogPostSchema.extend({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  author: z.string().min(2, "Author name is required"),
  image: z.string().url("Please enter a valid image URL"),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

interface BlogFormProps {
  blogPost?: BlogPost;
  mode: "create" | "edit";
  onSuccess?: () => void;
}

const BlogForm = ({ blogPost, mode, onSuccess }: BlogFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: blogPost?.title || "",
      content: blogPost?.content || "",
      excerpt: blogPost?.excerpt || "",
      author: blogPost?.author || "",
      image: blogPost?.image || "",
    },
  });

  useEffect(() => {
    if (blogPost) {
      // Reset form with blog post values when editing
      form.reset({
        title: blogPost.title,
        content: blogPost.content,
        excerpt: blogPost.excerpt,
        author: blogPost.author,
        image: blogPost.image,
      });
    }
  }, [blogPost, form]);

  const createMutation = useMutation({
    mutationFn: async (values: BlogFormValues) => {
      const response = await apiRequest("POST", "/api/blogs", values, getAuthHeader());
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/blogs'] });
      setSubmitting(false);
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive",
      });
      setSubmitting(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: BlogFormValues) => {
      if (!blogPost?.id) throw new Error("Blog post ID is required for updating");
      const response = await apiRequest("PUT", `/api/blogs/${blogPost.id}`, values, getAuthHeader());
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/blogs'] });
      setSubmitting(false);
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive",
      });
      setSubmitting(false);
    },
  });

  function onSubmit(values: BlogFormValues) {
    setSubmitting(true);
    
    if (mode === "create") {
      createMutation.mutate(values);
    } else {
      updateMutation.mutate(values);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === "create" ? "Add New Blog Post" : "Edit Blog Post"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Blog post title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Author name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="A brief summary of the blog post" 
                      className="min-h-20"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Full blog post content" 
                      className="min-h-64"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="px-0 pt-6">
              <Button 
                type="submit" 
                className="w-full bg-primary text-white"
                disabled={submitting}
              >
                {submitting 
                  ? (mode === "create" ? "Creating..." : "Updating...") 
                  : (mode === "create" ? "Create Blog Post" : "Update Blog Post")
                }
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BlogForm;
