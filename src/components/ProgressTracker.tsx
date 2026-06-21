"use client";

interface ProgressTrackerProps {
  currentEmissions: number;
}
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function ProgressTracker({
  currentEmissions,
}: ProgressTrackerProps) {
  const month1 = currentEmissions * 0.95;
  const month2 = currentEmissions * 0.90;
  const month3 = currentEmissions * 0.85;

  const reduction =
    ((currentEmissions - month3) / currentEmissions) * 100;

  const trendData = [
    { month: "Current", emission: currentEmissions },
    { month: "M1", emission: month1 },
    { month: "M2", emission: month2 },
    { month: "M3", emission: month3 },
  ];

  return (
    <div
      role="region"
      aria-label="Carbon progress tracking dashboard"
      className="mt-8 rounded-xl border p-6"
    >
      <h2 className="text-2xl font-bold mb-4">
        Carbon Progress Tracker
      </h2>

      <p className="mb-6">
        Estimated progress if recommended
        actions are followed.
      </p>

      {[
        {
          label: "Current",
          value: currentEmissions,
        },
        {
          label: "Month 1",
          value: month1,
        },
        {
          label: "Month 2",
          value: month2,
        },
        {
          label: "Month 3",
          value: month3,
        },
      ].map((item) => (
        <div
          key={item.label}
          className="mb-4"
        >
          <div className="flex flex-col md:flex-row md:justify-between gap-2 text-sm mb-1">
            <span>{item.label}</span>
            <span>
              {Math.round(item.value)} kg
            </span>
          </div>

          <div className="h-3 rounded-full bg-gray-200">
            <div
              className="h-3 rounded-full bg-green-600"
              style={{
                width: `${
                  (item.value /
                    currentEmissions) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      ))}
      {/* Trend Chart Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">
          Emission Trend
        </h3>

        <LineChart width={320} height={220} data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="emission"
            stroke="#10b981"
            strokeWidth={2}
          />
        </LineChart>
      </div>
      <div
        className="mt-6 rounded-lg bg-green-50 p-4"
        aria-label="Estimated reduction summary"
      ></div>
      <div
        className="mt-6 rounded-lg bg-green-50 p-4"
        aria-label="Estimated reduction summary"
      >
        <strong>
          Potential Reduction:
        </strong>{" "}
        {reduction.toFixed(1)}%
      </div>
    </div>
  );
}