import { SchoolLayout } from "@/components/layout/SchoolLayout";
import { SEOHead } from "@/components/ui/SEOHead";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/blog")({ component: BlogPage });

const posts = [
  {
    id: 1,
    title: "Admissions Open for 2026-27: Apply Now and Secure Your Seat",
    date: "May 10, 2026",
    category: "Admissions",
    excerpt:
      "SSK Public School is pleased to announce that admissions for the 2026-27 academic year are now open for all classes from Nursery to Class 12. Seats are limited and admission is on a first-come, first-served basis.",
    readTime: "3 min read",
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: 2,
    title: "10 Proven Tips for CBSE Board Exam Preparation",
    date: "April 22, 2026",
    category: "Study Tips",
    excerpt:
      "Board exams can be stressful, but with the right preparation strategy, every student can achieve outstanding results. Our experienced faculty shares the top 10 evidence-based strategies for Class 10 and Class 12 board exam success.",
    readTime: "5 min read",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    id: 3,
    title: "Annual Sports Day 2025: Champions Crowned in 12 Events",
    date: "March 15, 2026",
    category: "Events",
    excerpt:
      "SSK Public School's Annual Sports Day 2025 was a spectacular celebration of athletic excellence. Over 500 students participated across 12 events including sprint, long jump, cricket, and football. Congratulations to all our champions!",
    readTime: "4 min read",
    color: "bg-green-100 text-green-800",
  },
  {
    id: 4,
    title: "Science Fair 2026: Innovations That Wowed the Judges",
    date: "February 28, 2026",
    category: "Academics",
    excerpt:
      "The annual Science Fair at SSK Public School showcased remarkable student innovations. From solar-powered water purifiers to AI-based weather prediction models, our students demonstrated that the future of science is in capable hands.",
    readTime: "4 min read",
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: 5,
    title: "SSK Launches New Digital Learning Platform for Students",
    date: "January 20, 2026",
    category: "Technology",
    excerpt:
      "We're excited to announce the launch of our new digital learning platform, providing students with access to recorded lectures, practice tests, and interactive study materials from anywhere, anytime.",
    readTime: "3 min read",
    color: "bg-indigo-100 text-indigo-800",
  },
  {
    id: 6,
    title: "Why Extracurricular Activities Are Critical for Child Development",
    date: "December 10, 2025",
    category: "Education",
    excerpt:
      "Research consistently shows that students who participate in sports, arts, and clubs perform better academically and develop stronger social skills. Here's why SSK's holistic development approach gives students a lifelong advantage.",
    readTime: "6 min read",
    color: "bg-orange-100 text-orange-800",
  },
];

function BlogPage() {
  return (
    <SchoolLayout>
      <SEOHead
        title="Blog | SSK Public School — Admissions, Education & Events"
        description="Read the latest news, admission updates, study tips, and school events from SSK Public School's official blog."
        canonical="https://sskpublicschool.edu.in/blog"
        keywords="SSK school blog, admission news, CBSE education tips, school events"
      />

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-yellow-500/20 text-yellow-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
            Blog
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
            News & Updates
          </h1>
          <p className="text-blue-200 text-lg">
            Admission updates, education tips, school events, and more.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 px-4 bg-white" data-ocid="blog.section">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8" data-ocid="blog.list">
            {posts.map(
              ({ id, title, date, category, excerpt, readTime, color }, i) => (
                <article
                  key={id}
                  className="bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                  data-ocid={`blog.item.${i + 1}`}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${color}`}
                      >
                        {category}
                      </span>
                      <span className="text-blue-400 text-xs">{readTime}</span>
                    </div>
                    <h2 className="text-lg font-bold text-blue-900 font-display mb-3 leading-snug hover:text-blue-700 transition-colors">
                      {title}
                    </h2>
                    <p className="text-blue-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {excerpt}
                    </p>
                    <div className="flex items-center justify-between border-t border-blue-50 pt-4">
                      <span className="text-blue-400 text-xs">{date}</span>
                      <button
                        type="button"
                        className="text-blue-700 text-sm font-bold hover:text-blue-900 transition-colors"
                        data-ocid={`blog.read_more.${i + 1}`}
                      >
                        Read More →
                      </button>
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        </div>
      </section>
    </SchoolLayout>
  );
}
