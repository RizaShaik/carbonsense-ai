export type AssessmentInput = {
  transportation: string;
  commuteDistance: string;
  flightsPerYear: string;
  dietType: string;
  electricityBill: string;
  shoppingFrequency?: string;
  distanceUnit?: "km" | "miles";
  electricityCurrency?: "USD" | "INR";
};

export type FootprintCategory =
  | "transportation"
  | "flights"
  | "food"
  | "homeEnergy"
  | "consumerGoods";

export type FootprintBreakdownItem = {
  category: FootprintCategory;
  label: string;
  kgCO2e: number;
  percentage: number;
};

export type CarbonFootprintResult = {
  totalKgCO2e: number;
  totalTonnesCO2e: number;
  breakdown: FootprintBreakdownItem[];
};

/** kg CO₂e per passenger-mile by transport mode (EPA / UK BEIS averages). */
const TRANSPORT_FACTORS_KG_PER_MILE: Record<string, number> = {
  "car-gas": 0.404,
  "car-ev": 0.12,
  "public-transit": 0.117,
  "bike-walk": 0,
  motorcycle: 0.283,
};

/** Estimated non-commute miles per year by mode. */
const BASELINE_MILES_PER_YEAR: Record<string, number> = {
  "car-gas": 4000,
  "car-ev": 4000,
  "public-transit": 1500,
  "bike-walk": 500,
  motorcycle: 3000,
};

/** Annual diet emissions in kg CO₂e (Poore & Nemecek / typical household estimates). */
const DIET_KG_PER_YEAR: Record<string, number> = {
  omnivore: 2500,
  flexitarian: 1800,
  pescatarian: 1700,
  vegetarian: 1500,
  vegan: 1000,
};

const SHOPPING_KG_PER_YEAR: Record<string, number> = {
  weekly: 1200,
  biweekly: 800,
  monthly: 400,
  rarely: 100,
};

const WORK_DAYS_PER_YEAR = 250;
const FLIGHT_AVG_MILES = 1000;
const FLIGHT_KG_PER_MILE = 0.255;
const AVG_ELECTRICITY_RATE_USD = 0.16;
const INR_TO_USD = 0.012;
const GRID_KG_PER_KWH = 0.42;
/** Scales electricity estimate to approximate total home energy (gas, heating). */
const HOME_ENERGY_MULTIPLIER = 1.25;

function parseNonNegative(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function calculateTransportation(input: AssessmentInput): number {
  const mode = input.transportation;
  const factor = TRANSPORT_FACTORS_KG_PER_MILE[mode] ?? TRANSPORT_FACTORS_KG_PER_MILE["car-gas"];
  const baselineMiles = BASELINE_MILES_PER_YEAR[mode] ?? BASELINE_MILES_PER_YEAR["car-gas"];
  const commuteValue = parseNonNegative(
    input.commuteDistance
  );
  const commuteMiles = (input.distanceUnit ?? "km") === "km" ? commuteValue * 0.621371 : commuteValue;
  const annualCommuteMiles = commuteMiles * WORK_DAYS_PER_YEAR;
  
  return (annualCommuteMiles + baselineMiles) * factor;
}

function calculateFlights(input: AssessmentInput): number {
  const flights = parseNonNegative(input.flightsPerYear);
  return flights * FLIGHT_AVG_MILES * FLIGHT_KG_PER_MILE;
}

function calculateFood(input: AssessmentInput): number {
  return DIET_KG_PER_YEAR[input.dietType] ?? DIET_KG_PER_YEAR.omnivore;
}

function calculateShopping(input: AssessmentInput): number {
  return (
    SHOPPING_KG_PER_YEAR[
      input.shoppingFrequency ?? "monthly"
    ] ?? 400
  );
}

function calculateHomeEnergy(input: AssessmentInput): number {
  const monthlyBill = parseNonNegative(input.electricityBill);
  let billUSD = monthlyBill;
  if ((input.electricityCurrency ?? "INR") === "INR") {
    billUSD = monthlyBill * INR_TO_USD;
  }
  const monthlyKwh = billUSD / AVG_ELECTRICITY_RATE_USD;
  const annualElectricityKg = monthlyKwh * 12 * GRID_KG_PER_KWH;

  return annualElectricityKg * HOME_ENERGY_MULTIPLIER;
}

export function calculateCarbonFootprint(
  input: AssessmentInput,
): CarbonFootprintResult {
  const rawBreakdown: Omit<FootprintBreakdownItem, "percentage">[] = [
    {
      category: "transportation",
      label: "Transportation",
      kgCO2e: calculateTransportation(input),
    },
    {
      category: "flights",
      label: "Flights",
      kgCO2e: calculateFlights(input),
    },
    {
      category: "food",
      label: "Food",
      kgCO2e: calculateFood(input),
    },
    {
      category: "consumerGoods",
      label: "Consumer Goods",
      kgCO2e: calculateShopping(input),
    },
    {
      category: "homeEnergy",
      label: "Home Energy",
      kgCO2e: calculateHomeEnergy(input),
    },
  ];

  const totalKgCO2e = rawBreakdown.reduce((sum, item) => sum + item.kgCO2e, 0);

  const breakdown: FootprintBreakdownItem[] = rawBreakdown.map((item) => ({
    ...item,
    kgCO2e: roundKg(item.kgCO2e),
    percentage:
      totalKgCO2e > 0 ? roundPercentage((item.kgCO2e / totalKgCO2e) * 100) : 0,
  }));

  const roundedTotal = breakdown.reduce((sum, item) => sum + item.kgCO2e, 0);

  return {
    totalKgCO2e: roundedTotal,
    totalTonnesCO2e: roundTonnes(roundedTotal / 1000),
    breakdown,
  };
}

function roundKg(value: number): number {
  return Math.round(value);
}

function roundTonnes(value: number): number {
  return Math.round(value * 10) / 10;
}

function roundPercentage(value: number): number {
  return Math.round(value * 10) / 10;
}

export function formatFootprint(kgCO2e: number): string {
  if (kgCO2e >= 1000) {
    return `${roundTonnes(kgCO2e / 1000)} tonnes CO₂e`;
  }
  return `${Math.round(kgCO2e)} kg CO₂e`;
}
