import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import SEOLayout from "@/layouts/SEOLayout";
import { FAQData } from "@/components/common/StructuredData";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Calendar,
  DollarSign,
  Building,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  BriefcaseBusiness,
  Info,
} from "lucide-react";

// Extended contact form schema with additional project details
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  service: z.string().min(1, { message: "Please select a service." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  projectScope: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const faqs = [
  {
    question: "What types of projects do you handle?",
    answer: "We handle a wide range of construction projects, including residential builds, commercial construction, renovations, interior design, and green building initiatives. No project is too small or too large for our experienced team."
  },
  {
    question: "How long does a typical construction project take?",
    answer: "Project timelines vary significantly based on scope, complexity, and size. A basic renovation might take 4-6 weeks, while a custom home could take 6-12 months. During our initial consultation, we'll provide a detailed timeline specific to your project."
  },
  {
    question: "Do you provide free estimates?",
    answer: "Yes, we provide free initial consultations and estimates for all potential projects. Contact us to schedule a time to discuss your construction needs and receive a comprehensive quote."
  },
  {
    question: "Are you licensed and insured?",
    answer: "Absolutely. Our construction company is fully licensed, bonded, and insured. We maintain all necessary certifications and stay current with industry regulations to ensure your project meets all legal requirements."
  },
  {
    question: "How do you handle changes to the project scope?",
    answer: "We understand that changes sometimes become necessary during construction. We have a structured change order process that documents all modifications, associated costs, and timeline impacts, ensuring full transparency throughout the project."
  },
  {
    question: "Do you offer sustainable or green building options?",
    answer: "Yes, we specialize in sustainable construction practices and can incorporate various green building options including energy-efficient systems, sustainable materials, solar integration, and designs that minimize environmental impact while maximizing efficiency."
  },
  {
    question: "What warranties do you offer on your work?",
    answer: "We stand behind our craftsmanship with comprehensive warranties. Typically, we offer a 1-year warranty on all workmanship, while many of the materials and systems we install come with manufacturer warranties ranging from 5 to 50 years depending on the product."
  }
];

const serviceDescriptions = {
  residential: {
    title: "Residential Construction",
    description: "From custom homes to major renovations, our residential services create beautiful living spaces tailored to your lifestyle and preferences.",
    fields: ["Home Type", "Square Footage", "Number of Rooms", "Special Features"],
    icon: <Building className="h-12 w-12 text-primary" />,
  },
  commercial: {
    title: "Commercial Construction",
    description: "We deliver high-quality commercial buildings designed for functionality, efficiency, and lasting value for businesses of all sizes.",
    fields: ["Building Type", "Square Footage", "Special Requirements", "Timeline Constraints"],
    icon: <BriefcaseBusiness className="h-12 w-12 text-primary" />,
  },
  renovation: {
    title: "Renovation & Remodeling",
    description: "Transform your existing space with our expert renovation services, whether it's a kitchen remodel or a complete property makeover.",
    fields: ["Areas to Renovate", "Current Issues", "Desired Improvements", "Living Arrangements During Renovation"],
    icon: <Building className="h-12 w-12 text-primary" />,
  },
  interior: {
    title: "Interior Design",
    description: "Our interior design services create cohesive, beautiful spaces that reflect your taste and meet your functional needs.",
    fields: ["Style Preferences", "Areas Needing Design", "Existing Furniture to Keep", "Color Preferences"],
    icon: <Building className="h-12 w-12 text-primary" />,
  },
  management: {
    title: "Project Management",
    description: "Our experienced project managers ensure your construction project runs smoothly, on time, and within budget.",
    fields: ["Project Type", "Current Status", "Team Already Engaged", "Key Challenges"],
    icon: <Building className="h-12 w-12 text-primary" />,
  },
  green: {
    title: "Green Building",
    description: "Sustainable construction practices and eco-friendly materials for environmentally conscious building projects.",
    fields: ["Sustainability Goals", "Energy Efficiency Needs", "Certification Interests (LEED, etc.)", "Budget Considerations"],
    icon: <Building className="h-12 w-12 text-primary" />,
  },
};

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("contact");
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
      message: "",
      budget: "",
      timeline: "",
      projectScope: "",
    },
  });

  // Watch the selected service to show relevant additional fields
  const selectedService = form.watch("service");

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ContactFormValues) => {
      return apiRequest("/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll respond shortly.",
        variant: "default",
      });
      form.reset();
      setIsSubmitSuccessful(true);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: ContactFormValues) {
    mutate(data);
  }

  return (
    <SEOLayout
      pagePath="/contact"
      title="Contact Our Construction Company | Get a Free Quote"
      description="Contact our construction team for project inquiries, free quotes, or general information. We're ready to help with your building needs."
    >
      <FAQData faqs={faqs} />
      
      <div className="bg-gradient-to-b from-primary-900 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="font-montserrat font-bold text-4xl md:text-5xl text-center">
            Contact Us
          </h1>
          <p className="text-lg mt-4 text-center max-w-3xl mx-auto">
            Have a question, need a quote, or ready to start your project? Reach out to our expert team and let us bring your construction vision to life.
          </p>
        </div>
      </div>
      
      <section className="py-20 bg-[#f8fafc]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="contact">Contact Form</TabsTrigger>
                  <TabsTrigger value="quote">Project Quote</TabsTrigger>
                </TabsList>
                <TabsContent value="contact" className="pt-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-montserrat font-semibold text-[#0f172a] mb-2">Get in Touch</h2>
                    <p className="text-muted-foreground">
                      Fill out the form below to contact our team with any questions or inquiries.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="quote" className="pt-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-montserrat font-semibold text-[#0f172a] mb-2">Request a Project Quote</h2>
                    <p className="text-muted-foreground">
                      Provide details about your construction project to receive a personalized quote from our estimating team.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
              
              {/* Success Message */}
              {isSubmitSuccessful ? (
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-800">
                      <CheckCircle className="h-6 w-6 mr-2" />
                      Thank You for Contacting Us!
                    </CardTitle>
                    <CardDescription className="text-green-700">
                      Your message has been received. A member of our team will get back to you within 1-2 business days.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    <p>
                      We appreciate your interest in our construction services. While you wait for our response, 
                      feel free to explore our portfolio and project galleries to see examples of our work.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="default"
                      onClick={() => setIsSubmitSuccessful(false)}
                      className="mr-2"
                    >
                      Send Another Message
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="/portfolio">View Our Portfolio</a>
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Doe"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="john@example.com"
                                type="email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="(123) 456-7890"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="service"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service You're Interested In</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a Service" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="residential">Residential Construction</SelectItem>
                                <SelectItem value="commercial">Commercial Construction</SelectItem>
                                <SelectItem value="renovation">Renovation & Remodeling</SelectItem>
                                <SelectItem value="interior">Interior Design</SelectItem>
                                <SelectItem value="management">Project Management</SelectItem>
                                <SelectItem value="green">Green Building</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Show additional fields based on selected service */}
                    {selectedService && activeTab === "quote" && (
                      <Card className="border-dashed">
                        <CardHeader className="pb-2">
                          <CardTitle>
                            {serviceDescriptions[selectedService as keyof typeof serviceDescriptions]?.title || "Project Details"}
                          </CardTitle>
                          <CardDescription>
                            {serviceDescriptions[selectedService as keyof typeof serviceDescriptions]?.description || "Please provide additional information about your project"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="budget"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center">
                                    <DollarSign className="h-4 w-4 mr-1" />
                                    Budget Range
                                  </FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select budget range" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="under25k">Under $25,000</SelectItem>
                                      <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                                      <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                                      <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                                      <SelectItem value="250k-500k">$250,000 - $500,000</SelectItem>
                                      <SelectItem value="500k-1m">$500,000 - $1 million</SelectItem>
                                      <SelectItem value="over1m">Over $1 million</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormDescription>
                                    This helps us tailor our recommendations to your budget
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="timeline"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    Preferred Timeline
                                  </FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select timeline" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="immediately">As soon as possible</SelectItem>
                                      <SelectItem value="1-3months">1-3 months</SelectItem>
                                      <SelectItem value="3-6months">3-6 months</SelectItem>
                                      <SelectItem value="6-12months">6-12 months</SelectItem>
                                      <SelectItem value="planning">Just planning for now</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormDescription>
                                    When would you like the project to begin?
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="projectScope"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center">
                                  <Info className="h-4 w-4 mr-1" />
                                  Project Scope
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder={`Please describe your project in detail including: \n- ${(serviceDescriptions[selectedService as keyof typeof serviceDescriptions]?.fields || []).join('\n- ')}`}
                                    className="min-h-[120px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  The more details you provide, the more accurate our response will be
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </Card>
                    )}
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {activeTab === "quote" ? "Additional Information" : "Your Message"}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={activeTab === "quote" ? "Any other details you'd like to share about your project..." : "Tell us how we can help..."}
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      size="lg"
                      disabled={isPending}
                    >
                      {isPending ? "Sending..." : (activeTab === "quote" ? "Request Quote" : "Send Message")}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </Form>
              )}
            </div>
            
            <div className="lg:w-1/3">
              <Card>
                <CardHeader>
                  <CardTitle>Our Contact Information</CardTitle>
                  <CardDescription>
                    Reach out to us directly through any of these channels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-6">
                    <li className="flex items-start">
                      <MapPin className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">Address</h4>
                        <p className="text-muted-foreground">
                          123 Construction Ave, Suite 500<br />
                          New York, NY 10001
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Phone className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">Phone</h4>
                        <p className="text-muted-foreground">(123) 456-7890</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Mail className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">Email</h4>
                        <p className="text-muted-foreground">info@buildmaster.com</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Clock className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">Working Hours</h4>
                        <p className="text-muted-foreground">
                          Monday - Friday: 8:00 AM - 6:00 PM<br />
                          Saturday: 9:00 AM - 2:00 PM<br />
                          Sunday: Closed
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex space-x-3">
                    {["facebook", "twitter", "instagram", "linkedin"].map((social) => (
                      <a
                        key={social}
                        href="#"
                        className="w-9 h-9 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                        aria-label={`Follow us on ${social}`}
                      >
                        <i className={`fab fa-${social}`}></i>
                      </a>
                    ))}
                  </div>
                </CardFooter>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Emergency Services</CardTitle>
                  <CardDescription>
                    Need urgent assistance with your construction project?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start bg-red-50 p-4 rounded-md">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-700 mb-1">24/7 Emergency Line</h4>
                      <p className="text-red-600">(888) 123-4567</p>
                      <p className="text-sm text-red-600 mt-1">
                        For structural failures, water damage, and other construction emergencies
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-montserrat font-bold text-3xl text-[#0f172a] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Find answers to common questions about our construction services and processes.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-6">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-2">
                  <AccordionTrigger className="text-left font-montserrat font-semibold text-lg py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            <div className="mt-12 text-center">
              <h3 className="font-montserrat font-semibold text-xl mb-4">Still have questions?</h3>
              <p className="text-muted-foreground mb-6">
                If you couldn't find the answer to your question, please don't hesitate to contact us directly.
              </p>
              <Button size="lg" asChild>
                <a href="tel:+11234567890">
                  <Phone className="mr-2 h-4 w-4" /> Call Us Today
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SEOLayout>
  );
};

export default Contact;
