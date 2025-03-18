import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import MobileMenu from "@/components/ui/mobile-menu";
import HardHat from "@/components/icons/HardHat";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Services", path: "/services" },
    { label: "Portfolio", path: "/portfolio" },
    { label: "Testimonials", path: "/testimonials" },
    { label: "Blog", path: "/blog" },
  ];

  return (
    <div className="font-inter text-gray-800 bg-[#f8fafc] min-h-screen flex flex-col">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/">
            <div className="flex items-center space-x-2">
              <HardHat className="text-[#f97316] text-3xl" />
              <span className="font-montserrat font-bold text-2xl text-[#0f172a]">
                BuildMaster
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            {menuItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={`font-medium ${
                  location === item.path
                    ? "text-[#f97316]"
                    : "text-[#0f172a] hover:text-[#f97316]"
                } transition-colors`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/contact">
              <Button className="bg-[#f97316] hover:bg-[#f97316]/90 text-white">
                Contact Us
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-[#0f172a]"
            aria-label="Open mobile menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </nav>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          menuItems={menuItems}
        />
      </header>

      <main className="flex-grow">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      <footer className="bg-[#0f172a] text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <HardHat className="text-[#f97316] text-3xl" />
                <span className="font-montserrat font-bold text-2xl">
                  BuildMaster
                </span>
              </div>
              <p className="text-gray-300 mb-6">
                BuildMaster Construction delivers exceptional construction services with a focus on quality, safety, and client satisfaction.
              </p>
              <div className="flex space-x-4">
                {["facebook", "twitter", "instagram", "linkedin"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-gray-300 hover:text-[#f97316] transition-colors"
                    aria-label={`Visit our ${social} page`}
                  >
                    <i className={`fab fa-${social}${social === 'linkedin' ? '-in' : ''}`}></i>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-montserrat font-semibold text-xl mb-6">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link href={item.path} className="text-gray-300 hover:text-[#f97316] transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-[#f97316] transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-montserrat font-semibold text-xl mb-6">
                Our Services
              </h3>
              <ul className="space-y-3">
                {[
                  "Residential Construction",
                  "Commercial Construction",
                  "Renovation & Remodeling",
                  "Interior Design",
                  "Project Management",
                  "Green Building",
                ].map((service) => (
                  <li key={service}>
                    <Link href="/services" className="text-gray-300 hover:text-[#f97316] transition-colors">
                      {service}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-montserrat font-semibold text-xl mb-6">
                Newsletter
              </h3>
              <p className="text-gray-300 mb-4">
                Subscribe to our newsletter to receive updates on our latest projects and news.
              </p>
              <form className="mb-4" onSubmit={(e) => e.preventDefault()}>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="px-4 py-2 rounded-l w-full focus:outline-none text-gray-800"
                  />
                  <button
                    type="submit"
                    className="bg-[#f97316] hover:bg-[#f97316]/90 text-white px-4 rounded-r transition-colors"
                    aria-label="Subscribe to newsletter"
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </form>
              <p className="text-gray-300 text-sm">
                We respect your privacy. No spam emails.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-300 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} BuildMaster Construction. All rights reserved.
              </p>
              <div className="flex space-x-6">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                  (policy) => (
                    <a
                      key={policy}
                      href="#"
                      className="text-gray-300 text-sm hover:text-[#f97316] transition-colors"
                    >
                      {policy}
                    </a>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
