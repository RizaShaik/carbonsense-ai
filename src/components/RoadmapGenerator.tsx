"use client";

interface RoadmapProps {
  biggestSource: string;
}

export default function RoadmapGenerator({
  biggestSource,
}: RoadmapProps) {
  const roadmap = {
    "Transportation": {
      short: [
        "Walk instead of driving for 2 short trips",
        "Track weekly mileage",
        "Combine errands into one trip",
      ],
      medium: [
        "Use public transport twice per week",
        "Reduce car usage by 10%",
        "Carpool when possible",
      ],
      long: [
        "Avoid one domestic flight",
        "Reduce annual driving distance by 15%",
        "Consider an EV or hybrid vehicle",
      ],
    },

    "Home Energy": {
      short: [
        "Switch off unused appliances",
        "Track daily electricity usage",
        "Replace one bulb with LED",
      ],
      medium: [
        "Reduce electricity use by 10%",
        "Use efficient appliances",
        "Optimize AC usage",
      ],
      long: [
        "Install solar panels if feasible",
        "Switch to renewable electricity",
        "Reduce yearly energy consumption",
      ],
    },

    "Food": {
      short: [
        "Reduce food waste",
        "Add one plant-based meal",
        "Track food purchases",
      ],
      medium: [
        "Adopt two meat-free days weekly",
        "Buy local produce",
        "Reduce processed foods",
      ],
      long: [
        "Shift toward a low-carbon diet",
        "Compost food waste",
        "Sustain long-term dietary changes",
      ],
    },
  };

  const plan =
    roadmap[biggestSource as keyof typeof roadmap] ??
    roadmap["Transportation"];

  return (
    <div className="mt-8 rounded-xl border p-6">
      <h2 className="text-2xl font-bold mb-4">
        Personalized Carbon Reduction Roadmap
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg">
            7-Day Plan
          </h3>
          <ul className="list-disc ml-5">
            {plan.short.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg">
            30-Day Plan
          </h3>
          <ul className="list-disc ml-5">
            {plan.medium.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg">
            90-Day Plan
          </h3>
          <ul className="list-disc ml-5">
            {plan.long.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}