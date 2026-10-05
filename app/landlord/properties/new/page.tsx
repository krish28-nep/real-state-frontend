"use client";

import Link from "next/link";
import LandlordAccountMenu from "@/components/landlord/LandlordAccountMenu";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
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
import { apiClient } from "@/lib/api";

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

const inputClass = "mt-1.5 block w-full rounded-md border border-[#e6eaf0] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#f5a400] focus:ring-2 focus:ring-[#f5a400]/15";
const labelClass = "block text-xs font-semibold text-[#374151]";

export default function NewPropertyPage() {
  const router = useRouter();
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!coverImage) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(coverImage);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [coverImage]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);

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
      const response = await apiClient.post("/api/property", payload);
      if (coverImage) {
        const imageData = new FormData();
        imageData.append("image", coverImage);
        try {
          await apiClient.post(`/api/property/${response.data.id}/cover-image`, imageData);
        } catch {
          setError("The property was created, but the cover image could not be uploaded. You can add it later by editing the property.");
          setSaving(false);
          return;
        }
      }
      router.push("/landlord/properties");
    } catch {
      setError("We couldn’t create this property. Please check your details and try again.");
    } finally {
      setSaving(false);
    }
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
      </aside>

      <div className="min-w-0 flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between gap-4 border-b border-[#e5e7eb] bg-white px-4 sm:px-7">
          <div className="text-xs font-medium text-[#6b7280]">Property management</div>
          <div className="flex shrink-0 items-center gap-4 sm:gap-6"><button type="button" aria-label="Notifications" className="relative text-[#374151]"><Bell className="h-[18px] w-[18px]" /><span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border border-white bg-red-500" /></button><LandlordAccountMenu /></div>
        </header>

        <div className="mx-auto max-w-[1100px] p-4 sm:p-6 lg:p-8">
          <Link href="/landlord/properties" className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-[#6b7280] transition hover:text-[#111827]"><ArrowLeft className="h-4 w-4" /> Back to properties</Link>
          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a56d00]">Property details</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-[28px]">Add a property</h1>
            <p className="mt-1 text-xs text-[#6b7280]">Add the basic information and location for your property.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <section className="rounded-lg border border-[#e6e2e7] bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff4d6] text-[#a56d00]"><Building2 className="h-4 w-4" /></span><div><h2 className="text-sm font-bold">Basic information</h2><p className="mt-0.5 text-[11px] text-[#6b7280]">Tell prospective tenants what makes this place special.</p></div></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={`${labelClass} sm:col-span-2`}>Property title<input name="title" required maxLength={120} placeholder="e.g. Sunset Apartments" className={inputClass} /></label>
                <label className={labelClass}>Property type<select name="propertyType" required defaultValue="" className={inputClass}><option value="" disabled>Select a property type</option><option value="APARTMENT">Apartment</option><option value="HOUSE">House</option><option value="COMMERCIAL">Commercial</option><option value="ROOM">Room</option></select></label>
                <label className={labelClass}>Status<select name="status" required defaultValue="AVAILABLE" className={inputClass}><option value="AVAILABLE">Available</option><option value="OCCUPIED">Occupied</option><option value="MAINTENANCE">Maintenance</option></select></label>
                <label className={`${labelClass} sm:col-span-2`}>Description<textarea name="description" required rows={5} maxLength={2000} placeholder="Describe the property, its features, and what makes it a great place to live." className={`${inputClass} resize-y`} /></label>
              </div>
            </section>

            <section className="rounded-lg border border-[#e6e2e7] bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff4d6] text-[#a56d00]"><MapPin className="h-4 w-4" /></span><div><h2 className="text-sm font-bold">Location</h2><p className="mt-0.5 text-[11px] text-[#6b7280]">Enter the property’s full address.</p></div></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={`${labelClass} sm:col-span-2`}>Street address<input name="address" required autoComplete="street-address" placeholder="123 Main Street" className={inputClass} /></label>
                <label className={labelClass}>City<input name="city" required autoComplete="address-level2" placeholder="City" className={inputClass} /></label>
                <label className={labelClass}>State / Province<input name="state" required autoComplete="address-level1" placeholder="State or province" className={inputClass} /></label>
                <label className={labelClass}>Country<input name="country" required autoComplete="country-name" placeholder="Country" className={inputClass} /></label>
                <label className={labelClass}>Postal code<input name="postalCode" required autoComplete="postal-code" placeholder="Postal code" className={inputClass} /></label>
              </div>
            </section>

            <section className="rounded-lg border border-[#e6e2e7] bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff4d6] text-[#a56d00]"><ImagePlus className="h-4 w-4" /></span><div><h2 className="text-sm font-bold">Cover image</h2><p className="mt-0.5 text-[11px] text-[#6b7280]">Choose a clear photo to feature this property.</p></div></div>
              <label className="group relative flex min-h-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-[#d1d5db] bg-[#fbfafb] text-center transition hover:border-[#f5a400] hover:bg-[#fffdf7]">
                {preview ? <><img src={preview} alt="Selected property cover preview" className="absolute inset-0 h-full w-full object-cover" /><span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-black/60 px-3 py-2 text-xs font-semibold text-white"><Upload className="h-3.5 w-3.5" /> Change cover image</span></> : <><span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#a56d00] shadow-sm"><Upload className="h-4 w-4" /></span><span className="text-xs font-semibold text-[#374151]">Click to upload a cover image</span><span className="mt-1 text-[10px] text-[#9ca3af]">Image files up to 10 MB</span></>}
                <input name="coverImage" type="file" accept="image/*" className="sr-only" onChange={(event) => setCoverImage(event.target.files?.[0] ?? null)} />
              </label>
              {coverImage && <div className="mt-2 flex items-center justify-between text-[11px] text-[#6b7280]"><span className="truncate">{coverImage.name}</span><button type="button" onClick={() => setCoverImage(null)} aria-label="Remove cover image" className="ml-3 inline-flex shrink-0 items-center gap-1 rounded px-2 py-1 font-semibold hover:bg-[#f3f4f6]"><X className="h-3 w-3" /> Remove</button></div>}
            </section>

            {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">{error}</p>}
            <div className="flex flex-wrap items-center justify-end gap-2 rounded-lg border border-[#e6e2e7] bg-white p-3 shadow-sm sm:px-5">
              <Link href="/landlord/properties" className="rounded-md px-4 py-2.5 text-xs font-semibold text-[#6b7280] transition hover:bg-[#f9fafb]">Cancel</Link>
              <button type="submit" disabled={saving} className="inline-flex min-w-36 items-center justify-center gap-2 rounded-md bg-[#f5a400] px-4 py-2.5 text-xs font-bold text-black shadow-sm transition hover:bg-amber-400 disabled:cursor-wait disabled:opacity-60">{saving && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}{saving ? "Saving property…" : "Save property"}</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
