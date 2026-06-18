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

      <ol className="space-y-3">
        {recommendations.map((item, index) => (
          <li key={item.action}>
            <strong>{index + 1}.</strong>{" "}
            {item.action}
            {" — "}
            <strong>{item.impact} Impact</strong>
          </li>
        ))}
      </ol>
    </div>
  );
}