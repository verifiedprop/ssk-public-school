import { useCallback, useState } from "react";

export type AttendanceStatus = "Present" | "Absent" | "Leave";
export type AttendeeType = "Student" | "Teacher";

export interface AttendanceRecord {
  id: string;
  attendeeId: string;
  attendeeName: string;
  attendeeType: AttendeeType;
  className: string;
  date: string;
  status: AttendanceStatus;
  markedBy: string;
  createdAt: string;
}

export interface AttendanceSummary {
  attendeeId: string;
  attendeeName: string;
  className: string;
  totalDays: number;
  present: number;
  absent: number;
  leave: number;
  percentage: number;
}

export interface AttendeeRow {
  id: string;
  name: string;
  className: string;
  rollNumber?: string;
  subject?: string;
}

// ── Demo data ────────────────────────────────────────────────
const DEMO_STUDENTS: AttendeeRow[] = [
  {
    id: "s1",
    name: "Aryan Sharma",
    className: "Class 10-A",
    rollNumber: "10A-001",
  },
  {
    id: "s2",
    name: "Priya Singh",
    className: "Class 10-A",
    rollNumber: "10A-002",
  },
  {
    id: "s3",
    name: "Rohan Gupta",
    className: "Class 10-A",
    rollNumber: "10A-003",
  },
  {
    id: "s4",
    name: "Sneha Patel",
    className: "Class 9-B",
    rollNumber: "9B-001",
  },
  {
    id: "s5",
    name: "Kavya Reddy",
    className: "Class 9-B",
    rollNumber: "9B-002",
  },
  {
    id: "s6",
    name: "Vikram Joshi",
    className: "Class 9-B",
    rollNumber: "9B-003",
  },
  {
    id: "s7",
    name: "Ananya Verma",
    className: "Class 12-A",
    rollNumber: "12A-001",
  },
  {
    id: "s8",
    name: "Rajan Mehta",
    className: "Class 12-A",
    rollNumber: "12A-002",
  },
  {
    id: "s9",
    name: "Pooja Nair",
    className: "Class 12-A",
    rollNumber: "12A-003",
  },
  {
    id: "s10",
    name: "Arjun Kumar",
    className: "Class 12-A",
    rollNumber: "12A-004",
  },
];

const DEMO_TEACHERS: AttendeeRow[] = [
  {
    id: "t1",
    name: "Mr. Suresh Yadav",
    className: "Staff",
    subject: "Mathematics",
  },
  {
    id: "t2",
    name: "Ms. Rekha Sharma",
    className: "Staff",
    subject: "Science",
  },
  { id: "t3", name: "Mr. Ajay Pandey", className: "Staff", subject: "English" },
  {
    id: "t4",
    name: "Ms. Sunita Chauhan",
    className: "Staff",
    subject: "Social Studies",
  },
];

function generateDemoRecords(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  const statuses: AttendanceStatus[] = [
    "Present",
    "Present",
    "Present",
    "Present",
    "Absent",
    "Leave",
  ];
  let idx = 0;
  for (let d = 13; d >= 0; d--) {
    const date = new Date(today);
    date.setDate(today.getDate() - d);
    const dateStr = date.toISOString().split("T")[0];
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue; // skip weekends
    for (const student of DEMO_STUDENTS) {
      records.push({
        id: `rec-${idx++}`,
        attendeeId: student.id,
        attendeeName: student.name,
        attendeeType: "Student",
        className: student.className,
        date: dateStr,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        markedBy: "Admin",
        createdAt: dateStr,
      });
    }
    for (const teacher of DEMO_TEACHERS) {
      records.push({
        id: `rec-${idx++}`,
        attendeeId: teacher.id,
        attendeeName: teacher.name,
        attendeeType: "Teacher",
        className: "Staff",
        date: dateStr,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        markedBy: "Principal",
        createdAt: dateStr,
      });
    }
  }
  return records;
}

const INITIAL_RECORDS = generateDemoRecords();

export const CLASSES = [
  "Class 6-A",
  "Class 6-B",
  "Class 7-A",
  "Class 7-B",
  "Class 8-A",
  "Class 8-B",
  "Class 9-A",
  "Class 9-B",
  "Class 10-A",
  "Class 10-B",
  "Class 11-A",
  "Class 11-B",
  "Class 12-A",
  "Class 12-B",
];

// ── Hook ─────────────────────────────────────────────────────
export function useAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>(INITIAL_RECORDS);

  const getAttendeesForType = useCallback(
    (type: AttendeeType, className?: string): AttendeeRow[] => {
      if (type === "Teacher") return DEMO_TEACHERS;
      if (className)
        return DEMO_STUDENTS.filter((s) => s.className === className);
      return DEMO_STUDENTS;
    },
    [],
  );

  const markAttendance = useCallback(
    (
      entries: { attendeeId: string; status: AttendanceStatus }[],
      date: string,
      type: AttendeeType,
      markedBy: string,
    ) => {
      const attendees = type === "Teacher" ? DEMO_TEACHERS : DEMO_STUDENTS;
      const newRecords = entries.map((e) => {
        const attendee = attendees.find((a) => a.id === e.attendeeId);
        return {
          id: `rec-${Date.now()}-${e.attendeeId}`,
          attendeeId: e.attendeeId,
          attendeeName: attendee?.name ?? e.attendeeId,
          attendeeType: type,
          className: attendee?.className ?? "Staff",
          date,
          status: e.status,
          markedBy,
          createdAt: new Date().toISOString(),
        } satisfies AttendanceRecord;
      });
      // replace existing records for same date+type
      setRecords((prev) => [
        ...prev.filter((r) => !(r.date === date && r.attendeeType === type)),
        ...newRecords,
      ]);
    },
    [],
  );

  const getExistingForDate = useCallback(
    (date: string, type: AttendeeType): Map<string, AttendanceStatus> => {
      const map = new Map<string, AttendanceStatus>();
      for (const r of records) {
        if (r.date === date && r.attendeeType === type) {
          map.set(r.attendeeId, r.status);
        }
      }
      return map;
    },
    [records],
  );

  const computeSummaries = useCallback(
    (className?: string): AttendanceSummary[] => {
      const students = className
        ? DEMO_STUDENTS.filter((s) => s.className === className)
        : DEMO_STUDENTS;
      return students.map((student) => {
        const studentRecords = records.filter(
          (r) => r.attendeeId === student.id && r.attendeeType === "Student",
        );
        const present = studentRecords.filter(
          (r) => r.status === "Present",
        ).length;
        const absent = studentRecords.filter(
          (r) => r.status === "Absent",
        ).length;
        const leave = studentRecords.filter((r) => r.status === "Leave").length;
        const totalDays = studentRecords.length;
        const percentage =
          totalDays > 0 ? Math.round((present / totalDays) * 100) : 0;
        return {
          attendeeId: student.id,
          attendeeName: student.name,
          className: student.className,
          totalDays,
          present,
          absent,
          leave,
          percentage,
        };
      });
    },
    [records],
  );

  return {
    records,
    markAttendance,
    getAttendeesForType,
    getExistingForDate,
    computeSummaries,
    demoStudents: DEMO_STUDENTS,
    demoTeachers: DEMO_TEACHERS,
  };
}
