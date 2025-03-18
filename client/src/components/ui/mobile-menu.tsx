import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface MenuItem {
  label: string;
  path: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}

const MobileMenu = ({ isOpen, onClose, menuItems }: MobileMenuProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? "0%" : "100%" }}
      transition={{ duration: 0.3 }}
      className={`md:hidden fixed inset-0 z-50 ${isOpen ? "block" : "pointer-events-none"}`}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-3/4 max-w-sm bg-white shadow-lg p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-montserrat font-bold text-xl text-[#0f172a]">Menu</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex flex-col space-y-4">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className="font-medium text-[#0f172a] hover:text-[#f97316] transition-colors py-2"
              onClick={onClose}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/contact">
            <Button 
              className="bg-[#f97316] hover:bg-[#f97316]/90 text-white w-full mt-2"
              onClick={onClose}
            >
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default MobileMenu;
