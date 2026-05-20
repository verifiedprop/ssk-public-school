import { SchoolLayout } from "@/components/layout/SchoolLayout";
import { SEOHead } from "@/components/ui/SEOHead";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/academics")({
  component: AcademicsPage,
});

const classes = [
  {
    level: "Pre-Primary",
    range: "Nursery – UKG",
    desc: "Play-based learning with focus on language, numeracy, creativity, and social skills. Joyful introduction to structured education.",
    emoji: "🌱",
  },
  {
    level: "Primary",
    range: "Class 1 – 5",
    desc: "Strong foundation in English, Mathematics, Science, and Social Studies with hands-on activities and project-based learning.",
    emoji: "📚",
  },
  {
    level: "Middle School",
    range: "Class 6 – 8",
    desc: "In-depth subject knowledge with introduction to Science labs, computer programming, and life skills curriculum.",
    emoji: "🔬",
  },
  {
    level: "Secondary",
    range: "Class 9 – 10",
    desc: "Rigorous CBSE preparation with board exam focus, academic counselling, and career orientation sessions.",
    emoji: "🎓",
  },
  {
    level: "Senior Secondary",
    range: "Class 11 – 12",
    desc: "Three specialized streams — Science (PCM/PCB), Commerce, and Arts — with dedicated faculty and competitive exam coaching.",
    emoji: "🏆",
  },
];

const streams = [
  {
    title: "Science Stream",
    subjects: [
      "Physics",
      "Chemistry",
      "Mathematics",
      "Biology",
      "Computer Science",
    ],
    desc: "Ideal for future engineers, doctors, and researchers. Strong focus on practical labs and competitive exam preparation.",
    color: "blue",
  },
  {
    title: "Commerce Stream",
    subjects: [
      "Accountancy",
      "Business Studies",
      "Economics",
      "Mathematics",
      "Informatics",
    ],
    desc: "Perfect for future entrepreneurs, chartered accountants, and business professionals.",
    color: "yellow",
  },
  {
    title: "Arts / Humanities",
    subjects: [
      "History",
      "Geography",
      "Political Science",
      "Psychology",
      "English",
    ],
    desc: "Ideal for future lawyers, civil servants, journalists, and social scientists.",
    color: "green",
  },
  {
    title: "Sports Excellence",
    subjects: ["Cricket", "Football", "Athletics", "Badminton", "Swimming"],
    desc: "Specialized programme for sports-oriented students with dedicated coaching and fitness training.",
    color: "orange",
  },
];

const facilities = [
  {
    icon: "💻",
    title: "Smart Classrooms",
    desc: "Interactive digital boards, projectors, and multimedia resources in every classroom.",
  },
  {
    icon: "🔬",
    title: "Science Labs",
    desc: "Separate Physics, Chemistry, and Biology labs with modern equipment.",
  },
  {
    icon: "📖",
    title: "Digital Library",
    desc: "10,000+ books, e-journals, and a quiet reading room for focused study.",
  },
  {
    icon: "🖥️",
    title: "Computer Lab",
    desc: "60+ high-performance computers with broadband internet for every student.",
  },
];

const streamColors: Record<string, string> = {
  blue: "border-blue-700 bg-blue-50",
  yellow: "border-yellow-500 bg-yellow-50",
  green: "border-green-600 bg-green-50",
  orange: "border-orange-500 bg-orange-50",
};

const streamTitleColors: Record<string, string> = {
  blue: "text-blue-900",
  yellow: "text-yellow-800",
  green: "text-green-900",
  orange: "text-orange-800",
};

function AcademicsPage() {
  return (
    <SchoolLayout>
      <SEOHead
        title="Academics | SSK Public School — CBSE Curriculum"
        description="Explore SSK Public School's comprehensive CBSE curriculum from Nursery to Class 12 — science, commerce, arts streams, smart classrooms, and modern labs."
        canonical="https://sskpublicschool.edu.in/academics"
        keywords="SSK academics, CBSE curriculum, science commerce arts, Class 1 to 12 school"
      />

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-yellow-500/20 text-yellow-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
            Academics
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
            Academic Excellence
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            A comprehensive CBSE curriculum from Nursery to Class 12 — designed
            to inspire curiosity and build champions.
          </p>
        </div>
      </section>

      {/* Classes Offered */}
      <section className="py-16 px-4 bg-white" data-ocid="classes.section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-950 font-display">
              Classes Offered
            </h2>
            <p className="text-blue-600 mt-2">
              Complete K-12 education under one roof
            </p>
          </div>
          <div className="space-y-4">
            {classes.map(({ level, range, desc, emoji }, i) => (
              <div
                key={level}
                className="flex gap-6 items-start bg-blue-50 rounded-2xl p-6 hover:bg-blue-100/60 transition-colors"
                data-ocid={`classes.item.${i + 1}`}
              >
                <div className="text-4xl flex-shrink-0">{emoji}</div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-3 mb-2">
                    <h3 className="text-xl font-bold text-blue-900 font-display">
                      {level}
                    </h3>
                    <span className="bg-blue-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {range}
                    </span>
                  </div>
                  <p className="text-blue-700 text-sm leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Streams (11-12) */}
      <section className="py-16 px-4 bg-blue-50" data-ocid="streams.section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-950 font-display">
              Senior Secondary Streams
            </h2>
            <p className="text-blue-600 mt-2">
              Choose your path for Class 11 & 12
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {streams.map(({ title, subjects, desc, color }, i) => (
              <div
                key={title}
                className={`border-l-4 rounded-r-2xl p-6 ${streamColors[color]}`}
                data-ocid={`streams.item.${i + 1}`}
              >
                <h3
                  className={`text-xl font-bold font-display mb-2 ${streamTitleColors[color]}`}
                >
                  {title}
                </h3>
                <p className="text-sm text-blue-700 mb-4">{desc}</p>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((s) => (
                    <span
                      key={s}
                      className="bg-white text-blue-800 text-xs font-medium px-3 py-1 rounded-full border border-blue-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section
        className="py-16 px-4 bg-white"
        data-ocid="academic_facilities.section"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-950 font-display">
              Learning Infrastructure
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map(({ icon, title, desc }, i) => (
              <div
                key={title}
                className="text-center bg-blue-50 rounded-2xl p-6"
                data-ocid={`academic_facilities.item.${i + 1}`}
              >
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-bold text-blue-900 font-display mb-2">
                  {title}
                </h3>
                <p className="text-blue-600 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SchoolLayout>
  );
}
