import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  CalendarCheck,
  CreditCard,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Settings,
  Trophy,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

interface ParentLayoutProps {
  children: React.ReactNode;
  unreadNotices?: number;
  unreadMessages?: number;
}

const navItems = [
  { label: "Dashboard", path: "/parent", icon: Home },
  {
    label: "My Child's Attendance",
    path: "/parent/attendance",
    icon: CalendarCheck,
  },
  { label: "Fee Status", path: "/parent/fees", icon: CreditCard },
  { label: "Exam Results", path: "/parent/results", icon: Trophy },
  { label: "Notices", path: "/parent/notices", icon: Bell },
  { label: "Message Teacher", path: "/parent/messages", icon: MessageCircle },
  { label: "Settings", path: "/parent/settings", icon: Settings },
];

export function ParentLayout({
  children,
  unreadNotices = 0,
  unreadMessages = 0,
}: ParentLayoutProps) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    void navigate({ to: "/login" });
  };
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getBadge = (path: string) => {
    if (path === "/parent/notices") return unreadNotices;
    if (path === "/parent/messages") return unreadMessages;
    return 0;
  };

  const isActive = (path: string) => {
    if (path === "/parent")
      return currentPath === "/parent" || currentPath === "/parent/";
    return currentPath.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {sidebarOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — Green theme for Parent Portal */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ backgroundColor: "#14532d" }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
        >
          <img
            src="/assets/ssk-logo.png"
            alt="SSK Public School Logo"
            className="h-10 w-auto flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="text-white font-bold text-sm leading-tight truncate">
              SSK Public School
            </p>
            <p className="text-green-300 text-xs">Parent Portal</p>
          </div>
          <button
            type="button"
            className="ml-auto lg:hidden text-white/70 hover:text-white"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* User chip */}
        <div
          className="mx-3 mt-4 mb-2 p-3 rounded-lg"
          style={{
            backgroundColor: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center flex-shrink-0">
              <span className="text-amber-600 font-bold text-xs">P</span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">
                Mr. Sharma
              </p>
              <p className="text-green-300 text-xs">
                Parent of Rahul · Cl 10-A
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const badge = getBadge(item.path);
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path as string}
                data-ocid={`parent.nav.${item.label.toLowerCase().replace(/[^a-z0-9]/g, "_")}`}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  active
                    ? "bg-amber-500 text-green-950 font-semibold"
                    : "text-white/80 hover:text-white"
                }`}
                style={
                  !active
                    ? ({
                        "--hover-bg": "rgba(255,255,255,0.1)",
                      } as React.CSSProperties)
                    : {}
                }
                onMouseEnter={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLElement).style.backgroundColor = "";
                }}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={17} className="flex-shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
                {badge > 0 && (
                  <span
                    className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                      active
                        ? "bg-green-950 text-amber-400"
                        : "bg-amber-500 text-green-950"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className="px-3 pb-4 pt-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          <p className="text-green-300 text-xs px-3 mb-1 truncate">
            Signed in as
          </p>
          <p className="text-white text-sm font-medium px-3 mb-2 truncate">
            {currentUser?.name ?? "Parent"}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            data-ocid="parent.logout_button"
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white transition-colors"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                "rgba(255,255,255,0.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "";
            }}
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <button
            type="button"
            className="lg:hidden p-1.5 rounded-md text-muted-foreground hover:bg-muted"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#14532d" }}
          >
            <User size={14} className="text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-foreground font-semibold text-base truncate">
              Parent Portal
            </h1>
            <p className="text-muted-foreground text-xs">
              SSK Public School — 2025–26
            </p>
          </div>
          {(unreadNotices > 0 || unreadMessages > 0) && (
            <div className="ml-auto flex items-center gap-2">
              {unreadNotices > 0 && (
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full font-medium">
                  {unreadNotices} notice{unreadNotices > 1 ? "s" : ""}
                </span>
              )}
              {unreadMessages > 0 && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                  {unreadMessages} message{unreadMessages > 1 ? "s" : ""}
                </span>
              )}
            </div>
          )}
        </header>
        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
