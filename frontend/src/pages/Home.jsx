import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Layers,
  Lightbulb,
  Sparkles,
  Target,
} from "lucide-react";
import { api } from "../api";
import useFetch from "../lib/useFetch";
import { initials, paletteFor, plural } from "../lib/palette";
import { ErrorState, EmptyState } from "../components/ui/States";

const steps = [
  {
    icon: Layers,
    title: "Pick a course",
    text: "Choose the exam you're preparing for and drill into a subject.",
  },
  {
    icon: Target,
    title: "Answer questions",
    text: "Get a fresh, random question each time — never one you've already done.",
  },
  {
    icon: Lightbulb,
    title: "Learn instantly",
    text: "See the correct answer and a clear explanation right after you pick.",
  },
];

const CourseSkeleton = () => (
  <div className="card animate-pulse p-6">
    <div className="h-12 w-12 rounded-xl bg-slate-100" />
    <div className="mt-5 h-5 w-1/2 rounded bg-slate-100" />
    <div className="mt-3 h-4 w-full rounded bg-slate-100" />
    <div className="mt-2 h-4 w-2/3 rounded bg-slate-100" />
  </div>
);

const Home = () => {
  const { data: courses, loading, error, reload } = useFetch(api.getCourses);

  const totalQuestions = (courses || []).reduce(
    (sum, c) => sum + (c.questionCount || 0),
    0
  );

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-600/30 blur-3xl" />
          <div className="absolute -bottom-40 right-0 h-[28rem] w-[28rem] rounded-full bg-violet-600/25 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>

        <div className="container-page relative py-20 text-center sm:py-28">
          <span className="badge mx-auto border border-white/10 bg-white/5 px-3 py-1 text-brand-200">
            <Sparkles className="h-3.5 w-3.5" /> Exam prep, made focused
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            Master every subject,{" "}
            <span className="bg-gradient-to-r from-brand-300 to-violet-300 bg-clip-text text-transparent">
              one question at a time
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-slate-300 sm:text-lg">
            Practise multiple-choice questions for entrance and competitive
            exams, with instant feedback and explanations for every answer.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/#courses" className="btn-primary px-6 py-3 text-base">
              Browse courses <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/#how-it-works"
              className="btn px-6 py-3 text-base text-slate-200 hover:bg-white/10"
            >
              How it works
            </Link>
          </div>

          {courses && courses.length > 0 && (
            <dl className="mx-auto mt-14 grid max-w-lg grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
              <div className="bg-slate-950/60 px-6 py-5">
                <dt className="text-sm text-slate-400">Courses</dt>
                <dd className="mt-1 text-3xl font-extrabold text-white">
                  {courses.length}
                </dd>
              </div>
              <div className="bg-slate-950/60 px-6 py-5">
                <dt className="text-sm text-slate-400">Questions</dt>
                <dd className="mt-1 text-3xl font-extrabold text-white">
                  {totalQuestions}
                </dd>
              </div>
            </dl>
          )}
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="scroll-mt-16 py-16 sm:py-20">
        <div className="container-page">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-wider text-brand-600">
              Courses
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
              Choose what to practise
            </h2>
            <p className="mt-2 text-slate-500">
              Each course is split into subjects so you can focus on your weak
              spots.
            </p>
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <CourseSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <ErrorState message={error} onRetry={reload} />
          ) : courses.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No courses yet"
              message="Courses added from the admin panel will show up here."
              action={
                <Link to="/admin/courses" className="btn-primary">
                  Add a course
                </Link>
              }
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, i) => {
                const p = paletteFor(i);
                return (
                  <Link
                    key={course._id}
                    to={`/courses/${course._id}`}
                    className={`card group flex animate-fade-up flex-col p-6 ring-4 ring-transparent transition hover:-translate-y-0.5 hover:shadow-lg ${p.ring}`}
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl text-base font-extrabold ${p.bg} ${p.text}`}
                    >
                      {initials(course.name)}
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                      {course.name}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500">
                      {course.courseDescription}
                    </p>
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                      <span className="text-slate-500">
                        {plural(course.subjectCount || 0, "subject")} ·{" "}
                        {plural(course.questionCount || 0, "question")}
                      </span>
                      <ArrowRight
                        className={`h-4 w-4 transition group-hover:translate-x-1 ${p.text}`}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-16 border-t border-slate-200 bg-white py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-brand-600">
              How it works
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
              Built for focused practice
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="relative rounded-2xl bg-slate-50 p-6">
                <span className="absolute right-6 top-6 text-5xl font-extrabold text-slate-200/70">
                  {i + 1}
                </span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-bold text-slate-900">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{text}</p>
              </div>
            ))}
          </div>
          <ul className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-slate-600">
            {[
              "Progress saved automatically",
              "Keyboard shortcuts",
              "Works on mobile",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {f}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default Home;
