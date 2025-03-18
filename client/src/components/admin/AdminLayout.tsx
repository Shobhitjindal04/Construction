import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import { 
  Construction, 
  LayoutDashboard, 
  FileText, 
  Mail, 
  Users,
  Settings, 
  LogOut, 
  Menu, 
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  title,
  onLogout 
}) => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  const navItems = [
    { 
      name: "Dashboard", 
      path: "/admin/dashboard", 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      name: "Blog Posts", 
      path: "/admin/dashboard", 
      icon: <FileText className="h-5 w-5" /> 
    },
    { 
      name: "Contact Submissions", 
      path: "/admin/contacts", 
      icon: <Mail className="h-5 w-5" /> 
    },
    { 
      name: "Users", 
      path: "/admin/users", 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      name: "Settings", 
      path: "/admin/settings", 
      icon: <Settings className="h-5 w-5" /> 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top header */}
      <header className="bg-white shadow-sm">
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mr-2 text-gray-500 md:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            
            <div className="flex items-center">
              <Construction className="h-8 w-8 text-[#f97316] mr-2" />
              <span className="font-bold text-gray-900">
                BuildMaster <span className="text-[#f97316]">Admin</span>
              </span>
            </div>
          </div>
          
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Sidebar */}
        <aside 
          className={`bg-white shadow-md w-64 flex-shrink-0 fixed inset-y-0 pt-14 md:pt-0 mt-0 md:mt-14 transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } md:relative z-10`}
        >
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = location === item.path;
                
                return (
                  <li key={item.name}>
                    <Link href={item.path}>
                      <a 
                        className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                          isActive 
                            ? "bg-[#f97316]/10 text-[#f97316]" 
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.icon}
                        <span className="ml-3">{item.name}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 w-1 h-8 bg-[#f97316] rounded-r-full"
                          />
                        )}
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
            
            <div className="mt-12 pt-8 border-t border-gray-100">
              <Link href="/">
                <a className="flex items-center px-4 py-3 text-gray-600 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>
                  <span className="ml-3">View Website</span>
                </a>
              </Link>
            </div>
          </nav>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;