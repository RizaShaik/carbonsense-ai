"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CarbonInsights } from "@/lib/carbon-insights-types";
import WhatIfSimulator from "@/components/WhatIfSimulator";
import {
  calculateCarbonFootprint,
  formatFootprint,
  type AssessmentInput,
} from "@/lib/carbon-calculator";


const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Easy",
  moderate: "Moderate",
  challenging: "Challenging",
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
  const footprint = useMemo(() => calculateCarbonFootprint(answers), [answers]);
  const [insights, setInsights] = useState<CarbonInsights | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchInsights() {
      setInsightsLoading(true);
      setInsightsError(null);

      try {
        const response = await fetch("/api/insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assessment: answers, footprint }),
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
  }, [answers, footprint.totalKgCO2e]);

  const totalPotentialReduction = insights?.reductionOpportunities.reduce(
    (sum, opp) => sum + opp.estimatedReductionKg,
    0,
  );

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

      <div className="mt-8 rounded-2xl bg-emerald-950 p-6 text-emerald-50 sm:p-8">
        <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">
          Estimated annual footprint
        </p>
        <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          {formatFootprint(footprint.totalKgCO2e)}
        </p>
        <p className="mt-1 text-sm text-emerald-100/60">
          {footprint.totalKgCO2e.toLocaleString()} kg CO₂e per year
        </p>

        <div className="mt-8 space-y-4">
          <p className="text-sm font-semibold text-emerald-200">Breakdown by category</p>
          {footprint.breakdown.map((item) => (
            <div key={item.category}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span>{item.label}</span>
                <span className="font-medium">
                  {formatFootprint(item.kgCO2e)}{" "}
                  <span className="text-emerald-100/50">({item.percentage}%)</span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-emerald-900">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
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
      <h3 className="mt-10 text-lg font-semibold text-emerald-950 dark:text-emerald-50">Your responses</h3>
      <dl className="mt-4 space-y-4">
        {stepTitles.map((s) => (
          <div
            key={s.id}
            className="flex flex-col gap-1 border-b border-emerald-900/10 pb-4 last:border-0 dark:border-emerald-100/10 sm:flex-row sm:justify-between"
          >
            <dt className="text-sm font-medium text-emerald-900/60 dark:text-emerald-100/60">{s.title}</dt>
            <dd className="text-sm font-semibold text-emerald-950 dark:text-emerald-50">
              {formatAnswer(s.id, answers[s.id])}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex h-11 items-center justify-center rounded-full border border-emerald-900/20 px-6 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-50 dark:border-emerald-100/20 dark:text-emerald-50 dark:hover:bg-emerald-900/30"
        >
          Start over
        </button>
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
