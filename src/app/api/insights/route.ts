import { NextResponse } from "next/server";
import type { AssessmentInput, CarbonFootprintResult } from "@/lib/carbon-calculator";
import { generateCarbonInsights } from "@/lib/gemini-insights";

type InsightsRequestBody = {
  assessment: AssessmentInput;
  footprint: CarbonFootprintResult;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as InsightsRequestBody;

    if (!body.assessment || !body.footprint) {
      return NextResponse.json(
        { error: "Missing assessment or footprint data." },
        { status: 400 },
      );
    }

    const insights = await generateCarbonInsights({
      assessment: body.assessment,
      footprint: body.footprint,
    });

    return NextResponse.json(insights);
  } catch (error) {
    console.error("Insights API error:", error);
    return NextResponse.json(
      { error: "Failed to generate carbon insights." },
      { status: 500 },
    );
  }
}
