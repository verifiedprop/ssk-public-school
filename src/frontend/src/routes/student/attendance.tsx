import { StudentLayout } from "@/components/portals/StudentLayout";
import { useAuth } from "@/hooks/useAuth";
import { useStudentData } from "@/hooks/useStudentData";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CalendarCheck, Clock, TrendingUp, X } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/student/attendance")({
  component: StudentAttendance,
});

const subjectColors: Record<string, string> = {
  Mathematics: "bg-blue-100 text-blue-700",
  Science: "bg-green-100 text-green-700",
  English: "bg-purple-100 text-purple-700",
  Hindi: "bg-amber-100 text-amber-700",
  "Social Studies": "bg-rose-100 text-rose-700",
};

function StudentAttendance() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { attendance, attendanceStats } = useStudentData();

  useEffect(() => {
    if (currentUser && currentUser.role !== "student") {
      navigate({ to: "/login" });
    }
  }, [currentUser, navigate]);

  const bySubject: Record<
    string,
    { present: number; absent: number; late: number }
  > = {};
  for (const rec of attendance) {
    if (!bySubject[rec.subject])
      bySubject[rec.subject] = { present: 0, absent: 0, late: 0 };
    bySubject[rec.subject][rec.status]++;
  }

  return (
    <StudentLayout>
      <div className="p-4 lg:p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">My Attendance</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Class 9-B · Session 2025–26
          </p>
        </div>

        {/* Summary cards */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          data-ocid="student.attendance.summary"
        >
          {[
            {
              label: "Total Days",
              value: attendanceStats.total,
              color: "text-foreground",
              bg: "bg-card",
            },
            {
              label: "Present",
              value: attendanceStats.present,
              color: "text-green-600",
              bg: "bg-green-50",
            },
            {
              label: "Absent",
              value: attendanceStats.absent,
              color: "text-red-600",
              bg: "bg-red-50",
            },
            {
              label: "Late",
              value: attendanceStats.late,
              color: "text-amber-600",
              bg: "bg-amber-50",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`${s.bg} border border-border rounded-xl p-4 text-center`}
            >
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Attendance percentage bar */}
        <div
          className="bg-card border border-border rounded-xl p-5"
          data-ocid="student.attendance.percentage"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              <span className="font-semibold text-foreground">
                Overall Attendance
              </span>
            </div>
            <span
              className={`text-lg font-bold ${
                attendanceStats.percentage >= 75
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {attendanceStats.percentage}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-700 ${
                attendanceStats.percentage >= 75 ? "bg-green-500" : "bg-red-500"
              }`}
              style={{ width: `${attendanceStats.percentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {attendanceStats.percentage >= 75
              ? "✓ You meet the minimum 75% attendance requirement."
              : "⚠ Attendance below 75% minimum requirement."}
          </p>
        </div>

        {/* Per-subject breakdown */}
        <div
          className="bg-card border border-border rounded-xl"
          data-ocid="student.attendance.subjects"
        >
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-amber-500" />
            <h2 className="font-semibold text-foreground">
              Subject-wise Attendance
            </h2>
          </div>
          <div className="divide-y divide-border">
            {Object.entries(bySubject).map(([subject, counts], i) => {
              const total = counts.present + counts.absent + counts.late;
              const pct = Math.round(
                ((counts.present + counts.late) / total) * 100,
              );
              return (
                <div
                  key={subject}
                  className="px-5 py-4"
                  data-ocid={`student.attendance.subject.${i + 1}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${subjectColors[subject] ?? "bg-muted text-foreground"}`}
                    >
                      {subject}
                    </span>
                    <span
                      className={`text-sm font-semibold ${pct >= 75 ? "text-green-600" : "text-red-600"}`}
                    >
                      {pct}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${pct >= 75 ? "bg-green-400" : "bg-red-400"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="text-green-600">
                      {counts.present} Present
                    </span>
                    <span className="text-red-600">{counts.absent} Absent</span>
                    <span className="text-amber-600">{counts.late} Late</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed log */}
        <div
          className="bg-card border border-border rounded-xl"
          data-ocid="student.attendance.log"
        >
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Attendance Log</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-5 py-3 text-left text-muted-foreground font-medium">
                    Date
                  </th>
                  <th className="px-5 py-3 text-left text-muted-foreground font-medium">
                    Subject
                  </th>
                  <th className="px-5 py-3 text-left text-muted-foreground font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[...attendance].reverse().map((rec, i) => (
                  <tr
                    key={rec.date}
                    className="hover:bg-muted/30 transition-colors"
                    data-ocid={`student.attendance.row.${i + 1}`}
                  >
                    <td className="px-5 py-3 text-foreground">
                      {new Date(rec.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3 text-foreground">{rec.subject}</td>
                    <td className="px-5 py-3">
                      {rec.status === "present" && (
                        <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium">
                          <CalendarCheck className="w-3 h-3" /> Present
                        </span>
                      )}
                      {rec.status === "absent" && (
                        <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded-full text-xs font-medium">
                          <X className="w-3 h-3" /> Absent
                        </span>
                      )}
                      {rec.status === "late" && (
                        <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full text-xs font-medium">
                          <Clock className="w-3 h-3" /> Late
                        </span>
                      )}
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
