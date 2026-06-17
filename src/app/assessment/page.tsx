import Link from "next/link";
import AssessmentForm from "@/components/AssessmentForm";

export const metadata = {
  title: "Carbon Footprint Assessment — CarbonSense AI",
  description: "Answer a few questions about your lifestyle to estimate your carbon footprint.",
};

export default function AssessmentPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-emerald-900/10 bg-white/80 backdrop-blur-sm dark:border-emerald-100/10 dark:bg-emerald-950/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white"
              aria-hidden="true"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
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
          </Link>
        </div>
      </header>

      <main className="flex-1 px-6 py-10 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              Carbon footprint assessment
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-emerald-950 sm:text-4xl dark:text-emerald-50">
              Let&apos;s measure your impact
            </h1>
            <p className="mt-3 text-emerald-900/70 dark:text-emerald-100/70">
              Answer six quick questions about your daily habits. Your responses are kept in this session only.
            </p>
          </div>

          <AssessmentForm />
        </div>
      </main>
    </div>
  );
}
