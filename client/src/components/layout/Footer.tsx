import { Link } from "wouter";
import { HardHat } from "lucide-react";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Send 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <Link href="/">
              <a className="flex items-center space-x-2 mb-6">
                <HardHat className="h-8 w-8 text-[#f97316]" />
                <span className="font-montserrat font-bold text-2xl">BuildMaster</span>
              </a>
            </Link>
            <p className="text-gray-300 mb-6">
              BuildMaster Construction delivers exceptional construction services with a focus on quality, safety, and client satisfaction.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-[#f97316] transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#f97316] transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#f97316] transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#f97316] transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-montserrat font-semibold text-xl mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/">
                  <a className="text-gray-300 hover:text-[#f97316] transition-colors">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-gray-300 hover:text-[#f97316] transition-colors">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <a className="text-gray-300 hover:text-[#f97316] transition-colors">Services</a>
                </Link>
              </li>
              <li>
                <Link href="/portfolio">
                  <a className="text-gray-300 hover:text-[#f97316] transition-colors">Portfolio</a>
                </Link>
              </li>
              <li>
                <Link href="/testimonials">
                  <a className="text-gray-300 hover:text-[#f97316] transition-colors">Testimonials</a>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <a className="text-gray-300 hover:text-[#f97316] transition-colors">Blog</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-gray-300 hover:text-[#f97316] transition-colors">Contact</a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Our Services */}
          <div>
            <h3 className="font-montserrat font-semibold text-xl mb-6">Our Services</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/services">
                  <a className="text-gray-300 hover:text-[#f97316] transition-colors">Residential Construction</a>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <a className="text-gray-300 hover:text-[#f97316] transition-colors">Commercial Construction</a>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <a className="text-gray-300 hover:text-[#f97316] transition-colors">Renovation & Remodeling</a>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <a className="text-gray-300 hover:text-[#f97316] transition-colors">Interior Design</a>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <a className="text-gray-300 hover:text-[#f97316] transition-colors">Project Management</a>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <a className="text-gray-300 hover:text-[#f97316] transition-colors">Green Building</a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="font-montserrat font-semibold text-xl mb-6">Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter to receive updates on our latest projects and news.
            </p>
            <form className="mb-4">
              <div className="flex">
                <Input 
                  type="email" 
                  placeholder="Your Email" 
                  className="rounded-l-md rounded-r-none text-gray-800 focus:ring-[#f97316]" 
                />
                <Button
                  type="submit"
                  className="bg-[#f97316] hover:bg-[#f97316]/90 rounded-l-none"
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
            <p className="text-gray-300 text-sm">We respect your privacy. No spam emails.</p>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} BuildMaster Construction. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-300 text-sm hover:text-[#f97316] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-300 text-sm hover:text-[#f97316] transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-300 text-sm hover:text-[#f97316] transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
