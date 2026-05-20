import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/hooks/useAuth";
import {
  type ExamResult,
  type Grade,
  type SubjectMark,
  addResult,
  deleteResult,
  getGradeDistribution,
  getToppers,
  useResults,
} from "@/hooks/useResults";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/admin/results")({
  component: ResultsPage,
});

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
const EXAMS = ["Unit Test 1", "Mid Term", "Final Exam", "Pre-Board"];
const DEFAULT_SUBJECTS = [
  "Maths",
  "Science",
  "English",
  "Hindi",
  "Social Studies",
];

// Sample students per class for mark entry
const CLASS_STUDENTS: Record<string, { id: string; name: string }[]> = {
  "Class 9-B": [
    { id: "s1", name: "Aarav Mehta" },
    { id: "s2", name: "Priya Singh" },
    { id: "s3", name: "Rohan Gupta" },
    { id: "s4", name: "Sneha Patel" },
    { id: "s9", name: "Arjun Nair" },
  ],
  "Class 10-A": [
    { id: "s5", name: "Aryan Sharma" },
    { id: "s6", name: "Kavya Reddy" },
    { id: "s7", name: "Vikram Joshi" },
    { id: "s8", name: "Nisha Verma" },
    { id: "s10", name: "Tanvi Kapoor" },
  ],
  "Class 11-A": [
    { id: "s11", name: "Rahul Tiwari" },
    { id: "s12", name: "Anjali Rao" },
    { id: "s13", name: "Dev Malhotra" },
    { id: "s14", name: "Pooja Agarwal" },
  ],
  "Class 12-A": [
    { id: "s15", name: "Siddharth Kumar" },
    { id: "s16", name: "Meera Iyer" },
    { id: "s17", name: "Karan Bhatia" },
    { id: "s18", name: "Ritika Shah" },
  ],
};

function calcGrade(pct: number): Grade {
  if (pct >= 95) return "APlusPlus";
  if (pct >= 90) return "APlus";
  if (pct >= 80) return "A";
  if (pct >= 70) return "BPlus";
  if (pct >= 60) return "B";
  if (pct >= 50) return "CPlus";
  if (pct >= 40) return "C";
  if (pct >= 33) return "D";
  return "F";
}

function gradeLabel(g: Grade) {
  const MAP: Record<Grade, string> = {
    APlusPlus: "A++",
    APlus: "A+",
    A: "A",
    BPlus: "B+",
    B: "B",
    CPlus: "C+",
    C: "C",
    D: "D",
    F: "F",
  };
  return MAP[g];
}

function gradeBadgeClass(g: Grade) {
  if (g === "APlusPlus" || g === "APlus" || g === "A")
    return "bg-green-100 text-green-700 border border-green-200";
  if (g === "BPlus" || g === "B")
    return "bg-blue-100 text-blue-700 border border-blue-200";
  if (g === "CPlus" || g === "C")
    return "bg-yellow-100 text-yellow-700 border border-yellow-200";
  if (g === "D")
    return "bg-orange-100 text-orange-700 border border-orange-200";
  return "bg-red-100 text-red-700 border border-red-200";
}

function gradeBarColor(g: Grade) {
  if (g === "APlusPlus") return "bg-green-600";
  if (g === "APlus") return "bg-green-500";
  if (g === "A") return "bg-green-400";
  if (g === "BPlus") return "bg-blue-500";
  if (g === "B") return "bg-blue-400";
  if (g === "CPlus") return "bg-yellow-500";
  if (g === "C") return "bg-yellow-400";
  if (g === "D") return "bg-orange-500";
  return "bg-red-500";
}

// ─── Tab 1: Enter Marks ───────────────────────────────────────────────────────
function EnterMarksTab() {
  const [examName, setExamName] = useState(EXAMS[0]);
  const [customExam, setCustomExam] = useState("");
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [subjects, _setSubjects] = useState(DEFAULT_SUBJECTS);
  const [totalMarksPerSubject, setTotalMarksPerSubject] = useState<number[]>(
    DEFAULT_SUBJECTS.map(() => 100),
  );
  const [marksGrid, setMarksGrid] = useState<Record<string, number[]>>({});
  const [toast, setToast] = useState("");

  const finalExamName = examName === "__custom" ? customExam : examName;
  const students = CLASS_STUDENTS[selectedClass] ?? [];

  const getMarks = (studentId: string) =>
    marksGrid[studentId] ?? subjects.map(() => 0);

  const setMark = (studentId: string, subIdx: number, value: number) => {
    setMarksGrid((prev) => {
      const row = prev[studentId] ?? subjects.map(() => 0);
      const updated = [...row];
      updated[subIdx] = value;
      return { ...prev, [studentId]: updated };
    });
  };

  const computeRow = (studentId: string) => {
    const marks = getMarks(studentId);
    const obtained = marks.reduce((a, b) => a + b, 0);
    const total = totalMarksPerSubject.reduce((a, b) => a + b, 0);
    const pct = total > 0 ? Math.round((obtained / total) * 10000) / 100 : 0;
    return { obtained, total, pct, grade: calcGrade(pct) };
  };

  const handleSaveAll = () => {
    if (!finalExamName.trim()) {
      setToast("Please enter an exam name.");
      setTimeout(() => setToast(""), 3000);
      return;
    }
    for (const student of students) {
      const marks = getMarks(student.id);
      const subjectMarks: SubjectMark[] = subjects.map((subject, i) => ({
        subject,
        marksObtained: marks[i] ?? 0,
        totalMarks: totalMarksPerSubject[i] ?? 100,
      }));
      addResult({
        studentId: student.id,
        studentName: student.name,
        className: selectedClass,
        examName: finalExamName.trim(),
        subjects: subjectMarks,
      });
    }
    setToast(
      `Results saved for ${students.length} students in ${selectedClass} — ${finalExamName}!`,
    );
    setTimeout(() => setToast(""), 4000);
    setMarksGrid({});
  };

  return (
    <div className="space-y-6" data-ocid="results.enter_marks">
      {toast && (
        <div
          className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 text-green-800 font-semibold text-sm flex items-center gap-2"
          data-ocid="results.success_state"
        >
          ✅ {toast}
        </div>
      )}

      {/* Exam & Class selectors */}
      <div className="bg-white rounded-xl border border-blue-100 p-5 shadow-sm">
        <h3 className="text-blue-900 font-bold text-base mb-4">Exam Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="results-exam-name"
              className="block text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1.5"
            >
              Exam Name
            </label>
            <select
              id="results-exam-name"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="w-full border border-blue-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              data-ocid="results.exam_select"
            >
              {EXAMS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
              <option value="__custom">Custom…</option>
            </select>
            {examName === "__custom" && (
              <input
                type="text"
                value={customExam}
                onChange={(e) => setCustomExam(e.target.value)}
                placeholder="Type exam name…"
                className="mt-2 w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                data-ocid="results.custom_exam_input"
              />
            )}
          </div>
          <div>
            <label
              htmlFor="results-class"
              className="block text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1.5"
            >
              Class
            </label>
            <select
              id="results-class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full border border-blue-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              data-ocid="results.class_select"
            >
              {CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Subject total marks row */}
        <div className="mt-5">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">
            Subject / Total Marks
          </p>
          <div className="flex flex-wrap gap-3">
            {subjects.map((sub, i) => (
              <div key={sub} className="flex flex-col items-center gap-1">
                <span className="text-xs text-blue-600 font-medium">{sub}</span>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={totalMarksPerSubject[i]}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setTotalMarksPerSubject((prev) => {
                      const next = [...prev];
                      next[i] = v;
                      return next;
                    });
                  }}
                  className="w-16 border border-blue-200 rounded px-2 py-1 text-sm text-center focus:ring-1 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marks entry grid */}
      <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
        <div className="bg-blue-900 px-5 py-3">
          <p className="text-white font-bold text-sm">
            {selectedClass} — {finalExamName || "(exam name)"} — Mark Entry
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-blue-50 border-b border-blue-100">
              <tr>
                <th className="px-4 py-3 text-left text-blue-900 font-semibold text-xs uppercase tracking-wide min-w-[140px]">
                  Student
                </th>
                {subjects.map((s) => (
                  <th
                    key={s}
                    className="px-3 py-3 text-center text-blue-900 font-semibold text-xs uppercase tracking-wide min-w-[80px]"
                  >
                    {s}
                  </th>
                ))}
                <th className="px-3 py-3 text-center text-blue-900 font-semibold text-xs uppercase tracking-wide">
                  Total
                </th>
                <th className="px-3 py-3 text-center text-blue-900 font-semibold text-xs uppercase tracking-wide">
                  %
                </th>
                <th className="px-3 py-3 text-center text-blue-900 font-semibold text-xs uppercase tracking-wide">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, rowIdx) => {
                const { obtained, total, pct, grade } = computeRow(student.id);
                const marks = getMarks(student.id);
                return (
                  <tr
                    key={student.id}
                    className="border-t border-blue-50 hover:bg-blue-50/40 transition-colors"
                    data-ocid={`results.student_row.${rowIdx + 1}`}
                  >
                    <td className="px-4 py-2.5 font-medium text-blue-900 whitespace-nowrap">
                      {student.name}
                    </td>
                    {subjects.map((subj, si) => (
                      <td key={`${student.id}-${subj}`} className="px-2 py-2.5">
                        <input
                          type="number"
                          min={0}
                          max={totalMarksPerSubject[si]}
                          value={marks[si] ?? 0}
                          onChange={(e) =>
                            setMark(student.id, si, Number(e.target.value))
                          }
                          className="w-16 border border-blue-200 rounded px-2 py-1 text-sm text-center focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                    ))}
                    <td className="px-3 py-2.5 text-center font-bold text-blue-900">
                      {obtained}/{total}
                    </td>
                    <td className="px-3 py-2.5 text-center font-semibold text-blue-800">
                      {pct}%
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${gradeBadgeClass(grade)}`}
                      >
                        {gradeLabel(grade)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-4 border-t border-blue-100 flex justify-end">
          <button
            type="button"
            onClick={handleSaveAll}
            className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
            data-ocid="results.save_all_button"
          >
            💾 Save All Results
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Print Report Card ────────────────────────────────────────────────────────
function PrintReportCard({
  result,
  onClose,
}: { result: ExamResult; onClose: () => void }) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML ?? "";
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Report Card</title>
      <style>body{font-family:Georgia,serif;margin:20px;color:#111} table{width:100%;border-collapse:collapse} td,th{border:1px solid #999;padding:8px 12px} th{background:#f5f5f5;font-weight:700} h1{font-size:22px;text-align:center;margin:0} h2{font-size:16px;text-align:center;margin:4px 0 0} p{text-align:center;margin:2px 0} .stamp{font-size:36px;font-weight:900;text-align:center;margin-top:20px;letter-spacing:2px;padding:10px 24px;display:inline-block;border:4px solid currentColor;border-radius:6px}</style></head><body>${printContent}</body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      data-ocid="results.dialog"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-100">
          <h2 className="font-bold text-blue-900 text-lg">
            Report Card Preview
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-blue-400 hover:text-blue-700 font-bold text-xl"
            data-ocid="results.close_button"
          >
            ✕
          </button>
        </div>

        {/* Printable content */}
        <div ref={printRef} className="p-6">
          <h1 className="text-2xl font-black text-center text-blue-900">
            SSK PUBLIC SCHOOL
          </h1>
          <p className="text-center text-sm text-blue-600 mt-1">
            Sector 14, Gurugram, Haryana — Ph: 0124-XXXXXXX
          </p>
          <hr className="my-3 border-yellow-400 border-2" />
          <h2 className="text-center text-xl font-bold text-blue-800 mb-4">
            PROGRESS REPORT CARD
          </h2>

          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm mb-5">
            <div>
              <span className="font-semibold text-blue-700">Student Name:</span>{" "}
              <span className="text-blue-900 font-bold">
                {result.studentName}
              </span>
            </div>
            <div>
              <span className="font-semibold text-blue-700">Class:</span>{" "}
              {result.className}
            </div>
            <div>
              <span className="font-semibold text-blue-700">Exam:</span>{" "}
              {result.examName}
            </div>
            <div>
              <span className="font-semibold text-blue-700">Date:</span>{" "}
              {new Date(result.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          <table className="w-full text-sm border-collapse mb-4">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-blue-200 px-3 py-2 text-left">
                  Subject
                </th>
                <th className="border border-blue-200 px-3 py-2 text-center">
                  Marks Obtained
                </th>
                <th className="border border-blue-200 px-3 py-2 text-center">
                  Total Marks
                </th>
                <th className="border border-blue-200 px-3 py-2 text-center">
                  %
                </th>
              </tr>
            </thead>
            <tbody>
              {result.subjects.map((s) => (
                <tr key={s.subject}>
                  <td className="border border-blue-100 px-3 py-2">
                    {s.subject}
                  </td>
                  <td className="border border-blue-100 px-3 py-2 text-center font-bold">
                    {s.marksObtained}
                  </td>
                  <td className="border border-blue-100 px-3 py-2 text-center">
                    {s.totalMarks}
                  </td>
                  <td className="border border-blue-100 px-3 py-2 text-center">
                    {s.totalMarks > 0
                      ? Math.round((s.marksObtained / s.totalMarks) * 100)
                      : 0}
                    %
                  </td>
                </tr>
              ))}
              <tr className="bg-blue-50 font-bold">
                <td className="border border-blue-200 px-3 py-2 font-black">
                  TOTAL
                </td>
                <td className="border border-blue-200 px-3 py-2 text-center font-black">
                  {result.totalObtained}
                </td>
                <td className="border border-blue-200 px-3 py-2 text-center font-black">
                  {result.totalMaximum}
                </td>
                <td className="border border-blue-200 px-3 py-2 text-center font-black">
                  {result.percentage}%
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex items-center justify-between mt-4">
            <div>
              <p className="text-sm font-semibold text-blue-700">
                Overall Grade:{" "}
                <span
                  className={`px-2 py-0.5 rounded text-sm font-black ${gradeBadgeClass(result.grade)}`}
                >
                  {gradeLabel(result.grade)}
                </span>
              </p>
            </div>
            <div
              className={`text-2xl font-black px-5 py-2 border-4 rounded-lg ${result.grade === "F" ? "text-red-600 border-red-600" : "text-green-700 border-green-600"}`}
            >
              {result.grade === "F" ? "FAIL" : "PASS"}
            </div>
          </div>

          <div className="mt-8 flex justify-between text-xs text-blue-600 border-t border-blue-100 pt-4">
            <span>Class Teacher Signature: ______________</span>
            <span>Principal Signature: ______________</span>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-blue-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-blue-200 text-blue-700 font-semibold text-sm hover:bg-blue-50 transition-colors"
            data-ocid="results.cancel_button"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-xl font-bold text-sm transition-colors"
            data-ocid="results.confirm_button"
          >
            🖨️ Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 2: View Results ──────────────────────────────────────────────────────
function ViewResultsTab() {
  const results = useResults();
  const [examFilter, setExamFilter] = useState("All");
  const [classFilter, setClassFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [printResult, setPrintResult] = useState<ExamResult | null>(null);

  const examNames = [
    "All",
    ...Array.from(new Set(results.map((r) => r.examName))),
  ];
  const classNames = ["All", ...CLASSES];

  const filtered = results.filter((r) => {
    if (examFilter !== "All" && r.examName !== examFilter) return false;
    if (classFilter !== "All" && r.className !== classFilter) return false;
    if (search && !r.studentName.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="space-y-5" data-ocid="results.view_results">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-blue-100 p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value)}
            className="border border-blue-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
            data-ocid="results.view_exam_select"
          >
            {examNames.map((e) => (
              <option key={e} value={e}>
                {e === "All" ? "All Exams" : e}
              </option>
            ))}
          </select>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="border border-blue-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
            data-ocid="results.view_class_select"
          >
            {classNames.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Classes" : c}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student name…"
            className="border border-blue-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
            data-ocid="results.search_input"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
          <p className="text-blue-900 font-semibold text-sm">
            {filtered.length} result(s)
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-blue-50 border-b border-blue-100">
              <tr>
                {[
                  "Student",
                  "Class",
                  "Exam",
                  "Total",
                  "%",
                  "Grade",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-blue-900 font-semibold text-xs uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-blue-400"
                    data-ocid="results.empty_state"
                  >
                    No results found.
                  </td>
                </tr>
              ) : (
                filtered.map((r, i) => (
                  <tr
                    key={r.id}
                    className="border-t border-blue-50 hover:bg-blue-50/40 transition-colors"
                    data-ocid={`results.item.${i + 1}`}
                  >
                    <td className="px-4 py-3 font-medium text-blue-900 whitespace-nowrap">
                      {r.studentName}
                    </td>
                    <td className="px-4 py-3 text-blue-600">{r.className}</td>
                    <td className="px-4 py-3 text-blue-600">{r.examName}</td>
                    <td className="px-4 py-3 text-blue-800 font-semibold">
                      {r.totalObtained}/{r.totalMaximum}
                    </td>
                    <td className="px-4 py-3 font-bold text-blue-900">
                      {r.percentage}%
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${gradeBadgeClass(r.grade)}`}
                      >
                        {gradeLabel(r.grade)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPrintResult(r)}
                          className="text-blue-600 hover:text-blue-900 text-xs font-bold whitespace-nowrap"
                          data-ocid={`results.print_button.${i + 1}`}
                        >
                          🖨️ Report Card
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Delete this result?"))
                              deleteResult(r.id);
                          }}
                          className="text-red-500 hover:text-red-700 text-xs font-bold"
                          data-ocid={`results.delete_button.${i + 1}`}
                        >
                          Delete
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

      {printResult && (
        <PrintReportCard
          result={printResult}
          onClose={() => setPrintResult(null)}
        />
      )}
    </div>
  );
}

// ─── Tab 3: Toppers ───────────────────────────────────────────────────────────
function ToppersTab() {
  const [examFilter, setExamFilter] = useState(EXAMS[0]);
  const [classFilter, setClassFilter] = useState("All");

  const toppers = getToppers(examFilter, classFilter);
  const avg =
    toppers.length > 0
      ? Math.round(
          (toppers.reduce((a, b) => a + b.percentage, 0) / toppers.length) * 10,
        ) / 10
      : 0;

  const medalEmoji = ["🥇", "🥈", "🥉"];

  return (
    <div className="space-y-5" data-ocid="results.toppers">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-blue-100 p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value)}
            className="border border-blue-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
            data-ocid="results.toppers_exam_select"
          >
            {EXAMS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="border border-blue-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
            data-ocid="results.toppers_class_select"
          >
            <option value="All">All Classes</option>
            {CLASSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {toppers.length === 0 ? (
        <div
          className="bg-white rounded-xl border border-blue-100 p-12 text-center text-blue-400 shadow-sm"
          data-ocid="results.toppers_empty_state"
        >
          No results available for the selected exam/class combination.
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 p-4 shadow-sm">
              <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide mb-1">
                Class Average
              </p>
              <p className="text-2xl font-black text-yellow-800">{avg}%</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-4 shadow-sm">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                Top Score
              </p>
              <p className="text-2xl font-black text-blue-900">
                {toppers[0]?.percentage ?? 0}%
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-4 shadow-sm">
              <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
                Top Grade
              </p>
              <p className="text-2xl font-black text-green-800">
                {toppers[0] ? gradeLabel(toppers[0].grade) : "—"}
              </p>
            </div>
          </div>

          {/* Toppers table */}
          <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
            <div className="bg-blue-900 px-5 py-3">
              <p className="text-white font-bold text-sm">
                🏆 Top Performers — {examFilter}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-50 border-b border-blue-100">
                  <tr>
                    {[
                      "Rank",
                      "Student",
                      "Class",
                      "Total Marks",
                      "Percentage",
                      "Grade",
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
                  {toppers.map((t, i) => (
                    <tr
                      key={t.id}
                      className={`border-t border-blue-50 ${i === 0 ? "bg-yellow-50" : i === 1 ? "bg-blue-50/40" : i === 2 ? "bg-orange-50/30" : ""} transition-colors`}
                      data-ocid={`results.topper_row.${i + 1}`}
                    >
                      <td className="px-4 py-3 font-black text-xl">
                        {medalEmoji[i] ?? `#${i + 1}`}
                      </td>
                      <td className="px-4 py-3 font-bold text-blue-900">
                        {t.studentName}
                      </td>
                      <td className="px-4 py-3 text-blue-600">{t.className}</td>
                      <td className="px-4 py-3 font-semibold text-blue-800">
                        {t.totalObtained}/{t.totalMaximum}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 rounded-full bg-blue-200 flex-1 max-w-[80px] overflow-hidden">
                            <div
                              className="h-full bg-blue-700 rounded-full"
                              style={{ width: `${t.percentage}%` }}
                            />
                          </div>
                          <span className="font-bold text-blue-900">
                            {t.percentage}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${gradeBadgeClass(t.grade)}`}
                        >
                          {gradeLabel(t.grade)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Tab 4: Grade Distribution ────────────────────────────────────────────────
const GRADE_ORDER: Grade[] = [
  "APlusPlus",
  "APlus",
  "A",
  "BPlus",
  "B",
  "CPlus",
  "C",
  "D",
  "F",
];

function GradeDistributionTab() {
  const results = useResults();
  const [examFilter, setExamFilter] = useState(EXAMS[0]);
  const [classFilter, setClassFilter] = useState("All");

  const dist = getGradeDistribution(examFilter, classFilter);
  const total = Object.values(dist).reduce((a, b) => a + b, 0);

  const filtered = results.filter(
    (r) =>
      r.examName === examFilter &&
      (classFilter === "All" || r.className === classFilter),
  );
  const classAvg =
    filtered.length > 0
      ? Math.round(
          (filtered.reduce((a, b) => a + b.percentage, 0) / filtered.length) *
            10,
        ) / 10
      : 0;

  const maxCount = Math.max(...Object.values(dist), 1);

  return (
    <div className="space-y-5" data-ocid="results.grade_distribution">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-blue-100 p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value)}
            className="border border-blue-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
            data-ocid="results.dist_exam_select"
          >
            {EXAMS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="border border-blue-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
            data-ocid="results.dist_class_select"
          >
            <option value="All">All Classes</option>
            {CLASSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-4 shadow-sm">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
            Total Students
          </p>
          <p className="text-2xl font-black text-blue-900">{total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-4 shadow-sm">
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
            Class Average
          </p>
          <p className="text-2xl font-black text-green-800">{classAvg}%</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 p-4 shadow-sm">
          <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide mb-1">
            Pass Rate
          </p>
          <p className="text-2xl font-black text-yellow-800">
            {total > 0 ? Math.round(((total - dist.F) / total) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Distribution chart */}
      <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
        <div className="bg-blue-900 px-5 py-3">
          <p className="text-white font-bold text-sm">
            📊 Grade Distribution — {examFilter}
            {classFilter !== "All" ? ` · ${classFilter}` : ""}
          </p>
        </div>
        <div className="p-5 space-y-3">
          {GRADE_ORDER.map((g) => {
            const count = dist[g];
            const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
            return (
              <div key={g} className="flex items-center gap-3">
                <div className="w-10 shrink-0 text-right">
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-black ${gradeBadgeClass(g)}`}
                  >
                    {gradeLabel(g)}
                  </span>
                </div>
                <div className="flex-1 bg-blue-50 rounded-full h-6 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${gradeBarColor(g)}`}
                    style={{
                      width: `${pct}%`,
                      minWidth: count > 0 ? "24px" : "0",
                    }}
                  />
                </div>
                <div className="w-16 shrink-0 text-right">
                  <span className="font-bold text-blue-900 text-sm">
                    {count}
                  </span>
                  <span className="text-blue-400 text-xs ml-1">
                    student{count !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const ALLOWED_ROLES = [
  "super_admin",
  "principal",
  "teacher",
  "accountant",
] as const;
type AllowedRole = (typeof ALLOWED_ROLES)[number];

function ResultsPage() {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "enter" | "view" | "toppers" | "distribution"
  >("view");

  useEffect(() => {
    if (!isAuthenticated) void navigate({ to: "/login" as never });
    else if (
      currentUser &&
      !ALLOWED_ROLES.includes(currentUser.role as AllowedRole)
    ) {
      void navigate({ to: "/admin/" as never });
    }
  }, [isAuthenticated, currentUser, navigate]);

  if (!isAuthenticated || !currentUser) return null;

  const tabs = [
    { id: "enter" as const, label: "✏️ Enter Marks" },
    { id: "view" as const, label: "📋 View Results" },
    { id: "toppers" as const, label: "🏆 Toppers" },
    { id: "distribution" as const, label: "📊 Grade Distribution" },
  ];

  return (
    <AdminLayout title="Result Management">
      <div className="space-y-6" data-ocid="results.page">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-blue-900 font-display">
              Result Management
            </h1>
            <p className="text-blue-500 text-sm mt-0.5">
              Enter marks, view results, toppers & grade analytics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1.5 rounded-full border border-yellow-200">
              📄 Print-to-PDF supported
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex flex-wrap gap-1 bg-blue-50 rounded-xl p-1 border border-blue-100"
          data-ocid="results.tab"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-blue-900 text-white shadow-sm"
                  : "text-blue-700 hover:bg-blue-100"
              }`}
              data-ocid={`results.${tab.id}_tab`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "enter" && <EnterMarksTab />}
        {activeTab === "view" && <ViewResultsTab />}
        {activeTab === "toppers" && <ToppersTab />}
        {activeTab === "distribution" && <GradeDistributionTab />}
      </div>
    </AdminLayout>
  );
}
