"use client";

import Link from "next/link";
import LandlordAccountMenu from "@/components/landlord/LandlordAccountMenu";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/landlord/EntityStates";
import { EntityTable } from "@/components/landlord/EntityTable";
import { propertyColumns } from "@/components/landlord/propertyColumns";
import { useLandlordProperties } from "@/hooks/useLandlordProperties";
import { usePropertyMutations } from "@/hooks/useEntityMutations";
import { getApiErrorMessage } from "@/lib/api/errors";
import { isPropertyStatus, isPropertyType, PROPERTY_STATUSES, PROPERTY_STATUS_LABELS, PROPERTY_TYPES, PROPERTY_TYPE_LABELS } from "@/lib/api/properties";
import {
  Bell,
  Building2,
  CreditCard,
  FileText,
  LayoutDashboard,
  Plus,
  Search,
  Settings,
  Users,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/landlord/dashboard" },
  {
    label: "Properties",
    icon: Building2,
    href: "/landlord/properties",
    active: true,
  },
  { label: "Units", icon: Building2, href: "/landlord/units" },
  { label: "Leases", icon: FileText, href: "#" },
  { label: "Payments", icon: CreditCard, href: "#" },
  { label: "Tenants", icon: Users, href: "#" },
  { label: "Users", icon: Users, href: "#" },
  { label: "Settings", icon: Settings, href: "#" },
];

export default function LandlordPropertiesPage() {
  const list = useLandlordProperties();
  const mutations = usePropertyMutations();
  const columns = propertyColumns(
    (id) => mutations.remove.mutate(id, { onSuccess: () => list.setPage(1) }),
    mutations.remove.isPending,
  );

  return (
    <main className="min-h-screen bg-surface-page text-neutral-deep lg:flex">
      <aside className="flex w-full shrink-0 flex-col bg-primary-deepest text-surface-inverse lg:fixed lg:inset-y-0 lg:w-64">
        <Link
          href="/landlord/dashboard"
          className="flex h-[68px] items-center gap-2 border-b border-surface-inverse/10 px-5"
        >
          <Building2 className="h-5 w-5 text-accent-medium" />
          <span className="text-lg font-bold tracking-tight">
            Rent Estate
            <span className="mt-0.5 block text-[9px] font-normal tracking-wide text-surface-inverse/55">
              Property Management
            </span>
          </span>
        </Link>
        <nav
          aria-label="Landlord navigation"
          className="flex gap-1 overflow-x-auto p-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:pt-5"
        >
          {navigation.map(({ label, icon: Icon, href, active }) => (
            <Link
              key={label}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-xs font-medium ${active ? "bg-accent-medium text-primary-deepest" : "text-surface-inverse/65 hover:bg-surface-inverse/10 hover:text-surface-inverse"}`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <Link
          href="/landlord/properties/new"
          className="m-3 hidden items-center justify-center gap-2 rounded-md bg-accent-medium px-3 py-2.5 text-xs font-semibold text-primary-deepest lg:flex"
        >
          <Plus className="h-4 w-4" /> Add Property
        </Link>
      </aside>
      <div className="min-w-0 flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between gap-4 border-b border-neutral-200 bg-surface px-4 sm:px-7">
          <span className="text-xs font-medium text-neutral-medium">
            Property management
          </span>
          <div className="flex items-center gap-4">
            <Bell className="h-[18px] w-[18px] text-neutral-dark" />
            <LandlordAccountMenu />
          </div>
        </header>
        <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">
                Properties
              </h1>
              <span className="rounded-full bg-surface-cool-muted px-2 py-0.5 text-[10px] font-medium text-neutral-medium">
                {list.total}
              </span>
            </div>
            <Link
              href="/landlord/properties/new"
              className="inline-flex items-center gap-2 rounded-md bg-accent-medium px-3.5 py-2 text-xs font-bold text-primary-deepest"
            >
              <Plus className="h-3.5 w-3.5" /> Add Property
            </Link>
          </div>
          <section
            aria-label="Filter properties"
            className="mb-3 rounded-lg border border-surface-border bg-surface p-2.5 shadow-sm"
          >
            <div className="grid gap-2 sm:grid-cols-[minmax(180px,1fr)_auto_auto]">
              <label className="flex h-9 items-center gap-2 rounded-md border border-surface-control px-2.5 text-neutral-medium">
                <Search className="h-3.5 w-3.5" />
                <input
                  value={list.search}
                  onChange={(event) => list.setSearch(event.target.value)}
                  placeholder="Search properties..."
                  className="w-full bg-transparent text-[11px] outline-none"
                />
              </label>
              <select
                aria-label="Filter by type"
                value={list.propertyType}
                onChange={(event) => {
                  const value = event.target.value;
                  list.setPropertyType(isPropertyType(value) ? value : "");
                  list.setPage(1);
                }}
                className="h-9 min-w-28 rounded-md border border-surface-control bg-surface px-2.5 text-[11px]"
              >
                <option value="">All Types</option>
                {PROPERTY_TYPES.map((value) => (
                  <option key={value} value={value}>
                    {PROPERTY_TYPE_LABELS[value]}
                  </option>
                ))}
              </select>
              <select
                aria-label="Filter by status"
                value={list.status}
                onChange={(event) => {
                  const value = event.target.value;
                  list.setStatus(isPropertyStatus(value) ? value : "");
                  list.setPage(1);
                }}
                className="h-9 min-w-32 rounded-md border border-surface-control bg-surface px-2.5 text-[11px]"
              >
                <option value="">All Statuses</option>
                {PROPERTY_STATUSES.map((value) => (
                    <option key={value} value={value}>
                      {PROPERTY_STATUS_LABELS[value]}
                    </option>
                ))}
              </select>
            </div>
          </section>
          {list.isAuthLoading || list.isPending ? (
            <LoadingState label="Loading your properties…" />
          ) : !list.user ? (
            <EmptyState title="Your session could not be loaded. Please sign in again." />
          ) : list.isError ? (
            <ErrorState
              message={getApiErrorMessage(
                list.error,
                "Could not load properties.",
              )}
              onRetry={() => void list.refetch()}
            />
          ) : list.total === 0 ? (
            <EmptyState
              title="No properties match these filters."
              action={
                <Link
                  href="/landlord/properties/new"
                  className="font-semibold text-accent-deep hover:underline"
                >
                  Add a property
                </Link>
              }
            />
          ) : (
            <EntityTable
              rows={list.records}
              columns={columns}
              getRowId={(property) => property.id}
              page={list.page}
              pageSize={list.pageSize}
              total={list.total}
              onPageChange={list.setPage}
            />
          )}
        </div>
        <Link
          href="/landlord/properties/new"
          className="fixed bottom-5 right-5 inline-flex items-center gap-2 rounded-md bg-accent-medium px-4 py-3 text-xs font-bold text-primary-deepest shadow-lg lg:hidden"
        >
          <Plus className="h-4 w-4" /> Add Property
        </Link>
      </div>
    </main>
  );
}
