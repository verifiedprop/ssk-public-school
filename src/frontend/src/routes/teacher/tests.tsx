import TeacherLayout from "@/components/portals/TeacherLayout";
import { useAuth } from "@/hooks/useAuth";
import { type MCQQuestion, useTeacherData } from "@/hooks/useTeacherData";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/teacher/tests")({
  component: TestsPage,
});

const BLANK_QUESTION = (): MCQQuestion => ({
  id: `q${Date.now()}`,
  question: "",
  options: [
    { id: "a", text: "" },
    { id: "b", text: "" },
    { id: "c", text: "" },
    { id: "d", text: "" },
  ],
  correctOptionId: "a",
});

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  published: "bg-green-100 text-green-700",
  closed: "bg-red-100 text-red-600",
};

function TestsPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const {
    tests,
    addTest,
    updateTestStatus,
    availableClasses,
    availableSubjects,
  } = useTeacherData();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [cls, setCls] = useState("");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState(30);
  const [passing, setPassing] = useState(40);
  const [questions, setQuestions] = useState<MCQQuestion[]>([BLANK_QUESTION()]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!currentUser || currentUser.role !== "teacher")
      void navigate({ to: "/login" as never });
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const addQuestion = () => setQuestions((prev) => [...prev, BLANK_QUESTION()]);
  const removeQuestion = (id: string) =>
    setQuestions((prev) => prev.filter((q) => q.id !== id));

  const updateQuestion = (
    id: string,
    field: "question" | "correctOptionId",
    value: string,
  ) =>
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q)),
    );

  const updateOption = (qId: string, optId: string, text: string) =>
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === optId ? { ...o, text } : o,
              ),
            }
          : q,
      ),
    );

  const handleCreate = (status: "draft" | "published") => {
    if (!title || !cls || !subject) return;
    addTest({
      title,
      class: cls,
      subject,
      durationMinutes: duration,
      passingPercent: passing,
      status,
      questions,
    });
    setTitle("");
    setCls("");
    setSubject("");
    setDuration(30);
    setPassing(40);
    setQuestions([BLANK_QUESTION()]);
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <TeacherLayout title="Mock Tests">
      <div className="space-y-6 max-w-4xl" data-ocid="teacher.tests.page">
        {saved && (
          <div
            className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm font-medium"
            data-ocid="teacher.tests.success_state"
          >
            ✅ Mock test saved successfully!
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1e3a5f]">
            Mock Tests ({tests.length})
          </h2>
          <button
            type="button"
            onClick={() => setShowForm((f) => !f)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-blue-950 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
            data-ocid="teacher.tests.create_button"
          >
            <Plus className="h-4 w-4" /> {showForm ? "Cancel" : "Create Test"}
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div
            className="bg-white rounded-xl border border-blue-100 shadow-sm p-6 space-y-5"
            data-ocid="teacher.tests.form"
          >
            <h3 className="font-bold text-[#1e3a5f]">New Mock Test</h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label
                  htmlFor="test-title"
                  className="block text-xs font-semibold text-gray-600 mb-1"
                >
                  Test Title *
                </label>
                <input
                  id="test-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chapter 5 — Quadratic Equations"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  data-ocid="teacher.tests.title_input"
                />
              </div>
              <div>
                <label
                  htmlFor="test-class"
                  className="block text-xs font-semibold text-gray-600 mb-1"
                >
                  Class *
                </label>
                <select
                  id="test-class"
                  value={cls}
                  onChange={(e) => setCls(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  data-ocid="teacher.tests.class_select"
                >
                  <option value="">Select class</option>
                  {availableClasses.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="test-subject"
                  className="block text-xs font-semibold text-gray-600 mb-1"
                >
                  Subject *
                </label>
                <select
                  id="test-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  data-ocid="teacher.tests.subject_select"
                >
                  <option value="">Select subject</option>
                  {availableSubjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="test-duration"
                  className="block text-xs font-semibold text-gray-600 mb-1"
                >
                  Duration (minutes)
                </label>
                <input
                  id="test-duration"
                  type="number"
                  value={duration}
                  min={5}
                  max={180}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  data-ocid="teacher.tests.duration_input"
                />
              </div>
              <div>
                <label
                  htmlFor="test-passing"
                  className="block text-xs font-semibold text-gray-600 mb-1"
                >
                  Passing %
                </label>
                <input
                  id="test-passing"
                  type="number"
                  value={passing}
                  min={1}
                  max={100}
                  onChange={(e) => setPassing(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  data-ocid="teacher.tests.passing_input"
                />
              </div>
            </div>

            {/* Questions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-[#1e3a5f] text-sm">
                  Questions ({questions.length})
                </h4>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
                  data-ocid="teacher.tests.add_question_button"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Question
                </button>
              </div>

              <div className="space-y-4">
                {questions.map((q, qi) => (
                  <div
                    key={q.id}
                    className="border border-gray-100 rounded-xl p-4 bg-gray-50"
                    data-ocid={`teacher.tests.question.${qi + 1}`}
                  >
                    <div className="flex items-start gap-2 mb-3">
                      <span className="text-xs font-bold text-gray-400 w-5 mt-2.5">
                        Q{qi + 1}
                      </span>
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) =>
                          updateQuestion(q.id, "question", e.target.value)
                        }
                        placeholder="Enter your question here..."
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(q.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Remove question"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 ml-5">
                      {q.options.map((opt) => (
                        <div key={opt.id} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${q.id}`}
                            value={opt.id}
                            checked={q.correctOptionId === opt.id}
                            onChange={() =>
                              updateQuestion(q.id, "correctOptionId", opt.id)
                            }
                            className="accent-green-500"
                            title="Mark as correct"
                          />
                          <span className="text-xs font-semibold text-gray-400 w-4">
                            {opt.id.toUpperCase()}.
                          </span>
                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) =>
                              updateOption(q.id, opt.id, e.target.value)
                            }
                            placeholder={`Option ${opt.id.toUpperCase()}`}
                            className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2 ml-5">
                      ● Radio button = correct answer
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleCreate("draft")}
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                data-ocid="teacher.tests.save_draft_button"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleCreate("published")}
                className="bg-[#1e3a5f] hover:bg-[#15304f] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                data-ocid="teacher.tests.publish_button"
              >
                Publish Test
              </button>
            </div>
          </div>
        )}

        {/* Tests List */}
        <div
          className="bg-white rounded-xl border border-blue-100 shadow-sm"
          data-ocid="teacher.tests.list"
        >
          {tests.length === 0 ? (
            <div
              className="p-12 text-center"
              data-ocid="teacher.tests.empty_state"
            >
              <p className="text-gray-400 text-sm">
                No tests yet. Create your first test above.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {tests.map((test, i) => (
                <div
                  key={test.id}
                  className="p-5"
                  data-ocid={`teacher.tests.item.${i + 1}`}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-[#1e3a5f] text-sm">
                          {test.title}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[test.status]}`}
                        >
                          {test.status.charAt(0).toUpperCase() +
                            test.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex gap-3 mt-1 text-xs text-gray-500">
                        <span>📚 {test.subject}</span>
                        <span>🏫 {test.class}</span>
                        <span>⏱ {test.durationMinutes} min</span>
                        <span>✅ Pass: {test.passingPercent}%</span>
                        <span>❓ {test.questions.length} Q</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {test.status === "draft" && (
                        <button
                          type="button"
                          onClick={() => updateTestStatus(test.id, "published")}
                          className="text-xs font-semibold bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-lg transition-colors"
                          data-ocid={`teacher.tests.publish_button.${i + 1}`}
                        >
                          Publish
                        </button>
                      )}
                      {test.status === "published" && (
                        <button
                          type="button"
                          onClick={() => updateTestStatus(test.id, "closed")}
                          className="text-xs font-semibold bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1.5 rounded-lg transition-colors"
                          data-ocid={`teacher.tests.close_button.${i + 1}`}
                        >
                          Close
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
}
