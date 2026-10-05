import Link from "next/link";
import LandlordAccountMenu from "@/components/landlord/LandlordAccountMenu";
import {
  Bell,
  Building2,
  CalendarDays,
  CreditCard,
  FileText,
  KeyRound,
  LayoutDashboard,
  Plus,
  Search,
  Settings,
  Users,
  Wallet,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/landlord/dashboard", active: true },
  { label: "Properties", icon: Building2, href: "/landlord/properties" },
  { label: "Units", icon: Building2, href: "/landlord/units" },
  { label: "Leases", icon: FileText, href: "#" },
  { label: "Payments", icon: CreditCard, href: "#" },
  { label: "Tenants", icon: Users, href: "#" },
  { label: "Users", icon: Users, href: "#" },
  { label: "Settings", icon: Settings, href: "#" },
];

const payments = [
  { tenant: "Sarah Jenkins", unit: "A-101", date: "Oct 01, 2026", amount: "$1,200.00", status: "Paid" },
  { tenant: "Michael Chang", unit: "B-204", date: "Oct 02, 2026", amount: "$1,450.00", status: "Paid" },
  { tenant: "Elena Rodriguez", unit: "C-305", date: "Oct 03, 2026", amount: "$950.00", status: "Pending" },
  { tenant: "David Smith", unit: "A-102", date: "Oct 03, 2026", amount: "$1,200.00", status: "Paid" },
  { tenant: "Jessica Wong", unit: "B-201", date: "Oct 04, 2026", amount: "$1,350.00", status: "Paid" },
];

export default function LandlordDashboardPage() {
  return (
    <main className="min-h-screen bg-[#f5f7fa] text-[#111827] lg:flex">
      <aside className="flex w-full shrink-0 flex-col bg-black text-white lg:fixed lg:inset-y-0 lg:w-64">
        <Link href="/landlord/dashboard" className="flex h-[68px] items-center gap-2 border-b border-white/10 px-5">
          <Building2 className="h-5 w-5 text-[#f5a400]" />
          <span className="text-lg font-bold tracking-tight">Rent Estate<span className="mt-0.5 block text-[9px] font-normal tracking-wide text-white/55">Property Management</span></span>
        </Link>
        <nav aria-label="Landlord navigation" className="flex gap-1 overflow-x-auto p-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:pt-5">
          {navigation.map(({ label, icon: Icon, href, active }) => (
            <Link key={label} href={href} aria-current={active ? "page" : undefined} className={`flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-xs font-medium transition-colors ${active ? "bg-[#f5a400] text-black" : "text-white/65 hover:bg-white/10 hover:text-white"}`}>
              <Icon className="h-4 w-4" />{label}
            </Link>
          ))}
        </nav>
        <Link href="/property" className="m-3 hidden items-center justify-center gap-2 rounded-md bg-[#f5a400] px-3 py-2.5 text-xs font-semibold text-black transition hover:bg-amber-400 lg:flex"><Plus className="h-4 w-4" /> Add property</Link>
      </aside>

      <div className="min-w-0 flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between gap-4 border-b border-[#e5e7eb] bg-white px-4 sm:px-7">
          <label className="flex h-9 w-full max-w-md items-center gap-2 rounded-md border border-[#e5e7eb] px-3 text-[#6b7280] focus-within:border-[#9ca3af]">
            <Search className="h-4 w-4 shrink-0" />
            <input aria-label="Search" placeholder="Search..." className="w-full bg-transparent text-xs text-[#111827] outline-none placeholder:text-[#9ca3af]" />
          </label>
          <div className="flex shrink-0 items-center gap-4 sm:gap-6">
            <button type="button" aria-label="Notifications" className="relative text-[#374151]"><Bell className="h-[18px] w-[18px]" /><span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border border-white bg-red-500" /></button>
            <LandlordAccountMenu />
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-7">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div><h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">Dashboard Overview</h1><p className="mt-1 text-xs text-[#6b7280]">Welcome back, John. Here’s what’s happening with your properties today.</p></div>
            <button type="button" className="inline-flex items-center gap-2 rounded-md border border-[#e5e7eb] bg-white px-3 py-2 text-xs font-semibold shadow-sm hover:bg-[#f9fafb]"><CalendarDays className="h-3.5 w-3.5" /> This month</button>
          </div>

          <section aria-label="Portfolio summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-lg border border-[#e6eaf0] bg-white p-4 shadow-sm"><div className="flex items-start justify-between"><p className="text-[10px] font-semibold uppercase tracking-wide text-[#6b7280]">Total properties</p><span className="rounded bg-[#f3f4f6] p-1.5 text-[#4b5563]"><Building2 className="h-3.5 w-3.5" /></span></div><p className="mt-3 text-2xl font-bold">12</p><p className="mt-1 text-[10px] font-medium text-emerald-600">↗ +1 this month</p></article>
            <article className="rounded-lg border border-[#e6eaf0] bg-white p-4 shadow-sm"><div className="flex items-start justify-between"><p className="text-[10px] font-semibold uppercase tracking-wide text-[#6b7280]">Occupied units</p><span className="rounded bg-emerald-50 p-1.5 text-emerald-600"><Users className="h-3.5 w-3.5" /></span></div><p className="mt-3 text-2xl font-bold">45</p><p className="mt-1 text-[10px] text-[#6b7280]">Out of 48 total units</p></article>
            <article className="rounded-lg border border-[#e6eaf0] bg-white p-4 shadow-sm"><div className="flex items-start justify-between"><p className="text-[10px] font-semibold uppercase tracking-wide text-[#6b7280]">Vacant units</p><span className="rounded bg-orange-50 p-1.5 text-orange-500"><KeyIcon /></span></div><p className="mt-3 text-2xl font-bold">3</p><p className="mt-1 text-[10px] font-medium text-orange-600">⚠ Needs attention</p></article>
            <article className="rounded-lg border border-[#e6eaf0] bg-white p-4 shadow-sm"><div className="flex items-start justify-between"><p className="text-[10px] font-semibold uppercase tracking-wide text-[#6b7280]">Monthly revenue</p><span className="rounded bg-emerald-50 p-1.5 text-emerald-600"><Wallet className="h-3.5 w-3.5" /></span></div><p className="mt-3 text-2xl font-bold">$12,500</p><p className="mt-1 text-[10px] font-medium text-emerald-600">↗ +4.2% vs last month</p></article>
          </section>

          <section className="mt-4 grid items-start gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(250px,0.8fr)]">
            <div className="overflow-hidden rounded-lg border border-[#e6eaf0] bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-[#e6eaf0] px-4 py-3"><h2 className="text-sm font-bold">Recent payments</h2><Link href="#payments" className="text-[10px] font-semibold text-[#4b5563] hover:text-black">View all</Link></div>
              <div className="overflow-x-auto"><table id="payments" className="w-full min-w-[600px] text-left"><thead className="bg-[#f9fafb] text-[9px] uppercase tracking-wide text-[#6b7280]"><tr><th className="px-4 py-2.5 font-semibold">Tenant</th><th className="px-3 py-2.5 font-semibold">Unit</th><th className="px-3 py-2.5 font-semibold">Date</th><th className="px-3 py-2.5 font-semibold">Amount</th><th className="px-3 py-2.5 font-semibold">Status</th></tr></thead><tbody className="divide-y divide-[#eef0f3]">{payments.map((payment) => <tr key={`${payment.tenant}-${payment.date}`} className="text-[10px]"><td className="whitespace-nowrap px-4 py-3 font-medium">{payment.tenant}</td><td className="px-3 py-3 text-[#6b7280]">{payment.unit}</td><td className="whitespace-nowrap px-3 py-3 text-[#6b7280]">{payment.date}</td><td className="whitespace-nowrap px-3 py-3 font-medium">{payment.amount}</td><td className="px-3 py-3"><span className={`rounded-full px-2 py-1 text-[9px] font-semibold ${payment.status === "Paid" ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-orange-700"}`}>{payment.status}</span></td></tr>)}</tbody></table></div>
            </div>

            <section className="rounded-lg border border-[#e6eaf0] bg-white p-4 shadow-sm">
              <h2 className="text-sm font-bold">Occupancy overview</h2>
              <div className="mt-4 flex flex-col items-center">
                <div className="relative flex h-36 w-36 items-center justify-center rounded-full" style={{ background: "conic-gradient(#10b981 0deg 337deg, #e5e7eb 337deg 360deg)" }}>
                  <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white"><span className="text-3xl font-bold">94%</span><span className="mt-0.5 text-[9px] text-[#6b7280]">Occupancy</span></div>
                </div>
                <div className="mt-4 flex w-full flex-wrap justify-center gap-x-5 gap-y-2 text-[10px] text-[#6b7280]"><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-emerald-500" />Occupied (45)</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#e5e7eb]" />Vacant (3)</span></div>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-[#eef0f3] pt-3 text-[10px]"><span className="text-[#6b7280]">Portfolio units</span><span className="font-semibold">48 total</span></div>
            </section>
          </section>
          <Link href="/property" className="fixed bottom-5 right-5 inline-flex items-center gap-2 rounded-md bg-[#f5a400] px-4 py-3 text-xs font-bold text-black shadow-lg transition hover:bg-amber-400 lg:hidden"><Plus className="h-4 w-4" /> Add property</Link>
        </div>
      </div>
    </main>
  );
}

function KeyIcon() {
  return <KeyRound className="h-3.5 w-3.5" />;
}
