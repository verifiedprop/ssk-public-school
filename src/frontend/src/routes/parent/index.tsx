import { ParentLayout } from "@/components/portals/ParentLayout";
import { useAuth } from "@/hooks/useAuth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  CalendarCheck,
  CreditCard,
  MessageSquare,
  Send,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/parent/")({
  component: ParentDashboard,
});

const weekDays = [
  { day: "Mon", date: "13", present: true },
  { day: "Tue", date: "14", present: true },
  { day: "Wed", date: "15", present: false },
  { day: "Thu", date: "16", present: true },
  { day: "Fri", date: "17", present: true },
  { day: "Mon", date: "20", present: true },
  { day: "Tue", date: "21", present: true },
  { day: "Wed", date: "22", present: true },
  { day: "Thu", date: "23", present: false },
  { day: "Fri", date: "24", present: true },
];

const feeInstallments = [
  {
    label: "May 2026 Tuition Fee",
    amount: 3500,
    due: "31 May 2026",
    overdue: false,
  },
  {
    label: "Jun 2026 Tuition Fee",
    amount: 3500,
    due: "30 Jun 2026",
    overdue: false,
  },
  {
    label: "Annual Sports Fee",
    amount: 1500,
    due: "15 Jun 2026",
    overdue: false,
  },
];

const examResults = [
  { subject: "Mathematics", marks: 87, grade: "A" },
  { subject: "Science", marks: 91, grade: "A+" },
  { subject: "English", marks: 79, grade: "B+" },
];

const teachers = [
  "Mrs. Anita Sharma (Class Teacher)",
  "Mr. Rohit Gupta (Mathematics)",
  "Mrs. Kavya Nair (Science)",
  "Mr. Suresh Yadav (English)",
];

const notices = [
  {
    title: "Annual Day celebration — 25 May 2026",
    date: "15 May",
    tag: "Event",
  },
  {
    title: "Fee reminder: May installment due by 31 May",
    date: "12 May",
    tag: "Finance",
  },
  {
    title: "Parent-Teacher Meeting scheduled for 28 May",
    date: "10 May",
    tag: "Meeting",
  },
];

function ParentDashboard() {
  const { currentUser, initialized } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [teacher, setTeacher] = useState(teachers[0]);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!initialized) return;
    if (!currentUser || currentUser.role !== "parent")
      void navigate({ to: "/login" as never });
  }, [currentUser, initialized, navigate]);

  if (!initialized) return null;

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSent(true);
    setMessage("");
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <ParentLayout>
      <div className="space-y-6 max-w-5xl">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            data-ocid="parent.attendance_stat"
            className="rounded-xl p-4 border-l-4"
            style={{
              background: "#ffffff",
              borderLeftColor: "#16a34a",
              borderTop: "1px solid #bbf7d0",
              borderRight: "1px solid #bbf7d0",
              borderBottom: "1px solid #bbf7d0",
            }}
          >
            <div
              className="text-3xl font-bold mb-1"
              style={{ color: "#14532d" }}
            >
              92%
            </div>
            <div className="text-sm font-semibold" style={{ color: "#166534" }}>
              Attendance
            </div>
            <div className="text-xs mt-0.5" style={{ color: "#4ade80" }}>
              Aryan Kumar
            </div>
          </div>
          <div
            data-ocid="parent.fees_stat"
            className="rounded-xl p-4 border-l-4"
            style={{
              background: "#ffffff",
              borderLeftColor: "#dc2626",
              borderTop: "1px solid #bbf7d0",
              borderRight: "1px solid #bbf7d0",
              borderBottom: "1px solid #bbf7d0",
            }}
          >
            <div
              className="text-3xl font-bold mb-1"
              style={{ color: "#dc2626" }}
            >
              ₹8,500
            </div>
            <div className="text-sm font-semibold" style={{ color: "#166534" }}>
              Fees Due
            </div>
            <div className="text-xs mt-0.5" style={{ color: "#4ade80" }}>
              3 installments
            </div>
          </div>
          <div
            data-ocid="parent.exam_stat"
            className="rounded-xl p-4 border-l-4"
            style={{
              background: "#ffffff",
              borderLeftColor: "#d97706",
              borderTop: "1px solid #bbf7d0",
              borderRight: "1px solid #bbf7d0",
              borderBottom: "1px solid #bbf7d0",
            }}
          >
            <div
              className="text-3xl font-bold mb-1"
              style={{ color: "#d97706" }}
            >
              25 May
            </div>
            <div className="text-sm font-semibold" style={{ color: "#166534" }}>
              Next Exam
            </div>
            <div className="text-xs mt-0.5" style={{ color: "#4ade80" }}>
              Science Unit Test
            </div>
          </div>
          <div
            data-ocid="parent.messages_stat"
            className="rounded-xl p-4 border-l-4"
            style={{
              background: "#ffffff",
              borderLeftColor: "#7c3aed",
              borderTop: "1px solid #bbf7d0",
              borderRight: "1px solid #bbf7d0",
              borderBottom: "1px solid #bbf7d0",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl font-bold" style={{ color: "#7c3aed" }}>
                3
              </span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: "#ede9fe", color: "#7c3aed" }}
              >
                Unread
              </span>
            </div>
            <div className="text-sm font-semibold" style={{ color: "#166534" }}>
              Messages
            </div>
            <div className="text-xs mt-0.5" style={{ color: "#4ade80" }}>
              From teachers
            </div>
          </div>
        </div>

        {/* Weekly Attendance Grid */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "#ffffff", border: "1px solid #bbf7d0" }}
          data-ocid="parent.attendance_section"
        >
          <div
            className="px-5 py-4 flex items-center gap-2 border-b"
            style={{ borderColor: "#bbf7d0" }}
          >
            <CalendarCheck size={18} style={{ color: "#16a34a" }} />
            <h2 className="font-semibold" style={{ color: "#14532d" }}>
              Weekly Attendance — Aryan Kumar
            </h2>
            <span
              className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "#dcfce7", color: "#14532d" }}
            >
              92% This Month
            </span>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-5 gap-3">
              {weekDays.map((d, _i) => (
                <div
                  key={`${d.day}-${d.date}`}
                  className="flex flex-col items-center gap-1.5"
                  data-ocid={`parent.attendance_day.${_i + 1}`}
                >
                  <span
                    className="text-xs font-medium"
                    style={{ color: "#4ade80" }}
                  >
                    {d.day}
                  </span>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      background: d.present ? "#14532d" : "#fef2f2",
                      color: d.present ? "#bbf7d0" : "#dc2626",
                      border: d.present ? "none" : "2px solid #fca5a5",
                    }}
                  >
                    {d.date}
                  </div>
                  <span
                    className="text-xs"
                    style={{ color: d.present ? "#16a34a" : "#dc2626" }}
                  >
                    {d.present ? "P" : "A"}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="mt-4 flex items-center gap-4 text-xs"
              style={{ color: "#166534" }}
            >
              <span className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ background: "#14532d" }}
                />
                Present (8 days)
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full inline-block border-2"
                  style={{ background: "#fef2f2", borderColor: "#fca5a5" }}
                />
                Absent (2 days)
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Fees */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: "#ffffff", border: "1px solid #bbf7d0" }}
            data-ocid="parent.fees_section"
          >
            <div
              className="px-5 py-4 flex items-center gap-2 border-b"
              style={{ borderColor: "#bbf7d0" }}
            >
              <CreditCard size={18} style={{ color: "#16a34a" }} />
              <h2 className="font-semibold" style={{ color: "#14532d" }}>
                Upcoming Fee Installments
              </h2>
            </div>
            <div className="divide-y" style={{ borderColor: "#bbf7d0" }}>
              {feeInstallments.map((fee, _i) => (
                <div
                  key={fee.label}
                  className="px-5 py-3 flex items-center justify-between"
                  data-ocid={`parent.fee.item.${_i + 1}`}
                >
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#14532d" }}
                    >
                      {fee.label}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#4ade80" }}>
                      Due: {fee.due}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-sm font-bold"
                      style={{ color: "#14532d" }}
                    >
                      ₹{fee.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ background: "#f0fdf4" }}
            >
              <div>
                <p className="text-xs" style={{ color: "#166534" }}>
                  Total Due
                </p>
                <p className="text-lg font-bold" style={{ color: "#14532d" }}>
                  ₹8,500
                </p>
              </div>
              <button
                type="button"
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors hover:opacity-90"
                style={{ background: "#14532d" }}
                data-ocid="parent.pay_now_button"
              >
                Pay Now
              </button>
            </div>
          </div>

          {/* Exam Results */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: "#ffffff", border: "1px solid #bbf7d0" }}
            data-ocid="parent.results_section"
          >
            <div
              className="px-5 py-4 flex items-center gap-2 border-b"
              style={{ borderColor: "#bbf7d0" }}
            >
              <Trophy size={18} style={{ color: "#16a34a" }} />
              <h2 className="font-semibold" style={{ color: "#14532d" }}>
                Last 3 Exam Results — Aryan
              </h2>
            </div>
            <div className="p-5 space-y-4">
              {examResults.map((r, i) => (
                <div key={r.subject} data-ocid={`parent.result.item.${i + 1}`}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium" style={{ color: "#14532d" }}>
                      {r.subject}
                    </span>
                    <span
                      className="font-bold px-2 py-0.5 rounded text-xs"
                      style={{
                        background:
                          r.marks >= 90
                            ? "#dcfce7"
                            : r.marks >= 80
                              ? "#bbf7d0"
                              : "#fef9c3",
                        color:
                          r.marks >= 90
                            ? "#14532d"
                            : r.marks >= 80
                              ? "#166534"
                              : "#854d0e",
                      }}
                    >
                      {r.grade}
                    </span>
                  </div>
                  <div
                    className="h-3 rounded-full overflow-hidden"
                    style={{ background: "#dcfce7" }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${r.marks}%`,
                        background:
                          r.marks >= 90
                            ? "#14532d"
                            : r.marks >= 80
                              ? "#16a34a"
                              : "#86efac",
                      }}
                    />
                  </div>
                  <p className="text-xs mt-1" style={{ color: "#4ade80" }}>
                    {r.marks}/100
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Message Teacher */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "#ffffff", border: "1px solid #bbf7d0" }}
          data-ocid="parent.message_section"
        >
          <div
            className="px-5 py-4 flex items-center gap-2 border-b"
            style={{ borderColor: "#bbf7d0" }}
          >
            <MessageSquare size={18} style={{ color: "#16a34a" }} />
            <h2 className="font-semibold" style={{ color: "#14532d" }}>
              Message a Teacher
            </h2>
          </div>
          <form onSubmit={handleSend} className="p-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="parent_teacher_select"
                  className="block text-xs font-medium mb-1"
                  style={{ color: "#166534" }}
                >
                  Select Teacher
                </label>
                <select
                  id="parent_teacher_select"
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  style={{
                    border: "1px solid #86efac",
                    color: "#14532d",
                    background: "#f0fdf4",
                  }}
                  data-ocid="parent.teacher_select"
                >
                  {teachers.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="lg:col-span-2">
                <label
                  htmlFor="parent_message"
                  className="block text-xs font-medium mb-1"
                  style={{ color: "#166534" }}
                >
                  Your Message
                </label>
                <div className="flex gap-2">
                  <textarea
                    id="parent_message"
                    rows={2}
                    className="flex-1 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2"
                    style={{
                      border: "1px solid #86efac",
                      color: "#14532d",
                      background: "#f0fdf4",
                    }}
                    placeholder="Type your message to the teacher…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    data-ocid="parent.message_input"
                  />
                  <button
                    type="submit"
                    className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors hover:opacity-90 self-end"
                    style={{ background: "#14532d" }}
                    data-ocid="parent.send_message_button"
                  >
                    <Send size={14} /> Send
                  </button>
                </div>
              </div>
            </div>
            {sent && (
              <p
                className="mt-3 text-xs font-semibold"
                style={{ color: "#16a34a" }}
                data-ocid="parent.message_success_state"
              >
                ✓ Message sent successfully!
              </p>
            )}
          </form>
        </div>

        {/* Notices */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "#ffffff", border: "1px solid #bbf7d0" }}
          data-ocid="parent.notices_section"
        >
          <div
            className="px-5 py-4 flex items-center gap-2 border-b"
            style={{ borderColor: "#bbf7d0" }}
          >
            <Bell size={18} style={{ color: "#16a34a" }} />
            <h2 className="font-semibold" style={{ color: "#14532d" }}>
              Recent School Notices
            </h2>
            <span
              className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: "#dcfce7", color: "#14532d" }}
            >
              3 New
            </span>
          </div>
          <div className="divide-y" style={{ borderColor: "#dcfce7" }}>
            {notices.map((n, i) => (
              <div
                key={n.title}
                className="px-5 py-4 flex items-start gap-3"
                data-ocid={`parent.notice.item.${i + 1}`}
              >
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0 mt-0.5"
                  style={{
                    background:
                      n.tag === "Event"
                        ? "#dbeafe"
                        : n.tag === "Finance"
                          ? "#fee2e2"
                          : "#ede9fe",
                    color:
                      n.tag === "Event"
                        ? "#1e40af"
                        : n.tag === "Finance"
                          ? "#991b1b"
                          : "#5b21b6",
                  }}
                >
                  {n.tag}
                </span>
                <div className="flex-1">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#14532d" }}
                  >
                    {n.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#4ade80" }}>
                    {n.date} 2026
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ParentLayout>
  );
}
