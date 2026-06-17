"use client";

import { useState } from "react";
import AssessmentResults from "@/components/AssessmentResults";
import type { AssessmentInput } from "@/lib/carbon-calculator";

type AssessmentAnswers = Required<AssessmentInput>;

const initialAnswers: AssessmentAnswers = {
  transportation: "",
  commuteDistance: "",
  flightsPerYear: "",
  dietType: "",
  electricityBill: "",
  shoppingFrequency: "",
};

type StepOption = {
  value: string;
  label: string;
  description?: string;
};

type Step =
  | {
      id: keyof AssessmentAnswers;
      title: string;
      description: string;
      type: "choice";
      options: StepOption[];
    }
  | {
      id: keyof AssessmentAnswers;
      title: string;
      description: string;
      type: "number";
      placeholder: string;
      unit?: string;
      min?: number;
      max?: number;
    };

const steps: Step[] = [
  {
    id: "transportation",
    title: "Primary transportation method",
    description: "How do you usually get around for daily travel?",
    type: "choice",
    options: [
      { value: "car-gas", label: "Car (gasoline)", description: "Personal gasoline vehicle" },
      { value: "car-ev", label: "Car (electric/hybrid)", description: "EV or hybrid vehicle" },
      { value: "public-transit", label: "Public transit", description: "Bus, train, or subway" },
      { value: "bike-walk", label: "Bicycle or walking", description: "Active transport most days" },
      { value: "motorcycle", label: "Motorcycle", description: "Motorcycle or scooter" },
    ],
  },
  {
    id: "commuteDistance",
    title: "Daily commute distance",
    description: "Round-trip distance to work or school each day. Enter 0 if you work from home.",
    type: "number",
    placeholder: "e.g. 20",
    unit: "miles",
    min: 0,
  },
  {
    id: "flightsPerYear",
    title: "Flights per year",
    description: "How many one-way or round-trip flights do you take in a typical year?",
    type: "number",
    placeholder: "e.g. 2",
    unit: "flights",
    min: 0,
  },
  {
    id: "dietType",
    title: "Diet type",
    description: "Which best describes your typical eating habits?",
    type: "choice",
    options: [
      { value: "omnivore", label: "Omnivore", description: "Regular meat and animal products" },
      { value: "flexitarian", label: "Flexitarian", description: "Mostly plant-based with occasional meat" },
      { value: "pescatarian", label: "Pescatarian", description: "Fish but no other meat" },
      { value: "vegetarian", label: "Vegetarian", description: "No meat, may include dairy and eggs" },
      { value: "vegan", label: "Vegan", description: "No animal products" },
    ],
  },
  {
    id: "electricityBill",
    title: "Monthly electricity bill",
    description: "Your average monthly electricity cost helps estimate home energy use.",
    type: "number",
    placeholder: "e.g. 120",
    unit: "USD",
    min: 0,
  },
  {
    id: "shoppingFrequency",
    title: "Shopping frequency",
    description: "How often do you buy new clothing, electronics, or other consumer goods?",
    type: "choice",
    options: [
      { value: "weekly", label: "Weekly", description: "New purchases most weeks" },
      { value: "biweekly", label: "Bi-weekly", description: "Every couple of weeks" },
      { value: "monthly", label: "Monthly", description: "About once a month" },
      { value: "rarely", label: "Rarely", description: "Only when needed" },
    ],
  },
];

function getChoiceLabel(step: Step, value: string): string {
  if (step.type !== "choice") return value;
  return step.options.find((o) => o.value === value)?.label ?? value;
}

function formatAnswer(step: Step, value: string): string {
  if (!value) return "—";
  if (step.type === "choice") return getChoiceLabel(step, value);
  if (step.unit === "USD") return `$${value}`;
  if (step.unit) return `${value} ${step.unit}`;
  return value;
}

export default function AssessmentForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>(initialAnswers);
  const [isComplete, setIsComplete] = useState(false);

  const step = steps[currentStep];
  const currentValue = answers[step.id];
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const canProceed =
    step.type === "choice"
      ? currentValue !== ""
      : currentValue !== "" && !Number.isNaN(Number(currentValue)) && Number(currentValue) >= 0;

  function updateAnswer(value: string) {
    setAnswers((prev) => ({ ...prev, [step.id]: value }));
  }

  function handleNext() {
    if (!canProceed) return;
    if (isLastStep) {
      setIsComplete(true);
    } else {
      setCurrentStep((s) => s + 1);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }

  function handleRestart() {
    setAnswers(initialAnswers);
    setCurrentStep(0);
    setIsComplete(false);
  }

  if (isComplete) {
    return (
      <AssessmentResults
        answers={answers}
        onRestart={handleRestart}
        formatAnswer={(stepId, value) => {
          const step = steps.find((s) => s.id === stepId);
          return step ? formatAnswer(step, value) : value;
        }}
        stepTitles={steps.map((s) => ({ id: s.id, title: s.title }))}
      />
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-900/10 bg-white p-6 shadow-sm sm:p-8 dark:border-emerald-100/10 dark:bg-emerald-950/50">
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-emerald-700 dark:text-emerald-400">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-emerald-900/50 dark:text-emerald-100/50">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-900/50">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-emerald-950 sm:text-3xl dark:text-emerald-50">{step.title}</h2>
        <p className="mt-2 text-emerald-900/70 dark:text-emerald-100/70">{step.description}</p>
      </div>

      {/* Input */}
      {step.type === "choice" ? (
        <fieldset className="space-y-3">
          <legend className="sr-only">{step.title}</legend>
          {step.options.map((option) => {
            const selected = currentValue === option.value;
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-colors ${
                  selected
                    ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600 dark:border-emerald-500 dark:bg-emerald-900/30 dark:ring-emerald-500"
                    : "border-emerald-900/10 hover:border-emerald-600/40 hover:bg-emerald-50/50 dark:border-emerald-100/10 dark:hover:border-emerald-500/40 dark:hover:bg-emerald-900/20"
                }`}
              >
                <input
                  type="radio"
                  name={step.id}
                  value={option.value}
                  checked={selected}
                  onChange={() => updateAnswer(option.value)}
                  className="mt-1 h-4 w-4 shrink-0 accent-emerald-600"
                />
                <span>
                  <span className="block font-semibold text-emerald-950 dark:text-emerald-50">{option.label}</span>
                  {option.description && (
                    <span className="mt-0.5 block text-sm text-emerald-900/60 dark:text-emerald-100/60">
                      {option.description}
                    </span>
                  )}
                </span>
              </label>
            );
          })}
        </fieldset>
      ) : (
        <div>
          <label htmlFor={step.id} className="sr-only">
            {step.title}
          </label>
          <div className="relative max-w-xs">
            {step.unit === "USD" && (
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/50 dark:text-emerald-100/50">
                $
              </span>
            )}
            <input
              id={step.id}
              type="number"
              inputMode="decimal"
              min={step.min}
              max={step.max}
              placeholder={step.placeholder}
              value={currentValue}
              onChange={(e) => updateAnswer(e.target.value)}
              className={`w-full rounded-xl border border-emerald-900/20 bg-white py-3 text-lg text-emerald-950 placeholder:text-emerald-900/30 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:border-emerald-100/20 dark:bg-emerald-950 dark:text-emerald-50 dark:placeholder:text-emerald-100/30 ${
                step.unit === "USD" ? "pl-8 pr-4" : "px-4"
              }`}
            />
          </div>
          {step.unit && step.unit !== "USD" && (
            <p className="mt-2 text-sm text-emerald-900/50 dark:text-emerald-100/50">Measured in {step.unit}</p>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 disabled:pointer-events-none disabled:opacity-40 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed}
          className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:pointer-events-none disabled:opacity-40"
        >
          {isLastStep ? "Complete assessment" : "Next"}
        </button>
      </div>
    </div>
  );
}
