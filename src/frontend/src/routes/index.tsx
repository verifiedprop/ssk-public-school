import { SchoolLayout } from "@/components/layout/SchoolLayout";
import { SEOHead } from "@/components/ui/SEOHead";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: HomePage });

const stats = [
  { val: "1500+", label: "Students Enrolled" },
  { val: "50+", label: "Expert Faculty" },
  { val: "25+", label: "Years Excellence" },
  { val: "100%", label: "Board Results" },
];

const features = [
  {
    title: "Smart Classrooms",
    desc: "State-of-the-art digital classrooms with interactive boards and modern learning tools for an immersive educational experience.",
  },
  {
    title: "Expert Faculty",
    desc: "Highly qualified and experienced teachers dedicated to nurturing every student's potential and ensuring academic excellence.",
  },
  {
    title: "Holistic Development",
    desc: "Sports, arts, music, and extracurricular activities for all-round growth beyond academics.",
  },
  {
    title: "CBSE Curriculum",
    desc: "Rigorous CBSE-affiliated education from Nursery to Class 12 with focus on conceptual understanding.",
  },
  {
    title: "Safe Campus",
    desc: "24/7 CCTV surveillance, secure entry points, and a nurturing environment for every child.",
  },
  {
    title: "Digital Labs",
    desc: "Cutting-edge computer, science, and language labs equipped with the latest technology.",
  },
];

const testimonials = [
  {
    name: "Rajesh Sharma",
    role: "Parent of Class 10 Student",
    quote:
      "SSK Public School has transformed my child's academic journey. The teachers are exceptional and the facilities are world-class.",
  },
  {
    name: "Priya Mehta",
    role: "Parent of Class 7 Student",
    quote:
      "The holistic approach to education at SSK is truly commendable. My daughter has grown not just academically but as a person.",
  },
  {
    name: "Arjun Kapoor",
    role: "Alumnus, Class of 2022",
    quote:
      "SSK gave me the foundation to crack IIT entrance. The science labs and dedicated faculty made all the difference.",
  },
];

function HomePage() {
  return (
    <SchoolLayout>
      <SEOHead
        title="SSK Public School | Excellence in Education Since 2001"
        description="SSK Public School offers world-class K-12 CBSE education with smart classrooms, expert faculty, and holistic development. Admissions open 2026-27."
        canonical="https://sskpublicschool.edu.in/"
        keywords="SSK Public School, CBSE school, K-12 education, admissions 2026"
      />

      {/* Hero Section */}
      <section
        className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white overflow-hidden"
        data-ocid="hero.section"
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, oklch(0.62 0.22 65) 0%, transparent 50%), radial-gradient(circle at 80% 20%, oklch(0.65 0.15 240) 0%, transparent 40%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="inline-block bg-yellow-500 text-blue-950 text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
              Admissions Open 2026-27
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-5 font-display leading-tight">
              SSK Public School
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 mb-3 font-display">
              Excellence in Education Since 2001
            </p>
            <p className="text-blue-300 text-lg max-w-2xl mb-10 leading-relaxed">
              Nurturing young minds with world-class CBSE education, modern
              infrastructure, and holistic development programmes for a bright
              future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/admissions"
                className="inline-block bg-yellow-500 hover:bg-yellow-400 text-blue-950 font-bold px-8 py-3.5 rounded-xl transition-colors text-center shadow-lg"
                data-ocid="hero.apply_button"
              >
                Apply Now →
              </a>
              <a
                href="/about"
                className="inline-block border-2 border-white/60 text-white hover:bg-white hover:text-blue-900 font-bold px-8 py-3.5 rounded-xl transition-colors text-center"
                data-ocid="hero.learn_more_button"
              >
                Explore School
              </a>
              <a
                href="#contact"
                className="inline-block border-2 border-yellow-500/60 text-yellow-400 hover:bg-yellow-500 hover:text-blue-950 font-bold px-8 py-3.5 rounded-xl transition-colors text-center"
                data-ocid="hero.contact_button"
              >
                Book Campus Visit
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section
        className="bg-blue-900 text-white py-10"
        data-ocid="stats.section"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-4 text-center">
          {stats.map(({ val, label }) => (
            <div key={label}>
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 font-display">
                {val}
              </div>
              <div className="text-blue-200 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-white" data-ocid="features.section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
              Why Choose SSK
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-950 font-display">
              A School That Shapes Futures
            </h2>
            <p className="text-blue-700 mt-3 max-w-xl mx-auto">
              We provide an environment where every student is empowered to
              achieve their highest potential.
            </p>
          </div>
          <div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="features.list"
          >
            {features.map(({ title, desc }, i) => (
              <div
                key={title}
                className="border-l-4 border-blue-700 bg-blue-50/60 p-6 rounded-r-xl hover:shadow-lg transition-shadow"
                data-ocid={`features.item.${i + 1}`}
              >
                <h3 className="text-lg font-bold text-blue-900 mb-2 font-display">
                  {title}
                </h3>
                <p className="text-blue-700 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        className="py-16 px-4 bg-blue-50"
        data-ocid="testimonials.section"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
              Testimonials
            </span>
            <h2 className="text-3xl font-bold text-blue-950 font-display">
              What Our Community Says
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, quote }, i) => (
              <div
                key={name}
                className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100"
                data-ocid={`testimonials.item.${i + 1}`}
              >
                <div className="text-yellow-500 text-2xl mb-3">❝</div>
                <p className="text-blue-800 text-sm leading-relaxed mb-4 italic">
                  {quote}
                </p>
                <div className="border-t border-blue-100 pt-4">
                  <div className="font-bold text-blue-900 text-sm">{name}</div>
                  <div className="text-blue-500 text-xs">{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ERP Section */}
      <section className="py-16 px-4 bg-white" data-ocid="erp.section">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-3xl p-8 md:p-12 text-white">
            <div className="max-w-2xl">
              <span className="inline-block bg-yellow-500/20 text-yellow-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
                Our ERP Dashboard
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                Integrated School Management
              </h2>
              <p className="text-blue-200 text-lg mb-8 leading-relaxed">
                Seamlessly manage admissions, fees, attendance, exams, and
                parent communication through our modern ERP portal.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  ["👨‍👩‍👧", "Parent Portal", "Track progress & communicate"],
                  ["📊", "Student Tracking", "Real-time performance data"],
                  ["⚙️", "Admin Efficiency", "Streamlined school operations"],
                ].map(([icon, title, desc]) => (
                  <div key={title} className="text-center">
                    <div className="text-3xl mb-2">{icon}</div>
                    <div className="font-bold text-sm text-white">{title}</div>
                    <div className="text-blue-300 text-xs mt-1">{desc}</div>
                  </div>
                ))}
              </div>
              <a
                href="/login"
                className="inline-block bg-yellow-500 hover:bg-yellow-400 text-blue-950 font-bold px-8 py-3.5 rounded-xl transition-colors"
                data-ocid="erp.login_button"
              >
                Access ERP Portal →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="contact"
        className="bg-yellow-500 py-14 px-4 text-center"
        data-ocid="cta.section"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4 font-display">
          Begin Your Child's Journey
        </h2>
        <p className="text-blue-800 mb-8 max-w-xl mx-auto text-lg">
          Join the SSK family. Give your child the education, values, and
          opportunities they deserve.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/admissions"
            className="inline-block bg-blue-900 hover:bg-blue-800 text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-lg"
            data-ocid="cta.apply_button"
          >
            Apply for Admission
          </a>
          <a
            href="/contact"
            className="inline-block border-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white font-bold px-8 py-3.5 rounded-xl transition-colors"
            data-ocid="cta.contact_button"
          >
            Contact Us
          </a>
        </div>
      </section>
    </SchoolLayout>
  );
}
