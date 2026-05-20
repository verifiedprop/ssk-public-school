import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MonthlyReport {
    month: string;
    year: bigint;
    totalIncome: bigint;
    totalExpenses: bigint;
    profit: bigint;
}
export type Timestamp = bigint;
export type LeadId = bigint;
export interface LeadExportRow {
    id: LeadId;
    status: string;
    assignedCounsellor: string;
    name: string;
    createdAt: Timestamp;
    classInterested: string;
    email: string;
    updatedAt: Timestamp;
    message: string;
    notes: string;
    phone: string;
}
export interface StudentInput {
    parentEmail: string;
    dateOfBirth: string;
    admissionDate: Timestamp;
    name: string;
    parentPhone: string;
    section: string;
    photoUrl: string;
    isActive: boolean;
    rollNumber: string;
    address: string;
    className: string;
    parentName: string;
}
export interface ExamResultInput {
    studentId: string;
    studentName: string;
    subjects: Array<SubjectMark>;
    examName: string;
    className: string;
}
export interface LeadInput {
    status: LeadStatus;
    assignedCounsellor?: Principal;
    name: string;
    classInterested: string;
    email: string;
    message: string;
    notes: string;
    phone: string;
}
export interface SubjectMark {
    totalMarks: bigint;
    subject: string;
    marksObtained: bigint;
}
export interface FeePayment {
    id: string;
    status: FeeStatus;
    netAmount: bigint;
    studentId: string;
    studentName: string;
    fine: bigint;
    createdAt: Timestamp;
    installmentNo?: bigint;
    paidDate?: string;
    discount: bigint;
    receiptNo: string;
    amount: bigint;
    className: string;
    totalInstallments?: bigint;
}
export interface TestAttempt {
    id: string;
    studentId: string;
    studentName: string;
    marksObtained: number;
    answers: Array<[string, string]>;
    submittedAt: Timestamp;
    timeTaken: bigint;
    testId: string;
    className: string;
    percentage: number;
    passed: boolean;
}
export interface Transaction {
    id: string;
    date: string;
    createdAt: Timestamp;
    reference?: string;
    description: string;
    txType: TransactionType;
    incomeCategory?: IncomeCategory;
    amount: bigint;
    expenseCategory?: ExpenseCategory;
}
export interface Lead {
    id: LeadId;
    status: LeadStatus;
    assignedCounsellor?: Principal;
    name: string;
    createdAt: Timestamp;
    classInterested: string;
    email: string;
    updatedAt: Timestamp;
    message: string;
    notes: string;
    phone: string;
}
export interface ExamResult {
    id: string;
    studentId: string;
    studentName: string;
    subjects: Array<SubjectMark>;
    createdAt: Timestamp;
    totalObtained: bigint;
    totalMaximum: bigint;
    grade: Grade;
    examName: string;
    className: string;
    percentage: number;
}
export interface AttendanceRecord {
    id: string;
    status: AttendanceStatus;
    attendeeName: string;
    attendeeType: AttendeeType;
    date: string;
    createdAt: Timestamp;
    markedBy: string;
    attendeeId: string;
    className?: string;
}
export interface SalaryInput {
    month: string;
    bonusAmount: bigint;
    bankDetails?: string;
    year: bigint;
    deductionAmount: bigint;
    teacherId: string;
    attendancePercentage: number;
}
export interface TransactionInput {
    date: string;
    reference?: string;
    description: string;
    txType: TransactionType;
    incomeCategory?: IncomeCategory;
    amount: bigint;
    expenseCategory?: ExpenseCategory;
}
export interface Student {
    id: StudentId;
    parentEmail: string;
    dateOfBirth: string;
    admissionDate: Timestamp;
    name: string;
    createdAt: Timestamp;
    parentPhone: string;
    section: string;
    photoUrl: string;
    isActive: boolean;
    updatedAt: Timestamp;
    rollNumber: string;
    address: string;
    className: string;
    parentName: string;
}
export interface TeacherInput {
    name: string;
    designation: string;
    dateOfJoining: string;
    baseSalary: bigint;
}
export interface SalaryRecord {
    id: string;
    status: SalaryStatus;
    month: string;
    bankDetails?: string;
    createdAt: Timestamp;
    year: bigint;
    deductions: bigint;
    netSalary: bigint;
    teacherName: string;
    paidDate?: string;
    teacherId: string;
    attendanceBonus: bigint;
    baseSalary: bigint;
}
export interface QRSession {
    token: string;
    active: boolean;
    expiresAt: bigint;
    date: string;
    classId: string;
}
export interface StudentCard {
    studentId: string;
    dateOfBirth: string;
    name: string;
    admissionYear: string;
    parentPhone: string;
    section: string;
    photoUrl: string;
    academicYear: string;
    schoolAddress: string;
    rollNumber: string;
    className: string;
    parentName: string;
    schoolName: string;
}
export interface MockTest {
    id: string;
    status: TestStatus;
    totalMarks: bigint;
    title: string;
    subject: string;
    createdAt: Timestamp;
    durationMinutes: bigint;
    negativeMarkingEnabled: boolean;
    questionIds: Array<string>;
    passingPercentage: number;
    className: string;
}
export interface AttendanceSummary {
    attendeeName: string;
    present: bigint;
    totalDays: bigint;
    leave: bigint;
    absent: bigint;
    attendeeId: string;
    className?: string;
    percentage: number;
}
export type StudentId = bigint;
export interface TeacherRecord {
    id: string;
    name: string;
    designation: string;
    createdAt: Timestamp;
    isActive: boolean;
    dateOfJoining: string;
    baseSalary: bigint;
}
export interface QuestionOption {
    id: string;
    text: string;
}
export interface DashboardStats {
    rejectedLeads: bigint;
    activeStudents: bigint;
    convertedLeads: bigint;
    totalStudents: bigint;
    followUpLeads: bigint;
    totalLeads: bigint;
    newLeads: bigint;
    newLeadsToday: bigint;
    contactedLeads: bigint;
}
export interface MockTestInput {
    totalMarks: bigint;
    title: string;
    subject: string;
    durationMinutes: bigint;
    negativeMarkingEnabled: boolean;
    passingPercentage: number;
    className: string;
}
export interface TestAttemptInput {
    answers: Array<[string, string]>;
    timeTaken: bigint;
    testId: string;
}
export interface AttendanceInput {
    status: AttendanceStatus;
    attendeeName: string;
    attendeeType: AttendeeType;
    date: string;
    attendeeId: string;
    className?: string;
}
export interface QuestionInput {
    marks: bigint;
    negativeMarking: boolean;
    correctOptionId: string;
    difficulty: Difficulty;
    text: string;
    negativePenalty: number;
    options: Array<QuestionOption>;
}
export interface Question {
    id: string;
    marks: bigint;
    negativeMarking: boolean;
    correctOptionId: string;
    difficulty: Difficulty;
    text: string;
    negativePenalty: number;
    options: Array<QuestionOption>;
}
export interface UserProfile {
    principal: Principal;
    name: string;
    createdAt: Timestamp;
    role: Role;
}
export interface FeePaymentInput {
    studentId: string;
    studentName: string;
    installmentNo?: bigint;
    discount: bigint;
    amount: bigint;
    className: string;
    totalInstallments?: bigint;
}
export enum AttendanceStatus {
    Leave = "Leave",
    Present = "Present",
    Absent = "Absent"
}
export enum AttendeeType {
    Teacher = "Teacher",
    Student = "Student"
}
export enum Difficulty {
    Easy = "Easy",
    Hard = "Hard",
    Medium = "Medium"
}
export enum ExpenseCategory {
    Salary = "Salary",
    Miscellaneous = "Miscellaneous",
    Maintenance = "Maintenance",
    Transport = "Transport",
    Utilities = "Utilities"
}
export enum FeeStatus {
    PartiallyPaid = "PartiallyPaid",
    Late = "Late",
    Paid = "Paid",
    Pending = "Pending"
}
export enum Grade {
    A = "A",
    B = "B",
    C = "C",
    D = "D",
    F = "F",
    APlusPlus = "APlusPlus",
    BPlus = "BPlus",
    APlus = "APlus",
    CPlus = "CPlus"
}
export enum IncomeCategory {
    OtherFee = "OtherFee",
    TransportFee = "TransportFee",
    AdmissionFee = "AdmissionFee",
    TuitionFee = "TuitionFee"
}
export enum LeadStatus {
    New = "New",
    FollowUp = "FollowUp",
    Contacted = "Contacted",
    Converted = "Converted",
    Rejected = "Rejected"
}
export enum Role {
    AdmissionCounsellor = "AdmissionCounsellor",
    Parent = "Parent",
    Teacher = "Teacher",
    SuperAdmin = "SuperAdmin",
    Student = "Student",
    Principal = "Principal",
    Accountant = "Accountant"
}
export enum SalaryStatus {
    Paid = "Paid",
    Pending = "Pending"
}
export enum TestStatus {
    Closed = "Closed",
    Draft = "Draft",
    Published = "Published"
}
export enum TransactionType {
    Income = "Income",
    Expense = "Expense"
}
export interface backendInterface {
    addQuestion(testId: string, input: QuestionInput): Promise<Question>;
    assignRole(target: Principal, role: Role, name: string): Promise<void>;
    bootstrapSuperAdmin(name: string): Promise<void>;
    bulkMarkAttendance(inputs: Array<AttendanceInput>): Promise<Array<AttendanceRecord>>;
    changePassword(username: string, currentPassword: string, newPassword: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createFeePayment(input: FeePaymentInput): Promise<FeePayment>;
    createLead(input: LeadInput): Promise<Lead>;
    createMyTest(title: string, className: string, subject: string, durationMinutes: bigint, negativeMarkingEnabled: boolean): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createResult(input: ExamResultInput): Promise<ExamResult>;
    createSalaryRecord(input: SalaryInput): Promise<SalaryRecord>;
    createStudent(input: StudentInput): Promise<Student>;
    createTeacher(input: TeacherInput): Promise<TeacherRecord>;
    createTest(input: MockTestInput): Promise<MockTest>;
    createTransaction(input: TransactionInput): Promise<Transaction>;
    deleteLead(id: LeadId): Promise<boolean>;
    deleteStudent(id: StudentId): Promise<boolean>;
    exportLeads(): Promise<Array<LeadExportRow>>;
    filterLeadsByStatus(status: LeadStatus): Promise<Array<Lead>>;
    generateAttendanceSession(classId: string, date: string): Promise<{
        __kind__: "ok";
        ok: {
            token: string;
            expiresAt: bigint;
        };
    } | {
        __kind__: "err";
        err: string;
    }>;
    generateTeacherQRCode(classId: string, date: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getAnnualReport(year: bigint): Promise<Array<MonthlyReport>>;
    getAssignments(classId: string): Promise<Array<{
        id: bigint;
        title: string;
        subject: string;
        dueDate: string;
        description: string;
        uploadedBy: string;
    }>>;
    getAttendance(id: string): Promise<AttendanceRecord | null>;
    getAttendanceSession(token: string): Promise<QRSession | null>;
    getAttendanceSummary(attendeeId: string): Promise<AttendanceSummary | null>;
    getChildAttendance(studentId: string): Promise<Array<AttendanceRecord>>;
    getChildFees(studentId: string): Promise<Array<FeePayment>>;
    getChildResults(studentId: string): Promise<Array<ExamResult>>;
    getClassAttendance(className: string, date: string): Promise<Array<AttendanceRecord>>;
    getDashboardStats(): Promise<DashboardStats>;
    getFeePayment(id: string): Promise<FeePayment | null>;
    getFeesByStudent(studentId: string): Promise<Array<FeePayment>>;
    getLead(id: LeadId): Promise<Lead | null>;
    getMonthlyReport(month: string, year: bigint): Promise<MonthlyReport>;
    getMyAttendance(studentId: string): Promise<Array<AttendanceRecord>>;
    getMyProfile(): Promise<UserProfile | null>;
    getMyResults(studentId: string): Promise<Array<ExamResult>>;
    getMySalarySlips(teacherId: string): Promise<Array<SalaryRecord>>;
    getMyTests(studentId: string): Promise<Array<MockTest>>;
    getParentNotices(): Promise<Array<{
        id: string;
        title: string;
        content: string;
        date: string;
        category: string;
    }>>;
    getQuestion(id: string): Promise<Question | null>;
    getResult(id: string): Promise<ExamResult | null>;
    getResultsByExam(examName: string): Promise<Array<ExamResult>>;
    getResultsByStudent(studentId: string): Promise<Array<ExamResult>>;
    getRole(target: Principal): Promise<Role | null>;
    getSalaryByTeacher(teacherId: string): Promise<Array<SalaryRecord>>;
    getStudent(id: StudentId): Promise<Student | null>;
    getStudentCard(studentId: string): Promise<StudentCard | null>;
    getStudentNotices(): Promise<Array<{
        id: bigint;
        title: string;
        content: string;
        date: string;
        category: string;
    }>>;
    getTeacher(id: string): Promise<TeacherRecord | null>;
    getTest(id: string): Promise<MockTest | null>;
    getTestAttempts(testId: string): Promise<Array<TestAttempt>>;
    getTestLeaderboard(testId: string): Promise<Array<TestAttempt>>;
    getToppers(examName: string, className: string): Promise<Array<ExamResult>>;
    getTransaction(id: string): Promise<Transaction | null>;
    listAttendance(date: string | null): Promise<Array<AttendanceRecord>>;
    listFeePayments(): Promise<Array<FeePayment>>;
    listLeads(): Promise<Array<Lead>>;
    listPendingFees(): Promise<Array<FeePayment>>;
    listQuestions(testId: string): Promise<Array<Question>>;
    listResults(): Promise<Array<ExamResult>>;
    listSalaryRecords(): Promise<Array<SalaryRecord>>;
    listStudentCards(): Promise<Array<StudentCard>>;
    listStudents(): Promise<Array<Student>>;
    listTeachers(): Promise<Array<TeacherRecord>>;
    listTests(): Promise<Array<MockTest>>;
    listTransactions(txType: TransactionType | null): Promise<Array<Transaction>>;
    listUsers(): Promise<Array<UserProfile>>;
    markAttendance(input: AttendanceInput): Promise<AttendanceRecord>;
    markClassAttendance(classId: string, date: string, records: Array<{
        status: string;
        studentId: string;
    }>): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    markFeePaid(id: string, paidDate: string): Promise<FeePayment | null>;
    markQRAttendance(token: string, studentId: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    markSalaryPaid(id: string, paidDate: string, bankDetails: string | null): Promise<SalaryRecord | null>;
    publishTest(id: string): Promise<MockTest | null>;
    revokeRole(target: Principal): Promise<void>;
    sendMessageToTeacher(msg: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    submitMyTestAttempt(testId: string, answers: Array<[string, string]>): Promise<{
        __kind__: "ok";
        ok: {
            total: bigint;
            score: bigint;
            percentage: number;
        };
    } | {
        __kind__: "err";
        err: string;
    }>;
    submitTestAttempt(input: TestAttemptInput): Promise<TestAttempt>;
    updateFeePayment(id: string, input: FeePaymentInput): Promise<FeePayment | null>;
    updateLead(id: LeadId, input: LeadInput): Promise<Lead | null>;
    updateResult(id: string, input: ExamResultInput): Promise<ExamResult | null>;
    updateSalaryRecord(id: string, input: SalaryInput): Promise<SalaryRecord | null>;
    updateStudent(id: StudentId, input: StudentInput): Promise<Student | null>;
    updateTeacher(id: string, input: TeacherInput): Promise<TeacherRecord | null>;
    updateTest(id: string, input: MockTestInput): Promise<MockTest | null>;
    uploadHomework(classId: string, title: string, dueDate: string, description: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    uploadMarks(examId: string, marks: Array<{
        totalMarks: bigint;
        studentId: string;
        subject: string;
        marksObtained: bigint;
    }>): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    verifyPassword(username: string, password: string): Promise<boolean>;
}
