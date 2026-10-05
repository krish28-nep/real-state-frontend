"use client";

import Image from "next/image";
import Link from "next/link";
import LandlordAccountMenu from "@/components/landlord/LandlordAccountMenu";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/auth/AuthContext";
import { fetchProperties, type PropertyStatus, type PropertyType } from "@/lib/api/properties";
import { getApiErrorMessage } from "@/lib/api/errors";
import {
  Bell,
  Building2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  LayoutDashboard,
  Pencil,
  Plus,
  Search,
  Settings,
  Users,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/landlord/dashboard" },
  { label: "Properties", icon: Building2, href: "/landlord/properties", active: true },
  { label: "Units", icon: Building2, href: "/landlord/units" },
  { label: "Leases", icon: FileText, href: "#" },
  { label: "Payments", icon: CreditCard, href: "#" },
  { label: "Tenants", icon: Users, href: "#" },
  { label: "Users", icon: Users, href: "#" },
  { label: "Settings", icon: Settings, href: "#" },
];

function statusStyle(status: PropertyStatus) {
  if (status === "AVAILABLE") return "bg-emerald-50 text-emerald-700";
  if (status === "OCCUPIED") return "bg-blue-50 text-blue-700";
  return "bg-orange-50 text-orange-700";
}

const typeLabels: Record<PropertyType, string> = {
  APARTMENT: "Apartment",
  HOUSE: "House",
  COMMERCIAL: "Commercial",
  ROOM: "Room",
};

const statusLabels: Record<PropertyStatus, string> = {
  AVAILABLE: "Available",
  OCCUPIED: "Occupied",
  MAINTENANCE: "Maintenance",
};

export default function LandlordPropertiesPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [city, setCity] = useState("All Cities");
  const [type, setType] = useState("All Types");
  const [status, setStatus] = useState("All Statuses");
  const [page, setPage] = useState(1);
  const pageSize = 4;

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  const filters = {
    ownerId: user?.id ?? 0,
    ...(debouncedQuery ? { title: debouncedQuery } : {}),
    ...(status !== "All Statuses" ? { status: status as PropertyStatus } : {}),
    ...(type !== "All Types" ? { propertyType: type as PropertyType } : {}),
  };

  const propertiesQuery = useQuery({
    queryKey: ["properties", "list", filters],
    queryFn: ({ signal }) => fetchProperties(filters, signal),
    enabled: !isAuthLoading && Boolean(user?.id),
    staleTime: 0,
  });

  const properties = propertiesQuery.data ?? [];
  const cities = [...new Set(properties.map((property) => property.city))].sort();
  const filtered = useMemo(() => properties.filter((property) => city === "All Cities" || property.city === city), [city, properties]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleProperties = filtered.slice((page - 1) * pageSize, page * pageSize);
  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, filtered.length);

  function updateFilter(setter: (value: string) => void, value: string) {
    setter(value);
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-[#f8f6f8] text-[#111827] lg:flex">
      <aside className="flex w-full shrink-0 flex-col bg-black text-white lg:fixed lg:inset-y-0 lg:w-64">
        <Link href="/landlord/dashboard" className="flex h-[68px] items-center gap-2 border-b border-white/10 px-5">
          <Building2 className="h-5 w-5 text-[#f5a400]" />
          <span className="text-lg font-bold tracking-tight">Rent Estate<span className="mt-0.5 block text-[9px] font-normal tracking-wide text-white/55">Property Management</span></span>
        </Link>
        <nav aria-label="Landlord navigation" className="flex gap-1 overflow-x-auto p-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:pt-5">
          {navigation.map(({ label, icon: Icon, href, active }) => (
            <Link key={label} href={href} aria-current={active ? "page" : undefined} className={`flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-xs font-medium transition-colors ${active ? "bg-[#f5a400] text-black" : "text-white/65 hover:bg-white/10 hover:text-white"}`}><Icon className="h-4 w-4" />{label}</Link>
          ))}
        </nav>
        <Link href="/landlord/properties/new" className="m-3 hidden items-center justify-center gap-2 rounded-md bg-[#f5a400] px-3 py-2.5 text-xs font-semibold text-black transition hover:bg-amber-400 lg:flex"><Plus className="h-4 w-4" /> Add Property</Link>
      </aside>

      <div className="min-w-0 flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between gap-4 border-b border-[#e5e7eb] bg-white px-4 sm:px-7">
          <label className="flex h-9 w-full max-w-md items-center gap-2 rounded-md border border-[#e5e7eb] px-3 text-[#6b7280]"><Search className="h-4 w-4 shrink-0" /><input aria-label="Search dashboard" placeholder="Search..." className="w-full bg-transparent text-xs text-[#111827] outline-none placeholder:text-[#9ca3af]" /></label>
          <div className="flex shrink-0 items-center gap-4 sm:gap-6"><button type="button" aria-label="Notifications" className="relative text-[#374151]"><Bell className="h-[18px] w-[18px]" /><span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border border-white bg-red-500" /></button><LandlordAccountMenu /></div>
        </header>

        <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5"><h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">Properties</h1><span className="rounded-full bg-[#eeebef] px-2 py-0.5 text-[10px] font-medium text-[#6b7280]">{filtered.length}</span></div>
            <Link href="/landlord/properties/new" className="inline-flex items-center gap-2 rounded-md bg-[#f5a400] px-3.5 py-2 text-xs font-bold text-black shadow-sm transition hover:bg-amber-400"><Plus className="h-3.5 w-3.5" /> Add Property</Link>
          </div>

          <section aria-label="Filter properties" className="rounded-lg border border-[#e6e2e7] bg-white p-2.5 shadow-sm">
            <div className="grid gap-2 sm:grid-cols-[minmax(180px,1fr)_auto_auto_auto]">
              <label className="flex h-9 items-center gap-2 rounded-md border border-[#e6eaf0] px-2.5 text-[#6b7280]"><Search className="h-3.5 w-3.5 shrink-0" /><input value={query} onChange={(event) => updateFilter(setQuery, event.target.value)} placeholder="Search properties..." className="w-full bg-transparent text-[11px] outline-none placeholder:text-[#9ca3af]" /></label>
              <select aria-label="Filter by type" value={type} onChange={(event) => updateFilter(setType, event.target.value)} className="h-9 min-w-24 rounded-md border border-[#e6eaf0] bg-white px-2.5 text-[11px] text-[#374151] outline-none focus:border-[#f5a400]"><option>All Types</option>{(Object.keys(typeLabels) as PropertyType[]).map((value) => <option key={value} value={value}>{typeLabels[value]}</option>)}</select>
              <select aria-label="Filter by status" value={status} onChange={(event) => updateFilter(setStatus, event.target.value)} className="h-9 min-w-28 rounded-md border border-[#e6eaf0] bg-white px-2.5 text-[11px] text-[#374151] outline-none focus:border-[#f5a400]"><option>All Statuses</option>{(Object.keys(statusLabels) as PropertyStatus[]).map((value) => <option key={value} value={value}>{statusLabels[value]}</option>)}</select>
            </div>
          </section>

          <section aria-label="Your properties" className="mt-3 overflow-hidden rounded-lg border border-[#e6e2e7] bg-white shadow-sm">
            <div className="overflow-x-auto"><table className="w-full min-w-[800px] table-auto text-left">
              <thead className="bg-[#fbf9fb] text-[9px] uppercase tracking-[0.08em] text-[#6b7280]"><tr><th className="px-3 py-3 font-semibold">Property</th><th className="px-3 py-3 font-semibold">Location</th><th className="px-3 py-3 font-semibold">Type</th><th className="px-3 py-3 font-semibold">Status</th><th className="px-3 py-3 text-right font-semibold">Actions</th></tr></thead>
              <tbody className="divide-y divide-[#f0edf0]">
                {isAuthLoading || (Boolean(user) && propertiesQuery.isPending) ? <tr><td colSpan={5} className="px-4 py-12 text-center text-xs text-[#6b7280]">Loading your properties…</td></tr> : null}
                {!isAuthLoading && !user && <tr><td colSpan={5} className="px-4 py-12 text-center text-xs text-[#6b7280]">Your session could not be loaded. Please sign in again.</td></tr>}
                {propertiesQuery.isError && <tr><td colSpan={5} className="px-4 py-12 text-center"><p className="text-xs text-red-600">{getApiErrorMessage(propertiesQuery.error, "Could not load properties.")}</p><button type="button" onClick={() => void propertiesQuery.refetch()} className="mt-2 rounded-md border border-[#e5e7eb] px-3 py-1.5 text-[11px] font-semibold hover:bg-[#f9fafb]">Try again</button></td></tr>}
                {!isAuthLoading && user && propertiesQuery.isSuccess && properties.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center"><p className="text-xs font-semibold text-[#374151]">You haven’t added any properties yet.</p><Link href="/landlord/properties/new" className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#8a5900] hover:underline"><Plus className="h-3 w-3" /> Add your first property</Link></td></tr>}
                {propertiesQuery.isSuccess && properties.length > 0 && filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-xs text-[#6b7280]">No properties match these filters.</td></tr>}
                {visibleProperties.map((property) => <tr key={property.id} className="text-[11px] transition-colors hover:bg-[#fdfcfd]"><td className="px-3 py-2.5"><Link href={`/landlord/units?propertyId=${property.id}`} className="flex items-center gap-2.5"><div className="relative h-9 w-10 shrink-0 overflow-hidden rounded-md bg-[#f3f4f6]"><Image src={property.coverImage || "/banner.jpg"} alt="" fill sizes="40px" className="object-cover" unoptimized /></div><span className="whitespace-nowrap font-semibold text-[#111827] hover:underline">{property.title}</span></Link></td><td className="px-3 py-2.5"><span className="block whitespace-nowrap font-medium">{property.address}</span><span className="mt-0.5 block text-[9px] text-[#6b7280]">{[property.city, property.state, property.country].filter(Boolean).join(", ")}</span></td><td className="px-3 py-2.5 text-[10px] uppercase text-[#374151]">{typeLabels[property.propertyType]}</td><td className="px-3 py-2.5"><span className={`rounded-full px-2 py-1 text-[9px] font-semibold uppercase ${statusStyle(property.status)}`}>{statusLabels[property.status]}</span></td><td className="px-3 py-2.5 text-right"><Link href={`/landlord/properties/${property.id}/edit`} aria-label={`Edit ${property.title}`} className="inline-flex items-center gap-1.5 rounded-md border border-[#e5e7eb] px-2.5 py-1.5 text-[10px] font-semibold text-[#374151] transition hover:border-[#f5a400] hover:bg-[#fffaf0]"><Pencil className="h-3 w-3" /> Edit</Link></td></tr>)}
              </tbody>
            </table></div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#f0edf0] px-3 py-2.5 text-[10px] text-[#6b7280]"><span>Showing {rangeStart}–{rangeEnd} of {filtered.length} results</span><div className="flex items-center gap-1.5"><button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1} className="rounded border border-[#e5e7eb] px-2.5 py-1.5 transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="h-3 w-3" /></button><span className="px-1">{page} / {pageCount}</span><button type="button" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={page === pageCount} className="rounded border border-[#e5e7eb] px-2.5 py-1.5 transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight className="h-3 w-3" /></button></div></div>
          </section>
          <Link href="/landlord/properties/new" className="fixed bottom-5 right-5 inline-flex items-center gap-2 rounded-md bg-[#f5a400] px-4 py-3 text-xs font-bold text-black shadow-lg transition hover:bg-amber-400 lg:hidden"><Plus className="h-4 w-4" /> Add Property</Link>
        </div>
      </div>
    </main>
  );
}
