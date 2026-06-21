"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: {
    label: string;
    kgCO2e: number;
  }[];
}

const COLORS = [
  "#10b981",
  "#34d399",
  "#6ee7b7",
  "#a7f3d0",
  "#d1fae5",
];

export default function EmissionChart({
  data,
}: Props) {
  return (
    <div className="h-[320px]">
      <ResponsiveContainer>
        <PieChart aria-label="Carbon emission breakdown chart" >
          <Pie
            data={data}
            dataKey="kgCO2e"
            nameKey="label"
            outerRadius={120}
            label
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={
                  COLORS[
                    index %
                      COLORS.length
                  ]
                }
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}