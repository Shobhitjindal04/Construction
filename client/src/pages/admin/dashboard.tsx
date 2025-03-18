import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  ArrowLeft, 
  Search,
  Loader2,
  AlertCircle,
  ExternalLink,
  FileSpreadsheet
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { BlogPost } from "../../../shared/schema";
import BlogPostForm from "@/components/admin/BlogPostForm";
import AdminLayout from "@/components/admin/AdminLayout";

const AdminDashboard = () => {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    
    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please log in to access the admin dashboard.",
        variant: "destructive",
      });
      setLocation("/admin");
    }
  }, [setLocation, toast]);

  // Fetch blog posts
  const { 
    data: blogPosts = [], 
    isLoading, 
    isError,
    error,
  } = useQuery({
    queryKey: ["/api/blog"],
    queryFn: () => apiRequest("/api/blog"),
  });

  // Delete blog post mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest(`/api/blog/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({
        title: "Blog post deleted",
        description: "The blog post has been deleted successfully.",
      });
      setConfirmDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete blog post.",
        variant: "destructive",
      });
    },
  });

  // Handle blog post form submission (both add and edit)
  const handleBlogFormSubmit = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
    setIsAddingNew(false);
    setEditingPost(null);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setLocation("/admin");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  // Filter blog posts based on search query
  const filteredPosts = searchQuery 
    ? blogPosts.filter((post: BlogPost) => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : blogPosts;

  // Export blog posts to Excel
  const handleExportToExcel = async () => {
    try {
      const response = await fetch("/api/blog/export", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to export blog posts");
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      
      // Create an anchor element and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `blog_posts_${format(new Date(), "yyyy-MM-dd")}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      
      toast({
        title: "Export successful",
        description: "Blog posts have been exported to Excel.",
      });
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message || "Failed to export blog posts.",
        variant: "destructive",
      });
    }
  };

  const renderContent = () => {
    if (isAddingNew) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAddingNew(false)}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h2 className="text-2xl font-bold">Add New Blog Post</h2>
          </div>
          <BlogPostForm onComplete={handleBlogFormSubmit} />
        </div>
      );
    }

    if (editingPost) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingPost(null)}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h2 className="text-2xl font-bold">Edit Blog Post</h2>
          </div>
          <BlogPostForm post={editingPost} onComplete={handleBlogFormSubmit} />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search blog posts..."
              className="pl-10 w-full md:w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleExportToExcel}
              className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export to Excel
            </Button>
            <Button onClick={() => setIsAddingNew(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Post
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Error loading blog posts</p>
              <p className="text-sm">{(error as any)?.message || "An unexpected error occurred"}</p>
            </div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-gray-500 mb-4">
              {searchQuery ? "No blog posts match your search query." : "No blog posts found."}
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPosts.map((post: BlogPost) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                        <div className="text-sm text-gray-500">
                          {post.content.substring(0, 60)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(post.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        <div className="flex justify-center space-x-2">
                          <a
                            href={`/blog/${post.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-700"
                            title="View post"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                          <button
                            onClick={() => setEditingPost(post)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Edit post"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(post.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete post"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {confirmDelete === post.id && (
                          <div className="absolute z-10 mt-2 bg-white rounded-md shadow-lg border border-gray-200 p-4 w-60 right-8">
                            <p className="text-sm text-gray-600 mb-4">
                              Are you sure you want to delete this blog post?
                            </p>
                            <div className="flex justify-end space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setConfirmDelete(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteMutation.mutate(post.id)}
                                disabled={deleteMutation.isPending}
                              >
                                {deleteMutation.isPending ? "Deleting..." : "Delete"}
                              </Button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <AdminLayout
      title="Blog Management"
      onLogout={handleLogout}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {renderContent()}
      </motion.div>
    </AdminLayout>
  );
};

export default AdminDashboard;