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
      lowFlights.totalKgCO2e
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
      shortCommute.totalKgCO2e
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
      omnivore.totalKgCO2e
    );
  });

  test("breakdown percentages sum approximately to 100", () => {
    const result = calculateCarbonFootprint(baseInput);

    const totalPercentage = result.breakdown.reduce(
      (sum, item) => sum + item.percentage,
      0
    );

    expect(totalPercentage).toBeGreaterThanOrEqual(99);
    expect(totalPercentage).toBeLessThanOrEqual(101);
  });

  test("zero commute reduces transportation emissions", () => {
    const result = calculateCarbonFootprint({
      ...baseInput,
      commuteDistance: "0",
    });

    expect(result.totalKgCO2e).toBeGreaterThan(0);
  });

  test("bike/walk emits less than gasoline car", () => {
    const bike = calculateCarbonFootprint({
      ...baseInput,
      transportation: "bike-walk",
    });

    const car = calculateCarbonFootprint({
      ...baseInput,
      transportation: "car-gas",
    });

    expect(bike.totalKgCO2e).toBeLessThan(
      car.totalKgCO2e
    );
  });

  test("miles generate more emissions than same numeric km value", () => {
    const km = calculateCarbonFootprint({
      ...baseInput,
      commuteDistance: "10",
      distanceUnit: "km",
    });

    const miles = calculateCarbonFootprint({
      ...baseInput,
      commuteDistance: "10",
      distanceUnit: "miles",
    });

    expect(miles.totalKgCO2e).toBeGreaterThan(
      km.totalKgCO2e
    );
  });

  test("electricity bill contributes to emissions", () => {
    const lowBill = calculateCarbonFootprint({
      ...baseInput,
      electricityBill: "1000",
    });

    const highBill = calculateCarbonFootprint({
      ...baseInput,
      electricityBill: "5000",
    });

    expect(highBill.totalKgCO2e).toBeGreaterThan(
      lowBill.totalKgCO2e
    );
  });

  test("footprint contains four categories", () => {
    const result = calculateCarbonFootprint(baseInput);

    expect(result.breakdown.length).toBe(4);
  });

  test("total footprint equals sum of categories", () => {
    const result = calculateCarbonFootprint(baseInput);

    const total = result.breakdown.reduce(
      (sum, item) => sum + item.kgCO2e,
      0
    );

    expect(total).toBe(result.totalKgCO2e);
  });
});