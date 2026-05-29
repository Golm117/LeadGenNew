"use client";

// LOCAL PREVIEW ONLY — throwaway demo of the QuizProgressNav animation.
// The real wired stepper (Appendix A questions + useReducer + submit) is T-132.

import { useState } from "react";
import { QuizProgressNav } from "@/components/ui/progress-indicator";

const MOCK_QUESTIONS = [
  {
    q: "How does your team track its core day-to-day work today?",
    options: ["Spreadsheets", "A mix of tools", "Off-the-shelf software", "Pen & paper / memory"],
  },
  {
    q: "How often do you re-enter the same data into more than one system?",
    options: ["Constantly", "A few times a day", "Occasionally", "Almost never"],
  },
  {
    q: "When you grow, what breaks first?",
    options: ["Manual handoffs", "Reporting", "Scheduling", "Nothing — we scale fine"],
  },
  {
    q: "How many separate tools does one job touch end-to-end?",
    options: ["1–2", "3–4", "5+", "I've lost count"],
  },
];

export default function AssessmentPage() {
  const total = MOCK_QUESTIONS.length;
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const current = MOCK_QUESTIONS[step - 1];
  const answered = answers[step] !== undefined;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-indigo-50/60 to-white px-6 py-16">
      <div className="w-full max-w-xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-indigo-900/5 md:p-10">
          <h2 className="mb-6 text-2xl font-bold leading-snug tracking-tight text-slate-900">
            {current.q}
          </h2>

          <div className="mb-8 flex flex-col gap-3">
            {current.options.map((opt, i) => {
              const selected = answers[step] === i;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setAnswers((a) => ({ ...a, [step]: i }))}
                  className={
                    "rounded-2xl border px-5 py-4 text-left text-sm font-medium transition-all " +
                    (selected
                      ? "border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-600/20"
                      : "border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-slate-50")
                  }
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <QuizProgressNav
            step={step}
            total={total}
            canContinue={answered}
            onBack={() => setStep((s) => Math.max(1, s - 1))}
            onContinue={() => setStep((s) => Math.min(total, s + 1))}
          />
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">
          Preview only — mock questions. Real quiz wiring is T-132.
        </p>
      </div>
    </main>
  );
}
