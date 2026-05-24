import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Admissions", href: "/admissions" },
  { label: "Academics", href: "/academics" },
  { label: "Facilities", href: "/facilities" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function SchoolHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouterState();
  const currentPath = router.location.pathname;

  return (
    <header className="sticky top-0 z-50" data-ocid="header">
      {/* Announcement bar */}
      <div className="bg-primary text-primary-foreground text-center py-2 px-4 text-sm font-medium">
        <span className="inline-flex items-center gap-2">
          🎓<span className="font-semibold">Admissions Open 2026-27</span>
          <span className="hidden sm:inline opacity-80">
            — Apply now to secure your child's future
          </span>
          <a
            href="/admissions"
            className="ml-2 underline underline-offset-2 font-bold text-accent hover:opacity-80 transition-colors"
            data-ocid="header.admissions_bar_link"
          >
            Apply Now →
          </a>
        </span>
      </div>

      {/* Main header */}
      <div className="bg-card border-b border-border shadow-premium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 group"
              data-ocid="header.logo_link"
            >
              <img
                src="/assets/ssk-logo.png"
                alt="SSK Public School Logo"
                className="h-12 w-auto"
              />
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg leading-tight text-foreground">
                  SSK Public School
                </span>
                <span className="text-xs text-muted-foreground leading-tight tracking-wide">
                  Excellence in Education
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav
              className="hidden lg:flex items-center gap-1"
              aria-label="Main navigation"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href as "/"}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPath === link.href
                      ? "text-primary bg-primary/8 font-semibold"
                      : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                  }`}
                  data-ocid={`header.nav_${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA + mobile toggle */}
            <div className="flex items-center gap-3">
              <a
                href="tel:+911234567890"
                className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>+91 123 456 7890</span>
              </a>
              <a
                href="/admissions"
                className="hidden md:inline-flex items-center px-4 py-2 rounded-lg bg-accent text-foreground font-semibold text-sm hover:opacity-90 transition-smooth shadow-xs"
                data-ocid="header.apply_now_button"
              >
                Apply Now
              </a>
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-md text-foreground/70 hover:text-primary hover:bg-primary/5 transition-colors"
                aria-label="Toggle mobile menu"
                data-ocid="header.mobile_menu_toggle"
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div
            className="lg:hidden border-t border-border bg-card"
            data-ocid="header.mobile_menu"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href as "/"}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    currentPath === link.href
                      ? "text-primary bg-primary/8 font-semibold"
                      : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 pb-1">
                <a
                  href="/admissions"
                  className="block w-full text-center px-4 py-2.5 rounded-lg bg-accent text-foreground font-semibold text-sm"
                >
                  Apply Now
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
