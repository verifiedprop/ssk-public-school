import { ParentLayout } from "@/components/portals/ParentLayout";
import { useAuth } from "@/hooks/useAuth";
import { useParentData } from "@/hooks/useParentData";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CalendarCheck, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/parent/attendance")({
  component: ParentAttendance,
});

function statusColor(status: string): string {
  if (status === "Present") return "bg-green-100 text-green-800";
  if (status === "Absent") return "bg-red-100 text-red-800";
  if (status === "Late") return "bg-amber-100 text-amber-800";
  return "bg-blue-100 text-blue-800";
}

function statusDot(status: string): string {
  if (status === "Present") return "bg-green-500";
  if (status === "Absent") return "bg-red-500";
  if (status === "Late") return "bg-amber-500";
  return "bg-blue-400";
}

function ParentAttendance() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const {
    attendance,
    attendanceSummary,
    studentInfo,
    unreadNotices,
    unreadMessages,
  } = useParentData();

  useEffect(() => {
    if (currentUser && currentUser.role !== "parent")
      navigate({ to: "/login" });
  }, [currentUser, navigate]);

  const pct = studentInfo.attendancePercent;
  const statusOk = pct >= 85;

  return (
    <ParentLayout unreadNotices={unreadNotices} unreadMessages={unreadMessages}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Attendance Record
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Rahul Sharma · Class 10-A · May 2026
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Total Days",
              value: attendanceSummary.total,
              color: "text-foreground",
              bg: "bg-muted/40",
            },
            {
              label: "Present",
              value: attendanceSummary.present,
              color: "text-green-700",
              bg: "bg-green-50",
            },
            {
              label: "Absent",
              value: attendanceSummary.absent,
              color: "text-red-700",
              bg: "bg-red-50",
            },
            {
              label: "Late",
              value: attendanceSummary.late,
              color: "text-amber-700",
              bg: "bg-amber-50",
            },
          ].map((item) => (
            <div
              key={item.label}
              data-ocid={`parent.attendance.${item.label.toLowerCase()}_card`}
              className={`${item.bg} rounded-xl border border-border p-4 text-center`}
            >
              <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Percentage Bar */}
        <div className="bg-card rounded-xl border border-border border-l-4 border-l-amber-500 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CalendarCheck size={18} className="text-amber-500" />
              <span className="font-semibold text-foreground">
                Overall Attendance
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={
                  statusOk
                    ? "text-2xl font-bold text-green-600"
                    : "text-2xl font-bold text-red-600"
                }
              >
                {pct}%
              </span>
              {statusOk ? (
                <TrendingUp size={18} className="text-green-600" />
              ) : (
                <TrendingDown size={18} className="text-red-600" />
              )}
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className={
                statusOk
                  ? "h-3 rounded-full transition-all duration-500 bg-green-500"
                  : "h-3 rounded-full transition-all duration-500 bg-red-500"
              }
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">
              Minimum required: 85%
            </p>
            <p
              className={`text-xs font-medium ${statusOk ? "text-green-600" : "text-red-600"}`}
            >
              {statusOk ? "✓ Requirement met" : "⚠ Below minimum"}
            </p>
          </div>
        </div>

        {/* Records Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Day-wise Record</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                    Date
                  </th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                    Day
                  </th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                    Remark
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {attendance.map((record, i) => (
                  <tr
                    key={`${record.date}-${i}`}
                    data-ocid={`parent.attendance.item.${i + 1}`}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-foreground">
                      {record.date}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {record.day}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(record.status)}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusDot(record.status)}`}
                        />
                        {record.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {record.remark ?? (
                        <Minus size={14} className="text-muted-foreground/40" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ParentLayout>
  );
}
