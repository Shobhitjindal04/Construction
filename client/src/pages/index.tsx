import FeaturesSection from "../sections/home/FeaturesSection";
import ProjectCalculator from "../components/calculator/ProjectCalculator";

function HomePage() {
  return (
    <div>
      <FeaturesSection />
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Calculate Your Project Cost</h2>
          <ProjectCalculator />
        </div>
      </section>
    </div>
  );
}

export default HomePage;