"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LandlordAccountMenu from "@/components/landlord/LandlordAccountMenu";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/landlord/EntityStates";
import { EntityTable } from "@/components/landlord/EntityTable";
import { unitColumns } from "@/components/landlord/unitColumns";
import { useLandlordUnits } from "@/hooks/useLandlordUnits";
import { useLandlordPropertyOptions } from "@/hooks/useLandlordPropertyOptions";
import { useUnitMutations } from "@/hooks/useEntityMutations";
import { isUnitStatus, UNIT_STATUSES } from "@/lib/api/units";
import { getApiErrorMessage } from "@/lib/api/errors";
import { getMediaUrl } from "@/lib/api/client";
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
  const rawPropertyId = searchParams.get("propertyId");
  const propertyId =
    rawPropertyId && /^\d+$/.test(rawPropertyId)
      ? Number(rawPropertyId)
      : undefined;
  const list = useLandlordUnits(propertyId);
  const mutations = useUnitMutations();
  const propertiesQuery = useLandlordPropertyOptions(list.user?.id, !list.isAuthLoading);
  const properties = propertiesQuery.data ?? [];
  const selectedProperty = properties.find(({ id }) => id === propertyId);
  const columns = unitColumns(
    properties,
    (id) => mutations.remove.mutate(id, { onSuccess: () => list.setPage(1) }),
    mutations.remove.isPending,
  );

  function updatePropertyFilter(value: string) {
    list.setPage(1);
    const selectedId = Number(value);
    router.push(value === "all" || !Number.isSafeInteger(selectedId) || selectedId < 1
      ? "/landlord/units"
      : `/landlord/units?propertyId=${selectedId}`);
  }

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
          href="/landlord/units/new"
          className="m-3 hidden items-center justify-center gap-2 rounded-md bg-accent-medium px-3 py-2.5 text-xs font-semibold text-primary-deepest lg:flex"
        >
          <Plus className="h-4 w-4" /> Add unit
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
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">
                  Units
                </h1>
                <span className="rounded-full bg-surface-cool-muted px-2 py-0.5 text-[10px] text-neutral-medium">
                  {list.total}
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-medium">
                {selectedProperty ? (
                  <>
                    Showing units for{" "}
                    <span className="font-semibold text-neutral-dark">
                      {selectedProperty.title}
                    </span>
                  </>
                ) : (
                  "Manage the units across your properties."
                )}
              </p>
            </div>
            <Link
              href="/landlord/units/new"
              className="inline-flex items-center gap-2 rounded-md bg-accent-medium px-3.5 py-2 text-xs font-bold text-primary-deepest"
            >
              <Plus className="h-3.5 w-3.5" /> Add Unit
            </Link>
          </div>
          <section
            aria-label="Filter units"
            className="mb-3 rounded-lg border border-surface-border bg-surface p-2.5 shadow-sm"
          >
            <div className="grid gap-2 sm:grid-cols-[minmax(180px,1fr)_minmax(190px,auto)_auto]">
              <label className="flex h-9 items-center gap-2 rounded-md border border-surface-control px-2.5 text-neutral-medium">
                <Search className="h-3.5 w-3.5" />
                <input
                  value={list.search}
                  onChange={(event) => list.setSearch(event.target.value)}
                  placeholder="Search by unit number..."
                  className="w-full bg-transparent text-[11px] outline-none"
                />
              </label>
              <select
                aria-label="Filter by property"
                value={propertyId ?? "all"}
                onChange={(event) => updatePropertyFilter(event.target.value)}
                className="h-9 rounded-md border border-surface-control bg-surface px-2.5 text-[11px]"
              >
                <option value="all">All Properties</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.title}
                  </option>
                ))}
              </select>
              <select
                aria-label="Filter by status"
                value={list.status}
                onChange={(event) => {
                  const value = event.target.value;
                  list.setStatus(isUnitStatus(value) ? value : "");
                  list.setPage(1);
                }}
                className="h-9 min-w-28 rounded-md border border-surface-control bg-surface px-2.5 text-[11px]"
              >
                <option value="">All Statuses</option>
                {UNIT_STATUSES.map((status) => (
                  <option key={status} value={status}>{status === "AVAILABLE" ? "Available" : "Occupied"}</option>
                ))}
              </select>
            </div>
          </section>
          {selectedProperty && (
            <div className="mb-3 flex items-center gap-3 rounded-lg border border-surface-border bg-surface p-3">
              <div className="relative h-10 w-14 overflow-hidden rounded-md bg-neutral-100">
                <Image
                  src={getMediaUrl(selectedProperty.coverImage) || "/banner.jpg"}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div>
                <p className="text-xs font-semibold">{selectedProperty.title}</p>
                <p className="text-[10px] text-neutral-medium">
                  {[selectedProperty.city, selectedProperty.state]
                    .filter(Boolean)
                  .join(", ")}
                </p>
              </div>
              <Link
                href="/landlord/properties"
                className="ml-auto text-[10px] font-semibold text-neutral-medium"
              >
                Back to properties
              </Link>
            </div>
          )}
          {list.isAuthLoading || list.isPending || propertiesQuery.isPending ? (
            <LoadingState label="Loading your units…" />
          ) : !list.user ? (
            <EmptyState title="Your session could not be loaded. Please sign in again." />
          ) : list.isError || propertiesQuery.isError ? (
            <ErrorState
              message={getApiErrorMessage(
                list.error ?? propertiesQuery.error,
                "Could not load units.",
              )}
              onRetry={() => {
                void list.refetch();
                void propertiesQuery.refetch();
              }}
            />
          ) : list.total === 0 ? (
            <EmptyState
              title="No units match these filters."
              action={
                <Link
                  href="/landlord/units/new"
                  className="font-semibold text-accent-deep hover:underline"
                >
                  Add a unit
                </Link>
              }
            />
          ) : (
            <EntityTable
              rows={list.records}
              columns={columns}
              getRowId={(unit) => unit.id}
              page={list.page}
              pageSize={list.pageSize}
              total={list.total}
              onPageChange={list.setPage}
            />
          )}
        </div>
      </div>
    </main>
  );
}

export default function LandlordUnitsPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-surface-page" />}>
      <UnitsContent />
    </Suspense>
  );
}