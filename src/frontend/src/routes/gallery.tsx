import { SchoolLayout } from "@/components/layout/SchoolLayout";
import { SEOHead } from "@/components/ui/SEOHead";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/gallery")({ component: GalleryPage });

type FilterTab = "All" | "Events" | "Sports" | "Academics" | "Campus";

const galleryItems = [
  {
    id: 1,
    category: "Events",
    title: "Annual Day 2025",
    desc: "Cultural performances and prize distribution",
    color: "bg-blue-200",
  },
  {
    id: 2,
    category: "Sports",
    title: "Cricket Champions",
    desc: "District-level cricket championship winners",
    color: "bg-yellow-200",
  },
  {
    id: 3,
    category: "Academics",
    title: "Science Fair",
    desc: "Student science projects exhibition",
    color: "bg-green-200",
  },
  {
    id: 4,
    category: "Campus",
    title: "School Building",
    desc: "Our modern 5-acre campus",
    color: "bg-indigo-200",
  },
  {
    id: 5,
    category: "Events",
    title: "Republic Day",
    desc: "Flag hoisting and cultural programme",
    color: "bg-orange-200",
  },
  {
    id: 6,
    category: "Sports",
    title: "Athletics Meet",
    desc: "Annual sports day athletics events",
    color: "bg-blue-300",
  },
  {
    id: 7,
    category: "Academics",
    title: "Board Results",
    desc: "100% results celebration",
    color: "bg-yellow-300",
  },
  {
    id: 8,
    category: "Campus",
    title: "Computer Lab",
    desc: "Our state-of-the-art computer lab",
    color: "bg-green-300",
  },
  {
    id: 9,
    category: "Events",
    title: "Teacher's Day",
    desc: "Students honouring their teachers",
    color: "bg-pink-200",
  },
  {
    id: 10,
    category: "Sports",
    title: "Football Match",
    desc: "Inter-house football tournament",
    color: "bg-red-200",
  },
  {
    id: 11,
    category: "Academics",
    title: "Class Sessions",
    desc: "Smart classroom in action",
    color: "bg-purple-200",
  },
  {
    id: 12,
    category: "Campus",
    title: "School Library",
    desc: "Our 10,000-book library",
    color: "bg-teal-200",
  },
];

const tabs: FilterTab[] = ["All", "Events", "Sports", "Academics", "Campus"];

function GalleryPage() {
  const [active, setActive] = useState<FilterTab>("All");

  const filtered =
    active === "All"
      ? galleryItems
      : galleryItems.filter((g) => g.category === active);

  return (
    <SchoolLayout>
      <SEOHead
        title="Gallery | SSK Public School — Events, Sports & Campus"
        description="Explore SSK Public School's photo gallery — Annual Day, sports events, science fairs, campus, and academic achievements."
        canonical="https://sskpublicschool.edu.in/gallery"
        keywords="SSK school gallery, school events photos, annual day, sports day"
      />

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-yellow-500/20 text-yellow-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
            Gallery
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
            School Life at SSK
          </h1>
          <p className="text-blue-200 text-lg">
            A glimpse into our vibrant campus life, events, sports, and
            achievements.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-white border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div
            className="flex overflow-x-auto gap-1 py-4"
            data-ocid="gallery.filter"
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActive(tab)}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-bold transition-colors ${active === tab ? "bg-blue-900 text-white" : "text-blue-700 hover:bg-blue-50 border border-blue-200"}`}
                data-ocid={`gallery.tab.${tab.toLowerCase()}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-10 px-4 bg-white" data-ocid="gallery.section">
        <div className="max-w-6xl mx-auto">
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            data-ocid="gallery.list"
          >
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className="group rounded-2xl overflow-hidden border border-blue-100 shadow-sm hover:shadow-lg transition-shadow"
                data-ocid={`gallery.item.${i + 1}`}
              >
                <div
                  className={`${item.color} aspect-square flex flex-col items-center justify-center relative`}
                >
                  <span className="text-4xl mb-2">
                    {item.category === "Events"
                      ? "🎉"
                      : item.category === "Sports"
                        ? "🏆"
                        : item.category === "Academics"
                          ? "📚"
                          : "🏫"}
                  </span>
                  <span className="text-xs font-bold text-blue-900 opacity-60">
                    {item.category}
                  </span>
                </div>
                <div className="p-3 bg-white">
                  <h3 className="font-bold text-blue-900 text-sm">
                    {item.title}
                  </h3>
                  <p className="text-blue-500 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SchoolLayout>
  );
}
