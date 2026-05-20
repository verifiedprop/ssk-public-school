import TeacherLayout from "@/components/portals/TeacherLayout";
import { useAuth } from "@/hooks/useAuth";
import { type IDCardStudent, useTeacherData } from "@/hooks/useTeacherData";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Printer } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/teacher/idcards")({
  component: IDCardsPage,
});

function IDCardDisplay({ student }: { student: IDCardStudent }) {
  // Tiny deterministic QR SVG
  const cells = 15;
  const size = 80;
  const cell = size / cells;
  const seed = student.admissionNumber
    .split("")
    .reduce((a, c) => a + c.charCodeAt(0), 0);
  const isBlack = (r: number, c: number) => {
    if (
      (r < 5 && c < 5) ||
      (r < 5 && c >= cells - 5) ||
      (r >= cells - 5 && c < 5)
    )
      return true;
    if (r === 4 || c === 4) return (r + c) % 2 === 0;
    return (seed * (r + 1) * (c + 1) + r * 5 + c * 3) % 7 < 3;
  };

  return (
    <div
      className="w-[340px] bg-white rounded-2xl overflow-hidden shadow-xl border-2 border-[#1e3a5f] print:shadow-none print:border"
      data-ocid="teacher.idcard.card"
    >
      {/* Header stripe */}
      <div className="bg-[#1e3a5f] px-5 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-blue-950 font-bold text-lg">
          S
        </div>
        <div>
          <div className="text-white font-bold text-sm leading-tight">
            SSK Public School
          </div>
          <div className="text-amber-300 text-xs">Student Identity Card</div>
        </div>
        <div className="ml-auto text-white/60 text-xs">2026-27</div>
      </div>

      {/* Body */}
      <div className="p-5 flex gap-4">
        {/* Photo placeholder */}
        <div className="w-20 h-24 rounded-lg bg-blue-50 border-2 border-[#1e3a5f]/20 flex flex-col items-center justify-center flex-shrink-0">
          <span className="text-3xl">👤</span>
          <span className="text-[10px] text-gray-400 mt-1">Photo</span>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="text-[#1e3a5f] font-bold text-base leading-tight">
            {student.name}
          </div>
          <div className="text-xs text-gray-500">
            Class {student.class}-{student.section}
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2">
            {[
              ["Roll No.", student.rollNumber],
              ["Adm. No.", student.admissionNumber],
              ["DOB", student.dateOfBirth],
              ["Blood Grp.", student.bloodGroup],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="text-[10px] text-gray-400 uppercase tracking-wide">
                  {label}
                </div>
                <div className="text-xs font-semibold text-[#1e3a5f]">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QR */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Student QR Code"
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
          <span className="text-[9px] text-gray-400">Scan to verify</span>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-blue-50 px-5 py-2.5 border-t border-blue-100">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Parent: {student.parentName}</span>
          <span>📞 {student.parentPhone}</span>
        </div>
        <div className="text-[10px] text-gray-400 mt-0.5 text-center">
          Sector 12, Near Bus Stand, Main City — 110001
        </div>
      </div>
    </div>
  );
}

function IDCardsPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { idStudents } = useTeacherData();
  const printRef = useRef<HTMLDivElement>(null);

  const [selectedId, setSelectedId] = useState(idStudents[0]?.id ?? "");

  useEffect(() => {
    if (!currentUser || currentUser.role !== "teacher")
      void navigate({ to: "/login" as never });
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const student = idStudents.find((s) => s.id === selectedId) ?? idStudents[0];

  const handlePrint = () => {
    if (!printRef.current) return;
    const content = printRef.current.innerHTML;
    const win = window.open("", "_blank", "width=500,height=700");
    if (!win) return;
    win.document.write(`
      <html><head><title>ID Card — ${student.name}</title>
      <style>body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f1f5f9;} @media print{body{background:white;}}</style>
      </head><body>${content}<script>window.onload=()=>{window.print();window.close();}<\/script></body></html>
    `);
    win.document.close();
  };

  return (
    <TeacherLayout title="Student ID Cards">
      <div className="space-y-6" data-ocid="teacher.idcards.page">
        {/* Selector */}
        <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-5">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label
                htmlFor="idcard-student"
                className="block text-xs font-semibold text-gray-600 mb-1"
              >
                Select Student
              </label>
              <select
                id="idcard-student"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 min-w-[260px]"
                data-ocid="teacher.idcards.student_select"
              >
                {idStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — Class {s.class}-{s.section} ({s.rollNumber})
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 bg-[#1e3a5f] hover:bg-[#15304f] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              data-ocid="teacher.idcards.print_button"
            >
              <Printer className="h-4 w-4" /> Print ID Card
            </button>
          </div>
        </div>

        {/* ID Card Preview */}
        {student && (
          <div className="flex flex-col items-start gap-4">
            <h2 className="text-sm font-semibold text-gray-500">Preview</h2>
            <div ref={printRef}>
              <IDCardDisplay student={student} />
            </div>
          </div>
        )}

        {/* All Students Grid */}
        <div
          className="bg-white rounded-xl border border-blue-100 shadow-sm p-6"
          data-ocid="teacher.idcards.list"
        >
          <h2 className="font-bold text-[#1e3a5f] mb-4">
            All Students ({idStudents.length})
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {idStudents.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedId(s.id)}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  s.id === selectedId
                    ? "border-amber-500 bg-amber-50"
                    : "border-gray-100 bg-gray-50 hover:border-blue-200 hover:bg-blue-50"
                }`}
                data-ocid={`teacher.idcards.item.${i + 1}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center font-bold text-sm">
                    {s.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-[#1e3a5f] text-sm truncate">
                      {s.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Class {s.class}-{s.section} · {s.rollNumber}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
