# CarbonSense AI

## Overview

CarbonSense AI is a web application that helps users understand and reduce their personal carbon footprint.

Users answer a short sustainability assessment covering transportation, travel, diet, and household energy usage. The application calculates an estimated carbon footprint, provides a category-wise emissions breakdown, generates AI-powered insights, and suggests practical actions to reduce emissions.

The project combines deterministic carbon calculations with Gemini-powered explanations to create a personalized sustainability assistant.

---

## Challenge Vertical

**Sustainability & Climate Action**

CarbonSense AI helps users become more aware of their environmental impact and encourages informed decisions that can contribute to lower carbon emissions.

---

## Features

### Carbon Footprint Assessment

Users provide information about:

* Transportation habits
* Daily commute distance
* Flights taken per year
* Diet type
* Monthly electricity usage

The application converts these inputs into an estimated annual carbon footprint.

### Emissions Breakdown

Results are categorized into:

* Transportation
* Flights
* Food
* Home Energy

Users can quickly identify which activities contribute most to their emissions.

### AI-Powered Insights

Gemini analyzes the assessment results and generates personalized observations.

Examples include:

* Major sources of emissions
* High-impact areas for improvement
* Sustainability recommendations based on user responses

### What-If Simulator

The What-If Simulator allows users to explore how lifestyle changes could affect their estimated emissions.

This helps users understand the potential impact of different sustainability choices before making them.

### Personalized Roadmap Generator

Based on the user's highest emission category, the application generates a tailored improvement roadmap.

Examples:

* Transportation-focused recommendations
* Home energy reduction strategies
* Food and diet improvement suggestions

This creates a more actionable experience than simply displaying emissions data.

### Automated Testing

The project includes unit tests for the carbon footprint calculation logic.

Test coverage verifies:

* Positive footprint calculations
* Emissions increase with additional flights
* Emissions increase with longer commutes
* Lower emissions for vegan diets compared to omnivore diets
* Breakdown percentage consistency

---

## How Gemini Is Used

Gemini is used to generate personalized sustainability insights from the calculated assessment results.

The application first computes emissions using predefined carbon estimation logic and then provides Gemini with structured results. Gemini converts those results into natural-language recommendations and observations that are easier for users to understand and act upon.

---

## Application Flow

1. User completes sustainability assessment
2. Carbon calculator estimates emissions
3. Emissions are categorized by source
4. Gemini generates personalized insights
5. What-If Simulator explores potential reductions
6. Roadmap Generator provides targeted next steps

---

## Tech Stack

* Next.js
* TypeScript
* Tailwind CSS
* Google Gemini API
* Jest

---

## Project Structure

```text
src/
├── app/
├── components/
│   ├── AssessmentResults.tsx
│   ├── WhatIfSimulator.tsx
│   └── RoadmapGenerator.tsx
├── lib/
│   └── carbon-calculator.ts
└── tests/
    └── carbonCalculator.test.ts
```

---

## Installation

```bash
git clone https://github.com/RizaShaik/carbonsense-ai.git

cd carbonsense-ai

npm install

npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Running Tests

```bash
npm test
```

---

## Assumptions

* Carbon footprint values are estimates intended for educational purposes.
* User-provided information is self-reported.
* Results are designed to raise awareness and encourage sustainable choices rather than provide certified carbon accounting.

---

## Future Improvements

Potential enhancements include:

* More detailed transportation calculations
* Renewable energy recommendations
* Goal tracking and progress monitoring
* Historical footprint comparisons
* Region-specific emissions factors
* Expanded sustainability categories

---

## Conclusion

CarbonSense AI combines carbon footprint estimation, Gemini-powered insights, interactive exploration, and personalized recommendations to help users better understand their environmental impact and identify practical opportunities for improvement.
