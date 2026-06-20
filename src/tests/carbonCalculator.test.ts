import {
  calculateCarbonFootprint,
  type AssessmentInput,
} from "@/lib/carbon-calculator";

describe("Carbon Calculator", () => {
  const baseInput: AssessmentInput = {
    transportation: "car-gas",
    commuteDistance: "10",
    distanceUnit: "km",
    flightsPerYear: "2",
    dietType: "omnivore",
    electricityBill: "3000",
    electricityCurrency: "INR",
  };

  test("calculates a positive carbon footprint", () => {
    const result = calculateCarbonFootprint(baseInput);

    expect(result.totalKgCO2e).toBeGreaterThan(0);
    expect(result.totalTonnesCO2e).toBeGreaterThan(0);
  });

  test("more flights increase emissions", () => {
    const lowFlights = calculateCarbonFootprint({
      ...baseInput,
      flightsPerYear: "1",
    });

    const highFlights = calculateCarbonFootprint({
      ...baseInput,
      flightsPerYear: "10",
    });

    expect(highFlights.totalKgCO2e).toBeGreaterThan(
      lowFlights.totalKgCO2e,
    );
  });

  test("longer commute increases transportation emissions", () => {
    const shortCommute = calculateCarbonFootprint({
      ...baseInput,
      commuteDistance: "5",
    });

    const longCommute = calculateCarbonFootprint({
      ...baseInput,
      commuteDistance: "30",
    });

    expect(longCommute.totalKgCO2e).toBeGreaterThan(
      shortCommute.totalKgCO2e,
    );
  });

  test("vegan diet produces lower emissions than omnivore diet", () => {
    const omnivore = calculateCarbonFootprint({
      ...baseInput,
      dietType: "omnivore",
    });

    const vegan = calculateCarbonFootprint({
      ...baseInput,
      dietType: "vegan",
    });

    expect(vegan.totalKgCO2e).toBeLessThan(
      omnivore.totalKgCO2e,
    );
  });

  test("breakdown percentages sum approximately to 100", () => {
    const result = calculateCarbonFootprint(baseInput);

    const totalPercentage = result.breakdown.reduce(
      (sum, item) => sum + item.percentage,
      0,
    );

    expect(totalPercentage).toBeCloseTo(100, 0);
  });
});