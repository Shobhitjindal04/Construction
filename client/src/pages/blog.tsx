import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Calendar, User, ArrowRight, ChevronRight, Tag } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import CTASection from "@/sections/home/CTASection";
import SEOLayout from "@/layouts/SEOLayout";
import { BlogPostData } from "@/components/common/StructuredData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const POSTS_PER_PAGE = 6;

interface BlogPost {
  id: number;
  title: string;
  summary: string;
  content: string;
  imageUrl: string | null;
  author: string;
  category: string | null;
  tags: string[] | null;
  createdAt: string | null;
  updatedAt: string | null;
}

const Blog = () => {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  // API query to fetch blog posts
  const { data: allBlogPosts, isLoading, isError } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
    queryFn: async () => {
      return await apiRequest('/api/blog');
    }
  });

  // API query for search functionality
  const { data: searchResults, isLoading: searchLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/search', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return [];
      return await apiRequest(`/api/blog/search?q=${encodeURIComponent(debouncedQuery)}`);
    },
    enabled: debouncedQuery.length > 0
  });

  // API query for category filtering
  const { data: categoryPosts, isLoading: categoryLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/category', selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return [];
      return await apiRequest(`/api/blog/category/${encodeURIComponent(selectedCategory)}`);
    },
    enabled: !!selectedCategory
  });

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Extract unique categories from blog posts
  useEffect(() => {
    if (allBlogPosts) {
      const uniqueCategories = Array.from(
        new Set(allBlogPosts.map(post => post.category).filter(Boolean) as string[])
      );
      setCategories(uniqueCategories);
    }
  }, [allBlogPosts]);

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === "all" ? null : value);
    setCurrentPage(1);
    setSearchQuery("");
    setDebouncedQuery("");
  };

  // Determine which posts to display
  const displayPosts = searchQuery
    ? searchResults || []
    : selectedCategory
    ? categoryPosts || []
    : allBlogPosts || [];

  // Get current page posts
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = displayPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(displayPosts.length / POSTS_PER_PAGE);

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Calculate pagination range
  const generatePaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // If total pages are less than max to show, display all
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      // Always include first page
      items.push(1);
      
      // Calculate middle range
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're near the edges
      if (currentPage <= 2) {
        endPage = 4;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        items.push('ellipsis1');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        items.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        items.push('ellipsis2');
      }
      
      // Always include last page
      if (totalPages > 1) {
        items.push(totalPages);
      }
    }
    
    return items;
  };

  // Featured post (first post or null)
  const featuredPost = allBlogPosts && allBlogPosts.length > 0 ? allBlogPosts[0] : null;

  return (
    <SEOLayout 
      pagePath="/blog"
      title="Construction Blog | Industry Insights & Tips"
      description="Stay updated with our construction blog featuring expert insights, building tips, and industry trends."
    >
      {featuredPost && (
        <BlogPostData
          title={featuredPost.title}
          headline={featuredPost.title}
          description={featuredPost.summary}
          url={`${window.location.origin}/blog/${featuredPost.id}`}
          imageUrl={featuredPost.imageUrl || ""}
          datePublished={featuredPost.createdAt || new Date().toISOString()}
          dateModified={featuredPost.updatedAt || featuredPost.createdAt || new Date().toISOString()}
          authorName={featuredPost.author}
          publisherName="Premium Construction Company"
          publisherLogoUrl={`${window.location.origin}/logo.png`}
        />
      )}

      <div className="bg-gradient-to-b from-primary-900 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="font-montserrat font-bold text-4xl md:text-5xl text-center">
            Construction Blog
          </h1>
          <p className="text-lg mt-4 text-center max-w-3xl mx-auto">
            Stay updated with the latest construction insights, industry trends, and expert advice from our professional team.
          </p>
        </div>
      </div>
      
      <section className="py-20 bg-[#f8fafc]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            {/* Search and filters */}
            <div className="w-full md:w-1/4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSearchSubmit} className="flex gap-2">
                    <Input
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon" variant="outline">
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select 
                    value={selectedCategory || "all"} 
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
              
              {/* Recent posts sidebar */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Posts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                      <div key={i} className="flex gap-2">
                        <Skeleton className="h-14 w-14 rounded-md" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    ))
                  ) : allBlogPosts?.slice(0, 3).map(post => (
                    <div key={post.id} className="flex gap-3">
                      <div className="h-14 w-14 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                        {post.imageUrl ? (
                          <img 
                            src={post.imageUrl} 
                            alt={post.title} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-primary-100 text-primary-500">
                            <Tag className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      <div>
                        <Link href={`/blog/${post.id}`}>
                          <a className="font-medium text-sm hover:text-primary-500 transition-colors line-clamp-2">
                            {post.title}
                          </a>
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            {/* Main blog content */}
            <div className="w-full md:w-3/4">
              {/* Results summary */}
              <div className="mb-8">
                {debouncedQuery && (
                  <p className="text-gray-600 mb-4">
                    {searchLoading ? (
                      "Searching..."
                    ) : (
                      `Found ${searchResults?.length || 0} results for "${debouncedQuery}"`
                    )}
                  </p>
                )}
                
                {selectedCategory && (
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="px-3 py-1">
                      {selectedCategory}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedCategory(null)}
                      className="h-8 px-2 text-xs"
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Featured article */}
              {!debouncedQuery && !selectedCategory && featuredPost && (
                <div className="mb-12">
                  <h2 className="font-montserrat font-bold text-3xl text-[#0f172a] mb-6">
                    Featured Article
                  </h2>
                  <Card className="overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                      <div className="h-80 lg:h-auto">
                        {featuredPost.imageUrl ? (
                          <img 
                            src={featuredPost.imageUrl}
                            alt={featuredPost.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Tag className="h-20 w-20 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="p-8">
                        <div className="flex flex-wrap gap-4 mb-3">
                          {featuredPost.category && (
                            <Badge variant="secondary" className="font-medium">
                              {featuredPost.category}
                            </Badge>
                          )}
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{formatDate(featuredPost.createdAt)}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <User className="h-4 w-4 mr-1" />
                            <span>{featuredPost.author}</span>
                          </div>
                        </div>
                        <h3 className="font-montserrat font-bold text-2xl text-[#0f172a] mb-4">
                          {featuredPost.title}
                        </h3>
                        <p className="text-muted-foreground mb-6 line-clamp-3">
                          {featuredPost.summary}
                        </p>
                        <Link href={`/blog/${featuredPost.id}`}>
                          <a className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded transition-colors">
                            Read Full Article
                            <ChevronRight className="h-4 w-4" />
                          </a>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
              
              {/* Blog post grid */}
              {isLoading || searchLoading || categoryLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array(6).fill(0).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="h-48 w-full rounded-none" />
                      <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                        <div className="space-y-1">
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                        <Skeleton className="h-8 w-28" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : currentPosts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                  <p className="text-muted-foreground mb-4">
                    {debouncedQuery
                      ? `No posts match your search for "${debouncedQuery}"`
                      : selectedCategory
                      ? `No posts found in the "${selectedCategory}" category`
                      : "No blog posts available yet"}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setDebouncedQuery("");
                      setSelectedCategory(null);
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {currentPosts.map((post) => (
                      <Card key={post.id} className="overflow-hidden flex flex-col">
                        <div className="h-48 overflow-hidden">
                          {post.imageUrl ? (
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <Tag className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-6 flex-1 flex flex-col">
                          <div className="flex flex-wrap gap-2 mb-2">
                            {post.category && (
                              <Badge variant="outline" className="text-xs">
                                {post.category}
                              </Badge>
                            )}
                            <div className="flex items-center text-xs text-muted-foreground ml-auto">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{formatDate(post.createdAt)}</span>
                            </div>
                          </div>
                          <h3 className="font-montserrat font-semibold text-xl line-clamp-2 mb-2">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">
                            {post.summary}
                          </p>
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <User className="h-3 w-3 mr-1" />
                              <span>{post.author}</span>
                            </div>
                            <Link href={`/blog/${post.id}`}>
                              <a className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm">
                                Read More 
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </a>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination className="mt-12">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1) {
                                setCurrentPage(currentPage - 1);
                              }
                            }}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                        
                        {generatePaginationItems().map((page, i) => (
                          <React.Fragment key={i}>
                            {page === 'ellipsis1' || page === 'ellipsis2' ? (
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                            ) : (
                              <PaginationItem>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(page as number);
                                  }}
                                  isActive={currentPage === page}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            )}
                          </React.Fragment>
                        ))}
                        
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages) {
                                setCurrentPage(currentPage + 1);
                              }
                            }}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <CTASection />
    </SEOLayout>
  );
};

export default Blog;
