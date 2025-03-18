import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const StatisticsSection = () => {
  const [counts, setCounts] = useState({
    years: 0,
    projects: 0,
    staff: 0,
    satisfaction: 0,
  });

  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
      
      const interval = setInterval(() => {
        setCounts((prev) => ({
          years: Math.min(prev.years + 1, 25),
          projects: Math.min(prev.projects + 20, 500),
          staff: Math.min(prev.staff + 6, 150),
          satisfaction: Math.min(prev.satisfaction + 4, 95),
        }));
      }, 50);

      const timeout = setTimeout(() => {
        clearInterval(interval);
      }, 1300);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [inView, controls]);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const stats = [
    {
      value: counts.years,
      label: "Years of Experience",
      suffix: "+",
    },
    {
      value: counts.projects,
      label: "Projects Completed",
      suffix: "+",
    },
    {
      value: counts.staff,
      label: "Professional Staff",
      suffix: "+",
    },
    {
      value: counts.satisfaction,
      label: "Client Satisfaction",
      suffix: "%",
    },
  ];

  return (
    <section className="py-16 bg-[#0f172a] text-white">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={variants}
        className="container mx-auto px-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <div className="text-4xl font-montserrat font-bold text-[#f97316] mb-2">
                {stat.value}
                {stat.suffix}
              </div>
              <p className="text-lg">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default StatisticsSection;
