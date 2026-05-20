import TeacherLayout from "@/components/portals/TeacherLayout";
import { useAuth } from "@/hooks/useAuth";
import { type AttendanceStudent, useTeacherData } from "@/hooks/useTeacherData";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, QrCode, Save } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/teacher/attendance")({
  component: AttendancePage,
});

// Simple SVG QR-code placeholder (visual grid pattern)
function QRPlaceholder({ data, size = 180 }: { data: string; size?: number }) {
  const cells = 21;
  const cell = size / cells;
  // Deterministic cell fill based on data hash
  const seed = data.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const isBlack = (r: number, c: number) => {
    // Finder patterns
    if (
      (r < 7 && c < 7) ||
      (r < 7 && c >= cells - 7) ||
      (r >= cells - 7 && c < 7)
    )
      return true;
    // Timing pattern
    if (r === 6 || c === 6) return (r + c) % 2 === 0;
    // Data area — pseudo-random from seed
    return (seed * (r + 1) * (c + 1) + r * 7 + c * 3) % 7 < 3;
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="QR Code"
    >
      <rect width={size} height={size} fill="white" />
      {Array.from({ length: cells }, (_, r) =>
        Array.from({ length: cells }, (_, c) =>
          isBlack(r, c) ? (
            <rect
              key={`cell-${r * cells + c}`}
              x={c * cell}
              y={r * cell}
              width={cell}
              height={cell}
              fill="#1e3a5f"
            />
          ) : null,
        ),
      )}
    </svg>
  );
}

function AttendancePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const {
    attendanceSessions,
    updateAttendance,
    markScanned,
    availableClasses,
  } = useTeacherData();

  const [tab, setTab] = useState<"manual" | "qr">("manual");
  const [selectedClass, setSelectedClass] = useState(availableClasses[0]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!currentUser || currentUser.role !== "teacher")
      void navigate({ to: "/login" as never });
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const session =
    attendanceSessions.find((s) => s.class === selectedClass) ??
    attendanceSessions[0];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const statusColor = (status: AttendanceStudent["status"]) =>
    status === "present"
      ? "text-green-600"
      : status === "absent"
        ? "text-red-500"
        : "text-amber-600";

  const countBy = (s: AttendanceStudent["status"]) =>
    session.students.filter((st) => st.status === s).length;

  return (
    <TeacherLayout title="Attendance & QR">
      <div className="space-y-6 max-w-4xl" data-ocid="teacher.attendance.page">
        {/* Controls */}
        <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-5">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label
                htmlFor="att-class"
                className="block text-xs font-semibold text-gray-600 mb-1"
              >
                Class
              </label>
              <select
                id="att-class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                data-ocid="teacher.attendance.class_select"
              >
                {availableClasses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="att-date"
                className="block text-xs font-semibold text-gray-600 mb-1"
              >
                Date
              </label>
              <input
                id="att-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                data-ocid="teacher.attendance.date_input"
              />
            </div>
            {/* Tabs */}
            <div className="flex rounded-lg overflow-hidden border border-gray-200 ml-auto">
              <button
                type="button"
                onClick={() => setTab("manual")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  tab === "manual"
                    ? "bg-[#1e3a5f] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
                data-ocid="teacher.attendance.manual_tab"
              >
                Manual
              </button>
              <button
                type="button"
                onClick={() => setTab("qr")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  tab === "qr"
                    ? "bg-[#1e3a5f] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
                data-ocid="teacher.attendance.qr_tab"
              >
                <QrCode className="h-4 w-4 inline mr-1" />
                QR Code
              </button>
            </div>
          </div>

          {/* Summary Pills */}
          <div className="flex gap-3 mt-4">
            {(["present", "absent", "leave"] as const).map((s) => (
              <span
                key={s}
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  s === "present"
                    ? "bg-green-100 text-green-700"
                    : s === "absent"
                      ? "bg-red-100 text-red-600"
                      : "bg-amber-100 text-amber-700"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}: {countBy(s)}
              </span>
            ))}
          </div>
        </div>

        {/* Manual Attendance */}
        {tab === "manual" && (
          <div
            className="bg-white rounded-xl border border-blue-100 shadow-sm p-5"
            data-ocid="teacher.attendance.manual_panel"
          >
            <h2 className="font-bold text-[#1e3a5f] mb-4">
              {selectedClass} — {selectedDate}
            </h2>
            <div className="divide-y divide-gray-100">
              {session.students.map((student, i) => (
                <div
                  key={student.id}
                  className="flex items-center gap-4 py-3"
                  data-ocid={`teacher.attendance.student.${i + 1}`}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                    {student.rollNumber}
                  </div>
                  <span className="flex-1 text-sm font-medium text-gray-800">
                    {student.name}
                  </span>
                  <div className="flex gap-2">
                    {(["present", "absent", "leave"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() =>
                          updateAttendance(session.id, student.id, s)
                        }
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                          student.status === s
                            ? s === "present"
                              ? "bg-green-500 text-white border-green-500"
                              : s === "absent"
                                ? "bg-red-500 text-white border-red-500"
                                : "bg-amber-500 text-white border-amber-500"
                            : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                  <span
                    className={`text-xs font-semibold w-16 text-right ${statusColor(student.status)}`}
                  >
                    {student.status.charAt(0).toUpperCase() +
                      student.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 bg-[#1e3a5f] hover:bg-[#15304f] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                data-ocid="teacher.attendance.save_button"
              >
                {saved ? (
                  <>
                    <Check className="h-4 w-4" /> Saved!
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save Attendance
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* QR Code Tab */}
        {tab === "qr" && (
          <div
            className="bg-white rounded-xl border border-blue-100 shadow-sm p-6"
            data-ocid="teacher.attendance.qr_panel"
          >
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex flex-col items-center gap-4">
                <p className="text-sm text-gray-500">Scan to mark attendance</p>
                <div className="border-4 border-[#1e3a5f] rounded-2xl p-3 shadow-lg">
                  <QRPlaceholder
                    data={`SSK-ATT-${selectedClass}-${selectedDate}`}
                    size={200}
                  />
                </div>
                <div className="text-center">
                  <div className="text-xs font-mono text-gray-400 bg-gray-50 px-3 py-1 rounded-lg">
                    SSK-ATT-{selectedClass}-{selectedDate}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    QR refreshes daily
                  </p>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-[#1e3a5f] mb-3">
                  Scanned Students (
                  {session.students.filter((s) => s.scannedAt).length}/
                  {session.students.length})
                </h3>
                <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                  {session.students.map((student, i) => (
                    <div
                      key={student.id}
                      className="flex items-center gap-3 py-2.5"
                      data-ocid={`teacher.attendance.qr_student.${i + 1}`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${student.scannedAt ? "bg-green-500" : "bg-gray-200"}`}
                      />
                      <span className="flex-1 text-sm text-gray-700">
                        {student.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {student.scannedAt ?? "—"}
                      </span>
                      {!student.scannedAt && (
                        <button
                          type="button"
                          onClick={() => markScanned(session.id, student.id)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Simulate Scan
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
