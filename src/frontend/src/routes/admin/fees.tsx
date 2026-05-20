import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/hooks/useAuth";
import type { FeePayment, FeePaymentInput, FeeStatus } from "@/hooks/useFees";
import { useFees } from "@/hooks/useFees";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  BadgeDollarSign,
  CheckCircle,
  Clock,
  IndianRupee,
  Percent,
  Plus,
  Printer,
  ReceiptText,
  Search,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

export const Route = createFileRoute("/admin/fees")({ component: FeesPage });

const STATUS_COLORS: Record<FeeStatus, string> = {
  Paid: "bg-green-100 text-green-800 border-green-200",
  Pending: "bg-amber-100 text-amber-800 border-amber-200",
  Late: "bg-red-100 text-red-800 border-red-200",
  PartiallyPaid: "bg-blue-100 text-blue-800 border-blue-200",
};

const STATUS_LABELS: Record<FeeStatus, string> = {
  Paid: "Paid",
  Pending: "Pending",
  Late: "Overdue",
  PartiallyPaid: "Partial",
};

const CLASS_OPTIONS = [
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

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

/* ─── Receipt Print Component ─────────────────────────────── */
function ReceiptContent({ fee }: { fee: FeePayment }) {
  return (
    <div
      id="receipt-content"
      className="hidden print:block p-8 font-sans text-foreground"
    >
      <div className="text-center border-b-2 border-primary pb-4 mb-4">
        <h1 className="text-2xl font-bold tracking-wide text-primary">
          SSK PUBLIC SCHOOL
        </h1>
        <p className="text-sm text-muted-foreground">
          Excellence in Education | Estd. 2005
        </p>
        <p className="text-xs mt-1 text-muted-foreground">
          123 School Road, Knowledge Nagar | Ph: +91-9876543210
        </p>
      </div>

      <div className="flex justify-between mb-6">
        <div>
          <p className="text-xs text-muted-foreground">RECEIPT NO</p>
          <p className="font-bold text-primary text-sm">{fee.receiptNo}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">DATE</p>
          <p className="font-bold text-sm">
            {fee.paidDate ?? new Date().toISOString().split("T")[0]}
          </p>
        </div>
      </div>

      <div className="mb-6 bg-muted/30 rounded p-3">
        <p className="text-xs text-muted-foreground mb-1">STUDENT DETAILS</p>
        <p className="font-semibold">{fee.studentName}</p>
        <p className="text-sm text-muted-foreground">
          {fee.className} · Installment {fee.installmentNo} of{" "}
          {fee.totalInstallments}
        </p>
      </div>

      <table className="w-full text-sm mb-6">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-1.5 text-muted-foreground font-medium">
              Description
            </th>
            <th className="text-right py-1.5 text-muted-foreground font-medium">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border/50">
            <td className="py-1.5">Tuition Fee</td>
            <td className="text-right py-1.5">{fmt(fee.amount)}</td>
          </tr>
          {fee.discount > 0 && (
            <tr className="border-b border-border/50 text-green-700">
              <td className="py-1.5">Discount / Scholarship</td>
              <td className="text-right py-1.5">- {fmt(fee.discount)}</td>
            </tr>
          )}
          {fee.fine > 0 && (
            <tr className="border-b border-border/50 text-red-700">
              <td className="py-1.5">Late Fine</td>
              <td className="text-right py-1.5">+ {fmt(fee.fine)}</td>
            </tr>
          )}
          <tr className="font-bold">
            <td className="py-2">Net Amount</td>
            <td className="text-right py-2 text-primary">
              {fmt(fee.netAmount)}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-between items-end mt-10">
        <p className="text-xs text-muted-foreground">
          This is a computer-generated receipt.
        </p>
        <div className="text-center">
          <div className="border-t border-foreground pt-1 w-32">
            <p className="text-xs text-muted-foreground">
              Authorised Signature
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Add Fee Modal ────────────────────────────────────────── */
function AddFeeModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (input: FeePaymentInput) => void;
}) {
  const [form, setForm] = useState<FeePaymentInput>({
    studentId: "",
    studentName: "",
    className: CLASS_OPTIONS[0],
    amount: 0,
    discount: 0,
    installmentNo: 1,
    totalInstallments: 3,
  });

  const set = (k: keyof FeePaymentInput, v: string | number) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.studentName || form.amount <= 0) return;
    onAdd(form);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm"
      data-ocid="fees.dialog"
    >
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">Add Fee Record</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white"
            aria-label="Close dialog"
            data-ocid="fees.close_button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label
                htmlFor="fees-student-name"
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
              >
                Student Name
              </label>
              <input
                id="fees-student-name"
                type="text"
                className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="e.g. Rahul Kumar"
                value={form.studentName}
                onChange={(e) => set("studentName", e.target.value)}
                data-ocid="fees.student_name_input"
              />
            </div>
            <div>
              <label
                htmlFor="fees-class"
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
              >
                Class
              </label>
              <select
                id="fees-class"
                className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.className}
                onChange={(e) => set("className", e.target.value)}
                data-ocid="fees.class_select"
              >
                {CLASS_OPTIONS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="fees-amount"
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
              >
                Amount (₹)
              </label>
              <input
                id="fees-amount"
                type="number"
                min={0}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="10000"
                value={form.amount || ""}
                onChange={(e) => set("amount", Number(e.target.value))}
                data-ocid="fees.amount_input"
              />
            </div>
            <div>
              <label
                htmlFor="fees-discount"
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
              >
                Discount (₹)
              </label>
              <input
                id="fees-discount"
                type="number"
                min={0}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="0"
                value={form.discount || ""}
                onChange={(e) => set("discount", Number(e.target.value))}
                data-ocid="fees.discount_input"
              />
            </div>
            <div>
              <label
                htmlFor="fees-installment-no"
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
              >
                Installment No
              </label>
              <input
                id="fees-installment-no"
                type="number"
                min={1}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.installmentNo}
                onChange={(e) => set("installmentNo", Number(e.target.value))}
                data-ocid="fees.installment_no_input"
              />
            </div>
            <div>
              <label
                htmlFor="fees-total-installments"
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
              >
                Total Installments
              </label>
              <input
                id="fees-total-installments"
                type="number"
                min={1}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.totalInstallments}
                onChange={(e) =>
                  set("totalInstallments", Number(e.target.value))
                }
                data-ocid="fees.total_installments_input"
              />
            </div>
          </div>

          {form.amount > 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-2 text-sm">
              <span className="text-muted-foreground">Net payable: </span>
              <span className="font-bold text-primary">
                {fmt(form.amount - form.discount)}
              </span>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
              data-ocid="fees.cancel_button"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
              data-ocid="fees.submit_button"
            >
              Add Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Fees Page ────────────────────────────────────────────── */
function FeesPage() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const { fees, addFee, markPaid, stats } = useFees();
  const printRef = useRef<FeePayment | null>(null);

  const [statusFilter, setStatusFilter] = useState<FeeStatus | "All">("All");
  const [classFilter, setClassFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [printFee, setPrintFee] = useState<FeePayment | null>(null);

  const allowedRoles = ["super_admin", "principal", "accountant"];
  if (role && !allowedRoles.includes(role)) {
    navigate({ to: "/admin/" });
    return null;
  }

  const filtered = fees.filter((f) => {
    const matchStatus = statusFilter === "All" || f.status === statusFilter;
    const matchClass = classFilter === "All" || f.className === classFilter;
    const matchSearch =
      !search || f.studentName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchClass && matchSearch;
  });

  const handlePrint = (fee: FeePayment) => {
    printRef.current = fee;
    setPrintFee(fee);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const allClasses = ["All", ...CLASS_OPTIONS];

  const statCards = [
    {
      label: "Total Collected",
      value: fmt(stats.totalCollected),
      icon: IndianRupee,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Pending Records",
      value: stats.pendingCount.toString(),
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Overdue Amount",
      value: fmt(stats.overdueAmount),
      icon: BadgeDollarSign,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Discounts Given",
      value: fmt(stats.discountsGiven),
      icon: Percent,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  return (
    <AdminLayout title="Fees Management">
      {/* Hidden receipt for printing */}
      {printFee && <ReceiptContent fee={printFee} />}

      <div className="space-y-6" data-ocid="fees.page">
        {/* Stats Bar */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          data-ocid="fees.stats_panel"
        >
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 shadow-xs"
            >
              <div className={`${card.bg} rounded-lg p-3`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium truncate">
                  {card.label}
                </p>
                <p className={`text-lg font-bold ${card.color} truncate`}>
                  {card.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="bg-card rounded-xl border border-border p-4 flex flex-wrap gap-3 items-center shadow-xs">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search student name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              data-ocid="fees.search_input"
            />
          </div>

          {/* Status filter */}
          <div className="flex gap-1 flex-wrap">
            {(["All", "Paid", "Pending", "Late", "PartiallyPaid"] as const).map(
              (s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    statusFilter === s
                      ? "bg-primary text-white border-primary"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                  data-ocid={`fees.filter.${s.toLowerCase()}`}
                >
                  {s === "PartiallyPaid" ? "Partial" : s}
                </button>
              ),
            )}
          </div>

          {/* Class filter */}
          <select
            className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            data-ocid="fees.class_filter_select"
          >
            {allClasses.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {/* Add button */}
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
            data-ocid="fees.add_button"
          >
            <Plus className="h-4 w-4" />
            Add Record
          </button>
        </div>

        {/* Table */}
        <div
          className="bg-card rounded-xl border border-border shadow-xs overflow-hidden"
          data-ocid="fees.table"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary/5 border-b border-border">
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                    Receipt No
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                    Student
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                    Class
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                    Discount
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                    Fine
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                    Net
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                    Date
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="text-center py-12 text-muted-foreground"
                      data-ocid="fees.empty_state"
                    >
                      <ReceiptText className="h-10 w-10 mx-auto mb-2 opacity-30" />
                      <p className="font-medium">No fee records found</p>
                      <p className="text-xs mt-1">
                        Try adjusting filters or add a new record.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((fee, idx) => (
                    <tr
                      key={fee.id}
                      className="border-b border-border/60 hover:bg-muted/30 transition-colors"
                      data-ocid={`fees.item.${idx + 1}`}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-primary font-semibold">
                        {fee.receiptNo}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">
                          {fee.studentName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Install. {fee.installmentNo}/{fee.totalInstallments}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {fee.className}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {fmt(fee.amount)}
                      </td>
                      <td className="px-4 py-3 text-right text-green-700">
                        {fee.discount > 0 ? `- ${fmt(fee.discount)}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-right text-red-700">
                        {fee.fine > 0 ? `+ ${fmt(fee.fine)}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-foreground">
                        {fmt(fee.netAmount)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            STATUS_COLORS[fee.status]
                          }`}
                        >
                          {STATUS_LABELS[fee.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {fee.paidDate ?? fee.dueDate}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          {(fee.status === "Pending" ||
                            fee.status === "Late") && (
                            <button
                              type="button"
                              title="Mark Paid"
                              onClick={() => markPaid(fee.id)}
                              className="p-1.5 rounded-md bg-green-50 hover:bg-green-100 text-green-700 transition-colors"
                              data-ocid={`fees.mark_paid_button.${idx + 1}`}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            title="View / Print Receipt"
                            onClick={() => handlePrint(fee)}
                            className="p-1.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                            data-ocid={`fees.print_button.${idx + 1}`}
                          >
                            <Printer className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div className="px-4 py-3 bg-muted/20 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Showing {filtered.length} of {fees.length} records
              </span>
              <span className="font-medium text-foreground">
                Total net: {fmt(filtered.reduce((s, f) => s + f.netAmount, 0))}
              </span>
            </div>
          )}
        </div>
      </div>

      {showAdd && (
        <AddFeeModal onClose={() => setShowAdd(false)} onAdd={addFee} />
      )}

      {/* Print-only receipt styles */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          #receipt-content { display: block !important; }
        }
      `}</style>
    </AdminLayout>
  );
}
