"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Find Rentals", href: "/", active: true },
  { name: "List Property", href: "/property" },
  { name: "Help", href: "/help" },
  { name: "About Us", href: "/about" },
];

const authLinks = [
  {
    name: "Log In",
    href: "/login",
    variant: "outline",
  },
  {
    name: "Sign Up",
    href: "/register",
    variant: "filled",
  },
];

export default function Header() {
  const pathname = usePathname();

  if (pathname.startsWith("/landlord")) return null;

  return (
    <header className="sticky bg-background inset-x-0 top-0 z-50 w-full">
      <div className="w-full px-6">
        <div className="flex h-16 items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-medium">Rent Estate</h1>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={
                  link.active
                    ? "border-b-2 border-primary pb-1 text-sm font-medium text-primary-medium"
                    : "text-sm font-medium text-neutral-muted transition-colors hover:text-primary-medium"
                }
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {authLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={
                  link.variant === "filled"
                    ? "rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary-hover active:scale-95"
                    : "rounded-lg border border-surface-border-cool bg-surface/75 px-4 py-2 text-sm font-medium text-primary-medium shadow-sm transition-colors hover:bg-surface"
                }
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
