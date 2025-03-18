import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-[#0f172a] text-white relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
        }}
      ></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl mb-6">
            Ready to Start Your Construction Project?
          </h2>
          <p className="text-lg mb-8">
            Contact us today for a free consultation and estimate. Let us help bring your vision to life with our expertise and craftsmanship.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/contact">
              <Button className="bg-[#f97316] hover:bg-[#f97316]/90 text-white text-center font-medium py-3 px-6">
                Get a Free Quote
              </Button>
            </Link>
            <a href="tel:+1234567890">
              <Button variant="outline" className="bg-white hover:bg-gray-100 text-[#0f172a] text-center font-medium py-3 px-6">
                <Phone className="mr-2 h-4 w-4" /> Call Us Now
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
