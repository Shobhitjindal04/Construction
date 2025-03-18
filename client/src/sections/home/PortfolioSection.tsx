import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { portfolioItems } from "@/lib/data";

const PortfolioSection = () => {
  const [activeFilter, setActiveFilter] = useState("All Projects");
  
  const filterCategories = ["All Projects", "Residential", "Commercial", "Renovation", "Industrial"];
  
  const filteredItems = activeFilter === "All Projects" 
    ? portfolioItems.slice(0, 6) 
    : portfolioItems.filter(item => 
        item.category === activeFilter
      ).slice(0, 6);

  return (
    <section id="portfolio" className="py-20 bg-[#f8fafc]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="font-montserrat font-bold text-3xl md:text-4xl text-[#0f172a] mb-4"
          >
            Our Project Portfolio
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-[#64748b] max-w-3xl mx-auto"
          >
            Explore our diverse range of successfully completed projects that showcase our quality craftsmanship and attention to detail.
          </motion.p>
        </div>
        
        {/* Portfolio Filter */}
        <div className="flex flex-wrap justify-center mb-8">
          {filterCategories.map((category, index) => (
            <motion.button
              key={index}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-2 m-1 rounded font-medium transition-colors ${
                activeFilter === category
                  ? "bg-[#0f172a] text-white"
                  : "bg-white text-[#0f172a]"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
        
        {/* Portfolio Gallery */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="portfolio-item group relative overflow-hidden rounded-lg shadow-md cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[#0f172a] bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 className="text-white font-montserrat font-semibold text-xl mb-1">
                  {item.title}
                </h3>
                <p className="text-gray-200">{item.category}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="text-center mt-10">
          <Link href="/portfolio">
            <Button className="bg-[#f97316] hover:bg-[#f97316]/90 text-white">
              View All Projects
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
