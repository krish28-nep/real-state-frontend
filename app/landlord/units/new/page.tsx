"use client";

import Link from "next/link";
import LandlordAccountMenu from "@/components/landlord/LandlordAccountMenu";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowLeft, Bell, Building2, CreditCard, FileText, ImagePlus,
  LayoutDashboard, LoaderCircle, MapPin, Plus, Settings, Trash2, Upload, Users,
} from "lucide-react";
import { apiClient } from "@/lib/api";

type PropertyOption = { id: number; title: string; city: string; address: string };

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

const inputClass = "mt-1.5 block w-full rounded-md border border-[#e6eaf0] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#f5a400] focus:ring-2 focus:ring-[#f5a400]/15";
const labelClass = "block text-xs font-semibold text-[#374151]";

export default function NewUnitPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiClient.get<PropertyOption[]>("/api/property")
      .then(({ data }) => { if (!cancelled) setProperties(data); })
      .catch(() => { if (!cancelled) setError("Could not load your properties. Please refresh and try again."); })
      .finally(() => { if (!cancelled) setLoadingProperties(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const urls = images.map((image) => URL.createObjectURL(image));
    setPreviews(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [images]);

  function chooseImages(files: FileList | null) {
    if (!files) return;
    const selected = Array.from(files);
    if (images.length + selected.length > 10) {
      setError("Choose up to 10 images.");
      return;
    }
    if (selected.some((file) => !file.type.startsWith("image/") || file.size > 10 * 1024 * 1024)) {
      setError("Each file must be an image under 10 MB.");
      return;
    }
    setError("");
    setImages((current) => [...current, ...selected]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);
    const formData = new FormData(event.currentTarget);
    const optionalNumber = (key: string) => {
      const value = String(formData.get(key) ?? "").trim();
      return value === "" ? undefined : Number(value);
    };
    const payload = {
      propertyId: Number(formData.get("propertyId")),
      unitNumber: String(formData.get("unitNumber") ?? "").trim(),
      floor: optionalNumber("floor"),
      bedrooms: optionalNumber("bedrooms"),
      bathrooms: optionalNumber("bathrooms"),
      areaSqft: optionalNumber("areaSqft"),
      rent: Number(formData.get("rent")),
      status: formData.get("status"),
    };

    try {
      const { data: unit } = await apiClient.post("/api/unit", payload);
      if (images.length) {
        const uploadData = new FormData();
        images.forEach((image) => uploadData.append("images", image));
        try {
          await apiClient.post(`/api/unit/${unit.id}/images`, uploadData);
        } catch {
          setError("The unit was created, but its images could not be uploaded. You can add images later.");
          setSaving(false);
          return;
        }
      }
      router.push("/landlord/units");
    } catch {
      setError("We couldn’t create this unit. Check the details and make sure you selected one of your properties.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f6f8] text-[#111827] lg:flex">
      <aside className="flex w-full shrink-0 flex-col bg-black text-white lg:fixed lg:inset-y-0 lg:w-64">
        <Link href="/landlord/dashboard" className="flex h-[68px] items-center gap-2 border-b border-white/10 px-5"><Building2 className="h-5 w-5 text-[#f5a400]" /><span className="text-lg font-bold tracking-tight">Rent Estate<span className="mt-0.5 block text-[9px] font-normal tracking-wide text-white/55">Property Management</span></span></Link>
        <nav aria-label="Landlord navigation" className="flex gap-1 overflow-x-auto p-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:pt-5">{navigation.map(({ label, icon: Icon, href, active }) => <Link key={label} href={href} aria-current={active ? "page" : undefined} className={`flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-xs font-medium transition-colors ${active ? "bg-[#f5a400] text-black" : "text-white/65 hover:bg-white/10 hover:text-white"}`}><Icon className="h-4 w-4" />{label}</Link>)}</nav>
        <Link href="/landlord/units/new" className="m-3 hidden items-center justify-center gap-2 rounded-md bg-[#f5a400] px-3 py-2.5 text-xs font-semibold text-black transition hover:bg-amber-400 lg:flex"><Plus className="h-4 w-4" /> Add unit</Link>
      </aside>

      <div className="min-w-0 flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between gap-4 border-b border-[#e5e7eb] bg-white px-4 sm:px-7"><div className="text-xs font-medium text-[#6b7280]">Property management</div><div className="flex shrink-0 items-center gap-4 sm:gap-6"><button type="button" aria-label="Notifications" className="relative text-[#374151]"><Bell className="h-[18px] w-[18px]" /><span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border border-white bg-red-500" /></button><LandlordAccountMenu /></div></header>

        <div className="mx-auto max-w-[1100px] p-4 sm:p-6 lg:p-8">
          <Link href="/landlord/units" className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-[#6b7280] transition hover:text-[#111827]"><ArrowLeft className="h-4 w-4" /> Back to units</Link>
          <div className="mb-6"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a56d00]">Unit details</p><h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-[28px]">Add a unit</h1><p className="mt-1 text-xs text-[#6b7280]">Add a unit to one of your properties and set its rental details.</p></div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <section className="rounded-lg border border-[#e6e2e7] bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff4d6] text-[#a56d00]"><Building2 className="h-4 w-4" /></span><div><h2 className="text-sm font-bold">Unit information</h2><p className="mt-0.5 text-[11px] text-[#6b7280]">Choose a property and enter the unit’s details.</p></div></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={`${labelClass} sm:col-span-2`}>Property<select name="propertyId" required disabled={loadingProperties || properties.length === 0} defaultValue="" className={inputClass}><option value="" disabled>{loadingProperties ? "Loading properties…" : properties.length ? "Select a property" : "No properties found"}</option>{properties.map((property) => <option key={property.id} value={property.id}>{property.title} · {property.city}</option>)}</select>{!loadingProperties && properties.length === 0 && <Link href="/landlord/properties/new" className="mt-2 inline-block text-[11px] font-semibold text-[#a56d00] hover:underline">Create a property first</Link>}</label>
                <label className={labelClass}>Unit number<input name="unitNumber" required maxLength={30} placeholder="e.g. 204" className={inputClass} /></label>
                <label className={labelClass}>Status<select name="status" required defaultValue="AVAILABLE" className={inputClass}><option value="AVAILABLE">Available</option><option value="OCCUPIED">Occupied</option></select></label>
                <label className={labelClass}>Floor<input name="floor" type="number" step="1" min="0" placeholder="e.g. 2" className={inputClass} /></label>
                <label className={labelClass}>Area (sq ft)<input name="areaSqft" type="number" step="1" min="1" placeholder="e.g. 950" className={inputClass} /></label>
              </div>
            </section>

            <section className="rounded-lg border border-[#e6e2e7] bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff4d6] text-[#a56d00]"><MapPin className="h-4 w-4" /></span><div><h2 className="text-sm font-bold">Layout and rent</h2><p className="mt-0.5 text-[11px] text-[#6b7280]">Set the room count and monthly rent.</p></div></div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <label className={labelClass}>Bedrooms<input name="bedrooms" type="number" step="1" min="0" placeholder="e.g. 2" className={inputClass} /></label>
                <label className={labelClass}>Bathrooms<input name="bathrooms" type="number" step="1" min="0" placeholder="e.g. 1" className={inputClass} /></label>
                <label className={`${labelClass} sm:col-span-2`}>Monthly rent<input name="rent" type="number" step="0.01" min="0.01" required placeholder="e.g. 1800.00" className={inputClass} /></label>
              </div>
            </section>

            <section className="rounded-lg border border-[#e6e2e7] bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff4d6] text-[#a56d00]"><ImagePlus className="h-4 w-4" /></span><div><h2 className="text-sm font-bold">Unit photos</h2><p className="mt-0.5 text-[11px] text-[#6b7280]">Add up to 10 images. The first image will be the cover.</p></div></div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {previews.map((preview, index) => <div key={`${images[index].name}-${index}`} className="relative h-36 overflow-hidden rounded-lg border border-[#e6e2e7]"><img src={preview} alt={`Unit photo ${index + 1}`} className="h-full w-full object-cover" />{index === 0 && <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-1 text-[9px] font-bold text-[#374151]">Cover</span>}<button type="button" onClick={() => setImages((current) => current.filter((_, photoIndex) => photoIndex !== index))} aria-label={`Remove photo ${index + 1}`} className="absolute right-2 top-2 rounded-full bg-white/95 p-1.5 text-[#374151] shadow hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button></div>)}
                {images.length < 10 && <label className="flex h-36 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#d1d5db] bg-[#fbfafb] text-center transition hover:border-[#f5a400] hover:bg-[#fffdf7]"><span className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#a56d00] shadow-sm"><Upload className="h-4 w-4" /></span><span className="text-xs font-semibold text-[#374151]">Upload photos</span><span className="mt-1 text-[10px] text-[#9ca3af]">Images up to 10 MB each</span><input type="file" accept="image/*" multiple className="sr-only" onChange={(event) => { chooseImages(event.target.files); event.currentTarget.value = ""; }} /></label>}
              </div>
            </section>

            {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">{error}</p>}
            <div className="flex flex-wrap items-center justify-end gap-2 rounded-lg border border-[#e6e2e7] bg-white p-3 shadow-sm sm:px-5"><Link href="/landlord/units" className="rounded-md px-4 py-2.5 text-xs font-semibold text-[#6b7280] transition hover:bg-[#f9fafb]">Cancel</Link><button type="submit" disabled={saving || loadingProperties || properties.length === 0} className="inline-flex min-w-36 items-center justify-center gap-2 rounded-md bg-[#f5a400] px-4 py-2.5 text-xs font-bold text-black shadow-sm transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60">{saving && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}{saving ? "Saving unit…" : "Save unit"}</button></div>
          </form>
        </div>
      </div>
    </main>
  );
}
