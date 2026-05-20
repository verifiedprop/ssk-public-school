import { ParentLayout } from "@/components/portals/ParentLayout";
import { useAuth } from "@/hooks/useAuth";
import { useParentData } from "@/hooks/useParentData";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bell, Calendar, User } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/parent/notices")({
  component: ParentNotices,
});

function categoryColor(cat: string): { color: string; bg: string } {
  if (cat === "General") return { color: "text-blue-700", bg: "bg-blue-100" };
  if (cat === "Exam") return { color: "text-purple-700", bg: "bg-purple-100" };
  if (cat === "Holiday") return { color: "text-green-700", bg: "bg-green-100" };
  if (cat === "Event") return { color: "text-amber-700", bg: "bg-amber-100" };
  if (cat === "Fee") return { color: "text-red-700", bg: "bg-red-100" };
  return { color: "text-red-800", bg: "bg-red-200" };
}

function ParentNotices() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { notices, markNoticeRead, unreadNotices, unreadMessages } =
    useParentData();
  const [filter, setFilter] = useState<"All" | "Unread">("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser && currentUser.role !== "parent")
      navigate({ to: "/login" });
  }, [currentUser, navigate]);

  const filtered =
    filter === "Unread" ? notices.filter((n) => !n.isRead) : notices;

  const handleExpand = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
    markNoticeRead(id);
  };

  return (
    <ParentLayout unreadNotices={unreadNotices} unreadMessages={unreadMessages}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              School Notices
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {unreadNotices} unread notice{unreadNotices !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex gap-2">
            {(["All", "Unread"] as const).map((f) => (
              <button
                key={f}
                type="button"
                data-ocid={`parent.notices.filter.${f.toLowerCase()}`}
                onClick={() => setFilter(f)}
                className={
                  filter === f
                    ? "px-4 py-2 rounded-lg text-sm font-medium border bg-[#1e3a5f] text-white border-[#1e3a5f]"
                    : "px-4 py-2 rounded-lg text-sm font-medium border bg-card text-foreground border-border hover:bg-muted"
                }
              >
                {f}
                {f === "Unread" && unreadNotices > 0 && (
                  <span className="ml-1.5 text-xs bg-amber-500 text-blue-950 px-1.5 py-0.5 rounded-full font-bold">
                    {unreadNotices}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div
            data-ocid="parent.notices.empty_state"
            className="text-center py-16"
          >
            <Bell size={40} className="mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground font-medium">
              No unread notices
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              You're all caught up!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((notice, i) => {
              const cfg = categoryColor(notice.category);
              const isOpen = expanded === notice.id;
              return (
                <div
                  key={notice.id}
                  data-ocid={`parent.notices.item.${i + 1}`}
                  className={
                    !notice.isRead
                      ? "bg-card rounded-xl border border-amber-300 shadow-sm transition-shadow"
                      : "bg-card rounded-xl border border-border transition-shadow"
                  }
                >
                  <button
                    type="button"
                    data-ocid={`parent.notices.expand.${i + 1}`}
                    className="w-full text-left p-5"
                    onClick={() => handleExpand(notice.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          {!notice.isRead && (
                            <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                          )}
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}
                          >
                            {notice.category}
                          </span>
                          {notice.category === "Urgent" && (
                            <span className="text-xs font-bold text-red-700 animate-pulse">
                              ● Urgent
                            </span>
                          )}
                        </div>
                        <p
                          className={
                            !notice.isRead
                              ? "font-semibold text-foreground text-sm"
                              : "font-semibold text-foreground/80 text-sm"
                          }
                        >
                          {notice.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar size={11} />
                            {notice.date}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <User size={11} />
                            {notice.postedBy}
                          </span>
                        </div>
                      </div>
                      <span
                        className={
                          isOpen
                            ? "text-muted-foreground transition-transform duration-200 flex-shrink-0 rotate-180"
                            : "text-muted-foreground transition-transform duration-200 flex-shrink-0"
                        }
                      >
                        ▾
                      </span>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-0">
                      <div className="border-t border-border pt-4">
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          {notice.content}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ParentLayout>
  );
}
