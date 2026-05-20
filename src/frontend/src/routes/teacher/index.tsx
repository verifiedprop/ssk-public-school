import TeacherLayout from "@/components/portals/TeacherLayout";
import { useAuth } from "@/hooks/useAuth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarCheck,
  CheckCircle,
  CreditCard,
  Download,
  Edit3,
  QrCode,
  Save,
  Upload,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/teacher/")({
  component: TeacherDashboard,
});

const schedule = [
  {
    period: "Period 1",
    time: "9:00 AM",
    class: "Class 8",
    subject: "Mathematics",
    room: "Room 201",
    done: true,
  },
  {
    period: "Period 2",
    time: "10:00 AM",
    class: "Class 10",
    subject: "Mathematics",
    room: "Room 202",
    done: true,
  },
  {
    period: "Period 3",
    time: "11:00 AM",
    class: "Class 9",
    subject: "Mathematics",
    room: "Room 301",
    done: false,
  },
  {
    period: "Period 4",
    time: "12:00 PM",
    class: "Class 12",
    subject: "Mathematics",
    room: "Room 302",
    done: false,
  },
];

const initialMarks = [
  { id: 1, name: "Aryan Kumar", roll: "22", marks: 87 },
  { id: 2, name: "Priya Patel", roll: "23", marks: 91 },
  { id: 3, name: "Rahul Singh", roll: "24", marks: 76 },
  { id: 4, name: "Sneha Gupta", roll: "25", marks: 94 },
  { id: 5, name: "Ravi Verma", roll: "26", marks: 68 },
];

const salary = {
  basic: 45000,
  hra: 9000,
  da: 4500,
  gross: 58500,
  pf: 5400,
  net: 53100,
};

function TeacherDashboard() {
  const { currentUser, initialized } = useAuth();
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);
  const [marks, setMarks] = useState(initialMarks);
  const [marksSaved, setMarksSaved] = useState(false);
  const [hwClass, setHwClass] = useState("8-A");
  const [hwTitle, setHwTitle] = useState("");
  const [hwDesc, setHwDesc] = useState("");
  const [hwUploaded, setHwUploaded] = useState(false);
  const [idSearch, setIdSearch] = useState("");
  const [idGenerated, setIdGenerated] = useState(false);

  useEffect(() => {
    if (!initialized) return;
    if (!currentUser || currentUser.role !== "teacher")
      void navigate({ to: "/login" as never });
  }, [currentUser, initialized, navigate]);

  if (!initialized || !currentUser) return null;

  function saveMarks(e: React.FormEvent) {
    e.preventDefault();
    setMarksSaved(true);
    setTimeout(() => setMarksSaved(false), 3000);
  }

  function uploadHw(e: React.FormEvent) {
    e.preventDefault();
    setHwUploaded(true);
    setHwTitle("");
    setHwDesc("");
    setTimeout(() => setHwUploaded(false), 3000);
  }

  const idStudent = {
    name: idSearch.trim() || "Aryan Kumar",
    class: "8",
    roll: "22",
    dob: "12 Apr 2010",
  };

  return (
    <TeacherLayout title="Teacher Dashboard">
      <div className="space-y-6 max-w-5xl" data-ocid="teacher.dashboard.page">
        {/* Stats row */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          data-ocid="teacher.stats"
        >
          <div
            className="rounded-xl p-4"
            style={{
              background: "#ffffff",
              border: "1px solid #dbeafe",
              borderLeft: "4px solid #1d4ed8",
            }}
            data-ocid="teacher.stat.classes"
          >
            <div
              className="text-3xl font-bold mb-1"
              style={{ color: "#1e3a8a" }}
            >
              4
            </div>
            <div className="text-sm font-semibold" style={{ color: "#1d4ed8" }}>
              Classes Today
            </div>
            <div className="text-xs mt-0.5" style={{ color: "#93c5fd" }}>
              2 done · 2 upcoming
            </div>
          </div>
          <div
            className="rounded-xl p-4"
            style={{
              background: "#ffffff",
              border: "1px solid #dbeafe",
              borderLeft: "4px solid #16a34a",
            }}
            data-ocid="teacher.stat.present"
          >
            <div
              className="text-3xl font-bold mb-1"
              style={{ color: "#14532d" }}
            >
              42/48
            </div>
            <div className="text-sm font-semibold" style={{ color: "#1d4ed8" }}>
              Students Present
            </div>
            <div className="text-xs mt-0.5" style={{ color: "#93c5fd" }}>
              87.5% today
            </div>
          </div>
          <div
            className="rounded-xl p-4"
            style={{
              background: "#ffffff",
              border: "1px solid #dbeafe",
              borderLeft: "4px solid #d97706",
            }}
            data-ocid="teacher.stat.marks"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl font-bold" style={{ color: "#d97706" }}>
                7
              </span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: "#fef9c3", color: "#854d0e" }}
              >
                Pending
              </span>
            </div>
            <div className="text-sm font-semibold" style={{ color: "#1d4ed8" }}>
              Homework Review
            </div>
            <div className="text-xs mt-0.5" style={{ color: "#93c5fd" }}>
              Submitted by students
            </div>
          </div>
          <div
            className="rounded-xl p-4"
            style={{
              background: "#ffffff",
              border: "1px solid #dbeafe",
              borderLeft: "4px solid #16a34a",
            }}
            data-ocid="teacher.stat.salary"
          >
            <div
              className="text-3xl font-bold mb-1"
              style={{ color: "#14532d" }}
            >
              Paid
            </div>
            <div className="text-sm font-semibold" style={{ color: "#1d4ed8" }}>
              Salary Status
            </div>
            <div className="text-xs mt-0.5" style={{ color: "#93c5fd" }}>
              May 2026 — Credited
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "#ffffff", border: "1px solid #dbeafe" }}
          data-ocid="teacher.schedule_section"
        >
          <div
            className="px-5 py-4 flex items-center justify-between border-b"
            style={{ borderColor: "#dbeafe", background: "#eff6ff" }}
          >
            <div className="flex items-center gap-2">
              <CalendarCheck size={18} style={{ color: "#1d4ed8" }} />
              <h2 className="font-semibold" style={{ color: "#1e3a8a" }}>
                Today's Schedule
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowQR((v) => !v)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "#1e3a8a" }}
              data-ocid="teacher.generate_qr_button"
            >
              <QrCode size={14} /> QR Attendance
            </button>
          </div>

          {showQR && (
            <div
              className="px-5 py-4 flex items-center gap-4 border-b"
              style={{ borderColor: "#dbeafe", background: "#eff6ff" }}
              data-ocid="teacher.qr_display"
            >
              <div
                className="w-20 h-20 rounded-lg flex items-center justify-center"
                style={{ background: "#ffffff", border: "2px solid #93c5fd" }}
              >
                <QrCode size={48} style={{ color: "#1e3a8a" }} />
              </div>
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#1e3a8a" }}
                >
                  Scan to Mark Attendance
                </p>
                <p className="text-xs mt-1" style={{ color: "#1d4ed8" }}>
                  Valid for today · All classes · Students scan with phone
                </p>
              </div>
            </div>
          )}

          <div className="divide-y" style={{ borderColor: "#eff6ff" }}>
            {schedule.map((s, i) => (
              <div
                key={s.period}
                className="px-5 py-3 flex items-center gap-4"
                data-ocid={`teacher.schedule.item.${i + 1}`}
              >
                <div className="w-20 flex-shrink-0">
                  <p className="text-xs font-bold" style={{ color: "#1e3a8a" }}>
                    {s.time}
                  </p>
                  <p className="text-xs" style={{ color: "#93c5fd" }}>
                    {s.period}
                  </p>
                </div>
                <div className="flex-1">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#1e3a8a" }}
                  >
                    {s.subject}
                  </p>
                  <p className="text-xs" style={{ color: "#1d4ed8" }}>
                    Class {s.class} · {s.room}
                  </p>
                </div>
                {s.done ? (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle size={16} style={{ color: "#16a34a" }} />
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "#16a34a" }}
                    >
                      Done
                    </span>
                  </div>
                ) : (
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: "#dbeafe", color: "#1e3a8a" }}
                  >
                    Upcoming
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Homework */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: "#ffffff", border: "1px solid #dbeafe" }}
            data-ocid="teacher.homework_section"
          >
            <div
              className="px-5 py-4 flex items-center gap-2 border-b"
              style={{ borderColor: "#dbeafe", background: "#eff6ff" }}
            >
              <Upload size={18} style={{ color: "#1d4ed8" }} />
              <h2 className="font-semibold" style={{ color: "#1e3a8a" }}>
                Upload Homework
              </h2>
            </div>
            <form onSubmit={uploadHw} className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="hw_class"
                    className="block text-xs font-medium mb-1"
                    style={{ color: "#1d4ed8" }}
                  >
                    Class
                  </label>
                  <select
                    id="hw_class"
                    value={hwClass}
                    onChange={(e) => setHwClass(e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                    style={{
                      border: "1px solid #93c5fd",
                      color: "#1e3a8a",
                      background: "#eff6ff",
                    }}
                    data-ocid="teacher.hw_class_select"
                  >
                    {[
                      "Class 6",
                      "Class 7",
                      "Class 8",
                      "Class 9",
                      "Class 10",
                      "Class 11",
                      "Class 12",
                    ].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="hw_subject"
                    className="block text-xs font-medium mb-1"
                    style={{ color: "#1d4ed8" }}
                  >
                    Subject
                  </label>
                  <input
                    id="hw_subject"
                    type="text"
                    readOnly
                    defaultValue="Mathematics"
                    className="w-full rounded-lg px-3 py-2 text-sm"
                    style={{
                      border: "1px solid #93c5fd",
                      color: "#1e3a8a",
                      background: "#dbeafe",
                    }}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="hw_title"
                  className="block text-xs font-medium mb-1"
                  style={{ color: "#1d4ed8" }}
                >
                  Title
                </label>
                <input
                  id="hw_title"
                  type="text"
                  value={hwTitle}
                  onChange={(e) => setHwTitle(e.target.value)}
                  placeholder="e.g. Exercise 5.3 — Quadratic Equations"
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  style={{
                    border: "1px solid #93c5fd",
                    color: "#1e3a8a",
                    background: "#ffffff",
                  }}
                  data-ocid="teacher.hw_title_input"
                />
              </div>
              <div>
                <label
                  htmlFor="hw_desc"
                  className="block text-xs font-medium mb-1"
                  style={{ color: "#1d4ed8" }}
                >
                  Instructions
                </label>
                <textarea
                  id="hw_desc"
                  rows={2}
                  value={hwDesc}
                  onChange={(e) => setHwDesc(e.target.value)}
                  placeholder="Instructions for students…"
                  className="w-full rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2"
                  style={{
                    border: "1px solid #93c5fd",
                    color: "#1e3a8a",
                    background: "#ffffff",
                  }}
                  data-ocid="teacher.hw_desc_textarea"
                />
              </div>
              <div
                className="rounded-lg border-2 border-dashed p-4 text-center"
                style={{ borderColor: "#93c5fd" }}
                data-ocid="teacher.hw_file_dropzone"
              >
                <Upload
                  size={20}
                  className="mx-auto mb-1"
                  style={{ color: "#93c5fd" }}
                />
                <p className="text-xs" style={{ color: "#1d4ed8" }}>
                  Drag & drop a file or click to select
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#93c5fd" }}>
                  PDF, DOC, JPG up to 10MB
                </p>
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "#1e3a8a" }}
                data-ocid="teacher.upload_hw_button"
              >
                <Upload size={15} /> Upload Assignment
              </button>
              {hwUploaded && (
                <p
                  className="text-xs font-semibold text-center"
                  style={{ color: "#16a34a" }}
                  data-ocid="teacher.hw_success_state"
                >
                  ✓ Assignment uploaded successfully!
                </p>
              )}
            </form>
          </div>

          {/* Marks Entry */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: "#ffffff", border: "1px solid #dbeafe" }}
            data-ocid="teacher.marks_section"
          >
            <div
              className="px-5 py-4 flex items-center gap-2 border-b"
              style={{ borderColor: "#dbeafe", background: "#eff6ff" }}
            >
              <Edit3 size={18} style={{ color: "#1d4ed8" }} />
              <h2 className="font-semibold" style={{ color: "#1e3a8a" }}>
                Marks Entry — Class 8
              </h2>
            </div>
            <form onSubmit={saveMarks}>
              <div
                className="px-5 py-3 flex gap-2 border-b"
                style={{ borderColor: "#eff6ff" }}
              >
                <select
                  className="rounded-lg px-2 py-1.5 text-xs flex-1"
                  style={{
                    border: "1px solid #93c5fd",
                    color: "#1e3a8a",
                    background: "#eff6ff",
                  }}
                  data-ocid="teacher.marks_class_select"
                >
                  {[
                    "Class 6",
                    "Class 7",
                    "Class 8",
                    "Class 9",
                    "Class 10",
                    "Class 11",
                    "Class 12",
                  ].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <select
                  className="rounded-lg px-2 py-1.5 text-xs flex-1"
                  style={{
                    border: "1px solid #93c5fd",
                    color: "#1e3a8a",
                    background: "#eff6ff",
                  }}
                  data-ocid="teacher.marks_exam_select"
                >
                  {["Unit Test", "Mid-Term", "Final Exam"].map((e) => (
                    <option key={e}>{e}</option>
                  ))}
                </select>
              </div>
              <div className="divide-y" style={{ borderColor: "#eff6ff" }}>
                {marks.map((m, i) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between px-5 py-2.5"
                    data-ocid={`teacher.marks.item.${i + 1}`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: "#dbeafe", color: "#1e3a8a" }}
                      >
                        {m.name.slice(0, 1)}
                      </div>
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: "#1e3a8a" }}
                        >
                          {m.name}
                        </p>
                        <p className="text-xs" style={{ color: "#93c5fd" }}>
                          Roll {m.roll}
                        </p>
                      </div>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={m.marks}
                      onChange={(e) =>
                        setMarks((prev) =>
                          prev.map((s) =>
                            s.id === m.id
                              ? { ...s, marks: Number(e.target.value) }
                              : s,
                          ),
                        )
                      }
                      className="w-16 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2"
                      style={{
                        border: "1px solid #93c5fd",
                        color: "#1e3a8a",
                        background: "#eff6ff",
                      }}
                      data-ocid={`teacher.marks_input.${i + 1}`}
                    />
                  </div>
                ))}
              </div>
              <div className="px-5 py-4">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: "#1e3a8a" }}
                  data-ocid="teacher.save_marks_button"
                >
                  <Save size={15} /> Save Marks
                </button>
                {marksSaved && (
                  <p
                    className="text-xs font-semibold text-center mt-2"
                    style={{ color: "#16a34a" }}
                    data-ocid="teacher.marks_success_state"
                  >
                    ✓ Marks saved successfully!
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ID Card Generator */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: "#ffffff", border: "1px solid #dbeafe" }}
            data-ocid="teacher.id_card_section"
          >
            <div
              className="px-5 py-4 flex items-center gap-2 border-b"
              style={{ borderColor: "#dbeafe", background: "#eff6ff" }}
            >
              <User size={18} style={{ color: "#1d4ed8" }} />
              <h2 className="font-semibold" style={{ color: "#1e3a8a" }}>
                Student ID Card Generator
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label
                  htmlFor="id_search"
                  className="block text-xs font-medium mb-1"
                  style={{ color: "#1d4ed8" }}
                >
                  Student Name or Roll No.
                </label>
                <div className="flex gap-2">
                  <input
                    id="id_search"
                    type="text"
                    value={idSearch}
                    onChange={(e) => setIdSearch(e.target.value)}
                    placeholder="e.g. Aryan Kumar or Roll 22"
                    className="flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                    style={{
                      border: "1px solid #93c5fd",
                      color: "#1e3a8a",
                      background: "#eff6ff",
                    }}
                    data-ocid="teacher.id_search_input"
                  />
                  <button
                    type="button"
                    onClick={() => setIdGenerated(true)}
                    className="px-3 py-2 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: "#1e3a8a" }}
                    data-ocid="teacher.generate_id_button"
                  >
                    Generate
                  </button>
                </div>
              </div>

              {/* ID Card Preview */}
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: "2px solid #93c5fd" }}
              >
                <div
                  className="p-3 text-center"
                  style={{ background: "#1e3a8a" }}
                >
                  <p
                    className="text-xs font-bold tracking-wide"
                    style={{ color: "#dbeafe" }}
                  >
                    SSK PUBLIC SCHOOL
                  </p>
                  <p className="text-xs" style={{ color: "#93c5fd" }}>
                    Lucknow, Uttar Pradesh
                  </p>
                </div>
                <div
                  className="p-4 flex gap-4 items-center"
                  style={{ background: "#ffffff" }}
                >
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "#dbeafe",
                      border: "2px solid #93c5fd",
                    }}
                  >
                    <User size={28} style={{ color: "#1e3a8a" }} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-sm font-bold"
                      style={{ color: "#1e3a8a" }}
                    >
                      {idStudent.name}
                    </p>
                    <p className="text-xs" style={{ color: "#1d4ed8" }}>
                      Class: {idStudent.class} · Roll No: {idStudent.roll}
                    </p>
                    <p className="text-xs" style={{ color: "#1d4ed8" }}>
                      DOB: {idStudent.dob}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#93c5fd" }}>
                      AY 2025–26
                    </p>
                  </div>
                </div>
                <div
                  className="p-2 text-center"
                  style={{ background: "#1e3a8a" }}
                >
                  <p className="text-xs" style={{ color: "#93c5fd" }}>
                    If found, return to: SSK Public School, Lucknow
                  </p>
                </div>
              </div>

              {idGenerated && (
                <p
                  className="text-xs font-semibold"
                  style={{ color: "#16a34a" }}
                  data-ocid="teacher.id_success_state"
                >
                  ✓ ID Card generated! Click Print to download.
                </p>
              )}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "#1e3a8a" }}
                data-ocid="teacher.print_id_button"
              >
                🖨️ Print ID Card
              </button>
            </div>
          </div>

          {/* Salary Slip */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: "#ffffff", border: "1px solid #dbeafe" }}
            data-ocid="teacher.salary_section"
          >
            <div
              className="px-5 py-4 flex items-center gap-2 border-b"
              style={{ borderColor: "#dbeafe", background: "#eff6ff" }}
            >
              <CreditCard size={18} style={{ color: "#1d4ed8" }} />
              <h2 className="font-semibold" style={{ color: "#1e3a8a" }}>
                Salary Slip — May 2026
              </h2>
              <span
                className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "#dcfce7", color: "#14532d" }}
              >
                ✓ Credited
              </span>
            </div>
            <div className="p-5 space-y-2">
              <div
                className="rounded-lg p-3 space-y-2"
                style={{ background: "#eff6ff" }}
              >
                {[
                  {
                    label: "Basic Salary",
                    value: salary.basic,
                    color: "#1e3a8a",
                  },
                  {
                    label: "HRA (House Rent Allowance)",
                    value: salary.hra,
                    color: "#1e3a8a",
                  },
                  {
                    label: "Dearness Allowance (DA)",
                    value: salary.da,
                    color: "#1e3a8a",
                  },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between text-sm">
                    <span style={{ color: "#1d4ed8" }}>{row.label}</span>
                    <span
                      className="font-semibold"
                      style={{ color: row.color }}
                    >
                      ₹{row.value.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div
                  className="border-t pt-2 flex justify-between text-sm font-bold"
                  style={{ borderColor: "#93c5fd" }}
                >
                  <span style={{ color: "#1e3a8a" }}>Total Gross</span>
                  <span style={{ color: "#1e3a8a" }}>
                    ₹{salary.gross.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-sm px-1">
                <span style={{ color: "#dc2626" }}>PF Deduction</span>
                <span className="font-semibold" style={{ color: "#dc2626" }}>
                  − ₹{salary.pf.toLocaleString()}
                </span>
              </div>
              <div
                className="rounded-lg p-3 flex justify-between items-center"
                style={{ background: "#1e3a8a" }}
              >
                <span
                  className="text-sm font-bold"
                  style={{ color: "#dbeafe" }}
                >
                  Net Salary
                </span>
                <span
                  className="text-xl font-bold"
                  style={{ color: "#ffffff" }}
                >
                  ₹{salary.net.toLocaleString()}
                </span>
              </div>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
                style={{
                  background: "#dbeafe",
                  color: "#1e3a8a",
                  border: "1px solid #93c5fd",
                }}
                data-ocid="teacher.download_payslip_button"
              >
                <Download size={15} /> Download Salary Slip
              </button>
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
