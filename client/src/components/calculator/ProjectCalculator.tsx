
import { useState } from "react";
import { Card } from "../ui/card";

interface ServiceRate {
  service: string;
  baseRate: number;
  multiplier: number;
}

const serviceRates: ServiceRate[] = [
  { service: "Renovation", baseRate: 150, multiplier: 1.2 },
  { service: "New Construction", baseRate: 200, multiplier: 1.5 },
  { service: "Interior Design", baseRate: 100, multiplier: 1.0 },
  { service: "Project Management", baseRate: 80, multiplier: 1.1 }
];

export default function ProjectCalculator() {
  const [selectedService, setSelectedService] = useState<string>("");
  const [squareFootage, setSquareFootage] = useState<string>("");
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);

  const calculateCost = () => {
    const service = serviceRates.find(s => s.service === selectedService);
    if (service && squareFootage) {
      const area = parseFloat(squareFootage);
      const cost = service.baseRate * area * service.multiplier;
      setEstimatedCost(Math.round(cost));
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Project Cost Calculator</h2>
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Service Type</label>
          <select 
            className="w-full p-2 border rounded"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
          >
            <option value="">Select a service</option>
            {serviceRates.map(s => (
              <option key={s.service} value={s.service}>{s.service}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block mb-2">Square Footage</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={squareFootage}
            onChange={(e) => setSquareFootage(e.target.value)}
            placeholder="Enter square footage"
          />
        </div>

        <button
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90"
          onClick={calculateCost}
        >
          Calculate Estimate
        </button>

        {estimatedCost !== null && (
          <div className="mt-4 text-center">
            <p className="text-lg">Estimated Cost</p>
            <p className="text-2xl font-bold text-primary">
              ${estimatedCost.toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
