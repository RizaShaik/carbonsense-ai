import Link from "next/link";

const features = [
  {
    title: "Personalized assessment",
    description:
      "Answer a few questions about your lifestyle and get a tailored estimate of your annual carbon emissions.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
  },
  {
    title: "AI-powered insights",
    description:
      "Our AI analyzes your results and highlights the biggest contributors to your footprint, with clear explanations.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
        />
      </svg>
    ),
  },
  {
    title: "Actionable recommendations",
    description:
      "Receive practical, prioritized steps you can take today to reduce your impact without sacrificing comfort.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
        />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <header className="border-b border-emerald-900/10 bg-white/80 backdrop-blur-sm dark:border-emerald-100/10 dark:bg-emerald-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
          <div className="flex items-center gap-2">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white"
              aria-hidden="true"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.636.386-3.18 1.07-4.582"
                />
              </svg>
            </span>
            <span className="text-lg font-semibold tracking-tight text-emerald-950 dark:text-emerald-50">
              CarbonSense AI
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-background px-6 py-16 sm:px-8 sm:py-24 lg:py-32 dark:from-emerald-950/40 dark:to-background">
          <div
            className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-20"
            aria-hidden="true"
          >
            <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-emerald-300/40 blur-3xl dark:bg-emerald-700/30" />
            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-teal-300/30 blur-3xl dark:bg-teal-800/20" />
          </div>

          <div className="relative mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="mb-4 text-sm font-medium uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                Sustainable living, simplified
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-emerald-950 sm:text-5xl lg:text-6xl dark:text-emerald-50">
                Understand your impact.{" "}
                <span className="text-emerald-600 dark:text-emerald-400">
                  Act with confidence.
                </span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-emerald-900/70 sm:text-xl dark:text-emerald-100/70">
                CarbonSense AI makes it easy to measure your carbon footprint
                and discover meaningful ways to reduce it — powered by
                intelligent, personalized guidance.
              </p>
              <div className="mt-10">
                <Link
                  href="/assessment"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-600 px-8 text-base font-semibold text-white shadow-lg shadow-emerald-600/25 transition-colors hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                >
                  Start Assessment
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* What is a carbon footprint */}
        <section className="px-6 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-emerald-950 sm:text-4xl dark:text-emerald-50">
                  What is a carbon footprint?
                </h2>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-emerald-900/70 sm:text-lg dark:text-emerald-100/70">
                  <p>
                    Your carbon footprint is the total amount of greenhouse
                    gases — primarily carbon dioxide — released into the
                    atmosphere as a result of your daily activities. Everything
                    from how you commute, what you eat, and how you heat your
                    home contributes to it.
                  </p>
                  <p>
                    These emissions are measured in{" "}
                    <strong className="font-semibold text-emerald-950 dark:text-emerald-50">
                      carbon dioxide equivalents (CO₂e)
                    </strong>
                    , which lets us compare different greenhouse gases on a
                    single scale. Understanding your footprint is the first
                    step toward making informed, sustainable choices.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Transportation", value: "~29%" },
                  { label: "Home energy", value: "~17%" },
                  { label: "Food & diet", value: "~26%" },
                  { label: "Goods & services", value: "~28%" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-emerald-900/10 bg-white p-5 dark:border-emerald-100/10 dark:bg-emerald-950/50"
                  >
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {item.value}
                    </p>
                    <p className="mt-1 text-sm font-medium text-emerald-900/60 dark:text-emerald-100/60">
                      {item.label}
                    </p>
                    <p className="mt-2 text-xs text-emerald-900/40 dark:text-emerald-100/40">
                      Typical household share
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How CarbonSense AI helps */}
        <section className="bg-emerald-950 px-6 py-16 text-emerald-50 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                How CarbonSense AI helps you
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-emerald-100/70">
                We turn complex climate data into a clear, personal action plan
                — so you can focus on what matters instead of getting lost in
                the numbers.
              </p>
            </div>

            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <li
                  key={feature.title}
                  className="rounded-2xl border border-emerald-800/50 bg-emerald-900/40 p-6"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-emerald-100/70">
                    {feature.description}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-12 text-center sm:text-left">
              <Link
                href="/assessment"
                className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-500 px-8 text-base font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
              >
                Start Assessment
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-900/10 px-6 py-8 sm:px-8 dark:border-emerald-100/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-emerald-900/50 dark:text-emerald-100/50">
            © {new Date().getFullYear()} CarbonSense AI. All rights reserved.
          </p>
          <p className="text-sm text-emerald-900/50 dark:text-emerald-100/50">
            Built for a more sustainable future.
          </p>
        </div>
      </footer>
    </div>
  );
}
