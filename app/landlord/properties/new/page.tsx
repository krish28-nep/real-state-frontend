"use client";

import Link from "next/link";
import Image from "next/image";
import LandlordAccountMenu from "@/components/landlord/LandlordAccountMenu";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  Bell,
  Building2,
  CreditCard,
  FileText,
  ImagePlus,
  LayoutDashboard,
  LoaderCircle,
  MapPin,
  Settings,
  Upload,
  Users,
  X,
} from "lucide-react";
import { usePropertyMutations } from "@/hooks/useEntityMutations";

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

const inputClass = "mt-1.5 block w-full rounded-md border border-surface-control bg-surface px-3 py-2.5 text-sm text-neutral-deep outline-none transition placeholder:text-neutral-light focus:border-accent-medium focus:ring-2 focus:ring-accent-medium/15";
const labelClass = "block text-xs font-semibold text-neutral-dark";

export default function NewPropertyPage() {
  const router = useRouter();
  const mutations = usePropertyMutations();
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const previewUrl = useRef<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => { if (previewUrl.current) URL.revokeObjectURL(previewUrl.current); };
  }, []);

  function selectCoverImage(file: File | null) {
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    previewUrl.current = file ? URL.createObjectURL(file) : null;
    setCoverImage(file);
    setPreview(previewUrl.current);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      propertyType: formData.get("propertyType"),
      address: String(formData.get("address") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      state: String(formData.get("state") ?? "").trim(),
      country: String(formData.get("country") ?? "").trim(),
      postalCode: String(formData.get("postalCode") ?? "").trim(),
      status: formData.get("status"),
    };

    try {
      await mutations.create.mutateAsync({ payload, image: coverImage });
      router.push("/landlord/properties");
    } catch { /* Mutation error is shown through Sonner. */ }
  }

  return (
    <main className="min-h-screen bg-surface-page text-neutral-deep lg:flex">
      <aside className="flex w-full shrink-0 flex-col bg-primary-deepest text-surface-inverse lg:fixed lg:inset-y-0 lg:w-64">
        <Link href="/landlord/dashboard" className="flex h-[68px] items-center gap-2 border-b border-surface-inverse/10 px-5">
          <Building2 className="h-5 w-5 text-accent-medium" />
          <span className="text-lg font-bold tracking-tight">Rent Estate<span className="mt-0.5 block text-[9px] font-normal tracking-wide text-surface-inverse/55">Property Management</span></span>
        </Link>
        <nav aria-label="Landlord navigation" className="flex gap-1 overflow-x-auto p-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:pt-5">
          {navigation.map(({ label, icon: Icon, href, active }) => (
            <Link key={label} href={href} aria-current={active ? "page" : undefined} className={`flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-xs font-medium transition-colors ${active ? "bg-accent-medium text-primary-deepest" : "text-surface-inverse/65 hover:bg-surface-inverse/10 hover:text-surface-inverse"}`}><Icon className="h-4 w-4" />{label}</Link>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between gap-4 border-b border-neutral-200 bg-surface px-4 sm:px-7">
          <div className="text-xs font-medium text-neutral-medium">Property management</div>
          <div className="flex shrink-0 items-center gap-4 sm:gap-6"><button type="button" aria-label="Notifications" className="relative text-neutral-dark"><Bell className="h-[18px] w-[18px]" /><span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border border-surface-inverse bg-danger-medium" /></button><LandlordAccountMenu /></div>
        </header>

        <div className="mx-auto max-w-[1100px] p-4 sm:p-6 lg:p-8">
          <Link href="/landlord/properties" className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-neutral-medium transition hover:text-neutral-deep"><ArrowLeft className="h-4 w-4" /> Back to properties</Link>
          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent-dark">Property details</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-[28px]">Add a property</h1>
            <p className="mt-1 text-xs text-neutral-medium">Add the basic information and location for your property.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <section className="rounded-lg border border-surface-border bg-surface p-4 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-light text-accent-dark"><Building2 className="h-4 w-4" /></span><div><h2 className="text-sm font-bold">Basic information</h2><p className="mt-0.5 text-[11px] text-neutral-medium">Tell prospective tenants what makes this place special.</p></div></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={`${labelClass} sm:col-span-2`}>Property title<input name="title" required maxLength={120} placeholder="e.g. Sunset Apartments" className={inputClass} /></label>
                <label className={labelClass}>Property type<select name="propertyType" required defaultValue="" className={inputClass}><option value="" disabled>Select a property type</option><option value="APARTMENT">Apartment</option><option value="HOUSE">House</option><option value="COMMERCIAL">Commercial</option><option value="ROOM">Room</option></select></label>
                <label className={labelClass}>Status<select name="status" required defaultValue="AVAILABLE" className={inputClass}><option value="AVAILABLE">Available</option><option value="OCCUPIED">Occupied</option><option value="MAINTENANCE">Maintenance</option></select></label>
                <label className={`${labelClass} sm:col-span-2`}>Description<textarea name="description" required rows={5} maxLength={2000} placeholder="Describe the property, its features, and what makes it a great place to live." className={`${inputClass} resize-y`} /></label>
              </div>
            </section>

            <section className="rounded-lg border border-surface-border bg-surface p-4 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-light text-accent-dark"><MapPin className="h-4 w-4" /></span><div><h2 className="text-sm font-bold">Location</h2><p className="mt-0.5 text-[11px] text-neutral-medium">Enter the property’s full address.</p></div></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={`${labelClass} sm:col-span-2`}>Street address<input name="address" required autoComplete="street-address" placeholder="123 Main Street" className={inputClass} /></label>
                <label className={labelClass}>City<input name="city" required autoComplete="address-level2" placeholder="City" className={inputClass} /></label>
                <label className={labelClass}>State / Province<input name="state" required autoComplete="address-level1" placeholder="State or province" className={inputClass} /></label>
                <label className={labelClass}>Country<input name="country" required autoComplete="country-name" placeholder="Country" className={inputClass} /></label>
                <label className={labelClass}>Postal code<input name="postalCode" required autoComplete="postal-code" placeholder="Postal code" className={inputClass} /></label>
              </div>
            </section>

            <section className="rounded-lg border border-surface-border bg-surface p-4 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-light text-accent-dark"><ImagePlus className="h-4 w-4" /></span><div><h2 className="text-sm font-bold">Cover image</h2><p className="mt-0.5 text-[11px] text-neutral-medium">Choose a clear photo to feature this property.</p></div></div>
              <label className="group relative flex min-h-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-neutral-300 bg-surface-subtle text-center transition hover:border-accent-medium hover:bg-accent-lightest">
                {preview ? <><Image src={preview} alt="Selected property cover preview" fill sizes="(max-width: 640px) 100vw, 800px" unoptimized className="object-cover" /><span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-primary-deepest/60 px-3 py-2 text-xs font-semibold text-surface-inverse"><Upload className="h-3.5 w-3.5" /> Change cover image</span></> : <><span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-surface text-accent-dark shadow-sm"><Upload className="h-4 w-4" /></span><span className="text-xs font-semibold text-neutral-dark">Click to upload a cover image</span><span className="mt-1 text-[10px] text-neutral-light">Image files up to 10 MB</span></>}
                <input name="coverImage" type="file" accept="image/*" className="sr-only" onChange={(event) => selectCoverImage(event.target.files?.[0] ?? null)} />
              </label>
              {coverImage && <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-medium"><span className="truncate">{coverImage.name}</span><button type="button" onClick={() => selectCoverImage(null)} aria-label="Remove cover image" className="ml-3 inline-flex shrink-0 items-center gap-1 rounded px-2 py-1 font-semibold hover:bg-neutral-100"><X className="h-3 w-3" /> Remove</button></div>}
            </section>

            {error && <p role="alert" className="rounded-md border border-danger-border bg-danger-light px-3 py-2.5 text-xs text-danger-deep">{error}</p>}
            <div className="flex flex-wrap items-center justify-end gap-2 rounded-lg border border-surface-border bg-surface p-3 shadow-sm sm:px-5">
              <Link href="/landlord/properties" className="rounded-md px-4 py-2.5 text-xs font-semibold text-neutral-medium transition hover:bg-neutral-50">Cancel</Link>
              <button type="submit" disabled={mutations.create.isPending} className="inline-flex min-w-36 items-center justify-center gap-2 rounded-md bg-accent-medium px-4 py-2.5 text-xs font-bold text-primary-deepest shadow-sm transition hover:bg-accent-hover disabled:cursor-wait disabled:opacity-60">{mutations.create.isPending && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}{mutations.create.isPending ? "Saving property…" : "Save property"}</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
