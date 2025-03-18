import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { BlogPost } from "../../../shared/schema";

// Define the blog post form schema
const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  summary: z.string().min(1, "Summary is required").max(200, "Summary is too long"),
  content: z.string().min(1, "Content is required"),
  author: z.string().min(1, "Author is required"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

interface BlogPostFormProps {
  post?: BlogPost;
  onComplete: () => void;
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({ post, onComplete }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // Initialize form with existing post data or defaults
  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: post?.title || "",
      summary: post?.summary || "",
      content: post?.content || "",
      author: post?.author || "",
      imageUrl: post?.imageUrl || "",
    },
  });

  const { formState } = form;

  // Create mutation for adding new blog post
  const createMutation = useMutation({
    mutationFn: (data: BlogPostFormValues) => {
      return apiRequest("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({
        title: "Success",
        description: "Blog post created successfully.",
      });
      onComplete();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create blog post.",
        variant: "destructive",
      });
    },
  });

  // Update mutation for editing existing blog post
  const updateMutation = useMutation({
    mutationFn: (data: BlogPostFormValues & { id: number }) => {
      return apiRequest(`/api/blog/${data.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({
        title: "Success",
        description: "Blog post updated successfully.",
      });
      onComplete();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update blog post.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BlogPostFormValues) => {
    if (post) {
      updateMutation.mutate({ ...data, id: post.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const renderPreview = () => {
    const { title, summary, content, author, imageUrl } = form.getValues();
    
    return (
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-2xl font-bold mb-2">{title || "[Title]"}</h2>
        <p className="text-gray-500 mb-4">By {author || "[Author]"}</p>
        
        {imageUrl && (
          <div className="mb-4">
            <img 
              src={imageUrl} 
              alt={title} 
              className="rounded-lg max-h-80 w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x400?text=Invalid+Image+URL";
              }}
            />
          </div>
        )}
        
        <div className="font-medium text-lg mb-4">{summary || "[Summary]"}</div>
        
        <div className="prose max-w-none">
          {content.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph || "[Content]"}</p>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsPreviewMode(!isPreviewMode)}
        >
          {isPreviewMode ? "Edit Mode" : "Preview Mode"}
        </Button>
      </div>

      {isPreviewMode ? (
        renderPreview()
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter blog post title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter author name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter a URL for the blog post featured image
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter a brief summary of the blog post"
                      className="h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    This will appear as a preview in blog listings
                  </FormDescription>
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
                      placeholder="Enter the full blog post content"
                      className="h-56"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Use plain text. Line breaks will be preserved.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onComplete}
                className="mr-2"
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!formState.isDirty || isPending}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {post ? "Update" : "Create"} Blog Post
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default BlogPostForm;