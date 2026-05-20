import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/hooks/useAuth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/admin/students")({
  component: StudentsPage,
});

interface StudentRow {
  id: string;
  name: string;
  className: string;
  section: string;
  rollNumber: string;
  parentName: string;
  parentPhone: string;
  username: string;
  password: string;
  isActive: boolean;
}

const LS_KEY = "ssk_students";

function loadStoredStudents(): StudentRow[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StudentRow[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStoredStudents(students: StudentRow[]): void {
  localStorage.setItem(LS_KEY, JSON.stringify(students));
}

interface CredentialEntry {
  username: string;
  password: string;
  role: string;
  name: string;
  studentClass?: string;
  studentSection?: string;
  studentRoll?: string;
}

function loadCredentials(): CredentialEntry[] {
  try {
    const raw2 = localStorage.getItem("ssk_credentials");
    if (!raw2) return [];
    const parsed = JSON.parse(raw2) as CredentialEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCredentials(creds: CredentialEntry[]): void {
  localStorage.setItem("ssk_credentials", JSON.stringify(creds));
}

interface NewStudentForm {
  name: string;
  className: string;
  section: string;
  rollNumber: string;
  parentName: string;
  parentPhone: string;
  username: string;
  password: string;
}

const CLASSES = [
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
];

function AddStudentModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (s: NewStudentForm) => void;
}) {
  const [form, setForm] = useState<NewStudentForm>({
    name: "",
    className: "Class 10",
    section: "",
    rollNumber: "",
    parentName: "",
    parentPhone: "",
    username: "",
    password: "",
  });
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstRef.current?.focus();
  }, []);

  const set = (field: keyof NewStudentForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.rollNumber.trim()) return;
    onAdd(form);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/60 backdrop-blur-sm"
      data-ocid="students.dialog"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-blue-100 overflow-hidden">
        {/* Modal header */}
        <div className="bg-blue-900 px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg font-display">
            Add New Student
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-blue-200 hover:text-white text-2xl leading-none transition-colors"
            aria-label="Close"
            data-ocid="students.close_button"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Student Name — full width */}
            <div className="col-span-2">
              <label
                htmlFor="student-name"
                className="block text-xs font-semibold text-blue-900 mb-1"
              >
                Student Name *
              </label>
              <input
                id="student-name"
                ref={firstRef}
                type="text"
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Aryan Sharma"
                className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                data-ocid="students.name_input"
              />
            </div>

            {/* Class */}
            <div>
              <label
                htmlFor="student-class"
                className="block text-xs font-semibold text-blue-900 mb-1"
              >
                Class *
              </label>
              <select
                id="student-class"
                required
                value={form.className}
                onChange={(e) => set("className", e.target.value)}
                className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                data-ocid="students.class_select"
              >
                {CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Section */}
            <div>
              <label
                htmlFor="student-section"
                className="block text-xs font-semibold text-blue-900 mb-1"
              >
                Section *
              </label>
              <input
                id="student-section"
                type="text"
                required
                value={form.section}
                onChange={(e) => set("section", e.target.value.toUpperCase())}
                placeholder="e.g. A"
                maxLength={2}
                className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                data-ocid="students.section_input"
              />
            </div>

            {/* Roll Number */}
            <div>
              <label
                htmlFor="student-roll"
                className="block text-xs font-semibold text-blue-900 mb-1"
              >
                Roll Number *
              </label>
              <input
                id="student-roll"
                type="text"
                required
                value={form.rollNumber}
                onChange={(e) => set("rollNumber", e.target.value)}
                placeholder="e.g. 10A-006"
                className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                data-ocid="students.roll_input"
              />
            </div>

            {/* Parent Name */}
            <div>
              <label
                htmlFor="student-parent-name"
                className="block text-xs font-semibold text-blue-900 mb-1"
              >
                Parent Name *
              </label>
              <input
                id="student-parent-name"
                type="text"
                required
                value={form.parentName}
                onChange={(e) => set("parentName", e.target.value)}
                placeholder="e.g. Rajesh Sharma"
                className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                data-ocid="students.parent_name_input"
              />
            </div>

            {/* Parent Phone */}
            <div>
              <label
                htmlFor="student-parent-phone"
                className="block text-xs font-semibold text-blue-900 mb-1"
              >
                Parent Phone *
              </label>
              <input
                id="student-parent-phone"
                type="tel"
                required
                value={form.parentPhone}
                onChange={(e) => set("parentPhone", e.target.value)}
                placeholder="e.g. 98765-43210"
                className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                data-ocid="students.parent_phone_input"
              />
            </div>

            {/* Username */}
            <div>
              <label
                htmlFor="student-username"
                className="block text-xs font-semibold text-blue-900 mb-1"
              >
                Login Username *
              </label>
              <input
                id="student-username"
                type="text"
                required
                value={form.username}
                onChange={(e) => set("username", e.target.value)}
                placeholder="e.g. aryan.sharma"
                className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                data-ocid="students.username_input"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="student-password"
                className="block text-xs font-semibold text-blue-900 mb-1"
              >
                Login Password *
              </label>
              <input
                id="student-password"
                type="password"
                required
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="Min 6 characters"
                minLength={6}
                className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                data-ocid="students.password_input"
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-3 pt-2 border-t border-blue-50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-blue-200 text-blue-700 text-sm font-semibold hover:bg-blue-50 transition-colors"
              data-ocid="students.cancel_button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-sm font-bold transition-colors shadow-sm"
              data-ocid="students.submit_button"
            >
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const SAMPLE_STUDENTS: StudentRow[] = [
  {
    id: "1",
    name: "Aryan Sharma",
    className: "Class 10",
    section: "A",
    rollNumber: "10A-001",
    parentName: "Rajesh Sharma",
    parentPhone: "98765-43210",
    username: "student1",
    password: "student123",
    isActive: true,
  },
  {
    id: "2",
    name: "Priya Singh",
    className: "Class 9",
    section: "B",
    rollNumber: "9B-002",
    parentName: "Vikram Singh",
    parentPhone: "98765-43211",
    username: "student2",
    password: "student123",
    isActive: true,
  },
  {
    id: "3",
    name: "Rohan Gupta",
    className: "Class 12",
    section: "A",
    rollNumber: "12A-003",
    parentName: "Anil Gupta",
    parentPhone: "98765-43212",
    username: "student3",
    password: "student123",
    isActive: true,
  },
  {
    id: "4",
    name: "Sneha Patel",
    className: "Class 8",
    section: "B",
    rollNumber: "8B-004",
    parentName: "Suresh Patel",
    parentPhone: "98765-43213",
    username: "student4",
    password: "student123",
    isActive: true,
  },
  {
    id: "5",
    name: "Kavya Reddy",
    className: "Class 11",
    section: "A",
    rollNumber: "11A-005",
    parentName: "Ravi Reddy",
    parentPhone: "98765-43214",
    username: "student5",
    password: "student123",
    isActive: false,
  },
];

function seedCredentialsIfEmpty(students: StudentRow[]): void {
  const existing = localStorage.getItem("ssk_credentials");
  if (existing) return;
  const creds: CredentialEntry[] = students.map((s) => ({
    username: s.username,
    password: s.password,
    role: "student",
    name: s.name,
    studentClass: s.className,
    studentSection: s.section,
    studentRoll: s.rollNumber,
  }));
  saveCredentials(creds);
}

function StudentsPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentRow[]>(() => {
    const stored = loadStoredStudents();
    if (stored.length > 0) return stored;
    saveStoredStudents(SAMPLE_STUDENTS);
    seedCredentialsIfEmpty(SAMPLE_STUDENTS);
    return SAMPLE_STUDENTS;
  });
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) void navigate({ to: "/login" as never });
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.parentName.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAddStudent = (form: NewStudentForm) => {
    const newStudent: StudentRow = {
      id: String(Date.now()),
      name: form.name.trim(),
      className: form.className,
      section: form.section.trim(),
      rollNumber: form.rollNumber.trim(),
      parentName: form.parentName.trim(),
      parentPhone: form.parentPhone.trim(),
      username: form.username.trim(),
      password: form.password,
      isActive: true,
    };
    setStudents((prev) => {
      const updated = [newStudent, ...prev];
      saveStoredStudents(updated);
      const creds = loadCredentials();
      const filtered = creds.filter((c) => c.username !== newStudent.username);
      filtered.push({
        username: newStudent.username,
        password: newStudent.password,
        role: "student",
        name: newStudent.name,
        studentClass: newStudent.className,
        studentSection: newStudent.section,
        studentRoll: newStudent.rollNumber,
      });
      saveCredentials(filtered);
      return updated;
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this student? This action cannot be undone.")) {
      setStudents((prev) => {
        const target = prev.find((s) => s.id === id);
        const updated = prev.filter((s) => s.id !== id);
        saveStoredStudents(updated);
        if (target) {
          const creds = loadCredentials().filter(
            (c) => c.username !== target.username,
          );
          saveCredentials(creds);
        }
        return updated;
      });
    }
  };

  const startEdit = (s: StudentRow) => {
    setEditingId(s.id);
    setEditName(s.name);
  };

  const saveEdit = () => {
    if (!editName.trim()) return;
    setStudents((prev) =>
      prev.map((s) =>
        s.id === editingId ? { ...s, name: editName.trim() } : s,
      ),
    );
    setEditingId(null);
  };

  return (
    <AdminLayout title="Student Management">
      <div className="space-y-6" data-ocid="students.page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-900 font-display">
              Student Management
            </h1>
            <p className="text-blue-500 text-sm mt-1">
              {students.length} students enrolled
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors flex-shrink-0"
            data-ocid="students.add_button"
          >
            + Add Student
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl border border-blue-100 p-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, roll number or parent name..."
            className="w-full border border-blue-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            data-ocid="students.search_input"
          />
        </div>

        {/* Table */}
        <div
          className="bg-white rounded-xl border border-blue-100 overflow-hidden shadow-sm"
          data-ocid="students.table"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-50 border-b border-blue-100">
                <tr>
                  {[
                    "Name",
                    "Class & Section",
                    "Roll No",
                    "Username",
                    "Parent",
                    "Phone",
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
                      colSpan={8}
                      className="text-center py-12 text-blue-400"
                      data-ocid="students.empty_state"
                    >
                      No students found matching your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s, i) => (
                    <tr
                      key={s.id}
                      className="border-t border-blue-50 hover:bg-blue-50/50 transition-colors"
                      data-ocid={`students.item.${i + 1}`}
                    >
                      <td className="px-4 py-3 font-medium text-blue-900">
                        {s.name}
                      </td>
                      <td className="px-4 py-3 text-blue-600">
                        {s.className}-{s.section}
                      </td>
                      <td className="px-4 py-3 text-blue-600 font-mono text-xs">
                        {s.rollNumber}
                      </td>
                      <td className="px-4 py-3 text-blue-500 font-mono text-xs">
                        {s.username}
                      </td>
                      <td className="px-4 py-3 text-blue-600">
                        {s.parentName}
                      </td>
                      <td className="px-4 py-3 text-blue-600">
                        {s.parentPhone}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${s.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                        >
                          {s.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {editingId === s.id ? (
                          <>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="border border-blue-300 rounded px-2 py-0.5 text-xs mr-1 w-28 focus:ring-1 focus:ring-blue-500"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveEdit();
                                if (e.key === "Escape") setEditingId(null);
                              }}
                              data-ocid={`students.edit_input.${i + 1}`}
                            />
                            <button
                              type="button"
                              onClick={saveEdit}
                              className="text-green-600 hover:text-green-800 mr-2 text-xs font-bold"
                              data-ocid={`students.save_button.${i + 1}`}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="text-blue-400 hover:text-blue-700 mr-4 text-xs"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startEdit(s)}
                            className="text-blue-600 hover:text-blue-900 mr-4 text-xs font-bold"
                            data-ocid={`students.edit_button.${i + 1}`}
                          >
                            Edit
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(s.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-bold"
                          data-ocid={`students.delete_button.${i + 1}`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showAdd && (
        <AddStudentModal
          onClose={() => setShowAdd(false)}
          onAdd={handleAddStudent}
        />
      )}
    </AdminLayout>
  );
}
