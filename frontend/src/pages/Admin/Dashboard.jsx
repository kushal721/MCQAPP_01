import React from "react";
import { Link } from "react-router-dom";
import { Book, Books, CheckSquare, ChevronRight, Layers, Plus, QuestionPage } from "../../components/icons";
import { api } from "../../api";
import useFetch from "../../lib/useFetch";
import { initials, plural } from "../../lib/format";
import { PageLoader } from "../../components/ui/Spinner";
import { ErrorState } from "../../components/ui/States";
import PageHeader from "./PageHeader";

const Dashboard = () => {
  const { data, loading, error, reload } = useFetch(async () => {
    const [stats, courses] = await Promise.all([api.stats(), api.getCourses()]);
    return { stats, courses };
  });

  if (loading) return <PageLoader />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const { stats, courses } = data;
  const cards = [
    { label: "Courses", value: stats.courses, icon: Books },
    { label: "Subjects", value: stats.subjects, icon: Layers },
    { label: "Questions", value: stats.questions, icon: QuestionPage },
    { label: "Answers given", value: stats.attempts, icon: CheckSquare },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your question bank."
        actions={
          <Link to="/admin/questions/new" className="btn-primary">
            <Plus className="h-4 w-4" /> Add question
          </Link>
        }
      />

      {/* One strip of figures instead of a row of coloured cards. */}
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-paper-card px-5 py-5">
            <dt className="flex items-center gap-2 text-sm font-medium text-ink-500">
              <Icon className="h-4 w-4" /> {label}
            </dt>
            <dd className="mt-2 font-display text-3xl font-bold text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="card mt-8">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-bold text-ink">Courses</h2>
          <Link to="/admin/courses" className="text-sm font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
            Manage all
          </Link>
        </div>
        {courses.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <Book className="h-8 w-8 text-ink-300" />
            <p className="mt-3 text-sm text-ink-500">No courses yet.</p>
            <Link to="/admin/courses" className="btn-primary mt-5">
              <Plus className="h-4 w-4" /> Create your first course
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {courses.map((course, i) => {
              return (
                <li key={course._id}>
                  <Link
                    to={`/admin/courses/${course._id}`}
                    className="group flex items-center gap-4 px-5 py-4 transition hover:bg-paper"
                  >
                    <span className={`flex h-10 w-10 items-center justify-center rounded-lg border border-line-strong font-mono text-sm font-medium text-ink`}>
                      {initials(course.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-ink">{course.name}</p>
                      <p className="text-sm text-ink-500">
                        {plural(course.subjectCount, "subject")} · {plural(course.questionCount, "question")}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-ink-400 transition-colors group-hover:text-ink" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
};

export default Dashboard;
