import { StudentLayout } from "@/components/portals/StudentLayout";
import { useAuth } from "@/hooks/useAuth";
import { type Assignment, useStudentData } from "@/hooks/useStudentData";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Clock,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/student/assignments")({
  component: StudentAssignments,
});

const statusConfig: Record<
  Assignment["status"],
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    className: string;
  }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  submitted: {
    label: "Submitted",
    icon: CheckCircle2,
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  graded: {
    label: "Graded",
    icon: Star,
    className: "bg-green-50 text-green-700 border-green-200",
  },
};

function StudentAssignments() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { assignments } = useStudentData();
  const [filter, setFilter] = useState<"all" | Assignment["status"]>("all");
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    if (currentUser && currentUser.role !== "student") {
      navigate({ to: "/login" });
    }
  }, [currentUser, navigate]);

  const filtered =
    filter === "all"
      ? assignments
      : assignments.filter((a) => a.status === filter);

  const counts = {
    all: assignments.length,
    pending: assignments.filter((a) => a.status === "pending").length,
    submitted: assignments.filter((a) => a.status === "submitted").length,
    graded: assignments.filter((a) => a.status === "graded").length,
  };

  return (
    <StudentLayout>
      <div className="p-4 lg:p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Assignments</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Class 9-B · Track and submit your assignments
          </p>
        </div>

        {/* Stat pills */}
        <div
          className="flex gap-3 flex-wrap"
          data-ocid="student.assignments.filter"
        >
          {(
            [
              { key: "all", label: "All" },
              { key: "pending", label: "Pending" },
              { key: "submitted", label: "Submitted" },
              { key: "graded", label: "Graded" },
            ] as const
          ).map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              data-ocid={`student.assignments.tab.${f.key}`}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === f.key
                  ? "bg-amber-500 text-blue-950"
                  : "bg-card border border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {f.label}
              <span
                className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                  filter === f.key ? "bg-blue-900/20" : "bg-muted"
                }`}
              >
                {counts[f.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Assignment cards */}
        <div className="space-y-3" data-ocid="student.assignments.list">
          {filtered.length === 0 && (
            <div
              className="bg-card border border-border rounded-xl p-8 text-center"
              data-ocid="student.assignments.empty_state"
            >
              <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-semibold">
                No assignments found
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Assignments will appear here when your teachers post them.
              </p>
            </div>
          )}
          {filtered.map((a, i) => {
            const config = statusConfig[a.status];
            const Icon = config.icon;
            const isExpanded = expanded === a.id;
            return (
              <div
                key={a.id}
                className="bg-card border border-border rounded-xl overflow-hidden border-l-4 border-l-amber-500"
                data-ocid={`student.assignment.item.${i + 1}`}
              >
                <button
                  type="button"
                  className="w-full text-left px-5 py-4 hover:bg-muted/20 transition-colors"
                  onClick={() => setExpanded(isExpanded ? null : a.id)}
                  data-ocid={`student.assignment.toggle.${i + 1}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                          {a.subject}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${config.className}`}
                        >
                          <Icon className="w-3 h-3" /> {config.label}
                        </span>
                        {a.grade && (
                          <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Grade: {a.grade}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground mt-2 leading-snug">
                        {a.title}
                      </h3>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p
                        className={`text-xs font-medium ${a.status === "pending" ? "text-red-500" : "text-muted-foreground"}`}
                      >
                        Due{" "}
                        {new Date(a.dueDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                      <BookOpen
                        className={`w-4 h-4 mt-2 ml-auto transition-transform ${isExpanded ? "rotate-180" : ""} text-muted-foreground`}
                      />
                    </div>
                  </div>
                </button>
                {isExpanded && (
                  <div
                    className="px-5 pb-4 pt-1 border-t border-border bg-muted/20"
                    data-ocid={`student.assignment.details.${i + 1}`}
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {a.description}
                    </p>
                    {a.status === "pending" && (
                      <button
                        type="button"
                        data-ocid={`student.assignment.submit_button.${i + 1}`}
                        className="mt-3 bg-[#1e3a5f] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                      >
                        Mark as Submitted
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </StudentLayout>
  );
}
