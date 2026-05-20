import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/hooks/useAuth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/admin/")({ component: AdminDashboard });

const statCards = [
  {
    icon: "👥",
    value: "1,247",
    label: "Total Students",
    trend: "+5% this month",
    trendUp: true,
  },
  {
    icon: "📋",
    value: "84",
    label: "Total Leads",
    trend: "+12 this week",
    trendUp: true,
  },
  {
    icon: "✨",
    value: "8",
    label: "New Leads Today",
    trend: null,
    trendUp: false,
  },
  {
    icon: "📊",
    value: "94%",
    label: "Attendance Rate",
    trend: "+2% vs last month",
    trendUp: true,
  },
  {
    icon: "💰",
    value: "₹4.2L",
    label: "Fees Collected",
    trend: "This month",
    trendUp: true,
  },
  {
    icon: "⏳",
    value: "₹82K",
    label: "Fees Pending",
    trend: "12 students",
    trendUp: false,
  },
  {
    icon: "👩‍🏫",
    value: "52",
    label: "Active Teachers",
    trend: null,
    trendUp: false,
  },
  {
    icon: "📅",
    value: "3",
    label: "Exams This Week",
    trend: null,
    trendUp: false,
  },
];

const recentActivity = [
  {
    time: "10:30 AM",
    action: "New admission lead: Ravi Gupta (Class 9)",
    type: "lead",
  },
  {
    time: "09:45 AM",
    action: "Fee payment received: Meena Patel — ₹12,500",
    type: "fee",
  },
  {
    time: "09:15 AM",
    action: "Attendance marked for Class 10-A (42/44 present)",
    type: "attendance",
  },
  {
    time: "08:50 AM",
    action: "New student registered: Arjun Sharma (Class 6)",
    type: "student",
  },
  {
    time: "Yesterday",
    action: "Mock test created: Class 12 Physics Chapter 5",
    type: "exam",
  },
];

const typeColors: Record<string, string> = {
  lead: "bg-blue-100 text-blue-700",
  fee: "bg-green-100 text-green-700",
  attendance: "bg-yellow-100 text-yellow-700",
  student: "bg-purple-100 text-purple-700",
  exam: "bg-orange-100 text-orange-700",
};

const typeIcons: Record<string, string> = {
  lead: "📋",
  fee: "💰",
  attendance: "✅",
  student: "👤",
  exam: "📝",
};

function AdminDashboard() {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      void navigate({ to: "/login" as never });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6" data-ocid="dashboard.page">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-6 text-white">
          <h1 className="text-xl font-bold font-display mb-1">
            Welcome back, {currentUser?.name ?? "Admin"}! 👋
          </h1>
          <p className="text-blue-200 text-sm">
            Here's what's happening at SSK Public School today.
          </p>
        </div>

        {/* Stats Grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          data-ocid="dashboard.stats"
        >
          {statCards.map(({ icon, value, label, trend, trendUp }, i) => (
            <div
              key={label}
              className="bg-white rounded-xl border border-blue-100 p-5 shadow-sm hover:shadow-md transition-shadow"
              data-ocid={`dashboard.stat.${i + 1}`}
            >
              <div className="text-3xl mb-3">{icon}</div>
              <div className="text-2xl font-bold text-blue-900 font-display">
                {value}
              </div>
              <div className="text-sm text-blue-600 mt-0.5">{label}</div>
              {trend && (
                <div
                  className={`text-xs mt-2 font-medium ${trendUp ? "text-green-600" : "text-red-500"}`}
                >
                  {trendUp ? "↑" : "↓"} {trend}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Activity + Quick Links */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div
            className="lg:col-span-2 bg-white rounded-xl border border-blue-100 p-6 shadow-sm"
            data-ocid="dashboard.activity"
          >
            <h2 className="text-lg font-bold text-blue-900 font-display mb-5">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map(({ time, action, type }, i) => (
                <div
                  key={action}
                  className="flex items-start gap-3"
                  data-ocid={`dashboard.activity.${i + 1}`}
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${typeColors[type]}`}
                  >
                    {typeIcons[type]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-blue-800 leading-snug">
                      {action}
                    </p>
                    <p className="text-xs text-blue-400 mt-0.5">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl border border-blue-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-blue-900 font-display mb-5">
              Quick Actions
            </h2>
            <div className="space-y-3">
              {[
                {
                  label: "Add New Student",
                  href: "/admin/students",
                  icon: "👤",
                },
                {
                  label: "View Admission Leads",
                  href: "/admin/leads",
                  icon: "📋",
                },
                { label: "Mark Attendance", href: "/login", icon: "✅" },
                { label: "Collect Fee", href: "/login", icon: "💰" },
                { label: "Post Notice", href: "/login", icon: "📢" },
              ].map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
                  data-ocid="dashboard.quick_link"
                >
                  <span className="text-xl">{icon}</span>
                  <span className="text-sm font-medium text-blue-800 group-hover:text-blue-900">
                    {label}
                  </span>
                  <span className="ml-auto text-blue-400 group-hover:text-blue-600">
                    →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
