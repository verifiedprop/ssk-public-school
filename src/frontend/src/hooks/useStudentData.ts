import { useState } from "react";

export interface AttendanceRecord {
  date: string;
  subject: string;
  status: "present" | "absent" | "late";
}

export interface MockTest {
  id: number;
  title: string;
  subject: string;
  duration: number;
  totalMarks: number;
  questions: Question[];
  attempted?: boolean;
  score?: number;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
}

export interface Result {
  id: number;
  subject: string;
  exam: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  date: string;
}

export interface Assignment {
  id: number;
  subject: string;
  title: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  grade?: string;
  description: string;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  date: string;
  category: "academic" | "exam" | "event" | "holiday" | "general";
  important: boolean;
}

const attendanceData: AttendanceRecord[] = [
  { date: "2026-05-01", subject: "Mathematics", status: "present" },
  { date: "2026-05-01", subject: "Science", status: "present" },
  { date: "2026-05-01", subject: "English", status: "present" },
  { date: "2026-05-02", subject: "Hindi", status: "present" },
  { date: "2026-05-02", subject: "Social Studies", status: "absent" },
  { date: "2026-05-05", subject: "Mathematics", status: "present" },
  { date: "2026-05-05", subject: "Science", status: "late" },
  { date: "2026-05-06", subject: "English", status: "present" },
  { date: "2026-05-06", subject: "Hindi", status: "present" },
  { date: "2026-05-07", subject: "Social Studies", status: "present" },
  { date: "2026-05-08", subject: "Mathematics", status: "absent" },
  { date: "2026-05-08", subject: "Science", status: "present" },
  { date: "2026-05-09", subject: "English", status: "present" },
  { date: "2026-05-12", subject: "Hindi", status: "present" },
  { date: "2026-05-12", subject: "Social Studies", status: "present" },
  { date: "2026-05-13", subject: "Mathematics", status: "present" },
  { date: "2026-05-14", subject: "Science", status: "present" },
  { date: "2026-05-15", subject: "English", status: "absent" },
  { date: "2026-05-16", subject: "Hindi", status: "present" },
  { date: "2026-05-19", subject: "Social Studies", status: "present" },
];

const mockTestsData: MockTest[] = [
  {
    id: 1,
    title: "Mathematics Chapter 5 — Quadratic Equations",
    subject: "Mathematics",
    duration: 30,
    totalMarks: 20,
    attempted: true,
    score: 17,
    questions: [
      {
        id: 1,
        text: "What is the discriminant of 2x² + 3x + 1 = 0?",
        options: ["1", "3", "17", "-1"],
        correct: 0,
      },
      {
        id: 2,
        text: "How many roots does a quadratic equation have?",
        options: ["1", "2", "3", "4"],
        correct: 1,
      },
      {
        id: 3,
        text: "If discriminant D > 0, roots are:",
        options: ["Complex", "Equal", "Real and distinct", "Zero"],
        correct: 2,
      },
      {
        id: 4,
        text: "The quadratic formula is:",
        options: [
          "-b ± √(b²-4ac) / 2a",
          "-b ± √(b²+4ac) / 2a",
          "b ± √(b²-4ac) / a",
          "-b / 2a",
        ],
        correct: 0,
      },
    ],
  },
  {
    id: 2,
    title: "Science — Chemical Reactions & Equations",
    subject: "Science",
    duration: 30,
    totalMarks: 20,
    attempted: false,
    questions: [
      {
        id: 1,
        text: "Which of the following is a chemical change?",
        options: [
          "Melting of ice",
          "Burning of wood",
          "Dissolving sugar",
          "Cutting paper",
        ],
        correct: 1,
      },
      {
        id: 2,
        text: "Rusting of iron is an example of:",
        options: [
          "Physical change",
          "Reversible reaction",
          "Oxidation reaction",
          "Combination reaction",
        ],
        correct: 2,
      },
      {
        id: 3,
        text: "The chemical formula of common salt is:",
        options: ["KCl", "NaOH", "NaCl", "CaCl₂"],
        correct: 2,
      },
      {
        id: 4,
        text: "Photosynthesis is an example of:",
        options: [
          "Decomposition",
          "Displacement",
          "Endothermic reaction",
          "Exothermic reaction",
        ],
        correct: 2,
      },
    ],
  },
  {
    id: 3,
    title: "English — Grammar & Comprehension",
    subject: "English",
    duration: 30,
    totalMarks: 20,
    attempted: false,
    questions: [
      {
        id: 1,
        text: "Identify the noun in: 'She writes beautiful poems.'",
        options: ["She", "writes", "beautiful", "poems"],
        correct: 3,
      },
      {
        id: 2,
        text: "Which is the correct passive voice of 'She sings a song'?",
        options: [
          "A song was sung by her",
          "A song is sung by her",
          "A song has been sung by her",
          "A song sang by her",
        ],
        correct: 1,
      },
      {
        id: 3,
        text: "'Ephemeral' means:",
        options: ["Eternal", "Short-lived", "Bright", "Strong"],
        correct: 1,
      },
      {
        id: 4,
        text: "Choose the correct synonym of 'Benevolent':",
        options: ["Cruel", "Generous", "Fearful", "Greedy"],
        correct: 1,
      },
    ],
  },
  {
    id: 4,
    title: "Social Studies — Democratic Politics",
    subject: "Social Studies",
    duration: 30,
    totalMarks: 20,
    attempted: false,
    questions: [
      {
        id: 1,
        text: "Who is the head of state in India?",
        options: ["Prime Minister", "Chief Justice", "President", "Speaker"],
        correct: 2,
      },
      {
        id: 2,
        text: "Fundamental Rights are enshrined in which part of the Constitution?",
        options: ["Part III", "Part II", "Part IV", "Part I"],
        correct: 0,
      },
      {
        id: 3,
        text: "How many articles does the Indian Constitution have?",
        options: ["395", "448", "444", "400"],
        correct: 1,
      },
      {
        id: 4,
        text: "Which Article abolishes untouchability?",
        options: ["Article 14", "Article 15", "Article 17", "Article 19"],
        correct: 2,
      },
    ],
  },
];

const resultsData: Result[] = [
  {
    id: 1,
    subject: "Mathematics",
    exam: "Unit Test 1",
    marksObtained: 47,
    totalMarks: 50,
    grade: "A+",
    date: "2026-02-14",
  },
  {
    id: 2,
    subject: "Science",
    exam: "Unit Test 1",
    marksObtained: 44,
    totalMarks: 50,
    grade: "A",
    date: "2026-02-15",
  },
  {
    id: 3,
    subject: "English",
    exam: "Unit Test 1",
    marksObtained: 46,
    totalMarks: 50,
    grade: "A+",
    date: "2026-02-16",
  },
  {
    id: 4,
    subject: "Hindi",
    exam: "Unit Test 1",
    marksObtained: 42,
    totalMarks: 50,
    grade: "A",
    date: "2026-02-17",
  },
  {
    id: 5,
    subject: "Social Studies",
    exam: "Unit Test 1",
    marksObtained: 45,
    totalMarks: 50,
    grade: "A+",
    date: "2026-02-18",
  },
  {
    id: 6,
    subject: "Mathematics",
    exam: "Half Yearly",
    marksObtained: 88,
    totalMarks: 100,
    grade: "A+",
    date: "2026-03-20",
  },
  {
    id: 7,
    subject: "Science",
    exam: "Half Yearly",
    marksObtained: 82,
    totalMarks: 100,
    grade: "A",
    date: "2026-03-21",
  },
  {
    id: 8,
    subject: "English",
    exam: "Half Yearly",
    marksObtained: 85,
    totalMarks: 100,
    grade: "A+",
    date: "2026-03-22",
  },
  {
    id: 9,
    subject: "Hindi",
    exam: "Half Yearly",
    marksObtained: 79,
    totalMarks: 100,
    grade: "B+",
    date: "2026-03-23",
  },
  {
    id: 10,
    subject: "Social Studies",
    exam: "Half Yearly",
    marksObtained: 90,
    totalMarks: 100,
    grade: "A+",
    date: "2026-03-24",
  },
];

const assignmentsData: Assignment[] = [
  {
    id: 1,
    subject: "Mathematics",
    title: "Quadratic Equations — Practice Set",
    dueDate: "2026-05-25",
    status: "pending",
    description:
      "Solve exercises 5.1 to 5.4 from NCERT. Show all steps clearly.",
  },
  {
    id: 2,
    subject: "Science",
    title: "Lab Report — Acid-Base Reactions",
    dueDate: "2026-05-22",
    status: "submitted",
    description:
      "Write a detailed lab report of the acid-base titration experiment conducted on May 12.",
  },
  {
    id: 3,
    subject: "English",
    title: "Essay — My Ambition in Life",
    dueDate: "2026-05-20",
    status: "graded",
    grade: "A",
    description:
      "Write a 500-word essay describing your career ambitions and how you plan to achieve them.",
  },
  {
    id: 4,
    subject: "Social Studies",
    title: "Map Work — Indian States and Capitals",
    dueDate: "2026-05-28",
    status: "pending",
    description:
      "Mark all 28 states and 8 Union Territories with their capitals on an outline map of India.",
  },
  {
    id: 5,
    subject: "Hindi",
    title: "निबंध — मेरे प्रिय नेता",
    dueDate: "2026-05-23",
    status: "submitted",
    description: "अपने प्रिय राष्ट्रीय नेता पर 400 शब्दों में निबंध लिखें।",
  },
];

const noticesData: Notice[] = [
  {
    id: 1,
    title: "Annual Sports Day — Registration Open",
    content:
      "All students of Classes 6–12 are invited to register for Annual Sports Day 2026. Events include athletics, team sports, and cultural performances. Registration deadline: May 30, 2026. Contact your class teacher to register.",
    date: "2026-05-18",
    category: "event",
    important: true,
  },
  {
    id: 2,
    title: "Pre-Board Examination Schedule Released",
    content:
      "Pre-Board examinations for Class 9 will commence from June 10, 2026. The detailed time-table has been uploaded on the school portal. Students are advised to download and prepare accordingly. Admit cards will be issued on June 5.",
    date: "2026-05-17",
    category: "exam",
    important: true,
  },
  {
    id: 3,
    title: "Summer Vacation Notice — School Closed",
    content:
      "School will remain closed for summer vacation from May 26 to June 8, 2026. Classes will resume on June 9, 2026. Students are encouraged to complete all pending assignments before resuming.",
    date: "2026-05-15",
    category: "holiday",
    important: false,
  },
  {
    id: 4,
    title: "Science Olympiad Selections — Class 9",
    content:
      "Inter-school Science Olympiad selections will be held on May 27, 2026 in the Physics Lab. Interested students from Class 9 must submit their names to Mr. Rajesh Kumar by May 24. Preparation material available in the library.",
    date: "2026-05-14",
    category: "academic",
    important: false,
  },
  {
    id: 5,
    title: "Parent-Teacher Meeting — Class 9",
    content:
      "Parent-Teacher Meeting for Class 9 is scheduled for May 24, 2026 from 9:00 AM to 12:00 PM. Parents are requested to bring the student's diary and previous report card. Attendance is compulsory.",
    date: "2026-05-12",
    category: "general",
    important: true,
  },
  {
    id: 6,
    title: "Library Book Return Reminder",
    content:
      "All students who have borrowed books from the school library are reminded to return them before May 23, 2026 to avoid a fine. New books for the 2026-27 session will be catalogued during the vacation.",
    date: "2026-05-10",
    category: "general",
    important: false,
  },
];

export function useStudentData() {
  const [attendance] = useState<AttendanceRecord[]>(attendanceData);
  const [mockTests] = useState<MockTest[]>(mockTestsData);
  const [results] = useState<Result[]>(resultsData);
  const [assignments] = useState<Assignment[]>(assignmentsData);
  const [notices] = useState<Notice[]>(noticesData);

  const attendanceStats = {
    total: attendance.length,
    present: attendance.filter((a) => a.status === "present").length,
    absent: attendance.filter((a) => a.status === "absent").length,
    late: attendance.filter((a) => a.status === "late").length,
    percentage: Math.round(
      ((attendance.filter((a) => a.status === "present").length +
        attendance.filter((a) => a.status === "late").length) /
        attendance.length) *
        100,
    ),
  };

  return {
    attendance,
    attendanceStats,
    mockTests,
    results,
    assignments,
    notices,
  };
}
