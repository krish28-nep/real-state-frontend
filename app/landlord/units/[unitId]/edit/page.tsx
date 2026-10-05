"use client";

import Link from "next/link";
import LandlordAccountMenu from "@/components/landlord/LandlordAccountMenu";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Bell, Building2, CreditCard, FileText, ImagePlus, LayoutDashboard, LoaderCircle, Plus, Settings, Trash2, Upload, Users } from "lucide-react";
import { apiClient } from "@/lib/api";

type PropertyOption = { id: number; title: string; city: string };
type Unit = { id: number; propertyId: number; unitNumber: string; floor: number | null; bedrooms: number | null; bathrooms: number | null; areaSqft: number | null; rent: number | string; status: string; property?: { id: number; title: string } };
type UnitImage = { id: number; imageUrl: string; isCover: boolean };
const navigation = [{ label: "Dashboard", icon: LayoutDashboard, href: "/landlord/dashboard" }, { label: "Properties", icon: Building2, href: "/landlord/properties" }, { label: "Units", icon: Building2, href: "/landlord/units", active: true }, { label: "Leases", icon: FileText, href: "#" }, { label: "Payments", icon: CreditCard, href: "#" }, { label: "Tenants", icon: Users, href: "#" }, { label: "Users", icon: Users, href: "#" }, { label: "Settings", icon: Settings, href: "#" }];
const inputClass = "mt-1.5 block w-full rounded-md border border-[#e6eaf0] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#f5a400] focus:ring-2 focus:ring-[#f5a400]/15";
const labelClass = "block text-xs font-semibold text-[#374151]";

export default function EditUnitPage() {
  const { unitId } = useParams<{ unitId: string }>();
  const router = useRouter();
  const [unit, setUnit] = useState<Unit | null>(null);
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [images, setImages] = useState<UnitImage[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      apiClient.get<Unit>(`/api/unit/${unitId}`),
      apiClient.get<UnitImage[]>(`/api/unit/${unitId}/images`),
      apiClient.get<PropertyOption[]>("/api/property"),
    ]).then(([unitResponse, imageResponse, propertyResponse]) => {
      if (cancelled) return;
      setUnit(unitResponse.data);
      setImages(imageResponse.data);
      setProperties(propertyResponse.data);
    }).catch(() => { if (!cancelled) setError("Could not load this unit. It may have been removed or you may not have access."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [unitId]);
  useEffect(() => {
    const urls = newImages.map((image) => URL.createObjectURL(image));
    setPreviews(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [newImages]);

  function selectImages(files: FileList | null) {
    if (!files) return;
    const selected = Array.from(files);
    if (newImages.length + selected.length > 10) { setError("Upload up to 10 new images at a time."); return; }
    if (selected.some((file) => !file.type.startsWith("image/") || file.size > 10 * 1024 * 1024)) { setError("Each file must be an image smaller than 10 MB."); return; }
    setError(""); setNewImages((current) => [...current, ...selected]);
  }

  async function removeImage(imageId: number) {
    setError("");
    try {
      await apiClient.delete(`/api/unit/${unitId}/images/${imageId}`);
      setImages((current) => current.filter((image) => image.id !== imageId));
    } catch { setError("Could not remove this photo. Please try again."); }
  }

  async function setCover(imageId: number) {
    setError("");
    try {
      await apiClient.patch(`/api/unit/${unitId}/images/${imageId}/cover`);
      setImages((current) => current.map((image) => ({ ...image, isCover: image.id === imageId })));
    } catch { setError("Could not update the cover photo. Please try again."); }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!unit) return;
    setSaving(true); setError("");
    const values = new FormData(event.currentTarget);
    const optionalNumber = (key: string) => { const value = String(values.get(key) ?? "").trim(); return value === "" ? null : Number(value); };
    const payload = {
      propertyId: Number(values.get("propertyId")),
      unitNumber: String(values.get("unitNumber") ?? "").trim(),
      floor: optionalNumber("floor"), bedrooms: optionalNumber("bedrooms"), bathrooms: optionalNumber("bathrooms"), areaSqft: optionalNumber("areaSqft"),
      rent: Number(values.get("rent")), status: values.get("status"),
    };
    try {
      await apiClient.patch(`/api/unit/${unit.id}`, payload);
      if (newImages.length) {
        const upload = new FormData(); newImages.forEach((image) => upload.append("images", image));
        try { await apiClient.post(`/api/unit/${unit.id}/images`, upload); }
        catch { setError("Unit details were saved, but the new photos could not be uploaded."); setSaving(false); return; }
      }
      router.push("/landlord/units");
    } catch { setError("We couldn’t save the unit changes. Please check your details and try again."); }
    finally { setSaving(false); }
  }

  return <main className="min-h-screen bg-[#f8f6f8] text-[#111827] lg:flex">
    <aside className="flex w-full shrink-0 flex-col bg-black text-white lg:fixed lg:inset-y-0 lg:w-64"><Link href="/landlord/dashboard" className="flex h-[68px] items-center gap-2 border-b border-white/10 px-5"><Building2 className="h-5 w-5 text-[#f5a400]" /><span className="text-lg font-bold tracking-tight">Rent Estate<span className="mt-0.5 block text-[9px] font-normal tracking-wide text-white/55">Property Management</span></span></Link><nav aria-label="Landlord navigation" className="flex gap-1 overflow-x-auto p-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:pt-5">{navigation.map(({ label, icon: Icon, href, active }) => <Link key={label} href={href} aria-current={active ? "page" : undefined} className={`flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-xs font-medium ${active ? "bg-[#f5a400] text-black" : "text-white/65 hover:bg-white/10 hover:text-white"}`}><Icon className="h-4 w-4" />{label}</Link>)}</nav><Link href="/landlord/units/new" className="m-3 hidden items-center justify-center gap-2 rounded-md bg-[#f5a400] px-3 py-2.5 text-xs font-semibold text-black transition hover:bg-amber-400 lg:flex"><Plus className="h-4 w-4" /> Add unit</Link></aside>
    <div className="min-w-0 flex-1 lg:ml-64"><header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-[#e5e7eb] bg-white px-4 sm:px-7"><span className="text-xs font-medium text-[#6b7280]">Property management</span><div className="flex items-center gap-4"><Bell className="h-[18px] w-[18px] text-[#374151]" /><LandlordAccountMenu /></div></header>
      <div className="mx-auto max-w-[1100px] p-4 sm:p-6 lg:p-8"><Link href="/landlord/units" className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-[#6b7280] hover:text-[#111827]"><ArrowLeft className="h-4 w-4" /> Back to units</Link><div className="mb-6"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a56d00]">Unit details</p><h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-[28px]">Edit unit</h1><p className="mt-1 text-xs text-[#6b7280]">Update unit details, rent, availability, and photos.</p></div>
        {loading ? <div className="flex items-center gap-2 rounded-lg border border-[#e6e2e7] bg-white p-6 text-xs text-[#6b7280]"><LoaderCircle className="h-4 w-4 animate-spin" /> Loading unit…</div> : unit && <form onSubmit={submit} className="space-y-4">
          <section className="rounded-lg border border-[#e6e2e7] bg-white p-4 shadow-sm sm:p-6"><div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff4d6] text-[#a56d00]"><Building2 className="h-4 w-4" /></span><div><h2 className="text-sm font-bold">Unit information</h2><p className="mt-0.5 text-[11px] text-[#6b7280]">Choose the property and update the unit details.</p></div></div><div className="grid gap-4 sm:grid-cols-2">
            <label className={`${labelClass} sm:col-span-2`}>Property<select name="propertyId" required defaultValue={String(unit.propertyId)} className={inputClass}>{properties.map((property) => <option key={property.id} value={property.id}>{property.title} · {property.city}</option>)}</select></label>
            <label className={labelClass}>Unit number<input name="unitNumber" required defaultValue={unit.unitNumber} className={inputClass} /></label><label className={labelClass}>Status<select name="status" required defaultValue={unit.status} className={inputClass}><option value="AVAILABLE">Available</option><option value="OCCUPIED">Occupied</option></select></label>
            <label className={labelClass}>Floor<input name="floor" type="number" step="1" defaultValue={unit.floor ?? ""} className={inputClass} /></label><label className={labelClass}>Area (sq ft)<input name="areaSqft" type="number" min="1" step="1" defaultValue={unit.areaSqft ?? ""} className={inputClass} /></label>
          </div></section>
          <section className="rounded-lg border border-[#e6e2e7] bg-white p-4 shadow-sm sm:p-6"><div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff4d6] text-[#a56d00]"><Building2 className="h-4 w-4" /></span><div><h2 className="text-sm font-bold">Layout and rent</h2><p className="mt-0.5 text-[11px] text-[#6b7280]">Update room count and monthly rental price.</p></div></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className={labelClass}>Bedrooms<input name="bedrooms" type="number" min="0" step="1" defaultValue={unit.bedrooms ?? ""} className={inputClass} /></label><label className={labelClass}>Bathrooms<input name="bathrooms" type="number" min="0" step="1" defaultValue={unit.bathrooms ?? ""} className={inputClass} /></label><label className={`${labelClass} sm:col-span-2`}>Monthly rent<input name="rent" type="number" min="0.01" step="0.01" required defaultValue={unit.rent} className={inputClass} /></label>
          </div></section>
          <section className="rounded-lg border border-[#e6e2e7] bg-white p-4 shadow-sm sm:p-6"><div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff4d6] text-[#a56d00]"><ImagePlus className="h-4 w-4" /></span><div><h2 className="text-sm font-bold">Unit photos</h2><p className="mt-0.5 text-[11px] text-[#6b7280]">Choose a cover photo, remove old photos, or add new ones.</p></div></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => <div key={image.id} className="relative h-36 overflow-hidden rounded-lg border border-[#e6e2e7]"><img src={image.imageUrl} alt="Unit" className="h-full w-full object-cover" />{image.isCover && <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-1 text-[9px] font-bold text-[#374151]">Cover</span>}<div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-black/55 p-1.5">{!image.isCover && <button type="button" onClick={() => setCover(image.id)} className="rounded bg-white px-2 py-1 text-[9px] font-semibold text-[#374151] hover:bg-[#fff4d6]">Set cover</button>}<button type="button" onClick={() => removeImage(image.id)} aria-label="Remove photo" className="rounded bg-white p-1 text-[#374151] hover:text-red-600"><Trash2 className="h-3 w-3" /></button></div></div>)}
            {previews.map((preview, index) => <div key={`${newImages[index].name}-${index}`} className="relative h-36 overflow-hidden rounded-lg border border-dashed border-[#d1d5db]"><img src={preview} alt={`New unit photo ${index + 1}`} className="h-full w-full object-cover" /><span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-1 text-[9px] font-bold text-[#374151]">New photo</span></div>)}
            {newImages.length < 10 && <label className="flex h-36 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#d1d5db] bg-[#fbfafb] text-center transition hover:border-[#f5a400] hover:bg-[#fffdf7]"><span className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#a56d00] shadow-sm"><Upload className="h-4 w-4" /></span><span className="text-xs font-semibold text-[#374151]">Add photos</span><span className="mt-1 text-[10px] text-[#9ca3af]">Up to 10 MB each</span><input type="file" accept="image/*" multiple className="sr-only" onChange={(event) => { selectImages(event.target.files); event.currentTarget.value = ""; }} /></label>}
          </div></section>
          {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">{error}</p>}<div className="flex justify-end gap-2 rounded-lg border border-[#e6e2e7] bg-white p-3 shadow-sm sm:px-5"><Link href="/landlord/units" className="rounded-md px-4 py-2.5 text-xs font-semibold text-[#6b7280] hover:bg-[#f9fafb]">Cancel</Link><button type="submit" disabled={saving} className="inline-flex min-w-36 items-center justify-center gap-2 rounded-md bg-[#f5a400] px-4 py-2.5 text-xs font-bold text-black shadow-sm hover:bg-amber-400 disabled:opacity-60">{saving && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}{saving ? "Saving changes…" : "Save changes"}</button></div>
        </form>}{!loading && error && !unit && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">{error}</p>}</div>
    </div>
  </main>;
}
