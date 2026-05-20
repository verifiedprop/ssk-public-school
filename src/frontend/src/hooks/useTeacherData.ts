import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────

export interface AttendanceStudent {
  id: string;
  name: string;
  rollNumber: string;
  status: "present" | "absent" | "leave";
  scannedAt?: string;
}

export interface AttendanceSession {
  id: string;
  class: string;
  date: string;
  students: AttendanceStudent[];
}

export interface HomeworkAssignment {
  id: string;
  subject: string;
  class: string;
  title: string;
  description: string;
  dueDate: string;
  submittedCount: number;
  totalStudents: number;
  createdAt: string;
}

export interface MCQOption {
  id: string;
  text: string;
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: MCQOption[];
  correctOptionId: string;
}

export interface MockTest {
  id: string;
  title: string;
  class: string;
  subject: string;
  durationMinutes: number;
  passingPercent: number;
  status: "draft" | "published" | "closed";
  questions: MCQQuestion[];
  createdAt: string;
}

export interface MarksStudent {
  id: string;
  name: string;
  rollNumber: string;
  marks: Record<string, number | "">;
}

export interface MarksExam {
  id: string;
  title: string;
  class: string;
  subjects: string[];
  maxMarks: number;
  students: MarksStudent[];
}

export interface SalarySlip {
  id: string;
  month: string;
  year: number;
  basicPay: number;
  hra: number;
  da: number;
  medicalAllowance: number;
  travelAllowance: number;
  deductionPF: number;
  deductionTax: number;
  netPay: number;
  paidOn: string;
  status: "paid" | "pending";
}

export interface IDCardStudent {
  id: string;
  name: string;
  class: string;
  section: string;
  rollNumber: string;
  admissionNumber: string;
  dateOfBirth: string;
  bloodGroup: string;
  parentName: string;
  parentPhone: string;
}

// ── Demo Data ──────────────────────────────────────────────────────────────

const DEMO_CLASSES = [
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
];

const DEMO_SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "Hindi",
  "Social Studies",
];

const makeStudents = (classLabel: string): AttendanceStudent[] => [
  {
    id: `${classLabel}-1`,
    name: "Aarav Sharma",
    rollNumber: "01",
    status: "present",
  },
  {
    id: `${classLabel}-2`,
    name: "Priya Patel",
    rollNumber: "02",
    status: "present",
  },
  {
    id: `${classLabel}-3`,
    name: "Rohan Gupta",
    rollNumber: "03",
    status: "absent",
  },
  {
    id: `${classLabel}-4`,
    name: "Ananya Singh",
    rollNumber: "04",
    status: "present",
  },
  {
    id: `${classLabel}-5`,
    name: "Karan Mehta",
    rollNumber: "05",
    status: "leave",
  },
  {
    id: `${classLabel}-6`,
    name: "Pooja Jain",
    rollNumber: "06",
    status: "present",
  },
  {
    id: `${classLabel}-7`,
    name: "Vikram Yadav",
    rollNumber: "07",
    status: "present",
  },
  {
    id: `${classLabel}-8`,
    name: "Sneha Agarwal",
    rollNumber: "08",
    status: "absent",
  },
  {
    id: `${classLabel}-9`,
    name: "Arjun Kumar",
    rollNumber: "09",
    status: "present",
  },
  {
    id: `${classLabel}-10`,
    name: "Deepika Rawat",
    rollNumber: "10",
    status: "present",
  },
];

const DEMO_HOMEWORK: HomeworkAssignment[] = [
  {
    id: "hw1",
    subject: "Mathematics",
    class: "Class 9",
    title: "Quadratic Equations Practice Set",
    description:
      "Solve all problems from Ex. 4.3 and Ex. 4.4 in the NCERT textbook.",
    dueDate: "2026-05-22",
    submittedCount: 18,
    totalStudents: 42,
    createdAt: "2026-05-19",
  },
  {
    id: "hw2",
    subject: "Science",
    class: "Class 8",
    title: "Friction & Motion Worksheet",
    description:
      "Complete the worksheet on friction types and draw diagrams for each.",
    dueDate: "2026-05-21",
    submittedCount: 30,
    totalStudents: 38,
    createdAt: "2026-05-18",
  },
  {
    id: "hw3",
    subject: "English",
    class: "Class 10",
    title: "Essay: My Favourite Season",
    description:
      "Write a 300-word essay. Use descriptive language and proper paragraphs.",
    dueDate: "2026-05-23",
    submittedCount: 10,
    totalStudents: 44,
    createdAt: "2026-05-17",
  },
  {
    id: "hw4",
    subject: "Hindi",
    class: "Class 7",
    title: "कारक एवं विभक्ति अभ्यास",
    description: "पाठ्यपुस्तक के अभ्यास 5 के सभी प्रश्न हल करें।",
    dueDate: "2026-05-20",
    submittedCount: 35,
    totalStudents: 40,
    createdAt: "2026-05-16",
  },
];

const DEMO_TESTS: MockTest[] = [
  {
    id: "t1",
    title: "Chapter 5 — Quadratic Equations",
    class: "Class 9",
    subject: "Mathematics",
    durationMinutes: 30,
    passingPercent: 40,
    status: "published",
    createdAt: "2026-05-15",
    questions: [
      {
        id: "q1",
        question: "Which of the following is a quadratic equation?",
        correctOptionId: "a",
        options: [
          { id: "a", text: "x² + 3x + 2 = 0" },
          { id: "b", text: "x + 5 = 0" },
          { id: "c", text: "1/x = 2" },
          { id: "d", text: "x³ = 8" },
        ],
      },
      {
        id: "q2",
        question: "The discriminant of ax² + bx + c = 0 is:",
        correctOptionId: "b",
        options: [
          { id: "a", text: "b² + 4ac" },
          { id: "b", text: "b² - 4ac" },
          { id: "c", text: "4ac - b²" },
          { id: "d", text: "2b - 4ac" },
        ],
      },
    ],
  },
  {
    id: "t2",
    title: "Forces & Motion — Unit Test",
    class: "Class 8",
    subject: "Science",
    durationMinutes: 45,
    passingPercent: 35,
    status: "draft",
    createdAt: "2026-05-18",
    questions: [
      {
        id: "q3",
        question: "Newton's first law is also called the law of:",
        correctOptionId: "c",
        options: [
          { id: "a", text: "Gravitation" },
          { id: "b", text: "Acceleration" },
          { id: "c", text: "Inertia" },
          { id: "d", text: "Action-Reaction" },
        ],
      },
    ],
  },
  {
    id: "t3",
    title: "Annual Literature Review",
    class: "Class 10",
    subject: "English",
    durationMinutes: 60,
    passingPercent: 45,
    status: "closed",
    createdAt: "2026-05-10",
    questions: [],
  },
];

const DEMO_EXAMS: MarksExam[] = [
  {
    id: "e1",
    title: "Half-Yearly Examination 2026",
    class: "Class 9",
    subjects: ["Mathematics", "Science", "English"],
    maxMarks: 100,
    students: [
      {
        id: "s1",
        name: "Aarav Sharma",
        rollNumber: "01",
        marks: { Mathematics: 78, Science: 82, English: 71 },
      },
      {
        id: "s2",
        name: "Priya Patel",
        rollNumber: "02",
        marks: { Mathematics: 91, Science: 88, English: 94 },
      },
      {
        id: "s3",
        name: "Rohan Gupta",
        rollNumber: "03",
        marks: { Mathematics: 55, Science: 61, English: 67 },
      },
      {
        id: "s4",
        name: "Ananya Singh",
        rollNumber: "04",
        marks: { Mathematics: 84, Science: 79, English: 88 },
      },
      {
        id: "s5",
        name: "Karan Mehta",
        rollNumber: "05",
        marks: { Mathematics: 62, Science: 70, English: 65 },
      },
      {
        id: "s6",
        name: "Pooja Jain",
        rollNumber: "06",
        marks: { Mathematics: 95, Science: 92, English: 97 },
      },
    ],
  },
  {
    id: "e2",
    title: "Unit Test — May 2026",
    class: "Class 8",
    subjects: ["Science", "Mathematics"],
    maxMarks: 50,
    students: [
      {
        id: "s7",
        name: "Vikram Yadav",
        rollNumber: "01",
        marks: { Science: 38, Mathematics: 42 },
      },
      {
        id: "s8",
        name: "Sneha Agarwal",
        rollNumber: "02",
        marks: { Science: 45, Mathematics: 48 },
      },
      {
        id: "s9",
        name: "Arjun Kumar",
        rollNumber: "03",
        marks: { Science: 30, Mathematics: 35 },
      },
      {
        id: "s10",
        name: "Deepika Rawat",
        rollNumber: "04",
        marks: { Science: 47, Mathematics: 49 },
      },
    ],
  },
];

const DEMO_SALARY_SLIPS: SalarySlip[] = [
  {
    id: "ss1",
    month: "April",
    year: 2026,
    basicPay: 45000,
    hra: 13500,
    da: 6750,
    medicalAllowance: 1250,
    travelAllowance: 1500,
    deductionPF: 5400,
    deductionTax: 2100,
    netPay: 60500,
    paidOn: "2026-04-30",
    status: "paid",
  },
  {
    id: "ss2",
    month: "March",
    year: 2026,
    basicPay: 45000,
    hra: 13500,
    da: 6750,
    medicalAllowance: 1250,
    travelAllowance: 1500,
    deductionPF: 5400,
    deductionTax: 2100,
    netPay: 60500,
    paidOn: "2026-03-31",
    status: "paid",
  },
  {
    id: "ss3",
    month: "February",
    year: 2026,
    basicPay: 45000,
    hra: 13500,
    da: 6750,
    medicalAllowance: 1250,
    travelAllowance: 1500,
    deductionPF: 5400,
    deductionTax: 2100,
    netPay: 60500,
    paidOn: "2026-02-29",
    status: "paid",
  },
  {
    id: "ss4",
    month: "January",
    year: 2026,
    basicPay: 45000,
    hra: 13500,
    da: 6750,
    medicalAllowance: 1250,
    travelAllowance: 1500,
    deductionPF: 5400,
    deductionTax: 2100,
    netPay: 60500,
    paidOn: "2026-01-31",
    status: "paid",
  },
  {
    id: "ss5",
    month: "May",
    year: 2026,
    basicPay: 45000,
    hra: 13500,
    da: 6750,
    medicalAllowance: 1250,
    travelAllowance: 1500,
    deductionPF: 5400,
    deductionTax: 2100,
    netPay: 60500,
    paidOn: "",
    status: "pending",
  },
];

const DEMO_ID_STUDENTS: IDCardStudent[] = [
  {
    id: "is1",
    name: "Aarav Sharma",
    class: "9",
    section: "C",
    rollNumber: "09C-01",
    admissionNumber: "SSK-2023-0142",
    dateOfBirth: "15 Aug 2010",
    bloodGroup: "B+",
    parentName: "Ramesh Sharma",
    parentPhone: "9812345678",
  },
  {
    id: "is2",
    name: "Priya Patel",
    class: "9",
    section: "C",
    rollNumber: "09C-02",
    admissionNumber: "SSK-2023-0143",
    dateOfBirth: "22 Jan 2011",
    bloodGroup: "O+",
    parentName: "Suresh Patel",
    parentPhone: "9823456789",
  },
  {
    id: "is3",
    name: "Rohan Gupta",
    class: "9",
    section: "C",
    rollNumber: "09C-03",
    admissionNumber: "SSK-2023-0144",
    dateOfBirth: "07 Mar 2010",
    bloodGroup: "A+",
    parentName: "Dinesh Gupta",
    parentPhone: "9834567890",
  },
  {
    id: "is4",
    name: "Ananya Singh",
    class: "9",
    section: "C",
    rollNumber: "09C-04",
    admissionNumber: "SSK-2023-0145",
    dateOfBirth: "30 Nov 2010",
    bloodGroup: "AB+",
    parentName: "Ranjit Singh",
    parentPhone: "9845678901",
  },
  {
    id: "is5",
    name: "Vikram Yadav",
    class: "8",
    section: "A",
    rollNumber: "08A-01",
    admissionNumber: "SSK-2024-0201",
    dateOfBirth: "12 Jun 2011",
    bloodGroup: "O-",
    parentName: "Mahesh Yadav",
    parentPhone: "9856789012",
  },
  {
    id: "is6",
    name: "Sneha Agarwal",
    class: "8",
    section: "A",
    rollNumber: "08A-02",
    admissionNumber: "SSK-2024-0202",
    dateOfBirth: "05 Sep 2011",
    bloodGroup: "B-",
    parentName: "Praveen Agarwal",
    parentPhone: "9867890123",
  },
  {
    id: "is7",
    name: "Deepika Rawat",
    class: "10",
    section: "A",
    rollNumber: "10A-01",
    admissionNumber: "SSK-2022-0089",
    dateOfBirth: "19 Apr 2009",
    bloodGroup: "A-",
    parentName: "Gajendra Rawat",
    parentPhone: "9878901234",
  },
];

// ── Hook ───────────────────────────────────────────────────────────────────

export function useTeacherData() {
  const [attendanceSessions, setAttendanceSessions] = useState<
    AttendanceSession[]
  >(
    DEMO_CLASSES.map((cls, i) => ({
      id: `as${i + 1}`,
      class: cls,
      date: new Date().toISOString().split("T")[0],
      students: makeStudents(cls),
    })),
  );

  const [homework, setHomework] = useState<HomeworkAssignment[]>(DEMO_HOMEWORK);
  const [tests, setTests] = useState<MockTest[]>(DEMO_TESTS);
  const [exams, setExams] = useState<MarksExam[]>(DEMO_EXAMS);
  const [salarySlips] = useState<SalarySlip[]>(DEMO_SALARY_SLIPS);
  const [idStudents] = useState<IDCardStudent[]>(DEMO_ID_STUDENTS);

  const availableClasses = DEMO_CLASSES;
  const availableSubjects = DEMO_SUBJECTS;

  const updateAttendance = (
    sessionId: string,
    studentId: string,
    status: AttendanceStudent["status"],
  ) => {
    setAttendanceSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              students: s.students.map((st) =>
                st.id === studentId ? { ...st, status } : st,
              ),
            }
          : s,
      ),
    );
  };

  const markScanned = (sessionId: string, studentId: string) => {
    setAttendanceSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              students: s.students.map((st) =>
                st.id === studentId
                  ? {
                      ...st,
                      status: "present",
                      scannedAt: new Date().toLocaleTimeString(),
                    }
                  : st,
              ),
            }
          : s,
      ),
    );
  };

  const addHomework = (
    hw: Omit<HomeworkAssignment, "id" | "submittedCount" | "createdAt">,
  ) => {
    setHomework((prev) => [
      {
        ...hw,
        id: `hw${Date.now()}`,
        submittedCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      },
      ...prev,
    ]);
  };

  const addTest = (test: Omit<MockTest, "id" | "createdAt">) => {
    setTests((prev) => [
      {
        ...test,
        id: `t${Date.now()}`,
        createdAt: new Date().toISOString().split("T")[0],
      },
      ...prev,
    ]);
  };

  const updateTestStatus = (testId: string, status: MockTest["status"]) => {
    setTests((prev) =>
      prev.map((t) => (t.id === testId ? { ...t, status } : t)),
    );
  };

  const updateMark = (
    examId: string,
    studentId: string,
    subject: string,
    value: number | "",
  ) => {
    setExams((prev) =>
      prev.map((e) =>
        e.id === examId
          ? {
              ...e,
              students: e.students.map((s) =>
                s.id === studentId
                  ? { ...s, marks: { ...s.marks, [subject]: value } }
                  : s,
              ),
            }
          : e,
      ),
    );
  };

  return {
    attendanceSessions,
    updateAttendance,
    markScanned,
    homework,
    addHomework,
    tests,
    addTest,
    updateTestStatus,
    exams,
    updateMark,
    salarySlips,
    idStudents,
    availableClasses,
    availableSubjects,
  };
}
