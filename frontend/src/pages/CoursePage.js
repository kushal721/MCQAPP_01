import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Trophy } from "lucide-react";
import { api } from "../api";
import useFetch from "../lib/useFetch";
import { getClientId } from "../lib/clientId";
import { initials, paletteFor, plural } from "../lib/palette";
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
      <section className="border-b border-slate-200 bg-white">
        <div className="container-page py-10 sm:py-14">
          <Link
            to="/#courses"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" /> All courses
          </Link>
          <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {course.name}
              </h1>
              <p className="mt-3 text-slate-500">{course.courseDescription}</p>
            </div>
            <dl className="grid grid-cols-3 gap-3 sm:gap-4">
              {[
                ["Subjects", subjects.length],
                ["Answered", `${totals.attempted}/${totals.questions}`],
                ["Accuracy", accuracy === null ? "—" : `${accuracy}%`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-slate-50 px-4 py-3 sm:px-5">
                  <dt className="text-xs font-medium text-slate-500">{label}</dt>
                  <dd className="mt-0.5 text-xl font-extrabold text-slate-900">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="container-page pt-10">
        <h2 className="mb-5 text-lg font-bold text-slate-900">Subjects</h2>
        {subjects.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No subjects yet"
            message="This course doesn't have any subjects to practise yet."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject, i) => {
              const p = paletteFor(i);
              const { attempted = 0, correct = 0 } = progress[subject._id] || {};
              const total = subject.questionCount;
              const done = total > 0 && attempted >= total;
              const cta =
                total === 0
                  ? "No questions yet"
                  : done
                  ? "Completed — review"
                  : attempted > 0
                  ? "Continue"
                  : "Start practice";

              return (
                <Link
                  key={subject._id}
                  to={`/courses/${courseId}/subjects/${subject._id}`}
                  className={`card group flex animate-fade-up flex-col p-6 ring-4 ring-transparent transition hover:-translate-y-0.5 hover:shadow-lg ${p.ring}`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-extrabold ${p.bg} ${p.text}`}
                    >
                      {initials(subject.name)}
                    </div>
                    {done && (
                      <span className="badge bg-emerald-50 text-emerald-700">
                        <Trophy className="h-3.5 w-3.5" /> Done
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">{subject.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {plural(total, "question")}
                    {attempted > 0 && (
                      <>
                        {" · "}
                        <span className="inline-flex items-center gap-1 text-emerald-600">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {correct} correct
                        </span>
                      </>
                    )}
                  </p>
                  <div className="mt-5">
                    <div className="mb-1.5 flex justify-between text-xs font-medium text-slate-500">
                      <span>Progress</span>
                      <span>
                        {Math.min(attempted, total)}/{total}
                      </span>
                    </div>
                    <ProgressBar value={attempted} max={total} />
                  </div>
                  <div
                    className={`mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-semibold ${p.text}`}
                  >
                    {cta}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default CoursePage;
