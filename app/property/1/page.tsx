import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Bath,
  Bed,
  Check,
  Clock3,
  Dog,
  Dumbbell,
  MapPin,
  ParkingCircle,
  Ruler,
  Send,
} from "lucide-react";

const amenities = [
  { label: "Pet friendly", icon: Dog },
  { label: "Gym access", icon: Dumbbell },
  { label: "Secure parking", icon: ParkingCircle },
];

const units = [
  {
    id: "101",
    name: "Unit 101",
    image: "/1_new.jpg",
    beds: "1 Bed",
    baths: "1 Bath",
    size: "750 sqft",
    rent: "$2,800",
    status: "Available now",
  },
  {
    id: "205",
    name: "Unit 205",
    image: "/12.jpg",
    beds: "2 Bed",
    baths: "2 Bath",
    size: "1,050 sqft",
    rent: "$4,200",
    status: "Available Sep 1",
  },
];

export default function PropertyDetailPage() {
  return (
    <main className="min-h-screen bg-background pb-10">
      <section className="relative isolate flex min-h-[430px] items-end overflow-hidden sm:min-h-[500px] lg:min-h-[540px]">
        <Image
          src="/banner.jpg"
          alt="Sunset Apartments overlooking the San Francisco waterfront"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/35 to-black/5" />
        <div className="mx-auto w-full max-w-7xl px-5 pb-9 sm:px-8 sm:pb-12">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Professionally managed
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Sunset Apartments
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-white/85 sm:text-base">
            <MapPin className="h-4 w-4" /> 123 Main St, San Francisco, CA
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-7 px-5 py-7 sm:px-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.8fr)] lg:gap-8 lg:py-8">
        <div className="min-w-0 space-y-8">
          <section className="rounded-xl border border-border bg-surface p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">Welcome home</p>
                <h2 className="mt-1 text-xl font-bold text-primary sm:text-2xl">Property overview</h2>
              </div>
              <span className="rounded-full bg-tertiary px-3 py-1 text-xs font-semibold text-primary">San Francisco · CA</span>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-neutral">
              Experience premier urban living at Sunset Apartments. Located in the heart of San Francisco, this modern complex offers unparalleled convenience and style. Our meticulously designed units feature open floor plans, abundant natural light, and premium finishes. Enjoy easy access to the city’s best dining, shopping, and entertainment, all while retreating to a serene and professionally managed community.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
              {amenities.map(({ label, icon: Icon }) => (
                <span key={label} className="inline-flex items-center gap-2 rounded-lg bg-tertiary px-3 py-2 text-xs font-medium text-primary">
                  <Icon className="h-4 w-4 text-secondary" /> {label}
                </span>
              ))}
            </div>
          </section>

          <section aria-labelledby="units-heading">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">Find your fit</p>
                <h2 id="units-heading" className="mt-1 text-xl font-bold text-primary sm:text-2xl">Available units</h2>
              </div>
              <span className="text-sm text-neutral">2 homes available</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {units.map((unit) => (
                <article key={unit.name} className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md">
                  <div className="relative h-48 sm:h-44">
                    <Image src={unit.image} alt={`${unit.name} interior at Sunset Apartments`} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-primary shadow-sm">{unit.status}</span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-bold text-primary">{unit.name}</h3>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700"><Check className="h-3.5 w-3.5" /> Verified</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-neutral">
                      <span className="inline-flex items-center gap-1.5"><Bed className="h-3.5 w-3.5" />{unit.beds}</span>
                      <span className="inline-flex items-center gap-1.5"><Bath className="h-3.5 w-3.5" />{unit.baths}</span>
                      <span className="inline-flex items-center gap-1.5"><Ruler className="h-3.5 w-3.5" />{unit.size}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <div><span className="block text-[11px] text-neutral">Monthly rent</span><span className="text-lg font-bold text-primary">{unit.rent}<span className="text-xs font-normal text-neutral"> / mo</span></span></div>
                      <Link href={`/property/1/unit/${unit.id}`} className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3.5 py-2.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary-hover">View unit <ArrowUpRight className="h-3.5 w-3.5" /></Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <section className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-5">
            <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-neutral">Property snapshot</h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-tertiary p-3"><span className="block text-xs text-neutral">Total units</span><span className="mt-0.5 block text-2xl font-bold text-primary">45</span></div>
              <div className="rounded-lg bg-tertiary p-3"><span className="block text-xs text-neutral">Occupancy</span><span className="mt-0.5 block text-2xl font-bold text-primary">95%</span></div>
            </div>
            <p className="mt-3 flex items-center gap-2 text-xs text-neutral"><Clock3 className="h-3.5 w-3.5 text-secondary" /> Tours available this week</p>
          </section>

          <section className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-tertiary text-secondary"><Send className="h-4 w-4" /></span>
              <div><h2 className="font-bold text-primary">Contact management</h2><p className="text-xs text-neutral">We’re here to help</p></div>
            </div>
            <p className="mt-3 text-xs leading-5 text-neutral">Have questions? Send us a message and our leasing team will get back to you shortly.</p>
            <form className="mt-4 space-y-3">
              <label className="block text-xs font-medium text-primary">Full name<input name="name" type="text" placeholder="Jane Doe" autoComplete="name" required className="mt-1.5 block w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-normal text-primary outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20" /></label>
              <label className="block text-xs font-medium text-primary">Email address<input name="email" type="email" placeholder="jane@example.com" autoComplete="email" required className="mt-1.5 block w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-normal text-primary outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20" /></label>
              <label className="block text-xs font-medium text-primary">Message<textarea name="message" rows={3} placeholder="I’m interested in leasing..." required className="mt-1.5 block w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm font-normal text-primary outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20" /></label>
              <button type="submit" className="btn btn-primary w-full"><Send className="h-4 w-4" /> Send inquiry</button>
            </form>
          </section>
          <p className="px-1 text-center text-xs text-neutral">Prefer a call? <a href="tel:+14155550123" className="font-semibold text-primary underline decoration-secondary underline-offset-2">(415) 555-0123</a></p>
        </aside>
      </div>
    </main>
  );
}
