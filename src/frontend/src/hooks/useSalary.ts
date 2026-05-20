import { useState } from "react";

export type SalaryStatus = "Pending" | "Paid";

export interface TeacherRecord {
  id: string;
  name: string;
  designation: string;
  baseSalary: number;
  dateOfJoining: string;
  isActive: boolean;
  createdAt: number;
}

export interface TeacherInput {
  name: string;
  designation: string;
  baseSalary: number;
  dateOfJoining: string;
}

export interface SalaryRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  month: number;
  year: number;
  baseSalary: number;
  attendanceBonus: number;
  deductions: number;
  netSalary: number;
  status: SalaryStatus;
  paidDate?: string;
  bankDetails?: string;
  createdAt: number;
}

export interface SalaryInput {
  teacherId: string;
  month: number;
  year: number;
  attendancePercentage: number;
  bonusAmount: number;
  deductionAmount: number;
  bankDetails?: string;
}

const DEMO_TEACHERS: TeacherRecord[] = [
  {
    id: "t1",
    name: "Priya Sharma",
    designation: "Principal Teacher",
    baseSalary: 42000,
    dateOfJoining: "2019-06-01",
    isActive: true,
    createdAt: Date.now() - 5e8,
  },
  {
    id: "t2",
    name: "Rajesh Kumar",
    designation: "Science Teacher",
    baseSalary: 38000,
    dateOfJoining: "2020-07-15",
    isActive: true,
    createdAt: Date.now() - 4e8,
  },
  {
    id: "t3",
    name: "Anita Verma",
    designation: "Maths Teacher",
    baseSalary: 35000,
    dateOfJoining: "2021-03-10",
    isActive: true,
    createdAt: Date.now() - 3e8,
  },
  {
    id: "t4",
    name: "Suresh Gupta",
    designation: "English Teacher",
    baseSalary: 33000,
    dateOfJoining: "2021-08-20",
    isActive: true,
    createdAt: Date.now() - 2e8,
  },
  {
    id: "t5",
    name: "Meena Patel",
    designation: "Hindi Teacher",
    baseSalary: 30000,
    dateOfJoining: "2022-04-05",
    isActive: true,
    createdAt: Date.now() - 1e8,
  },
];

const DEMO_SALARY_RECORDS: SalaryRecord[] = [
  {
    id: "s1",
    teacherId: "t1",
    teacherName: "Priya Sharma",
    month: 3,
    year: 2025,
    baseSalary: 42000,
    attendanceBonus: 2100,
    deductions: 500,
    netSalary: 43600,
    status: "Paid",
    paidDate: "2025-03-31",
    bankDetails: "SBI ****1234",
    createdAt: Date.now() - 9e7,
  },
  {
    id: "s2",
    teacherId: "t2",
    teacherName: "Rajesh Kumar",
    month: 3,
    year: 2025,
    baseSalary: 38000,
    attendanceBonus: 1900,
    deductions: 400,
    netSalary: 39500,
    status: "Paid",
    paidDate: "2025-03-31",
    bankDetails: "HDFC ****5678",
    createdAt: Date.now() - 8.5e7,
  },
  {
    id: "s3",
    teacherId: "t3",
    teacherName: "Anita Verma",
    month: 3,
    year: 2025,
    baseSalary: 35000,
    attendanceBonus: 1750,
    deductions: 300,
    netSalary: 36450,
    status: "Paid",
    paidDate: "2025-03-31",
    bankDetails: "ICICI ****9012",
    createdAt: Date.now() - 8e7,
  },
  {
    id: "s4",
    teacherId: "t4",
    teacherName: "Suresh Gupta",
    month: 3,
    year: 2025,
    baseSalary: 33000,
    attendanceBonus: 0,
    deductions: 1650,
    netSalary: 31350,
    status: "Paid",
    paidDate: "2025-03-31",
    bankDetails: "Axis ****3456",
    createdAt: Date.now() - 7.5e7,
  },
  {
    id: "s5",
    teacherId: "t5",
    teacherName: "Meena Patel",
    month: 3,
    year: 2025,
    baseSalary: 30000,
    attendanceBonus: 1500,
    deductions: 0,
    netSalary: 31500,
    status: "Paid",
    paidDate: "2025-03-31",
    bankDetails: "PNB ****7890",
    createdAt: Date.now() - 7e7,
  },
  {
    id: "s6",
    teacherId: "t1",
    teacherName: "Priya Sharma",
    month: 4,
    year: 2025,
    baseSalary: 42000,
    attendanceBonus: 4200,
    deductions: 500,
    netSalary: 45700,
    status: "Paid",
    paidDate: "2025-04-30",
    bankDetails: "SBI ****1234",
    createdAt: Date.now() - 6e7,
  },
  {
    id: "s7",
    teacherId: "t2",
    teacherName: "Rajesh Kumar",
    month: 4,
    year: 2025,
    baseSalary: 38000,
    attendanceBonus: 3800,
    deductions: 400,
    netSalary: 41400,
    status: "Paid",
    paidDate: "2025-04-30",
    bankDetails: "HDFC ****5678",
    createdAt: Date.now() - 5.5e7,
  },
  {
    id: "s8",
    teacherId: "t3",
    teacherName: "Anita Verma",
    month: 5,
    year: 2025,
    baseSalary: 35000,
    attendanceBonus: 1750,
    deductions: 300,
    netSalary: 36450,
    status: "Pending",
    createdAt: Date.now() - 5e7,
  },
  {
    id: "s9",
    teacherId: "t4",
    teacherName: "Suresh Gupta",
    month: 5,
    year: 2025,
    baseSalary: 33000,
    attendanceBonus: 3300,
    deductions: 0,
    netSalary: 36300,
    status: "Pending",
    createdAt: Date.now() - 4e7,
  },
  {
    id: "s10",
    teacherId: "t5",
    teacherName: "Meena Patel",
    month: 5,
    year: 2025,
    baseSalary: 30000,
    attendanceBonus: 3000,
    deductions: 0,
    netSalary: 33000,
    status: "Pending",
    createdAt: Date.now() - 3e7,
  },
];

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function useSalary() {
  const [teachers, setTeachers] = useState<TeacherRecord[]>(DEMO_TEACHERS);
  const [salaryRecords, setSalaryRecords] =
    useState<SalaryRecord[]>(DEMO_SALARY_RECORDS);

  function addTeacher(input: TeacherInput): TeacherRecord {
    const record: TeacherRecord = {
      ...input,
      id: generateId(),
      isActive: true,
      createdAt: Date.now(),
    };
    setTeachers((prev) => [...prev, record]);
    return record;
  }

  function updateTeacher(id: string, input: Partial<TeacherInput>): void {
    setTeachers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...input } : t)),
    );
  }

  function deactivateTeacher(id: string): void {
    setTeachers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: false } : t)),
    );
  }

  function generateSalary(input: SalaryInput): SalaryRecord | null {
    const teacher = teachers.find((t) => t.id === input.teacherId);
    if (!teacher) return null;
    const netSalary =
      Math.round(teacher.baseSalary * (input.attendancePercentage / 100)) +
      input.bonusAmount -
      input.deductionAmount;
    const record: SalaryRecord = {
      id: generateId(),
      teacherId: teacher.id,
      teacherName: teacher.name,
      month: input.month,
      year: input.year,
      baseSalary: teacher.baseSalary,
      attendanceBonus: input.bonusAmount,
      deductions: input.deductionAmount,
      netSalary,
      status: "Pending",
      bankDetails: input.bankDetails,
      createdAt: Date.now(),
    };
    setSalaryRecords((prev) => [...prev, record]);
    return record;
  }

  function markPaid(id: string, paidDate?: string): void {
    setSalaryRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "Paid" as SalaryStatus,
              paidDate: paidDate ?? new Date().toISOString().slice(0, 10),
            }
          : r,
      ),
    );
  }

  function getTeacherById(id: string): TeacherRecord | undefined {
    return teachers.find((t) => t.id === id);
  }

  return {
    teachers,
    salaryRecords,
    addTeacher,
    updateTeacher,
    deactivateTeacher,
    generateSalary,
    markPaid,
    getTeacherById,
  };
}
