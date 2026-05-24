import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Admissions", href: "/admissions" },
  { label: "Academics", href: "/academics" },
  { label: "Facilities", href: "/facilities" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const portalLinks = [
  { label: "Student Portal", href: "/login?role=student" },
  { label: "Parent Portal", href: "/login?role=parent" },
  { label: "Teacher Login", href: "/login?role=teacher" },
  { label: "Admin Login", href: "/login?role=admin" },
  { label: "Admission Enquiry", href: "/admissions" },
];

export function SchoolFooter() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`;

  return (
    <footer
      className="bg-secondary text-secondary-foreground"
      data-ocid="footer"
    >
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/ssk-logo.png"
                alt="SSK Public School Logo"
                className="h-10 w-auto"
              />
              <div>
                <div className="font-display font-bold text-lg text-secondary-foreground leading-tight">
                  SSK Public School
                </div>
                <div className="text-xs opacity-60 tracking-wide">
                  Excellence in Education
                </div>
              </div>
            </div>
            <p className="text-sm opacity-70 leading-relaxed mb-5">
              Nurturing young minds since 1998. Committed to holistic education,
              academic excellence, and character development.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center hover:bg-accent/30 transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                aria-label="Twitter"
                className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center hover:bg-accent/30 transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center hover:bg-accent/30 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center hover:bg-accent/30 transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-accent mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm opacity-70 hover:opacity-100 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-accent mb-4">
              Portals
            </h3>
            <ul className="space-y-2">
              {portalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm opacity-70 hover:opacity-100 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-accent mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm opacity-70">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
                <span>
                  123 School Road, Civil Lines,
                  <br />
                  Allahabad, UP 211001
                </span>
              </li>
              <li>
                <a
                  href="tel:+911234567890"
                  className="flex items-center gap-2.5 text-sm opacity-70 hover:opacity-100 hover:text-accent transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0 text-accent" />
                  +91 123 456 7890
                </a>
              </li>
              <li>
                <a
                  href="mailto:admissions@sskschool.edu.in"
                  className="flex items-center gap-2.5 text-sm opacity-70 hover:opacity-100 hover:text-accent transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0 text-accent" />
                  admissions@sskschool.edu.in
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/911234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-accent hover:opacity-80 transition-colors font-medium"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  WhatsApp Enquiry
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs opacity-60">
          <span>© {year} SSK Public School. All rights reserved.</span>
          <span>
            Built with love using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
