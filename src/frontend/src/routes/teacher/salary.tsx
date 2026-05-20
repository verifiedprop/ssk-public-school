import TeacherLayout from "@/components/portals/TeacherLayout";
import { useAuth } from "@/hooks/useAuth";
import { type SalarySlip, useTeacherData } from "@/hooks/useTeacherData";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Printer } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/teacher/salary")({
  component: SalaryPage,
});

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function PrintableSlip({ slip, name }: { slip: SalarySlip; name: string }) {
  return (
    <div
      id={`slip-${slip.id}`}
      className="hidden print:block text-xs font-mono p-8 max-w-xl mx-auto"
    >
      <div className="text-center mb-4">
        <div className="font-bold text-lg">SSK Public School</div>
        <div>
          Salary Slip — {slip.month} {slip.year}
        </div>
        <div className="mt-1">Employee: {name}</div>
      </div>
      <div className="border-t border-b py-3 space-y-1">
        <div className="flex justify-between">
          <span>Basic Pay</span>
          <span>{fmt(slip.basicPay)}</span>
        </div>
        <div className="flex justify-between">
          <span>HRA</span>
          <span>{fmt(slip.hra)}</span>
        </div>
        <div className="flex justify-between">
          <span>DA</span>
          <span>{fmt(slip.da)}</span>
        </div>
        <div className="flex justify-between">
          <span>Medical Allowance</span>
          <span>{fmt(slip.medicalAllowance)}</span>
        </div>
        <div className="flex justify-between">
          <span>Travel Allowance</span>
          <span>{fmt(slip.travelAllowance)}</span>
        </div>
        <div className="flex justify-between text-red-600">
          <span>PF Deduction</span>
          <span>-{fmt(slip.deductionPF)}</span>
        </div>
        <div className="flex justify-between text-red-600">
          <span>Tax Deduction</span>
          <span>-{fmt(slip.deductionTax)}</span>
        </div>
      </div>
      <div className="flex justify-between font-bold pt-3">
        <span>Net Pay</span>
        <span>{fmt(slip.netPay)}</span>
      </div>
      <div className="mt-4 text-center text-gray-400">
        {slip.status === "paid" ? `Paid on: ${slip.paidOn}` : "Status: Pending"}
      </div>
    </div>
  );
}

function SalaryPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { salarySlips } = useTeacherData();

  useEffect(() => {
    if (!currentUser || currentUser.role !== "teacher")
      void navigate({ to: "/login" as never });
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const handlePrint = (slipId: string) => {
    window.print();
    // Show the specific slip element only during print (CSS handles this)
    void slipId;
  };

  const ytdNet = salarySlips
    .filter((s) => s.status === "paid")
    .reduce((sum, s) => sum + s.netPay, 0);

  return (
    <TeacherLayout title="Salary Slips">
      {/* Print-only slips */}
      {salarySlips.map((slip) => (
        <PrintableSlip key={slip.id} slip={slip} name={currentUser.name} />
      ))}

      <div className="space-y-6" data-ocid="teacher.salary.page">
        {/* Summary */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border-l-4 border-green-500 shadow-sm p-5">
            <div className="text-xs text-gray-500 mb-1">YTD Net Earnings</div>
            <div className="text-2xl font-bold text-green-700">
              {fmt(ytdNet)}
            </div>
          </div>
          <div className="bg-white rounded-xl border-l-4 border-amber-500 shadow-sm p-5">
            <div className="text-xs text-gray-500 mb-1">
              Current Month Basic
            </div>
            <div className="text-2xl font-bold text-amber-700">
              {fmt(salarySlips[0]?.basicPay ?? 0)}
            </div>
          </div>
          <div className="bg-white rounded-xl border-l-4 border-blue-500 shadow-sm p-5">
            <div className="text-xs text-gray-500 mb-1">Slips Available</div>
            <div className="text-2xl font-bold text-blue-700">
              {salarySlips.length}
            </div>
          </div>
        </div>

        {/* Slips Table */}
        <div
          className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden"
          data-ocid="teacher.salary.list"
        >
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-[#1e3a5f]">Monthly Salary Slips</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-50 text-gray-600">
                  <th className="text-left px-5 py-3 font-semibold">Month</th>
                  <th className="text-right px-4 py-3 font-semibold">Basic</th>
                  <th className="text-right px-4 py-3 font-semibold">HRA</th>
                  <th className="text-right px-4 py-3 font-semibold">DA</th>
                  <th className="text-right px-4 py-3 font-semibold">
                    Deductions
                  </th>
                  <th className="text-right px-4 py-3 font-semibold">
                    Net Pay
                  </th>
                  <th className="text-center px-4 py-3 font-semibold">
                    Status
                  </th>
                  <th className="text-center px-4 py-3 font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {salarySlips.map((slip, i) => (
                  <tr
                    key={slip.id}
                    className="hover:bg-blue-50/20"
                    data-ocid={`teacher.salary.item.${i + 1}`}
                  >
                    <td className="px-5 py-3 font-medium text-[#1e3a5f]">
                      {slip.month} {slip.year}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {fmt(slip.basicPay)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {fmt(slip.hra)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {fmt(slip.da)}
                    </td>
                    <td className="px-4 py-3 text-right text-red-500">
                      -{fmt(slip.deductionPF + slip.deductionTax)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-green-700">
                      {fmt(slip.netPay)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          slip.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {slip.status === "paid" ? "Paid" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handlePrint(slip.id)}
                        className="flex items-center gap-1.5 mx-auto text-xs font-semibold bg-[#1e3a5f] hover:bg-[#15304f] text-white px-3 py-1.5 rounded-lg transition-colors"
                        data-ocid={`teacher.salary.print_button.${i + 1}`}
                      >
                        <Printer className="h-3.5 w-3.5" /> Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
