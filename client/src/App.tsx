import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/home";
import About from "@/pages/about";
import Services from "@/pages/services";
import Portfolio from "@/pages/portfolio";
import Testimonials from "@/pages/testimonials";
import Blog from "@/pages/blog";
import Contact from "@/pages/contact";
import AdminLogin from "@/pages/admin/index";
import AdminDashboard from "@/pages/admin/dashboard";

function Router() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");
  
  // Admin routes don't use MainLayout
  if (isAdminRoute) {
    return (
      <Switch>
        <Route path="/admin" component={AdminLogin} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/:rest*" component={NotFound} />
      </Switch>
    );
  }
  
  // Regular website routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/testimonials" component={Testimonials} />
      <Route path="/blog" component={Blog} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");
  
  return (
    <>
      {isAdminRoute ? (
        <Router />
      ) : (
        <MainLayout>
          <Router />
        </MainLayout>
      )}
      <Toaster />
    </>
  );
}

export default App;
