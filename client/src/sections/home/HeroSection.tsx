import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, Award, Clock, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative bg-[#0f172a] text-white min-h-[90vh] flex items-center">
      {/* Background with parallax effect */}
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] to-transparent opacity-70"></div>
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
      ></motion.div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Hero content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="inline-block bg-[#f97316] px-4 py-1 rounded-full text-sm font-semibold mb-4"
            >
              TRUSTED BY 500+ CLIENTS NATIONWIDE
            </motion.div>
            
            <h1 className="font-montserrat font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
              Building <span className="text-[#f97316]">Excellence</span>, Constructing <span className="text-[#f97316]">Trust</span>
            </h1>
            
            <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-xl">
              With over 30 years of industry leadership, we deliver unparalleled craftsmanship and innovative solutions that exceed expectations on every project, big or small.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
              <Link href="/services">
                <Button className="bg-[#f97316] hover:bg-[#f97316]/90 text-white text-lg py-6 px-8 shadow-lg hover:shadow-xl transition-all">
                  Our Services
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/30 text-lg py-6 px-8 shadow-lg hover:shadow-xl transition-all">
                  Get a Quote
                </Button>
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex items-center space-x-2"
              >
                <Shield className="h-5 w-5 text-[#f97316]" />
                <span className="text-sm md:text-base">Licensed & Insured</span>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex items-center space-x-2"
              >
                <Award className="h-5 w-5 text-[#f97316]" />
                <span className="text-sm md:text-base">Award-Winning Team</span>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="flex items-center space-x-2"
              >
                <Clock className="h-5 w-5 text-[#f97316]" />
                <span className="text-sm md:text-base">On-Time Completion</span>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex items-center space-x-2"
              >
                <Users className="h-5 w-5 text-[#f97316]" />
                <span className="text-sm md:text-base">Family Owned Since 1993</span>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Stats/Awards Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl hidden lg:block"
          >
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-[#f97316] text-5xl font-bold mb-2">30+</div>
                <div className="text-gray-300 font-medium">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-[#f97316] text-5xl font-bold mb-2">500+</div>
                <div className="text-gray-300 font-medium">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-[#f97316] text-5xl font-bold mb-2">98%</div>
                <div className="text-gray-300 font-medium">Client Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-[#f97316] text-5xl font-bold mb-2">24/7</div>
                <div className="text-gray-300 font-medium">Customer Support</div>
              </div>
            </div>
            
            <div className="border-t border-white/20 mt-8 pt-8 text-center">
              <div className="text-white font-medium mb-2">Recognized Excellence</div>
              <div className="flex justify-center space-x-4 opacity-80">
                <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">A1</div>
                <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">A2</div>
                <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">A3</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
