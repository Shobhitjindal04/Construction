import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Award, Building, Navigation, Briefcase, CheckCircle2 } from "lucide-react";
import { testimonialList } from "@/lib/data";

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  
  const testimonials = testimonialList;
  
  // Autoplay functionality
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      paginate(1);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [current, autoplay]);
  
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrent((prev) => {
      const next = prev + newDirection;
      if (next >= Math.ceil(testimonials.length / 3)) return 0;
      if (next < 0) return Math.ceil(testimonials.length / 3) - 1;
      return next;
    });
  };

  // Function to render star ratings
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
      />
    ));
  };
  
  // Get current testimonials to display (3 at a time)
  const getCurrentTestimonials = () => {
    const startIndex = current * 3;
    return testimonials.slice(startIndex, startIndex + 3);
  };

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center bg-[#f97316]/10 text-[#f97316] px-4 py-2 rounded-full mb-4"
          >
            <Award className="h-4 w-4 mr-2" />
            <span className="font-medium text-sm">TRUSTED BY OVER 500 CLIENTS</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="font-montserrat font-bold text-3xl md:text-5xl text-[#0f172a] mb-4"
          >
            Client <span className="text-[#f97316]">Testimonials</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-[#64748b] max-w-3xl mx-auto"
          >
            Our reputation is built on satisfied clients. Here's what they have to say about our dedication to quality, reliability, and exceptional service.
          </motion.p>
        </div>
        
        {/* Client types and industries */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 mb-16 max-w-5xl mx-auto"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-3">
              <Building className="h-8 w-8" />
            </div>
            <div className="font-medium text-[#0f172a]">Corporate</div>
            <div className="text-sm text-[#64748b]">80+ clients</div>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-500 mb-3">
              <Briefcase className="h-8 w-8" />
            </div>
            <div className="font-medium text-[#0f172a]">Commercial</div>
            <div className="text-sm text-[#64748b]">150+ clients</div>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-3">
              <Navigation className="h-8 w-8" />
            </div>
            <div className="font-medium text-[#0f172a]">Government</div>
            <div className="text-sm text-[#64748b]">40+ projects</div>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 mb-3">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="font-medium text-[#0f172a]">Residential</div>
            <div className="text-sm text-[#64748b]">200+ clients</div>
          </div>
          
          <div className="flex flex-col items-center text-center col-span-2 md:col-span-1">
            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-3">
              <Award className="h-8 w-8" />
            </div>
            <div className="font-medium text-[#0f172a]">Healthcare</div>
            <div className="text-sm text-[#64748b]">30+ facilities</div>
          </div>
        </motion.div>
        
        <div className="testimonial-slider relative max-w-7xl mx-auto">
          <div 
            className="relative overflow-hidden rounded-2xl shadow-xl bg-white p-1"
            onMouseEnter={() => setAutoplay(false)}
            onMouseLeave={() => setAutoplay(true)}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={current}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                custom={direction}
                transition={{ type: "tween", duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4"
              >
                {getCurrentTestimonials().map((testimonial, index) => (
                  <motion.div 
                    key={index + current * 3}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-white border border-gray-100 p-8 rounded-xl shadow-lg shadow-gray-100/50 flex flex-col h-full"
                  >
                    <div className="flex mb-4">
                      {renderStars(5)}
                    </div>
                    
                    <div className="relative mb-6 flex-grow">
                      <div className="absolute -top-4 -left-6 text-[#f97316] text-5xl opacity-20">
                        "
                      </div>
                      <p className="text-[#334155] text-lg relative z-10 leading-relaxed">
                        {testimonial.text}
                      </p>
                      <div className="absolute -bottom-4 -right-6 text-[#f97316] text-5xl opacity-20 rotate-180">
                        "
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-auto pt-6 border-t border-gray-100">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full mr-4 object-cover border-2 border-[#f97316]"
                      />
                      <div>
                        <h4 className="font-montserrat font-semibold text-[#0f172a]">{testimonial.name}</h4>
                        <p className="text-sm text-[#64748b]">{testimonial.title}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="testimonial-navigation flex justify-center mt-8">
            <button
              onClick={() => {
                paginate(-1);
                setAutoplay(false);
              }}
              className="w-12 h-12 rounded-full border border-[#f97316] flex items-center justify-center mr-4 hover:bg-[#f97316]/10 transition-colors"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="text-[#f97316]" />
            </button>
            
            {/* Pagination dots */}
            <div className="flex items-center space-x-2 mx-4">
              {Array(Math.ceil(testimonials.length / 3)).fill(0).map((_, i) => (
                <button
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all ${
                    current === i ? "bg-[#f97316] w-6" : "bg-gray-300"
                  }`}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                    setAutoplay(false);
                  }}
                  aria-label={`Go to testimonial group ${i + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={() => {
                paginate(1);
                setAutoplay(false);
              }}
              className="w-12 h-12 rounded-full bg-[#f97316] text-white flex items-center justify-center hover:bg-[#f97316]/90 transition-colors shadow-lg"
              aria-label="Next testimonials"
            >
              <ChevronRight />
            </button>
          </div>
          
          <div className="text-center mt-12">
            <a href="/testimonials" className="inline-flex items-center text-[#f97316] font-medium hover:underline">
              View all client testimonials
              <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
