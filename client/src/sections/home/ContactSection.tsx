import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  service: z.string().min(1, { message: "Please select a service." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactSection = () => {
  const { toast } = useToast();
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ContactFormValues) => {
      return apiRequest("POST", "/api/contact", data);
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
    onError: (error) => {
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
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-[#0f172a] mb-4">
            Contact Us
          </h2>
          <p className="text-lg text-[#64748b] max-w-3xl mx-auto">
            Have a question or ready to start your project? Reach out to us using any of the methods below.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2">
            {isSubmitSuccessful ? (
              <div className="bg-green-50 border border-green-200 p-6 rounded-lg mb-6">
                <h3 className="font-montserrat font-semibold text-xl text-green-800 mb-2">Thank You for Contacting Us!</h3>
                <p className="text-green-700">Your message has been received. A member of our team will get back to you shortly.</p>
                <Button 
                  className="mt-4 bg-[#f97316] hover:bg-[#f97316]/90" 
                  onClick={() => setIsSubmitSuccessful(false)}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#64748b]">Your Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              className="border-gray-300 focus:ring-2 focus:ring-[#f97316]"
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
                          <FormLabel className="text-[#64748b]">Email Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="john@example.com"
                              type="email"
                              className="border-gray-300 focus:ring-2 focus:ring-[#f97316]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#64748b]">Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="(123) 456-7890"
                            className="border-gray-300 focus:ring-2 focus:ring-[#f97316]"
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
                        <FormLabel className="text-[#64748b]">Service You're Interested In</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-[#f97316]">
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
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#64748b]">Your Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your project..."
                            className="border-gray-300 focus:ring-2 focus:ring-[#f97316]"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-[#f97316] hover:bg-[#f97316]/90"
                    disabled={isPending}
                  >
                    {isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            )}
          </div>
          
          <div className="lg:w-1/2">
            <div className="bg-[#f8fafc] p-8 rounded-lg shadow-md h-full">
              <div className="mb-8">
                <h3 className="font-montserrat font-semibold text-xl text-[#0f172a] mb-4">
                  Our Contact Information
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <i className="fas fa-map-marker-alt text-[#f97316] text-xl mr-4 mt-1"></i>
                    <div>
                      <h4 className="font-medium mb-1">Address</h4>
                      <p className="text-[#64748b]">
                        123 Construction Ave, Suite 500<br />
                        New York, NY 10001
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-phone-alt text-[#f97316] text-xl mr-4 mt-1"></i>
                    <div>
                      <h4 className="font-medium mb-1">Phone</h4>
                      <p className="text-[#64748b]">(123) 456-7890</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-envelope text-[#f97316] text-xl mr-4 mt-1"></i>
                    <div>
                      <h4 className="font-medium mb-1">Email</h4>
                      <p className="text-[#64748b]">info@buildmaster.com</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-clock text-[#f97316] text-xl mr-4 mt-1"></i>
                    <div>
                      <h4 className="font-medium mb-1">Working Hours</h4>
                      <p className="text-[#64748b]">
                        Monday - Friday: 8:00 AM - 6:00 PM<br />
                        Saturday: 9:00 AM - 2:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-montserrat font-semibold text-xl text-[#0f172a] mb-4">
                  Follow Us
                </h3>
                <div className="flex space-x-4">
                  {["facebook-f", "twitter", "instagram", "linkedin-in"].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="w-10 h-10 bg-[#0f172a] text-white rounded-full flex items-center justify-center hover:bg-[#f97316] transition-colors"
                      aria-label={`Follow us on ${social.split('-')[0]}`}
                    >
                      <i className={`fab fa-${social}`}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
