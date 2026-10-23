import React from "react";
import { Link } from "react-router-dom";
import { Book, ChevronRight } from "../components/icons";
import { api } from "../api";
import useFetch from "../lib/useFetch";
import { initials, plural } from "../lib/format";
import { ErrorState, EmptyState } from "../components/ui/States";
import TryQuestion from "../components/TryQuestion";

const steps = [
  {
    title: "Pick a course and a subject",
    text: "Courses match the exam you're sitting. Subjects let you work on one weak area at a time.",
  },
  {
    title: "Answer questions you haven't seen",
    text: "Each question is drawn at random from the ones you haven't answered in that subject yet.",
  },
  {
    title: "Read why the answer is right",
    text: "As soon as you choose, the correct option and its explanation appear.",
  },
  {
    title: "Pick up where you left off",
    text: "Progress is kept on this device. Reset a subject whenever you want to go through it again.",
  },
];

const CourseRowSkeleton = () => (
  <li className="flex animate-pulse items-center gap-4 px-5 py-5">
    <div className="h-11 w-11 rounded-lg bg-paper-sunk" />
    <div className="flex-1 space-y-2">
      <div className="h-4 w-1/4 rounded bg-paper-sunk" />
      <div className="h-3 w-2/3 rounded bg-paper-sunk" />
    </div>
  </li>
);

const Home = () => {
  const { data: courses, loading, error, reload } = useFetch(api.getCourses);

  const totalQuestions = (courses || []).reduce(
    (sum, c) => sum + (c.questionCount || 0),
    0
  );

  return (
    <>
      {/* Hero with a working sample question */}
      <section className="border-b border-line">
        <div className="container-page grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div>
            <p className="eyebrow">IOE · IOM · Loksewa</p>
            <h1 className="mt-4 max-w-xl text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Entrance exam practice that remembers what you've answered.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-700 sm:text-lg">
              Choose a subject and work through questions you haven't seen yet.
              After every answer you get the correct option and a short
              explanation.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link to="/#courses" className="btn-primary px-5 py-3 text-base">
                Browse courses
              </Link>
              {courses && courses.length > 0 && (
                <p className="font-mono text-sm text-ink-500">
                  {plural(courses.length, "course")} · {plural(totalQuestions, "question")}
                </p>
              )}
            </div>
          </div>

          <TryQuestion />
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="scroll-mt-16 py-16 sm:py-20">
        <div className="container-page">
          <div className="mb-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Courses</h2>
            <p className="text-ink-500">Each course is split into subjects.</p>
          </div>

          {loading ? (
            <ul className="card divide-y divide-line">
              {[0, 1, 2].map((i) => (
                <CourseRowSkeleton key={i} />
              ))}
            </ul>
          ) : error ? (
            <ErrorState message={error} onRetry={reload} />
          ) : courses.length === 0 ? (
            <EmptyState
              icon={Book}
              title="No courses yet"
              message="Courses added from the admin panel will show up here."
              action={
                <Link to="/admin/courses" className="btn-primary">
                  Add a course
                </Link>
              }
            />
          ) : (
            <ul className="card divide-y divide-line overflow-hidden">
              {courses.map((course) => (
                <li key={course._id}>
                  <Link
                    to={`/courses/${course._id}`}
                    className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-1 px-5 py-5 transition-colors hover:bg-paper sm:grid-cols-[auto_1fr_auto_auto] sm:gap-x-6"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-line-strong font-mono text-sm font-medium text-ink">
                      {initials(course.name)}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-ink">{course.name}</h3>
                      <p className="line-clamp-1 text-sm text-ink-500">
                        {course.courseDescription}
                      </p>
                    </div>
                    <p className="col-start-2 font-mono text-xs text-ink-500 sm:col-start-auto">
                      {plural(course.subjectCount || 0, "subject")} ·{" "}
                      {plural(course.questionCount || 0, "question")}
                    </p>
                    <ChevronRight className="col-start-3 row-span-2 row-start-1 h-5 w-5 text-ink-400 transition-colors group-hover:text-ink sm:col-start-auto sm:row-span-1" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-16 border-t border-line bg-paper-sunk/50 py-16 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              How practice works
            </h2>
            <p className="mt-3 max-w-sm text-ink-500">
              No sign-up. Keyboard users can answer with{" "}
              <span className="kbd">A</span> to <span className="kbd">F</span> and move on with{" "}
              <span className="kbd">Enter</span>.
            </p>
          </div>
          <ol className="divide-y divide-line border-y border-line">
            {steps.map(({ title, text }, i) => (
              <li key={title} className="grid grid-cols-[3rem_1fr] gap-2 py-5">
                <span className="font-mono text-sm text-marigold-700">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-sans text-base font-semibold text-ink">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-500">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
};

export default Home;
