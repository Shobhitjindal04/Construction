import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative bg-[#0f172a] text-white h-[90vh] flex items-center">
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] to-transparent opacity-70"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" 
        }}
      ></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-montserrat font-bold text-4xl md:text-5xl lg:text-6xl mb-4">
            Building Excellence, Constructing Trust
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Excellence in construction with innovation, quality, and integrity. 
            Creating spaces that inspire for over 25 years.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/services">
              <Button 
                size="lg" 
                className="bg-[#f97316] hover:bg-opacity-90 text-white font-medium text-center py-6 px-8 rounded transition-colors"
              >
                Our Services
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white hover:bg-gray-100 text-[#0f172a] font-medium text-center py-6 px-8 rounded transition-colors"
              >
                Get a Quote
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
