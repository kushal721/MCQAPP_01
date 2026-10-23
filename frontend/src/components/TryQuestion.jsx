import React, { useState } from "react";
import { Bulb, Check, Close, Refresh } from "./icons";

// Sample questions from the seed data. The home page demo runs entirely in
// the browser so visitors can try the flow without creating attempts.
const SAMPLES = [
  {
    source: "IOE · Physics",
    text: "Kinetic energy of a body of mass m moving with velocity v is:",
    options: ["mv", "½mv²", "mv²", "2mv²"],
    answer: 1,
    explanation: "KE = ½mv², derived from the work done to accelerate the body from rest.",
  },
  {
    source: "IOM · Biology",
    text: "DNA replication is:",
    options: ["Conservative", "Semi-conservative", "Dispersive", "Non-conservative"],
    answer: 1,
    explanation:
      "Each new DNA molecule keeps one original strand, as shown by the Meselson and Stahl experiment.",
  },
  {
    source: "Loksewa · General Knowledge",
    text: "Which is the longest river in Nepal?",
    options: ["Koshi", "Karnali", "Gandaki", "Bagmati"],
    answer: 1,
    explanation: "The Karnali is Nepal's longest river.",
  },
];

const LETTERS = "ABCD";

const rowStyle = (answered, isAnswer, isPicked) => {
  if (!answered) return "border-line bg-paper-card hover:border-ink-300 hover:bg-paper";
  if (isAnswer) return "border-right-500 bg-right-50";
  if (isPicked) return "border-wrong-500 bg-wrong-50";
  return "border-line bg-paper-card opacity-60";
};

const bubbleStyle = (answered, isAnswer, isPicked) => {
  if (!answered) return "border-ink-300 text-ink-700 group-hover:border-ink";
  if (isAnswer) return "border-right-500 bg-right-500 text-white";
  if (isPicked) return "border-wrong-500 bg-wrong-500 text-white";
  return "border-line-strong text-ink-400";
};

const TryQuestion = () => {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const q = SAMPLES[index];
  const answered = picked !== null;
  const correct = picked === q.answer;

  const next = () => {
    setPicked(null);
    setIndex((i) => (i + 1) % SAMPLES.length);
  };

  return (
    <div className="card p-5 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow">Try one · {q.source}</p>
        <p className="font-mono text-xs text-ink-400">
          {index + 1}/{SAMPLES.length}
        </p>
      </div>
      <h2 className="mt-3 font-sans text-lg font-semibold leading-snug text-ink">{q.text}</h2>

      <div className="mt-5 grid gap-2.5" role="radiogroup" aria-label="Answer options">
        {q.options.map((option, i) => {
          const isAnswer = i === q.answer;
          const isPicked = i === picked;
          return (
            <button
              key={option}
              role="radio"
              aria-checked={isPicked}
              disabled={answered}
              onClick={() => setPicked(i)}
              className={`group flex w-full items-center gap-3.5 rounded-lg border px-3 py-2.5 text-left transition-colors disabled:cursor-default ${rowStyle(
                answered,
                isAnswer,
                isPicked
              )}`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[1.5px] font-mono text-xs font-medium transition-colors ${bubbleStyle(
                  answered,
                  isAnswer,
                  isPicked
                )}`}
              >
                {answered && isAnswer ? (
                  <Check className="h-4 w-4" />
                ) : answered && isPicked ? (
                  <Close className="h-4 w-4" />
                ) : (
                  LETTERS[i]
                )}
              </span>
              <span className="text-sm font-medium text-ink">{option}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-5 animate-fade-up border-t border-line pt-4">
          <p className={`text-sm font-bold ${correct ? "text-right-700" : "text-wrong-700"}`}>
            {correct ? "Correct." : `Not quite. The answer is ${LETTERS[q.answer]}.`}
          </p>
          <p className="mt-2 flex gap-2.5 text-sm leading-relaxed text-ink-700">
            <Bulb className="mt-0.5 h-4 w-4 shrink-0 text-marigold-700" />
            {q.explanation}
          </p>
          <button className="btn-secondary mt-4 py-2" onClick={next}>
            <Refresh className="h-4 w-4" /> Another sample
          </button>
        </div>
      )}
    </div>
  );
};

export default TryQuestion;
