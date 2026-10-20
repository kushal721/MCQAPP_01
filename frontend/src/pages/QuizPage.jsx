import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Flame,
  Lightbulb,
  RotateCcw,
  Trophy,
  X,
} from "lucide-react";
import { api, errorMessage } from "../api";
import { getClientId } from "../lib/clientId";
import Spinner, { PageLoader } from "../components/ui/Spinner";
import { ErrorState } from "../components/ui/States";
import ProgressBar from "../components/ui/ProgressBar";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useToast } from "../components/ui/Toast";

const LETTERS = "ABCDEFGH";

const optionStyle = (phase, option, selectedId, result) => {
  if (phase !== "answered") {
    return selectedId === option._id
      ? "border-brand-500 bg-brand-50"
      : "border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/40";
  }
  const isCorrect = result.correctOptionIds.includes(option._id);
  if (isCorrect) return "border-emerald-500 bg-emerald-50";
  if (selectedId === option._id) return "border-rose-500 bg-rose-50";
  return "border-slate-200 bg-white opacity-60";
};

const letterStyle = (phase, option, selectedId, result) => {
  if (phase === "answered") {
    if (result.correctOptionIds.includes(option._id))
      return "bg-emerald-500 text-white";
    if (selectedId === option._id) return "bg-rose-500 text-white";
  } else if (selectedId === option._id) {
    return "bg-brand-600 text-white";
  }
  return "bg-slate-100 text-slate-600 group-hover:bg-brand-100 group-hover:text-brand-700";
};

const QuizPage = () => {
  const { courseId, subjectId } = useParams();
  const userId = getClientId();
  const toast = useToast();

  const [subject, setSubject] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [question, setQuestion] = useState(null);
  // loading | question | submitting | answered | done
  const [phase, setPhase] = useState("loading");
  const [selectedId, setSelectedId] = useState(null);
  const [result, setResult] = useState(null);
  const [attempted, setAttempted] = useState(0);
  const [session, setSession] = useState({ answered: 0, correct: 0, streak: 0 });
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);

  const loadNext = useCallback(async () => {
    setPhase("loading");
    setSelectedId(null);
    setResult(null);
    try {
      const next = await api.nextQuestion(subjectId, userId);
      setQuestion(next);
      setPhase(next ? "question" : "done");
    } catch (error) {
      setLoadError(errorMessage(error));
    }
  }, [subjectId, userId]);

  const init = useCallback(async () => {
    setLoadError("");
    setPhase("loading");
    try {
      const [subjectData, progress] = await Promise.all([
        api.getSubject(subjectId),
        api.getProgress(courseId, userId),
      ]);
      setSubject(subjectData);
      setAttempted(progress[subjectId]?.attempted || 0);
      setSession({ answered: 0, correct: 0, streak: 0 });
      await loadNext();
    } catch (error) {
      setLoadError(errorMessage(error));
    }
  }, [courseId, subjectId, userId, loadNext]);

  useEffect(() => {
    init();
  }, [init]);

  const choose = useCallback(
    async (option) => {
      if (phase !== "question") return;
      setSelectedId(option._id);
      setPhase("submitting");
      try {
        const res = await api.recordAttempt({
          quizType: "subjectwise",
          userId,
          courseId,
          subjectId,
          questionId: question._id,
          selectedOptionId: option._id,
        });
        setResult(res);
        setPhase("answered");
        setAttempted((n) => n + 1);
        setSession((s) => ({
          answered: s.answered + 1,
          correct: s.correct + (res.isCorrect ? 1 : 0),
          streak: res.isCorrect ? s.streak + 1 : 0,
        }));
      } catch (error) {
        toast(errorMessage(error, "Couldn't save your answer."), "error");
        setSelectedId(null);
        setPhase("question");
      }
    },
    [phase, userId, courseId, subjectId, question, toast]
  );

  // Keyboard shortcuts: 1–9 / A–H to answer, Enter or → for the next question.
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || confirmReset) return;
      if (phase === "question" && question) {
        const key = e.key.toUpperCase();
        let index = LETTERS.indexOf(key);
        if (index === -1 && /^[1-9]$/.test(key)) index = Number(key) - 1;
        if (index >= 0 && index < question.options.length) {
          e.preventDefault();
          choose(question.options[index]);
        }
      } else if (phase === "answered" && (e.key === "Enter" || e.key === "ArrowRight")) {
        e.preventDefault();
        loadNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, question, choose, loadNext, confirmReset]);

  const resetProgress = async () => {
    setResetting(true);
    try {
      await api.resetProgress(subjectId, userId);
      setConfirmReset(false);
      toast("Progress reset — let's go again!");
      await init();
    } catch (error) {
      toast(errorMessage(error), "error");
    } finally {
      setResetting(false);
    }
  };

  if (loadError)
    return (
      <div className="container-page py-16">
        <ErrorState message={loadError} onRetry={init} />
      </div>
    );
  if (!subject) return <PageLoader label="Loading quiz…" />;

  const total = subject.questionCount;
  const accuracy = session.answered
    ? Math.round((session.correct / session.answered) * 100)
    : 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-slate-50 pb-20">
      <div className="container-page max-w-3xl pt-8">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4">
          <Link
            to={`/courses/${courseId}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{subject.courseId?.name || "Back"}</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            {session.streak >= 2 && (
              <span className="badge bg-amber-50 text-amber-700">
                <Flame className="h-3.5 w-3.5" /> {session.streak} streak
              </span>
            )}
            <span className="badge bg-slate-100 text-slate-700">
              {session.correct}/{session.answered} this session
            </span>
            {attempted > 0 && (
              <button
                onClick={() => setConfirmReset(true)}
                className="icon-btn"
                title="Reset progress"
                aria-label="Reset progress"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-end justify-between">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {subject.name}
            </h1>
            <span className="text-sm font-semibold text-slate-500">
              {Math.min(attempted, total)} of {total} answered
            </span>
          </div>
          <ProgressBar value={attempted} max={total} className="mt-3" />
        </div>

        {/* Body */}
        {phase === "loading" ? (
          <div className="card mt-8 flex items-center justify-center py-24">
            <Spinner className="h-7 w-7 text-brand-600" />
          </div>
        ) : phase === "done" ? (
          <div className="card mt-8 animate-fade-up px-6 py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/25">
              <Trophy className="h-8 w-8" />
            </div>
            <h2 className="mt-6 text-2xl font-extrabold text-slate-900">
              {total === 0 ? "No questions yet" : "Subject complete!"}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-slate-500">
              {total === 0
                ? "There aren't any questions in this subject yet. Check back soon."
                : session.answered > 0
                ? `You got ${session.correct} of ${session.answered} right this session (${accuracy}%). You've answered every question in ${subject.name}.`
                : `You've already answered every question in ${subject.name}.`}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              {total > 0 && (
                <button className="btn-primary" onClick={() => setConfirmReset(true)}>
                  <RotateCcw className="h-4 w-4" /> Practise again
                </button>
              )}
              <Link to={`/courses/${courseId}`} className="btn-secondary">
                Choose another subject
              </Link>
            </div>
          </div>
        ) : (
          <div key={question._id} className="mt-8 animate-fade-up">
            <div className="card p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Question {Math.min(attempted + (phase === "answered" ? 0 : 1), total)}
              </p>
              <h2 className="mt-3 text-lg font-bold leading-relaxed text-slate-900 sm:text-xl">
                {question.question_text}
              </h2>

              <div className="mt-6 grid gap-3" role="radiogroup">
                {question.options.map((option, i) => {
                  const isRight =
                    phase === "answered" && result.correctOptionIds.includes(option._id);
                  const isWrong =
                    phase === "answered" && !isRight && selectedId === option._id;
                  return (
                    <button
                      key={option._id}
                      role="radio"
                      aria-checked={selectedId === option._id}
                      onClick={() => choose(option)}
                      disabled={phase !== "question"}
                      className={`group flex w-full items-center gap-4 rounded-xl border-2 p-3.5 text-left transition disabled:cursor-default ${optionStyle(
                        phase,
                        option,
                        selectedId,
                        result
                      )}`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition ${letterStyle(
                          phase,
                          option,
                          selectedId,
                          result
                        )}`}
                      >
                        {isRight ? (
                          <Check className="h-4 w-4" />
                        ) : isWrong ? (
                          <X className="h-4 w-4" />
                        ) : (
                          LETTERS[i]
                        )}
                      </span>
                      <span className="flex-1 font-medium text-slate-800">
                        {option.option_text}
                      </span>
                      {phase === "submitting" && selectedId === option._id && (
                        <Spinner className="h-4 w-4 text-brand-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {phase === "answered" && (
              <div className="mt-4 animate-fade-up">
                <div
                  className={`rounded-2xl border p-5 ${
                    result.isCorrect
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-rose-200 bg-rose-50"
                  }`}
                >
                  <p
                    className={`flex items-center gap-2 font-bold ${
                      result.isCorrect ? "text-emerald-800" : "text-rose-800"
                    }`}
                  >
                    {result.isCorrect ? (
                      <>
                        <Check className="h-5 w-5" /> Correct!
                      </>
                    ) : (
                      <>
                        <X className="h-5 w-5" /> Not quite
                      </>
                    )}
                  </p>
                  {result.explanation && (
                    <div className="mt-3 flex gap-3 rounded-xl bg-white/70 p-4 text-sm leading-relaxed text-slate-700">
                      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                      <p>{result.explanation}</p>
                    </div>
                  )}
                </div>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <p className="hidden text-xs text-slate-400 sm:block">
                    Press <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 font-sans">Enter</kbd> to continue
                  </p>
                  <button className="btn-primary ml-auto px-6" onClick={loadNext} autoFocus>
                    Next question <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {phase === "question" && (
              <p className="mt-4 hidden text-center text-xs text-slate-400 sm:block">
                Tip: press{" "}
                <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 font-sans">A</kbd>
                –
                <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 font-sans">
                  {LETTERS[question.options.length - 1]}
                </kbd>{" "}
                or <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 font-sans">1</kbd>–
                <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 font-sans">
                  {question.options.length}
                </kbd>{" "}
                to answer
              </p>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="Reset progress?"
        message={`This clears your answers for ${subject.name} so every question becomes available again.`}
        confirmLabel="Reset progress"
        busy={resetting}
        onConfirm={resetProgress}
        onClose={() => setConfirmReset(false)}
      />
    </div>
  );
};

export default QuizPage;
