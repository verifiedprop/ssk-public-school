import { ParentLayout } from "@/components/portals/ParentLayout";
import { useAuth } from "@/hooks/useAuth";
import { useParentData } from "@/hooks/useParentData";
import type { ExamResult } from "@/hooks/useParentData";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Download, TrendingUp, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/parent/results")({
  component: ParentResults,
});

function gradeClass(grade: string): string {
  if (grade === "A+") return "text-green-700 bg-green-100";
  if (grade === "A") return "text-green-600 bg-green-50";
  if (grade === "B+") return "text-blue-700 bg-blue-100";
  if (grade === "B") return "text-blue-600 bg-blue-50";
  if (grade === "C+") return "text-amber-700 bg-amber-100";
  if (grade === "C") return "text-amber-600 bg-amber-50";
  if (grade === "D") return "text-red-700 bg-red-100";
  return "text-red-800 bg-red-200";
}

function ParentResults() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { results, unreadNotices, unreadMessages } = useParentData();
  const [selected, setSelected] = useState<ExamResult | null>(
    results[0] ?? null,
  );

  useEffect(() => {
    if (currentUser && currentUser.role !== "parent")
      navigate({ to: "/login" });
  }, [currentUser, navigate]);

  return (
    <ParentLayout unreadNotices={unreadNotices} unreadMessages={unreadMessages}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Examination Results
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Rahul Sharma · Class 10-A
          </p>
        </div>

        {/* Exam Selector */}
        <div className="flex flex-wrap gap-3">
          {results.map((r, i) => (
            <button
              key={r.id}
              type="button"
              data-ocid={`parent.results.exam_tab.${i + 1}`}
              onClick={() => setSelected(r)}
              className={
                selected?.id === r.id
                  ? "px-4 py-2 rounded-lg text-sm font-medium border bg-[#1e3a5f] text-white border-[#1e3a5f]"
                  : "px-4 py-2 rounded-lg text-sm font-medium border bg-card text-foreground border-border hover:bg-muted"
              }
            >
              {r.examName}
              <span className="ml-2 text-xs opacity-70">{r.examDate}</span>
            </button>
          ))}
        </div>

        {selected && (
          <>
            {/* Result Summary */}
            <div className="bg-card rounded-xl border border-border border-l-4 border-l-amber-500 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-bold text-foreground text-lg">
                    {selected.examName}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {selected.examDate} · Class 10-A
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-600">
                      {selected.percentage}%
                    </p>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      #{selected.rank}
                    </p>
                    <p className="text-xs text-muted-foreground">Rank</p>
                  </div>
                  <div className="text-center">
                    <span
                      className={
                        selected.result === "Pass"
                          ? "text-sm font-bold px-3 py-1 rounded-full bg-green-100 text-green-800"
                          : "text-sm font-bold px-3 py-1 rounded-full bg-red-100 text-red-800"
                      }
                    >
                      {selected.result}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    {selected.marksObtained}/{selected.totalMarks}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Marks</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    {selected.rank}/{selected.totalStudents}
                  </p>
                  <p className="text-xs text-muted-foreground">Class Rank</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    {selected.percentage >= 90
                      ? "A+"
                      : selected.percentage >= 80
                        ? "A"
                        : selected.percentage >= 70
                          ? "B+"
                          : "B"}
                  </p>
                  <p className="text-xs text-muted-foreground">Overall Grade</p>
                </div>
              </div>
            </div>

            {/* Subject-wise Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Trophy size={16} className="text-amber-500" />
                  Subject-wise Performance
                </h3>
                <button
                  type="button"
                  data-ocid="parent.results.download_button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  <Download size={14} />
                  Download Report Card
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                        Subject
                      </th>
                      <th className="text-center px-5 py-3 text-muted-foreground font-medium">
                        Max
                      </th>
                      <th className="text-center px-5 py-3 text-muted-foreground font-medium">
                        Obtained
                      </th>
                      <th className="text-center px-5 py-3 text-muted-foreground font-medium">
                        %
                      </th>
                      <th className="text-center px-5 py-3 text-muted-foreground font-medium">
                        Grade
                      </th>
                      <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {selected.subjects.map((s, i) => {
                      const pct = Math.round(
                        (s.marksObtained / s.maxMarks) * 100,
                      );
                      const pctClass =
                        pct >= 80
                          ? "text-xs font-medium text-green-600"
                          : pct >= 60
                            ? "text-xs font-medium text-amber-600"
                            : "text-xs font-medium text-red-600";
                      return (
                        <tr
                          key={s.subject}
                          data-ocid={`parent.results.subject.${i + 1}`}
                          className="hover:bg-muted/20 transition-colors"
                        >
                          <td className="px-5 py-3 font-medium text-foreground">
                            {s.subject}
                          </td>
                          <td className="px-5 py-3 text-center text-muted-foreground">
                            {s.maxMarks}
                          </td>
                          <td className="px-5 py-3 text-center font-semibold text-foreground">
                            {s.marksObtained}
                          </td>
                          <td className="px-5 py-3 text-center">
                            <span className={pctClass}>{pct}%</span>
                          </td>
                          <td className="px-5 py-3 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold ${gradeClass(s.grade)}`}
                            >
                              {s.grade}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-muted-foreground">
                            {s.remarks}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Performance Bars */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-amber-500" />
                Subject Performance
              </h3>
              <div className="space-y-3">
                {selected.subjects.map((s) => {
                  const pct = Math.round((s.marksObtained / s.maxMarks) * 100);
                  const barClass =
                    pct >= 80
                      ? "h-2 rounded-full transition-all duration-500 bg-green-500"
                      : pct >= 60
                        ? "h-2 rounded-full transition-all duration-500 bg-amber-500"
                        : "h-2 rounded-full transition-all duration-500 bg-red-500";
                  return (
                    <div key={s.subject}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-foreground">
                          {s.subject}
                        </span>
                        <span className="text-muted-foreground">
                          {s.marksObtained}/{s.maxMarks}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={barClass}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </ParentLayout>
  );
}
