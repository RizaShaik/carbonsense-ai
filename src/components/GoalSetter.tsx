"use client";

import { useState } from "react";

interface Props {
  currentEmissions: number;
}

export default function GoalSetter({
  currentEmissions,
}: Props) {
  const [goal, setGoal] = useState(10);

  const reduction =
    (currentEmissions * goal) / 100;

  return (
    <div className="mt-8 rounded-xl border p-6">
      <h2 className="text-2xl font-bold">
        Emission Reduction Goal
      </h2>

      <select
        value={goal}
        onChange={(e) =>
          setGoal(Number(e.target.value))
        }
        className="mt-4 border p-2 rounded"
      >
        <option value={5}>5%</option>
        <option value={10}>10%</option>
        <option value={20}>20%</option>
      </select>

      <p className="mt-4">
        Potential reduction:
        <strong>
          {" "}
          {Math.round(reduction)} kg CO₂e/year
        </strong>
      </p>
    </div>
  );
}