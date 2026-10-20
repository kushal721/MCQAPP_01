import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Check, Plus, X } from "lucide-react";
import { api, errorMessage } from "../../api";
import Spinner, { PageLoader } from "../../components/ui/Spinner";
import { ErrorState } from "../../components/ui/States";
import { useToast } from "../../components/ui/Toast";
import PageHeader from "./PageHeader";

const LETTERS = "ABCDEF";
const MIN_OPTIONS = 2;
const MAX_OPTIONS = 6;

const blankOptions = () => ["", "", "", ""].map((option_text) => ({ option_text }));

const QuestionForm = () => {
  const { questionId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = Boolean(questionId);

  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState(searchParams.get("subjectId") || "");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(blankOptions);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [explanation, setExplanation] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Load courses, plus the question (edit) or the preselected subject (new).
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setLoadError("");
      try {
        setCourses(await api.getCourses());
        let initialSubject = searchParams.get("subjectId");

        if (isEdit) {
          const q = await api.getQuestion(questionId);
          initialSubject = q.subject_id;
          setQuestionText(q.question_text);
          setOptions(q.options.map(({ option_text }) => ({ option_text })));
          const idx = q.options.findIndex((o) => o.is_correct);
          setCorrectIndex(idx >= 0 ? idx : null);
          setExplanation(q.explanation || "");
        }

        if (initialSubject) {
          const subject = await api.getSubject(initialSubject);
          setCourseId(subject.courseId?._id || "");
          setSubjectId(subject._id);
        }
      } catch (error) {
        setLoadError(errorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  useEffect(() => {
    if (!courseId) {
      setSubjects([]);
      return;
    }
    api
      .getSubjects(courseId)
      .then(setSubjects)
      .catch((error) => toast(errorMessage(error), "error"));
  }, [courseId, toast]);

  const updateOption = (index, value) =>
    setOptions((list) => list.map((o, i) => (i === index ? { option_text: value } : o)));

  const removeOption = (index) => {
    setOptions((list) => list.filter((_, i) => i !== index));
    if (correctIndex === index) setCorrectIndex(null);
    else if (correctIndex > index) setCorrectIndex(correctIndex - 1);
  };

  const resetForNext = () => {
    setQuestionText("");
    setOptions(blankOptions());
    setCorrectIndex(null);
    setExplanation("");
  };

  const submit = async (e, addAnother = false) => {
    e.preventDefault();
    setFormError("");
    if (!subjectId) return setFormError("Choose a course and subject.");
    if (options.some((o) => !o.option_text.trim()))
      return setFormError("Fill in every option or remove the empty ones.");
    if (correctIndex === null) return setFormError("Mark the correct answer.");

    const body = {
      subject_id: subjectId,
      question_text: questionText.trim(),
      options: options.map((o, i) => ({
        option_text: o.option_text.trim(),
        is_correct: i === correctIndex,
      })),
      explanation: explanation.trim(),
    };

    setSaving(true);
    try {
      if (isEdit) {
        await api.updateQuestion(questionId, body);
        toast("Question updated");
        navigate(`/admin/subjects/${subjectId}`);
      } else {
        await api.addQuestion(body);
        toast("Question added");
        if (addAnother) {
          resetForNext();
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          navigate(`/admin/subjects/${subjectId}`);
        }
      }
    } catch (error) {
      setFormError(errorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;
  if (loadError) return <ErrorState message={loadError} />;

  const subjectName = subjects.find((s) => s._id === subjectId)?.name;

  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Dashboard", to: "/admin" },
          ...(subjectName ? [{ label: subjectName, to: `/admin/subjects/${subjectId}` }] : []),
          { label: isEdit ? "Edit question" : "New question" },
        ]}
        title={isEdit ? "Edit question" : "Add question"}
        subtitle="Write the question, add its options and mark the correct answer."
      />

      <form onSubmit={submit} className="space-y-6">
        <section className="card grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
          <div>
            <label htmlFor="course" className="label">Course</label>
            <select
              id="course"
              className="input"
              value={courseId}
              onChange={(e) => {
                setCourseId(e.target.value);
                setSubjectId("");
              }}
              required
            >
              <option value="">Select course</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="subject" className="label">Subject</label>
            <select
              id="subject"
              className="input"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              disabled={!courseId}
              required
            >
              <option value="">{courseId ? "Select subject" : "Choose a course first"}</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="card space-y-5 p-5 sm:p-6">
          <div>
            <label htmlFor="question" className="label">Question</label>
            <textarea
              id="question"
              className="input min-h-[96px] text-base"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="e.g. What is the SI unit of force?"
              required
            />
          </div>

          <fieldset>
            <legend className="label">
              Options{" "}
              <span className="font-normal text-slate-400">— click the circle to mark the correct one</span>
            </legend>
            <div className="space-y-2.5">
              {options.map((option, i) => {
                const correct = correctIndex === i;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 rounded-xl border-2 p-2 pl-3 transition ${
                      correct ? "border-emerald-400 bg-emerald-50/60" : "border-slate-200 bg-white"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setCorrectIndex(i)}
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition ${
                        correct
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-slate-300 text-transparent hover:border-emerald-400"
                      }`}
                      aria-label={`Mark option ${LETTERS[i]} as correct`}
                      aria-pressed={correct}
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <span className="w-4 text-sm font-bold text-slate-400">{LETTERS[i]}</span>
                    <input
                      className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                      value={option.option_text}
                      onChange={(e) => updateOption(i, e.target.value)}
                      placeholder={`Option ${LETTERS[i]}`}
                      aria-label={`Option ${LETTERS[i]}`}
                      required
                    />
                    {options.length > MIN_OPTIONS && (
                      <button
                        type="button"
                        onClick={() => removeOption(i)}
                        className="icon-btn h-8 w-8"
                        aria-label={`Remove option ${LETTERS[i]}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {options.length < MAX_OPTIONS && (
              <button
                type="button"
                onClick={() => setOptions((list) => [...list, { option_text: "" }])}
                className="btn-ghost mt-3 px-3 py-2"
              >
                <Plus className="h-4 w-4" /> Add option
              </button>
            )}
          </fieldset>

          <div>
            <label htmlFor="explanation" className="label">
              Explanation <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="explanation"
              className="input min-h-[80px]"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Why is this the right answer? Shown to students after they answer."
            />
          </div>
        </section>

        {formError && (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {formError}
          </p>
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)} disabled={saving}>
            Cancel
          </button>
          {!isEdit && (
            <button
              type="button"
              className="btn-secondary"
              disabled={saving}
              onClick={(e) => {
                const form = e.currentTarget.form;
                if (form.reportValidity()) submit(e, true);
              }}
            >
              Save & add another
            </button>
          )}
          <button type="submit" className="btn-primary px-6" disabled={saving}>
            {saving && <Spinner className="h-4 w-4" />}
            {isEdit ? "Save changes" : "Save question"}
          </button>
        </div>
      </form>
    </>
  );
};

export default QuestionForm;
