import TeacherLayout from "@/components/portals/TeacherLayout";
import { useAuth } from "@/hooks/useAuth";
import { useTeacherData } from "@/hooks/useTeacherData";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/teacher/homework")({
  component: HomeworkPage,
});

const INITIAL_FORM = {
  subject: "",
  class: "",
  title: "",
  description: "",
  dueDate: "",
};

function HomeworkPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { homework, addHomework, availableClasses, availableSubjects } =
    useTeacherData();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<typeof INITIAL_FORM>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!currentUser || currentUser.role !== "teacher")
      void navigate({ to: "/login" as never });
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const validate = () => {
    const e: Partial<typeof INITIAL_FORM> = {};
    if (!form.subject) e.subject = "Required";
    if (!form.class) e.class = "Required";
    if (!form.title) e.title = "Required";
    if (!form.dueDate) e.dueDate = "Required";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    addHomework({
      subject: form.subject,
      class: form.class,
      title: form.title,
      description: form.description,
      dueDate: form.dueDate,
      totalStudents: 42,
    });
    setForm(INITIAL_FORM);
    setErrors({});
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const set =
    (field: keyof typeof INITIAL_FORM) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  return (
    <TeacherLayout title="Homework">
      <div className="space-y-6 max-w-4xl" data-ocid="teacher.homework.page">
        {submitted && (
          <div
            className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm font-medium"
            data-ocid="teacher.homework.success_state"
          >
            ✅ Homework assignment added successfully!
          </div>
        )}

        {/* Create Form */}
        <div
          className="bg-white rounded-xl border border-blue-100 shadow-sm p-6"
          data-ocid="teacher.homework.form"
        >
          <h2 className="font-bold text-[#1e3a5f] text-lg mb-5 flex items-center gap-2">
            <Plus className="h-5 w-5 text-amber-500" /> Create New Assignment
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="hw-subject"
                  className="block text-xs font-semibold text-gray-600 mb-1"
                >
                  Subject *
                </label>
                <select
                  id="hw-subject"
                  value={form.subject}
                  onChange={set("subject")}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  data-ocid="teacher.homework.subject_select"
                >
                  <option value="">Select subject</option>
                  {availableSubjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.subject && (
                  <p
                    className="text-xs text-red-500 mt-1"
                    data-ocid="teacher.homework.subject.field_error"
                  >
                    {errors.subject}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="hw-class"
                  className="block text-xs font-semibold text-gray-600 mb-1"
                >
                  Class *
                </label>
                <select
                  id="hw-class"
                  value={form.class}
                  onChange={set("class")}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  data-ocid="teacher.homework.class_select"
                >
                  <option value="">Select class</option>
                  {availableClasses.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.class && (
                  <p
                    className="text-xs text-red-500 mt-1"
                    data-ocid="teacher.homework.class.field_error"
                  >
                    {errors.class}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="hw-title"
                className="block text-xs font-semibold text-gray-600 mb-1"
              >
                Assignment Title *
              </label>
              <input
                id="hw-title"
                type="text"
                value={form.title}
                onChange={set("title")}
                placeholder="e.g. Chapter 4 Exercise Set"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                data-ocid="teacher.homework.title_input"
              />
              {errors.title && (
                <p
                  className="text-xs text-red-500 mt-1"
                  data-ocid="teacher.homework.title.field_error"
                >
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="hw-desc"
                className="block text-xs font-semibold text-gray-600 mb-1"
              >
                Description
              </label>
              <textarea
                id="hw-desc"
                value={form.description}
                onChange={set("description")}
                rows={3}
                placeholder="Instructions for students..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                data-ocid="teacher.homework.description_textarea"
              />
            </div>

            <div className="sm:w-48">
              <label
                htmlFor="hw-due"
                className="block text-xs font-semibold text-gray-600 mb-1"
              >
                Due Date *
              </label>
              <input
                id="hw-due"
                type="date"
                value={form.dueDate}
                onChange={set("dueDate")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                data-ocid="teacher.homework.due_date_input"
              />
              {errors.dueDate && (
                <p
                  className="text-xs text-red-500 mt-1"
                  data-ocid="teacher.homework.due_date.field_error"
                >
                  {errors.dueDate}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-[#1e3a5f] hover:bg-[#15304f] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                data-ocid="teacher.homework.submit_button"
              >
                Add Assignment
              </button>
            </div>
          </form>
        </div>

        {/* List */}
        <div
          className="bg-white rounded-xl border border-blue-100 shadow-sm"
          data-ocid="teacher.homework.list"
        >
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-[#1e3a5f]">
              Uploaded Assignments ({homework.length})
            </h2>
          </div>
          {homework.length === 0 ? (
            <div
              className="p-12 text-center"
              data-ocid="teacher.homework.empty_state"
            >
              <p className="text-gray-400 text-sm">
                No assignments yet. Create one above.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {homework.map((hw, i) => (
                <div
                  key={hw.id}
                  className="p-5 hover:bg-blue-50/30 transition-colors"
                  data-ocid={`teacher.homework.item.${i + 1}`}
                >
                  <div className="flex flex-wrap items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-[#1e3a5f] text-sm">
                          {hw.title}
                        </span>
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                          {hw.subject}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          {hw.class}
                        </span>
                      </div>
                      {hw.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {hw.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs text-gray-500">
                        Due:{" "}
                        <span className="font-medium text-red-500">
                          {hw.dueDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 justify-end mt-1 text-xs text-gray-500">
                        <Users className="h-3 w-3" /> {hw.submittedCount}/
                        {hw.totalStudents} submitted
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
}
