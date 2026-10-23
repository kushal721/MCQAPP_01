import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Bulb, Check, Pencil, Plus, QuestionPage, Search, Trash } from "../../components/icons";
import { api, errorMessage } from "../../api";
import useFetch from "../../lib/useFetch";
import { plural } from "../../lib/format";
import { PageLoader } from "../../components/ui/Spinner";
import { EmptyState, ErrorState } from "../../components/ui/States";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { useToast } from "../../components/ui/Toast";
import PageHeader from "./PageHeader";

const LETTERS = "ABCDEFGH";

const ManageQuestions = () => {
  const { subjectId } = useParams();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [busyDelete, setBusyDelete] = useState(false);

  const { data, loading, error, reload } = useFetch(async () => {
    const [subject, questions] = await Promise.all([
      api.getSubject(subjectId),
      api.getQuestions(subjectId),
    ]);
    return { subject, questions };
  }, [subjectId]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    if (!q) return data.questions;
    return data.questions.filter(
      (question) =>
        question.question_text.toLowerCase().includes(q) ||
        question.options.some((o) => o.option_text.toLowerCase().includes(q))
    );
  }, [data, query]);

  const remove = async () => {
    setBusyDelete(true);
    try {
      await api.deleteQuestion(deleting._id);
      toast("Question deleted");
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

  const { subject, questions } = data;
  const course = subject.courseId;
  const addLink = `/admin/questions/new?subjectId=${subjectId}`;

  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Courses", to: "/admin/courses" },
          { label: course?.name, to: `/admin/courses/${course?._id}` },
          { label: subject.name },
        ]}
        title={subject.name}
        subtitle={plural(questions.length, "question")}
        actions={
          <Link to={addLink} className="btn-primary">
            <Plus className="h-4 w-4" /> Add question
          </Link>
        }
      />

      {questions.length === 0 ? (
        <EmptyState
          icon={QuestionPage}
          title="No questions yet"
          message={`Add the first multiple-choice question for ${subject.name}.`}
          action={
            <Link to={addLink} className="btn-primary">
              <Plus className="h-4 w-4" /> Add question
            </Link>
          }
        />
      ) : (
        <>
          <div className="relative mb-5 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="search"
              className="input pl-10"
              placeholder="Search questions or options…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {filtered.length === 0 ? (
            <p className="card px-6 py-10 text-center text-sm text-ink-500">
              No questions match “{query}”.
            </p>
          ) : (
            <ol className="space-y-4">
              {filtered.map((question) => (
                <li key={question._id} className="card p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 min-w-[1.75rem] shrink-0 items-center justify-center rounded-lg bg-paper-sunk px-1.5 text-xs font-bold text-ink-700">
                      {questions.indexOf(question) + 1}
                    </span>
                    <p className="flex-1 font-semibold leading-relaxed text-ink">
                      {question.question_text}
                    </p>
                    <div className="-mr-2 -mt-1 flex shrink-0">
                      <Link
                        to={`/admin/questions/${question._id}/edit`}
                        className="icon-btn"
                        aria-label="Edit question"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        className="icon-btn hover:bg-wrong-50 hover:text-wrong-500"
                        onClick={() => setDeleting(question)}
                        aria-label="Delete question"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {question.options.map((option, i) => (
                      <li
                        key={option._id}
                        className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-sm ${
                          option.is_correct
                            ? "border-right-200 bg-right-50 font-semibold text-right-700"
                            : "border-line text-ink-700"
                        }`}
                      >
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                            option.is_correct ? "bg-right-500 text-white" : "bg-paper-sunk text-ink-500"
                          }`}
                        >
                          {option.is_correct ? <Check className="h-3.5 w-3.5" /> : LETTERS[i]}
                        </span>
                        {option.option_text}
                      </li>
                    ))}
                  </ul>

                  {question.explanation && (
                    <p className="mt-4 flex gap-2 rounded-xl bg-marigold-100/60 p-3 text-sm text-ink-700">
                      <Bulb className="mt-0.5 h-4 w-4 shrink-0 text-marigold-700" />
                      {question.explanation}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Delete question?"
        message={deleting && `“${deleting.question_text}” will be permanently deleted.`}
        busy={busyDelete}
        onConfirm={remove}
        onClose={() => setDeleting(null)}
      />
    </>
  );
};

export default ManageQuestions;
