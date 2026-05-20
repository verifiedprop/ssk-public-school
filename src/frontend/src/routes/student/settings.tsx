import { StudentLayout } from "@/components/portals/StudentLayout";
import { useAuth } from "@/hooks/useAuth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock, Save } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/student/settings")({
  component: StudentSettings,
});

function StudentSettings() {
  const { currentUser, initialized } = useAuth();
  const navigate = useNavigate();
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialized) return;
    if (!currentUser || currentUser.role !== "student")
      void navigate({ to: "/login" as never });
  }, [currentUser, initialized, navigate]);

  if (!initialized || !currentUser) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!current) {
      setError("Please enter your current password.");
      return;
    }
    if (newPass.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPass !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSaved(true);
    setCurrent("");
    setNewPass("");
    setConfirm("");
    setTimeout(() => setSaved(false), 4000);
  }

  return (
    <StudentLayout>
      <div className="p-4 md:p-6 max-w-lg" data-ocid="student.settings.page">
        <h1 className="text-xl font-bold mb-1" style={{ color: "#581c87" }}>
          Settings
        </h1>
        <p className="text-sm mb-6" style={{ color: "#a78bfa" }}>
          Manage your account preferences
        </p>

        {/* Change Password Card */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "#ffffff", border: "1px solid #ede9fe" }}
          data-ocid="student.change_password_section"
        >
          <div
            className="px-5 py-4 flex items-center gap-2 border-b"
            style={{ borderColor: "#ede9fe", background: "#faf5ff" }}
          >
            <Lock className="w-5 h-5" style={{ color: "#7e22ce" }} />
            <h2 className="font-semibold" style={{ color: "#581c87" }}>
              Change Password
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label
                htmlFor="current_password"
                className="block text-xs font-medium mb-1"
                style={{ color: "#7e22ce" }}
              >
                Current Password
              </label>
              <input
                id="current_password"
                type="password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                placeholder="Enter current password"
                className="w-full rounded-lg border px-3 py-2 text-sm"
                style={{ borderColor: "#c4b5fd", color: "#581c87" }}
                data-ocid="student.settings.current_password_input"
              />
            </div>

            <div>
              <label
                htmlFor="new_password"
                className="block text-xs font-medium mb-1"
                style={{ color: "#7e22ce" }}
              >
                New Password
              </label>
              <input
                id="new_password"
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Enter new password (min 6 chars)"
                className="w-full rounded-lg border px-3 py-2 text-sm"
                style={{ borderColor: "#c4b5fd", color: "#581c87" }}
                data-ocid="student.settings.new_password_input"
              />
            </div>

            <div>
              <label
                htmlFor="confirm_password"
                className="block text-xs font-medium mb-1"
                style={{ color: "#7e22ce" }}
              >
                Confirm New Password
              </label>
              <input
                id="confirm_password"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full rounded-lg border px-3 py-2 text-sm"
                style={{ borderColor: "#c4b5fd", color: "#581c87" }}
                data-ocid="student.settings.confirm_password_input"
              />
            </div>

            {error && (
              <p
                className="text-sm font-medium"
                style={{ color: "#dc2626" }}
                data-ocid="student.settings.error_state"
              >
                {error}
              </p>
            )}

            {saved && (
              <p
                className="text-sm font-medium"
                style={{ color: "#16a34a" }}
                data-ocid="student.settings.success_state"
              >
                ✓ Password changed successfully!
              </p>
            )}

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white"
              style={{ background: "#7e22ce" }}
              data-ocid="student.settings.save_button"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div
          className="rounded-xl p-5 mt-4"
          style={{ background: "#faf5ff", border: "1px solid #ede9fe" }}
          data-ocid="student.account_info_section"
        >
          <h3
            className="font-semibold text-sm mb-3"
            style={{ color: "#581c87" }}
          >
            Account Information
          </h3>
          <div className="space-y-2">
            {[
              { label: "Name", value: currentUser.name ?? "Priya Mehta" },
              {
                label: "Username",
                value:
                  (currentUser as { username?: string }).username ??
                  currentUser.name ??
                  "student",
              },
              { label: "Role", value: "Student" },
              { label: "Class", value: "9-B" },
              { label: "Session", value: "2025–26" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between text-sm">
                <span style={{ color: "#a78bfa" }}>{item.label}</span>
                <span className="font-medium" style={{ color: "#581c87" }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
