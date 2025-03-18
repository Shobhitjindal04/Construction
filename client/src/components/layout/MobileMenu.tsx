import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { HardHat } from "lucide-react";
import { X } from "lucide-react";

interface MobileMenuProps {
  navLinks: {
    href: string;
    label: string;
  }[];
}

const MobileMenu = ({ navLinks }: MobileMenuProps) => {
  const [location] = useLocation();

  return (
    <div className="py-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <Link href="/">
          <a className="flex items-center space-x-2">
            <HardHat className="h-6 w-6 text-[#f97316]" />
            <span className="font-montserrat font-bold text-xl text-[#0f172a]">BuildMaster</span>
          </a>
        </Link>
        <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </SheetClose>
      </div>

      <nav className="flex flex-col space-y-5">
        {navLinks.map((link) => (
          <SheetClose key={link.href} asChild>
            <Link href={link.href}>
              <a 
                className={`font-medium text-base py-1 transition-colors ${
                  location === link.href 
                    ? "text-[#f97316]" 
                    : "text-[#0f172a] hover:text-[#f97316]"
                }`}
              >
                {link.label}
              </a>
            </Link>
          </SheetClose>
        ))}
        <SheetClose asChild>
          <Link href="/contact">
            <Button className="bg-[#f97316] hover:bg-[#f97316]/90 text-white w-full mt-4">
              Contact Us
            </Button>
          </Link>
        </SheetClose>
      </nav>
    </div>
  );
};

export default MobileMenu;
