import { StudentLayout } from "@/components/portals/StudentLayout";
import { useAuth } from "@/hooks/useAuth";
import { type MockTest, useStudentData } from "@/hooks/useStudentData";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  FlaskConical,
  Trophy,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/student/tests")({
  component: StudentTests,
});

type ExamState = "idle" | "running" | "submitted";

function useCountdown(seconds: number, running: boolean, onEnd: () => void) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!running) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          onEnd();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, onEnd]);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
  return { display: `${mins}:${secs}`, timeLeft };
}

function StudentTests() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { mockTests } = useStudentData();

  const [selectedTest, setSelectedTest] = useState<MockTest | null>(null);
  const [examState, setExamState] = useState<ExamState>("idle");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (currentUser && currentUser.role !== "student") {
      navigate({ to: "/login" });
    }
  }, [currentUser, navigate]);

  const handleSubmit = () => {
    if (!selectedTest) return;
    let correct = 0;
    for (const q of selectedTest.questions) {
      if (answers[q.id] === q.correct) correct++;
    }
    const earned = Math.round(
      (correct / selectedTest.questions.length) * selectedTest.totalMarks,
    );
    setScore(earned);
    setExamState("submitted");
  };

  const { display: timerDisplay, timeLeft } = useCountdown(
    (selectedTest?.duration ?? 30) * 60,
    examState === "running",
    handleSubmit,
  );

  const startTest = (test: MockTest) => {
    setSelectedTest(test);
    setAnswers({});
    setScore(0);
    setExamState("running");
  };

  const closeExam = () => {
    setSelectedTest(null);
    setExamState("idle");
    setAnswers({});
  };

  const subjectBadge: Record<string, string> = {
    Mathematics: "bg-blue-100 text-blue-700",
    Science: "bg-green-100 text-green-700",
    English: "bg-purple-100 text-purple-700",
    "Social Studies": "bg-rose-100 text-rose-700",
    Hindi: "bg-amber-100 text-amber-700",
  };

  return (
    <StudentLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Exam overlay */}
        {selectedTest &&
          (examState === "running" || examState === "submitted") && (
            <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
              <div className="max-w-3xl mx-auto px-4 py-6">
                {/* Exam header */}
                <div className="bg-[#1e3a5f] text-white rounded-xl px-5 py-4 flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-bold text-lg leading-tight">
                      {selectedTest.title}
                    </h2>
                    <p className="text-blue-200 text-sm mt-0.5">
                      {selectedTest.questions.length} Questions ·{" "}
                      {selectedTest.totalMarks} Marks
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {examState === "running" && (
                      <div
                        className={`flex items-center gap-1.5 font-mono font-bold text-lg px-3 py-1 rounded-lg ${
                          timeLeft <= 60
                            ? "bg-red-600 text-white"
                            : "bg-amber-500 text-blue-950"
                        }`}
                        data-ocid="student.test.timer"
                      >
                        <Clock className="w-4 h-4" />
                        {timerDisplay}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={closeExam}
                      data-ocid="student.test.close_button"
                      className="w-8 h-8 rounded-full bg-blue-700 hover:bg-blue-600 flex items-center justify-center transition-colors"
                      aria-label="Close exam"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {examState === "submitted" ? (
                  /* Score screen */
                  <div
                    className="bg-card border border-border rounded-xl p-8 text-center"
                    data-ocid="student.test.result"
                  >
                    <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-foreground">
                      Test Submitted!
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      Here's how you did on
                    </p>
                    <p className="font-semibold text-foreground">
                      {selectedTest.title}
                    </p>
                    <div className="my-6">
                      <p className="text-5xl font-bold text-[#1e3a5f]">
                        {score}/{selectedTest.totalMarks}
                      </p>
                      <p className="text-muted-foreground mt-2">
                        {Math.round((score / selectedTest.totalMarks) * 100)}%
                        score
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {selectedTest.questions.map((q) => (
                        <div
                          key={q.id}
                          className={`rounded-lg p-3 text-center text-sm ${
                            answers[q.id] === q.correct
                              ? "bg-green-50 border border-green-200"
                              : "bg-red-50 border border-red-200"
                          }`}
                        >
                          <p className="font-semibold text-xs text-muted-foreground">
                            Q{q.id}
                          </p>
                          <p
                            className={`font-bold mt-0.5 ${answers[q.id] === q.correct ? "text-green-600" : "text-red-600"}`}
                          >
                            {answers[q.id] === q.correct ? "✓" : "✗"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Correct: {q.options[q.correct]}
                          </p>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={closeExam}
                      data-ocid="student.test.done_button"
                      className="bg-[#1e3a5f] text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                    >
                      Back to Tests
                    </button>
                  </div>
                ) : (
                  /* Questions */
                  <div className="space-y-5">
                    {selectedTest.questions.map((q, qi) => (
                      <div
                        key={q.id}
                        className="bg-card border border-border rounded-xl p-5"
                        data-ocid={`student.test.question.${qi + 1}`}
                      >
                        <p className="font-semibold text-foreground mb-4">
                          <span className="text-amber-500 font-bold mr-2">
                            Q{qi + 1}.
                          </span>
                          {q.text}
                        </p>
                        <div className="space-y-2.5">
                          {q.options.map((opt, oi) => (
                            <button
                              key={`${q.id}-opt-${oi}`}
                              type="button"
                              onClick={() =>
                                setAnswers((prev) => ({ ...prev, [q.id]: oi }))
                              }
                              data-ocid={`student.test.option.${qi + 1}.${oi + 1}`}
                              className={`w-full text-left px-4 py-3 rounded-lg border-2 text-sm transition-all duration-150 ${
                                answers[q.id] === oi
                                  ? "border-amber-500 bg-amber-50 text-amber-900 font-medium"
                                  : "border-border bg-background text-foreground hover:border-blue-400 hover:bg-blue-50/50"
                              }`}
                            >
                              <span className="font-semibold mr-2">
                                {String.fromCharCode(65 + oi)}.
                              </span>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center justify-between pt-2">
                      <p className="text-sm text-muted-foreground">
                        {Object.keys(answers).length}/
                        {selectedTest.questions.length} answered
                      </p>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        data-ocid="student.test.submit_button"
                        className="bg-amber-500 text-blue-950 font-bold px-8 py-2.5 rounded-lg hover:bg-amber-400 transition-colors flex items-center gap-2"
                      >
                        Submit Test <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Tests list */}
        <div>
          <h1 className="text-xl font-bold text-foreground">Mock Tests</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Class 9-B · Attempt tests to track your preparation
          </p>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          data-ocid="student.tests.list"
        >
          {mockTests.map((test, i) => (
            <div
              key={test.id}
              className="bg-card border border-border rounded-xl p-5 border-l-4 border-l-amber-500 hover:shadow-md transition-shadow"
              data-ocid={`student.test.item.${i + 1}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${subjectBadge[test.subject] ?? "bg-muted text-foreground"}`}
                  >
                    {test.subject}
                  </span>
                  <h3 className="font-semibold text-foreground mt-2 leading-snug">
                    {test.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {test.duration} min
                    </span>
                    <span>{test.questions.length} Questions</span>
                    <span>{test.totalMarks} Marks</span>
                  </div>
                </div>
                {test.attempted && typeof test.score === "number" && (
                  <div className="text-right flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
                    <p className="text-xs text-green-600 font-semibold mt-1">
                      {test.score}/{test.totalMarks}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-4">
                {test.attempted ? (
                  <button
                    type="button"
                    onClick={() => startTest(test)}
                    data-ocid={`student.test.retake_button.${i + 1}`}
                    className="text-sm text-blue-600 font-medium hover:underline"
                  >
                    Retake Test →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => startTest(test)}
                    data-ocid={`student.test.start_button.${i + 1}`}
                    className="bg-[#1e3a5f] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-1.5"
                  >
                    Start Test <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </StudentLayout>
  );
}
