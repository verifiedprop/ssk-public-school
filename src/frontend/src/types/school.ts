// SSK Public School — shared TypeScript types

export type UserRole =
  | "super_admin"
  | "principal"
  | "accountant"
  | "teacher"
  | "parent"
  | "student"
  | "admission_counsellor";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  // Student-specific fields populated on login
  studentClass?: string;
  studentSection?: string;
  studentRoll?: string;
}

export type LeadStatus =
  | "new"
  | "contacted"
  | "follow_up"
  | "converted"
  | "rejected";

export interface LeadInput {
  parentName: string;
  studentName: string;
  phone: string;
  email: string;
  classApplied: string;
  message?: string;
  source: string;
}

export interface Lead extends LeadInput {
  id: string;
  status: LeadStatus;
  enquiryNumber: string;
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentInput {
  name: string;
  rollNumber: string;
  class: string;
  section: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  address: string;
  photoUrl?: string;
}

export interface Student extends StudentInput {
  id: string;
  admissionNumber: string;
  status: "active" | "inactive" | "transferred";
  joiningDate: string;
  feesPaid: boolean;
}

export interface DashboardStats {
  totalStudents: number;
  totalFeesCollected: number;
  pendingFees: number;
  newLeads: number;
  attendancePercentage: number;
  upcomingExams: number;
  teacherCount: number;
  pendingSalaries: number;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}
