import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Library, Pencil, Plus, Trash2 } from "lucide-react";
import { api, errorMessage } from "../../api";
import useFetch from "../../lib/useFetch";
import { initials, paletteFor, plural } from "../../lib/palette";
import Spinner, { PageLoader } from "../../components/ui/Spinner";
import { EmptyState, ErrorState } from "../../components/ui/States";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { useToast } from "../../components/ui/Toast";
import PageHeader from "./PageHeader";

const emptyForm = { name: "", courseDescription: "" };

const ManageCourses = () => {
  const toast = useToast();
  const { data: courses, loading, error, reload } = useFetch(api.getCourses);

  // editing: null (closed), "new", or a course object
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [busyDelete, setBusyDelete] = useState(false);

  const openForm = (course) => {
    setEditing(course || "new");
    setForm(
      course
        ? { name: course.name, courseDescription: course.courseDescription }
        : emptyForm
    );
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing === "new") {
        await api.addCourse(form);
        toast("Course created");
      } else {
        await api.updateCourse(editing._id, form);
        toast("Course updated");
      }
      setEditing(null);
      reload();
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    setBusyDelete(true);
    try {
      await api.deleteCourse(deleting._id);
      toast("Course deleted");
      setDeleting(null);
      reload();
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setBusyDelete(false);
    }
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Dashboard", to: "/admin" }, { label: "Courses" }]}
        title="Courses"
        subtitle="Top-level exams or programmes, each containing subjects."
        actions={
          <button className="btn-primary" onClick={() => openForm(null)}>
            <Plus className="h-4 w-4" /> New course
          </button>
        }
      />

      {loading ? (
        <PageLoader />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : courses.length === 0 ? (
        <EmptyState
          icon={Library}
          title="No courses yet"
          message="Create a course such as “IOE Entrance” to start building your question bank."
          action={
            <button className="btn-primary" onClick={() => openForm(null)}>
              <Plus className="h-4 w-4" /> New course
            </button>
          }
        />
      ) : (
        <ul className="card divide-y divide-slate-100">
          {courses.map((course, i) => {
            const p = paletteFor(i);
            return (
              <li key={course._id} className="flex items-center gap-2 pr-3">
                <Link
                  to={`/admin/courses/${course._id}`}
                  className="group flex min-w-0 flex-1 items-center gap-4 px-5 py-4"
                >
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${p.bg} ${p.text}`}>
                    {initials(course.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 group-hover:text-brand-700">
                      {course.name}
                    </p>
                    <p className="truncate text-sm text-slate-500">{course.courseDescription}</p>
                    <p className="mt-1 text-xs font-medium text-slate-400">
                      {plural(course.subjectCount, "subject")} · {plural(course.questionCount, "question")}
                    </p>
                  </div>
                  <ChevronRight className="hidden h-4 w-4 text-slate-400 sm:block" />
                </Link>
                <button className="icon-btn" onClick={() => openForm(course)} aria-label={`Edit ${course.name}`}>
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  className="icon-btn hover:bg-rose-50 hover:text-rose-600"
                  onClick={() => setDeleting(course)}
                  aria-label={`Delete ${course.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <Modal
        open={editing !== null}
        onClose={() => !saving && setEditing(null)}
        title={editing === "new" ? "New course" : "Edit course"}
      >
        <form onSubmit={save} className="space-y-4">
          <div>
            <label htmlFor="course-name" className="label">Name</label>
            <input
              id="course-name"
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. IOE Entrance"
              required
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="course-desc" className="label">Description</label>
            <textarea
              id="course-desc"
              className="input min-h-[96px]"
              value={form.courseDescription}
              onChange={(e) => setForm({ ...form, courseDescription: e.target.value })}
              placeholder="What does this course cover?"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setEditing(null)} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving && <Spinner className="h-4 w-4" />}
              {editing === "new" ? "Create course" : "Save changes"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete course?"
        message={
          deleting &&
          `“${deleting.name}” and all of its ${plural(deleting.subjectCount, "subject")} and ${plural(deleting.questionCount, "question")} will be permanently deleted.`
        }
        busy={busyDelete}
        onConfirm={remove}
        onClose={() => setDeleting(null)}
      />
    </>
  );
};

export default ManageCourses;
