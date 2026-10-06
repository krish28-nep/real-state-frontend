"use client";

import Link from "next/link";
import Image from "next/image";
import LandlordAccountMenu from "@/components/landlord/LandlordAccountMenu";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, Bell, Building2, CreditCard, FileText, ImagePlus, LayoutDashboard, LoaderCircle, MapPin, Settings, Upload, Users } from "lucide-react";
import { apiClient } from "@/lib/api";
import { getMediaUrl } from "@/lib/api/client";
import { usePropertyMutations } from "@/hooks/useEntityMutations";

type Property = { id: number; title: string; description: string | null; propertyType: string; address: string; city: string; state: string; country: string; postalCode: string; status: string; coverImage: string | null };
const navigation = [{ label: "Dashboard", icon: LayoutDashboard, href: "/landlord/dashboard" }, { label: "Properties", icon: Building2, href: "/landlord/properties", active: true }, { label: "Units", icon: Building2, href: "/landlord/units" }, { label: "Leases", icon: FileText, href: "#" }, { label: "Payments", icon: CreditCard, href: "#" }, { label: "Tenants", icon: Users, href: "#" }, { label: "Users", icon: Users, href: "#" }, { label: "Settings", icon: Settings, href: "#" }];
const inputClass = "mt-1.5 block w-full rounded-md border border-surface-control bg-surface px-3 py-2.5 text-sm text-neutral-deep outline-none transition placeholder:text-neutral-light focus:border-accent-medium focus:ring-2 focus:ring-accent-medium/15";
const labelClass = "block text-xs font-semibold text-neutral-dark";

export default function EditPropertyPage() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const router = useRouter();
  const mutations = usePropertyMutations();
  const [property, setProperty] = useState<Property | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const previewUrl = useRef<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<Property>(`/api/property/${propertyId}`)
      .then(({ data }) => setProperty(data))
      .catch(() => setError("Could not load this property. It may have been removed or you may not have access."))
      .finally(() => setLoading(false));
  }, [propertyId]);
  useEffect(() => () => { if (previewUrl.current) URL.revokeObjectURL(previewUrl.current); }, []);

  function selectImage(file: File | null) {
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    previewUrl.current = file ? URL.createObjectURL(file) : null;
    setImage(file);
    setPreview(previewUrl.current);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!property) return;
    setError("");
    const values = new FormData(event.currentTarget);
    const payload = Object.fromEntries(["title", "description", "propertyType", "address", "city", "state", "country", "postalCode", "status"].map((key) => [key, String(values.get(key) ?? "").trim()]));
    try {
      await mutations.update.mutateAsync({ id: property.id, payload, image });
      router.push("/landlord/properties");
    } catch { /* Mutation error is shown through Sonner. */ }
  }

  return <main className="min-h-screen bg-surface-page text-neutral-deep lg:flex">
    <aside className="flex w-full shrink-0 flex-col bg-primary-deepest text-surface-inverse lg:fixed lg:inset-y-0 lg:w-64"><Link href="/landlord/dashboard" className="flex h-[68px] items-center gap-2 border-b border-surface-inverse/10 px-5"><Building2 className="h-5 w-5 text-accent-medium" /><span className="text-lg font-bold tracking-tight">Rent Estate<span className="mt-0.5 block text-[9px] font-normal tracking-wide text-surface-inverse/55">Property Management</span></span></Link><nav aria-label="Landlord navigation" className="flex gap-1 overflow-x-auto p-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:pt-5">{navigation.map(({ label, icon: Icon, href, active }) => <Link key={label} href={href} aria-current={active ? "page" : undefined} className={`flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-xs font-medium ${active ? "bg-accent-medium text-primary-deepest" : "text-surface-inverse/65 hover:bg-surface-inverse/10 hover:text-surface-inverse"}`}><Icon className="h-4 w-4" />{label}</Link>)}</nav></aside>
    <div className="min-w-0 flex-1 lg:ml-64"><header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-neutral-200 bg-surface px-4 sm:px-7"><span className="text-xs font-medium text-neutral-medium">Property management</span><div className="flex items-center gap-4"><Bell className="h-[18px] w-[18px] text-neutral-dark" /><LandlordAccountMenu /></div></header>
      <div className="mx-auto max-w-[1100px] p-4 sm:p-6 lg:p-8"><Link href="/landlord/properties" className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-neutral-medium hover:text-neutral-deep"><ArrowLeft className="h-4 w-4" /> Back to properties</Link><div className="mb-6"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent-dark">Property details</p><h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-[28px]">Edit property</h1><p className="mt-1 text-xs text-neutral-medium">Update the information and cover image for this property.</p></div>
        {loading ? <div className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface p-6 text-xs text-neutral-medium"><LoaderCircle className="h-4 w-4 animate-spin" /> Loading property…</div> : property && <form onSubmit={submit} className="space-y-4">
          <section className="rounded-lg border border-surface-border bg-surface p-4 shadow-sm sm:p-6"><div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-light text-accent-dark"><Building2 className="h-4 w-4" /></span><div><h2 className="text-sm font-bold">Basic information</h2><p className="mt-0.5 text-[11px] text-neutral-medium">Edit the title, description, type, and availability.</p></div></div><div className="grid gap-4 sm:grid-cols-2">
            <label className={`${labelClass} sm:col-span-2`}>Property title<input name="title" required defaultValue={property.title} className={inputClass} /></label>
            <label className={labelClass}>Property type<select name="propertyType" required defaultValue={property.propertyType} className={inputClass}><option value="APARTMENT">Apartment</option><option value="HOUSE">House</option><option value="COMMERCIAL">Commercial</option><option value="ROOM">Room</option></select></label>
            <label className={labelClass}>Status<select name="status" required defaultValue={property.status} className={inputClass}><option value="AVAILABLE">Available</option><option value="OCCUPIED">Occupied</option><option value="MAINTENANCE">Maintenance</option></select></label>
            <label className={`${labelClass} sm:col-span-2`}>Description<textarea name="description" rows={5} defaultValue={property.description ?? ""} className={`${inputClass} resize-y`} /></label>
          </div></section>
          <section className="rounded-lg border border-surface-border bg-surface p-4 shadow-sm sm:p-6"><div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-light text-accent-dark"><MapPin className="h-4 w-4" /></span><div><h2 className="text-sm font-bold">Location</h2><p className="mt-0.5 text-[11px] text-neutral-medium">Update the property address.</p></div></div><div className="grid gap-4 sm:grid-cols-2">
            <label className={`${labelClass} sm:col-span-2`}>Street address<input name="address" required defaultValue={property.address} className={inputClass} /></label><label className={labelClass}>City<input name="city" required defaultValue={property.city} className={inputClass} /></label><label className={labelClass}>State / Province<input name="state" required defaultValue={property.state} className={inputClass} /></label><label className={labelClass}>Country<input name="country" required defaultValue={property.country} className={inputClass} /></label><label className={labelClass}>Postal code<input name="postalCode" required defaultValue={property.postalCode} className={inputClass} /></label>
          </div></section>
          <section className="rounded-lg border border-surface-border bg-surface p-4 shadow-sm sm:p-6"><div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-light text-accent-dark"><ImagePlus className="h-4 w-4" /></span><div><h2 className="text-sm font-bold">Cover image</h2><p className="mt-0.5 text-[11px] text-neutral-medium">Upload a new image to replace the current cover.</p></div></div><label className="relative flex min-h-40 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-neutral-300 bg-surface-subtle transition hover:border-accent-medium">{preview || property.coverImage ? <><Image src={preview ?? getMediaUrl(property.coverImage) ?? ""} alt="Property cover" fill sizes="(max-width: 640px) 100vw, 800px" unoptimized className="object-cover" /><span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-primary-deepest/60 px-3 py-2 text-xs font-semibold text-surface-inverse"><Upload className="h-3.5 w-3.5" /> Change cover image</span></> : <span className="flex flex-col items-center gap-2 text-xs font-semibold text-neutral-dark"><Upload className="h-5 w-5 text-accent-dark" />Choose a cover image (up to 10 MB)</span>}<input type="file" accept="image/*" className="sr-only" onChange={(event) => { const selected = event.target.files?.[0]; if (selected && selected.size > 10 * 1024 * 1024) { setError("Choose an image smaller than 10 MB."); return; } selectImage(selected ?? null); setError(""); }} /></label></section>
          {error && <p role="alert" className="rounded-md border border-danger-border bg-danger-light px-3 py-2.5 text-xs text-danger-deep">{error}</p>}<div className="flex justify-end gap-2 rounded-lg border border-surface-border bg-surface p-3 shadow-sm sm:px-5"><Link href="/landlord/properties" className="rounded-md px-4 py-2.5 text-xs font-semibold text-neutral-medium hover:bg-neutral-50">Cancel</Link><button type="submit" disabled={mutations.update.isPending} className="inline-flex min-w-36 items-center justify-center gap-2 rounded-md bg-accent-medium px-4 py-2.5 text-xs font-bold text-primary-deepest shadow-sm hover:bg-accent-hover disabled:opacity-60">{mutations.update.isPending && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}{mutations.update.isPending ? "Saving changes…" : "Save changes"}</button></div>
        </form>}{!loading && error && !property && <p role="alert" className="rounded-md border border-danger-border bg-danger-light px-3 py-2.5 text-xs text-danger-deep">{error}</p>}</div>
    </div>
  </main>;
}
