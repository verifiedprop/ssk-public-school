import { StudentLayout } from "@/components/portals/StudentLayout";
import { useAuth } from "@/hooks/useAuth";
import { type Notice, useStudentData } from "@/hooks/useStudentData";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Bell,
  BookOpen,
  Calendar,
  Info,
  PartyPopper,
  Sun,
} from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/student/notices")({
  component: StudentNotices,
});

const categoryConfig: Record<
  Notice["category"],
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    className: string;
  }
> = {
  exam: {
    label: "Exam",
    icon: BookOpen,
    className: "bg-red-100 text-red-700 border-red-200",
  },
  academic: {
    label: "Academic",
    icon: BookOpen,
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  event: {
    label: "Event",
    icon: PartyPopper,
    className: "bg-purple-100 text-purple-700 border-purple-200",
  },
  holiday: {
    label: "Holiday",
    icon: Sun,
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  general: {
    label: "General",
    icon: Info,
    className: "bg-muted text-muted-foreground border-border",
  },
};

function StudentNotices() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { notices } = useStudentData();
  const [activeCategory, setActiveCategory] = useState<
    "all" | Notice["category"]
  >("all");
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  useEffect(() => {
    if (currentUser && currentUser.role !== "student") {
      navigate({ to: "/login" });
    }
  }, [currentUser, navigate]);

  const filtered =
    activeCategory === "all"
      ? notices
      : notices.filter((n) => n.category === activeCategory);

  const categories: ("all" | Notice["category"])[] = [
    "all",
    "exam",
    "academic",
    "event",
    "holiday",
    "general",
  ];

  return (
    <StudentLayout>
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Notice Board</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              School announcements and updates
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            {notices.filter((n) => n.important).length} Important
          </div>
        </div>

        {/* Category filter */}
        <div
          className="flex gap-2 flex-wrap"
          data-ocid="student.notices.filter"
        >
          {categories.map((cat) => {
            const config = cat !== "all" ? categoryConfig[cat] : null;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                data-ocid={`student.notices.tab.${cat}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                  activeCategory === cat
                    ? "bg-amber-500 text-blue-950"
                    : "bg-card border border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {cat === "all" ? "All" : config?.label}
              </button>
            );
          })}
        </div>

        {/* Notice cards */}
        <div className="space-y-3" data-ocid="student.notices.list">
          {filtered.map((notice, i) => {
            const config = categoryConfig[notice.category];
            const CatIcon = config.icon;
            return (
              <button
                key={notice.id}
                type="button"
                className={`w-full text-left bg-card border border-border rounded-xl p-5 cursor-pointer hover:shadow-md transition-shadow ${
                  notice.important ? "border-l-4 border-l-amber-500" : ""
                }`}
                onClick={() => setSelectedNotice(notice)}
                onKeyDown={(e) =>
                  e.key === "Enter" && setSelectedNotice(notice)
                }
                data-ocid={`student.notice.item.${i + 1}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CatIcon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full border ${config.className}`}
                        >
                          {config.label}
                        </span>
                        {notice.important && (
                          <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5">
                            <AlertCircle className="w-3 h-3" /> Important
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(notice.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground mt-2 leading-snug">
                      {notice.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {notice.content}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div
              className="bg-card border border-border rounded-xl p-8 text-center"
              data-ocid="student.notices.empty_state"
            >
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-semibold">
                No notices in this category
              </p>
            </div>
          )}
        </div>

        {/* Notice detail modal */}
        {selectedNotice && (
          <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setSelectedNotice(null)}
            onKeyDown={(e) => e.key === "Escape" && setSelectedNotice(null)}
            role="presentation"
            tabIndex={-1}
            data-ocid="student.notices.dialog"
          >
            <div
              className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              role="document"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full border ${categoryConfig[selectedNotice.category].className}`}
                  >
                    {categoryConfig[selectedNotice.category].label}
                  </span>
                  {selectedNotice.important && (
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5">
                      <AlertCircle className="w-3 h-3" /> Important
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedNotice(null)}
                  data-ocid="student.notices.close_button"
                  className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors flex-shrink-0"
                  aria-label="Close notice"
                >
                  <span className="text-muted-foreground text-lg leading-none">
                    ×
                  </span>
                </button>
              </div>
              <h2 className="text-lg font-bold text-foreground leading-snug">
                {selectedNotice.title}
              </h2>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(selectedNotice.date).toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                {selectedNotice.content}
              </p>
              <button
                type="button"
                onClick={() => setSelectedNotice(null)}
                data-ocid="student.notices.dismiss_button"
                className="mt-5 w-full bg-[#1e3a5f] text-white py-2.5 rounded-lg font-semibold hover:bg-blue-800 transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
