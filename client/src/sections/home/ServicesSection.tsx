import { Link } from "wouter";
import { motion } from "framer-motion";
import { serviceList } from "@/lib/data";

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="font-montserrat font-bold text-3xl md:text-4xl text-[#0f172a] mb-4"
          >
            Our Construction Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-[#64748b] max-w-3xl mx-auto"
          >
            We offer a comprehensive range of construction services to meet all your building needs, from conceptualization to completion.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceList.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#f8fafc] rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <i className={`${service.icon} text-[#f97316] text-2xl mr-3`}></i>
                  <h3 className="font-montserrat font-semibold text-xl">
                    {service.title}
                  </h3>
                </div>
                <p className="text-[#64748b] mb-4">{service.description}</p>
                <Link href="/services" className="inline-block text-[#f97316] font-medium hover:underline">
                  Learn More <i className="fas fa-arrow-right ml-1"></i>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
