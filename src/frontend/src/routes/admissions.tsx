import { SchoolLayout } from "@/components/layout/SchoolLayout";
import { SEOHead } from "@/components/ui/SEOHead";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/admissions")({
  component: AdmissionsPage,
});

const steps = [
  {
    num: "01",
    title: "Fill Online Form",
    desc: "Complete the admission enquiry form with student and parent details.",
  },
  {
    num: "02",
    title: "Document Submission",
    desc: "Submit required documents: birth certificate, previous school reports, ID proof.",
  },
  {
    num: "03",
    title: "Interaction Session",
    desc: "Attend a brief interaction session with the student and parents.",
  },
  {
    num: "04",
    title: "Admission Confirmation",
    desc: "Receive admission offer, pay fees, and complete enrolment formalities.",
  },
];

const classes = [
  "Nursery",
  "LKG",
  "UKG",
  "Class 4-A",
  "Class 4-B",
  "Class 5-A",
  "Class 5-B",
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

function AdmissionsPage() {
  const [form, setForm] = useState({
    studentName: "",
    parentName: "",
    phone: "",
    email: "",
    classApplied: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.studentName.trim())
      errs.studentName = "Student name is required.";
    if (!form.parentName.trim()) errs.parentName = "Parent name is required.";
    const digits = form.phone.replace(/\D/g, "");
    if (!digits) errs.phone = "Phone number is required.";
    else if (digits.length !== 10)
      errs.phone = "Phone must be exactly 10 digits.";
    if (form.email && !form.email.includes("@"))
      errs.email = "Enter a valid email address.";
    if (!form.classApplied) errs.classApplied = "Please select a class.";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  return (
    <SchoolLayout>
      <SEOHead
        title="Admissions 2026-27 | SSK Public School"
        description="Apply for admission at SSK Public School for the 2026-27 academic year. Online admission form, process details, and fee structure."
        canonical="https://sskpublicschool.edu.in/admissions"
        keywords="SSK school admissions 2026, school admission form, CBSE school admission"
      />

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-yellow-500 text-blue-950 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
            Admissions Open
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
            Admissions 2026-27
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto mb-8">
            Secure your child's future at SSK Public School. Limited seats
            available for all classes from Nursery to Class 12.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#admission-form"
              className="inline-block bg-yellow-500 hover:bg-yellow-400 text-blue-950 font-bold px-8 py-3.5 rounded-xl transition-colors"
              data-ocid="admissions.apply_button"
            >
              Apply Now
            </a>
            <a
              href="https://wa.me/919999999999?text=Hello%2C%20I%20am%20interested%20in%20admission%20at%20SSK%20Public%20School"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-3.5 rounded-xl transition-colors"
              data-ocid="admissions.whatsapp_button"
            >
              📱 WhatsApp Enquiry
            </a>
          </div>
        </div>
      </section>

      {/* Admission Process */}
      <section className="py-16 px-4 bg-white" data-ocid="process.section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
              How To Apply
            </span>
            <h2 className="text-3xl font-bold text-blue-950 font-display">
              Simple 4-Step Admission Process
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ num, title, desc }, i) => (
              <div
                key={num}
                className="text-center"
                data-ocid={`process.step.${i + 1}`}
              >
                <div className="w-16 h-16 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xl font-display mx-auto mb-4">
                  {num}
                </div>
                <h3 className="font-bold text-blue-900 font-display mb-2">
                  {title}
                </h3>
                <p className="text-blue-600 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admission Form */}
      <section
        id="admission-form"
        className="py-16 px-4 bg-blue-50"
        data-ocid="form.section"
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-blue-950 font-display">
              Online Admission Enquiry
            </h2>
            <p className="text-blue-600 mt-2">
              Fill the form below and our team will contact you within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div
              className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center"
              data-ocid="form.success_state"
            >
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-green-800 font-display mb-2">
                Enquiry Submitted!
              </h3>
              <p className="text-green-700 mb-4">
                Thank you! Our admission team will contact you on WhatsApp
                within 24 hours.
              </p>
              <p className="text-green-600 text-sm">
                Your enquiry reference will be sent via SMS to the provided
                phone number.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-8 shadow-sm border border-blue-100 space-y-5"
              data-ocid="admission.form"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="adm-student-name"
                    className="block text-sm font-medium text-blue-900 mb-1.5"
                  >
                    Student Name *
                  </label>
                  <input
                    id="adm-student-name"
                    type="text"
                    value={form.studentName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, studentName: e.target.value }))
                    }
                    className="w-full border border-blue-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Student's full name"
                    data-ocid="form.student_name_input"
                  />
                  {errors.studentName && (
                    <p
                      className="text-red-500 text-xs mt-1"
                      data-ocid="form.student_name_field_error"
                    >
                      {errors.studentName}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="adm-parent-name"
                    className="block text-sm font-medium text-blue-900 mb-1.5"
                  >
                    Parent / Guardian Name *
                  </label>
                  <input
                    id="adm-parent-name"
                    type="text"
                    value={form.parentName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, parentName: e.target.value }))
                    }
                    className="w-full border border-blue-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Parent's full name"
                    data-ocid="form.parent_name_input"
                  />
                  {errors.parentName && (
                    <p
                      className="text-red-500 text-xs mt-1"
                      data-ocid="form.parent_name_field_error"
                    >
                      {errors.parentName}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="adm-phone"
                    className="block text-sm font-medium text-blue-900 mb-1.5"
                  >
                    Phone Number *
                  </label>
                  <input
                    id="adm-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    className="w-full border border-blue-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="+91 XXXXX XXXXX"
                    data-ocid="form.phone_input"
                  />
                  {errors.phone && (
                    <p
                      className="text-red-500 text-xs mt-1"
                      data-ocid="form.phone_field_error"
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="adm-email"
                    className="block text-sm font-medium text-blue-900 mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="adm-email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className="w-full border border-blue-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="email@example.com"
                    data-ocid="form.email_input"
                  />
                  {errors.email && (
                    <p
                      className="text-red-500 text-xs mt-1"
                      data-ocid="form.email_field_error"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="adm-class"
                  className="block text-sm font-medium text-blue-900 mb-1.5"
                >
                  Class Applying For *
                </label>
                <select
                  id="adm-class"
                  value={form.classApplied}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, classApplied: e.target.value }))
                  }
                  className="w-full border border-blue-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  data-ocid="form.class_select"
                >
                  <option value="">Select class</option>
                  {classes.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.classApplied && (
                  <p
                    className="text-red-500 text-xs mt-1"
                    data-ocid="form.class_field_error"
                  >
                    {errors.classApplied}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="adm-message"
                  className="block text-sm font-medium text-blue-900 mb-1.5"
                >
                  Message / Query
                </label>
                <textarea
                  id="adm-message"
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  className="w-full border border-blue-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                  rows={3}
                  placeholder="Any specific questions about admission, facilities, or curriculum?"
                  data-ocid="form.message_textarea"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-blue-950 font-bold py-3.5 rounded-xl transition-colors text-base"
                data-ocid="form.submit_button"
              >
                Submit Admission Enquiry →
              </button>
              <p className="text-center text-xs text-blue-400">
                📱 Our team will respond on WhatsApp within 24 hours
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Fee Structure Download */}
      <section className="py-12 px-4 bg-white" data-ocid="fee.section">
        <div className="max-w-4xl mx-auto">
          <div className="bg-blue-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold font-display mb-2">
                Download Fee Structure 2026-27
              </h3>
              <p className="text-blue-200 text-sm">
                Complete class-wise fee details including tuition, transport,
                and activity fees.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button
                type="button"
                className="inline-block bg-yellow-500 hover:bg-yellow-400 text-blue-950 font-bold px-6 py-3 rounded-xl transition-colors text-sm"
                data-ocid="fee.download_button"
              >
                📥 Download PDF
              </button>
              <a
                href="https://wa.me/919999999999?text=Please%20send%20fee%20structure%20for%20SSK%20Public%20School"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
                data-ocid="fee.whatsapp_button"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </SchoolLayout>
  );
}
