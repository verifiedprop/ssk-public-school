import { SchoolLayout } from "@/components/layout/SchoolLayout";
import { SEOHead } from "@/components/ui/SEOHead";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/contact")({ component: ContactPage });

const contactInfo = [
  {
    icon: "📍",
    title: "Address",
    detail: "123, School Road, Sector 15, New Delhi – 110001",
    sub: "Near Metro Station",
  },
  {
    icon: "📞",
    title: "Phone",
    detail: "+91-99999-99999",
    sub: "Mon–Sat: 8 AM – 5 PM",
  },
  {
    icon: "✉️",
    title: "Email",
    detail: "info@sskschool.edu.in",
    sub: "We reply within 24 hours",
  },
  {
    icon: "💬",
    title: "WhatsApp",
    detail: "+91-99999-99999",
    sub: "Quick admission enquiries",
  },
];

function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Full name is required.";
    const digits = form.phone.replace(/\D/g, "");
    if (!digits) errs.phone = "Phone number is required.";
    else if (digits.length !== 10)
      errs.phone = "Phone must be exactly 10 digits.";
    if (form.email && !form.email.includes("@"))
      errs.email = "Enter a valid email address.";
    if (!form.message.trim()) errs.message = "Message is required.";
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
        title="Contact SSK Public School | Admissions Enquiry"
        description="Contact SSK Public School — address, phone, email, WhatsApp, and admission enquiry form. Visit our campus in New Delhi."
        canonical="https://sskpublicschool.edu.in/contact"
        keywords="SSK school contact, admission enquiry, school address, school phone"
      />

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-yellow-500/20 text-yellow-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
            Contact Us
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
            Get in Touch
          </h1>
          <p className="text-blue-200 text-lg">
            We'd love to hear from you. Reach out for admissions, queries, or to
            book a campus visit.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-4 bg-white" data-ocid="contact_info.section">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map(({ icon, title, detail, sub }, i) => (
              <div
                key={title}
                className="text-center bg-blue-50 rounded-2xl p-6 border border-blue-100"
                data-ocid={`contact_info.item.${i + 1}`}
              >
                <div className="text-4xl mb-3">{icon}</div>
                <h3 className="font-bold text-blue-900 font-display mb-2">
                  {title}
                </h3>
                <p className="text-blue-800 font-medium text-sm">{detail}</p>
                <p className="text-blue-500 text-xs mt-1">{sub}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Map */}
            <div>
              <h2 className="text-2xl font-bold text-blue-900 font-display mb-6">
                Find Us on the Map
              </h2>
              <div className="rounded-2xl overflow-hidden border border-blue-100 shadow-sm h-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83923192776!2d77.06889754725782!3d28.52758200617607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1716163200000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="SSK Public School Location"
                />
              </div>
              <div className="mt-4 flex gap-3">
                <a
                  href="https://wa.me/919999999999?text=I%20would%20like%20to%20visit%20SSK%20Public%20School"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-colors text-sm"
                  data-ocid="contact.whatsapp_button"
                >
                  📱 WhatsApp Us
                </a>
                <a
                  href="tel:+919999999999"
                  className="flex-1 text-center bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition-colors text-sm"
                  data-ocid="contact.call_button"
                >
                  📞 Call Us
                </a>
              </div>
            </div>

            {/* Form */}
            <div>
              <h2 className="text-2xl font-bold text-blue-900 font-display mb-6">
                Send Us a Message
              </h2>
              {submitted ? (
                <div
                  className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
                  data-ocid="contact.success_state"
                >
                  <div className="text-4xl mb-3">✅</div>
                  <h3 className="text-xl font-bold text-green-800 font-display mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-green-700 text-sm">
                    Thank you for reaching out. We'll respond within 24 hours.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  data-ocid="contact.form"
                >
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-sm font-medium text-blue-900 mb-1.5"
                    >
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="w-full border border-blue-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Your full name"
                      data-ocid="contact.name_input"
                    />
                    {errors.name && (
                      <p
                        className="text-red-500 text-xs mt-1"
                        data-ocid="contact.name_field_error"
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="block text-sm font-medium text-blue-900 mb-1.5"
                      >
                        Phone *
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, phone: e.target.value }))
                        }
                        className="w-full border border-blue-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="+91 XXXXX XXXXX"
                        data-ocid="contact.phone_input"
                      />
                      {errors.phone && (
                        <p
                          className="text-red-500 text-xs mt-1"
                          data-ocid="contact.phone_field_error"
                        >
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-sm font-medium text-blue-900 mb-1.5"
                      >
                        Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, email: e.target.value }))
                        }
                        className="w-full border border-blue-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="email@example.com"
                        data-ocid="contact.email_input"
                      />
                      {errors.email && (
                        <p
                          className="text-red-500 text-xs mt-1"
                          data-ocid="contact.email_field_error"
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-sm font-medium text-blue-900 mb-1.5"
                    >
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      value={form.message}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, message: e.target.value }))
                      }
                      className="w-full border border-blue-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                      rows={4}
                      placeholder="Your message or admission enquiry..."
                      data-ocid="contact.message_textarea"
                    />
                    {errors.message && (
                      <p
                        className="text-red-500 text-xs mt-1"
                        data-ocid="contact.message_field_error"
                      >
                        {errors.message}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-colors"
                    data-ocid="contact.submit_button"
                  >
                    Send Message →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </SchoolLayout>
  );
}
