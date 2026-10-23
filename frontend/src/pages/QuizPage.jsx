import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bulb,
  Check,
  Close,
  Flame,
  Refresh,
  Trophy,
} from "../components/icons";
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
      ? "border-marigold-500 bg-marigold-100"
      : "border-line bg-paper-card hover:border-ink-300 hover:bg-paper";
  }
  const isCorrect = result.correctOptionIds.includes(option._id);
  if (isCorrect) return "border-right-500 bg-right-50";
  if (selectedId === option._id) return "border-wrong-500 bg-wrong-50";
  return "border-line bg-paper-card opacity-60";
};

// The letter sits in a round answer bubble, like an OMR sheet.
const bubbleStyle = (phase, option, selectedId, result) => {
  if (phase === "answered") {
    if (result.correctOptionIds.includes(option._id))
      return "border-right-500 bg-right-500 text-white";
    if (selectedId === option._id) return "border-wrong-500 bg-wrong-500 text-white";
    return "border-line-strong text-ink-400";
  }
  if (selectedId === option._id) return "border-marigold-500 bg-marigold-500 text-ink";
  return "border-ink-300 text-ink-700 group-hover:border-ink";
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

  // Keyboard shortcuts: 1 to 9 or A to H to answer, Enter or the right arrow
  // key for the next question.
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
      toast("Progress reset. Every question is available again.");
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

  const kbd = (k) => <kbd className="kbd">{k}</kbd>;

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-20">
      <div className="container-page max-w-3xl pt-8">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4">
          <Link
            to={`/courses/${courseId}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{subject.courseId?.name || "Back"}</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            {session.streak >= 2 && (
              <span className="badge bg-marigold-100 text-marigold-700">
                <Flame className="h-3.5 w-3.5" /> {session.streak} in a row
              </span>
            )}
            <span className="badge bg-paper-sunk font-mono font-medium text-ink-700">
              {session.correct}/{session.answered} this session
            </span>
            {attempted > 0 && (
              <button
                onClick={() => setConfirmReset(true)}
                className="icon-btn"
                title="Reset progress"
                aria-label="Reset progress"
              >
                <Refresh className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-end justify-between gap-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              {subject.name}
            </h1>
            <span className="shrink-0 font-mono text-xs text-ink-500">
              {Math.min(attempted, total)} of {total} answered
            </span>
          </div>
          <ProgressBar value={attempted} max={total} className="mt-3" />
        </div>

        {/* Body */}
        {phase === "loading" ? (
          <div className="card mt-8 flex items-center justify-center py-24">
            <Spinner className="h-7 w-7 text-ink" />
          </div>
        ) : phase === "done" ? (
          <div className="card mt-8 animate-fade-up px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-marigold-100 text-marigold-700">
              <Trophy className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-ink">
              {total === 0 ? "No questions yet" : "Subject complete"}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-ink-500">
              {total === 0
                ? "There aren't any questions in this subject yet. Check back soon."
                : session.answered > 0
                ? `You got ${session.correct} of ${session.answered} right this session (${accuracy}%). You've answered every question in ${subject.name}.`
                : `You've already answered every question in ${subject.name}.`}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              {total > 0 && (
                <button className="btn-primary" onClick={() => setConfirmReset(true)}>
                  <Refresh className="h-4 w-4" /> Practise again
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
              <p className="eyebrow">
                Question {Math.min(attempted + (phase === "answered" ? 0 : 1), total)}
              </p>
              <h2 className="mt-3 font-sans text-lg font-semibold leading-relaxed text-ink sm:text-xl">
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
                      className={`group flex w-full items-center gap-4 rounded-lg border p-3.5 text-left transition-colors disabled:cursor-default ${optionStyle(
                        phase,
                        option,
                        selectedId,
                        result
                      )}`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[1.5px] font-mono text-sm font-medium transition-colors ${bubbleStyle(
                          phase,
                          option,
                          selectedId,
                          result
                        )}`}
                      >
                        {isRight ? (
                          <Check className="h-4 w-4" />
                        ) : isWrong ? (
                          <Close className="h-4 w-4" />
                        ) : (
                          LETTERS[i]
                        )}
                      </span>
                      <span className="flex-1 font-medium text-ink">{option.option_text}</span>
                      {phase === "submitting" && selectedId === option._id && (
                        <Spinner className="h-4 w-4 text-ink" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {phase === "answered" && (
              <div className="mt-4 animate-fade-up">
                <div
                  className={`rounded-xl border p-5 ${
                    result.isCorrect
                      ? "border-right-200 bg-right-50"
                      : "border-wrong-200 bg-wrong-50"
                  }`}
                >
                  <p
                    className={`flex items-center gap-2 font-bold ${
                      result.isCorrect ? "text-right-700" : "text-wrong-700"
                    }`}
                  >
                    {result.isCorrect ? (
                      <>
                        <Check className="h-5 w-5" /> Correct
                      </>
                    ) : (
                      <>
                        <Close className="h-5 w-5" /> Not quite
                      </>
                    )}
                  </p>
                  {result.explanation && (
                    <div className="mt-3 flex gap-3 rounded-lg bg-paper-card/80 p-4 text-sm leading-relaxed text-ink-700">
                      <Bulb className="mt-0.5 h-4 w-4 shrink-0 text-marigold-700" />
                      <p>{result.explanation}</p>
                    </div>
                  )}
                </div>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <p className="hidden text-xs text-ink-500 sm:block">
                    Press {kbd("Enter")} to continue
                  </p>
                  <button className="btn-primary ml-auto px-6" onClick={loadNext} autoFocus>
                    Next question
                  </button>
                </div>
              </div>
            )}

            {phase === "question" && (
              <p className="mt-4 hidden text-center text-xs text-ink-500 sm:block">
                Press {kbd("A")} to {kbd(LETTERS[question.options.length - 1])} or{" "}
                {kbd("1")} to {kbd(question.options.length)} to answer
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
