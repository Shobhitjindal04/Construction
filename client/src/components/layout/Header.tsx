import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { HardHat } from "lucide-react";
import MobileMenu from "./MobileMenu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation links
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-shadow duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-white"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <HardHat className="h-8 w-8 text-[#f97316]" />
          <span className="font-montserrat font-bold text-2xl text-[#0f172a]">BuildMaster</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`font-medium transition-colors hover:text-[#f97316] ${
                location === link.href ? "text-[#f97316]" : "text-[#0f172a]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contact">
            <Button 
              className="bg-[#f97316] hover:bg-[#f97316]/90 text-white font-medium rounded transition-colors"
            >
              Contact Us
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80%] sm:w-[350px]">
            <MobileMenu navLinks={navLinks} />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;