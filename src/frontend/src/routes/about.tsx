import { SchoolLayout } from "@/components/layout/SchoolLayout";
import { SEOHead } from "@/components/ui/SEOHead";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({ component: AboutPage });

const timeline = [
  {
    year: "2001",
    event:
      "SSK Public School founded with a vision to transform K-12 education in the region.",
  },
  {
    year: "2005",
    event:
      "Received CBSE affiliation. First batch of Class 10 students appeared for board exams with 100% results.",
  },
  {
    year: "2010",
    event:
      "Expanded campus to 5 acres. New science labs, computer lab, and sports facilities inaugurated.",
  },
  {
    year: "2015",
    event:
      "Introduced smart classroom technology across all grades. School strength crossed 1000 students.",
  },
  {
    year: "2019",
    event:
      "Launched Class 11-12 (Senior Secondary) with Science, Commerce, and Arts streams.",
  },
  {
    year: "2024",
    event:
      "Digital transformation with online ERP, parent portal, and digital admission management.",
  },
];

const achievements = [
  {
    title: "100% Board Results",
    desc: "25 consecutive years of 100% pass rate in CBSE Class 10 & 12 exams.",
    emoji: "🏆",
  },
  {
    title: "National Sports Champions",
    desc: "State-level cricket and athletics champions for 5 consecutive years.",
    emoji: "🥇",
  },
  {
    title: "Science Olympiad Winners",
    desc: "Over 200 students qualified for national-level Science Olympiad.",
    emoji: "🔬",
  },
  {
    title: "Best School Award",
    desc: "Recognized as Best CBSE School in the district by Education Excellence Awards 2023.",
    emoji: "⭐",
  },
  {
    title: "Green Campus Certified",
    desc: "First school in the district to receive Green Campus Certification.",
    emoji: "🌿",
  },
  {
    title: "Digital Innovation",
    desc: "Awarded for Digital Innovation in Education by CBSE Regional Office 2023.",
    emoji: "💻",
  },
];

function AboutPage() {
  return (
    <SchoolLayout>
      <SEOHead
        title="About SSK Public School | Vision, Mission & History"
        description="Learn about SSK Public School — our vision, mission, principal's message, and 25-year journey of educational excellence."
        canonical="https://sskpublicschool.edu.in/about"
        keywords="SSK Public School about, school history, principal message, vision mission"
      />

      {/* Hero */}
      <section
        className="relative text-white py-16 px-4"
        style={{
          backgroundImage: "url(/assets/images/ssk-school-entrance.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-blue-950/60" />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block bg-yellow-500/20 text-yellow-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
            About Us
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
            About SSK Public School
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            25 years of shaping young minds, building character, and creating
            leaders who make a difference.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 px-4 bg-white" data-ocid="vision.section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-950 font-display">
              Our Vision & Mission
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border-l-4 border-blue-700 bg-blue-50 rounded-r-2xl p-8">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-blue-900 font-display mb-3">
                Our Vision
              </h3>
              <p className="text-blue-700 leading-relaxed">
                To be a leading institution that nurtures curious,
                compassionate, and capable individuals who contribute
                meaningfully to society and the world. We envision students who
                are not just academically excellent but also emotionally
                intelligent leaders.
              </p>
            </div>
            <div className="border-l-4 border-yellow-500 bg-yellow-50 rounded-r-2xl p-8">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-blue-900 font-display mb-3">
                Our Mission
              </h3>
              <p className="text-blue-700 leading-relaxed">
                To provide world-class, inclusive education that fosters
                critical thinking, creativity, and ethical values. We are
                committed to creating an inspiring learning environment where
                every student achieves their fullest potential through
                innovation and dedication.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="py-16 px-4 bg-blue-50" data-ocid="principal.section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
              Leadership
            </span>
            <h2 className="text-3xl font-bold text-blue-950 font-display">
              Message from Our Leaders
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-blue-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl flex-shrink-0">
                  👨‍💼
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-900 font-display">
                    Dr. Suresh Kumar
                  </h3>
                  <p className="text-blue-600 text-sm">
                    Principal, SSK Public School
                  </p>
                  <p className="text-blue-400 text-xs">
                    M.Ed., Ph.D. in Education
                  </p>
                </div>
              </div>
              <p className="text-blue-700 leading-relaxed text-sm italic mb-4">
                "At SSK Public School, we believe that every child is unique and
                carries within them the seeds of greatness. Our role as
                educators is to water those seeds with knowledge, nurture them
                with values, and guide them toward the sunlight of opportunity."
              </p>
              <p className="text-blue-700 leading-relaxed text-sm">
                With 25 years of educational experience, our commitment to
                academic excellence, innovative teaching methods, and character
                development has created thousands of successful alumni across
                India and globally.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-yellow-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center text-3xl flex-shrink-0">
                  👩‍💼
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-900 font-display">
                    Mrs. Sunita Sharma
                  </h3>
                  <p className="text-blue-600 text-sm">
                    Chairperson, SSK Education Trust
                  </p>
                  <p className="text-blue-400 text-xs">
                    Founder & Managing Trustee
                  </p>
                </div>
              </div>
              <p className="text-blue-700 leading-relaxed text-sm italic mb-4">
                "When I founded SSK Public School in 2001, I had one dream: to
                create a school where every child — regardless of their
                background — would have access to quality education that
                prepares them for life."
              </p>
              <p className="text-blue-700 leading-relaxed text-sm">
                Today, seeing our alumni as doctors, engineers, entrepreneurs,
                and leaders fills me with immense pride. We continue to invest
                in better infrastructure, better teachers, and better outcomes
                for every family that trusts us.
              </p>
            </div>
          </div>
          <div className="mt-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src="/assets/images/ssk-school-gate-2.jpeg"
              alt="SSK Public School Campus"
              className="w-full h-64 object-cover"
            />
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-16 px-4 bg-white" data-ocid="history.section">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
              Our Journey
            </span>
            <h2 className="text-3xl font-bold text-blue-950 font-display">
              25 Years of Excellence
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200" />
            <div className="space-y-8">
              {timeline.map(({ year, event }, i) => (
                <div
                  key={year}
                  className="flex gap-6"
                  data-ocid={`timeline.item.${i + 1}`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-sm font-display z-10 relative">
                      {year}
                    </div>
                  </div>
                  <div className="flex-1 bg-blue-50 rounded-xl p-4 mt-3">
                    <p className="text-blue-800 text-sm leading-relaxed">
                      {event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section
        className="py-16 px-4 bg-blue-900 text-white"
        data-ocid="achievements.section"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display">
              Our Achievements
            </h2>
            <p className="text-blue-300 mt-2">
              Milestones that define our commitment to excellence
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map(({ title, desc, emoji }, i) => (
              <div
                key={title}
                className="bg-blue-800 rounded-xl p-6 hover:bg-blue-700 transition-colors"
                data-ocid={`achievements.item.${i + 1}`}
              >
                <div className="text-4xl mb-3">{emoji}</div>
                <h3 className="font-bold text-yellow-400 font-display mb-2">
                  {title}
                </h3>
                <p className="text-blue-200 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SchoolLayout>
  );
}
