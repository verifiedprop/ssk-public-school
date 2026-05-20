import { useCallback, useState } from "react";

export type FeeStatus = "Pending" | "Paid" | "Late" | "PartiallyPaid";

export interface FeePayment {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  amount: number;
  discount: number;
  fine: number;
  netAmount: number;
  status: FeeStatus;
  paidDate?: string;
  dueDate: string;
  receiptNo: string;
  installmentNo: number;
  totalInstallments: number;
  createdAt: string;
}

export interface FeePaymentInput {
  studentId: string;
  studentName: string;
  className: string;
  amount: number;
  discount: number;
  installmentNo: number;
  totalInstallments: number;
}

const DEMO_FEES: FeePayment[] = [
  {
    id: "f1",
    studentId: "s001",
    studentName: "Arjun Sharma",
    className: "Class 10-A",
    amount: 12000,
    discount: 500,
    fine: 0,
    netAmount: 11500,
    status: "Paid",
    paidDate: "2026-04-10",
    dueDate: "2026-04-15",
    receiptNo: "RCP-2026-001",
    installmentNo: 1,
    totalInstallments: 3,
    createdAt: "2026-04-01",
  },
  {
    id: "f2",
    studentId: "s002",
    studentName: "Priya Verma",
    className: "Class 8-B",
    amount: 9500,
    discount: 0,
    fine: 0,
    netAmount: 9500,
    status: "Pending",
    dueDate: "2026-05-15",
    receiptNo: "RCP-2026-002",
    installmentNo: 2,
    totalInstallments: 3,
    createdAt: "2026-04-15",
  },
  {
    id: "f3",
    studentId: "s003",
    studentName: "Rohan Patel",
    className: "Class 12-A",
    amount: 15000,
    discount: 1000,
    fine: 750,
    netAmount: 14750,
    status: "Late",
    dueDate: "2026-04-01",
    receiptNo: "RCP-2026-003",
    installmentNo: 1,
    totalInstallments: 2,
    createdAt: "2026-03-20",
  },
  {
    id: "f4",
    studentId: "s004",
    studentName: "Meera Gupta",
    className: "Class 6-C",
    amount: 8000,
    discount: 200,
    fine: 0,
    netAmount: 4000,
    status: "PartiallyPaid",
    paidDate: "2026-04-20",
    dueDate: "2026-04-30",
    receiptNo: "RCP-2026-004",
    installmentNo: 1,
    totalInstallments: 4,
    createdAt: "2026-04-05",
  },
  {
    id: "f5",
    studentId: "s005",
    studentName: "Kiran Singh",
    className: "Class 9-B",
    amount: 11000,
    discount: 0,
    fine: 550,
    netAmount: 11550,
    status: "Late",
    dueDate: "2026-03-31",
    receiptNo: "RCP-2026-005",
    installmentNo: 3,
    totalInstallments: 3,
    createdAt: "2026-03-01",
  },
  {
    id: "f6",
    studentId: "s006",
    studentName: "Anjali Tiwari",
    className: "Class 7-A",
    amount: 8500,
    discount: 850,
    fine: 0,
    netAmount: 7650,
    status: "Paid",
    paidDate: "2026-05-02",
    dueDate: "2026-05-10",
    receiptNo: "RCP-2026-006",
    installmentNo: 2,
    totalInstallments: 4,
    createdAt: "2026-04-20",
  },
  {
    id: "f7",
    studentId: "s007",
    studentName: "Devendra Yadav",
    className: "Class 11-B",
    amount: 14000,
    discount: 0,
    fine: 0,
    netAmount: 14000,
    status: "Pending",
    dueDate: "2026-05-20",
    receiptNo: "RCP-2026-007",
    installmentNo: 1,
    totalInstallments: 2,
    createdAt: "2026-05-01",
  },
  {
    id: "f8",
    studentId: "s008",
    studentName: "Neha Kapoor",
    className: "Class 5-A",
    amount: 7500,
    discount: 750,
    fine: 0,
    netAmount: 6750,
    status: "Paid",
    paidDate: "2026-04-28",
    dueDate: "2026-04-30",
    receiptNo: "RCP-2026-008",
    installmentNo: 4,
    totalInstallments: 4,
    createdAt: "2026-03-25",
  },
];

function generateReceiptNo(): string {
  const num = Math.floor(Math.random() * 900) + 100;
  return `RCP-2026-0${num}`;
}

export function useFees() {
  const [fees, setFees] = useState<FeePayment[]>(DEMO_FEES);

  const addFee = useCallback((input: FeePaymentInput): FeePayment => {
    const newFee: FeePayment = {
      id: `f${Date.now()}`,
      ...input,
      fine: 0,
      netAmount: input.amount - input.discount,
      status: "Pending",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      receiptNo: generateReceiptNo(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setFees((prev) => [newFee, ...prev]);
    return newFee;
  }, []);

  const markPaid = useCallback((id: string) => {
    setFees((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              status: "Paid" as FeeStatus,
              paidDate: new Date().toISOString().split("T")[0],
            }
          : f,
      ),
    );
  }, []);

  const updateFee = useCallback(
    (id: string, patch: Partial<FeePaymentInput>) => {
      setFees((prev) =>
        prev.map((f) => {
          if (f.id !== id) return f;
          const updated = { ...f, ...patch };
          updated.netAmount = updated.amount - updated.discount + updated.fine;
          return updated;
        }),
      );
    },
    [],
  );

  const getFeesByStatus = useCallback(
    (status: FeeStatus | "All") =>
      status === "All" ? fees : fees.filter((f) => f.status === status),
    [fees],
  );

  const stats = {
    totalCollected: fees
      .filter((f) => f.status === "Paid")
      .reduce((sum, f) => sum + f.netAmount, 0),
    pendingCount: fees.filter(
      (f) => f.status === "Pending" || f.status === "PartiallyPaid",
    ).length,
    overdueAmount: fees
      .filter((f) => f.status === "Late")
      .reduce((sum, f) => sum + f.fine, 0),
    discountsGiven: fees.reduce((sum, f) => sum + f.discount, 0),
  };

  return { fees, addFee, markPaid, updateFee, getFeesByStatus, stats };
}
