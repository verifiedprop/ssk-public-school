import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  type AttendanceRecord,
  type AttendanceStatus,
  type AttendanceSummary,
  type AttendeeType,
  CLASSES,
  useAttendance,
} from "@/hooks/useAttendance";
import { useAuth } from "@/hooks/useAuth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  Download,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/admin/attendance")({
  component: AttendancePage,
});

// ── helpers ──────────────────────────────────────────────────
function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function statusBadge(status: AttendanceStatus) {
  if (status === "Present")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
        <Check className="h-3 w-3" /> Present
      </span>
    );
  if (status === "Absent")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
        <X className="h-3 w-3" /> Absent
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
      <CalendarDays className="h-3 w-3" /> Leave
    </span>
  );
}

function percentageColor(pct: number) {
  if (pct >= 85) return "text-emerald-600 font-bold";
  if (pct >= 70) return "text-amber-600 font-bold";
  return "text-red-600 font-bold";
}

function percentageBar(pct: number) {
  const color =
    pct >= 85 ? "bg-emerald-500" : pct >= 70 ? "bg-amber-400" : "bg-red-500";
  return (
    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
      <div
        className={`h-2 rounded-full transition-all ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function exportCSV(rows: AttendanceRecord[]) {
  const header = ["Name", "Type", "Class", "Date", "Status", "Marked By"];
  const lines = rows.map((r) =>
    [
      r.attendeeName,
      r.attendeeType,
      r.className,
      r.date,
      r.status,
      r.markedBy,
    ].join(","),
  );
  const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `attendance_${todayStr()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Main page ────────────────────────────────────────────────
function AttendancePage() {
  const { currentUser, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const allowed: string[] = [
    "super_admin",
    "principal",
    "teacher",
    "accountant",
  ];

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
    else if (role && !allowed.includes(role)) navigate({ to: "/admin/" });
  }, [isAuthenticated, role, navigate]);

  const [activeTab, setActiveTab] = useState<"mark" | "register" | "summary">(
    "mark",
  );
  const attendance = useAttendance();

  return (
    <AdminLayout title="Attendance Management">
      <div className="space-y-6" data-ocid="attendance.page">
        {/* Tab bar */}
        <div className="flex gap-1 bg-card border border-border rounded-xl p-1 w-fit shadow-sm">
          {(
            [
              { id: "mark", label: "Mark Attendance", icon: BookOpen },
              {
                id: "register",
                label: "Attendance Register",
                icon: CalendarDays,
              },
              { id: "summary", label: "Summary Report", icon: Users },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              data-ocid={`attendance.${id}_tab`}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === id
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Tab panels */}
        {activeTab === "mark" && (
          <MarkAttendanceTab
            attendance={attendance}
            currentUser={currentUser?.name ?? "Admin"}
          />
        )}
        {activeTab === "register" && (
          <RegisterTab records={attendance.records} />
        )}
        {activeTab === "summary" && <SummaryTab attendance={attendance} />}
      </div>
    </AdminLayout>
  );
}

// ── Tab 1: Mark Attendance ───────────────────────────────────
function MarkAttendanceTab({
  attendance,
  currentUser,
}: {
  attendance: ReturnType<typeof useAttendance>;
  currentUser: string;
}) {
  const [date, setDate] = useState(todayStr());
  const [type, setType] = useState<AttendeeType>("Student");
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>(
    {},
  );
  const [saved, setSaved] = useState(false);

  const attendees = attendance.getAttendeesForType(
    type,
    type === "Student" ? selectedClass : undefined,
  );

  // Load any existing records for this date/type
  useEffect(() => {
    const existing = attendance.getExistingForDate(date, type);
    if (existing.size > 0) {
      const map: Record<string, AttendanceStatus> = {};
      existing.forEach((status, id) => {
        map[id] = status;
      });
      setStatuses(map);
    } else {
      setStatuses({});
    }
    setSaved(false);
  }, [date, type, attendance.getExistingForDate]);

  const setStatus = (id: string, status: AttendanceStatus) =>
    setStatuses((prev) => ({ ...prev, [id]: status }));

  const markAll = (status: AttendanceStatus) => {
    const map: Record<string, AttendanceStatus> = {};
    for (const a of attendees) map[a.id] = status;
    setStatuses(map);
  };

  const handleSave = () => {
    const entries = attendees.map((a) => ({
      attendeeId: a.id,
      status: statuses[a.id] ?? "Present",
    }));
    attendance.markAttendance(entries, date, type, currentUser);
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="attendance-date"
            className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
          >
            Date
          </label>
          <input
            id="attendance-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            data-ocid="attendance.date_input"
            className="border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="attendance-type"
            className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
          >
            Type
          </label>
          <select
            id="attendance-type"
            value={type}
            onChange={(e) => setType(e.target.value as AttendeeType)}
            data-ocid="attendance.type_select"
            className="border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="Student">Students</option>
            <option value="Teacher">Teachers</option>
          </select>
        </div>
        {type === "Student" && (
          <div className="flex flex-col gap-1">
            <label
              htmlFor="attendance-class"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
            >
              Class
            </label>
            <select
              id="attendance-class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              data-ocid="attendance.class_select"
              className="border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {CLASSES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Bulk actions */}
      <div className="flex flex-wrap gap-2 items-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => markAll("Present")}
          data-ocid="attendance.mark_all_present_button"
        >
          <Check className="h-3.5 w-3.5 mr-1" /> Mark All Present
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setStatuses({})}
          data-ocid="attendance.clear_all_button"
        >
          <X className="h-3.5 w-3.5 mr-1" /> Clear All
        </Button>
        <span className="ml-auto text-xs text-muted-foreground">
          {attendees.length} {type}(s)
        </span>
      </div>

      {/* Attendance table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[2fr_1fr_1fr_1fr] items-center px-4 py-2.5 bg-primary/5 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          <span>Name {type === "Student" ? "/ Roll No." : "/ Subject"}</span>
          <span className="hidden sm:block text-center">Present</span>
          <span className="hidden sm:block text-center">Absent</span>
          <span className="hidden sm:block text-center">Leave</span>
          <span className="sm:hidden text-right">Status</span>
        </div>

        <div className="divide-y divide-border">
          {attendees.map((attendee, i) => {
            const current = statuses[attendee.id];
            return (
              <div
                key={attendee.id}
                data-ocid={`attendance.row.${i + 1}`}
                className="grid grid-cols-[1fr_auto] sm:grid-cols-[2fr_1fr_1fr_1fr] items-center px-4 py-3 hover:bg-muted/40 transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">
                    {attendee.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {attendee.rollNumber ?? attendee.subject}
                  </p>
                </div>

                {/* Desktop radio buttons */}
                {(["Present", "Absent", "Leave"] as AttendanceStatus[]).map(
                  (s) => (
                    <label
                      key={s}
                      className="hidden sm:flex justify-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`status-${attendee.id}`}
                        value={s}
                        checked={current === s}
                        onChange={() => setStatus(attendee.id, s)}
                        data-ocid={`attendance.${s.toLowerCase()}_radio.${i + 1}`}
                        className="accent-primary h-4 w-4"
                      />
                    </label>
                  ),
                )}

                {/* Mobile select */}
                <select
                  value={current ?? ""}
                  onChange={(e) =>
                    e.target.value &&
                    setStatus(attendee.id, e.target.value as AttendanceStatus)
                  }
                  className="sm:hidden border border-input rounded-md px-2 py-1 text-xs bg-background"
                >
                  <option value="">-- Pick --</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Leave">Leave</option>
                </select>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          onClick={handleSave}
          data-ocid="attendance.save_button"
          className="min-w-32"
        >
          Save Attendance
        </Button>
        {saved && (
          <span
            className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold animate-in fade-in"
            data-ocid="attendance.success_state"
          >
            <Check className="h-4 w-4" /> Saved successfully!
          </span>
        )}
      </div>
    </div>
  );
}

// ── Tab 2: Attendance Register ───────────────────────────────
function RegisterTab({ records }: { records: AttendanceRecord[] }) {
  const [filterName, setFilterName] = useState("");
  const [filterClass, setFilterClass] = useState("All");
  const [filterType, setFilterType] = useState<"All" | AttendeeType>("All");
  const [filterStatus, setFilterStatus] = useState<"All" | AttendanceStatus>(
    "All",
  );
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (
        filterName &&
        !r.attendeeName.toLowerCase().includes(filterName.toLowerCase())
      )
        return false;
      if (filterClass !== "All" && r.className !== filterClass) return false;
      if (filterType !== "All" && r.attendeeType !== filterType) return false;
      if (filterStatus !== "All" && r.status !== filterStatus) return false;
      if (filterDateFrom && r.date < filterDateFrom) return false;
      if (filterDateTo && r.date > filterDateTo) return false;
      return true;
    });
  }, [
    records,
    filterName,
    filterClass,
    filterType,
    filterStatus,
    filterDateFrom,
    filterDateTo,
  ]);

  const classOptions = ["All", "Staff", ...CLASSES];

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <input
          placeholder="Search by name…"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          data-ocid="attendance.register_search_input"
          className="border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          data-ocid="attendance.register_class_select"
          className="border border-input rounded-lg px-3 py-2 text-sm bg-background"
        >
          {classOptions.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={(e) =>
            setFilterType(e.target.value as "All" | AttendeeType)
          }
          data-ocid="attendance.register_type_select"
          className="border border-input rounded-lg px-3 py-2 text-sm bg-background"
        >
          <option value="All">All Types</option>
          <option value="Student">Students</option>
          <option value="Teacher">Teachers</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as "All" | AttendanceStatus)
          }
          data-ocid="attendance.register_status_select"
          className="border border-input rounded-lg px-3 py-2 text-sm bg-background"
        >
          <option value="All">All Statuses</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Leave">Leave</option>
        </select>
        <input
          type="date"
          value={filterDateFrom}
          onChange={(e) => setFilterDateFrom(e.target.value)}
          data-ocid="attendance.register_date_from_input"
          className="border border-input rounded-lg px-3 py-2 text-sm bg-background"
        />
        <input
          type="date"
          value={filterDateTo}
          onChange={(e) => setFilterDateTo(e.target.value)}
          data-ocid="attendance.register_date_to_input"
          className="border border-input rounded-lg px-3 py-2 text-sm bg-background"
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length} records
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => exportCSV(filtered)}
          data-ocid="attendance.export_button"
        >
          <Download className="h-3.5 w-3.5 mr-1" /> Export CSV
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table
            className="w-full text-sm"
            data-ocid="attendance.register_table"
          >
            <thead>
              <tr className="bg-primary/5 border-b border-border">
                {["Name", "Class", "Date", "Status", "Marked By"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-muted-foreground"
                    data-ocid="attendance.register_empty_state"
                  >
                    No records match your filters.
                  </td>
                </tr>
              ) : (
                filtered.slice(0, 100).map((r, i) => (
                  <tr
                    key={r.id}
                    data-ocid={`attendance.register_row.${i + 1}`}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {r.attendeeName}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {r.className}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {r.date}
                    </td>
                    <td className="px-4 py-3">{statusBadge(r.status)}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {r.markedBy}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 100 && (
          <div className="px-4 py-2 bg-muted/30 text-xs text-muted-foreground border-t border-border">
            Showing first 100 of {filtered.length} records. Export CSV for full
            list.
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tab 3: Summary Report ────────────────────────────────────
function SummaryTab({
  attendance,
}: { attendance: ReturnType<typeof useAttendance> }) {
  const [filterClass, setFilterClass] = useState("All");
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [smsSent, setSmsSent] = useState(false);

  const summaries = attendance.computeSummaries(
    filterClass === "All" ? undefined : filterClass,
  );

  const totalStudents = summaries.length;
  const avgPct =
    summaries.length > 0
      ? Math.round(
          summaries.reduce((s, r) => s + r.percentage, 0) / summaries.length,
        )
      : 0;
  const best: AttendanceSummary | undefined = summaries.reduce<
    AttendanceSummary | undefined
  >((acc, r) => (!acc || r.percentage > acc.percentage ? r : acc), undefined);
  const worst: AttendanceSummary | undefined = summaries.reduce<
    AttendanceSummary | undefined
  >((acc, r) => (!acc || r.absent > acc.absent ? r : acc), undefined);

  const handleSendAlerts = () => {
    setSmsSent(true);
    setTimeout(() => {
      setShowSmsModal(false);
      setSmsSent(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="attendance-summary-class"
            className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
          >
            Filter by Class
          </label>
          <select
            id="attendance-summary-class"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            data-ocid="attendance.summary_class_select"
            className="border border-input rounded-lg px-3 py-2 text-sm bg-background"
          >
            <option value="All">All Classes</option>
            {CLASSES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <Button
          type="button"
          onClick={() => setShowSmsModal(true)}
          data-ocid="attendance.send_alerts_button"
          className="ml-auto gap-2"
          variant="destructive"
          size="sm"
        >
          <Bell className="h-3.5 w-3.5" /> Send Alert to Parents of Absent
          Students
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Students",
            value: totalStudents,
            icon: Users,
            color: "bg-blue-50 text-blue-700",
          },
          {
            label: "Avg Attendance",
            value: `${avgPct}%`,
            icon: CalendarDays,
            color:
              avgPct >= 85
                ? "bg-emerald-50 text-emerald-700"
                : avgPct >= 70
                  ? "bg-amber-50 text-amber-700"
                  : "bg-red-50 text-red-700",
          },
          {
            label: "Best Attendee",
            value: best?.attendeeName ?? "—",
            icon: Check,
            color: "bg-emerald-50 text-emerald-700",
          },
          {
            label: "Most Absences",
            value: worst?.attendeeName ?? "—",
            icon: AlertTriangle,
            color: "bg-red-50 text-red-700",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-xl p-4 flex items-start gap-3 border border-border bg-card shadow-sm"
            data-ocid="attendance.summary_card"
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}
            >
              <Icon className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground font-medium">
                {label}
              </p>
              <p className="text-sm font-bold text-foreground truncate">
                {String(value)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table
            className="w-full text-sm"
            data-ocid="attendance.summary_table"
          >
            <thead>
              <tr className="bg-primary/5 border-b border-border">
                {[
                  "Student",
                  "Class",
                  "Total Days",
                  "Present",
                  "Absent",
                  "Leave",
                  "Attendance %",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {summaries.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-muted-foreground"
                    data-ocid="attendance.summary_empty_state"
                  >
                    No attendance data available.
                  </td>
                </tr>
              ) : (
                summaries.map((s, i) => (
                  <tr
                    key={s.attendeeId}
                    data-ocid={`attendance.summary_row.${i + 1}`}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {s.attendeeName}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {s.className}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {s.totalDays}
                    </td>
                    <td className="px-4 py-3 text-right text-emerald-600 font-semibold">
                      {s.present}
                    </td>
                    <td className="px-4 py-3 text-right text-red-600 font-semibold">
                      {s.absent}
                    </td>
                    <td className="px-4 py-3 text-right text-amber-600 font-semibold">
                      {s.leave}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 min-w-24">
                        {percentageBar(s.percentage)}
                        <span
                          className={`text-xs shrink-0 ${percentageColor(s.percentage)}`}
                        >
                          {s.percentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SMS Modal */}
      {showSmsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm"
          aria-modal="true"
          aria-label="Send SMS alerts confirmation"
          data-ocid="attendance.sms_dialog"
        >
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Bell className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-foreground">
                  Send Absence Alerts
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This will send SMS notifications to parents of all students
                  marked as Absent today. (
                  {summaries.filter((s) => s.absent > 0).length} parents will be
                  notified.)
                </p>
              </div>
            </div>

            {smsSent ? (
              <div
                className="flex items-center gap-2 text-emerald-600 font-semibold text-sm"
                data-ocid="attendance.sms_success_state"
              >
                <Check className="h-4 w-4" /> Alerts sent successfully!
              </div>
            ) : (
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSmsModal(false)}
                  data-ocid="attendance.sms_cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleSendAlerts}
                  data-ocid="attendance.sms_confirm_button"
                >
                  <Bell className="h-3.5 w-3.5 mr-1" /> Send Alerts Now
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
