import { Helmet } from "react-helmet";
import AboutSection from "@/sections/home/AboutSection";
import StatisticsSection from "@/sections/home/StatisticsSection";
import TestimonialsSection from "@/sections/home/TestimonialsSection";
import CTASection from "@/sections/home/CTASection";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us - BuildMaster Construction</title>
        <meta
          name="description"
          content="Learn about BuildMaster Construction's 25+ years of experience, our qualified team, and our commitment to quality and client satisfaction."
        />
        <meta
          name="keywords"
          content="construction company, about us, experienced team, construction history, quality construction"
        />
      </Helmet>
      <div className="py-20 bg-[#0f172a] text-white">
        <div className="container mx-auto px-4">
          <h1 className="font-montserrat font-bold text-4xl md:text-5xl text-center">
            About Us
          </h1>
          <p className="text-lg mt-4 text-center max-w-3xl mx-auto">
            Learn about our journey, our team, and our commitment to quality construction.
          </p>
        </div>
      </div>
      <AboutSection />
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-montserrat font-bold text-3xl text-[#0f172a] mb-8 text-center">
            Our Company History
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-[#64748b] mb-6">
              Founded in 1998, BuildMaster Construction began as a small residential contractor with a team of just five dedicated professionals. The company was established by John Masters, a civil engineer with a vision to create a construction firm that would prioritize quality, integrity, and customer satisfaction above all else.
            </p>
            <p className="text-lg text-[#64748b] mb-6">
              In our first decade, we focused primarily on residential projects, building a reputation for exceptional craftsmanship and attention to detail. By 2008, we had expanded into commercial construction, taking on increasingly complex projects while maintaining our commitment to excellence.
            </p>
            <p className="text-lg text-[#64748b] mb-6">
              Today, BuildMaster Construction stands as one of the region's most respected construction companies, with a diverse portfolio of successful projects across residential, commercial, and industrial sectors. Our growth has been organic, built on the foundation of satisfied clients and word-of-mouth recommendations.
            </p>
            <p className="text-lg text-[#64748b]">
              Throughout our evolution, we've remained true to our founding principles. We continue to approach each project, regardless of scale, with the same dedication to quality and client satisfaction that has defined our company from day one.
            </p>
          </div>
        </div>
      </div>
      <StatisticsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
};

export default About;
