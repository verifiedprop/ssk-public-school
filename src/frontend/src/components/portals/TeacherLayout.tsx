import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  ClipboardCheck,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  QrCode,
  ScrollText,
  X,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/teacher", icon: LayoutDashboard },
  {
    label: "Mark Attendance",
    href: "/teacher/attendance",
    icon: ClipboardCheck,
  },
  {
    label: "Homework & Assignments",
    href: "/teacher/homework",
    icon: BookOpen,
  },
  { label: "Create Mock Test", href: "/teacher/tests", icon: ScrollText },
  { label: "Enter Marks", href: "/teacher/marks", icon: GraduationCap },
  { label: "Student ID Cards", href: "/teacher/idcards", icon: QrCode },
  { label: "My Salary", href: "/teacher/salary", icon: CreditCard },
];

interface TeacherLayoutProps {
  children: React.ReactNode;
  title?: string;
}

function TeacherSidebar({
  currentPath,
  onNavigate,
}: { currentPath: string; onNavigate?: () => void }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    void navigate({ to: "/login" });
  };

  return (
    <aside
      className="w-64 min-h-screen flex flex-col"
      style={{ backgroundColor: "#1e3a8a" }}
      data-ocid="teacher.sidebar"
    >
      {/* Logo */}
      <div
        className="p-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div className="flex items-center gap-3">
          <img
            src="/assets/ssk-logo.png"
            alt="SSK Public School Logo"
            className="h-10 w-auto"
          />
          <div>
            <div className="font-bold text-sm text-white leading-tight">
              SSK Public School
            </div>
            <div className="text-xs text-blue-300 leading-tight">
              Teacher Portal
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Info */}
      <div
        className="px-4 py-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            {currentUser?.name?.charAt(0) ?? "T"}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">
              {currentUser?.name ?? "Teacher"}
            </div>
            <div className="text-xs text-blue-300">Faculty</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5" aria-label="Teacher navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/teacher"
              ? currentPath === "/teacher" || currentPath === "/teacher/"
              : currentPath.startsWith(item.href);
          return (
            <Link
              key={item.href}
              to={item.href as never}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-amber-500 text-blue-950 font-semibold shadow-sm"
                  : "text-white/80 hover:text-white"
              }`}
              onMouseEnter={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLElement).style.backgroundColor = "";
              }}
              data-ocid={`teacher.sidebar.${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="p-4 space-y-1"
        style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
      >
        <Link
          to="/"
          className="flex items-center gap-2 text-xs text-white/50 hover:text-amber-300 transition-colors px-3 py-2 rounded-lg"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              "rgba(255,255,255,0.1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "";
          }}
        >
          ← Back to Website
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 w-full text-xs text-white/60 hover:text-red-300 transition-colors px-3 py-2 rounded-lg"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              "rgba(255,255,255,0.1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "";
          }}
          data-ocid="teacher.logout_button"
        >
          <LogOut className="h-3.5 w-3.5" />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default function TeacherLayout({
  children,
  title = "Teacher Portal",
}: TeacherLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouterState();
  const currentPath = router.location.pathname;

  return (
    <div className="min-h-screen flex bg-background" data-ocid="teacher.layout">
      <div className="hidden lg:block">
        <TeacherSidebar currentPath={currentPath} />
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Close sidebar"
          />
          <div className="relative z-10">
            <TeacherSidebar
              currentPath={currentPath}
              onNavigate={() => setSidebarOpen(false)}
            />
          </div>
          <button
            type="button"
            className="absolute top-4 right-4 z-20 p-2 rounded-lg text-white"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-card border-b border-border px-4 sm:px-6 h-16 flex items-center gap-4 shadow-sm">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <img
            src="/assets/ssk-logo.png"
            alt="SSK Public School Logo"
            className="h-7 w-auto flex-shrink-0"
          />
          <h1 className="font-bold text-lg text-foreground">{title}</h1>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
