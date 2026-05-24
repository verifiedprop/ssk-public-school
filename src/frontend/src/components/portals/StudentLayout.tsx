import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BarChart2,
  Bell,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/student", icon: LayoutDashboard },
  { label: "My Attendance", href: "/student/attendance", icon: CalendarCheck },
  { label: "Mock Tests", href: "/student/tests", icon: FlaskConical },
  { label: "My Results", href: "/student/results", icon: BarChart2 },
  { label: "Assignments", href: "/student/assignments", icon: ClipboardList },
  { label: "Notice Board", href: "/student/notices", icon: Bell },
  { label: "Settings", href: "/student/settings", icon: Settings },
];

export function StudentLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    void navigate({ to: "/login" });
  };
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/student"
      ? currentPath === "/student" || currentPath === "/student/"
      : currentPath.startsWith(href);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {sidebarOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — Purple theme for Student Portal */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ backgroundColor: "#581c87" }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-5 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
        >
          <img
            src="/assets/ssk-logo.png"
            alt="SSK Public School Logo"
            className="h-10 w-auto flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="font-bold text-white text-sm leading-tight truncate">
              SSK Public School
            </p>
            <p className="text-purple-300 text-xs truncate">Student Portal</p>
          </div>
          <button
            type="button"
            className="ml-auto lg:hidden text-purple-300 hover:text-white"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student info */}
        <div
          className="px-5 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
              style={{
                backgroundColor: "rgba(245,158,11,0.2)",
                border: "2px solid #f59e0b",
                color: "#f59e0b",
              }}
            >
              PM
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">
                {currentUser?.name ?? "Priya Mehta"}
              </p>
              <p className="text-purple-300 text-xs truncate">
                Class 9-B · Roll No. 14
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    data-ocid={`student.nav.${item.label.toLowerCase().replace(/[^a-z0-9]/g, "_")}`}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      active
                        ? "bg-amber-500 text-purple-950 font-semibold"
                        : "text-purple-100"
                    }`}
                    onMouseEnter={(e) => {
                      if (!active)
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          "rgba(255,255,255,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      if (!active)
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          "";
                    }}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div
          className="px-3 py-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          <button
            type="button"
            onClick={handleLogout}
            data-ocid="student.logout_button"
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-purple-100 hover:text-white transition-colors duration-200"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                "rgba(255,255,255,0.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "";
            }}
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-4 lg:px-6 py-3 flex items-center gap-4">
          <button
            type="button"
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#581c87" }}
          >
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-foreground text-sm">
            Student Portal
          </span>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Session 2025–26
            </span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
              style={{
                backgroundColor: "rgba(245,158,11,0.15)",
                border: "1px solid #f59e0b",
                color: "#b45309",
              }}
            >
              PM
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </div>
  );
}
