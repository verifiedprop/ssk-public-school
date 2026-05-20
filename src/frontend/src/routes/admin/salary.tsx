import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/hooks/useAuth";
import {
  type SalaryInput,
  type SalaryRecord,
  type TeacherInput,
  type TeacherRecord,
  useSalary,
} from "@/hooks/useSalary";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/admin/salary")({
  component: SalaryPage,
});

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

type Tab = "teachers" | "salary" | "summary";

// ─── Add/Edit Teacher Modal
interface TeacherModalProps {
  initial?: TeacherRecord | null;
  onSave: (data: TeacherInput) => void;
  onClose: () => void;
}

function TeacherModal({ initial, onSave, onClose }: TeacherModalProps) {
  const [form, setForm] = useState<TeacherInput>({
    name: initial?.name ?? "",
    designation: initial?.designation ?? "",
    baseSalary: initial?.baseSalary ?? 0,
    dateOfJoining: initial?.dateOfJoining ?? "",
  });

  const set = (k: keyof TeacherInput, v: string | number) =>
    setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-blue-100"
        data-ocid="salary.teacher_modal"
      >
        <div className="bg-blue-900 text-white rounded-t-2xl px-6 py-4 flex items-center justify-between">
          <h2 className="font-bold text-lg font-display">
            {initial ? "Edit Teacher" : "Add New Teacher"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white text-xl leading-none"
            data-ocid="salary.teacher_modal.close_button"
          >
            &times;
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label
              htmlFor="teacher-name"
              className="block text-xs font-semibold text-blue-700 mb-1"
            >
              Full Name
            </label>
            <input
              id="teacher-name"
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Priya Sharma"
              data-ocid="salary.teacher_modal.name_input"
            />
          </div>
          <div>
            <label
              htmlFor="teacher-designation"
              className="block text-xs font-semibold text-blue-700 mb-1"
            >
              Designation
            </label>
            <input
              id="teacher-designation"
              type="text"
              value={form.designation}
              onChange={(e) => set("designation", e.target.value)}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Senior Mathematics Teacher"
              data-ocid="salary.teacher_modal.designation_input"
            />
          </div>
          <div>
            <label
              htmlFor="teacher-base-salary"
              className="block text-xs font-semibold text-blue-700 mb-1"
            >
              Base Salary (&#x20b9;/month)
            </label>
            <input
              id="teacher-base-salary"
              type="number"
              value={form.baseSalary || ""}
              onChange={(e) => set("baseSalary", Number(e.target.value))}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 40000"
              data-ocid="salary.teacher_modal.salary_input"
            />
          </div>
          <div>
            <label
              htmlFor="teacher-doj"
              className="block text-xs font-semibold text-blue-700 mb-1"
            >
              Date of Joining
            </label>
            <input
              id="teacher-doj"
              type="date"
              value={form.dateOfJoining}
              onChange={(e) => set("dateOfJoining", e.target.value)}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              data-ocid="salary.teacher_modal.doj_input"
            />
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-blue-200 text-blue-700 text-sm font-semibold hover:bg-blue-50 transition-colors"
            data-ocid="salary.teacher_modal.cancel_button"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (
                form.name &&
                form.designation &&
                form.baseSalary > 0 &&
                form.dateOfJoining
              ) {
                onSave(form);
              }
            }}
            className="px-5 py-2 rounded-lg bg-blue-900 text-white text-sm font-bold hover:bg-blue-800 transition-colors"
            data-ocid="salary.teacher_modal.submit_button"
          >
            {initial ? "Save Changes" : "Add Teacher"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Generate Salary Modal
interface GenSalaryModalProps {
  teachers: TeacherRecord[];
  onGenerate: (input: SalaryInput) => void;
  onClose: () => void;
}

function GenSalaryModal({
  teachers,
  onGenerate,
  onClose,
}: GenSalaryModalProps) {
  const [form, setForm] = useState<SalaryInput>({
    teacherId: teachers[0]?.id ?? "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    attendancePercentage: 100,
    bonusAmount: 0,
    deductionAmount: 0,
    bankDetails: "",
  });

  const teacher = teachers.find((t) => t.id === form.teacherId);
  const base = teacher
    ? teacher.baseSalary * (form.attendancePercentage / 100)
    : 0;
  const preview = Math.round(base + form.bonusAmount - form.deductionAmount);

  const set = <K extends keyof SalaryInput>(k: K, v: SalaryInput[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 overflow-y-auto">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-blue-100 my-4"
        data-ocid="salary.gen_modal"
      >
        <div className="bg-blue-900 text-white rounded-t-2xl px-6 py-4 flex items-center justify-between">
          <h2 className="font-bold text-lg font-display">Generate Salary</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white text-xl leading-none"
            data-ocid="salary.gen_modal.close_button"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label
              htmlFor="gen-teacher"
              className="block text-xs font-semibold text-blue-700 mb-1"
            >
              Teacher
            </label>
            <select
              id="gen-teacher"
              value={form.teacherId}
              onChange={(e) => set("teacherId", e.target.value)}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              data-ocid="salary.gen_modal.teacher_select"
            >
              {teachers
                .filter((t) => t.isActive)
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {fmt(t.baseSalary)}/mo
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="gen-month"
                className="block text-xs font-semibold text-blue-700 mb-1"
              >
                Month
              </label>
              <select
                id="gen-month"
                value={form.month}
                onChange={(e) => set("month", Number(e.target.value))}
                className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                data-ocid="salary.gen_modal.month_select"
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="gen-year"
                className="block text-xs font-semibold text-blue-700 mb-1"
              >
                Year
              </label>
              <select
                id="gen-year"
                value={form.year}
                onChange={(e) => set("year", Number(e.target.value))}
                className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                data-ocid="salary.gen_modal.year_select"
              >
                {[2024, 2025, 2026].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="gen-attendance"
              className="block text-xs font-semibold text-blue-700 mb-1"
            >
              Attendance %{" "}
              <span className="text-blue-400 font-normal">
                (used for salary proration)
              </span>
            </label>
            <input
              id="gen-attendance"
              type="number"
              min={0}
              max={100}
              value={form.attendancePercentage}
              onChange={(e) =>
                set(
                  "attendancePercentage",
                  Math.min(100, Math.max(0, Number(e.target.value))),
                )
              }
              className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              data-ocid="salary.gen_modal.attendance_input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="gen-bonus"
                className="block text-xs font-semibold text-blue-700 mb-1"
              >
                Bonus / Incentive (&#x20b9;)
              </label>
              <input
                id="gen-bonus"
                type="number"
                min={0}
                value={form.bonusAmount}
                onChange={(e) => set("bonusAmount", Number(e.target.value))}
                className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                data-ocid="salary.gen_modal.bonus_input"
              />
            </div>
            <div>
              <label
                htmlFor="gen-deductions"
                className="block text-xs font-semibold text-blue-700 mb-1"
              >
                Deductions (&#x20b9;)
              </label>
              <input
                id="gen-deductions"
                type="number"
                min={0}
                value={form.deductionAmount}
                onChange={(e) => set("deductionAmount", Number(e.target.value))}
                className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                data-ocid="salary.gen_modal.deductions_input"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="gen-bank"
              className="block text-xs font-semibold text-blue-700 mb-1"
            >
              Bank Details
            </label>
            <input
              id="gen-bank"
              type="text"
              value={form.bankDetails}
              onChange={(e) => set("bankDetails", e.target.value)}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. SBI ****4321"
              data-ocid="salary.gen_modal.bank_input"
            />
          </div>

          {/* Net salary preview */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                Net Salary Preview
              </div>
              <div className="text-xs text-amber-600 mt-0.5">
                {fmt(teacher?.baseSalary ?? 0)} &times;{" "}
                {form.attendancePercentage}% + {fmt(form.bonusAmount)} &minus;{" "}
                {fmt(form.deductionAmount)}
              </div>
            </div>
            <div className="text-2xl font-bold text-amber-700">
              {fmt(preview)}
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-blue-200 text-blue-700 text-sm font-semibold hover:bg-blue-50 transition-colors"
            data-ocid="salary.gen_modal.cancel_button"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (form.teacherId && form.bankDetails) onGenerate(form);
            }}
            className="px-5 py-2 rounded-lg bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition-colors"
            data-ocid="salary.gen_modal.submit_button"
          >
            Generate Salary
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Print payslip
interface PayslipProps {
  record: SalaryRecord;
}

function Payslip({ record }: PayslipProps) {
  return (
    <div
      id="payslip-print"
      className="hidden print:block p-8 font-sans text-sm"
      style={{ width: "210mm", minHeight: "297mm", color: "#111" }}
    >
      {/* School Header */}
      <div
        style={{
          textAlign: "center",
          borderBottom: "2px solid #1e3a8a",
          paddingBottom: "16px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            fontSize: "22px",
            fontWeight: 800,
            color: "#1e3a8a",
            letterSpacing: "1px",
          }}
        >
          SSK PUBLIC SCHOOL
        </div>
        <div style={{ fontSize: "13px", color: "#555", marginTop: "4px" }}>
          Excellence in Education Since 2005
        </div>
        <div style={{ fontSize: "12px", color: "#777", marginTop: "2px" }}>
          123 School Road, Education City | Tel: +91 98765-00000 |
          info@sskpublicschool.edu.in
        </div>
        <div
          style={{
            marginTop: "12px",
            background: "#1e3a8a",
            color: "#fff",
            display: "inline-block",
            padding: "4px 24px",
            borderRadius: "4px",
            fontWeight: 700,
            letterSpacing: "2px",
            fontSize: "13px",
          }}
        >
          SALARY SLIP
        </div>
      </div>

      {/* Info grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div>
          <div
            style={{ fontWeight: 700, marginBottom: "6px", color: "#1e3a8a" }}
          >
            Employee Details
          </div>
          <table
            style={{
              width: "100%",
              fontSize: "12px",
              borderCollapse: "collapse",
            }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    color: "#555",
                    paddingBottom: "4px",
                    width: "120px",
                  }}
                >
                  Name:
                </td>
                <td style={{ fontWeight: 600 }}>{record.teacherName}</td>
              </tr>
              <tr>
                <td style={{ color: "#555", paddingBottom: "4px" }}>
                  Bank Account:
                </td>
                <td>{record.bankDetails}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <div
            style={{ fontWeight: 700, marginBottom: "6px", color: "#1e3a8a" }}
          >
            Pay Period
          </div>
          <table
            style={{
              width: "100%",
              fontSize: "12px",
              borderCollapse: "collapse",
            }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    color: "#555",
                    paddingBottom: "4px",
                    width: "120px",
                  }}
                >
                  Month:
                </td>
                <td style={{ fontWeight: 600 }}>
                  {MONTHS[record.month - 1]} {record.year}
                </td>
              </tr>
              <tr>
                <td style={{ color: "#555", paddingBottom: "4px" }}>
                  Issue Date:
                </td>
                <td>{record.paidDate ?? record.createdAt}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Salary Breakdown */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontWeight: 700, marginBottom: "8px", color: "#1e3a8a" }}>
          Salary Breakdown
        </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "12px",
          }}
        >
          <thead>
            <tr style={{ background: "#1e3a8a", color: "#fff" }}>
              <th style={{ padding: "8px 12px", textAlign: "left" }}>
                Component
              </th>
              <th style={{ padding: "8px 12px", textAlign: "right" }}>
                Amount (Rs.)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
              <td style={{ padding: "8px 12px" }}>Base Salary</td>
              <td style={{ padding: "8px 12px", textAlign: "right" }}>
                {record.baseSalary.toLocaleString("en-IN")}
              </td>
            </tr>
            <tr
              style={{
                borderBottom: "1px solid #e5e7eb",
                background: "#f0fdf4",
              }}
            >
              <td style={{ padding: "8px 12px", color: "#16a34a" }}>
                Attendance Bonus
              </td>
              <td
                style={{
                  padding: "8px 12px",
                  textAlign: "right",
                  color: "#16a34a",
                }}
              >
                +{record.attendanceBonus.toLocaleString("en-IN")}
              </td>
            </tr>
            <tr
              style={{
                borderBottom: "1px solid #e5e7eb",
                background: "#fff7ed",
              }}
            >
              <td style={{ padding: "8px 12px", color: "#dc2626" }}>
                Deductions
              </td>
              <td
                style={{
                  padding: "8px 12px",
                  textAlign: "right",
                  color: "#dc2626",
                }}
              >
                -{record.deductions.toLocaleString("en-IN")}
              </td>
            </tr>
            <tr
              style={{ background: "#1e3a8a", color: "#fff", fontWeight: 700 }}
            >
              <td style={{ padding: "10px 12px" }}>NET SALARY</td>
              <td
                style={{
                  padding: "10px 12px",
                  textAlign: "right",
                  fontSize: "15px",
                }}
              >
                {record.netSalary.toLocaleString("en-IN")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Net in words */}
      <div
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "6px",
          padding: "10px 16px",
          marginBottom: "32px",
          fontSize: "12px",
        }}
      >
        <span style={{ color: "#555" }}>Net Salary in Words: </span>
        <span style={{ fontWeight: 600, color: "#1e3a8a" }}>
          Rupees {record.netSalary.toLocaleString("en-IN")} Only
        </span>
      </div>

      {/* Signatures */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "32px",
          marginTop: "48px",
        }}
      >
        {["Prepared By", "Verified By (Accountant)", "Employee Signature"].map(
          (label) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div
                style={{
                  borderTop: "1px solid #1e3a8a",
                  paddingTop: "6px",
                  fontSize: "11px",
                  color: "#555",
                }}
              >
                {label}
              </div>
            </div>
          ),
        )}
      </div>

      <div
        style={{
          marginTop: "32px",
          textAlign: "center",
          fontSize: "10px",
          color: "#aaa",
          borderTop: "1px solid #e5e7eb",
          paddingTop: "8px",
        }}
      >
        This is a computer-generated payslip. Verify authenticity via school
        records.
      </div>
    </div>
  );
}

// ─── Teachers Tab
interface TeachersTabProps {
  teachers: TeacherRecord[];
  onAdd: (d: TeacherInput) => void;
  onEdit: (
    id: string,
    d: Partial<TeacherInput & { isActive: boolean }>,
  ) => void;
  onToggle: (id: string) => void;
}

function TeachersTab({ teachers, onAdd, onEdit, onToggle }: TeachersTabProps) {
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<TeacherRecord | null>(null);
  const [search, setSearch] = useState("");

  const filtered = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.designation.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4" data-ocid="salary.teachers.section">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search teachers..."
          className="border border-blue-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 w-full sm:w-72"
          data-ocid="salary.teachers.search_input"
        />
        <button
          type="button"
          onClick={() => {
            setEditTarget(null);
            setShowModal(true);
          }}
          className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2 rounded-xl font-bold text-sm transition-colors flex-shrink-0"
          data-ocid="salary.teachers.add_button"
        >
          + Add Teacher
        </button>
      </div>

      <div
        className="bg-white rounded-xl border border-blue-100 overflow-hidden shadow-sm"
        data-ocid="salary.teachers.table"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-blue-50 border-b border-blue-100">
              <tr>
                {[
                  "Name",
                  "Designation",
                  "Base Salary",
                  "Date of Joining",
                  "Status",
                  "Actions",
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
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12 text-blue-400"
                    data-ocid="salary.teachers.empty_state"
                  >
                    No teachers found.
                  </td>
                </tr>
              ) : (
                filtered.map((t, i) => (
                  <tr
                    key={t.id}
                    className="border-t border-blue-50 hover:bg-blue-50/30 transition-colors"
                    data-ocid={`salary.teachers.item.${i + 1}`}
                  >
                    <td className="px-4 py-3 font-semibold text-blue-900">
                      {t.name}
                    </td>
                    <td className="px-4 py-3 text-blue-600 text-xs">
                      {t.designation}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-blue-900">
                      {fmt(t.baseSalary)}
                    </td>
                    <td className="px-4 py-3 text-blue-500 text-xs">
                      {t.dateOfJoining}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          t.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {t.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setEditTarget(t);
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 text-xs font-bold"
                          data-ocid={`salary.teachers.edit_button.${i + 1}`}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggle(t.id)}
                          className={`text-xs font-bold ${
                            t.isActive
                              ? "text-red-500 hover:text-red-700"
                              : "text-green-600 hover:text-green-800"
                          }`}
                          data-ocid={`salary.teachers.toggle_button.${i + 1}`}
                        >
                          {t.isActive ? "Deactivate" : "Activate"}
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

      {showModal && (
        <TeacherModal
          initial={editTarget}
          onSave={(data) => {
            if (editTarget) {
              onEdit(editTarget.id, data);
            } else {
              onAdd(data);
            }
            setShowModal(false);
            setEditTarget(null);
          }}
          onClose={() => {
            setShowModal(false);
            setEditTarget(null);
          }}
        />
      )}
    </div>
  );
}

// ─── Salary Records Tab
interface SalaryTabProps {
  records: SalaryRecord[];
  teachers: TeacherRecord[];
  onGenerate: (input: SalaryInput) => void;
  onMarkPaid: (id: string) => void;
}

function SalaryTab({
  records,
  teachers,
  onGenerate,
  onMarkPaid,
}: SalaryTabProps) {
  const [showGenModal, setShowGenModal] = useState(false);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState(
    String(new Date().getFullYear()),
  );
  const [filterTeacher, setFilterTeacher] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [payslipRecord, setPayslipRecord] = useState<SalaryRecord | null>(null);
  const payslipRef = useRef<HTMLDivElement>(null);

  const printPayslip = (record: SalaryRecord) => {
    setPayslipRecord(record);
    setTimeout(() => window.print(), 200);
  };

  const filtered = records.filter((r) => {
    if (filterMonth && r.month !== Number(filterMonth)) return false;
    if (filterYear && r.year !== Number(filterYear)) return false;
    if (
      filterTeacher &&
      !r.teacherName.toLowerCase().includes(filterTeacher.toLowerCase())
    )
      return false;
    if (filterStatus && r.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-4" data-ocid="salary.records.section">
      {/* Filters */}
      <div className="bg-white border border-blue-100 rounded-xl p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            data-ocid="salary.records.filter_month"
          >
            <option value="">All Months</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={String(i + 1)}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            data-ocid="salary.records.filter_year"
          >
            <option value="">All Years</option>
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={filterTeacher}
            onChange={(e) => setFilterTeacher(e.target.value)}
            placeholder="Teacher name..."
            className="border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            data-ocid="salary.records.filter_teacher"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            data-ocid="salary.records.filter_status"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
          <button
            type="button"
            onClick={() => setShowGenModal(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors col-span-2 sm:col-span-1"
            data-ocid="salary.records.generate_button"
          >
            + Generate Salary
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        className="bg-white rounded-xl border border-blue-100 overflow-hidden shadow-sm"
        data-ocid="salary.records.table"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-blue-50 border-b border-blue-100">
              <tr>
                {[
                  "Teacher",
                  "Month/Year",
                  "Base",
                  "Bonus",
                  "Deductions",
                  "Net Salary",
                  "Status",
                  "Paid Date",
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
                    colSpan={9}
                    className="text-center py-12 text-blue-400"
                    data-ocid="salary.records.empty_state"
                  >
                    No salary records match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((r, i) => (
                  <tr
                    key={r.id}
                    className="border-t border-blue-50 hover:bg-blue-50/30 transition-colors"
                    data-ocid={`salary.records.item.${i + 1}`}
                  >
                    <td className="px-4 py-3 font-semibold text-blue-900 whitespace-nowrap">
                      {r.teacherName}
                    </td>
                    <td className="px-4 py-3 text-blue-600 whitespace-nowrap">
                      {MONTHS[r.month - 1]} {r.year}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-blue-600">
                      {fmt(r.baseSalary)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-green-600">
                      +{fmt(r.attendanceBonus)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-red-500">
                      -{fmt(r.deductions)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-blue-900">
                      {fmt(r.netSalary)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          r.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-blue-500 text-xs whitespace-nowrap">
                      {r.paidDate ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        {r.status === "Pending" && (
                          <button
                            type="button"
                            onClick={() => onMarkPaid(r.id)}
                            className="text-xs font-bold text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 px-2.5 py-1 rounded-lg transition-colors"
                            data-ocid={`salary.records.mark_paid_button.${i + 1}`}
                          >
                            Mark Paid
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => printPayslip(r)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors"
                          data-ocid={`salary.records.payslip_button.${i + 1}`}
                        >
                          Payslip
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

      {showGenModal && (
        <GenSalaryModal
          teachers={teachers}
          onGenerate={(input) => {
            onGenerate(input);
            setShowGenModal(false);
          }}
          onClose={() => setShowGenModal(false)}
        />
      )}

      {/* Hidden print-only payslip */}
      <div ref={payslipRef}>
        {payslipRecord && <Payslip record={payslipRecord} />}
      </div>
    </div>
  );
}

// ─── Summary Tab
interface SummaryTabProps {
  teachers: TeacherRecord[];
  records: SalaryRecord[];
}

function SummaryTab({ teachers, records }: SummaryTabProps) {
  const thisMonth = new Date().getMonth() + 1;
  const thisYear = new Date().getFullYear();
  const activeTeachers = teachers.filter((t) => t.isActive).length;
  const thisMonthRecords = records.filter(
    (r) => r.month === thisMonth && r.year === thisYear,
  );
  const thisMonthTotal = thisMonthRecords.reduce((s, r) => s + r.netSalary, 0);
  const pendingCount = records.filter((r) => r.status === "Pending").length;
  const pendingTotal = records
    .filter((r) => r.status === "Pending")
    .reduce((s, r) => s + r.netSalary, 0);

  // Monthly chart: last 6 months
  const chartData: { label: string; total: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(thisYear, thisMonth - 1 - i, 1);
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    const total = records
      .filter((r) => r.month === m && r.year === y)
      .reduce((s, r) => s + r.netSalary, 0);
    chartData.push({
      label: `${MONTHS[m - 1].slice(0, 3)} ${String(y).slice(2)}`,
      total,
    });
  }
  const maxVal = Math.max(...chartData.map((d) => d.total), 1);

  const stats = [
    {
      label: "Total Teachers",
      value: String(teachers.length),
      color: "bg-blue-900",
      icon: "\u{1F468}\u{200D}\u{1F3EB}",
    },
    {
      label: "Active Teachers",
      value: String(activeTeachers),
      color: "bg-green-600",
      icon: "\u2705",
    },
    {
      label: "This Month Payroll",
      value: fmt(thisMonthTotal),
      color: "bg-amber-500",
      icon: "\u{1F4B0}",
    },
    {
      label: "Pending Payments",
      value: `${pendingCount} (${fmt(pendingTotal)})`,
      color: "bg-red-500",
      icon: "\u23F3",
    },
  ];

  return (
    <div className="space-y-6" data-ocid="salary.summary.section">
      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden"
            data-ocid={`salary.summary.card.${i + 1}`}
          >
            <div
              className={`${s.color} px-4 py-2 text-white text-xs font-bold uppercase tracking-wide flex items-center gap-2`}
            >
              <span>{s.icon}</span>
              {s.label}
            </div>
            <div className="px-4 py-4 text-2xl font-bold text-blue-900 font-display">
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div
        className="bg-white rounded-xl border border-blue-100 shadow-sm p-6"
        data-ocid="salary.summary.chart"
      >
        <h3 className="font-bold text-blue-900 mb-5 font-display">
          Monthly Salary Expense (Last 6 Months)
        </h3>
        <div className="flex items-end gap-3 h-40">
          {chartData.map((d) => {
            const pct = (d.total / maxVal) * 100;
            return (
              <div
                key={d.label}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div className="text-xs text-blue-600 font-mono">
                  {d.total > 0 ? `Rs.${Math.round(d.total / 1000)}k` : "—"}
                </div>
                <div
                  className="w-full rounded-t-md bg-blue-900 transition-all duration-500"
                  style={{
                    height: `${pct}%`,
                    minHeight: d.total > 0 ? "8px" : "0",
                  }}
                />
                <div className="text-xs text-blue-500 text-center leading-tight">
                  {d.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Teacher overview table */}
      <div
        className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden"
        data-ocid="salary.summary.teacher_table"
      >
        <div className="bg-blue-50 border-b border-blue-100 px-4 py-3">
          <h3 className="font-bold text-blue-900 text-sm">
            Teacher Salary Overview
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-blue-50 border-b border-blue-100">
              <tr>
                {[
                  "Teacher",
                  "Designation",
                  "Base Salary",
                  "This Month Status",
                  "YTD Paid",
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
              {teachers
                .filter((t) => t.isActive)
                .map((t, i) => {
                  const monthRec = thisMonthRecords.find(
                    (r) => r.teacherId === t.id,
                  );
                  const ytd = records
                    .filter(
                      (r) =>
                        r.teacherId === t.id &&
                        r.year === thisYear &&
                        r.status === "Paid",
                    )
                    .reduce((s, r) => s + r.netSalary, 0);
                  return (
                    <tr
                      key={t.id}
                      className="border-t border-blue-50 hover:bg-blue-50/30"
                      data-ocid={`salary.summary.teacher.${i + 1}`}
                    >
                      <td className="px-4 py-3 font-semibold text-blue-900">
                        {t.name}
                      </td>
                      <td className="px-4 py-3 text-blue-600 text-xs">
                        {t.designation}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-blue-900">
                        {fmt(t.baseSalary)}
                      </td>
                      <td className="px-4 py-3">
                        {monthRec ? (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              monthRec.status === "Paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {monthRec.status}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-600">
                            Not Generated
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-green-700">
                        {ytd > 0 ? fmt(ytd) : "—"}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page
function SalaryPage() {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("summary");
  const {
    teachers,
    salaryRecords,
    addTeacher,
    updateTeacher,
    deactivateTeacher,
    generateSalary,
    markPaid,
  } = useSalary();

  useEffect(() => {
    if (!isAuthenticated) void navigate({ to: "/login" as never });
  }, [isAuthenticated, navigate]);

  const allowedRoles = ["super_admin", "principal", "accountant"];
  if (!isAuthenticated || !role || !allowedRoles.includes(role)) {
    return (
      <AdminLayout title="Teacher Salary Management">
        <div
          className="flex items-center justify-center h-64"
          data-ocid="salary.access_denied"
        >
          <div className="text-center">
            <div className="text-4xl mb-3">&#x1F512;</div>
            <h2 className="text-xl font-bold text-blue-900">
              Access Restricted
            </h2>
            <p className="text-blue-500 mt-2 text-sm">
              Only Super Admin, Principal, and Accountant can view salary
              records.
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "summary", label: "Summary" },
    { id: "teachers", label: "Teachers" },
    { id: "salary", label: "Salary Records" },
  ];

  const pendingThisMonth = salaryRecords
    .filter(
      (r) =>
        r.status === "Pending" &&
        r.month === new Date().getMonth() + 1 &&
        r.year === new Date().getFullYear(),
    )
    .reduce((s, r) => s + r.netSalary, 0);

  return (
    <AdminLayout title="Teacher Salary Management">
      <div className="space-y-6" data-ocid="salary.page">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-blue-900 font-display">
              Teacher Salary Management
            </h1>
            <p className="text-blue-500 text-sm mt-1">
              {teachers.filter((t) => t.isActive).length} active teachers
              &nbsp;&middot;&nbsp;
              {salaryRecords.filter((r) => r.status === "Pending").length}{" "}
              pending payments
            </p>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
            <span className="text-amber-700 font-bold text-lg">&#x1F4B0;</span>
            <div>
              <div className="text-xs text-amber-600 font-semibold">
                This Month Pending
              </div>
              <div className="font-bold text-amber-800">
                {fmt(pendingThisMonth)}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 bg-blue-50 border border-blue-100 rounded-xl p-1"
          data-ocid="salary.tabs"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-blue-900 text-white shadow-sm"
                  : "text-blue-600 hover:bg-blue-100"
              }`}
              data-ocid={`salary.tab.${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        {activeTab === "teachers" && (
          <TeachersTab
            teachers={teachers}
            onAdd={addTeacher}
            onEdit={updateTeacher}
            onToggle={deactivateTeacher}
          />
        )}
        {activeTab === "salary" && (
          <SalaryTab
            records={salaryRecords}
            teachers={teachers}
            onGenerate={generateSalary}
            onMarkPaid={markPaid}
          />
        )}
        {activeTab === "summary" && (
          <SummaryTab teachers={teachers} records={salaryRecords} />
        )}
      </div>
    </AdminLayout>
  );
}
