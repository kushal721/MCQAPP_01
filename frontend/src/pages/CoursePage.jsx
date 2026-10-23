import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Book, Trophy } from "../components/icons";
import { api } from "../api";
import useFetch from "../lib/useFetch";
import { getClientId } from "../lib/clientId";
import { plural } from "../lib/format";
import { PageLoader } from "../components/ui/Spinner";
import { EmptyState, ErrorState } from "../components/ui/States";
import ProgressBar from "../components/ui/ProgressBar";

const CoursePage = () => {
  const { courseId } = useParams();

  const { data, loading, error, reload } = useFetch(async () => {
    const [course, subjects, progress] = await Promise.all([
      api.getCourse(courseId),
      api.getSubjects(courseId),
      api.getProgress(courseId, getClientId()),
    ]);
    return { course, subjects, progress };
  }, [courseId]);

  if (loading) return <PageLoader />;
  if (error)
    return (
      <div className="container-page py-16">
        <ErrorState message={error} onRetry={reload} />
      </div>
    );

  const { course, subjects, progress } = data;
  const totals = subjects.reduce(
    (acc, s) => {
      const p = progress[s._id] || { attempted: 0, correct: 0 };
      acc.questions += s.questionCount;
      acc.attempted += p.attempted;
      acc.correct += p.correct;
      return acc;
    },
    { questions: 0, attempted: 0, correct: 0 }
  );
  const accuracy = totals.attempted
    ? Math.round((totals.correct / totals.attempted) * 100)
    : null;

  return (
    <div className="pb-20">
      <section className="border-b border-line">
        <div className="container-page py-10 sm:py-14">
          <Link
            to="/#courses"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" /> All courses
          </Link>
          <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
                {course.name}
              </h1>
              <p className="mt-3 text-ink-700">{course.courseDescription}</p>
            </div>
            <dl className="flex divide-x divide-line">
              {[
                ["Subjects", subjects.length],
                ["Answered", `${totals.attempted}/${totals.questions}`],
                ["Accuracy", accuracy === null ? "n/a" : `${accuracy}%`],
              ].map(([label, value]) => (
                <div key={label} className="px-5 first:pl-0 last:pr-0">
                  <dt className="eyebrow">{label}</dt>
                  <dd className="mt-1 font-display text-2xl font-bold text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="container-page pt-10">
        <h2 className="mb-5 text-xl font-bold text-ink">Subjects</h2>
        {subjects.length === 0 ? (
          <EmptyState
            icon={Book}
            title="No subjects yet"
            message="This course doesn't have any subjects to practise yet."
          />
        ) : (
          <ul className="card divide-y divide-line overflow-hidden">
            {subjects.map((subject) => {
              const { attempted = 0, correct = 0 } = progress[subject._id] || {};
              const total = subject.questionCount;
              const done = total > 0 && attempted >= total;
              const cta =
                total === 0
                  ? "No questions yet"
                  : done
                  ? "Review"
                  : attempted > 0
                  ? "Continue"
                  : "Start";

              return (
                <li key={subject._id}>
                  <Link
                    to={`/courses/${courseId}/subjects/${subject._id}`}
                    className="group grid items-center gap-4 px-5 py-5 transition-colors hover:bg-paper sm:grid-cols-[1fr_14rem_7rem] sm:gap-8"
                  >
                    <div className="min-w-0">
                      <h3 className="flex items-center gap-2 text-lg font-bold text-ink">
                        {subject.name}
                        {done && (
                          <span className="badge bg-right-50 font-sans text-right-700">
                            <Trophy className="h-3.5 w-3.5" /> Done
                          </span>
                        )}
                      </h3>
                      <p className="mt-0.5 text-sm text-ink-500">
                        {plural(total, "question")}
                        {attempted > 0 && ` · ${correct} correct`}
                      </p>
                    </div>
                    <div>
                      <div className="mb-1.5 flex justify-between font-mono text-xs text-ink-500">
                        <span>Progress</span>
                        <span>
                          {Math.min(attempted, total)}/{total}
                        </span>
                      </div>
                      <ProgressBar value={attempted} max={total} />
                    </div>
                    <span
                      className={`justify-self-start rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors sm:justify-self-end ${
                        total === 0
                          ? "border-line text-ink-400"
                          : "border-line-strong text-ink group-hover:border-ink group-hover:bg-ink group-hover:text-paper-card"
                      }`}
                    >
                      {cta}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};

export default CoursePage;
