import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, Layers, Pencil, Plus, Trash2 } from "lucide-react";
import { api, errorMessage } from "../../api";
import useFetch from "../../lib/useFetch";
import { initials, paletteFor, plural } from "../../lib/palette";
import Spinner, { PageLoader } from "../../components/ui/Spinner";
import { EmptyState, ErrorState } from "../../components/ui/States";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { useToast } from "../../components/ui/Toast";
import PageHeader from "./PageHeader";

const ManageSubjects = () => {
  const { courseId } = useParams();
  const toast = useToast();

  const { data, loading, error, reload } = useFetch(async () => {
    const [course, subjects] = await Promise.all([
      api.getCourse(courseId),
      api.getSubjects(courseId),
    ]);
    return { course, subjects };
  }, [courseId]);

  // editing: null (closed), "new", or a subject object
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [busyDelete, setBusyDelete] = useState(false);

  const openForm = (subject) => {
    setEditing(subject || "new");
    setName(subject ? subject.name : "");
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing === "new") {
        await api.addSubject({ name, courseId });
        toast("Subject created");
      } else {
        await api.updateSubject(editing._id, { name });
        toast("Subject updated");
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
      await api.deleteSubject(deleting._id);
      toast("Subject deleted");
      setDeleting(null);
      reload();
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setBusyDelete(false);
    }
  };

  if (loading && !data) return <PageLoader />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const { course, subjects } = data;

  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Dashboard", to: "/admin" },
          { label: "Courses", to: "/admin/courses" },
          { label: course.name },
        ]}
        title={course.name}
        subtitle={course.courseDescription}
        actions={
          <button className="btn-primary" onClick={() => openForm(null)}>
            <Plus className="h-4 w-4" /> New subject
          </button>
        }
      />

      {subjects.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No subjects yet"
          message="Split this course into subjects like Physics or Mathematics."
          action={
            <button className="btn-primary" onClick={() => openForm(null)}>
              <Plus className="h-4 w-4" /> New subject
            </button>
          }
        />
      ) : (
        <ul className="card divide-y divide-slate-100">
          {subjects.map((subject, i) => {
            const p = paletteFor(i);
            return (
              <li key={subject._id} className="flex items-center gap-2 pr-3">
                <Link
                  to={`/admin/subjects/${subject._id}`}
                  className="group flex min-w-0 flex-1 items-center gap-4 px-5 py-4"
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${p.bg} ${p.text}`}>
                    {initials(subject.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 group-hover:text-brand-700">
                      {subject.name}
                    </p>
                    <p className="text-sm text-slate-500">{plural(subject.questionCount, "question")}</p>
                  </div>
                  <ChevronRight className="hidden h-4 w-4 text-slate-400 sm:block" />
                </Link>
                <button className="icon-btn" onClick={() => openForm(subject)} aria-label={`Rename ${subject.name}`}>
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  className="icon-btn hover:bg-rose-50 hover:text-rose-600"
                  onClick={() => setDeleting(subject)}
                  aria-label={`Delete ${subject.name}`}
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
        title={editing === "new" ? `New subject in ${course.name}` : "Rename subject"}
        size="sm"
      >
        <form onSubmit={save} className="space-y-4">
          <div>
            <label htmlFor="subject-name" className="label">Subject name</label>
            <input
              id="subject-name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Physics"
              required
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setEditing(null)} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving && <Spinner className="h-4 w-4" />}
              {editing === "new" ? "Create subject" : "Save"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete subject?"
        message={
          deleting &&
          `“${deleting.name}” and its ${plural(deleting.questionCount, "question")} will be permanently deleted.`
        }
        busy={busyDelete}
        onConfirm={remove}
        onClose={() => setDeleting(null)}
      />
    </>
  );
};

export default ManageSubjects;
