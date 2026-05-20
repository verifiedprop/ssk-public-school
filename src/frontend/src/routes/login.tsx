import { SEOHead } from "@/components/ui/SEOHead";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types/school";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login")({ component: LoginPage });

const _ROLES: { value: UserRole; label: string }[] = [
  { value: "super_admin", label: "Super Admin" },
  { value: "principal", label: "Principal" },
  { value: "accountant", label: "Accountant" },
  { value: "teacher", label: "Teacher" },
  { value: "parent", label: "Parent" },
  { value: "student", label: "Student" },
  { value: "admission_counsellor", label: "Admission Counsellor" },
];

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [_role, setRole] = useState<UserRole>("super_admin");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const DEMO_CREDENTIALS = [
    {
      role: "super_admin" as UserRole,
      label: "Super Admin",
      username: "superadmin",
      password: "admin123",
    },
    {
      role: "principal" as UserRole,
      label: "Principal",
      username: "principal",
      password: "principal123",
    },
    {
      role: "accountant" as UserRole,
      label: "Accountant",
      username: "accountant",
      password: "account123",
    },
    {
      role: "teacher" as UserRole,
      label: "Teacher",
      username: "teacher",
      password: "teacher123",
    },
    {
      role: "parent" as UserRole,
      label: "Parent",
      username: "parent",
      password: "parent123",
    },
    {
      role: "student" as UserRole,
      label: "Student",
      username: "student",
      password: "student123",
    },
    {
      role: "admission_counsellor" as UserRole,
      label: "Admission Counsellor",
      username: "counsellor",
      password: "counsel123",
    },
  ];

  const fillCredentials = (cred: (typeof DEMO_CREDENTIALS)[0]) => {
    setName(cred.username);
    setPassword(cred.password);
    setRole(cred.role);
    setError("");
  };

  /** Try to authenticate against dynamic localStorage stores first, then demo creds */
  function validateCredentials(
    username: string,
    pwd: string,
  ): { role: UserRole; displayName: string } | null {
    // Check ssk_credentials — admin-added users (students, teachers, parents) saved here
    try {
      const rawCreds = localStorage.getItem("ssk_credentials");
      if (rawCreds) {
        const creds = JSON.parse(rawCreds) as Array<{
          username: string;
          password: string;
          role: string;
          name: string;
        }>;
        const match = creds.find(
          (c) => c.username === username && c.password === pwd,
        );
        if (match)
          return { role: match.role as UserRole, displayName: match.name };
      }
    } catch {
      /* ignore */
    }

    // Check dynamically added students
    try {
      const rawStudents = localStorage.getItem("ssk_students");
      if (rawStudents) {
        const students = JSON.parse(rawStudents) as Array<{
          username: string;
          password: string;
          name: string;
        }>;
        const match = students.find(
          (s) => s.username === username && s.password === pwd,
        );
        if (match) return { role: "student", displayName: match.name };
      }
    } catch {
      /* ignore */
    }

    // Check dynamically added teachers
    try {
      const rawTeachers = localStorage.getItem("ssk_teachers");
      if (rawTeachers) {
        const teachers = JSON.parse(rawTeachers) as Array<{
          username: string;
          password: string;
          name: string;
        }>;
        const match = teachers.find(
          (t) => t.username === username && t.password === pwd,
        );
        if (match) return { role: "teacher", displayName: match.name };
      }
    } catch {
      /* ignore */
    }

    // Check dynamically added parents
    try {
      const rawParents = localStorage.getItem("ssk_parents");
      if (rawParents) {
        const parents = JSON.parse(rawParents) as Array<{
          username: string;
          password: string;
          name: string;
        }>;
        const match = parents.find(
          (p) => p.username === username && p.password === pwd,
        );
        if (match) return { role: "parent", displayName: match.name };
      }
    } catch {
      /* ignore */
    }

    // Fall back to hardcoded demo credentials
    const demo = DEMO_CREDENTIALS.find(
      (d) => d.username === username && d.password === pwd,
    );
    if (demo) return { role: demo.role, displayName: demo.label };

    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Please enter your username.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));

    const result = validateCredentials(name.trim(), password);
    if (!result) {
      setError("Invalid username or password. Please check your credentials.");
      setIsLoading(false);
      return;
    }

    // For student logins, enrich with class/section/roll from ssk_students
    let studentClass: string | undefined;
    let studentSection: string | undefined;
    let studentRoll: string | undefined;
    if (result.role === "student") {
      try {
        const rawStudents = localStorage.getItem("ssk_students");
        if (rawStudents) {
          const students = JSON.parse(rawStudents) as Array<{
            username: string;
            className: string;
            section: string;
            rollNumber: string;
          }>;
          const rec = students.find((s) => s.username === name.trim());
          if (rec) {
            studentClass = rec.className;
            studentSection = rec.section;
            studentRoll = rec.rollNumber;
          }
        }
      } catch {
        /* ignore */
      }
    }

    login({
      id: name.trim(),
      name: result.displayName,
      email: `${name.trim()}@sskschool.edu.in`,
      role: result.role,
      studentClass,
      studentSection,
      studentRoll,
    });

    const destination =
      result.role === "teacher"
        ? "/teacher/"
        : result.role === "parent"
          ? "/parent/"
          : result.role === "student"
            ? "/student/"
            : "/admin/";
    await navigate({ to: destination as never });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex items-center justify-center p-4">
      <SEOHead
        title="Login | SSK Public School"
        description="School management portal login for staff, teachers, and administrators."
      />

      <div className="w-full max-w-md">
        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-yellow-500 mb-4">
            <span className="text-2xl font-black text-blue-950 font-display">
              SSK
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            SSK Public School
          </h1>
          <p className="text-blue-300 text-sm mt-1">School Management Portal</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-blue-900 font-display mb-6 text-center">
            Sign In to Your Account
          </h2>
          {error && (
            <div
              className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm mb-4"
              data-ocid="login.error_state"
            >
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="login-name"
                className="block text-sm font-medium text-blue-900 mb-1.5"
              >
                Username
              </label>
              <input
                id="login-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-blue-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter username"
                required
                data-ocid="login.name_input"
              />
            </div>
            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-blue-900 mb-1.5"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-blue-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter password"
                required
                data-ocid="login.password_input"
              />
            </div>
            <div className="bg-blue-50 rounded-lg px-4 py-3 text-xs text-blue-600">
              💡 <strong>Note:</strong> For newly created student/teacher
              accounts, enter the username and password set by the admin. For
              demo accounts, click a row below.
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors text-base mt-2"
              data-ocid="login.submit_button"
            >
              {isLoading ? "Signing in..." : "Sign In →"}
            </button>
          </form>
          <p className="text-center text-xs text-blue-400 mt-6">
            SSK Public School — School Management System v1.0
          </p>
        </div>

        {/* Demo Credentials Panel */}
        <div
          className="mt-6 rounded-2xl overflow-hidden shadow-xl border-2 border-yellow-400"
          data-ocid="login.demo_credentials_panel"
        >
          <div className="bg-yellow-400 px-5 py-3 flex items-center gap-2">
            <span className="text-blue-950 font-black text-sm font-display tracking-wide uppercase">
              🔑 Demo Login Credentials
            </span>
            <span className="ml-auto text-blue-900 text-xs font-medium opacity-80">
              Click any row to auto-fill
            </span>
          </div>
          <div className="bg-yellow-50 border-b border-yellow-200 px-5 py-2.5">
            <p className="text-xs text-yellow-800">
              <span className="font-bold">📌 Note:</span>{" "}
              <span className="font-semibold">
                Teacher, Parent, and Student
              </span>{" "}
              roles will be redirected to their{" "}
              <span className="font-semibold">own separate portal</span> after
              login.
            </p>
          </div>
          <div className="bg-blue-950">
            <div className="grid grid-cols-3 px-4 py-2 border-b border-blue-800">
              <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider">
                Role
              </span>
              <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider">
                Username
              </span>
              <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider">
                Password
              </span>
            </div>
            {DEMO_CREDENTIALS.map((cred, idx) => (
              <button
                key={cred.role}
                type="button"
                onClick={() => fillCredentials(cred)}
                className="w-full grid grid-cols-3 px-4 py-2.5 text-left hover:bg-blue-800 transition-colors border-b border-blue-800/50 last:border-0 group"
                data-ocid={`login.demo_credential.${idx + 1}`}
              >
                <span className="text-yellow-300 text-xs font-semibold group-hover:text-yellow-200 truncate pr-2">
                  {cred.label}
                </span>
                <span className="text-blue-200 text-xs font-mono group-hover:text-white truncate pr-2">
                  {cred.username}
                </span>
                <span className="text-blue-300 text-xs font-mono group-hover:text-white truncate">
                  {cred.password}
                </span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-blue-400 text-xs mt-6">
          <a href="/" className="hover:text-blue-200 transition-colors">
            ← Back to School Website
          </a>
        </p>
      </div>
    </div>
  );
}
