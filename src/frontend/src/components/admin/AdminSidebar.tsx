import type { UserRole } from "@/types/school";
import {
  BarChart3,
  BookOpen,
  CalendarCheck,
  ChevronRight,
  ClipboardList,
  DollarSign,
  LayoutDashboard,
  Lock,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";

interface NavItem {
  icon: typeof LayoutDashboard;
  label: string;
  href: string;
  roles: UserRole[];
  comingSoon?: boolean;
}

const navItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/admin",
    roles: ["super_admin", "principal", "accountant", "admission_counsellor"],
  },
  {
    icon: Users,
    label: "Students",
    href: "/admin/students",
    roles: ["super_admin", "principal", "teacher"],
  },
  {
    icon: UserPlus,
    label: "Admission Leads",
    href: "/admin/leads",
    roles: ["super_admin", "principal", "admission_counsellor"],
  },
  {
    icon: DollarSign,
    label: "Fees",
    href: "/admin/fees",
    roles: ["super_admin", "principal", "accountant"],
  },
  {
    icon: Wallet,
    label: "Salary",
    href: "/admin/salary",
    roles: ["super_admin", "principal", "accountant"],
  },
  {
    icon: CalendarCheck,
    label: "Attendance",
    href: "/admin/attendance",
    roles: ["super_admin", "principal", "teacher"],
  },
  {
    icon: BookOpen,
    label: "Results",
    href: "/admin/results",
    roles: ["super_admin", "principal", "teacher"],
  },
  {
    icon: ClipboardList,
    label: "Mock Tests",
    href: "/admin/tests",
    roles: ["super_admin", "principal", "teacher"],
  },
  {
    icon: BarChart3,
    label: "Finance",
    href: "/admin/finance",
    roles: ["super_admin", "principal", "accountant"],
  },
  {
    icon: Lock,
    label: "Change Password",
    href: "/admin/change-password",
    roles: [
      "super_admin",
      "principal",
      "accountant",
      "teacher",
      "parent",
      "student",
      "admission_counsellor",
    ],
  },
];

interface AdminSidebarProps {
  currentPath: string;
  role?: UserRole | null;
  onNavigate?: () => void;
}

export function AdminSidebar({
  currentPath,
  role,
  onNavigate,
}: AdminSidebarProps) {
  const visibleItems = role
    ? navItems.filter((item) => item.roles.includes(role))
    : navItems;

  return (
    <aside
      className="w-64 bg-secondary min-h-screen flex flex-col"
      data-ocid="admin.sidebar"
    >
      {/* Logo */}
      <div className="p-5 border-b border-primary/20">
        <div className="flex items-center gap-3">
          <img
            src="/assets/ssk-logo.png"
            alt="SSK Public School Logo"
            className="h-10 w-auto"
          />
          <div>
            <div className="font-display font-bold text-sm text-white leading-tight">
              SSK Public School
            </div>
            <div className="text-xs text-amber-300/80 leading-tight">
              Admin Panel
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1" aria-label="Admin navigation">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? currentPath === "/admin"
              : currentPath.startsWith(item.href);
          if (item.comingSoon) {
            return (
              <div
                key={item.href}
                title="Coming in Phase 2"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 opacity-40 pointer-events-none select-none cursor-default"
                data-ocid={`admin.sidebar.${item.label.toLowerCase().replace(" ", "_")}`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                <span className="text-[10px] font-semibold bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded-full leading-tight">
                  Soon
                </span>
              </div>
            );
          }
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth ${
                isActive
                  ? "bg-amber-500 text-blue-950 font-semibold shadow-xs"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
              data-ocid={`admin.sidebar.${item.label.toLowerCase().replace(" ", "_")}`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
            </a>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-primary/20">
        <a
          href="/"
          className="flex items-center gap-2 text-xs text-white/50 hover:text-amber-300 transition-colors"
        >
          ← Back to Website
        </a>
      </div>
    </aside>
  );
}
