import { Helmet } from "react-helmet";
import ServicesSection from "@/sections/home/ServicesSection";
import CTASection from "@/sections/home/CTASection";
import { serviceList } from "@/lib/data";

const Services = () => {
  return (
    <>
      <Helmet>
        <title>Our Services - BuildMaster Construction</title>
        <meta
          name="description"
          content="Explore BuildMaster Construction's comprehensive range of services including residential and commercial construction, renovation, interior design, and green building."
        />
        <meta
          name="keywords"
          content="construction services, residential construction, commercial construction, renovation, interior design, project management, green building"
        />
      </Helmet>
      <div className="py-20 bg-[#0f172a] text-white">
        <div className="container mx-auto px-4">
          <h1 className="font-montserrat font-bold text-4xl md:text-5xl text-center">
            Our Services
          </h1>
          <p className="text-lg mt-4 text-center max-w-3xl mx-auto">
            We offer a comprehensive range of construction services to meet all your building needs.
          </p>
        </div>
      </div>
      <ServicesSection />
      
      <section className="py-20 bg-[#f8fafc]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-montserrat font-bold text-3xl text-[#0f172a] mb-4">
              Our Service Process
            </h2>
            <p className="text-lg text-[#64748b] max-w-3xl mx-auto">
              We follow a structured approach to ensure your project is completed to the highest standards.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: "fas fa-comments",
                title: "Consultation",
                description: "We start with an in-depth consultation to understand your vision, requirements, and budget constraints."
              },
              {
                icon: "fas fa-drafting-compass",
                title: "Planning & Design",
                description: "Our team develops detailed plans and designs that align with your goals and comply with all regulations."
              },
              {
                icon: "fas fa-hammer",
                title: "Construction",
                description: "We execute the project with precision, keeping you informed throughout the construction phase."
              },
              {
                icon: "fas fa-check-circle",
                title: "Completion & Handover",
                description: "After thorough quality checks, we provide a complete handover with all necessary documentation."
              }
            ].map((step, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center relative">
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#f97316] text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="bg-[#f8fafc] w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                  <i className={`${step.icon} text-[#f97316] text-2xl`}></i>
                </div>
                <h3 className="font-montserrat font-semibold text-xl mb-3">{step.title}</h3>
                <p className="text-[#64748b]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-montserrat font-bold text-3xl text-[#0f172a] mb-4">
              Service Details
            </h2>
            <p className="text-lg text-[#64748b] max-w-3xl mx-auto">
              Learn more about each of our specialized construction services.
            </p>
          </div>
          
          <div className="space-y-12">
            {serviceList.map((service, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-8 items-center">
                <div className={`md:w-1/3 ${index % 2 === 1 ? 'md:order-last' : ''}`}>
                  <div className="rounded-lg overflow-hidden shadow-md">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-64 object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <div className="flex items-center mb-4">
                    <i className={`${service.icon} text-[#f97316] text-2xl mr-3`}></i>
                    <h3 className="font-montserrat font-semibold text-2xl">{service.title}</h3>
                  </div>
                  <p className="text-[#64748b] mb-4">{service.description}</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <i className="fas fa-check-circle text-[#f97316] mr-2 mt-1"></i>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <CTASection />
    </>
  );
};

export default Services;
