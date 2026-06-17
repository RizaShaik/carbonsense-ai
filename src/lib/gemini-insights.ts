import { GoogleGenAI, Type } from "@google/genai";
import type { CarbonInsights, CarbonInsightsInput } from "@/lib/carbon-insights-types";

export type { CarbonInsights, CarbonInsightsInput } from "@/lib/carbon-insights-types";

const INSIGHTS_JSON_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    biggestEmissionSource: {
      type: Type.OBJECT,
      properties: {
        category: { type: Type.STRING },
        label: { type: Type.STRING },
        kgCO2e: { type: Type.NUMBER },
        explanation: { type: Type.STRING },
      },
      required: ["category", "label", "kgCO2e", "explanation"],
    },
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          category: { type: Type.STRING },
        },
        required: ["title", "description", "category"],
      },
    },
    reductionOpportunities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          action: { type: Type.STRING },
          estimatedReductionKg: { type: Type.NUMBER },
          difficulty: {
            type: Type.STRING,
            enum: ["easy", "moderate", "challenging"],
          },
        },
        required: ["action", "estimatedReductionKg", "difficulty"],
      },
    },
  },
  required: ["biggestEmissionSource", "recommendations", "reductionOpportunities"],
};

const ASSESSMENT_LABELS: Record<string, Record<string, string>> = {
  transportation: {
    "car-gas": "Car (gasoline)",
    "car-ev": "Car (electric/hybrid)",
    "public-transit": "Public transit",
    "bike-walk": "Bicycle or walking",
    motorcycle: "Motorcycle",
  },
  dietType: {
    omnivore: "Omnivore",
    flexitarian: "Flexitarian",
    pescatarian: "Pescatarian",
    vegetarian: "Vegetarian",
    vegan: "Vegan",
  },
  shoppingFrequency: {
    weekly: "Weekly",
    biweekly: "Bi-weekly",
    monthly: "Monthly",
    rarely: "Rarely",
  },
};

function labelValue(group: string, value: string): string {
  return ASSESSMENT_LABELS[group]?.[value] ?? value;
}

function buildPrompt(input: CarbonInsightsInput): string {
  const { assessment, footprint } = input;

  const breakdownLines = footprint.breakdown
    .map(
      (item) =>
        `- ${item.label} (${item.category}): ${item.kgCO2e} kg CO₂e (${item.percentage}% of total)`,
    )
    .join("\n");

  return `You are CarbonSense AI, a sustainability advisor. Analyze this user's carbon footprint data and provide actionable insights.

## Lifestyle profile
- Primary transportation: ${labelValue("transportation", assessment.transportation)}
- Daily commute distance: ${assessment.commuteDistance} miles (round trip)
- Flights per year: ${assessment.flightsPerYear}
- Diet type: ${labelValue("dietType", assessment.dietType)}
- Monthly electricity bill: $${assessment.electricityBill}
- Shopping frequency: ${labelValue("shoppingFrequency", assessment.shoppingFrequency ?? "unknown")}

## Calculated annual footprint
- Total: ${footprint.totalKgCO2e} kg CO₂e (${footprint.totalTonnesCO2e} tonnes)

### Breakdown by category
${breakdownLines}

## Instructions
1. Identify the biggest emission source from the breakdown data. Use the exact category key and label from the breakdown.
2. Provide 3–5 personalized recommendations tied to this user's specific lifestyle answers — not generic advice.
3. Provide 2–4 estimated yearly reduction opportunities with realistic kg CO₂e savings based on their data.

Keep language clear, encouraging, and practical. Round estimatedReductionKg to whole numbers.`;
}

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
  }

  return new GoogleGenAI({ apiKey });
}

function parseInsightsResponse(text: string): CarbonInsights {
  const parsed = JSON.parse(text) as CarbonInsights;

  if (
    !parsed.biggestEmissionSource ||
    !Array.isArray(parsed.recommendations) ||
    !Array.isArray(parsed.reductionOpportunities)
  ) {
    throw new Error("Gemini response missing required insight fields.");
  }

  return {
    biggestEmissionSource: {
      category: parsed.biggestEmissionSource.category,
      label: parsed.biggestEmissionSource.label,
      kgCO2e: Math.round(parsed.biggestEmissionSource.kgCO2e),
      explanation: parsed.biggestEmissionSource.explanation,
    },
    recommendations: parsed.recommendations.map((rec) => ({
      title: rec.title,
      description: rec.description,
      category: rec.category,
    })),
    reductionOpportunities: parsed.reductionOpportunities.map((opp) => ({
      action: opp.action,
      estimatedReductionKg: Math.round(opp.estimatedReductionKg),
      difficulty: opp.difficulty,
    })),
  };
}

function buildFallbackInsights(input: CarbonInsightsInput): CarbonInsights {
  const { assessment, footprint } = input;
  const biggest = [...footprint.breakdown].sort((a, b) => b.kgCO2e - a.kgCO2e)[0];

  const recommendations: CarbonInsights["recommendations"] = [];
  const reductions: CarbonInsights["reductionOpportunities"] = [];

  if (biggest.category === "transportation") {
    recommendations.push({
      title: "Reduce driving days",
      description:
        "Try working from home one extra day per week or combining errands into fewer trips to cut commute emissions.",
      category: "transportation",
    });
    if (assessment.transportation === "car-gas") {
      reductions.push({
        action: "Switch 2 commute days per week to public transit",
        estimatedReductionKg: Math.round(biggest.kgCO2e * 0.2),
        difficulty: "moderate",
      });
    }
  }

  if (biggest.category === "flights" || Number(assessment.flightsPerYear) > 0) {
    recommendations.push({
      title: "Fly less, stay longer",
      description:
        "Combine trips and choose direct flights when possible — takeoffs and landings produce the most emissions.",
      category: "flights",
    });
    reductions.push({
      action: "Replace one short-haul flight with train or bus travel",
      estimatedReductionKg: Math.round(Number(assessment.flightsPerYear) > 0 ? 255 : 0),
      difficulty: "moderate",
    });
  }

  if (biggest.category === "food") {
    recommendations.push({
      title: "Shift toward plant-based meals",
      description:
        "Start with one or two meat-free days per week — diet changes are among the most effective personal actions.",
      category: "food",
    });
    reductions.push({
      action: "Adopt two plant-based days per week",
      estimatedReductionKg: 300,
      difficulty: "easy",
    });
  }

  if (biggest.category === "homeEnergy") {
    recommendations.push({
      title: "Improve home efficiency",
      description:
        "Use a programmable thermostat, switch to LED bulbs, and unplug idle electronics to lower your energy bill and footprint.",
      category: "homeEnergy",
    });
    reductions.push({
      action: "Reduce thermostat by 2°F in winter and raise by 2°F in summer",
      estimatedReductionKg: Math.round(biggest.kgCO2e * 0.1),
      difficulty: "easy",
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      title: "Track your progress",
      description:
        "Re-run this assessment every few months to see how lifestyle changes affect your footprint.",
      category: "general",
    });
  }

  return {
    biggestEmissionSource: {
      category: biggest.category,
      label: biggest.label,
      kgCO2e: biggest.kgCO2e,
      explanation: `${biggest.label} accounts for ${biggest.percentage}% of your estimated annual emissions (${biggest.kgCO2e} kg CO₂e).`,
    },
    recommendations: recommendations.slice(0, 5),
    reductionOpportunities: reductions.filter((r) => r.estimatedReductionKg > 0).slice(0, 4),
  };
}

export async function generateCarbonInsights(
  input: CarbonInsightsInput,
): Promise<CarbonInsights> {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: buildPrompt(input),
      config: {
        responseMimeType: "application/json",
        responseSchema: INSIGHTS_JSON_SCHEMA,
        temperature: 0.7,
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    return parseInsightsResponse(text);
  } catch (error) {
    console.error("Gemini insights generation failed, using fallback:", error);
    return buildFallbackInsights(input);
  }
}
