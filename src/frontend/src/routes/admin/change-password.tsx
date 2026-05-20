import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/hooks/useAuth";
import { mockBackend } from "@/mocks/backend";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin/change-password")({
  component: ChangePassword,
});

function ChangePassword() {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  useEffect(() => {
    if (!isAuthenticated) {
      void navigate({ to: "/login" as never });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  function validate() {
    const errors: typeof fieldErrors = {};
    if (!currentPassword)
      errors.currentPassword = "Current password is required.";
    if (!newPassword) errors.newPassword = "New password is required.";
    else if (newPassword.length < 6)
      errors.newPassword = "Password must be at least 6 characters.";
    if (!confirmPassword)
      errors.confirmPassword = "Please confirm your new password.";
    else if (newPassword !== confirmPassword)
      errors.confirmPassword = "Passwords do not match.";
    return errors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (!currentUser) {
      setError("Not logged in. Please sign in again.");
      return;
    }

    setIsLoading(true);
    try {
      // Verify current password first
      const username = currentUser.name;
      const isValid = await mockBackend.verifyPassword(
        username,
        currentPassword,
      );
      if (!isValid) {
        setFieldErrors((prev) => ({
          ...prev,
          currentPassword: "Current password is incorrect.",
        }));
        setIsLoading(false);
        return;
      }

      const result = await mockBackend.changePassword(
        username,
        currentPassword,
        newPassword,
      );
      if (result.__kind__ === "ok") {
        setSuccess("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setFieldErrors({});
      } else {
        setError(
          result.__kind__ === "err"
            ? result.err
            : "Failed to change password. Please check your current password.",
        );
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AdminLayout title="Change Password">
      <div className="max-w-lg mx-auto" data-ocid="change_password.page">
        {/* Header Card */}
        <div className="bg-blue-900 rounded-t-2xl px-6 py-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <Lock className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white font-display">
              Change Password
            </h1>
            <p className="text-blue-200 text-sm mt-0.5">
              Update your account password securely.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-b-2xl border border-blue-100 shadow-sm px-6 py-7">
          {/* Success message */}
          {success && (
            <div
              className="mb-5 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm"
              data-ocid="change_password.success_state"
            >
              <span className="text-lg">✅</span>
              <span>{success}</span>
            </div>
          )}

          {/* Global error */}
          {error && (
            <div
              className="mb-5 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm"
              data-ocid="change_password.error_state"
            >
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Current Password */}
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-semibold text-blue-900 mb-1.5"
              >
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                autoComplete="current-password"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm text-blue-900 placeholder:text-blue-300 outline-none focus:ring-2 transition-all ${
                  fieldErrors.currentPassword
                    ? "border-red-400 focus:ring-red-200"
                    : "border-blue-200 focus:ring-amber-300 focus:border-amber-400"
                }`}
                data-ocid="change_password.current_password.input"
              />
              {fieldErrors.currentPassword && (
                <p
                  className="mt-1 text-xs text-red-500"
                  data-ocid="change_password.current_password.field_error"
                >
                  {fieldErrors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-semibold text-blue-900 mb-1.5"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm text-blue-900 placeholder:text-blue-300 outline-none focus:ring-2 transition-all ${
                  fieldErrors.newPassword
                    ? "border-red-400 focus:ring-red-200"
                    : "border-blue-200 focus:ring-amber-300 focus:border-amber-400"
                }`}
                data-ocid="change_password.new_password.input"
              />
              {fieldErrors.newPassword && (
                <p
                  className="mt-1 text-xs text-red-500"
                  data-ocid="change_password.new_password.field_error"
                >
                  {fieldErrors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-blue-900 mb-1.5"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                autoComplete="new-password"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm text-blue-900 placeholder:text-blue-300 outline-none focus:ring-2 transition-all ${
                  fieldErrors.confirmPassword
                    ? "border-red-400 focus:ring-red-200"
                    : "border-blue-200 focus:ring-amber-300 focus:border-amber-400"
                }`}
                data-ocid="change_password.confirm_password.input"
              />
              {fieldErrors.confirmPassword && (
                <p
                  className="mt-1 text-xs text-red-500"
                  data-ocid="change_password.confirm_password.field_error"
                >
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-800 hover:bg-blue-900 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                data-ocid="change_password.submit_button"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin w-4 h-4 border-2 border-white/40 border-t-white rounded-full" />
                    Updating Password…
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Hint */}
          <p className="mt-5 text-xs text-blue-400 text-center">
            Logged in as{" "}
            <span className="font-semibold text-amber-600">
              {currentUser?.name}
            </span>{" "}
            ({currentUser?.role?.replace("_", " ")})
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
