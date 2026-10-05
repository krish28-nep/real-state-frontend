import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  CheckCircle2,
  CircleHelp,
  DoorOpen,
  Images,
  LogIn,
  Ruler,
  UserRoundPlus,
} from "lucide-react";

const unitExamples: Record<string, { rent: string; floor: string; bedrooms: string; bathrooms: string; area: string }> = {
  "101": { rent: "$2,800", floor: "1st Floor", bedrooms: "1 Bed", bathrooms: "1 Bath", area: "750 sqft" },
  "102": { rent: "$2,400", floor: "1st Floor", bedrooms: "2 Bed", bathrooms: "1 Bath", area: "850 sqft" },
  "205": { rent: "$4,200", floor: "2nd Floor", bedrooms: "2 Bed", bathrooms: "2 Bath", area: "1,050 sqft" },
};

const amenities = [
  "In-unit Washer/Dryer",
  "Central Air Conditioning",
  "1 Assigned Parking Spot",
  "Pet Friendly (w/ deposit)",
  "Fitness Center Access",
  "High-Speed Internet Ready",
];

const gallery = [
  { src: "/1_new.jpg", alt: "Living room with large windows" },
  { src: "/12.jpg", alt: "Bright modern kitchen" },
  { src: "/banner.jpg", alt: "Apartment building at sunset" },
];

export default async function UnitDetailPage({
  params,
}: {
  params: Promise<{ propertyId: string; unitId: string }>;
}) {
  const { propertyId, unitId } = await params;
  const unit = unitExamples[unitId] ?? unitExamples["102"];

  return (
    <main className="min-h-screen bg-background pb-10">
      <section className="relative isolate flex min-h-[240px] items-end overflow-hidden sm:min-h-[290px]">
        <Image
          src="/banner.jpg"
          alt="Sunset Apartments exterior"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
        <div className="mx-auto w-full max-w-7xl px-5 pb-7 sm:px-8 sm:pb-9">
          <Link href={`/property/${propertyId}`} className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-white/85 transition hover:text-white">
            <ArrowLeft className="h-3.5 w-3.5" /> Sunset Apartments
          </Link>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/75">Sunset Apartments</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">Unit {unitId} <span className="font-medium text-white/80">— Lease terms</span></h1>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-5 px-5 py-5 sm:px-8 sm:py-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(290px,0.8fr)] lg:gap-6">
        <div className="min-w-0 space-y-4">
          <section className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-5">
            <h2 className="font-bold text-primary">Unit overview</h2>
            <p className="mt-1.5 text-xs leading-5 text-neutral sm:max-w-3xl">
              A spacious, light-filled ground floor home featuring modern appliances, hardwood flooring, and private patio access. Perfect for professionals seeking comfort and convenience.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { label: "Floor", value: unit.floor, icon: DoorOpen },
                { label: "Bedrooms", value: unit.bedrooms, icon: BedDouble },
                { label: "Bathrooms", value: unit.bathrooms, icon: Bath },
                { label: "Area", value: unit.area, icon: Ruler },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-lg border border-border bg-tertiary/70 p-3">
                  <Icon className="h-3.5 w-3.5 text-neutral" />
                  <span className="mt-1.5 block text-[10px] uppercase tracking-wide text-neutral">{label}</span>
                  <span className="mt-0.5 block text-xs font-semibold text-primary">{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            <h2 className="border-b border-border px-4 py-3 font-bold text-primary sm:px-5">Financial terms</h2>
            <dl className="divide-y divide-border">
              <div className="flex items-center justify-between gap-4 px-4 py-2.5 text-xs sm:px-5"><dt className="text-neutral">Monthly rent</dt><dd className="font-bold text-primary">{unit.rent}</dd></div>
              <div className="flex items-center justify-between gap-4 px-4 py-2.5 text-xs sm:px-5"><dt className="text-neutral">Security deposit</dt><dd className="font-semibold text-primary">{unit.rent}</dd></div>
              <div className="flex items-center justify-between gap-4 px-4 py-2.5 text-xs sm:px-5"><dt className="text-neutral">Application fee</dt><dd className="font-semibold text-primary">$50 <span className="font-normal text-neutral">/ applicant</span></dd></div>
              <div className="flex items-center justify-between gap-4 px-4 py-2.5 text-xs sm:px-5"><dt className="text-neutral">Lease duration</dt><dd className="font-semibold text-primary">12 Months</dd></div>
              <div className="flex items-center justify-between gap-4 px-4 py-2.5 text-xs sm:px-5"><dt className="text-neutral">Available from</dt><dd className="font-semibold text-primary">Oct 1, 2026</dd></div>
            </dl>
          </section>

          <section className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-5">
            <h2 className="font-bold text-primary">Amenities</h2>
            <ul className="mt-3 grid gap-x-4 gap-y-3 sm:grid-cols-2">
              {amenities.map((amenity) => <li key={amenity} className="flex items-center gap-2 text-xs text-neutral"><CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-secondary" />{amenity}</li>)}
            </ul>
          </section>

          <section id="unit-gallery" className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-5">
            <div className="mb-3 flex items-center justify-between"><h2 className="font-bold text-primary">Unit gallery</h2><span className="text-xs text-neutral">3 photos</span></div>
            <div className="grid grid-cols-3 gap-2">
              {gallery.map((photo) => (
                <div key={photo.src} className="relative h-24 overflow-hidden rounded-lg sm:h-32">
                  <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 640px) 33vw, 25vw" className="object-cover transition duration-300 hover:scale-105" />
                </div>
              ))}
            </div>
            <a href="#unit-gallery" className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-md border border-border py-2 text-xs font-medium text-primary transition hover:bg-tertiary"><Images className="h-3.5 w-3.5" /> View all photos</a>
          </section>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <section className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div><h2 className="text-lg font-bold text-primary">Ready to apply?</h2><p className="mt-1 text-xs leading-5 text-neutral">Review the terms above and start your application process to secure Unit {unitId}.</p></div>
              <span className="rounded-lg bg-tertiary p-2 text-secondary"><UserRoundPlus className="h-4 w-4" /></span>
            </div>
            <div className="mt-4">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-neutral">New tenant</p>
              <Link href="/register" className="btn btn-primary w-full"><UserRoundPlus className="h-4 w-4" /> Create account to apply</Link>
              <p className="mt-1.5 text-center text-[10px] text-neutral">Takes about 5 minutes</p>
            </div>
            <div className="my-3 flex items-center gap-3 text-[10px] text-neutral"><span className="h-px flex-1 bg-border" />OR<span className="h-px flex-1 bg-border" /></div>
            <div>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-neutral">Existing user</p>
              <Link href="/login" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-tertiary"><LogIn className="h-4 w-4" /> Log in &amp; apply</Link>
            </div>
            <p className="mt-4 flex gap-2 rounded-lg border border-border bg-tertiary/70 p-3 text-[10px] leading-4 text-neutral"><CircleHelp className="mt-0.5 h-3.5 w-3.5 shrink-0" />Applying does not guarantee approval or lease signing. An application fee may apply.</p>
          </section>
        </aside>
      </div>
    </main>
  );
}
