import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/hooks/useAuth";
import {
  type ExpenseCategory,
  type GstInvoice,
  type IncomeCategory,
  type Transaction,
  type TransactionType,
  useFinance,
} from "@/hooks/useFinance";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Download,
  FileText,
  IndianRupee,
  Plus,
  Printer,
  TrendingUp,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/admin/finance")({
  component: FinancePage,
});

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const INCOME_CATEGORIES: IncomeCategory[] = [
  "TuitionFee",
  "TransportFee",
  "AdmissionFee",
  "OtherFee",
];
const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "Salary",
  "Transport",
  "Utilities",
  "Maintenance",
  "Miscellaneous",
];

const INCOME_CAT_LABELS: Record<IncomeCategory, string> = {
  TuitionFee: "Tuition Fee",
  TransportFee: "Transport Fee",
  AdmissionFee: "Admission Fee",
  OtherFee: "Other Fee",
};

const EXPENSE_CAT_LABELS: Record<ExpenseCategory, string> = {
  Salary: "Salary",
  Transport: "Transport",
  Utilities: "Utilities",
  Maintenance: "Maintenance",
  Miscellaneous: "Miscellaneous",
};

const EXPENSE_CAT_COLOR: Record<ExpenseCategory, string> = {
  Salary: "bg-blue-100 text-blue-700",
  Transport: "bg-purple-100 text-purple-700",
  Utilities: "bg-yellow-100 text-yellow-700",
  Maintenance: "bg-orange-100 text-orange-700",
  Miscellaneous: "bg-slate-100 text-slate-600",
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function FinancePage() {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const finance = useFinance();
  const [activeTab, setActiveTab] = useState<
    "transactions" | "income" | "expense" | "pnl" | "gst"
  >("transactions");

  useEffect(() => {
    if (!isAuthenticated) void navigate({ to: "/login" as never });
  }, [isAuthenticated, navigate]);

  const allowed =
    role === "super_admin" || role === "principal" || role === "accountant";

  if (!isAuthenticated || !allowed) {
    return (
      <AdminLayout title="Finance & Accounts">
        <div
          className="flex items-center justify-center h-64"
          data-ocid="finance.error_state"
        >
          <div className="text-center">
            <p className="text-red-500 font-semibold text-lg">Access Denied</p>
            <p className="text-muted-foreground text-sm mt-1">
              Only Super Admin, Principal, and Accountant can view Finance.
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const {
    transactions,
    gstInvoices,
    thisMonthIncome,
    thisMonthExpenses,
    annualIncome,
    monthlyReports,
    addTransaction,
    deleteTransaction,
    addGstInvoice,
    getMonthlyReport,
  } = finance;

  const TABS = [
    { id: "transactions", label: "Transactions" },
    { id: "income", label: "Income Ledger" },
    { id: "expense", label: "Expense Ledger" },
    { id: "pnl", label: "P&L Report" },
    { id: "gst", label: "GST Invoices" },
  ] as const;

  const netProfit = thisMonthIncome - thisMonthExpenses;
  const maxMonthlyValue = Math.max(
    ...monthlyReports.map((r) => Math.max(r.totalIncome, r.totalExpenses)),
    1,
  );

  return (
    <AdminLayout title="Finance & Accounts">
      <div className="space-y-6" data-ocid="finance.page">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-blue-900 font-display">
              Finance & Accounts
            </h1>
            <p className="text-blue-500 text-sm mt-0.5">
              SSK Public School — Financial Overview
            </p>
          </div>
          <div className="text-xs text-muted-foreground bg-blue-50 rounded-lg px-3 py-1.5 border border-blue-100">
            Academic Year 2025-26
          </div>
        </div>

        {/* Stat Cards */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          data-ocid="finance.summary_section"
        >
          <StatCard
            icon={ArrowUpCircle}
            label="Income (This Month)"
            value={`₹${fmt(thisMonthIncome)}`}
            color="text-green-600"
            bg="bg-green-50"
            border="border-green-100"
          />
          <StatCard
            icon={ArrowDownCircle}
            label="Expenses (This Month)"
            value={`₹${fmt(thisMonthExpenses)}`}
            color="text-red-500"
            bg="bg-red-50"
            border="border-red-100"
          />
          <StatCard
            icon={TrendingUp}
            label="Net Profit/Loss"
            value={`${netProfit >= 0 ? "+" : ""}₹${fmt(Math.abs(netProfit))}`}
            color={netProfit >= 0 ? "text-green-600" : "text-red-500"}
            bg={netProfit >= 0 ? "bg-green-50" : "bg-red-50"}
            border={netProfit >= 0 ? "border-green-100" : "border-red-100"}
          />
          <StatCard
            icon={IndianRupee}
            label="Annual Revenue"
            value={`₹${fmt(annualIncome)}`}
            color="text-blue-900"
            bg="bg-blue-50"
            border="border-blue-100"
          />
        </div>

        {/* Monthly Trend Chart */}
        <div
          className="bg-white rounded-xl border border-blue-100 shadow-sm p-5"
          data-ocid="finance.trend_chart"
        >
          <h2 className="text-sm font-bold text-blue-900 mb-4 uppercase tracking-wide">
            12-Month Income vs Expenses
          </h2>
          <div className="space-y-2">
            {monthlyReports.map((r) => (
              <div
                key={`${r.year}-${r.month}`}
                className="flex items-center gap-3 text-xs"
              >
                <span className="w-8 text-blue-500 font-medium shrink-0">
                  {MONTHS[r.month - 1]}
                </span>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-12 text-right text-green-600 font-mono shrink-0">
                      ₹{fmt(r.totalIncome / 1000)}k
                    </span>
                    <div className="flex-1 bg-green-50 rounded h-3 overflow-hidden">
                      <div
                        className="h-full bg-green-400 rounded transition-all"
                        style={{
                          width: `${(r.totalIncome / maxMonthlyValue) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-12 text-right text-red-500 font-mono shrink-0">
                      ₹{fmt(r.totalExpenses / 1000)}k
                    </span>
                    <div className="flex-1 bg-red-50 rounded h-3 overflow-hidden">
                      <div
                        className="h-full bg-red-400 rounded transition-all"
                        style={{
                          width: `${(r.totalExpenses / maxMonthlyValue) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-green-400 inline-block" />
              Income
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-red-400 inline-block" />
              Expenses
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
          <div
            className="flex overflow-x-auto border-b border-blue-100"
            role="tablist"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={activeTab === t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === t.id
                    ? "border-blue-700 text-blue-800 bg-blue-50/60"
                    : "border-transparent text-blue-500 hover:text-blue-700 hover:bg-blue-50/40"
                }`}
                data-ocid={`finance.tab.${t.id}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-5">
            {activeTab === "transactions" && (
              <TransactionsTab
                transactions={transactions}
                onAdd={addTransaction}
                onDelete={deleteTransaction}
              />
            )}
            {activeTab === "income" && (
              <IncomeLedgerTab transactions={transactions} />
            )}
            {activeTab === "expense" && (
              <ExpenseLedgerTab transactions={transactions} />
            )}
            {activeTab === "pnl" && (
              <PnLTab
                getMonthlyReport={getMonthlyReport}
                transactions={transactions}
              />
            )}
            {activeTab === "gst" && (
              <GstTab invoices={gstInvoices} onAdd={addGstInvoice} />
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

/* ─── Stat Card ──────────────────────────────────────────── */
function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
  border,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <div className={`rounded-xl p-4 border ${bg} ${border}`}>
      <div
        className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-2`}
      >
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className={`text-xl font-bold mt-0.5 ${color}`}>{value}</p>
    </div>
  );
}

/* ─── Transactions Tab ───────────────────────────────────── */
function TransactionsTab({
  transactions,
  onAdd,
  onDelete,
}: {
  transactions: Transaction[];
  onAdd: (tx: Omit<Transaction, "id" | "createdAt">) => void;
  onDelete: (id: string) => void;
}) {
  const [typeFilter, setTypeFilter] = useState<"All" | TransactionType>("All");
  const [catFilter, setCatFilter] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filtered = useMemo(
    () =>
      transactions.filter((t) => {
        if (typeFilter !== "All" && t.txType !== typeFilter) return false;
        const cat =
          t.txType === "Income"
            ? (t.incomeCategory ?? "")
            : (t.expenseCategory ?? "");
        if (catFilter && cat !== catFilter) return false;
        if (
          search &&
          !t.description.toLowerCase().includes(search.toLowerCase()) &&
          !t.reference.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        return true;
      }),
    [transactions, typeFilter, catFilter, search],
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {(["All", "Income", "Expense"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                setTypeFilter(f);
                setCatFilter("");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                typeFilter === f
                  ? "bg-blue-700 text-white"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
              data-ocid={`finance.filter.${f.toLowerCase()}`}
            >
              {f}
            </button>
          ))}
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="border border-blue-200 rounded-lg px-2 py-1.5 text-xs text-blue-700 focus:ring-1 focus:ring-blue-500"
            data-ocid="finance.category_select"
          >
            <option value="">All Categories</option>
            {typeFilter !== "Expense" &&
              INCOME_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {INCOME_CAT_LABELS[c]}
                </option>
              ))}
            {typeFilter !== "Income" &&
              EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {EXPENSE_CAT_LABELS[c]}
                </option>
              ))}
          </select>
        </div>
        <div className="flex gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="border border-blue-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 w-40"
            data-ocid="finance.search_input"
          />
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
            data-ocid="finance.add_button"
          >
            <Plus className="w-3.5 h-3.5" /> Add Transaction
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        className="overflow-x-auto rounded-lg border border-blue-100"
        data-ocid="finance.transactions_table"
      >
        <table className="w-full text-xs">
          <thead className="bg-blue-50">
            <tr>
              {[
                "Date",
                "Type",
                "Category",
                "Description",
                "Amount (₹)",
                "Reference",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2.5 text-left text-blue-900 font-semibold uppercase tracking-wide text-xs"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-10 text-blue-400"
                  data-ocid="finance.empty_state"
                >
                  No transactions found.
                </td>
              </tr>
            ) : (
              filtered.map((tx, i) => (
                <tr
                  key={tx.id}
                  className="border-t border-blue-50 hover:bg-blue-50/40 transition-colors"
                  data-ocid={`finance.item.${i + 1}`}
                >
                  <td className="px-3 py-2.5 text-blue-600 whitespace-nowrap">
                    {fmtDate(tx.date)}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-xs ${
                        tx.txType === "Income"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {tx.txType}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-blue-600">
                    {tx.txType === "Income"
                      ? INCOME_CAT_LABELS[tx.incomeCategory!]
                      : EXPENSE_CAT_LABELS[tx.expenseCategory!]}
                  </td>
                  <td className="px-3 py-2.5 text-blue-900 max-w-[180px] truncate">
                    {tx.description}
                  </td>
                  <td className="px-3 py-2.5 font-mono font-bold text-right text-blue-900">
                    ₹{fmt(tx.amount)}
                  </td>
                  <td className="px-3 py-2.5 text-blue-500 font-mono text-xs">
                    {tx.reference}
                  </td>
                  <td className="px-3 py-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Delete this transaction?"))
                          onDelete(tx.id);
                      }}
                      className="text-red-400 hover:text-red-600 transition-colors text-xs font-semibold"
                      data-ocid={`finance.delete_button.${i + 1}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <AddTransactionModal
          onClose={() => setShowModal(false)}
          onSave={(tx) => {
            onAdd(tx);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

/* ─── Add Transaction Modal ──────────────────────────────── */
function AddTransactionModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (tx: Omit<Transaction, "id" | "createdAt">) => void;
}) {
  const [txType, setTxType] = useState<TransactionType>("Income");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [incomeCategory, setIncomeCategory] =
    useState<IncomeCategory>("TuitionFee");
  const [expenseCategory, setExpenseCategory] =
    useState<ExpenseCategory>("Salary");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [reference, setReference] = useState("");

  const handleSubmit = () => {
    if (!amount || !description || !date) return;
    onSave({
      txType,
      amount: Number(amount),
      description,
      incomeCategory: txType === "Income" ? incomeCategory : undefined,
      expenseCategory: txType === "Expense" ? expenseCategory : undefined,
      date,
      reference: reference || `REF-${Date.now()}`,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
      data-ocid="finance.dialog"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-blue-900 text-lg">Add Transaction</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            data-ocid="finance.close_button"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <p className="text-xs font-semibold text-blue-800 mb-1">
              Transaction Type
            </p>
            <div className="flex gap-2">
              {(["Income", "Expense"] as TransactionType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTxType(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors ${
                    txType === t
                      ? t === "Income"
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-red-500 text-white border-red-500"
                      : "bg-white border-blue-200 text-blue-700"
                  }`}
                  data-ocid={`finance.type_${t.toLowerCase()}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label
              htmlFor="finance-amount"
              className="text-xs font-semibold text-blue-800 mb-1 block"
            >
              Amount (₹)
            </label>
            <input
              id="finance-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500"
              data-ocid="finance.amount_input"
            />
          </div>
          <div>
            <label
              htmlFor="finance-date"
              className="text-xs font-semibold text-blue-800 mb-1 block"
            >
              Date
            </label>
            <input
              id="finance-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500"
              data-ocid="finance.date_input"
            />
          </div>
          <div className="col-span-2">
            <label
              htmlFor="finance-category"
              className="text-xs font-semibold text-blue-800 mb-1 block"
            >
              Category
            </label>
            {txType === "Income" ? (
              <select
                value={incomeCategory}
                onChange={(e) =>
                  setIncomeCategory(e.target.value as IncomeCategory)
                }
                id="finance-category"
                className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500"
                data-ocid="finance.income_category_select"
              >
                {INCOME_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {INCOME_CAT_LABELS[c]}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={expenseCategory}
                onChange={(e) =>
                  setExpenseCategory(e.target.value as ExpenseCategory)
                }
                id="finance-category"
                className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500"
                data-ocid="finance.expense_category_select"
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {EXPENSE_CAT_LABELS[c]}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="col-span-2">
            <label
              htmlFor="finance-description"
              className="text-xs font-semibold text-blue-800 mb-1 block"
            >
              Description
            </label>
            <input
              id="finance-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500"
              data-ocid="finance.description_input"
            />
          </div>
          <div className="col-span-2">
            <label
              htmlFor="finance-reference"
              className="text-xs font-semibold text-blue-800 mb-1 block"
            >
              Reference (optional)
            </label>
            <input
              id="finance-reference"
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. TF-2026-05"
              className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500"
              data-ocid="finance.reference_input"
            />
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-blue-200 text-blue-700 text-sm font-semibold hover:bg-blue-50 transition-colors"
            data-ocid="finance.cancel_button"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold transition-colors"
            data-ocid="finance.submit_button"
          >
            Save Transaction
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Income Ledger Tab ──────────────────────────────────── */
function IncomeLedgerTab({ transactions }: { transactions: Transaction[] }) {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [catFilter, setCatFilter] = useState<"" | IncomeCategory>("");

  const filtered = useMemo(
    () =>
      transactions.filter((t) => {
        if (t.txType !== "Income") return false;
        const d = new Date(t.date);
        if (d.getMonth() + 1 !== month || d.getFullYear() !== year)
          return false;
        if (catFilter && t.incomeCategory !== catFilter) return false;
        return true;
      }),
    [transactions, month, year, catFilter],
  );

  const total = filtered.reduce((s, t) => s + t.amount, 0);

  const exportCsv = () => {
    const rows = [
      ["Date", "Category", "Description", "Amount", "Reference"],
      ...filtered.map((t) => [
        t.date,
        INCOME_CAT_LABELS[t.incomeCategory!],
        t.description,
        t.amount,
        t.reference,
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `income-ledger-${year}-${String(month).padStart(2, "0")}.csv`;
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border border-blue-200 rounded-lg px-2 py-1.5 text-xs text-blue-700"
            data-ocid="finance.income_month_select"
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border border-blue-200 rounded-lg px-2 py-1.5 text-xs text-blue-700"
            data-ocid="finance.income_year_select"
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            value={catFilter}
            onChange={(e) =>
              setCatFilter(e.target.value as "" | IncomeCategory)
            }
            className="border border-blue-200 rounded-lg px-2 py-1.5 text-xs text-blue-700"
            data-ocid="finance.income_cat_select"
          >
            <option value="">All Categories</option>
            {INCOME_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {INCOME_CAT_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors"
          data-ocid="finance.income_export_button"
        >
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>
      <LedgerTable rows={filtered} type="income" />
      <div className="flex justify-end">
        <span className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-bold">
          Total: ₹{fmt(total)}
        </span>
      </div>
    </div>
  );
}

/* ─── Expense Ledger Tab ─────────────────────────────────── */
function ExpenseLedgerTab({ transactions }: { transactions: Transaction[] }) {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [catFilter, setCatFilter] = useState<"" | ExpenseCategory>("");

  const filtered = useMemo(
    () =>
      transactions.filter((t) => {
        if (t.txType !== "Expense") return false;
        const d = new Date(t.date);
        if (d.getMonth() + 1 !== month || d.getFullYear() !== year)
          return false;
        if (catFilter && t.expenseCategory !== catFilter) return false;
        return true;
      }),
    [transactions, month, year, catFilter],
  );

  const total = filtered.reduce((s, t) => s + t.amount, 0);

  const exportCsv = () => {
    const rows = [
      ["Date", "Category", "Description", "Amount", "Reference"],
      ...filtered.map((t) => [
        t.date,
        EXPENSE_CAT_LABELS[t.expenseCategory!],
        t.description,
        t.amount,
        t.reference,
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `expense-ledger-${year}-${String(month).padStart(2, "0")}.csv`;
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border border-blue-200 rounded-lg px-2 py-1.5 text-xs text-blue-700"
            data-ocid="finance.expense_month_select"
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border border-blue-200 rounded-lg px-2 py-1.5 text-xs text-blue-700"
            data-ocid="finance.expense_year_select"
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            value={catFilter}
            onChange={(e) =>
              setCatFilter(e.target.value as "" | ExpenseCategory)
            }
            className="border border-blue-200 rounded-lg px-2 py-1.5 text-xs text-blue-700"
            data-ocid="finance.expense_cat_select"
          >
            <option value="">All Categories</option>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {EXPENSE_CAT_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors"
          data-ocid="finance.expense_export_button"
        >
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>
      <LedgerTable rows={filtered} type="expense" />
      <div className="flex justify-end">
        <span className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-bold">
          Total: ₹{fmt(total)}
        </span>
      </div>
    </div>
  );
}

/* ─── Ledger Table (shared) ──────────────────────────────── */
function LedgerTable({
  rows,
  type,
}: { rows: Transaction[]; type: "income" | "expense" }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-blue-100">
      <table className="w-full text-xs">
        <thead className="bg-blue-50">
          <tr>
            {["Date", "Category", "Description", "Amount (₹)", "Reference"].map(
              (h) => (
                <th
                  key={h}
                  className="px-3 py-2.5 text-left text-blue-900 font-semibold uppercase tracking-wide"
                >
                  {h}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-10 text-blue-400">
                No records found for this period.
              </td>
            </tr>
          ) : (
            rows.map((tx, i) => (
              <tr
                key={tx.id}
                className="border-t border-blue-50 hover:bg-blue-50/40"
                data-ocid={`finance.ledger_item.${i + 1}`}
              >
                <td className="px-3 py-2.5 text-blue-600 whitespace-nowrap">
                  {fmtDate(tx.date)}
                </td>
                <td className="px-3 py-2.5">
                  {type === "income" ? (
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold text-xs">
                      {INCOME_CAT_LABELS[tx.incomeCategory!]}
                    </span>
                  ) : (
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold text-xs ${EXPENSE_CAT_COLOR[tx.expenseCategory!]}`}
                    >
                      {EXPENSE_CAT_LABELS[tx.expenseCategory!]}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-blue-900 max-w-[200px] truncate">
                  {tx.description}
                </td>
                <td className="px-3 py-2.5 font-mono font-bold text-right text-blue-900">
                  ₹{fmt(tx.amount)}
                </td>
                <td className="px-3 py-2.5 text-blue-500 font-mono">
                  {tx.reference}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ─── P&L Tab ────────────────────────────────────────────── */
function PnLTab({
  getMonthlyReport,
  transactions,
}: {
  getMonthlyReport: (
    m: number,
    y: number,
  ) => { totalIncome: number; totalExpenses: number; profit: number };
  transactions: Transaction[];
}) {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const report = getMonthlyReport(month, year);

  const monthTxs = useMemo(
    () =>
      transactions.filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() + 1 === month && d.getFullYear() === year;
      }),
    [transactions, month, year],
  );

  const incomeByCategory = useMemo(() => {
    const map: Partial<Record<IncomeCategory, number>> = {};
    for (const t of monthTxs.filter((t) => t.txType === "Income")) {
      const c = t.incomeCategory!;
      map[c] = (map[c] ?? 0) + t.amount;
    }
    return map;
  }, [monthTxs]);

  const expenseByCategory = useMemo(() => {
    const map: Partial<Record<ExpenseCategory, number>> = {};
    for (const t of monthTxs.filter((t) => t.txType === "Expense")) {
      const c = t.expenseCategory!;
      map[c] = (map[c] ?? 0) + t.amount;
    }
    return map;
  }, [monthTxs]);

  const maxBar = Math.max(
    ...Object.values(incomeByCategory),
    ...Object.values(expenseByCategory),
    1,
  ) as number;

  const printReport = () => window.print();

  return (
    <div className="space-y-5" data-ocid="finance.pnl_section">
      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border border-blue-200 rounded-lg px-2 py-1.5 text-xs text-blue-700"
            data-ocid="finance.pnl_month_select"
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border border-blue-200 rounded-lg px-2 py-1.5 text-xs text-blue-700"
            data-ocid="finance.pnl_year_select"
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={printReport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors"
          data-ocid="finance.print_pnl_button"
        >
          <Printer className="w-3.5 h-3.5" /> Print P&L
        </button>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
          <p className="text-xs text-green-700 font-semibold mb-1">
            Total Income
          </p>
          <p className="text-xl font-bold text-green-700">
            ₹{fmt(report.totalIncome)}
          </p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
          <p className="text-xs text-red-600 font-semibold mb-1">
            Total Expenses
          </p>
          <p className="text-xl font-bold text-red-600">
            ₹{fmt(report.totalExpenses)}
          </p>
        </div>
        <div
          className={`rounded-xl p-4 text-center border ${
            report.profit >= 0
              ? "bg-green-50 border-green-100"
              : "bg-red-50 border-red-100"
          }`}
        >
          <p
            className={`text-xs font-semibold mb-1 ${report.profit >= 0 ? "text-green-700" : "text-red-600"}`}
          >
            Net {report.profit >= 0 ? "Profit" : "Loss"}
          </p>
          <p
            className={`text-xl font-bold ${report.profit >= 0 ? "text-green-700" : "text-red-600"}`}
          >
            {report.profit >= 0 ? "+" : ""}₹{fmt(Math.abs(report.profit))}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-blue-100 rounded-xl p-4">
          <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wide mb-3">
            Income by Category
          </h3>
          {Object.keys(incomeByCategory).length === 0 ? (
            <p className="text-blue-400 text-xs">
              No income records for this period.
            </p>
          ) : (
            <div className="space-y-2">
              {(
                Object.entries(incomeByCategory) as [IncomeCategory, number][]
              ).map(([cat, amt]) => (
                <div key={cat} className="flex items-center gap-2 text-xs">
                  <span className="w-24 text-blue-600 shrink-0">
                    {INCOME_CAT_LABELS[cat]}
                  </span>
                  <div className="flex-1 bg-green-50 rounded h-3 overflow-hidden">
                    <div
                      className="h-full bg-green-400 rounded"
                      style={{ width: `${(amt / maxBar) * 100}%` }}
                    />
                  </div>
                  <span className="w-20 text-right font-mono text-blue-900 font-bold">
                    ₹{fmt(amt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white border border-blue-100 rounded-xl p-4">
          <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wide mb-3">
            Expenses by Category
          </h3>
          {Object.keys(expenseByCategory).length === 0 ? (
            <p className="text-blue-400 text-xs">
              No expense records for this period.
            </p>
          ) : (
            <div className="space-y-2">
              {(
                Object.entries(expenseByCategory) as [ExpenseCategory, number][]
              ).map(([cat, amt]) => (
                <div key={cat} className="flex items-center gap-2 text-xs">
                  <span className="w-24 text-blue-600 shrink-0">
                    {EXPENSE_CAT_LABELS[cat]}
                  </span>
                  <div className="flex-1 bg-red-50 rounded h-3 overflow-hidden">
                    <div
                      className="h-full bg-red-400 rounded"
                      style={{ width: `${(amt / maxBar) * 100}%` }}
                    />
                  </div>
                  <span className="w-20 text-right font-mono text-blue-900 font-bold">
                    ₹{fmt(amt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── GST Invoices Tab ───────────────────────────────────── */
function GstTab({
  invoices,
  onAdd,
}: {
  invoices: GstInvoice[];
  onAdd: (
    inv: Omit<GstInvoice, "id" | "invoiceNo" | "gstAmount" | "total">,
  ) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [printInv, setPrintInv] = useState<GstInvoice | null>(null);

  return (
    <div className="space-y-4" data-ocid="finance.gst_section">
      <div className="flex justify-between items-center">
        <p className="text-xs text-blue-500">
          {invoices.length} invoices generated
        </p>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
          data-ocid="finance.generate_invoice_button"
        >
          <Plus className="w-3.5 h-3.5" /> Generate Invoice
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-blue-100">
        <table className="w-full text-xs">
          <thead className="bg-blue-50">
            <tr>
              {[
                "Invoice No",
                "Student Name",
                "Class",
                "Date",
                "Fee (₹)",
                "GST 18% (₹)",
                "Total (₹)",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2.5 text-left text-blue-900 font-semibold uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, i) => (
              <tr
                key={inv.id}
                className="border-t border-blue-50 hover:bg-blue-50/40"
                data-ocid={`finance.gst_item.${i + 1}`}
              >
                <td className="px-3 py-2.5 font-mono text-blue-700 font-semibold">
                  {inv.invoiceNo}
                </td>
                <td className="px-3 py-2.5 text-blue-900 font-medium">
                  {inv.studentName}
                </td>
                <td className="px-3 py-2.5 text-blue-600">{inv.className}</td>
                <td className="px-3 py-2.5 text-blue-600 whitespace-nowrap">
                  {fmtDate(inv.date)}
                </td>
                <td className="px-3 py-2.5 font-mono text-right text-blue-900">
                  ₹{fmt(inv.feeAmount)}
                </td>
                <td className="px-3 py-2.5 font-mono text-right text-orange-600">
                  ₹{fmt(inv.gstAmount)}
                </td>
                <td className="px-3 py-2.5 font-mono text-right font-bold text-blue-900">
                  ₹{fmt(inv.total)}
                </td>
                <td className="px-3 py-2.5">
                  <button
                    type="button"
                    onClick={() => setPrintInv(inv)}
                    className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                    data-ocid={`finance.print_invoice_button.${i + 1}`}
                  >
                    <Printer className="w-3.5 h-3.5" /> Print
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <AddInvoiceModal
          onClose={() => setShowModal(false)}
          onSave={(inv) => {
            onAdd(inv);
            setShowModal(false);
          }}
        />
      )}

      {printInv && (
        <GstInvoicePrintModal
          invoice={printInv}
          onClose={() => setPrintInv(null)}
        />
      )}
    </div>
  );
}

/* ─── Add Invoice Modal ──────────────────────────────────── */
function AddInvoiceModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (
    inv: Omit<GstInvoice, "id" | "invoiceNo" | "gstAmount" | "total">,
  ) => void;
}) {
  const [studentName, setStudentName] = useState("");
  const [className, setClassName] = useState("");
  const [feeAmount, setFeeAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
      data-ocid="finance.invoice_dialog"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-blue-900">Generate GST Invoice</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            data-ocid="finance.invoice_close_button"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label
              htmlFor="invoice-student-name"
              className="text-xs font-semibold text-blue-800 mb-1 block"
            >
              Student Name
            </label>
            <input
              id="invoice-student-name"
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Full name"
              className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm"
              data-ocid="finance.invoice_student_input"
            />
          </div>
          <div>
            <label
              htmlFor="invoice-class"
              className="text-xs font-semibold text-blue-800 mb-1 block"
            >
              Class
            </label>
            <input
              id="invoice-class"
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="e.g. Class 10-A"
              className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm"
              data-ocid="finance.invoice_class_input"
            />
          </div>
          <div>
            <label
              htmlFor="invoice-fee-amount"
              className="text-xs font-semibold text-blue-800 mb-1 block"
            >
              Fee Amount (₹)
            </label>
            <input
              id="invoice-fee-amount"
              type="number"
              value={feeAmount}
              onChange={(e) => setFeeAmount(e.target.value)}
              placeholder="0"
              className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm"
              data-ocid="finance.invoice_amount_input"
            />
          </div>
          <div>
            <label
              htmlFor="invoice-date"
              className="text-xs font-semibold text-blue-800 mb-1 block"
            >
              Date
            </label>
            <input
              id="invoice-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm"
              data-ocid="finance.invoice_date_input"
            />
          </div>
          {feeAmount && (
            <div className="bg-blue-50 rounded-lg p-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span>Fee Amount:</span>
                <span className="font-mono">₹{fmt(Number(feeAmount))}</span>
              </div>
              <div className="flex justify-between">
                <span>CGST (9%):</span>
                <span className="font-mono">
                  ₹{fmt(Math.round(Number(feeAmount) * 0.09))}
                </span>
              </div>
              <div className="flex justify-between">
                <span>SGST (9%):</span>
                <span className="font-mono">
                  ₹{fmt(Math.round(Number(feeAmount) * 0.09))}
                </span>
              </div>
              <div className="flex justify-between font-bold border-t border-blue-200 pt-1 mt-1">
                <span>Total:</span>
                <span className="font-mono text-blue-900">
                  ₹
                  {fmt(
                    Number(feeAmount) + Math.round(Number(feeAmount) * 0.18),
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-blue-200 text-blue-700 text-sm font-semibold"
            data-ocid="finance.invoice_cancel_button"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (studentName && feeAmount) {
                onSave({
                  studentName,
                  className,
                  feeAmount: Number(feeAmount),
                  date,
                });
              }
            }}
            className="flex-1 py-2 rounded-lg bg-blue-700 text-white text-sm font-bold"
            data-ocid="finance.invoice_submit_button"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── GST Invoice Print Modal ────────────────────────────── */
function GstInvoicePrintModal({
  invoice,
  onClose,
}: { invoice: GstInvoice; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4"
      data-ocid="finance.print_dialog"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 space-y-4 print:shadow-none"
        id="gst-invoice-print"
      >
        {/* Letterhead */}
        <div className="text-center border-b-2 border-blue-900 pb-4">
          <h1 className="text-2xl font-bold text-blue-900 font-display">
            SSK PUBLIC SCHOOL
          </h1>
          <p className="text-xs text-blue-500">
            123 Education Lane, Knowledge City — Phone: +91-98765-43210
          </p>
          <p className="text-xs text-blue-500">
            GSTIN: 07AABCS1429B1ZB | Email: info@sskpublicschool.edu.in
          </p>
          <p className="mt-2 text-sm font-bold text-blue-900">TAX INVOICE</p>
        </div>
        {/* Invoice Details */}
        <div className="flex justify-between text-xs">
          <div>
            <p>
              <span className="font-semibold">Invoice No:</span>{" "}
              {invoice.invoiceNo}
            </p>
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {fmtDate(invoice.date)}
            </p>
          </div>
          <div className="text-right">
            <p>
              <span className="font-semibold">Student:</span>{" "}
              {invoice.studentName}
            </p>
            <p>
              <span className="font-semibold">Class:</span> {invoice.className}
            </p>
          </div>
        </div>
        {/* Line Items */}
        <table className="w-full text-xs border border-blue-200 rounded">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-3 py-2 text-left">Description</th>
              <th className="px-3 py-2 text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-blue-100">
              <td className="px-3 py-2">Tuition / School Fee</td>
              <td className="px-3 py-2 text-right font-mono">
                ₹{fmt(invoice.feeAmount)}
              </td>
            </tr>
            <tr className="border-t border-blue-100">
              <td className="px-3 py-2">CGST @ 9%</td>
              <td className="px-3 py-2 text-right font-mono">
                ₹{fmt(Math.round(invoice.feeAmount * 0.09))}
              </td>
            </tr>
            <tr className="border-t border-blue-100">
              <td className="px-3 py-2">SGST @ 9%</td>
              <td className="px-3 py-2 text-right font-mono">
                ₹{fmt(Math.round(invoice.feeAmount * 0.09))}
              </td>
            </tr>
            <tr className="border-t-2 border-blue-900 font-bold">
              <td className="px-3 py-2">Total Amount</td>
              <td className="px-3 py-2 text-right font-mono text-blue-900">
                ₹{fmt(invoice.total)}
              </td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-blue-400 text-center">
          This is a computer-generated invoice. No signature required.
        </p>
        {/* Actions */}
        <div className="flex gap-2 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-blue-200 text-blue-700 text-sm font-semibold"
            data-ocid="finance.print_close_button"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 py-2 rounded-lg bg-blue-700 text-white text-sm font-bold flex items-center justify-center gap-2"
            data-ocid="finance.print_confirm_button"
          >
            <Printer className="w-4 h-4" /> Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
