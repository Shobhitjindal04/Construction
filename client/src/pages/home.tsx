import { Helmet } from "react-helmet";
import HeroSection from "@/sections/home/HeroSection";
import FeaturesSection from "@/sections/home/FeaturesSection";
import AboutSection from "@/sections/home/AboutSection";
import ServicesSection from "@/sections/home/ServicesSection";
import StatisticsSection from "@/sections/home/StatisticsSection";
import PortfolioSection from "@/sections/home/PortfolioSection";
import TestimonialsSection from "@/sections/home/TestimonialsSection";
import CTASection from "@/sections/home/CTASection";
import BlogSection from "@/sections/home/BlogSection";
import ContactSection from "@/sections/home/ContactSection";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>BuildMaster Construction - Professional Construction Services</title>
        <meta
          name="description"
          content="BuildMaster Construction offers premium construction, renovation, and building services for residential and commercial projects with over 25 years of industry experience."
        />
        <meta
          name="keywords"
          content="construction, building, renovation, residential construction, commercial construction, green building, project management"
        />
      </Helmet>
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <ServicesSection />
      <StatisticsSection />
      <PortfolioSection />
      <TestimonialsSection />
      <CTASection />
      <BlogSection />
      <ContactSection />
    </>
  );
};

export default Home;
