import { useMemo, useState } from "react";

export type TransactionType = "Income" | "Expense";
export type ExpenseCategory =
  | "Salary"
  | "Transport"
  | "Utilities"
  | "Maintenance"
  | "Miscellaneous";
export type IncomeCategory =
  | "TuitionFee"
  | "TransportFee"
  | "AdmissionFee"
  | "OtherFee";

export interface Transaction {
  id: string;
  txType: TransactionType;
  amount: number;
  description: string;
  expenseCategory?: ExpenseCategory;
  incomeCategory?: IncomeCategory;
  date: string;
  reference: string;
  createdAt: string;
}

export interface MonthlyReport {
  month: number;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  profit: number;
}

const DEMO_TRANSACTIONS: Transaction[] = [
  // November 2025 – Income
  {
    id: "t1",
    txType: "Income",
    amount: 285000,
    description: "Tuition fees - Class 10 (Nov)",
    incomeCategory: "TuitionFee",
    date: "2025-11-03",
    reference: "TF-2025-1101",
    createdAt: "2025-11-03",
  },
  {
    id: "t2",
    txType: "Income",
    amount: 42000,
    description: "Transport fees - Nov batch",
    incomeCategory: "TransportFee",
    date: "2025-11-05",
    reference: "TR-2025-1101",
    createdAt: "2025-11-05",
  },
  {
    id: "t3",
    txType: "Income",
    amount: 25000,
    description: "New admissions - 5 students",
    incomeCategory: "AdmissionFee",
    date: "2025-11-08",
    reference: "AD-2025-1101",
    createdAt: "2025-11-08",
  },
  {
    id: "t4",
    txType: "Expense",
    amount: 180000,
    description: "Teacher salaries - Nov",
    expenseCategory: "Salary",
    date: "2025-11-30",
    reference: "SAL-2025-11",
    createdAt: "2025-11-30",
  },
  {
    id: "t5",
    txType: "Expense",
    amount: 28000,
    description: "Electricity & water bill - Nov",
    expenseCategory: "Utilities",
    date: "2025-11-20",
    reference: "UTIL-2025-11",
    createdAt: "2025-11-20",
  },
  {
    id: "t6",
    txType: "Expense",
    amount: 15000,
    description: "Bus maintenance & diesel",
    expenseCategory: "Transport",
    date: "2025-11-15",
    reference: "BUS-2025-11",
    createdAt: "2025-11-15",
  },
  // December 2025
  {
    id: "t7",
    txType: "Income",
    amount: 310000,
    description: "Tuition fees - Class 9-12 (Dec)",
    incomeCategory: "TuitionFee",
    date: "2025-12-04",
    reference: "TF-2025-1201",
    createdAt: "2025-12-04",
  },
  {
    id: "t8",
    txType: "Income",
    amount: 42000,
    description: "Transport fees - Dec batch",
    incomeCategory: "TransportFee",
    date: "2025-12-06",
    reference: "TR-2025-1201",
    createdAt: "2025-12-06",
  },
  {
    id: "t9",
    txType: "Income",
    amount: 15000,
    description: "Annual function registration fees",
    incomeCategory: "OtherFee",
    date: "2025-12-10",
    reference: "AF-2025-12",
    createdAt: "2025-12-10",
  },
  {
    id: "t10",
    txType: "Expense",
    amount: 180000,
    description: "Teacher salaries - Dec",
    expenseCategory: "Salary",
    date: "2025-12-31",
    reference: "SAL-2025-12",
    createdAt: "2025-12-31",
  },
  {
    id: "t11",
    txType: "Expense",
    amount: 45000,
    description: "Annual function expenses",
    expenseCategory: "Miscellaneous",
    date: "2025-12-28",
    reference: "EVT-2025-12",
    createdAt: "2025-12-28",
  },
  {
    id: "t12",
    txType: "Expense",
    amount: 12000,
    description: "Lab equipment maintenance",
    expenseCategory: "Maintenance",
    date: "2025-12-18",
    reference: "MAINT-2025-12",
    createdAt: "2025-12-18",
  },
  // January 2026
  {
    id: "t13",
    txType: "Income",
    amount: 295000,
    description: "Tuition fees - Jan (Class 6-10)",
    incomeCategory: "TuitionFee",
    date: "2026-01-05",
    reference: "TF-2026-0101",
    createdAt: "2026-01-05",
  },
  {
    id: "t14",
    txType: "Income",
    amount: 42000,
    description: "Transport fees - Jan",
    incomeCategory: "TransportFee",
    date: "2026-01-07",
    reference: "TR-2026-0101",
    createdAt: "2026-01-07",
  },
  {
    id: "t15",
    txType: "Income",
    amount: 30000,
    description: "New admissions - January",
    incomeCategory: "AdmissionFee",
    date: "2026-01-12",
    reference: "AD-2026-01",
    createdAt: "2026-01-12",
  },
  {
    id: "t16",
    txType: "Expense",
    amount: 185000,
    description: "Teacher salaries - Jan 2026",
    expenseCategory: "Salary",
    date: "2026-01-31",
    reference: "SAL-2026-01",
    createdAt: "2026-01-31",
  },
  {
    id: "t17",
    txType: "Expense",
    amount: 30000,
    description: "Electricity bill - Jan",
    expenseCategory: "Utilities",
    date: "2026-01-22",
    reference: "UTIL-2026-01",
    createdAt: "2026-01-22",
  },
  {
    id: "t18",
    txType: "Expense",
    amount: 8000,
    description: "Classroom furniture repair",
    expenseCategory: "Maintenance",
    date: "2026-01-18",
    reference: "MAINT-2026-01",
    createdAt: "2026-01-18",
  },
  // February 2026
  {
    id: "t19",
    txType: "Income",
    amount: 300000,
    description: "Tuition fees - Feb",
    incomeCategory: "TuitionFee",
    date: "2026-02-04",
    reference: "TF-2026-0201",
    createdAt: "2026-02-04",
  },
  {
    id: "t20",
    txType: "Income",
    amount: 42000,
    description: "Transport fees - Feb",
    incomeCategory: "TransportFee",
    date: "2026-02-06",
    reference: "TR-2026-0201",
    createdAt: "2026-02-06",
  },
  {
    id: "t21",
    txType: "Expense",
    amount: 185000,
    description: "Teacher salaries - Feb 2026",
    expenseCategory: "Salary",
    date: "2026-02-28",
    reference: "SAL-2026-02",
    createdAt: "2026-02-28",
  },
  {
    id: "t22",
    txType: "Expense",
    amount: 22000,
    description: "Water & electricity - Feb",
    expenseCategory: "Utilities",
    date: "2026-02-20",
    reference: "UTIL-2026-02",
    createdAt: "2026-02-20",
  },
  {
    id: "t23",
    txType: "Expense",
    amount: 18000,
    description: "Sports equipment purchase",
    expenseCategory: "Miscellaneous",
    date: "2026-02-14",
    reference: "MISC-2026-02",
    createdAt: "2026-02-14",
  },
  // March 2026
  {
    id: "t24",
    txType: "Income",
    amount: 320000,
    description: "Tuition fees - Mar (annual close)",
    incomeCategory: "TuitionFee",
    date: "2026-03-05",
    reference: "TF-2026-0301",
    createdAt: "2026-03-05",
  },
  {
    id: "t25",
    txType: "Income",
    amount: 42000,
    description: "Transport fees - Mar",
    incomeCategory: "TransportFee",
    date: "2026-03-07",
    reference: "TR-2026-0301",
    createdAt: "2026-03-07",
  },
  {
    id: "t26",
    txType: "Income",
    amount: 20000,
    description: "Examination fees - final exams",
    incomeCategory: "OtherFee",
    date: "2026-03-10",
    reference: "EXAM-2026-03",
    createdAt: "2026-03-10",
  },
  {
    id: "t27",
    txType: "Expense",
    amount: 190000,
    description: "Teacher salaries - Mar 2026",
    expenseCategory: "Salary",
    date: "2026-03-31",
    reference: "SAL-2026-03",
    createdAt: "2026-03-31",
  },
  {
    id: "t28",
    txType: "Expense",
    amount: 35000,
    description: "Exam stationery & printing",
    expenseCategory: "Miscellaneous",
    date: "2026-03-12",
    reference: "EXAM-EXP-2026",
    createdAt: "2026-03-12",
  },
  {
    id: "t29",
    txType: "Expense",
    amount: 20000,
    description: "Building renovation - partial",
    expenseCategory: "Maintenance",
    date: "2026-03-25",
    reference: "RENO-2026-03",
    createdAt: "2026-03-25",
  },
  // April 2026
  {
    id: "t30",
    txType: "Income",
    amount: 250000,
    description: "New academic year fees",
    incomeCategory: "TuitionFee",
    date: "2026-04-08",
    reference: "TF-2026-0401",
    createdAt: "2026-04-08",
  },
  {
    id: "t31",
    txType: "Income",
    amount: 60000,
    description: "Admission fees - new batch 2026-27",
    incomeCategory: "AdmissionFee",
    date: "2026-04-10",
    reference: "AD-2026-04",
    createdAt: "2026-04-10",
  },
  {
    id: "t32",
    txType: "Income",
    amount: 42000,
    description: "Transport fees - Apr",
    incomeCategory: "TransportFee",
    date: "2026-04-08",
    reference: "TR-2026-0401",
    createdAt: "2026-04-08",
  },
  {
    id: "t33",
    txType: "Expense",
    amount: 195000,
    description: "Teacher salaries - Apr 2026",
    expenseCategory: "Salary",
    date: "2026-04-30",
    reference: "SAL-2026-04",
    createdAt: "2026-04-30",
  },
  {
    id: "t34",
    txType: "Expense",
    amount: 16000,
    description: "Bus tyres replacement",
    expenseCategory: "Transport",
    date: "2026-04-18",
    reference: "BUS-2026-04",
    createdAt: "2026-04-18",
  },
  {
    id: "t35",
    txType: "Expense",
    amount: 25000,
    description: "New session stationery & books",
    expenseCategory: "Miscellaneous",
    date: "2026-04-15",
    reference: "MISC-2026-04",
    createdAt: "2026-04-15",
  },
  // May 2026
  {
    id: "t36",
    txType: "Income",
    amount: 280000,
    description: "Tuition fees - May 2026",
    incomeCategory: "TuitionFee",
    date: "2026-05-06",
    reference: "TF-2026-0501",
    createdAt: "2026-05-06",
  },
  {
    id: "t37",
    txType: "Income",
    amount: 42000,
    description: "Transport fees - May",
    incomeCategory: "TransportFee",
    date: "2026-05-07",
    reference: "TR-2026-0501",
    createdAt: "2026-05-07",
  },
  {
    id: "t38",
    txType: "Expense",
    amount: 195000,
    description: "Teacher salaries - May 2026",
    expenseCategory: "Salary",
    date: "2026-05-31",
    reference: "SAL-2026-05",
    createdAt: "2026-05-31",
  },
  {
    id: "t39",
    txType: "Expense",
    amount: 32000,
    description: "Summer maintenance & A/C repair",
    expenseCategory: "Maintenance",
    date: "2026-05-15",
    reference: "MAINT-2026-05",
    createdAt: "2026-05-15",
  },
  {
    id: "t40",
    txType: "Expense",
    amount: 14000,
    description: "Diesel & transport - May",
    expenseCategory: "Transport",
    date: "2026-05-20",
    reference: "BUS-2026-05",
    createdAt: "2026-05-20",
  },
];

export interface GstInvoice {
  id: string;
  invoiceNo: string;
  studentName: string;
  className: string;
  date: string;
  feeAmount: number;
  gstAmount: number;
  total: number;
}

const DEMO_GST_INVOICES: GstInvoice[] = [
  {
    id: "g1",
    invoiceNo: "SSK/GST/2026/001",
    studentName: "Aryan Sharma",
    className: "Class 10-A",
    date: "2026-05-06",
    feeAmount: 12000,
    gstAmount: 2160,
    total: 14160,
  },
  {
    id: "g2",
    invoiceNo: "SSK/GST/2026/002",
    studentName: "Priya Singh",
    className: "Class 9-B",
    date: "2026-05-07",
    feeAmount: 11500,
    gstAmount: 2070,
    total: 13570,
  },
  {
    id: "g3",
    invoiceNo: "SSK/GST/2026/003",
    studentName: "Rohan Gupta",
    className: "Class 12-A",
    date: "2026-05-08",
    feeAmount: 14000,
    gstAmount: 2520,
    total: 16520,
  },
  {
    id: "g4",
    invoiceNo: "SSK/GST/2026/004",
    studentName: "Sneha Patel",
    className: "Class 8-B",
    date: "2026-05-09",
    feeAmount: 10500,
    gstAmount: 1890,
    total: 12390,
  },
  {
    id: "g5",
    invoiceNo: "SSK/GST/2026/005",
    studentName: "Kavya Reddy",
    className: "Class 11-A",
    date: "2026-05-10",
    feeAmount: 13000,
    gstAmount: 2340,
    total: 15340,
  },
];

function generateId(): string {
  return `t${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function useFinance() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(DEMO_TRANSACTIONS);
  const [gstInvoices, setGstInvoices] =
    useState<GstInvoice[]>(DEMO_GST_INVOICES);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const thisMonthTxs = useMemo(
    () =>
      transactions.filter((tx) => {
        const d = new Date(tx.date);
        return (
          d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear
        );
      }),
    [transactions, currentMonth, currentYear],
  );

  const thisMonthIncome = useMemo(
    () =>
      thisMonthTxs
        .filter((t) => t.txType === "Income")
        .reduce((s, t) => s + t.amount, 0),
    [thisMonthTxs],
  );

  const thisMonthExpenses = useMemo(
    () =>
      thisMonthTxs
        .filter((t) => t.txType === "Expense")
        .reduce((s, t) => s + t.amount, 0),
    [thisMonthTxs],
  );

  const annualIncome = useMemo(
    () =>
      transactions
        .filter((t) => {
          const d = new Date(t.date);
          return t.txType === "Income" && d.getFullYear() === currentYear;
        })
        .reduce((s, t) => s + t.amount, 0),
    [transactions, currentYear],
  );

  const monthlyReports = useMemo((): MonthlyReport[] => {
    const months = [
      { m: 11, y: 2025 },
      { m: 12, y: 2025 },
      { m: 1, y: 2026 },
      { m: 2, y: 2026 },
      { m: 3, y: 2026 },
      { m: 4, y: 2026 },
      { m: 5, y: 2026 },
      { m: 6, y: 2026 },
      { m: 7, y: 2026 },
      { m: 8, y: 2026 },
      { m: 9, y: 2026 },
      { m: 10, y: 2026 },
    ];
    return months.map(({ m, y }) => {
      const txs = transactions.filter((tx) => {
        const d = new Date(tx.date);
        return d.getMonth() + 1 === m && d.getFullYear() === y;
      });
      const totalIncome = txs
        .filter((t) => t.txType === "Income")
        .reduce((s, t) => s + t.amount, 0);
      const totalExpenses = txs
        .filter((t) => t.txType === "Expense")
        .reduce((s, t) => s + t.amount, 0);
      return {
        month: m,
        year: y,
        totalIncome,
        totalExpenses,
        profit: totalIncome - totalExpenses,
      };
    });
  }, [transactions]);

  const addTransaction = (tx: Omit<Transaction, "id" | "createdAt">) => {
    const newTx: Transaction = {
      ...tx,
      id: generateId(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const addGstInvoice = (
    inv: Omit<GstInvoice, "id" | "invoiceNo" | "gstAmount" | "total">,
  ) => {
    const gstAmount = Math.round(inv.feeAmount * 0.18);
    const newInv: GstInvoice = {
      ...inv,
      id: generateId(),
      invoiceNo: `SSK/GST/${inv.date.slice(0, 4)}/${String(gstInvoices.length + 1).padStart(3, "0")}`,
      gstAmount,
      total: inv.feeAmount + gstAmount,
    };
    setGstInvoices((prev) => [newInv, ...prev]);
  };

  const getMonthlyReport = (month: number, year: number): MonthlyReport => {
    const txs = transactions.filter((tx) => {
      const d = new Date(tx.date);
      return d.getMonth() + 1 === month && d.getFullYear() === year;
    });
    const totalIncome = txs
      .filter((t) => t.txType === "Income")
      .reduce((s, t) => s + t.amount, 0);
    const totalExpenses = txs
      .filter((t) => t.txType === "Expense")
      .reduce((s, t) => s + t.amount, 0);
    return {
      month,
      year,
      totalIncome,
      totalExpenses,
      profit: totalIncome - totalExpenses,
    };
  };

  return {
    transactions,
    gstInvoices,
    thisMonthIncome,
    thisMonthExpenses,
    annualIncome,
    monthlyReports,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addGstInvoice,
    getMonthlyReport,
  };
}
