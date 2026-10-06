"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, LoaderCircle, LogOut } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import { apiClient } from "@/lib/api";

export default function LandlordAccountMenu() {
  const { user, isLoading, clearSession } = useAuth();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const name = user?.fullName || user?.email || (isLoading ? "Loading account" : "Account");
  const initials = (user?.fullName || user?.email || "A")
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  async function signOut() {
    setSigningOut(true);
    setError("");
    try {
      await apiClient.post("/auth/logout");
      clearSession();
      window.location.replace("/");
    } catch {
      setError("Could not sign out. Please try again.");
      setSigningOut(false);
    }
  }

  return (
    <div ref={menuRef} className="relative">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Open account details" className="flex items-center gap-2 text-left text-xs font-semibold">
        {user?.profileImage ? <img src={user.profileImage} alt="" className="h-8 w-8 rounded-full object-cover" /> : <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-blue-muted text-[10px] text-neutral-800">{initials || "A"}</span>}
        <span className="hidden sm:block">{name}</span>
        <ChevronDown className={`hidden h-3.5 w-3.5 text-neutral-medium transition-transform sm:block ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <section className="absolute right-0 top-11 z-30 w-64 rounded-lg border border-surface-border bg-surface p-4 shadow-lg" aria-label="Account details">
        <p className="truncate text-sm font-bold text-neutral-deep">{user?.fullName || "Account details"}</p>
        <p className="mt-1 truncate text-xs text-neutral-medium">{user?.email ?? (isLoading ? "Loading…" : "No email available")}</p>
        {user?.phone && <p className="mt-1 text-xs text-neutral-medium">{user.phone}</p>}
        {user?.role && <span className="mt-3 inline-flex rounded-full bg-accent-light px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent-deep">{user.role.toLowerCase()}</span>}
        {error && <p role="alert" className="mt-3 text-[11px] text-danger-dark">{error}</p>}
        <button type="button" onClick={signOut} disabled={signingOut} className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-dark transition hover:bg-neutral-50 disabled:opacity-60">
          {signingOut ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
      </section>}
    </div>
  );
}
