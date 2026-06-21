"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CarbonInsights } from "@/lib/carbon-insights-types";
import WhatIfSimulator from "@/components/WhatIfSimulator";
import RoadmapGenerator from "@/components/RoadmapGenerator";
import ProgressTracker from "@/components/ProgressTracker";
import PriorityActions from "./PriorityActions";
import GoalSetter from "@/components/GoalSetter";
import EmissionChart from "@/components/EmissionChart";
import jsPDF from "jspdf";
import {
  calculateCarbonFootprint,
  formatFootprint,
} from "@/lib/carbon-calculator";
import type { AssessmentInput } from "@/lib/carbon-calculator";



const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Easy",
  moderate: "Moderate",
  challenging: "Challenging",
};

const CATEGORY_ICONS: Record<string, string> = {
  transportation: "🚗",
  flights: "✈️",
  food: "🍽️",
  homeEnergy: "🏠",
  consumerGoods: "🛍️",
};

type AssessmentResultsProps = {
  answers: Required<AssessmentInput>;
  onRestart: () => void;
  formatAnswer: (stepId: keyof Required<AssessmentInput>, value: string) => string;
  stepTitles: Array<{ id: keyof Required<AssessmentInput>; title: string }>;
};

export default function AssessmentResults({
  answers,
  onRestart,
  formatAnswer,
  stepTitles,
}: AssessmentResultsProps) {
  const [insights, setInsights] = useState<CarbonInsights | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const [hydratedAnswers, setHydratedAnswers] = useState<Required<AssessmentInput> | null>(null);
  const activeAnswers = hydratedAnswers ?? answers;
  const footprint = useMemo(
    () => calculateCarbonFootprint(activeAnswers),
    [activeAnswers]
  ); 
  useEffect(() => {
    const saved = localStorage.getItem("carbon-assessment");

    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);

      // defer state update to avoid lint warning
      queueMicrotask(() => {
        setHydratedAnswers(parsed);
      });
    } catch {
      console.error("Failed to load saved assessment");
    }
  }, []);
  useEffect(() => {
    let cancelled = false;

    async function fetchInsights() {
      setInsightsLoading(true);
      setInsightsError(null);

      try {
        const response = await fetch("/api/insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assessment: activeAnswers,
            footprint: calculateCarbonFootprint(activeAnswers),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to load AI insights.");
        }

        const data = (await response.json()) as CarbonInsights;

        if (!cancelled) {
          setInsights(data);
        }
      } catch {
        if (!cancelled) {
          setInsightsError("Unable to load personalized insights right now.");
        }
      } finally {
        if (!cancelled) {
          setInsightsLoading(false);
        }
      }
    }

    fetchInsights();

    return () => {
      cancelled = true;
    };
  }, [activeAnswers]);

  const totalPotentialReduction = insights?.reductionOpportunities.reduce(
    (sum, opp) => sum + opp.estimatedReductionKg,
    0,
  );

  const sustainabilityGrade =
  footprint.totalTonnesCO2e < 4
    ? "A"
    : footprint.totalTonnesCO2e < 8
    ? "B"
    : footprint.totalTonnesCO2e < 12
    ? "C"
    : footprint.totalTonnesCO2e < 16
    ? "D"
    : "E";

  const benchmarks = {
    Global: 4.7,
    India: 1.9,
    USA: 14.7,
    UK: 5.5,
  };

  const globalAverage = benchmarks.Global;

  const difference =
    (
      ((footprint.totalTonnesCO2e - globalAverage) /
        globalAverage) *
      100
    ).toFixed(0);

  const indiaDifference = (
    ((footprint.totalTonnesCO2e - benchmarks.India) /
      benchmarks.India) *
    100
  ).toFixed(0);

  const usaDifference = (
    ((footprint.totalTonnesCO2e - benchmarks.USA) /
      benchmarks.USA) *
    100
  ).toFixed(0);

  const treesNeeded = Math.ceil(
    footprint.totalKgCO2e / 21
  );

  const carMilesEquivalent = Math.round(
    footprint.totalKgCO2e / 0.404
  );

  const electricityEquivalent = Math.round(
    footprint.totalKgCO2e / 0.42
  );

  function exportResults() {
    const data = {
      footprint,
      sustainabilityGrade,
      answers,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "carbon-footprint-report.json";

    a.click();

    URL.revokeObjectURL(url);
  }

  async function shareResults() {
    try {
      await navigator.share({
        title: "CarbonSense AI",
        text: `My annual carbon footprint is ${footprint.totalTonnesCO2e} tCO₂e 🌱`,
        url: window.location.origin,
      });
    } catch {
      // user cancelled
    }
  }

  function exportPDF() {
    const pdf = new jsPDF();

    pdf.text(
      "CarbonSense AI Report",
      20,
      20
    );

    pdf.text(
      `Footprint: ${footprint.totalTonnesCO2e} tCO2e`,
      20,
      40
    );

    pdf.text(
      `Grade: ${sustainabilityGrade}`,
      20,
      60
    );

    pdf.save(
      "CarbonSense_Report.pdf"
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-900/10 bg-white p-6 shadow-sm sm:p-8 dark:border-emerald-100/10 dark:bg-emerald-950/50">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-emerald-950 dark:text-emerald-50">Assessment complete</h2>
      <p className="mt-2 text-emerald-900/70 dark:text-emerald-100/70">
        Based on your answers, here is your estimated annual carbon footprint.
      </p>

      <div className="mt-8 rounded-3xl bg-emerald-950 p-8 text-emerald-50 shadow-xl sm:p-10">
        <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">
          Estimated Annual Footprint
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          {/* Sustainability Grade */}
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-6">
            <p className="text-sm uppercase tracking-wider text-emerald-300">
              Sustainability Grade
            </p>

            <div className="mt-4">
              <span
                className={`inline-flex h-20 w-20 items-center justify-center rounded-full text-4xl font-bold ${
                  sustainabilityGrade === "A"
                    ? "bg-green-500 text-white"
                    : sustainabilityGrade === "B"
                    ? "bg-lime-500 text-white"
                    : sustainabilityGrade === "C"
                    ? "bg-yellow-500 text-black"
                    : sustainabilityGrade === "D"
                    ? "bg-orange-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {sustainabilityGrade}
              </span>
            </div>

            <p className="mt-4 text-sm text-emerald-200">
              Based on your annual emissions
            </p>
          </div>

          {/* Global Benchmark */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-wider text-emerald-300">
              Global Benchmark
            </p>

            <div className="mt-4 space-y-3">
              <p>
                🌍 Global Average:
                <strong> 4.7 tCO₂e</strong>
              </p>

              <p>
                🇮🇳 India Average:
                <strong> 1.9 tCO₂e</strong>
              </p>

              <p>
                🇺🇸 USA Average:
                <strong> 14.7 tCO₂e</strong>
              </p>

              <div className="pt-2 border-t border-white/10">
                <p>
                  {Math.abs(Number(difference))}%
                  {Number(difference) > 0
                    ? " above"
                    : " below"} Global Average
                </p>

                <p>
                  {Math.abs(Number(indiaDifference))}%
                  {Number(indiaDifference) > 0
                    ? " above"
                    : " below"} India Average
                </p>

                <p>
                  {Math.abs(Number(usaDifference))}%
                  {Number(usaDifference) > 0
                    ? " above"
                    : " below"} USA Average
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
            Your Annual Carbon Footprint
          </p>

          <p className="mt-4 text-6xl font-extrabold tracking-tight">
            {formatFootprint(footprint.totalKgCO2e)}
          </p>

          <p className="mt-3 text-base text-emerald-200/70">
            {footprint.totalKgCO2e.toLocaleString()} kg CO₂e per year
          </p>
        </div>
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-xl font-semibold mb-4">
            Emission Distribution
          </h3>

          <EmissionChart
            data={footprint.breakdown}
          />
        </div>
        <div className="mt-12">
          <h3 className="mb-6 text-xl font-semibold text-emerald-100">
            Emissions Breakdown
          </h3>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">
              Real World Impact
            </h3>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-3xl">🌳</p>
                <p className="mt-2 font-bold">
                  {treesNeeded}
                </p>
                <p className="text-sm text-emerald-200/70">
                  Trees needed annually
                </p>
              </div>

              <div>
                <p className="text-3xl">🚗</p>
                <p className="mt-2 font-bold">
                  {carMilesEquivalent.toLocaleString()}
                </p>
                <p className="text-sm text-emerald-200/70">
                  Car miles equivalent
                </p>
              </div>

              <div>
                <p className="text-3xl">💡</p>
                <p className="mt-2 font-bold">
                  {electricityEquivalent.toLocaleString()}
                </p>
                <p className="text-sm text-emerald-200/70">
                  kWh electricity equivalent
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {footprint.breakdown.map((item) => (
              <div
                key={item.category}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-medium">
                    {CATEGORY_ICONS[item.category]} {item.label}
                  </span>

                  <span className="font-semibold">
                    {formatFootprint(item.kgCO2e)}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all duration-700"
                    style={{
                      width: `${item.percentage}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-sm text-emerald-200/80">
                  {item.percentage}% of total emissions
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-emerald-900/10 p-6 dark:border-emerald-100/10">
        <p className="text-sm font-medium uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
          AI-powered insights
        </p>

        {insightsLoading && (
          <div className="mt-6 flex items-center gap-3 text-emerald-900/60 dark:text-emerald-100/60">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
            <p className="text-sm">Generating personalized recommendations…</p>
          </div>
        )}

        {insightsError && !insightsLoading && (
          <p className="mt-4 text-sm text-emerald-900/60 dark:text-emerald-100/60">{insightsError}</p>
        )}

        {insights && !insightsLoading && (
          <div className="mt-6 space-y-8">
            <div className="rounded-xl bg-emerald-50 p-5 dark:bg-emerald-900/20">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Biggest emission source
              </p>
              <p className="mt-2 text-xl font-bold text-emerald-950 dark:text-emerald-50">
                {insights.biggestEmissionSource.label}
              </p>
              <p className="mt-1 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                {formatFootprint(insights.biggestEmissionSource.kgCO2e)} per year
              </p>
              <p className="mt-3 text-sm leading-relaxed text-emerald-900/70 dark:text-emerald-100/70">
                {insights.biggestEmissionSource.explanation}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-emerald-950 dark:text-emerald-50">
                Personalized recommendations
              </h3>
              <ul className="mt-4 space-y-3">
                {insights.recommendations.map((rec) => (
                  <li
                    key={rec.title}
                    className="rounded-xl border border-emerald-900/10 p-4 dark:border-emerald-100/10"
                  >
                    <p className="font-semibold text-emerald-950 dark:text-emerald-50">{rec.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-emerald-900/70 dark:text-emerald-100/70">
                      {rec.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <h3 className="text-lg font-semibold text-emerald-950 dark:text-emerald-50">
                  Yearly reduction opportunities
                </h3>
                {totalPotentialReduction !== undefined && totalPotentialReduction > 0 && (
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    Up to {formatFootprint(totalPotentialReduction)} potential savings
                  </p>
                )}
              </div>
              <ul className="mt-4 space-y-3">
                {insights.reductionOpportunities.map((opp) => (
                  <li
                    key={opp.action}
                    className="flex flex-col gap-2 rounded-xl border border-emerald-900/10 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-emerald-100/10"
                  >
                    <div>
                      <p className="font-medium text-emerald-950 dark:text-emerald-50">{opp.action}</p>
                      <p className="mt-1 text-xs text-emerald-900/50 dark:text-emerald-100/50">
                        {DIFFICULTY_LABELS[opp.difficulty] ?? opp.difficulty}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      −{formatFootprint(opp.estimatedReductionKg)}/yr
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <WhatIfSimulator
        currentEmissions={footprint.totalKgCO2e}
      />
      <RoadmapGenerator
        biggestSource={insights?.biggestEmissionSource?.label || "Transportation"}
      />
      <PriorityActions
        biggestSource={
        insights?.biggestEmissionSource?.label ||
        "Transportation"
      }
      />
      <ProgressTracker
        currentEmissions={footprint.totalKgCO2e}
      />
      <GoalSetter
        currentEmissions={footprint.totalKgCO2e}
      />

      <h3 className="mt-10 text-lg font-semibold text-emerald-950 dark:text-emerald-50">Your responses</h3>
      <dl className="mt-4 space-y-4">
        {stepTitles.map((s) => (
          <div
            key={s.id}
            className="flex flex-col gap-1 border-b border-emerald-900/10 pb-4 last:border-0 dark:border-emerald-100/10 sm:flex-row sm:justify-between"
          >
            <dt className="text-sm font-medium text-emerald-900/60 dark:text-emerald-100/60">{s.title}</dt>
            <dd className="text-sm font-semibold text-emerald-950 dark:text-emerald-50">
              {formatAnswer(s.id, activeAnswers[s.id])}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            type="button"
            onClick={shareResults}
            aria-label="Share carbon footprint results"
            className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Share Results
          </button>

          <button
            type="button"
            onClick={exportResults}
            aria-label="Export carbon footprint report as JSON"
            className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Export Report
          </button>

          <button
            onClick={exportPDF}
            aria-label="Download carbon footprint report as PDF"
            className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-semibold text-white"
          >
            Download PDF Report
          </button>

          <button
            type="button"
            onClick={onRestart}
            aria-label="Start assessment again"
            className="inline-flex h-11 items-center justify-center rounded-full border border-emerald-900/20 px-6 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-50 dark:border-emerald-100/20 dark:text-emerald-50 dark:hover:bg-emerald-900/30"
          >
            Start over
          </button>
        </div>

        <Link
          href="/"
          aria-label="Return to homepage"
          className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Back to home
        </Link>

      </div>
    </div>
  );
}
