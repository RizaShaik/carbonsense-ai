"use client";

interface Props {
  biggestSource: string;
}

export default function PriorityActions({
  biggestSource,
}: Props) {
  const actions = {
    Transportation: [
      {
        action: "Reduce driving",
        impact: "High",
      },
      {
        action: "Use public transport",
        impact: "Medium",
      },
      {
        action: "Walk for short trips",
        impact: "Low",
      },
    ],

    Food: [
      {
        action: "Reduce meat consumption",
        impact: "High",
      },
      {
        action: "Reduce food waste",
        impact: "Medium",
      },
      {
        action: "Buy local produce",
        impact: "Low",
      },
    ],

    "Home Energy": [
      {
        action: "Reduce electricity usage",
        impact: "High",
      },
      {
        action: "Use efficient appliances",
        impact: "Medium",
      },
      {
        action: "Turn off unused devices",
        impact: "Low",
      },
    ],
  };

  const recommendations =
    actions[biggestSource as keyof typeof actions] ??
    actions.Transportation;

  return (
    <div className="mt-8 rounded-xl border p-6">
      <h2 className="text-2xl font-bold mb-4">
        Priority Actions
      </h2>

      <div className="space-y-3">
        {recommendations.map((item) => (
          <div
            key={item.action}
            className="rounded-xl border p-4"
          >
            <div className="flex flex-col md:flex-row md:justify-between gap-2 items-center">
              <span className="font-medium">
                {item.action}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  item.impact === "High"
                    ? "bg-red-100 text-red-700"
                    : item.impact === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {item.impact}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}