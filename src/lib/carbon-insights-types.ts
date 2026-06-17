export type CarbonInsights = {
  biggestEmissionSource: {
    category: string;
    label: string;
    kgCO2e: number;
    explanation: string;
  };
  recommendations: Array<{
    title: string;
    description: string;
    category: string;
  }>;
  reductionOpportunities: Array<{
    action: string;
    estimatedReductionKg: number;
    difficulty: "easy" | "moderate" | "challenging";
  }>;
};

export type CarbonInsightsInput = {
  assessment: {
    transportation: string;
    commuteDistance: string;
    flightsPerYear: string;
    dietType: string;
    electricityBill: string;
    shoppingFrequency?: string;
  };
  footprint: {
    totalKgCO2e: number;
    totalTonnesCO2e: number;
    breakdown: Array<{
      category: string;
      label: string;
      kgCO2e: number;
      percentage: number;
    }>;
  };
};
