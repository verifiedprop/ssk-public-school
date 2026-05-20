import { SchoolLayout } from "@/components/layout/SchoolLayout";
import { SEOHead } from "@/components/ui/SEOHead";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/facilities")({
  component: FacilitiesPage,
});

const facilities = [
  {
    icon: "🖥️",
    title: "Smart Classrooms",
    desc: "Every classroom is equipped with interactive digital boards, HD projectors, and high-speed internet. Our teachers use multimedia content to make learning engaging and effective.",
    features: [
      "Interactive digital boards",
      "Multimedia projectors",
      "Online resource access",
      "Air-conditioned rooms",
    ],
    color: "blue",
  },
  {
    icon: "💻",
    title: "Computer Lab",
    desc: "State-of-the-art computer lab with 60+ high-performance computers, broadband connectivity, and the latest software for programming, design, and digital literacy.",
    features: [
      "60+ computers",
      "High-speed internet",
      "Programming software",
      "Digital literacy programs",
    ],
    color: "indigo",
  },
  {
    icon: "🔬",
    title: "Science Labs",
    desc: "Separate, fully-equipped Physics, Chemistry, and Biology laboratories. Students conduct real experiments that reinforce classroom learning and spark scientific curiosity.",
    features: [
      "Physics lab",
      "Chemistry lab",
      "Biology lab",
      "Safety equipment",
    ],
    color: "blue",
  },
  {
    icon: "📚",
    title: "Library",
    desc: "A comprehensive library with over 10,000 books, reference materials, e-journals, and a serene reading room. The library is open from 8 AM to 5 PM every school day.",
    features: [
      "10,000+ books",
      "E-library access",
      "Reading room",
      "Research support",
    ],
    color: "yellow",
  },
  {
    icon: "🏏",
    title: "Sports Ground",
    desc: "Our 2-acre sports ground supports cricket, football, basketball, volleyball, athletics, and badminton. Professional coaches guide students to district and state-level competitions.",
    features: [
      "Cricket ground",
      "Football field",
      "Basketball court",
      "Athletics track",
    ],
    color: "green",
  },
  {
    icon: "🔒",
    title: "CCTV Security",
    desc: "120+ cameras covering every inch of the campus with 24/7 surveillance, secure entry/exit gates, and a dedicated security team ensuring every child's safety.",
    features: [
      "120+ cameras",
      "24/7 monitoring",
      "Secure entry gates",
      "Security personnel",
    ],
    color: "blue",
  },
  {
    icon: "🚌",
    title: "School Transport",
    desc: "A fleet of 20 GPS-tracked buses covering 50+ routes across the city. All buses are equipped with safety features, female attendants, and real-time tracking for parents.",
    features: [
      "20 GPS-tracked buses",
      "50+ routes",
      "Female attendants",
      "Parent tracking app",
    ],
    color: "orange",
  },
  {
    icon: "🎨",
    title: "Art & Music Room",
    desc: "Dedicated spaces for visual arts, music, and performing arts. Students explore painting, sculpture, classical music, Western instruments, and dance under expert guidance.",
    features: [
      "Visual arts studio",
      "Music instruments",
      "Dance practice room",
      "Annual performances",
    ],
    color: "purple",
  },
];

const cardBorders: Record<string, string> = {
  blue: "border-t-blue-700",
  indigo: "border-t-indigo-600",
  yellow: "border-t-yellow-500",
  green: "border-t-green-600",
  orange: "border-t-orange-500",
  purple: "border-t-purple-600",
};

function FacilitiesPage() {
  return (
    <SchoolLayout>
      <SEOHead
        title="World-Class Facilities | SSK Public School"
        description="Explore SSK Public School's modern facilities — smart classrooms, computer lab, science labs, library, sports ground, and 24/7 CCTV security."
        canonical="https://sskpublicschool.edu.in/facilities"
        keywords="SSK school facilities, smart classroom, computer lab, science lab, library, sports"
      />

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-yellow-500/20 text-yellow-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
            Facilities
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
            World-Class Facilities
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            A 5-acre campus designed to inspire, engage, and support every
            dimension of student development.
          </p>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-16 px-4 bg-white" data-ocid="facilities.section">
        <div className="max-w-6xl mx-auto">
          <div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="facilities.list"
          >
            {facilities.map(({ icon, title, desc, features, color }, i) => (
              <div
                key={title}
                className={`bg-white rounded-2xl border border-blue-100 border-t-4 ${cardBorders[color]} shadow-sm hover:shadow-lg transition-shadow p-6`}
                data-ocid={`facilities.item.${i + 1}`}
              >
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-xl font-bold text-blue-900 font-display mb-3">
                  {title}
                </h3>
                <p className="text-blue-600 text-sm leading-relaxed mb-4">
                  {desc}
                </p>
                <ul className="space-y-1.5">
                  {features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-xs text-blue-700"
                    >
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold font-display mb-4">
            Experience Our Campus
          </h2>
          <p className="text-blue-200 mb-8">
            Visit SSK Public School and see our world-class facilities in
            person.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/admissions"
              className="inline-block bg-yellow-500 hover:bg-yellow-400 text-blue-950 font-bold px-8 py-3.5 rounded-xl transition-colors"
              data-ocid="facilities.apply_button"
            >
              Apply for Admission
            </a>
            <a
              href="https://wa.me/919999999999?text=I%20would%20like%20to%20book%20a%20campus%20visit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-3.5 rounded-xl transition-colors"
              data-ocid="facilities.visit_button"
            >
              📱 Book Campus Visit
            </a>
          </div>
        </div>
      </section>
    </SchoolLayout>
  );
}
