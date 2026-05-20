import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/hooks/useAuth";
import type {
  Difficulty,
  MockTest,
  Question,
  QuestionInput,
  TestInput,
} from "@/hooks/useTests";
import { useTests } from "@/hooks/useTests";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/admin/tests")({ component: TestsPage });

// ─── Shared helpers ───────────────────────────────────────────────────────────

const CLASSES = [
  "Class 6-A",
  "Class 6-B",
  "Class 7-A",
  "Class 7-B",
  "Class 8-A",
  "Class 8-B",
  "Class 9-A",
  "Class 9-B",
  "Class 10-A",
  "Class 10-B",
  "Class 11-A",
  "Class 11-B",
  "Class 12-A",
  "Class 12-B",
];
const SUBJECTS = [
  "Mathematics",
  "Science",
  "Biology",
  "History",
  "English",
  "General Knowledge",
  "Physics",
  "Chemistry",
  "Geography",
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Draft: "bg-blue-50 text-blue-600 border border-blue-200",
    Published: "bg-green-50 text-green-700 border border-green-200",
    Closed: "bg-amber-50 text-amber-700 border border-amber-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${map[status] ?? "bg-muted text-muted-foreground"}`}
    >
      {status}
    </span>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const map: Record<Difficulty, string> = {
    Easy: "bg-green-50 text-green-700 border border-green-200",
    Medium: "bg-amber-50 text-amber-700 border border-amber-200",
    Hard: "bg-red-50 text-red-700 border border-red-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${map[difficulty]}`}
    >
      {difficulty}
    </span>
  );
}

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        ref={ref}
        tabIndex={-1}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto outline-none border border-blue-100"
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        data-ocid="tests.dialog"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-100">
          <h3 className="font-display font-bold text-blue-900 text-lg">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-400 hover:text-blue-700 transition-colors"
            data-ocid="tests.close_button"
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white";
const labelCls = "block text-xs font-semibold text-blue-800 mb-1";

// ─── Admin view ───────────────────────────────────────────────────────────────

function AdminTestsView() {
  const {
    tests,
    questions,
    createTest,
    updateTest,
    publishTest,
    closeTest,
    addQuestion,
    assignQuestionsToTest,
    getTestAttempts,
    getTestLeaderboard,
  } = useTests();
  const [tab, setTab] = useState<"tests" | "questions" | "results">("tests");

  // Test modal
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<MockTest | null>(null);
  const [testForm, setTestForm] = useState<TestInput>({
    title: "",
    className: "Class 10",
    subject: "Mathematics",
    totalMarks: 50,
    durationMinutes: 60,
    passingPercentage: 40,
    negativeMarkingEnabled: false,
  });

  const openCreateTest = () => {
    setEditingTest(null);
    setTestForm({
      title: "",
      className: "Class 10",
      subject: "Mathematics",
      totalMarks: 50,
      durationMinutes: 60,
      passingPercentage: 40,
      negativeMarkingEnabled: false,
    });
    setTestModalOpen(true);
  };
  const openEditTest = (t: MockTest) => {
    setEditingTest(t);
    setTestForm({
      title: t.title,
      className: t.className,
      subject: t.subject,
      totalMarks: t.totalMarks,
      durationMinutes: t.durationMinutes,
      passingPercentage: t.passingPercentage,
      negativeMarkingEnabled: t.negativeMarkingEnabled,
    });
    setTestModalOpen(true);
  };
  const saveTest = () => {
    if (!testForm.title.trim()) return;
    if (editingTest) updateTest(editingTest.id, testForm);
    else createTest(testForm);
    setTestModalOpen(false);
  };

  // Question modal
  const [qModalOpen, setQModalOpen] = useState(false);
  const [qForm, setQForm] = useState<QuestionInput>({
    text: "",
    options: [
      { id: "a", text: "" },
      { id: "b", text: "" },
      { id: "c", text: "" },
      { id: "d", text: "" },
    ],
    correctOptionId: "a",
    marks: 2,
    negativeMarking: false,
    negativePenalty: 0.5,
    difficulty: "Easy",
    subject: "Mathematics",
  });
  const openAddQuestion = () => {
    setQForm({
      text: "",
      options: [
        { id: "a", text: "" },
        { id: "b", text: "" },
        { id: "c", text: "" },
        { id: "d", text: "" },
      ],
      correctOptionId: "a",
      marks: 2,
      negativeMarking: false,
      negativePenalty: 0.5,
      difficulty: "Easy",
      subject: "Mathematics",
    });
    setQModalOpen(true);
  };
  const saveQuestion = () => {
    if (!qForm.text.trim() || qForm.options.some((o) => !o.text.trim())) return;
    addQuestion(qForm);
    setQModalOpen(false);
  };

  // Question bank
  const [diffFilter, setDiffFilter] = useState<"All" | Difficulty>("All");
  const filteredQs =
    diffFilter === "All"
      ? questions
      : questions.filter((q) => q.difficulty === diffFilter);

  // Assign question to test
  const [assignTarget, setAssignTarget] = useState<Record<string, string>>({});
  const handleAssign = (qId: string) => {
    const testId = assignTarget[qId];
    if (!testId) return;
    assignQuestionsToTest(testId, [qId]);
  };

  // Results
  const [selectedTestId, setSelectedTestId] = useState("");
  const selectedTest = tests.find((t) => t.id === selectedTestId);
  const leaderboard = selectedTest ? getTestLeaderboard(selectedTest.id) : [];
  const attempts = selectedTest ? getTestAttempts(selectedTest.id) : [];
  const avgScore = attempts.length
    ? (
        attempts.reduce((s, a) => s + a.percentage, 0) / attempts.length
      ).toFixed(1)
    : "—";
  const passRate = attempts.length
    ? (
        (attempts.filter((a) => a.passed).length / attempts.length) *
        100
      ).toFixed(0)
    : "—";
  const topScore = attempts.length
    ? Math.max(...attempts.map((a) => a.percentage)).toFixed(1)
    : "—";

  const tabs: Array<{ key: "tests" | "questions" | "results"; label: string }> =
    [
      { key: "tests", label: "Tests" },
      { key: "questions", label: "Question Bank" },
      { key: "results", label: "Results & Analytics" },
    ];

  return (
    <div className="space-y-6" data-ocid="tests.admin.page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-900 font-display">
            Mock Test System
          </h1>
          <p className="text-blue-500 text-sm mt-1">
            {tests.length} tests · {questions.length} questions
          </p>
        </div>
        {tab === "tests" && (
          <button
            type="button"
            onClick={openCreateTest}
            className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors flex-shrink-0"
            data-ocid="tests.add_button"
          >
            + Create Test
          </button>
        )}
        {tab === "questions" && (
          <button
            type="button"
            onClick={openAddQuestion}
            className="bg-amber-500 hover:bg-amber-400 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors flex-shrink-0"
            data-ocid="tests.add_question_button"
          >
            + Add Question
          </button>
        )}
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 bg-blue-50 p-1 rounded-xl w-fit"
        data-ocid="tests.tab"
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.key
                ? "bg-blue-900 text-white shadow"
                : "text-blue-700 hover:bg-blue-100"
            }`}
            data-ocid={`tests.tab.${t.key}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Tests */}
      {tab === "tests" && (
        <div
          className="bg-white rounded-xl border border-blue-100 overflow-hidden shadow-sm"
          data-ocid="tests.table"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-50 border-b border-blue-100">
                <tr>
                  {[
                    "Title",
                    "Class",
                    "Subject",
                    "Marks",
                    "Duration",
                    "Status",
                    "Questions",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-blue-900 font-semibold text-xs uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-12 text-blue-400"
                      data-ocid="tests.empty_state"
                    >
                      No tests created yet.
                    </td>
                  </tr>
                ) : (
                  tests.map((t, i) => (
                    <tr
                      key={t.id}
                      className="border-t border-blue-50 hover:bg-blue-50/50 transition-colors"
                      data-ocid={`tests.item.${i + 1}`}
                    >
                      <td
                        className="px-4 py-3 font-semibold text-blue-900 max-w-[180px] truncate"
                        title={t.title}
                      >
                        {t.title}
                      </td>
                      <td className="px-4 py-3 text-blue-600 whitespace-nowrap">
                        {t.className}
                      </td>
                      <td className="px-4 py-3 text-blue-600">{t.subject}</td>
                      <td className="px-4 py-3 text-blue-800 font-mono text-center">
                        {t.totalMarks}
                      </td>
                      <td className="px-4 py-3 text-blue-600 text-center">
                        {t.durationMinutes}m
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="px-4 py-3 text-center text-blue-700 font-mono">
                        {t.questionIds.length}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => openEditTest(t)}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors"
                            data-ocid={`tests.edit_button.${i + 1}`}
                          >
                            Edit
                          </button>
                          {t.status === "Draft" && (
                            <button
                              type="button"
                              onClick={() => publishTest(t.id)}
                              className="px-2.5 py-1 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 text-xs font-bold transition-colors"
                              data-ocid={`tests.publish_button.${i + 1}`}
                            >
                              Publish
                            </button>
                          )}
                          {t.status === "Published" && (
                            <button
                              type="button"
                              onClick={() => closeTest(t.id)}
                              className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold transition-colors"
                              data-ocid={`tests.close_button.${i + 1}`}
                            >
                              Close
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTestId(t.id);
                              setTab("results");
                            }}
                            className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-colors"
                            data-ocid={`tests.results_button.${i + 1}`}
                          >
                            Results
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Question Bank */}
      {tab === "questions" && (
        <div className="space-y-4">
          {/* Difficulty filter */}
          <div
            className="flex gap-2 flex-wrap"
            data-ocid="tests.difficulty.toggle"
          >
            {(["All", "Easy", "Medium", "Hard"] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDiffFilter(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  diffFilter === d
                    ? "bg-blue-900 text-white"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
                data-ocid={`tests.filter.${d.toLowerCase()}`}
              >
                {d}
              </button>
            ))}
          </div>
          <div
            className="bg-white rounded-xl border border-blue-100 overflow-hidden shadow-sm"
            data-ocid="tests.questions.table"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-50 border-b border-blue-100">
                  <tr>
                    {[
                      "Question",
                      "Options",
                      "Marks",
                      "Neg. Marking",
                      "Difficulty",
                      "Assign to Test",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-blue-900 font-semibold text-xs uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredQs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-12 text-blue-400"
                        data-ocid="tests.questions.empty_state"
                      >
                        No questions found.
                      </td>
                    </tr>
                  ) : (
                    filteredQs.map((q, i) => (
                      <tr
                        key={q.id}
                        className="border-t border-blue-50 hover:bg-blue-50/50 transition-colors"
                        data-ocid={`tests.question.item.${i + 1}`}
                      >
                        <td className="px-4 py-3 max-w-[200px]">
                          <p
                            className="text-blue-900 font-medium truncate"
                            title={q.text}
                          >
                            {q.text.length > 80
                              ? `${q.text.slice(0, 80)}…`
                              : q.text}
                          </p>
                          <p className="text-xs text-blue-400 mt-0.5">
                            {q.subject}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <ol className="space-y-0.5">
                            {q.options.map((opt) => (
                              <li
                                key={opt.id}
                                className={`text-xs px-2 py-0.5 rounded ${
                                  opt.id === q.correctOptionId
                                    ? "bg-green-50 text-green-700 font-bold"
                                    : "text-blue-600"
                                }`}
                              >
                                {opt.id.toUpperCase()}. {opt.text}
                              </li>
                            ))}
                          </ol>
                        </td>
                        <td className="px-4 py-3 text-center font-mono text-blue-800">
                          {q.marks}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {q.negativeMarking ? (
                            <span className="text-red-500 font-bold text-xs">
                              -{q.negativePenalty}
                            </span>
                          ) : (
                            <span className="text-blue-300 text-xs">No</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <DifficultyBadge difficulty={q.difficulty} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5 items-center">
                            <select
                              value={assignTarget[q.id] ?? ""}
                              onChange={(e) =>
                                setAssignTarget((prev) => ({
                                  ...prev,
                                  [q.id]: e.target.value,
                                }))
                              }
                              className="border border-blue-200 rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 w-36"
                              data-ocid={`tests.assign_select.${i + 1}`}
                            >
                              <option value="">Select test</option>
                              {tests.map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.title}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => handleAssign(q.id)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold transition-colors"
                              data-ocid={`tests.assign_button.${i + 1}`}
                            >
                              Add
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Results & Analytics */}
      {tab === "results" && (
        <div className="space-y-6" data-ocid="tests.results.panel">
          <div className="flex items-center gap-3">
            <label
              htmlFor="results-test-select"
              className="text-sm font-semibold text-blue-800"
            >
              Select Test:
            </label>
            <select
              id="results-test-select"
              value={selectedTestId}
              onChange={(e) => setSelectedTestId(e.target.value)}
              className="border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 w-64"
              data-ocid="tests.results.select"
            >
              <option value="">— Choose a test —</option>
              {tests.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          {!selectedTestId && (
            <div
              className="bg-white rounded-xl border border-blue-100 p-12 text-center"
              data-ocid="tests.results.empty_state"
            >
              <p className="text-blue-400">
                Select a test above to view analytics.
              </p>
            </div>
          )}

          {selectedTest && (
            <>
              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Total Attempts",
                    value: attempts.length.toString(),
                    color: "text-blue-900",
                  },
                  {
                    label: "Average Score",
                    value: `${avgScore}%`,
                    color: "text-amber-600",
                  },
                  {
                    label: "Pass Rate",
                    value: `${passRate}%`,
                    color: "text-green-600",
                  },
                  {
                    label: "Top Score",
                    value: `${topScore}%`,
                    color: "text-purple-600",
                  },
                ].map((card) => (
                  <div
                    key={card.label}
                    className="bg-white rounded-xl border border-blue-100 p-4 text-center shadow-sm"
                  >
                    <p
                      className={`text-2xl font-bold font-display ${card.color}`}
                    >
                      {card.value}
                    </p>
                    <p className="text-xs text-blue-500 mt-1">{card.label}</p>
                  </div>
                ))}
              </div>

              {/* Leaderboard */}
              <div className="bg-white rounded-xl border border-blue-100 overflow-hidden shadow-sm">
                <div className="px-5 py-3 border-b border-blue-100 bg-blue-50">
                  <h3 className="font-bold text-blue-900 text-sm">
                    Leaderboard
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-blue-50">
                        {[
                          "Rank",
                          "Student",
                          "Class",
                          "Marks",
                          "Score %",
                          "Time",
                          "Result",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-2 text-left text-blue-700 font-semibold text-xs uppercase"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="text-center py-8 text-blue-400"
                          >
                            No attempts yet.
                          </td>
                        </tr>
                      ) : (
                        leaderboard.map((entry, i) => (
                          <tr
                            key={entry.id}
                            className="border-t border-blue-50 hover:bg-blue-50/40"
                            data-ocid={`tests.leaderboard.item.${i + 1}`}
                          >
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                                  entry.rank === 1
                                    ? "bg-amber-400 text-white"
                                    : entry.rank === 2
                                      ? "bg-blue-200 text-blue-800"
                                      : entry.rank === 3
                                        ? "bg-amber-100 text-amber-700"
                                        : "bg-blue-50 text-blue-600"
                                }`}
                              >
                                #{entry.rank}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-medium text-blue-900">
                              {entry.studentName}
                            </td>
                            <td className="px-4 py-3 text-blue-600">
                              {entry.className}
                            </td>
                            <td className="px-4 py-3 font-mono text-blue-800 text-center">
                              {entry.marksObtained}/{selectedTest.totalMarks}
                            </td>
                            <td className="px-4 py-3 font-mono font-bold text-center text-blue-900">
                              {entry.percentage.toFixed(1)}%
                            </td>
                            <td className="px-4 py-3 text-blue-600 text-center">
                              {Math.floor(entry.timeTaken / 60)}m{" "}
                              {entry.timeTaken % 60}s
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                  entry.passed
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-600"
                                }`}
                              >
                                {entry.passed ? "Pass" : "Fail"}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Score distribution */}
              <div className="bg-white rounded-xl border border-blue-100 p-5 shadow-sm">
                <h3 className="font-bold text-blue-900 text-sm mb-4">
                  Score Distribution
                </h3>
                <div className="space-y-3">
                  {(
                    [
                      [0, 20],
                      [21, 40],
                      [41, 60],
                      [61, 80],
                      [81, 100],
                    ] as [number, number][]
                  ).map(([lo, hi]) => {
                    const count = attempts.filter(
                      (a) => a.percentage >= lo && a.percentage <= hi,
                    ).length;
                    const pct = attempts.length
                      ? (count / attempts.length) * 100
                      : 0;
                    return (
                      <div key={lo} className="flex items-center gap-3">
                        <span className="w-20 text-xs text-blue-600 font-mono text-right">
                          {lo}–{hi}%
                        </span>
                        <div className="flex-1 bg-blue-50 rounded-full h-5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-12 text-xs text-blue-700 font-bold text-right">
                          {count} ({pct.toFixed(0)}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Create / Edit Test Modal */}
      <Modal
        open={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        title={editingTest ? "Edit Test" : "Create New Test"}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="test-title" className={labelCls}>
              Test Title *
            </label>
            <input
              id="test-title"
              type="text"
              value={testForm.title}
              onChange={(e) =>
                setTestForm((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="e.g. Science Mid Term Practice"
              className={inputCls}
              data-ocid="tests.create.title_input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="test-class" className={labelCls}>
                Class
              </label>
              <select
                id="test-class"
                value={testForm.className}
                onChange={(e) =>
                  setTestForm((p) => ({ ...p, className: e.target.value }))
                }
                className={inputCls}
                data-ocid="tests.create.class_select"
              >
                {CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="test-subject" className={labelCls}>
                Subject
              </label>
              <select
                id="test-subject"
                value={testForm.subject}
                onChange={(e) =>
                  setTestForm((p) => ({ ...p, subject: e.target.value }))
                }
                className={inputCls}
                data-ocid="tests.create.subject_select"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="test-total-marks" className={labelCls}>
                Total Marks
              </label>
              <input
                id="test-total-marks"
                type="number"
                min={1}
                value={testForm.totalMarks}
                onChange={(e) =>
                  setTestForm((p) => ({
                    ...p,
                    totalMarks: Number(e.target.value),
                  }))
                }
                className={inputCls}
                data-ocid="tests.create.marks_input"
              />
            </div>
            <div>
              <label htmlFor="test-duration" className={labelCls}>
                Duration (min)
              </label>
              <input
                id="test-duration"
                type="number"
                min={5}
                value={testForm.durationMinutes}
                onChange={(e) =>
                  setTestForm((p) => ({
                    ...p,
                    durationMinutes: Number(e.target.value),
                  }))
                }
                className={inputCls}
                data-ocid="tests.create.duration_input"
              />
            </div>
            <div>
              <label htmlFor="test-passing-pct" className={labelCls}>
                Passing %
              </label>
              <input
                id="test-passing-pct"
                type="number"
                min={1}
                max={100}
                value={testForm.passingPercentage}
                onChange={(e) =>
                  setTestForm((p) => ({
                    ...p,
                    passingPercentage: Number(e.target.value),
                  }))
                }
                className={inputCls}
                data-ocid="tests.create.passing_input"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="neg-mark"
              checked={testForm.negativeMarkingEnabled}
              onChange={(e) =>
                setTestForm((p) => ({
                  ...p,
                  negativeMarkingEnabled: e.target.checked,
                }))
              }
              className="w-4 h-4 rounded border-blue-300 accent-blue-700"
              data-ocid="tests.create.negative_checkbox"
            />
            <label
              htmlFor="neg-mark"
              className="text-sm font-medium text-blue-800"
            >
              Enable Negative Marking
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setTestModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-blue-200 text-blue-700 text-sm font-semibold hover:bg-blue-50 transition-colors"
              data-ocid="tests.create.cancel_button"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveTest}
              disabled={!testForm.title.trim()}
              className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white text-sm font-bold transition-colors"
              data-ocid="tests.create.submit_button"
            >
              {editingTest ? "Save Changes" : "Create Test"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Question Modal */}
      <Modal
        open={qModalOpen}
        onClose={() => setQModalOpen(false)}
        title="Add Question to Bank"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="q-text" className={labelCls}>
              Question Text *
            </label>
            <textarea
              id="q-text"
              rows={3}
              value={qForm.text}
              onChange={(e) =>
                setQForm((p) => ({ ...p, text: e.target.value }))
              }
              placeholder="Enter the question…"
              className={inputCls}
              data-ocid="tests.question.text_input"
            />
          </div>
          <div className="space-y-2">
            <p className={labelCls}>Answer Options</p>
            {qForm.options.map((opt, oi) => (
              <div key={opt.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct"
                  value={opt.id}
                  checked={qForm.correctOptionId === opt.id}
                  onChange={() =>
                    setQForm((p) => ({ ...p, correctOptionId: opt.id }))
                  }
                  className="accent-blue-700"
                  data-ocid={`tests.question.correct_${opt.id}`}
                />
                <span className="text-xs font-bold text-blue-700 w-5">
                  {opt.id.toUpperCase()}.
                </span>
                <input
                  type="text"
                  value={opt.text}
                  onChange={(e) =>
                    setQForm((p) => ({
                      ...p,
                      options: p.options.map((o, i) =>
                        i === oi ? { ...o, text: e.target.value } : o,
                      ),
                    }))
                  }
                  placeholder={`Option ${opt.id.toUpperCase()}`}
                  className={`${inputCls} flex-1`}
                  data-ocid={`tests.question.option_${opt.id}`}
                />
              </div>
            ))}
            <p className="text-xs text-blue-400">
              Select the radio button next to the correct answer.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="q-subject" className={labelCls}>
                Subject
              </label>
              <select
                id="q-subject"
                value={qForm.subject}
                onChange={(e) =>
                  setQForm((p) => ({ ...p, subject: e.target.value }))
                }
                className={inputCls}
                data-ocid="tests.question.subject_select"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="q-difficulty" className={labelCls}>
                Difficulty
              </label>
              <select
                id="q-difficulty"
                value={qForm.difficulty}
                onChange={(e) =>
                  setQForm((p) => ({
                    ...p,
                    difficulty: e.target.value as Difficulty,
                  }))
                }
                className={inputCls}
                data-ocid="tests.question.difficulty_select"
              >
                {(["Easy", "Medium", "Hard"] as Difficulty[]).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="q-marks" className={labelCls}>
                Marks
              </label>
              <input
                id="q-marks"
                type="number"
                min={1}
                value={qForm.marks}
                onChange={(e) =>
                  setQForm((p) => ({ ...p, marks: Number(e.target.value) }))
                }
                className={inputCls}
                data-ocid="tests.question.marks_input"
              />
            </div>
            <div>
              <label htmlFor="q-penalty" className={labelCls}>
                Penalty (negative marks)
              </label>
              <input
                id="q-penalty"
                type="number"
                min={0}
                step={0.5}
                value={qForm.negativePenalty}
                onChange={(e) =>
                  setQForm((p) => ({
                    ...p,
                    negativePenalty: Number(e.target.value),
                  }))
                }
                className={inputCls}
                data-ocid="tests.question.penalty_input"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="q-neg"
              checked={qForm.negativeMarking}
              onChange={(e) =>
                setQForm((p) => ({ ...p, negativeMarking: e.target.checked }))
              }
              className="w-4 h-4 rounded border-blue-300 accent-blue-700"
              data-ocid="tests.question.negative_checkbox"
            />
            <label
              htmlFor="q-neg"
              className="text-sm font-medium text-blue-800"
            >
              Apply Negative Marking for this question
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setQModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-blue-200 text-blue-700 text-sm font-semibold hover:bg-blue-50"
              data-ocid="tests.question.cancel_button"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveQuestion}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold transition-colors"
              data-ocid="tests.question.submit_button"
            >
              Add to Bank
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Student test-taking view ─────────────────────────────────────────────────

interface TestSession {
  test: MockTest;
  questions: Question[];
  answers: Record<string, string>;
  bookmarked: Set<string>;
  currentIdx: number;
  startedAt: number;
  submitted: boolean;
  result?: {
    marksObtained: number;
    percentage: number;
    passed: boolean;
    timeTaken: number;
  };
}

function StudentTestView({
  session,
  onFinish,
  onAnswer,
  onBookmark,
  onNext,
  onPrev,
  onSubmit,
}: {
  session: TestSession;
  onFinish: () => void;
  onAnswer: (qId: string, optId: string) => void;
  onBookmark: (qId: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
}) {
  const {
    test,
    questions,
    answers,
    bookmarked,
    currentIdx,
    startedAt,
    submitted,
    result,
  } = session;
  const [elapsed, setElapsed] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (submitted) return;
    const id = setInterval(
      () => setElapsed(Math.floor((Date.now() - startedAt) / 1000)),
      1000,
    );
    return () => clearInterval(id);
  }, [submitted, startedAt]);

  const remaining = test.durationMinutes * 60 - elapsed;
  const mins = Math.max(0, Math.floor(remaining / 60));
  const secs = Math.max(0, remaining % 60);
  const timerCritical = remaining < 60;

  const currentQ = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const unanswered = questions.length - answeredCount;

  if (submitted && result) {
    const grade =
      result.percentage >= 90
        ? "A+"
        : result.percentage >= 75
          ? "A"
          : result.percentage >= 60
            ? "B"
            : result.percentage >= 45
              ? "C"
              : "D";
    return (
      <div className="space-y-6" data-ocid="tests.result.panel">
        <div
          className={`rounded-2xl p-6 text-center ${result.passed ? "bg-green-50 border-2 border-green-300" : "bg-red-50 border-2 border-red-300"}`}
        >
          <p
            className={`text-4xl font-display font-bold mb-1 ${result.passed ? "text-green-700" : "text-red-600"}`}
          >
            {result.passed ? "🎉 Passed!" : "😞 Better Luck Next Time"}
          </p>
          <p className="text-blue-600 text-sm mb-4">
            Time taken: {Math.floor(result.timeTaken / 60)}m{" "}
            {result.timeTaken % 60}s
          </p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-900 font-display">
                {result.marksObtained}
                <span className="text-lg text-blue-400">
                  /{test.totalMarks}
                </span>
              </p>
              <p className="text-xs text-blue-500">Marks Obtained</p>
            </div>
            <div className="text-center">
              <p
                className={`text-3xl font-bold font-display ${result.percentage >= test.passingPercentage ? "text-green-600" : "text-red-600"}`}
              >
                {result.percentage.toFixed(1)}%
              </p>
              <p className="text-xs text-blue-500">Score</p>
            </div>
            <div className="text-center">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-400 text-white font-display font-bold text-xl">
                {grade}
              </span>
              <p className="text-xs text-blue-500 mt-1">Grade</p>
            </div>
          </div>
        </div>

        {/* Answer review */}
        <div className="bg-white rounded-xl border border-blue-100 overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-blue-100 bg-blue-50">
            <h3 className="font-bold text-blue-900 text-sm">Answer Review</h3>
          </div>
          <div className="divide-y divide-blue-50">
            {questions.map((q, qi) => {
              const studentAns = answers[q.id];
              const isCorrect = studentAns === q.correctOptionId;
              return (
                <div key={q.id} className="px-5 py-4">
                  <p className="text-sm font-semibold text-blue-900 mb-2">
                    Q{qi + 1}. {q.text}
                  </p>
                  <div className="space-y-1">
                    {q.options.map((opt) => (
                      <div
                        key={opt.id}
                        className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg ${
                          opt.id === q.correctOptionId
                            ? "bg-green-50 text-green-700 font-bold"
                            : opt.id === studentAns && !isCorrect
                              ? "bg-red-50 text-red-600 line-through"
                              : "text-blue-600"
                        }`}
                      >
                        <span className="font-bold">
                          {opt.id.toUpperCase()}.
                        </span>
                        <span>{opt.text}</span>
                        {opt.id === q.correctOptionId && (
                          <span className="ml-auto">✓ Correct</span>
                        )}
                        {opt.id === studentAns && !isCorrect && (
                          <span className="ml-auto">✗ Your answer</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={onFinish}
          className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold transition-colors"
          data-ocid="tests.result.back_button"
        >
          ← Back to My Tests
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-ocid="tests.taking.panel">
      {/* Header bar */}
      <div className="bg-blue-900 rounded-xl px-5 py-3 flex items-center justify-between">
        <div>
          <p className="text-white font-bold text-sm">{test.title}</p>
          <p className="text-blue-300 text-xs">
            {test.subject} · {questions.length} questions
          </p>
        </div>
        <div
          className={`font-mono font-bold text-xl px-4 py-1.5 rounded-lg ${timerCritical ? "bg-red-600 text-white animate-pulse" : "bg-blue-800 text-amber-300"}`}
        >
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Question */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-blue-100 shadow-sm">
          <div className="px-5 py-4 border-b border-blue-50 bg-blue-50 rounded-t-xl flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-700">
              Question {currentIdx + 1} of {questions.length}
            </span>
            <DifficultyBadge difficulty={currentQ.difficulty} />
          </div>
          <div className="p-5">
            <p className="text-blue-900 font-semibold text-base mb-5 leading-relaxed">
              {currentQ.text}
            </p>
            <div className="space-y-3">
              {currentQ.options.map((opt) => {
                const selected = answers[currentQ.id] === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      selected
                        ? "border-blue-600 bg-blue-50"
                        : "border-blue-100 hover:border-blue-300 hover:bg-blue-50/60"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${currentQ.id}`}
                      value={opt.id}
                      checked={selected}
                      onChange={() => onAnswer(currentQ.id, opt.id)}
                      className="w-4 h-4 accent-blue-700"
                      data-ocid={`tests.taking.option.${opt.id}`}
                    />
                    <span className="font-bold text-blue-700 text-sm">
                      {opt.id.toUpperCase()}.
                    </span>
                    <span
                      className={`text-sm ${selected ? "text-blue-900 font-medium" : "text-blue-700"}`}
                    >
                      {opt.text}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
          <div className="px-5 py-4 border-t border-blue-50 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onPrev}
              disabled={currentIdx === 0}
              className="px-4 py-2 rounded-xl border border-blue-200 text-blue-700 text-sm font-semibold hover:bg-blue-50 disabled:opacity-40 transition-colors"
              data-ocid="tests.taking.prev_button"
            >
              ← Previous
            </button>
            <button
              type="button"
              onClick={() => onBookmark(currentQ.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                bookmarked.has(currentQ.id)
                  ? "bg-amber-400 text-white"
                  : "border border-amber-300 text-amber-600 hover:bg-amber-50"
              }`}
              data-ocid="tests.taking.bookmark_button"
            >
              🔖 {bookmarked.has(currentQ.id) ? "Bookmarked" : "Bookmark"}
            </button>
            {currentIdx < questions.length - 1 ? (
              <button
                type="button"
                onClick={onNext}
                className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-sm font-bold transition-colors"
                data-ocid="tests.taking.next_button"
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold transition-colors"
                data-ocid="tests.taking.submit_button"
              >
                Submit Test
              </button>
            )}
          </div>
        </div>

        {/* Question navigation */}
        <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-4">
          <p className="text-xs font-semibold text-blue-700 mb-3">
            Navigate Questions
          </p>
          <div className="grid grid-cols-5 gap-1.5 mb-4">
            {questions.map((q, qi) => {
              const isCurrent = qi === currentIdx;
              const isAnswered = !!answers[q.id];
              const isBookmarked = bookmarked.has(q.id);
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    /* jump to q */
                  }}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                    isCurrent
                      ? "ring-2 ring-amber-400 ring-offset-1 bg-amber-50 text-amber-700"
                      : isBookmarked
                        ? "bg-amber-400 text-white"
                        : isAnswered
                          ? "bg-blue-700 text-white"
                          : "bg-blue-50 text-blue-500 hover:bg-blue-100"
                  }`}
                  data-ocid={`tests.taking.nav.${qi + 1}`}
                >
                  {qi + 1}
                </button>
              );
            })}
          </div>
          <div className="space-y-1.5 text-xs">
            {[
              { cls: "bg-blue-700", label: "Answered" },
              { cls: "bg-amber-400", label: "Bookmarked" },
              { cls: "ring-2 ring-amber-400 bg-amber-50", label: "Current" },
              { cls: "bg-blue-50", label: "Unanswered" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className={`inline-block w-4 h-4 rounded ${item.cls}`} />
                <span className="text-blue-600">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-blue-50">
            <p className="text-xs text-blue-600">
              <span className="font-bold text-blue-900">{answeredCount}</span>{" "}
              answered ·{" "}
              <span className="font-bold text-amber-600">{unanswered}</span>{" "}
              unanswered
            </p>
          </div>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="mt-4 w-full py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold transition-colors"
            data-ocid="tests.taking.submit_button.nav"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Confirm dialog */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/60 backdrop-blur-sm">
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
            data-ocid="tests.confirm.dialog"
          >
            <h3 className="font-display font-bold text-blue-900 text-lg mb-2">
              Submit Test?
            </h3>
            <p className="text-blue-600 text-sm mb-1">
              Are you sure you want to submit?
            </p>
            {unanswered > 0 && (
              <p className="text-amber-600 text-sm font-semibold mb-4">
                ⚠️ You have {unanswered} unanswered question
                {unanswered > 1 ? "s" : ""}.
              </p>
            )}
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="flex-1 py-2 rounded-xl border border-blue-200 text-blue-700 text-sm font-semibold hover:bg-blue-50"
                data-ocid="tests.confirm.cancel_button"
              >
                Keep Going
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmOpen(false);
                  onSubmit();
                }}
                className="flex-1 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold"
                data-ocid="tests.confirm.confirm_button"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Student portal ───────────────────────────────────────────────────────────

function StudentView() {
  const { tests, getStudentAttempts, getTestQuestions } = useTests();
  const { currentUser } = useAuth();
  const studentId = currentUser?.id ?? "s1";
  const studentClass = "Class 10";

  const publishedTests = tests.filter(
    (t) => t.status === "Published" && t.className === studentClass,
  );
  const myAttempts = getStudentAttempts(studentId);
  const [tab, setTab] = useState<"my-tests" | "take-test" | "performance">(
    "my-tests",
  );
  const [session, setSession] = useState<TestSession | null>(null);

  const startTest = (test: MockTest) => {
    const qs = getTestQuestions(test);
    setSession({
      test,
      questions: qs,
      answers: {},
      bookmarked: new Set(),
      currentIdx: 0,
      startedAt: Date.now(),
      submitted: false,
    });
    setTab("take-test");
  };

  const handleAnswer = (qId: string, optId: string) => {
    setSession((prev) =>
      prev ? { ...prev, answers: { ...prev.answers, [qId]: optId } } : prev,
    );
  };
  const handleBookmark = (qId: string) => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = new Set(prev.bookmarked);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return { ...prev, bookmarked: next };
    });
  };
  const handleNext = () =>
    setSession((prev) =>
      prev && prev.currentIdx < prev.questions.length - 1
        ? { ...prev, currentIdx: prev.currentIdx + 1 }
        : prev,
    );
  const handlePrev = () =>
    setSession((prev) =>
      prev && prev.currentIdx > 0
        ? { ...prev, currentIdx: prev.currentIdx - 1 }
        : prev,
    );

  const handleSubmit = () => {
    if (!session) return;
    const { test, questions: qs, answers, startedAt } = session;
    let marks = 0;
    for (const q of qs) {
      const ans = answers[q.id];
      if (!ans) continue;
      if (ans === q.correctOptionId) marks += q.marks;
      else if (q.negativeMarking && test.negativeMarkingEnabled)
        marks -= q.negativePenalty;
    }
    const final = Math.max(0, marks);
    const pct = (final / test.totalMarks) * 100;
    setSession((prev) =>
      prev
        ? {
            ...prev,
            submitted: true,
            result: {
              marksObtained: final,
              percentage: pct,
              passed: pct >= test.passingPercentage,
              timeTaken: Math.floor((Date.now() - startedAt) / 1000),
            },
          }
        : prev,
    );
  };

  const handleFinish = () => {
    setSession(null);
    setTab("my-tests");
  };

  // Performance stats
  const totalAttempts = myAttempts.length;
  const bestScore = totalAttempts
    ? Math.max(...myAttempts.map((a) => a.percentage)).toFixed(1)
    : "—";
  const avgScore = totalAttempts
    ? (
        myAttempts.reduce((s, a) => s + a.percentage, 0) / totalAttempts
      ).toFixed(1)
    : "—";

  const getGrade = (pct: number) =>
    pct >= 90
      ? "A+"
      : pct >= 75
        ? "A"
        : pct >= 60
          ? "B"
          : pct >= 45
            ? "C"
            : "D";

  const tabs: Array<{ key: typeof tab; label: string }> = [
    { key: "my-tests", label: "My Tests" },
    { key: "take-test", label: "Take Test" },
    { key: "performance", label: "My Performance" },
  ];

  return (
    <div className="space-y-6" data-ocid="tests.student.page">
      <div>
        <h1 className="text-2xl font-bold text-blue-900 font-display">
          Mock Test Portal
        </h1>
        <p className="text-blue-500 text-sm mt-1">
          Hello, {currentUser?.name ?? "Student"} — {studentClass}
        </p>
      </div>

      <div
        className="flex gap-1 bg-blue-50 p-1 rounded-xl w-fit"
        data-ocid="tests.student.tab"
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.key
                ? "bg-blue-900 text-white shadow"
                : "text-blue-700 hover:bg-blue-100"
            }`}
            data-ocid={`tests.student.tab.${t.key}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: My Tests */}
      {tab === "my-tests" && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          data-ocid="tests.student.tests.list"
        >
          {publishedTests.length === 0 && (
            <div
              className="col-span-full bg-white rounded-xl border border-blue-100 p-12 text-center"
              data-ocid="tests.student.empty_state"
            >
              <p className="text-4xl mb-3">📝</p>
              <p className="font-bold text-blue-900">No tests available</p>
              <p className="text-blue-400 text-sm mt-1">
                Check back when your teacher publishes a test.
              </p>
            </div>
          )}
          {publishedTests.map((t, i) => {
            const attempted = myAttempts.find((a) => a.testId === t.id);
            const testQs = getTestQuestions(t);
            return (
              <div
                key={t.id}
                className="bg-white rounded-xl border border-blue-100 shadow-sm p-5 flex flex-col gap-3"
                data-ocid={`tests.student.test.item.${i + 1}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-blue-900 text-sm leading-tight">
                    {t.title}
                  </h3>
                  <span
                    className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                      attempted
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {attempted ? "Completed" : "Not Started"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs text-blue-600">
                  <span>📚 {t.subject}</span>
                  <span>🏫 {t.className}</span>
                  <span>⏱ {t.durationMinutes} mins</span>
                  <span>📊 {t.totalMarks} marks</span>
                  <span className="col-span-2">
                    🎯 Pass: {t.passingPercentage}%
                  </span>
                </div>
                {attempted ? (
                  <div className="mt-auto bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-green-700 font-bold text-sm">
                      Score: {attempted.marksObtained}/{t.totalMarks} (
                      {attempted.percentage.toFixed(1)}%)
                    </p>
                    <p
                      className={`text-xs font-bold mt-0.5 ${attempted.passed ? "text-green-600" : "text-red-500"}`}
                    >
                      {attempted.passed ? "✅ Passed" : "❌ Failed"}
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => startTest(t)}
                    className="mt-auto w-full py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-sm font-bold transition-colors"
                    data-ocid={`tests.student.start_button.${i + 1}`}
                  >
                    {testQs.length === 0
                      ? "⚠️ No questions added"
                      : "Start Test →"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Take Test */}
      {tab === "take-test" &&
        (session ? (
          <StudentTestView
            session={session}
            onFinish={handleFinish}
            onAnswer={handleAnswer}
            onBookmark={handleBookmark}
            onNext={handleNext}
            onPrev={handlePrev}
            onSubmit={handleSubmit}
          />
        ) : (
          <div
            className="bg-white rounded-xl border border-blue-100 p-12 text-center"
            data-ocid="tests.take-test.empty_state"
          >
            <p className="text-4xl mb-3">🎯</p>
            <p className="font-bold text-blue-900">No active test</p>
            <p className="text-blue-400 text-sm mt-1">
              Go to "My Tests" and click Start Test to begin.
            </p>
          </div>
        ))}

      {/* Tab 3: Performance */}
      {tab === "performance" && (
        <div className="space-y-6" data-ocid="tests.student.performance.panel">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Total Attempts",
                value: totalAttempts.toString(),
                color: "text-blue-900",
              },
              {
                label: "Best Score",
                value: `${bestScore}%`,
                color: "text-green-600",
              },
              {
                label: "Average Score",
                value: `${avgScore}%`,
                color: "text-amber-600",
              },
            ].map((card) => (
              <div
                key={card.label}
                className="bg-white rounded-xl border border-blue-100 p-5 text-center shadow-sm"
              >
                <p className={`text-3xl font-bold font-display ${card.color}`}>
                  {card.value}
                </p>
                <p className="text-xs text-blue-500 mt-1">{card.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-blue-100 overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-blue-100 bg-blue-50">
              <h3 className="font-bold text-blue-900 text-sm">
                My Test History
              </h3>
            </div>
            {myAttempts.length === 0 ? (
              <div
                className="p-12 text-center"
                data-ocid="tests.student.history.empty_state"
              >
                <p className="text-blue-400">
                  No attempts yet. Start a test to see your performance here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-blue-50">
                      {[
                        "Test Name",
                        "Date",
                        "Marks",
                        "Score %",
                        "Grade",
                        "Result",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-blue-700 font-semibold text-xs uppercase"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {myAttempts.map((attempt, i) => {
                      const t = tests.find((t) => t.id === attempt.testId);
                      return (
                        <tr
                          key={attempt.id}
                          className="border-t border-blue-50 hover:bg-blue-50/40"
                          data-ocid={`tests.student.history.item.${i + 1}`}
                        >
                          <td className="px-4 py-3 font-medium text-blue-900">
                            {t?.title ?? "Unknown Test"}
                          </td>
                          <td className="px-4 py-3 text-blue-600 text-xs">
                            {new Date(attempt.submittedAt).toLocaleDateString(
                              "en-IN",
                            )}
                          </td>
                          <td className="px-4 py-3 font-mono text-blue-800 text-center">
                            {attempt.marksObtained}/{t?.totalMarks ?? "?"}
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-center text-blue-900">
                            {attempt.percentage.toFixed(1)}%
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-400 text-white text-xs font-bold">
                              {getGrade(attempt.percentage)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                attempt.passed
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {attempt.passed ? "Pass" : "Fail"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

function TestsPage() {
  const { role, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) void navigate({ to: "/login" as never });
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const isStudent = role === "student";

  return (
    <AdminLayout title="Mock Test System">
      {isStudent ? <StudentView /> : <AdminTestsView />}
    </AdminLayout>
  );
}
