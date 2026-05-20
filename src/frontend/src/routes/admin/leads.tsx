import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/hooks/useAuth";
import type { LeadStatus } from "@/types/school";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin/leads")({ component: LeadsPage });

interface LeadRow {
  id: string;
  studentName: string;
  parentName: string;
  phone: string;
  classApplied: string;
  source: string;
  status: LeadStatus;
  createdAt: string;
}

const SAMPLE_LEADS: LeadRow[] = [
  {
    id: "1",
    studentName: "Ravi Gupta",
    parentName: "Manoj Gupta",
    phone: "98000-11111",
    classApplied: "Class 9-A",
    source: "Website",
    status: "new",
    createdAt: "19 May 2026",
  },
  {
    id: "2",
    studentName: "Aisha Khan",
    parentName: "Salim Khan",
    phone: "98000-22222",
    classApplied: "Class 6-B",
    source: "WhatsApp",
    status: "contacted",
    createdAt: "18 May 2026",
  },
  {
    id: "3",
    studentName: "Pooja Verma",
    parentName: "Suresh Verma",
    phone: "98000-33333",
    classApplied: "Class 11-A",
    source: "Referral",
    status: "follow_up",
    createdAt: "17 May 2026",
  },
  {
    id: "4",
    studentName: "Ankit Joshi",
    parentName: "Mohan Joshi",
    phone: "98000-44444",
    classApplied: "Class 4-A",
    source: "Website",
    status: "converted",
    createdAt: "15 May 2026",
  },
  {
    id: "5",
    studentName: "Dia Mehta",
    parentName: "Nitin Mehta",
    phone: "98000-55555",
    classApplied: "Class 7-B",
    source: "Walk-in",
    status: "rejected",
    createdAt: "10 May 2026",
  },
];

const statusConfig: Record<LeadStatus, { label: string; color: string }> = {
  new: { label: "New", color: "bg-blue-100 text-blue-700" },
  contacted: { label: "Contacted", color: "bg-yellow-100 text-yellow-700" },
  follow_up: { label: "Follow-up", color: "bg-orange-100 text-orange-700" },
  converted: { label: "Converted", color: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-600" },
};

type FilterValue = LeadStatus | "all";

function LeadsPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [leads] = useState<LeadRow[]>(SAMPLE_LEADS);
  const [filter, setFilter] = useState<FilterValue>("all");

  useEffect(() => {
    if (!isAuthenticated) void navigate({ to: "/login" as never });
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const filtered =
    filter === "all" ? leads : leads.filter((l) => l.status === filter);

  const counts = {
    all: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    follow_up: leads.filter((l) => l.status === "follow_up").length,
    converted: leads.filter((l) => l.status === "converted").length,
    rejected: leads.filter((l) => l.status === "rejected").length,
  };

  const filterButtons: {
    value: FilterValue;
    label: string;
    countKey: FilterValue;
  }[] = [
    { value: "all", label: "All", countKey: "all" },
    { value: "new", label: "New", countKey: "new" },
    { value: "contacted", label: "Contacted", countKey: "contacted" },
    { value: "follow_up", label: "Follow-up", countKey: "follow_up" },
    { value: "converted", label: "Converted", countKey: "converted" },
    { value: "rejected", label: "Rejected", countKey: "rejected" },
  ];

  return (
    <AdminLayout title="Admission Leads">
      <div className="space-y-6" data-ocid="leads.page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-900 font-display">
              Admission Leads
            </h1>
            <p className="text-blue-500 text-sm mt-1">
              {leads.length} total enquiries
            </p>
          </div>
          <button
            type="button"
            className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors flex-shrink-0"
            data-ocid="leads.add_button"
          >
            + Add Lead
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2" data-ocid="leads.filter">
          {filterButtons.map(({ value, label, countKey }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${filter === value ? "bg-blue-900 text-white" : "bg-white border border-blue-200 text-blue-700 hover:bg-blue-50"}`}
              data-ocid={`leads.filter_${value}`}
            >
              {label}{" "}
              <span className="ml-1 opacity-70">({counts[countKey]})</span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div
          className="bg-white rounded-xl border border-blue-100 overflow-hidden shadow-sm"
          data-ocid="leads.table"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-50 border-b border-blue-100">
                <tr>
                  {[
                    "Student",
                    "Parent",
                    "Phone",
                    "Class",
                    "Source",
                    "Status",
                    "Date",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-blue-900 font-semibold text-xs uppercase tracking-wide"
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
                      colSpan={8}
                      className="text-center py-12 text-blue-400"
                      data-ocid="leads.empty_state"
                    >
                      No leads found for this filter.
                    </td>
                  </tr>
                ) : (
                  filtered.map((lead, i) => (
                    <tr
                      key={lead.id}
                      className="border-t border-blue-50 hover:bg-blue-50/50 transition-colors"
                      data-ocid={`leads.item.${i + 1}`}
                    >
                      <td className="px-4 py-3 font-medium text-blue-900">
                        {lead.studentName}
                      </td>
                      <td className="px-4 py-3 text-blue-600">
                        {lead.parentName}
                      </td>
                      <td className="px-4 py-3 text-blue-600">{lead.phone}</td>
                      <td className="px-4 py-3 text-blue-600">
                        {lead.classApplied}
                      </td>
                      <td className="px-4 py-3 text-blue-500 text-xs">
                        {lead.source}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${statusConfig[lead.status].color}`}
                        >
                          {statusConfig[lead.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-blue-400 text-xs">
                        {lead.createdAt}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-900 mr-3 text-xs font-bold"
                          data-ocid={`leads.edit_button.${i + 1}`}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            window.open(
                              `https://wa.me/91${lead.phone.replace(/\D/g, "")}?text=Hello%2C%20regarding%20admission%20enquiry%20for%20${encodeURIComponent(lead.studentName)}%20at%20SSK%20Public%20School`,
                              "_blank",
                              "noopener,noreferrer",
                            )
                          }
                          className="text-green-600 hover:text-green-800 text-xs font-bold"
                          data-ocid={`leads.whatsapp_button.${i + 1}`}
                        >
                          WhatsApp
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
