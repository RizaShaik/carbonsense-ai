"use client";

interface ProgressTrackerProps {
  currentEmissions: number;
}

export default function ProgressTracker({
  currentEmissions,
}: ProgressTrackerProps) {
  const month1 = currentEmissions * 0.95;
  const month2 = currentEmissions * 0.90;
  const month3 = currentEmissions * 0.85;

  const reduction =
    ((currentEmissions - month3) / currentEmissions) * 100;

  return (
    <div className="mt-8 rounded-xl border p-6">
      <h2 className="text-2xl font-bold mb-4">
        Carbon Progress Tracker
      </h2>

      <p className="mb-4">
        Estimated progress if recommended actions are followed.
      </p>

      <div className="space-y-2">
        <p>Current: {currentEmissions.toFixed(1)} kg CO₂e</p>
        <p>Month 1: {month1.toFixed(1)} kg CO₂e</p>
        <p>Month 2: {month2.toFixed(1)} kg CO₂e</p>
        <p>Month 3: {month3.toFixed(1)} kg CO₂e</p>
      </div>

      <div className="mt-4 font-semibold text-green-700">
        Potential Reduction: {reduction.toFixed(1)}%
      </div>
    </div>
  );
}