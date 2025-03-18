import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import CTASection from "@/sections/home/CTASection";
import SEOLayout from "@/layouts/SEOLayout";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  StarHalf, 
  Quote, 
  Building, 
  Home, 
  PenLine, 
  Landmark, 
  Check, 
  ExternalLink, 
  Send, 
  User,
  Briefcase,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Testimonial submission form schema
const testimonialFormSchema = z.object({
  clientName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  company: z.string().optional(),
  testimonial: z.string().min(20, { message: "Testimonial must be at least 20 characters." }).max(500, { message: "Testimonial must be less than 500 characters." }),
  rating: z.string().min(1, { message: "Please select a rating." }),
  projectType: z.string().min(1, { message: "Please select a project type." }),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type TestimonialFormValues = z.infer<typeof testimonialFormSchema>;

interface Testimonial {
  id: number;
  clientName: string;
  company: string | null;
  testimonial: string;
  rating: number;
  projectType: string;
  imageUrl: string | null;
  isApproved: boolean | null;
  createdAt: string | null;
}

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  // Generate stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-amber-500 text-amber-500" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-amber-500 text-amber-500" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-muted-foreground" />);
    }
    
    return stars;
  };
  
  // Icons for project type
  const getProjectTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'residential':
        return <Home className="h-4 w-4" />;
      case 'commercial':
        return <Building className="h-4 w-4" />;
      case 'renovation':
        return <PenLine className="h-4 w-4" />;
      case 'industrial':
        return <Landmark className="h-4 w-4" />;
      default:
        return <Building className="h-4 w-4" />;
    }
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="flex items-center gap-1">
            {getProjectTypeIcon(testimonial.projectType)}
            {testimonial.projectType}
          </Badge>
          <div className="flex">{renderStars(testimonial.rating)}</div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 flex-grow">
        <div className="mb-4 text-primary">
          <Quote className="h-8 w-8 opacity-70" />
        </div>
        <p className="italic text-muted-foreground mb-4">
          {testimonial.testimonial}
        </p>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex items-center w-full">
          {testimonial.imageUrl ? (
            <div className="rounded-full overflow-hidden h-10 w-10 mr-3">
              <img 
                src={testimonial.imageUrl} 
                alt={testimonial.clientName} 
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="rounded-full bg-primary/10 h-10 w-10 mr-3 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
          )}
          <div className="flex-grow">
            <p className="font-semibold">{testimonial.clientName}</p>
            {testimonial.company && (
              <p className="text-xs text-muted-foreground flex items-center">
                <Briefcase className="h-3 w-3 mr-1" />
                {testimonial.company}
              </p>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

const Testimonials = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("testimonials");
  const [activeType, setActiveType] = useState<string | null>(null);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  
  // Form for submitting testimonials
  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      clientName: "",
      company: "",
      testimonial: "",
      rating: "",
      projectType: "",
      imageUrl: "",
    },
  });
  
  // Fetch testimonials from API
  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
    queryFn: async () => {
      return await apiRequest('/api/testimonials');
    }
  });
  
  // Fetch testimonials by project type
  const { data: filteredTestimonials, isLoading: isFilterLoading } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials/type', activeType],
    queryFn: async () => {
      if (!activeType) return [];
      return await apiRequest(`/api/testimonials/type/${encodeURIComponent(activeType)}`);
    },
    enabled: !!activeType
  });
  
  // Post testimonial submission
  const { mutate, isPending } = useMutation({
    mutationFn: (data: TestimonialFormValues) => {
      return apiRequest("/api/testimonials", {
        ...data,
        rating: parseInt(data.rating)
      });
    },
    onSuccess: () => {
      toast({
        title: "Testimonial Submitted",
        description: "Thank you for sharing your experience! Your testimonial will be reviewed by our team.",
        variant: "default",
      });
      form.reset();
      setIsSubmitSuccessful(true);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "There was an error submitting your testimonial. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(data: TestimonialFormValues) {
    mutate(data);
  }
  
  // Determine which testimonials to display
  const displayTestimonials = activeType 
    ? (filteredTestimonials || []) 
    : (testimonials || []);
  
  // Extract unique project types for filtering
  const projectTypes = testimonials 
    ? Array.from(new Set(testimonials.map(t => t.projectType)))
    : [];
  
  // Featured testimonials
  const featuredTestimonials = testimonials
    ? testimonials.filter(t => t.rating >= 5).slice(0, 3)
    : [];
    
  return (
    <SEOLayout
      pagePath="/testimonials"
      title="Client Testimonials | What Our Customers Say"
      description="Read testimonials from our satisfied clients about their experiences working with our construction company on various projects."
    >
      <div className="bg-gradient-to-b from-primary-900 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="font-montserrat font-bold text-4xl md:text-5xl text-center">
            Client Testimonials
          </h1>
          <p className="text-lg mt-4 text-center max-w-3xl mx-auto">
            Discover what our clients say about their experience working with our construction team. Your satisfaction is our priority.
          </p>
        </div>
      </div>
      
      <section className="py-20 bg-[#f8fafc]">
        <div className="container mx-auto px-4">
          <Tabs 
            defaultValue="testimonials" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-10">
              <TabsList className="inline-flex">
                <TabsTrigger value="testimonials">View Testimonials</TabsTrigger>
                <TabsTrigger value="submit">Share Your Experience</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="testimonials" className="space-y-12">
              {/* Project type filter */}
              {projectTypes.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                  <Button
                    variant={!activeType ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveType(null)}
                    className="rounded-full"
                  >
                    All Projects
                  </Button>
                  {projectTypes.map(type => (
                    <Button
                      key={type}
                      variant={activeType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveType(type)}
                      className="rounded-full"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              )}
              
              {/* Featured testimonials section */}
              {!activeType && featuredTestimonials.length > 0 && (
                <div className="mb-16">
                  <div className="text-center mb-8">
                    <Badge className="mb-2">Featured</Badge>
                    <h2 className="font-montserrat font-bold text-3xl text-[#0f172a] mb-4">
                      What Our Clients Say
                    </h2>
                    <p className="text-muted-foreground max-w-3xl mx-auto">
                      Read about the exceptional experiences our clients have had with our construction services.
                    </p>
                  </div>
                  
                  <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2">
                    {featuredTestimonials.map((testimonial) => (
                      <div key={testimonial.id} className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
                        <div className="flex items-center mb-4 text-primary">
                          <Quote className="h-8 w-8 mr-2 opacity-70" />
                        </div>
                        <p className="text-[#64748b] italic mb-6 text-lg">{testimonial.testimonial}</p>
                        <div className="flex items-center mt-auto">
                          {testimonial.imageUrl ? (
                            <img
                              src={testimonial.imageUrl}
                              alt={testimonial.clientName}
                              className="w-12 h-12 rounded-full mr-4 object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                              <User className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-montserrat font-semibold">{testimonial.clientName}</h4>
                            <p className="text-sm text-[#64748b]">{testimonial.company || testimonial.projectType}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Main testimonials grid */}
              <div>
                <div className="text-center mb-8">
                  <h2 className="font-montserrat font-bold text-2xl text-[#0f172a] mb-4">
                    {activeType ? `${activeType} Project Testimonials` : "All Client Testimonials"}
                  </h2>
                  <p className="text-muted-foreground max-w-3xl mx-auto">
                    {activeType 
                      ? `Read what our clients say about their ${activeType.toLowerCase()} construction projects.`
                      : "Browse all testimonials from clients who've experienced our quality service firsthand."
                    }
                  </p>
                </div>
                
                {isLoading || isFilterLoading ? (
                  <div className="text-center py-12">
                    <p>Loading testimonials...</p>
                  </div>
                ) : displayTestimonials.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-2">No testimonials found</h3>
                    <p className="text-muted-foreground mb-4">
                      {activeType 
                        ? `We don't have any testimonials for ${activeType} projects yet.`
                        : "No testimonials are available at this time."
                      }
                    </p>
                    {activeType && (
                      <Button
                        variant="outline"
                        onClick={() => setActiveType(null)}
                      >
                        View all testimonials
                      </Button>
                    )}
                  </div>
                ) : (
                  <AnimatePresence>
                    <motion.div 
                      layout 
                      className="grid gap-6 lg:grid-cols-3 md:grid-cols-2"
                    >
                      {displayTestimonials.map((testimonial, index) => (
                        <motion.div
                          key={testimonial.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <TestimonialCard testimonial={testimonial} />
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="submit">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="font-montserrat font-bold text-3xl text-[#0f172a] mb-4">
                    Share Your Experience
                  </h2>
                  <p className="text-muted-foreground max-w-3xl mx-auto">
                    We value your feedback! Tell us about your experience working with our construction team.
                  </p>
                </div>
                
                {isSubmitSuccessful ? (
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                      <CardTitle className="flex items-center text-green-800">
                        <CheckCircle className="h-6 w-6 mr-2" />
                        Thank You for Your Feedback!
                      </CardTitle>
                      <CardDescription className="text-green-700">
                        Your testimonial has been submitted successfully and will be reviewed by our team.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                      <p>
                        We appreciate you taking the time to share your experience with us. Client feedback helps us continue 
                        to improve our services and showcase our work to potential clients.
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="default"
                        onClick={() => {
                          setIsSubmitSuccessful(false);
                          setActiveTab("testimonials");
                        }}
                      >
                        View Testimonials
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setIsSubmitSuccessful(false)}
                      >
                        Submit Another Testimonial
                      </Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Testimonial Form</CardTitle>
                      <CardDescription>
                        Please fill out the form below to share your experience with our construction services.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="clientName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Your Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="company"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Company (Optional)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Your Company" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    If applicable, provide your company name
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="projectType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Project Type</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-wrap gap-4"
                                  >
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="Residential" />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        Residential
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="Commercial" />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        Commercial
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="Renovation" />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        Renovation
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="Industrial" />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        Industrial
                                      </FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Overall Rating</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex space-x-4"
                                  >
                                    {[5, 4, 3, 2, 1].map((value) => (
                                      <FormItem key={value} className="flex flex-col items-center space-y-1">
                                        <FormControl>
                                          <RadioGroupItem value={value.toString()} className="sr-only" />
                                        </FormControl>
                                        <FormLabel className="cursor-pointer">
                                          <Star 
                                            className={`h-8 w-8 ${field.value === value.toString() ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                                          />
                                        </FormLabel>
                                        <span className="text-xs">{value}</span>
                                      </FormItem>
                                    ))}
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="testimonial"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Your Testimonial</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Please share your experience working with our construction team..."
                                    className="min-h-[120px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Be specific about what you liked and any results you achieved
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Photo URL (Optional)</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="https://example.com/your-photo.jpg"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Provide a URL to your profile photo (it will be displayed alongside your testimonial)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            size="lg"
                            disabled={isPending}
                            className="w-full"
                          >
                            {isPending ? "Submitting..." : "Submit Testimonial"}
                            <Send className="ml-2 h-4 w-4" />
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Client Project Spotlights */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-montserrat font-bold text-3xl text-[#0f172a] mb-4">
              Client Project Spotlights
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Detailed accounts of successful projects where we transformed our clients' visions into reality.
            </p>
          </div>
          
          <div className="space-y-16 max-w-5xl mx-auto">
            {featuredTestimonials.slice(0, 2).map((testimonial, index) => (
              <Card key={testimonial.id} className="overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3">
                  <div className="lg:col-span-1 bg-gray-100 p-8 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
                    {testimonial.imageUrl ? (
                      <div className="rounded-full overflow-hidden w-24 h-24 mb-4">
                        <img 
                          src={testimonial.imageUrl} 
                          alt={testimonial.clientName}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    ) : (
                      <div className="rounded-full bg-gray-200 w-24 h-24 mb-4 flex items-center justify-center">
                        <User className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <h3 className="font-montserrat font-semibold text-xl mb-2">
                      {testimonial.clientName}
                    </h3>
                    {testimonial.company && (
                      <p className="text-muted-foreground mb-3">{testimonial.company}</p>
                    )}
                    <Badge variant="outline" className="flex items-center gap-1 mb-4">
                      {testimonial.projectType}
                    </Badge>
                    <div className="flex">
                      {Array(testimonial.rating).fill(0).map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                  
                  <div className="lg:col-span-2 p-8">
                    <div className="mb-6">
                      <Badge variant="secondary" className="mb-3">Project Spotlight</Badge>
                      <h4 className="font-montserrat font-semibold text-2xl mb-4">
                        {index === 0 ? "Modern Home Renovation" : "Commercial Office Complex"}
                      </h4>
                      <div className="prose max-w-none">
                        <p className="text-muted-foreground">
                          {testimonial.testimonial}
                        </p>
                        <div className="mt-6 space-y-2">
                          <h5 className="font-medium">Project Highlights:</h5>
                          <ul className="space-y-1">
                            {index === 0 ? (
                              <>
                                <li className="flex items-start">
                                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                                  <span>Complete remodel of existing structure</span>
                                </li>
                                <li className="flex items-start">
                                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                                  <span>Energy-efficient upgrades throughout</span>
                                </li>
                                <li className="flex items-start">
                                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                                  <span>Custom cabinetry and built-in features</span>
                                </li>
                                <li className="flex items-start">
                                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                                  <span>Open concept design with improved natural lighting</span>
                                </li>
                              </>
                            ) : (
                              <>
                                <li className="flex items-start">
                                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                                  <span>5-story, 50,000 square foot office building</span>
                                </li>
                                <li className="flex items-start">
                                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                                  <span>LEED Gold certified sustainable design</span>
                                </li>
                                <li className="flex items-start">
                                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                                  <span>State-of-the-art technology integration</span>
                                </li>
                                <li className="flex items-start">
                                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                                  <span>Completed on schedule and within budget</span>
                                </li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" asChild>
                      <a href="/portfolio">
                        View Similar Projects <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <CTASection />
    </SEOLayout>
  );
};

export default Testimonials;
