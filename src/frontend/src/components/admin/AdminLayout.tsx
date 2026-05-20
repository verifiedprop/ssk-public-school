import { useAuth } from "@/hooks/useAuth";
import { useRouterState } from "@tanstack/react-router";
import { Bell, LogOut, Menu, User } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export function AdminLayout({
  children,
  title = "Dashboard",
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const { currentUser, logout, role } = useAuth();

  return (
    <div className="min-h-screen flex bg-background" data-ocid="admin.layout">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar currentPath={currentPath} role={role} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-foreground/50"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Close sidebar"
          />
          <div className="relative z-10">
            <AdminSidebar
              currentPath={currentPath}
              role={role}
              onNavigate={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="bg-card border-b border-border px-4 sm:px-6 h-16 flex items-center justify-between shadow-xs"
          data-ocid="admin.topbar"
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-display font-bold text-lg text-foreground">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="relative p-2 rounded-md hover:bg-muted transition-colors"
              aria-label="Notifications"
              data-ocid="admin.notifications_button"
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-foreground leading-tight">
                  {currentUser?.name ?? "Admin"}
                </div>
                <div className="text-xs text-muted-foreground leading-tight capitalize">
                  {(currentUser?.role ?? "admin").replace("_", " ")}
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                className="p-1.5 rounded-md hover:bg-muted transition-colors ml-1"
                aria-label="Logout"
                data-ocid="admin.logout_button"
              >
                <LogOut className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
