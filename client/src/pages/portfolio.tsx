import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import CTASection from "@/sections/home/CTASection";
import SEOLayout from "@/layouts/SEOLayout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronRight,
  MapPin,
  Calendar,
  Building,
  Check,
  User,
  ArrowRight,
  ArrowLeftRight,
  Info,
  Sparkles,
} from "lucide-react";

interface PortfolioProject {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrls: string[];
  clientName: string | null;
  completionDate: string | null;
  location: string | null;
  services: string[] | null;
  testimonialId: number | null;
  beforeImages: string[] | null;
  afterImages: string[] | null;
  featured: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
}

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [showTransformation, setShowTransformation] = useState(false);
  const [transformationPosition, setTransformationPosition] = useState(50);
  const beforeImageRef = useRef<HTMLImageElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // API query to fetch portfolio projects
  const { data: allProjects, isLoading } = useQuery<PortfolioProject[]>({
    queryKey: ['/api/portfolio'],
    queryFn: async () => {
      return await apiRequest('/api/portfolio');
    }
  });

  // API query to fetch featured projects
  const { data: featuredProjects, isLoading: featuredLoading } = useQuery<PortfolioProject[]>({
    queryKey: ['/api/portfolio/featured'],
    queryFn: async () => {
      return await apiRequest('/api/portfolio/featured');
    }
  });

  // API query for filtered projects
  const { data: filteredProjects, isLoading: filterLoading } = useQuery<PortfolioProject[]>({
    queryKey: ['/api/portfolio/category', activeCategory],
    queryFn: async () => {
      if (!activeCategory) return [];
      return await apiRequest(`/api/portfolio/category/${encodeURIComponent(activeCategory)}`);
    },
    enabled: !!activeCategory
  });

  // Extract unique categories
  const categories = allProjects 
    ? Array.from(new Set(allProjects.map(project => project.category)))
    : [];

  // Determine which projects to display
  const displayProjects = activeCategory ? filteredProjects || [] : allProjects || [];
  
  // Handle transformation slider (before/after comparison)
  const handleSliderChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current || !beforeImageRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const position = ((e.clientX - rect.left) / rect.width) * 100;
    setTransformationPosition(Math.max(0, Math.min(100, position)));
  };

  const handleSliderMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return; // Left mouse button not pressed
    handleSliderChange(e);
  };

  // Handle project details view
  const showProjectDetails = (project: PortfolioProject) => {
    setSelectedProject(project);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle category filter
  const handleCategoryChange = (category: string | null) => {
    setActiveCategory(category);
    setSelectedProject(null);
    setShowTransformation(false);
  };

  return (
    <SEOLayout
      pagePath="/portfolio"
      title="Construction Portfolio | Featured Projects & Case Studies"
      description="Browse our portfolio of completed construction projects including residential homes, commercial buildings, and specialty structures."
    >
      <div className="bg-gradient-to-b from-primary-900 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="font-montserrat font-bold text-4xl md:text-5xl text-center">
            Our Project Portfolio
          </h1>
          <p className="text-lg mt-4 text-center max-w-3xl mx-auto">
            Explore our diverse collection of successful construction projects that showcase our expertise, quality craftsmanship, and commitment to excellence.
          </p>
        </div>
      </div>
      
      <section className="py-16 bg-[#f8fafc]">
        <div className="container mx-auto px-4">
          {selectedProject ? (
            // Project Details View
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedProject(null);
                    setShowTransformation(false);
                  }}
                  className="mr-2"
                >
                  Back to Projects
                </Button>
                <Badge variant="outline" className="mr-2">
                  {selectedProject.category}
                </Badge>
                {selectedProject.featured && (
                  <Badge variant="secondary">
                    <Sparkles className="h-3 w-3 mr-1" /> Featured
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  {/* Project Images */}
                  {!showTransformation ? (
                    <Card className="mb-6">
                      <CardContent className="p-0 overflow-hidden">
                        <Carousel className="w-full">
                          <CarouselContent>
                            {selectedProject.imageUrls.map((url, idx) => (
                              <CarouselItem key={idx}>
                                <div className="p-1">
                                  <div className="h-[400px] overflow-hidden rounded-md">
                                    <img
                                      src={url}
                                      alt={`${selectedProject.title} - Image ${idx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious />
                          <CarouselNext />
                        </Carousel>
                      </CardContent>
                    </Card>
                  ) : (
                    // Before/After Transformation Slider
                    <Card className="mb-6">
                      <CardContent className="p-0 overflow-hidden">
                        <div 
                          ref={sliderRef}
                          className="relative h-[400px] cursor-col-resize overflow-hidden rounded-md"
                          onMouseDown={handleSliderChange}
                          onMouseMove={handleSliderMouseMove}
                        >
                          {/* After Image (Full) */}
                          <img
                            src={selectedProject.afterImages?.[0] || selectedProject.imageUrls[0]}
                            alt="After"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          
                          {/* Before Image (Partial) */}
                          <div 
                            className="absolute inset-0 overflow-hidden"
                            style={{ width: `${transformationPosition}%` }}
                          >
                            <img
                              ref={beforeImageRef}
                              src={selectedProject.beforeImages?.[0] || ""}
                              alt="Before"
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Slider Handle */}
                          <div 
                            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
                            style={{ left: `${transformationPosition}%`, transform: 'translateX(-50%)' }}
                          >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg">
                              <ArrowLeftRight className="h-4 w-4 text-primary" />
                            </div>
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs rounded px-2 py-1">Before</div>
                            <div className="absolute bottom-4 right-0 translate-x-[150%] bg-black/70 text-white text-xs rounded px-2 py-1">After</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Transformation Toggle */}
                  {selectedProject.beforeImages && selectedProject.beforeImages.length > 0 && selectedProject.afterImages && selectedProject.afterImages.length > 0 && (
                    <Button
                      variant={showTransformation ? "default" : "outline"}
                      onClick={() => setShowTransformation(!showTransformation)}
                      className="mb-6"
                    >
                      <ArrowLeftRight className="h-4 w-4 mr-2" />
                      {showTransformation ? "Hide Transformation" : "Show Before & After"}
                    </Button>
                  )}
                  
                  {/* Project Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl font-montserrat">
                        {selectedProject.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="prose max-w-none">
                        <p>{selectedProject.description}</p>
                      </div>
                      
                      {selectedProject.services && selectedProject.services.length > 0 && (
                        <div className="mt-6">
                          <h3 className="font-semibold text-lg mb-3">Services Provided</h3>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {selectedProject.services.map((service, idx) => (
                              <li key={idx} className="flex items-start">
                                <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                                <span>{service}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                {/* Project Details Sidebar */}
                <div>
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Project Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        <li className="flex items-start">
                          <MapPin className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Location</p>
                            <p className="text-muted-foreground">{selectedProject.location || "N/A"}</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <User className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Client</p>
                            <p className="text-muted-foreground">{selectedProject.clientName || "Confidential"}</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Building className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Project Type</p>
                            <p className="text-muted-foreground">{selectedProject.category}</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Calendar className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Completion Date</p>
                            <p className="text-muted-foreground">{selectedProject.completionDate || "N/A"}</p>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  {/* Project Request Button */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Request Similar Project</CardTitle>
                      <CardDescription>
                        Interested in a project like this one? Get in touch with our team for a consultation.
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button className="w-full" asChild>
                        <a href="/contact">
                          Contact Us <ChevronRight className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            // Projects List View
            <>
              {/* Featured Projects Section */}
              {!activeCategory && featuredProjects && featuredProjects.length > 0 && (
                <div className="mb-16">
                  <h2 className="font-montserrat font-bold text-3xl text-center mb-10">
                    Featured Projects
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {featuredLoading ? (
                      Array(2).fill(0).map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                          <Skeleton className="h-80 w-full rounded-b-none" />
                          <CardContent className="p-6 space-y-4">
                            <Skeleton className="h-6 w-3/4" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-2/3" />
                            </div>
                            <div className="flex space-x-2">
                              <Skeleton className="h-6 w-16" />
                              <Skeleton className="h-6 w-20" />
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      featuredProjects.slice(0, 2).map((project) => (
                        <Card key={project.id} className="overflow-hidden">
                          <div className="h-80 overflow-hidden relative">
                            <img
                              src={project.imageUrls[0]}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 left-4">
                              <Badge variant="secondary" className="font-medium">
                                <Sparkles className="h-3 w-3 mr-1" /> Featured
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="p-6">
                            <Badge variant="outline" className="mb-2">
                              {project.category}
                            </Badge>
                            <h3 className="font-montserrat font-bold text-xl mb-2">
                              {project.title}
                            </h3>
                            <p className="text-muted-foreground line-clamp-2 mb-4">
                              {project.description}
                            </p>
                            <Button onClick={() => showProjectDetails(project)}>
                              View Project <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              )}
              
              {/* Category Filters */}
              <div className="mb-10 flex justify-center">
                <Tabs 
                  defaultValue="all" 
                  value={activeCategory || "all"}
                  onValueChange={(value) => handleCategoryChange(value === "all" ? null : value)}
                  className="w-full max-w-2xl"
                >
                  <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    {categories.map(category => (
                      <TabsTrigger key={category} value={category}>
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
              
              {/* Projects Grid */}
              {isLoading || filterLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(6).fill(0).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="h-64 w-full rounded-b-none" />
                      <CardContent className="p-6 space-y-4">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-6 w-3/4" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                        <Skeleton className="h-9 w-32" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : displayProjects.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <Info className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                  <p className="text-muted-foreground mb-4">
                    {activeCategory
                      ? `No projects found in the "${activeCategory}" category`
                      : "No portfolio projects are available at this time"}
                  </p>
                  {activeCategory && (
                    <Button
                      variant="outline"
                      onClick={() => handleCategoryChange(null)}
                    >
                      View all projects
                    </Button>
                  )}
                </div>
              ) : (
                <motion.div 
                  layout 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <AnimatePresence>
                    {displayProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card className="h-full flex flex-col overflow-hidden">
                          <div className="h-64 overflow-hidden">
                            <img
                              src={project.imageUrls[0]}
                              alt={project.title}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                          </div>
                          <CardContent className="p-6 flex-grow flex flex-col">
                            <Badge variant="outline" className="self-start mb-2">
                              {project.category}
                            </Badge>
                            <h3 className="font-montserrat font-semibold text-xl mb-2 line-clamp-2">
                              {project.title}
                            </h3>
                            <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow">
                              {project.description}
                            </p>
                            <Button 
                              variant="outline" 
                              className="self-start mt-auto"
                              onClick={() => showProjectDetails(project)}
                            >
                              View Details <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
      
      <CTASection />
    </SEOLayout>
  );
};

export default Portfolio;
