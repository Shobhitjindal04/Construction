import { motion } from "framer-motion";

const features = [
  {
    icon: "fas fa-medal",
    title: "Quality Craftsmanship",
    description: "We take pride in our attention to detail and superior construction quality."
  },
  {
    icon: "fas fa-clock",
    title: "On-Time Delivery",
    description: "We understand the importance of completing projects within the agreed timeframe."
  },
  {
    icon: "fas fa-dollar-sign",
    title: "Competitive Pricing",
    description: "Quality construction services at prices that respect your budget constraints."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 border-b-2 border-[#f97316]"
            >
              <div className="bg-[#f8fafc] inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
                <i className={`${feature.icon} text-[#f97316] text-2xl`}></i>
              </div>
              <h3 className="font-montserrat font-semibold text-xl mb-2">
                {feature.title}
              </h3>
              <p className="text-[#64748b]">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
