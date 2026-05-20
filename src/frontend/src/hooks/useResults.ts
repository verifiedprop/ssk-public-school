import { useState } from "react";

export type Grade =
  | "APlusPlus"
  | "APlus"
  | "A"
  | "BPlus"
  | "B"
  | "CPlus"
  | "C"
  | "D"
  | "F";

export interface SubjectMark {
  subject: string;
  marksObtained: number;
  totalMarks: number;
}

export interface ExamResult {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  examName: string;
  subjects: SubjectMark[];
  totalObtained: number;
  totalMaximum: number;
  percentage: number;
  grade: Grade;
  createdAt: number;
}

export interface ExamResultInput {
  studentId: string;
  studentName: string;
  className: string;
  examName: string;
  subjects: SubjectMark[];
}

function calcGrade(percentage: number): Grade {
  if (percentage >= 95) return "APlusPlus";
  if (percentage >= 90) return "APlus";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "BPlus";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "CPlus";
  if (percentage >= 40) return "C";
  if (percentage >= 33) return "D";
  return "F";
}

function buildResult(id: string, input: ExamResultInput): ExamResult {
  const totalObtained = input.subjects.reduce((s, m) => s + m.marksObtained, 0);
  const totalMaximum = input.subjects.reduce((s, m) => s + m.totalMarks, 0);
  const percentage =
    totalMaximum > 0
      ? Math.round((totalObtained / totalMaximum) * 100 * 100) / 100
      : 0;
  return {
    id,
    ...input,
    totalObtained,
    totalMaximum,
    percentage,
    grade: calcGrade(percentage),
    createdAt: Date.now(),
  };
}

const DEFAULT_SUBJECTS_9B = [
  "Maths",
  "Science",
  "English",
  "Hindi",
  "Social Studies",
];
const DEFAULT_SUBJECTS_10A = [
  "Maths",
  "Science",
  "English",
  "Hindi",
  "Social Studies",
];

function makeSubjects(
  subjects: string[],
  obtained: number[],
  total = 100,
): SubjectMark[] {
  return subjects.map((subject, i) => ({
    subject,
    marksObtained: obtained[i],
    totalMarks: total,
  }));
}

const INITIAL_RESULTS: ExamResult[] = [
  // Class 9-B — Unit Test 1
  buildResult("r1", {
    studentId: "s1",
    studentName: "Aarav Mehta",
    className: "Class 9-B",
    examName: "Unit Test 1",
    subjects: makeSubjects(DEFAULT_SUBJECTS_9B, [92, 88, 95, 85, 90], 100),
  }),
  buildResult("r2", {
    studentId: "s2",
    studentName: "Priya Singh",
    className: "Class 9-B",
    examName: "Unit Test 1",
    subjects: makeSubjects(DEFAULT_SUBJECTS_9B, [78, 82, 88, 75, 80], 100),
  }),
  buildResult("r3", {
    studentId: "s3",
    studentName: "Rohan Gupta",
    className: "Class 9-B",
    examName: "Unit Test 1",
    subjects: makeSubjects(DEFAULT_SUBJECTS_9B, [65, 70, 72, 68, 74], 100),
  }),
  buildResult("r4", {
    studentId: "s4",
    studentName: "Sneha Patel",
    className: "Class 9-B",
    examName: "Unit Test 1",
    subjects: makeSubjects(DEFAULT_SUBJECTS_9B, [55, 60, 58, 62, 57], 100),
  }),
  // Class 9-B — Mid Term
  buildResult("r5", {
    studentId: "s1",
    studentName: "Aarav Mehta",
    className: "Class 9-B",
    examName: "Mid Term",
    subjects: makeSubjects(DEFAULT_SUBJECTS_9B, [96, 93, 97, 89, 94], 100),
  }),
  buildResult("r6", {
    studentId: "s2",
    studentName: "Priya Singh",
    className: "Class 9-B",
    examName: "Mid Term",
    subjects: makeSubjects(DEFAULT_SUBJECTS_9B, [80, 85, 90, 78, 83], 100),
  }),
  buildResult("r7", {
    studentId: "s3",
    studentName: "Rohan Gupta",
    className: "Class 9-B",
    examName: "Mid Term",
    subjects: makeSubjects(DEFAULT_SUBJECTS_9B, [68, 72, 74, 70, 76], 100),
  }),
  buildResult("r8", {
    studentId: "s4",
    studentName: "Sneha Patel",
    className: "Class 9-B",
    examName: "Mid Term",
    subjects: makeSubjects(DEFAULT_SUBJECTS_9B, [58, 62, 60, 64, 59], 100),
  }),
  // Class 10-A — Unit Test 1
  buildResult("r9", {
    studentId: "s5",
    studentName: "Aryan Sharma",
    className: "Class 10-A",
    examName: "Unit Test 1",
    subjects: makeSubjects(DEFAULT_SUBJECTS_10A, [97, 95, 98, 92, 96], 100),
  }),
  buildResult("r10", {
    studentId: "s6",
    studentName: "Kavya Reddy",
    className: "Class 10-A",
    examName: "Unit Test 1",
    subjects: makeSubjects(DEFAULT_SUBJECTS_10A, [88, 84, 90, 82, 86], 100),
  }),
  buildResult("r11", {
    studentId: "s7",
    studentName: "Vikram Joshi",
    className: "Class 10-A",
    examName: "Unit Test 1",
    subjects: makeSubjects(DEFAULT_SUBJECTS_10A, [73, 76, 78, 71, 75], 100),
  }),
  buildResult("r12", {
    studentId: "s8",
    studentName: "Nisha Verma",
    className: "Class 10-A",
    examName: "Unit Test 1",
    subjects: makeSubjects(DEFAULT_SUBJECTS_10A, [45, 50, 48, 52, 47], 100),
  }),
  // Class 10-A — Mid Term
  buildResult("r13", {
    studentId: "s5",
    studentName: "Aryan Sharma",
    className: "Class 10-A",
    examName: "Mid Term",
    subjects: makeSubjects(DEFAULT_SUBJECTS_10A, [98, 96, 99, 94, 97], 100),
  }),
  buildResult("r14", {
    studentId: "s6",
    studentName: "Kavya Reddy",
    className: "Class 10-A",
    examName: "Mid Term",
    subjects: makeSubjects(DEFAULT_SUBJECTS_10A, [90, 87, 92, 85, 88], 100),
  }),
  buildResult("r15", {
    studentId: "s7",
    studentName: "Vikram Joshi",
    className: "Class 10-A",
    examName: "Mid Term",
    subjects: makeSubjects(DEFAULT_SUBJECTS_10A, [76, 79, 80, 74, 78], 100),
  }),
  buildResult("r16", {
    studentId: "s8",
    studentName: "Nisha Verma",
    className: "Class 10-A",
    examName: "Mid Term",
    subjects: makeSubjects(DEFAULT_SUBJECTS_10A, [48, 53, 50, 55, 49], 100),
  }),
];

let _results = [...INITIAL_RESULTS];
let _listeners: Array<() => void> = [];

function notify() {
  for (const fn of _listeners) fn();
}

export function addResult(input: ExamResultInput): ExamResult {
  const id = `r${Date.now()}`;
  const result = buildResult(id, input);
  _results = [..._results, result];
  notify();
  return result;
}

export function updateResult(id: string, input: ExamResultInput): void {
  _results = _results.map((r) =>
    r.id === id
      ? buildResult(id, { ...input, createdAt: r.createdAt } as ExamResultInput)
      : r,
  );
  notify();
}

export function deleteResult(id: string): void {
  _results = _results.filter((r) => r.id !== id);
  notify();
}

export function getToppers(examName: string, className: string): ExamResult[] {
  return _results
    .filter(
      (r) =>
        r.examName === examName &&
        (className === "All" || r.className === className),
    )
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);
}

export function getGradeDistribution(
  examName: string,
  className: string,
): Record<Grade, number> {
  const dist: Record<Grade, number> = {
    APlusPlus: 0,
    APlus: 0,
    A: 0,
    BPlus: 0,
    B: 0,
    CPlus: 0,
    C: 0,
    D: 0,
    F: 0,
  };
  const filtered = _results.filter(
    (r) =>
      r.examName === examName &&
      (className === "All" || r.className === className),
  );
  for (const r of filtered) dist[r.grade]++;
  return dist;
}

export function useResults() {
  const [results, setResults] = useState<ExamResult[]>(_results);

  // Register listener on mount
  useState(() => {
    const sync = () => setResults([..._results]);
    _listeners.push(sync);
    return () => {
      _listeners = _listeners.filter((fn) => fn !== sync);
    };
  });

  return results;
}
