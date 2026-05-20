import TeacherLayout from "@/components/portals/TeacherLayout";
import { useAuth } from "@/hooks/useAuth";
import { useTeacherData } from "@/hooks/useTeacherData";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Save } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/teacher/marks")({
  component: MarksPage,
});

function MarksPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { exams, updateMark } = useTeacherData();

  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id ?? "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!currentUser || currentUser.role !== "teacher")
      void navigate({ to: "/login" as never });
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const exam = exams.find((e) => e.id === selectedExamId) ?? exams[0];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const totalFor = (s: (typeof exam.students)[0]) =>
    exam.subjects.reduce((sum, sub) => {
      const m = s.marks[sub];
      return sum + (m === "" ? 0 : Number(m));
    }, 0);

  const maxTotal = exam.maxMarks * exam.subjects.length;
  const pct = (n: number) => Math.round((n / maxTotal) * 100);

  const grade = (p: number) =>
    p >= 90
      ? "A+"
      : p >= 80
        ? "A"
        : p >= 70
          ? "B+"
          : p >= 60
            ? "B"
            : p >= 50
              ? "C"
              : p >= 40
                ? "D"
                : "F";

  return (
    <TeacherLayout title="Marks Entry">
      <div className="space-y-6" data-ocid="teacher.marks.page">
        {/* Exam Selector */}
        <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-5">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label
                htmlFor="marks-exam"
                className="block text-xs font-semibold text-gray-600 mb-1"
              >
                Select Examination
              </label>
              <select
                id="marks-exam"
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 min-w-[260px]"
                data-ocid="teacher.marks.exam_select"
              >
                {exams.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title} — {e.class}
                  </option>
                ))}
              </select>
            </div>
            {exam && (
              <div className="text-sm text-gray-500">
                Class: <strong className="text-[#1e3a5f]">{exam.class}</strong>{" "}
                · Max Marks/Subject:{" "}
                <strong className="text-[#1e3a5f]">{exam.maxMarks}</strong> ·
                Students:{" "}
                <strong className="text-[#1e3a5f]">
                  {exam.students.length}
                </strong>
              </div>
            )}
          </div>
        </div>

        {/* Marks Table */}
        {exam && (
          <div
            className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden"
            data-ocid="teacher.marks.table"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#1e3a5f] text-white">
                    <th className="text-left px-4 py-3 font-semibold w-8">#</th>
                    <th className="text-left px-4 py-3 font-semibold">
                      Student Name
                    </th>
                    <th className="text-left px-4 py-3 font-semibold w-16">
                      Roll
                    </th>
                    {exam.subjects.map((sub) => (
                      <th
                        key={sub}
                        className="text-center px-3 py-3 font-semibold min-w-[110px]"
                      >
                        {sub}
                      </th>
                    ))}
                    <th className="text-center px-4 py-3 font-semibold">
                      Total
                    </th>
                    <th className="text-center px-4 py-3 font-semibold">%</th>
                    <th className="text-center px-4 py-3 font-semibold">
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {exam.students.map((student, i) => {
                    const total = totalFor(student);
                    const p = pct(total);
                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-blue-50/30"
                        data-ocid={`teacher.marks.row.${i + 1}`}
                      >
                        <td className="px-4 py-3 text-gray-400 text-xs">
                          {i + 1}
                        </td>
                        <td className="px-4 py-3 font-medium text-[#1e3a5f]">
                          {student.name}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {student.rollNumber}
                        </td>
                        {exam.subjects.map((sub) => (
                          <td key={sub} className="px-3 py-2 text-center">
                            <input
                              type="number"
                              min={0}
                              max={exam.maxMarks}
                              value={student.marks[sub] ?? ""}
                              onChange={(e) =>
                                updateMark(
                                  exam.id,
                                  student.id,
                                  sub,
                                  e.target.value === ""
                                    ? ""
                                    : Number(e.target.value),
                                )
                              }
                              className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                              data-ocid={`teacher.marks.input.${i + 1}.${sub.toLowerCase()}`}
                            />
                          </td>
                        ))}
                        <td className="px-4 py-3 text-center font-bold text-[#1e3a5f]">
                          {total}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-600">
                          {p}%
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              p >= 60
                                ? "bg-green-100 text-green-700"
                                : p >= 40
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-600"
                            }`}
                          >
                            {grade(p)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 bg-[#1e3a5f] hover:bg-[#15304f] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                data-ocid="teacher.marks.save_button"
              >
                {saved ? (
                  <>
                    <Check className="h-4 w-4" /> All Saved!
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save All Marks
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
