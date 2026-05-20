import { StudentLayout } from "@/components/portals/StudentLayout";
import { useAuth } from "@/hooks/useAuth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  ClipboardList,
  Download,
  PlayCircle,
  Star,
  Trophy,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/student/")({
  component: StudentDashboard,
});

const mockTests = [
  {
    id: 1,
    subject: "Mathematics",
    title: "Chapter 5 — Quadratic Equations",
    duration: "30 min",
    questions: 25,
    difficulty: "Medium",
  },
  {
    id: 2,
    subject: "Science",
    title: "Unit 3 — Electricity & Magnetism",
    duration: "45 min",
    questions: 30,
    difficulty: "Hard",
  },
  {
    id: 3,
    subject: "English",
    title: "Grammar & Comprehension",
    duration: "20 min",
    questions: 20,
    difficulty: "Easy",
  },
];

const assignments = [
  {
    subject: "English",
    title: "Essay: Impact of Technology on Education",
    due: "22 May",
    status: "Pending",
  },
  {
    subject: "Mathematics",
    title: "Solve Exercise 5.3 — Quadratic Equations",
    due: "21 May",
    status: "Pending",
  },
  {
    subject: "Physics",
    title: "Draw and explain circuit diagrams",
    due: "23 May",
    status: "Submitted",
  },
];

const testScores = [
  { subject: "Math", score: 88, max: 100 },
  { subject: "Science", score: 76, max: 100 },
  { subject: "English", score: 80, max: 100 },
  { subject: "Hindi", score: 72, max: 100 },
  { subject: "SSt", score: 85, max: 100 },
];

const resources = [
  { title: "Class 8 Mathematics Textbook", type: "PDF" },
  { title: "Science Notes — Unit 3", type: "PDF" },
  { title: "English Grammar Workbook", type: "PDF" },
];

const _leaderboard = [
  { rank: 2, name: "Rohan Mehta", score: 94 },
  { rank: 3, name: "Priya Mehta", score: 91, me: true },
  { rank: 4, name: "Aditya Singh", score: 89 },
  { rank: 5, name: "Sneha Patel", score: 87 },
];

function StudentDashboard() {
  const { currentUser, initialized } = useAuth();
  const navigate = useNavigate();
  const [startedTest, setStartedTest] = useState<number | null>(null);

  useEffect(() => {
    // Wait until auth singleton has read from localStorage before evaluating role
    if (!initialized) return;
    if (!currentUser) {
      navigate({ to: "/login" });
    } else if (currentUser.role !== "student") {
      navigate({ to: "/login" });
    }
  }, [currentUser, initialized, navigate]);

  // Show nothing while auth is still loading to prevent flash/redirect loop
  if (!initialized) return null;

  // Derive display variables from currentUser
  const studentName = currentUser?.name || "Student";
  const _initials =
    studentName
      .split(" ")
      .map((w: string) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "ST";
  // studentClass is stored as the full class string (e.g. "Class 10") — no prefix needed
  const classLabel = currentUser?.studentClass || "";
  const sectionLabel = currentUser?.studentSection
    ? ` - ${currentUser.studentSection}`
    : "";
  const rollLabel = currentUser?.studentRoll
    ? `Roll No. ${currentUser.studentRoll}`
    : "";
  const _classDisplay = [classLabel + sectionLabel, rollLabel]
    .filter(Boolean)
    .join(" · ");

  const leaderboard = [
    { rank: 1, name: "Sneha Gupta", score: 94 },
    { rank: 2, name: "Rahul Singh", score: 91 },
    { rank: 3, name: studentName, score: 88, isMe: true },
    { rank: 4, name: "Priya Sharma", score: 85 },
    { rank: 5, name: "Karan Mehta", score: 82 },
  ];

  return (
    <StudentLayout>
      <div className="p-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            data-ocid="student.attendance_stat"
            className="rounded-xl p-4 border-l-4"
            style={{
              background: "#ffffff",
              borderLeftColor: "#7c3aed",
              border: "1px solid #ede9fe",
              borderLeft: "4px solid #7c3aed",
            }}
          >
            <div
              className="text-3xl font-bold mb-1"
              style={{ color: "#581c87" }}
            >
              88%
            </div>
            <div className="text-sm font-semibold" style={{ color: "#7c3aed" }}>
              Attendance
            </div>
            <div className="text-xs mt-0.5" style={{ color: "#a78bfa" }}>
              This year
            </div>
          </div>
          <div
            data-ocid="student.grade_stat"
            className="rounded-xl p-4"
            style={{
              background: "#ffffff",
              border: "1px solid #ede9fe",
              borderLeft: "4px solid #8b5cf6",
            }}
          >
            <div
              className="text-3xl font-bold mb-1"
              style={{ color: "#581c87" }}
            >
              B+
            </div>
            <div className="text-sm font-semibold" style={{ color: "#7c3aed" }}>
              Overall Grade
            </div>
            <div className="text-xs mt-0.5" style={{ color: "#a78bfa" }}>
              All subjects
            </div>
          </div>
          <div
            data-ocid="student.tests_stat"
            className="rounded-xl p-4"
            style={{
              background: "#ffffff",
              border: "1px solid #ede9fe",
              borderLeft: "4px solid #a78bfa",
            }}
          >
            <div
              className="text-3xl font-bold mb-1"
              style={{ color: "#581c87" }}
            >
              12
            </div>
            <div className="text-sm font-semibold" style={{ color: "#7c3aed" }}>
              Tests Completed
            </div>
            <div className="text-xs mt-0.5" style={{ color: "#a78bfa" }}>
              3 more available
            </div>
          </div>
          <div
            data-ocid="student.assignments_stat"
            className="rounded-xl p-4"
            style={{
              background: "#ffffff",
              border: "1px solid #ede9fe",
              borderLeft: "4px solid #c4b5fd",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl font-bold" style={{ color: "#dc2626" }}>
                3
              </span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: "#fee2e2", color: "#991b1b" }}
              >
                Pending
              </span>
            </div>
            <div className="text-sm font-semibold" style={{ color: "#7c3aed" }}>
              Assignments
            </div>
            <div className="text-xs mt-0.5" style={{ color: "#a78bfa" }}>
              Due soon
            </div>
          </div>
        </div>

        {/* Mock Tests */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "#ffffff", border: "1px solid #ede9fe" }}
          data-ocid="student.mock_tests_section"
        >
          <div
            className="px-5 py-4 flex items-center gap-2 border-b"
            style={{ borderColor: "#ede9fe", background: "#f5f3ff" }}
          >
            <ClipboardList size={18} style={{ color: "#7c3aed" }} />
            <h2 className="font-semibold" style={{ color: "#581c87" }}>
              Available Mock Tests
            </h2>
            <span
              className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: "#ede9fe", color: "#581c87" }}
            >
              3 Tests
            </span>
          </div>
          <div className="divide-y" style={{ borderColor: "#f5f3ff" }}>
            {mockTests.map((t, i) => (
              <div
                key={t.id}
                className="px-5 py-4 flex items-center justify-between"
                data-ocid={`student.mock_test.item.${i + 1}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{ background: "#ede9fe", color: "#581c87" }}
                  >
                    {t.subject.slice(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#581c87" }}
                    >
                      {t.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs" style={{ color: "#7c3aed" }}>
                        ⏱ {t.duration}
                      </span>
                      <span className="text-xs" style={{ color: "#7c3aed" }}>
                        📝 {t.questions} MCQs
                      </span>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded"
                        style={{
                          background:
                            t.difficulty === "Hard"
                              ? "#fee2e2"
                              : t.difficulty === "Medium"
                                ? "#fef9c3"
                                : "#dcfce7",
                          color:
                            t.difficulty === "Hard"
                              ? "#991b1b"
                              : t.difficulty === "Medium"
                                ? "#854d0e"
                                : "#14532d",
                        }}
                      >
                        {t.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                {startedTest === t.id ? (
                  <span
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                    style={{ background: "#dcfce7", color: "#14532d" }}
                    data-ocid={`student.test_started.${i + 1}`}
                  >
                    In Progress…
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStartedTest(t.id)}
                    className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-semibold text-white transition-opacity hover:opacity-90 flex-shrink-0"
                    style={{ background: "#581c87" }}
                    data-ocid={`student.start_test_button.${i + 1}`}
                  >
                    <PlayCircle size={14} /> Start Test
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Assignments */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "#ffffff", border: "1px solid #ede9fe" }}
          data-ocid="student.assignments_section"
        >
          <div
            className="px-5 py-4 flex items-center gap-2 border-b"
            style={{ borderColor: "#ede9fe", background: "#f5f3ff" }}
          >
            <BookOpen size={18} style={{ color: "#7c3aed" }} />
            <h2 className="font-semibold" style={{ color: "#581c87" }}>
              Assignments
            </h2>
          </div>
          <div className="divide-y" style={{ borderColor: "#f5f3ff" }}>
            {assignments.map((a, _i) => (
              <div
                key={a.title}
                className="px-5 py-3 flex items-center justify-between"
                data-ocid={`student.assignment.item.${_i + 1}`}
              >
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#581c87" }}
                  >
                    {a.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#7c3aed" }}>
                    {a.subject} · Due {a.due}
                  </p>
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background:
                      a.status === "Submitted" ? "#dcfce7" : "#fef9c3",
                    color: a.status === "Submitted" ? "#14532d" : "#854d0e",
                  }}
                >
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Results — CSS Bar Chart */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: "#ffffff", border: "1px solid #ede9fe" }}
            data-ocid="student.results_section"
          >
            <div
              className="px-5 py-4 flex items-center gap-2 border-b"
              style={{ borderColor: "#ede9fe", background: "#f5f3ff" }}
            >
              <Award size={18} style={{ color: "#7c3aed" }} />
              <h2 className="font-semibold" style={{ color: "#581c87" }}>
                My Results — Last 5 Tests
              </h2>
            </div>
            <div className="p-5">
              <div className="flex items-end gap-3 h-28">
                {testScores.map((s, i) => (
                  <div
                    key={s.subject}
                    className="flex flex-col items-center flex-1 gap-1"
                    data-ocid={`student.result.item.${i + 1}`}
                  >
                    <span
                      className="text-xs font-bold"
                      style={{ color: "#581c87" }}
                    >
                      {s.score}%
                    </span>
                    <div
                      className="w-full rounded-t-md"
                      style={{
                        height: `${(s.score / 100) * 80}px`,
                        background:
                          s.score >= 85
                            ? "#581c87"
                            : s.score >= 75
                              ? "#7c3aed"
                              : "#a78bfa",
                      }}
                    />
                    <span className="text-xs" style={{ color: "#7c3aed" }}>
                      {s.subject}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: "#ffffff", border: "1px solid #ede9fe" }}
            data-ocid="student.leaderboard_section"
          >
            <div
              className="px-5 py-4 flex items-center gap-2 border-b"
              style={{ borderColor: "#ede9fe", background: "#f5f3ff" }}
            >
              <Trophy size={18} style={{ color: "#7c3aed" }} />
              <h2 className="font-semibold" style={{ color: "#581c87" }}>
                Class Leaderboard
              </h2>
            </div>
            <div className="divide-y" style={{ borderColor: "#f5f3ff" }}>
              {leaderboard.map((s, i) => (
                <div
                  key={s.rank}
                  className="px-5 py-3 flex items-center gap-3"
                  style={{ background: s.isMe ? "#f5f3ff" : "transparent" }}
                  data-ocid={`student.leaderboard.item.${i + 1}`}
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{
                      background:
                        s.rank === 1
                          ? "#fbbf24"
                          : s.rank === 2
                            ? "#d1d5db"
                            : s.rank === 3
                              ? "#cd7f32"
                              : "#ede9fe",
                      color: s.rank <= 3 ? "#fff" : "#581c87",
                    }}
                  >
                    {s.rank}
                  </span>
                  <User size={16} style={{ color: "#7c3aed" }} />
                  <span
                    className="flex-1 text-sm font-medium"
                    style={{ color: "#581c87" }}
                  >
                    {s.name}
                  </span>
                  {s.isMe && (
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "#ede9fe", color: "#581c87" }}
                    >
                      You
                    </span>
                  )}
                  <span
                    className="text-sm font-bold"
                    style={{ color: "#7c3aed" }}
                  >
                    {s.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Download Resources */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "#ffffff", border: "1px solid #ede9fe" }}
          data-ocid="student.resources_section"
        >
          <div
            className="px-5 py-4 flex items-center gap-2 border-b"
            style={{ borderColor: "#ede9fe", background: "#f5f3ff" }}
          >
            <Download size={18} style={{ color: "#7c3aed" }} />
            <h2 className="font-semibold" style={{ color: "#581c87" }}>
              Study Materials
            </h2>
          </div>
          <div className="divide-y" style={{ borderColor: "#f5f3ff" }}>
            {resources.map((r, i) => (
              <div
                key={r.title}
                className="px-5 py-3 flex items-center justify-between"
                data-ocid={`student.resource.item.${i + 1}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded"
                    style={{ background: "#fee2e2", color: "#991b1b" }}
                  >
                    PDF
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#581c87" }}
                  >
                    {r.title}
                  </span>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-80"
                  style={{ color: "#7c3aed" }}
                  data-ocid={`student.download_button.${i + 1}`}
                >
                  <Download size={14} /> Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
