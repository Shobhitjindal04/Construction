import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const aboutFeatures = [
  {
    title: "Experienced Team",
    description: "Our team brings over 100 years of combined experience."
  },
  {
    title: "Safety First",
    description: "Rigorous safety protocols on every project we undertake."
  },
  {
    title: "Certified Excellence",
    description: "Industry certifications that validate our expertise."
  },
  {
    title: "Client Focused",
    description: "Your vision and satisfaction drive our processes."
  }
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-[#f8fafc]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="bg-[#f97316] absolute -top-4 -left-4 w-full h-full rounded-lg"></div>
              <img 
                src="https://images.unsplash.com/photo-1571443730639-98a0a993eadd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Construction team at work" 
                className="relative z-10 rounded-lg w-full shadow-xl"
              />
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-[#0f172a] mb-6">
              About BuildMaster Construction
            </h2>
            <p className="text-lg text-[#64748b] mb-6">
              Founded in 1998, BuildMaster Construction has grown from a small local contractor to one of the region's most respected construction companies. Our journey has been built on a foundation of quality, integrity, and customer satisfaction.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {aboutFeatures.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="mr-4 mt-1">
                    <CheckCircle className="text-[#f97316] text-xl" />
                  </div>
                  <div>
                    <h4 className="font-montserrat font-semibold text-lg mb-2">{feature.title}</h4>
                    <p className="text-[#64748b]">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Link href="/about">
              <Button className="bg-[#f97316] hover:bg-opacity-90 text-white font-medium py-3 px-6 rounded transition-colors">
                Learn More About Us
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
