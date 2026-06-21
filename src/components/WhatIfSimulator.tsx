"use client";

import { useState } from "react";

interface Props {
  currentEmissions: number;
}

export default function WhatIfSimulator({ currentEmissions }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const scenarios = [
    {
      label: "Drive 2 fewer days per week",
      reduction: 250,
    },
    {
      label: "Take 1 fewer flight per year",
      reduction: 300,
    },
    {
      label: "Reduce electricity use by 10%",
      reduction: 180,
    },
  ];

  const reduction =
  scenarios
    .filter((s) =>
      selected.includes(
        s.label
      )
    )
    .reduce(
      (sum, s) =>
        sum + s.reduction,
      0
    );

  return (
    <div className="mt-8 rounded-xl border p-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-4">
        What-If Simulator
      </h2>

      <p className="mb-4 text-gray-600">
        Explore how small lifestyle changes could reduce your carbon footprint.
      </p>

      <div className="space-y-3">
        {scenarios.map((scenario) => (
          <button
            key={scenario.label}
            onClick={() => {
              setSelected((prev) =>
                prev.includes(
                  scenario.label
                )
                  ? prev.filter(
                      (item) =>
                        item !==
                        scenario.label
                    )
                  : [
                      ...prev,
                      scenario.label,
                    ]
              );
            }}
            className="w-full rounded-lg border p-3 text-left hover:bg-gray-50"
          >
            {scenario.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-lg bg-green-50 p-4">
        <p>
          Current Emissions:
          <span className="font-semibold">
            {" "}
            {currentEmissions.toFixed(1)} kg CO₂/year
          </span>
        </p>

        <p>
          Potential Reduction:
          <span className="font-semibold text-green-700">
            {" "}
            {reduction} kg CO₂/year
          </span>
        </p>

        <p className="mt-2">
          New Estimated Footprint:
          <span className="font-bold text-green-700">
            {" "}
            {(currentEmissions - reduction).toFixed(1)} kg CO₂/year
          </span>
        </p>
      </div>
    </div>
  );
}