import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  FileQuestion,
  Layers,
  Library,
  MousePointerClick,
  Plus,
} from "lucide-react";
import { api } from "../../api";
import useFetch from "../../lib/useFetch";
import { initials, paletteFor, plural } from "../../lib/palette";
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
    { label: "Courses", value: stats.courses, icon: Library, tone: "bg-brand-50 text-brand-600" },
    { label: "Subjects", value: stats.subjects, icon: Layers, tone: "bg-emerald-50 text-emerald-600" },
    { label: "Questions", value: stats.questions, icon: FileQuestion, tone: "bg-amber-50 text-amber-600" },
    { label: "Answers given", value: stats.attempts, icon: MousePointerClick, tone: "bg-rose-50 text-rose-600" },
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

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="card p-5">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
            <p className="text-3xl font-extrabold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="card mt-8">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="font-bold text-slate-900">Courses</h2>
          <Link to="/admin/courses" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            Manage all
          </Link>
        </div>
        {courses.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <BookOpen className="h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">No courses yet.</p>
            <Link to="/admin/courses" className="btn-primary mt-5">
              <Plus className="h-4 w-4" /> Create your first course
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {courses.map((course, i) => {
              const p = paletteFor(i);
              return (
                <li key={course._id}>
                  <Link
                    to={`/admin/courses/${course._id}`}
                    className="group flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50"
                  >
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-extrabold ${p.bg} ${p.text}`}>
                      {initials(course.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900">{course.name}</p>
                      <p className="text-sm text-slate-500">
                        {plural(course.subjectCount, "subject")} · {plural(course.questionCount, "question")}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-700" />
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
