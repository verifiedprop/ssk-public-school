import { StudentLayout } from "@/components/portals/StudentLayout";
import { useAuth } from "@/hooks/useAuth";
import { useStudentData } from "@/hooks/useStudentData";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BarChart2, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/student/results")({
  component: StudentResults,
});

const gradeColor: Record<string, string> = {
  "A+": "bg-green-100 text-green-700 border-green-200",
  A: "bg-blue-100 text-blue-700 border-blue-200",
  "B+": "bg-amber-100 text-amber-700 border-amber-200",
  B: "bg-orange-100 text-orange-700 border-orange-200",
  C: "bg-red-100 text-red-700 border-red-200",
};

function StudentResults() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { results } = useStudentData();
  const [activeExam, setActiveExam] = useState<string>("All");

  useEffect(() => {
    if (currentUser && currentUser.role !== "student") {
      navigate({ to: "/login" });
    }
  }, [currentUser, navigate]);

  const exams = ["All", ...Array.from(new Set(results.map((r) => r.exam)))];
  const filtered =
    activeExam === "All"
      ? results
      : results.filter((r) => r.exam === activeExam);

  const overallPct =
    filtered.length > 0
      ? Math.round(
          filtered.reduce(
            (sum, r) => sum + (r.marksObtained / r.totalMarks) * 100,
            0,
          ) / filtered.length,
        )
      : 0;

  const subjectSummary: Record<string, { total: number; obtained: number }> =
    {};
  for (const r of filtered) {
    if (!subjectSummary[r.subject])
      subjectSummary[r.subject] = { total: 0, obtained: 0 };
    subjectSummary[r.subject].total += r.totalMarks;
    subjectSummary[r.subject].obtained += r.marksObtained;
  }

  return (
    <StudentLayout>
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">My Results</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Class 9-B · Academic Performance
            </p>
          </div>
          <div className="bg-[#1e3a5f] text-white rounded-xl px-4 py-3 text-center">
            <p className="text-2xl font-bold">{overallPct}%</p>
            <p className="text-blue-200 text-xs mt-0.5">Avg Score</p>
          </div>
        </div>

        {/* Exam filter tabs */}
        <div
          className="flex gap-2 flex-wrap"
          data-ocid="student.results.filter"
        >
          {exams.map((exam) => (
            <button
              key={exam}
              type="button"
              onClick={() => setActiveExam(exam)}
              data-ocid={`student.results.tab.${exam.toLowerCase().replace(/ /g, "_")}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeExam === exam
                  ? "bg-amber-500 text-blue-950"
                  : "bg-card border border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {exam}
            </button>
          ))}
        </div>

        {/* Subject performance bars */}
        <div
          className="bg-card border border-border rounded-xl p-5"
          data-ocid="student.results.chart"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <h2 className="font-semibold text-foreground">
              Subject Performance
            </h2>
          </div>
          <div className="space-y-4">
            {Object.entries(subjectSummary).map(([subject, data]) => {
              const pct = Math.round((data.obtained / data.total) * 100);
              return (
                <div key={subject}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-foreground">
                      {subject}
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {data.obtained}/{data.total} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        pct >= 90
                          ? "bg-green-500"
                          : pct >= 75
                            ? "bg-blue-500"
                            : pct >= 60
                              ? "bg-amber-500"
                              : "bg-red-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Results table */}
        <div
          className="bg-card border border-border rounded-xl"
          data-ocid="student.results.table"
        >
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-amber-500" />
            <h2 className="font-semibold text-foreground">Detailed Results</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-5 py-3 text-left text-muted-foreground font-medium">
                    Subject
                  </th>
                  <th className="px-5 py-3 text-left text-muted-foreground font-medium">
                    Exam
                  </th>
                  <th className="px-5 py-3 text-right text-muted-foreground font-medium">
                    Marks
                  </th>
                  <th className="px-5 py-3 text-right text-muted-foreground font-medium">
                    %
                  </th>
                  <th className="px-5 py-3 text-center text-muted-foreground font-medium">
                    Grade
                  </th>
                  <th className="px-5 py-3 text-left text-muted-foreground font-medium">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((r, i) => (
                  <tr
                    key={r.id}
                    className="hover:bg-muted/30 transition-colors"
                    data-ocid={`student.result.row.${i + 1}`}
                  >
                    <td className="px-5 py-3 font-medium text-foreground">
                      {r.subject}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {r.exam}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-foreground">
                      {r.marksObtained}/{r.totalMarks}
                    </td>
                    <td className="px-5 py-3 text-right text-foreground">
                      {Math.round((r.marksObtained / r.totalMarks) * 100)}%
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded border ${gradeColor[r.grade] ?? "bg-muted text-foreground border-border"}`}
                      >
                        {r.grade}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {new Date(r.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
