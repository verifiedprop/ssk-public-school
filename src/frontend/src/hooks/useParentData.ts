import { useState } from "react";

export interface AttendanceRecord {
  date: string;
  day: string;
  status: "Present" | "Absent" | "Late" | "Holiday";
  subject?: string;
  remark?: string;
}

export interface FeeRecord {
  id: string;
  month: string;
  amount: number;
  paid: number;
  due: number;
  status: "Paid" | "Pending" | "Partial" | "Overdue";
  dueDate: string;
  paidDate?: string;
  receiptNo?: string;
  type: string;
}

export interface SubjectResult {
  subject: string;
  maxMarks: number;
  marksObtained: number;
  grade: string;
  remarks: string;
}

export interface ExamResult {
  id: string;
  examName: string;
  examDate: string;
  class: string;
  totalMarks: number;
  marksObtained: number;
  percentage: number;
  rank: number;
  totalStudents: number;
  subjects: SubjectResult[];
  result: "Pass" | "Fail";
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  category: "General" | "Exam" | "Holiday" | "Event" | "Fee" | "Urgent";
  isRead: boolean;
  postedBy: string;
}

export interface MessageReply {
  id: string;
  from: string;
  content: string;
  date: string;
  time: string;
}

export interface Message {
  id: string;
  from: string;
  fromRole: string;
  subject: string;
  content: string;
  date: string;
  time: string;
  isRead: boolean;
  isReplied: boolean;
  thread?: MessageReply[];
}

export interface StudentInfo {
  name: string;
  rollNo: string;
  class: string;
  section: string;
  admissionNo: string;
  dob: string;
  parentName: string;
  phone: string;
  address: string;
  photo: string;
  classTeacher: string;
  attendancePercent: number;
  totalFeesPaid: number;
  feesDue: number;
}

export function useParentData() {
  const studentInfo: StudentInfo = {
    name: "Rahul Sharma",
    rollNo: "10A-15",
    class: "10",
    section: "A",
    admissionNo: "SSK-2024-1015",
    dob: "12 March 2010",
    parentName: "Mr. Suresh Sharma",
    phone: "+91 98765 43210",
    address: "45, Sector 12, Noida, UP - 201301",
    photo: "",
    classTeacher: "Mrs. Priya Verma",
    attendancePercent: 87,
    totalFeesPaid: 42000,
    feesDue: 8500,
  };

  const [attendance] = useState<AttendanceRecord[]>([
    { date: "19 May 2026", day: "Tue", status: "Present" },
    { date: "18 May 2026", day: "Mon", status: "Present" },
    { date: "17 May 2026", day: "Sun", status: "Holiday" },
    { date: "16 May 2026", day: "Sat", status: "Holiday" },
    { date: "15 May 2026", day: "Fri", status: "Absent", remark: "Sick leave" },
    { date: "14 May 2026", day: "Thu", status: "Present" },
    { date: "13 May 2026", day: "Wed", status: "Present" },
    {
      date: "12 May 2026",
      day: "Tue",
      status: "Late",
      remark: "Arrived 15 min late",
    },
    { date: "11 May 2026", day: "Mon", status: "Present" },
    { date: "10 May 2026", day: "Sun", status: "Holiday" },
    { date: "09 May 2026", day: "Sat", status: "Holiday" },
    { date: "08 May 2026", day: "Fri", status: "Present" },
    { date: "07 May 2026", day: "Thu", status: "Present" },
    { date: "06 May 2026", day: "Wed", status: "Present" },
    {
      date: "05 May 2026",
      day: "Tue",
      status: "Absent",
      remark: "Family function",
    },
    { date: "04 May 2026", day: "Mon", status: "Present" },
    { date: "03 May 2026", day: "Sun", status: "Holiday" },
    { date: "02 May 2026", day: "Sat", status: "Holiday" },
    {
      date: "01 May 2026",
      day: "Fri",
      status: "Holiday",
      remark: "Labour Day",
    },
    { date: "30 Apr 2026", day: "Thu", status: "Present" },
  ]);

  const [fees] = useState<FeeRecord[]>([
    {
      id: "F001",
      month: "May 2026",
      type: "Tuition Fee",
      amount: 5000,
      paid: 5000,
      due: 0,
      status: "Paid",
      dueDate: "10 May 2026",
      paidDate: "07 May 2026",
      receiptNo: "RCP-2026-0412",
    },
    {
      id: "F002",
      month: "May 2026",
      type: "Transport Fee",
      amount: 1500,
      paid: 0,
      due: 1500,
      status: "Pending",
      dueDate: "15 May 2026",
    },
    {
      id: "F003",
      month: "Apr 2026",
      type: "Tuition Fee",
      amount: 5000,
      paid: 5000,
      due: 0,
      status: "Paid",
      dueDate: "10 Apr 2026",
      paidDate: "08 Apr 2026",
      receiptNo: "RCP-2026-0381",
    },
    {
      id: "F004",
      month: "Apr 2026",
      type: "Lab Fee",
      amount: 2000,
      paid: 2000,
      due: 0,
      status: "Paid",
      dueDate: "10 Apr 2026",
      paidDate: "08 Apr 2026",
      receiptNo: "RCP-2026-0382",
    },
    {
      id: "F005",
      month: "Mar 2026",
      type: "Tuition Fee",
      amount: 5000,
      paid: 3000,
      due: 2000,
      status: "Partial",
      dueDate: "10 Mar 2026",
      paidDate: "12 Mar 2026",
      receiptNo: "RCP-2026-0325",
    },
    {
      id: "F006",
      month: "Feb 2026",
      type: "Annual Charge",
      amount: 8500,
      paid: 0,
      due: 8500,
      status: "Overdue",
      dueDate: "15 Feb 2026",
    },
  ]);

  const [results] = useState<ExamResult[]>([
    {
      id: "R001",
      examName: "Mid-Term Examination",
      examDate: "March 2026",
      class: "10-A",
      totalMarks: 500,
      marksObtained: 423,
      percentage: 84.6,
      rank: 7,
      totalStudents: 45,
      result: "Pass",
      subjects: [
        {
          subject: "Mathematics",
          maxMarks: 100,
          marksObtained: 88,
          grade: "A",
          remarks: "Excellent",
        },
        {
          subject: "Science",
          maxMarks: 100,
          marksObtained: 82,
          grade: "A",
          remarks: "Very Good",
        },
        {
          subject: "English",
          maxMarks: 100,
          marksObtained: 79,
          grade: "B+",
          remarks: "Good",
        },
        {
          subject: "Social Science",
          maxMarks: 100,
          marksObtained: 91,
          grade: "A+",
          remarks: "Outstanding",
        },
        {
          subject: "Hindi",
          maxMarks: 100,
          marksObtained: 83,
          grade: "A",
          remarks: "Very Good",
        },
      ],
    },
    {
      id: "R002",
      examName: "Unit Test 2",
      examDate: "January 2026",
      class: "10-A",
      totalMarks: 250,
      marksObtained: 198,
      percentage: 79.2,
      rank: 12,
      totalStudents: 45,
      result: "Pass",
      subjects: [
        {
          subject: "Mathematics",
          maxMarks: 50,
          marksObtained: 42,
          grade: "A",
          remarks: "Very Good",
        },
        {
          subject: "Science",
          maxMarks: 50,
          marksObtained: 38,
          grade: "B+",
          remarks: "Good",
        },
        {
          subject: "English",
          maxMarks: 50,
          marksObtained: 35,
          grade: "B",
          remarks: "Good",
        },
        {
          subject: "Social Science",
          maxMarks: 50,
          marksObtained: 44,
          grade: "A",
          remarks: "Excellent",
        },
        {
          subject: "Hindi",
          maxMarks: 50,
          marksObtained: 39,
          grade: "B+",
          remarks: "Good",
        },
      ],
    },
  ]);

  const [notices, setNotices] = useState<Notice[]>([
    {
      id: "N001",
      title: "Annual Sports Day 2026 — Registration Open",
      content:
        "Dear Parents, we are pleased to announce that Annual Sports Day registrations are now open. Students interested in participating in athletic events, team sports, and cultural activities should register through the school office by May 25, 2026. All students of Class 6–12 are eligible.",
      date: "18 May 2026",
      category: "Event",
      isRead: false,
      postedBy: "Principal Mrs. Anita Singh",
    },
    {
      id: "N002",
      title: "Pre-Board Examination Schedule Released",
      content:
        "The Pre-Board examination schedule for Class 10 and Class 12 has been released. Examinations will commence from June 1, 2026. Students are advised to collect their admit cards from the office. Hall tickets will be issued only to students with cleared fee dues.",
      date: "15 May 2026",
      category: "Exam",
      isRead: false,
      postedBy: "Exam Controller Mr. Rajesh Kumar",
    },
    {
      id: "N003",
      title: "Summer Vacation Notice — May 25 to June 15",
      content:
        "School will remain closed from May 25, 2026 to June 15, 2026 for summer vacation. School will reopen on June 16, 2026. The online homework portal will remain active during the vacation period. Students should complete their holiday assignments.",
      date: "14 May 2026",
      category: "Holiday",
      isRead: true,
      postedBy: "School Administration",
    },
    {
      id: "N004",
      title: "Annual Fee Dues — Urgent Payment Required",
      content:
        "Parents of students with pending annual charges are requested to clear dues immediately. Students with dues exceeding 30 days may not be allowed to appear in upcoming examinations. Please visit the school accounts office or use the fee portal for payment.",
      date: "10 May 2026",
      category: "Urgent",
      isRead: true,
      postedBy: "Accounts Department",
    },
    {
      id: "N005",
      title: "Parent-Teacher Meeting — May 28, 2026",
      content:
        "The quarterly Parent-Teacher Meeting is scheduled for May 28, 2026 from 10:00 AM to 1:00 PM. All parents are requested to attend and meet their ward's class teacher and subject teachers. Please bring your ward's diary.",
      date: "08 May 2026",
      category: "General",
      isRead: true,
      postedBy: "Principal Mrs. Anita Singh",
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "M001",
      from: "Mrs. Priya Verma",
      fromRole: "Class Teacher",
      subject: "Rahul's performance in Mathematics",
      content:
        "Dear Mr. Sharma, I wanted to share that Rahul has shown remarkable improvement in Mathematics this month. His consistent effort and focus in class have been commendable. Please encourage him to continue practicing and consider joining the Mathematics Olympiad preparation group.",
      date: "17 May 2026",
      time: "11:30 AM",
      isRead: false,
      isReplied: false,
    },
    {
      id: "M002",
      from: "Mr. Anand Mishra",
      fromRole: "Science Teacher",
      subject: "Lab Safety Reminder",
      content:
        "Dear Parent, please remind Rahul to bring his lab coat and safety goggles for tomorrow's chemistry practical session. Lab work will begin at 10:00 AM. Students without safety equipment will not be allowed inside the lab.",
      date: "14 May 2026",
      time: "2:15 PM",
      isRead: true,
      isReplied: true,
      thread: [
        {
          id: "R001",
          from: "Mr. Suresh Sharma",
          content:
            "Thank you for the reminder. Rahul will bring his lab coat and goggles tomorrow.",
          date: "14 May 2026",
          time: "4:30 PM",
        },
      ],
    },
    {
      id: "M003",
      from: "School Administration",
      fromRole: "Admin",
      subject: "ID Card Renewal for 2026-27",
      content:
        "Dear Parents, ID cards for the academic year 2026-27 are ready for collection. Please visit the school office between 9:00 AM and 2:00 PM on weekdays with the previous year's ID card. New photographs will be taken on-site.",
      date: "10 May 2026",
      time: "9:00 AM",
      isRead: true,
      isReplied: false,
    },
  ]);

  const markNoticeRead = (id: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const markMessageRead = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)),
    );
  };

  const sendReply = (messageId: string, replyContent: string) => {
    const reply: MessageReply = {
      id: `R${Date.now()}`,
      from: "Mr. Suresh Sharma",
      content: replyContent,
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? { ...m, isReplied: true, thread: [...(m.thread ?? []), reply] }
          : m,
      ),
    );
  };

  const attendanceSummary = {
    total: attendance.filter((a) => a.status !== "Holiday").length,
    present: attendance.filter((a) => a.status === "Present").length,
    absent: attendance.filter((a) => a.status === "Absent").length,
    late: attendance.filter((a) => a.status === "Late").length,
    holidays: attendance.filter((a) => a.status === "Holiday").length,
  };

  const unreadNotices = notices.filter((n) => !n.isRead).length;
  const unreadMessages = messages.filter((m) => !m.isRead).length;

  return {
    studentInfo,
    attendance,
    attendanceSummary,
    fees,
    results,
    notices,
    messages,
    unreadNotices,
    unreadMessages,
    markNoticeRead,
    markMessageRead,
    sendReply,
  };
}
