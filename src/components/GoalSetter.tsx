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

      <div className="mt-6">
        <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={goal}
            onChange={(e) =>
            setGoal(Number(e.target.value))
            }
            className="w-full"
        />

        <div className="mt-2 flex flex-col md:flex-row md:justify-between gap-2 text-sm">
            <span>5%</span>
            <span className="font-bold">
            {goal}% Goal
            </span>
            <span>50%</span>
        </div>
        </div>

      <div className="mt-6 rounded-lg bg-green-50 p-4">
        <p>
            Potential reduction:
            <strong>
            {" "}
            {Math.round(reduction)} kg CO₂e/year
            </strong>
        </p>

        <p className="mt-2">
            New footprint:
            <strong>
            {" "}
            {Math.round(
                currentEmissions - reduction
            )}{" "}
            kg CO₂e/year
            </strong>
        </p>
       </div>
    </div>
  );
}