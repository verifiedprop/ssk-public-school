import { ParentLayout } from "@/components/portals/ParentLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useParentData } from "@/hooks/useParentData";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircle, CheckCircle, CreditCard, Download } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/parent/fees")({ component: ParentFees });

function feeStatusClass(status: string): { color: string; bg: string } {
  if (status === "Paid") return { color: "text-green-700", bg: "bg-green-100" };
  if (status === "Pending")
    return { color: "text-amber-700", bg: "bg-amber-100" };
  if (status === "Partial")
    return { color: "text-blue-700", bg: "bg-blue-100" };
  return { color: "text-red-700", bg: "bg-red-100" };
}

function ParentFees() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { fees, studentInfo, unreadNotices, unreadMessages } = useParentData();

  useEffect(() => {
    if (currentUser && currentUser.role !== "parent")
      navigate({ to: "/login" });
  }, [currentUser, navigate]);

  const totalPaid = fees.reduce((sum, f) => sum + f.paid, 0);
  const totalDue = fees.reduce((sum, f) => sum + f.due, 0);
  const overdueItems = fees.filter((f) => f.status === "Overdue");

  return (
    <ParentLayout unreadNotices={unreadNotices} unreadMessages={unreadMessages}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Fees & Receipts
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Rahul Sharma · Class 10-A · Academic Year 2025–26
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div
            data-ocid="parent.fees.total_paid"
            className="bg-green-50 rounded-xl border border-border p-4 border-l-4 border-l-green-500"
          >
            <p className="text-xs text-muted-foreground mb-1">Total Paid</p>
            <p className="text-2xl font-bold text-green-700">
              &#x20b9;{totalPaid.toLocaleString()}
            </p>
          </div>
          <div
            data-ocid="parent.fees.total_due"
            className="bg-red-50 rounded-xl border border-border p-4 border-l-4 border-l-red-500"
          >
            <p className="text-xs text-muted-foreground mb-1">Total Due</p>
            <p className="text-2xl font-bold text-red-700">
              &#x20b9;{totalDue.toLocaleString()}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-card rounded-xl border border-border p-4 border-l-4 border-l-amber-500">
            <p className="text-xs text-muted-foreground mb-1">
              Annual Fee Paid
            </p>
            <p className="text-2xl font-bold text-foreground">
              &#x20b9;{studentInfo.totalFeesPaid.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Overdue Alert */}
        {overdueItems.length > 0 && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <AlertCircle
              size={18}
              className="text-red-600 flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="text-sm font-semibold text-red-800">
                Overdue Payment Notice
              </p>
              <p className="text-xs text-red-700 mt-0.5">
                {overdueItems.length} payment
                {overdueItems.length > 1 ? "s are" : " is"} overdue. Students
                with dues exceeding 30 days may not be allowed in examinations.
              </p>
            </div>
          </div>
        )}

        {/* Fee Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Fee Statement</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                    Month / Type
                  </th>
                  <th className="text-right px-5 py-3 text-muted-foreground font-medium">
                    Amount
                  </th>
                  <th className="text-right px-5 py-3 text-muted-foreground font-medium">
                    Paid
                  </th>
                  <th className="text-right px-5 py-3 text-muted-foreground font-medium">
                    Due
                  </th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                    Due Date
                  </th>
                  <th className="text-center px-5 py-3 text-muted-foreground font-medium">
                    Receipt
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {fees.map((fee, i) => {
                  const cfg = feeStatusClass(fee.status);
                  return (
                    <tr
                      key={fee.id}
                      data-ocid={`parent.fees.item.${i + 1}`}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <p className="font-medium text-foreground">
                          {fee.month}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {fee.type}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-right font-medium text-foreground">
                        &#x20b9;{fee.amount.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-right text-green-700">
                        &#x20b9;{fee.paid.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-right font-semibold">
                        <span
                          className={
                            fee.due > 0 ? "text-red-600" : "text-green-600"
                          }
                        >
                          &#x20b9;{fee.due.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}
                        >
                          {fee.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {fee.dueDate}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {fee.receiptNo ? (
                          <button
                            type="button"
                            data-ocid={`parent.fees.download_receipt.${i + 1}`}
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                            onClick={() => window.print()}
                          >
                            <Download size={13} />
                            {fee.receiptNo}
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pay Now CTA */}
        {totalDue > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle
                size={20}
                className="text-amber-600 flex-shrink-0 mt-0.5"
              />
              <div>
                <p className="font-semibold text-amber-900">
                  Clear Your Dues Today
                </p>
                <p className="text-xs text-amber-800 mt-0.5">
                  Pay &#x20b9;{totalDue.toLocaleString()} to avoid exam
                  restrictions. Visit school accounts office or use online
                  portal.
                </p>
              </div>
            </div>
            <Button
              data-ocid="parent.fees.pay_now_button"
              className="bg-amber-500 hover:bg-amber-600 text-blue-950 font-semibold shrink-0"
            >
              <CreditCard size={16} className="mr-2" />
              Pay Now
            </Button>
          </div>
        )}
      </div>
    </ParentLayout>
  );
}
