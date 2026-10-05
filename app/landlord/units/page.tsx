"use client";

import Image from "next/image";
import Link from "next/link";
import LandlordAccountMenu from "@/components/landlord/LandlordAccountMenu";
import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bell,
  Building2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  LayoutDashboard,
  Plus,
  Pencil,
  Search,
  Settings,
  Users,
} from "lucide-react";

const properties = [
  { id: 1, name: "Sunset Apartments", city: "Los Angeles", image: "/banner.jpg" },
  { id: 2, name: "Brooklyn Brownstone", city: "New York", image: "/12.jpg" },
  { id: 3, name: "Skyline Towers", city: "Chicago", image: "/1_new.jpg" },
  { id: 4, name: "Oakwood Plaza", city: "Austin", image: "/banner.jpg" },
  { id: 5, name: "Maple Court", city: "Boston", image: "/12.jpg" },
  { id: 6, name: "The Edison", city: "San Francisco", image: "/1_new.jpg" },
  { id: 7, name: "Cedar Row Homes", city: "Portland", image: "/banner.jpg" },
  { id: 8, name: "Lakeside Offices", city: "Chicago", image: "/12.jpg" },
  { id: 9, name: "Juniper Residences", city: "Denver", image: "/1_new.jpg" },
  { id: 10, name: "Harbor Point", city: "Seattle", image: "/banner.jpg" },
  { id: 11, name: "Willow Creek", city: "Austin", image: "/12.jpg" },
  { id: 12, name: "Pine Street Lofts", city: "San Francisco", image: "/1_new.jpg" },
];

const units = properties.flatMap((property) => [
  { id: `${property.id}-1`, propertyId: property.id, number: "101", bedrooms: 1, bathrooms: 1, floor: 1, area: 750, rent: 1850, status: "OCCUPIED" as const },
  { id: `${property.id}-2`, propertyId: property.id, number: "102", bedrooms: 2, bathrooms: 1, floor: 1, area: 920, rent: 2200, status: "AVAILABLE" as const },
  { id: `${property.id}-3`, propertyId: property.id, number: "201", bedrooms: 2, bathrooms: 2, floor: 2, area: 1100, rent: 2750, status: "OCCUPIED" as const },
]);

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/landlord/dashboard" },
  { label: "Properties", icon: Building2, href: "/landlord/properties" },
  { label: "Units", icon: Building2, href: "/landlord/units", active: true },
  { label: "Leases", icon: FileText, href: "#" },
  { label: "Payments", icon: CreditCard, href: "#" },
  { label: "Tenants", icon: Users, href: "#" },
  { label: "Users", icon: Users, href: "#" },
  { label: "Settings", icon: Settings, href: "#" },
];

function UnitsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("propertyId") ?? "all";
  const property = properties.find((item) => String(item.id) === propertyId);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All Statuses");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => units.filter((unit) => {
    const parent = properties.find((item) => item.id === unit.propertyId);
    const matchesProperty = propertyId === "all" || String(unit.propertyId) === propertyId;
    const matchesStatus = status === "All Statuses" || unit.status === status;
    const matchesSearch = `${unit.number} ${parent?.name ?? ""} ${parent?.city ?? ""}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesProperty && matchesStatus && matchesSearch;
  }), [propertyId, query, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleUnits = filtered.slice((page - 1) * pageSize, page * pageSize);
  const first = filtered.length ? (page - 1) * pageSize + 1 : 0;
  const last = Math.min(page * pageSize, filtered.length);

  function changeStatus(value: string) {
    setStatus(value);
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-[#f8f6f8] text-[#111827] lg:flex">
      <aside className="flex w-full shrink-0 flex-col bg-black text-white lg:fixed lg:inset-y-0 lg:w-64">
        <Link href="/landlord/dashboard" className="flex h-[68px] items-center gap-2 border-b border-white/10 px-5"><Building2 className="h-5 w-5 text-[#f5a400]" /><span className="text-lg font-bold tracking-tight">Rent Estate<span className="mt-0.5 block text-[9px] font-normal tracking-wide text-white/55">Property Management</span></span></Link>
        <nav aria-label="Landlord navigation" className="flex gap-1 overflow-x-auto p-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:pt-5">{navigation.map(({ label, icon: Icon, href, active }) => <Link key={label} href={href} aria-current={active ? "page" : undefined} className={`flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-xs font-medium transition-colors ${active ? "bg-[#f5a400] text-black" : "text-white/65 hover:bg-white/10 hover:text-white"}`}><Icon className="h-4 w-4" />{label}</Link>)}</nav>
        <Link href="/landlord/units/new" className="m-3 hidden items-center justify-center gap-2 rounded-md bg-[#f5a400] px-3 py-2.5 text-xs font-semibold text-black transition hover:bg-amber-400 lg:flex"><Plus className="h-4 w-4" /> Add unit</Link>
      </aside>

      <div className="min-w-0 flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between gap-4 border-b border-[#e5e7eb] bg-white px-4 sm:px-7">
          <label className="flex h-9 w-full max-w-md items-center gap-2 rounded-md border border-[#e5e7eb] px-3 text-[#6b7280]"><Search className="h-4 w-4 shrink-0" /><input aria-label="Search dashboard" placeholder="Search..." className="w-full bg-transparent text-xs text-[#111827] outline-none placeholder:text-[#9ca3af]" /></label>
          <div className="flex shrink-0 items-center gap-4 sm:gap-6"><button type="button" aria-label="Notifications" className="relative text-[#374151]"><Bell className="h-[18px] w-[18px]" /><span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border border-white bg-red-500" /></button><LandlordAccountMenu /></div>
        </header>

        <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div><div className="flex items-center gap-2.5"><h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">Units</h1><span className="rounded-full bg-[#eeebef] px-2 py-0.5 text-[10px] font-medium text-[#6b7280]">{filtered.length}</span></div><p className="mt-1 text-xs text-[#6b7280]">{property ? <>Showing units for <span className="font-semibold text-[#374151]">{property.name}</span></> : "Manage the units across your properties."}</p></div>
            <Link href="/landlord/units/new" className="inline-flex items-center gap-2 rounded-md bg-[#f5a400] px-3.5 py-2 text-xs font-bold text-black shadow-sm transition hover:bg-amber-400"><Plus className="h-3.5 w-3.5" /> Add Unit</Link>
          </div>

          <section aria-label="Filter units" className="rounded-lg border border-[#e6e2e7] bg-white p-2.5 shadow-sm"><div className="grid gap-2 sm:grid-cols-[minmax(180px,1fr)_minmax(190px,auto)_auto]">
            <label className="flex h-9 items-center gap-2 rounded-md border border-[#e6eaf0] px-2.5 text-[#6b7280]"><Search className="h-3.5 w-3.5 shrink-0" /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search units..." className="w-full bg-transparent text-[11px] outline-none placeholder:text-[#9ca3af]" /></label>
            <select aria-label="Filter by property" value={propertyId} onChange={(event) => router.push(event.target.value === "all" ? "/landlord/units" : `/landlord/units?propertyId=${event.target.value}`)} className="h-9 rounded-md border border-[#e6eaf0] bg-white px-2.5 text-[11px] text-[#374151] outline-none focus:border-[#f5a400]"><option value="all">All Properties</option>{properties.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
            <select aria-label="Filter by status" value={status} onChange={(event) => changeStatus(event.target.value)} className="h-9 min-w-28 rounded-md border border-[#e6eaf0] bg-white px-2.5 text-[11px] text-[#374151] outline-none focus:border-[#f5a400]"><option>All Statuses</option><option value="AVAILABLE">Available</option><option value="OCCUPIED">Occupied</option></select>
          </div></section>

          {property && <div className="mt-3 flex items-center gap-3 rounded-lg border border-[#e6e2e7] bg-white p-3 shadow-sm"><div className="relative h-10 w-14 overflow-hidden rounded-md"><Image src={property.image} alt="" fill sizes="56px" className="object-cover" /></div><div className="min-w-0"><p className="truncate text-xs font-semibold">{property.name}</p><p className="text-[10px] text-[#6b7280]">{property.city} · {filtered.length} sample units</p></div><Link href="/landlord/properties" className="ml-auto text-[10px] font-semibold text-[#6b7280] hover:text-black">Back to properties</Link></div>}

          <section aria-label="Unit list" className="mt-3 overflow-hidden rounded-lg border border-[#e6e2e7] bg-white shadow-sm">
            <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left"><thead className="bg-[#fbf9fb] text-[9px] uppercase tracking-[0.08em] text-[#6b7280]"><tr><th className="px-3 py-3 font-semibold">Unit</th><th className="px-3 py-3 font-semibold">Property</th><th className="px-3 py-3 font-semibold">Beds / Baths</th><th className="px-3 py-3 font-semibold">Floor</th><th className="px-3 py-3 font-semibold">Area</th><th className="px-3 py-3 font-semibold">Monthly rent</th><th className="px-3 py-3 font-semibold">Status</th><th className="px-3 py-3 text-right font-semibold">Actions</th></tr></thead>
              <tbody className="divide-y divide-[#f0edf0]">{visibleUnits.map((unit) => { const parent = properties.find((item) => item.id === unit.propertyId)!; return <tr key={unit.id} className="text-[11px] transition-colors hover:bg-[#fdfcfd]"><td className="px-3 py-3"><Link href={`/property/${parent.id}/unit/${unit.number}`} className="font-semibold text-[#111827] hover:underline">Unit {unit.number}</Link></td><td className="px-3 py-3"><span className="block whitespace-nowrap font-medium">{parent.name}</span><span className="text-[9px] text-[#6b7280]">{parent.city}</span></td><td className="px-3 py-3 text-[#4b5563]">{unit.bedrooms} bed · {unit.bathrooms} bath</td><td className="px-3 py-3 text-[#4b5563]">{unit.floor}{unit.floor === 1 ? "st" : "nd"}</td><td className="px-3 py-3 text-[#4b5563]">{unit.area.toLocaleString()} sqft</td><td className="px-3 py-3 font-semibold">${unit.rent.toLocaleString()}<span className="font-normal text-[#6b7280]"> / mo</span></td><td className="px-3 py-3"><span className={`rounded-full px-2 py-1 text-[9px] font-semibold uppercase ${unit.status === "AVAILABLE" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>{unit.status === "AVAILABLE" ? "Available" : "Occupied"}</span></td><td className="px-3 py-3 text-right"><Link href={`/landlord/units/${unit.id}/edit`} aria-label={`Edit unit ${unit.number}`} className="inline-flex items-center gap-1.5 rounded-md border border-[#e5e7eb] px-2.5 py-1.5 text-[10px] font-semibold text-[#374151] transition hover:border-[#f5a400] hover:bg-[#fffaf0]"><Pencil className="h-3 w-3" /> Edit</Link></td></tr>; })}{visibleUnits.length === 0 && <tr><td colSpan={8} className="px-4 py-12 text-center text-xs text-[#6b7280]">No units match these filters.</td></tr>}</tbody>
            </table></div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#f0edf0] px-3 py-2.5 text-[10px] text-[#6b7280]"><span>Showing {first}–{last} of {filtered.length} units</span><div className="flex items-center gap-1.5"><button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1} aria-label="Previous page" className="rounded border border-[#e5e7eb] px-2.5 py-1.5 hover:bg-[#f9fafb] disabled:opacity-40"><ChevronLeft className="h-3 w-3" /></button><span className="px-1">{page} / {pageCount}</span><button type="button" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={page === pageCount} aria-label="Next page" className="rounded border border-[#e5e7eb] px-2.5 py-1.5 hover:bg-[#f9fafb] disabled:opacity-40"><ChevronRight className="h-3 w-3" /></button></div></div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function LandlordUnitsPage() {
  return <Suspense fallback={<main className="min-h-screen bg-[#f8f6f8]" />}><UnitsContent /></Suspense>;
}
