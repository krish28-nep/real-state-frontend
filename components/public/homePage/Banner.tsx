import { ChevronDown, HandCoins, Home, MapPin, Search } from "lucide-react";

export default function Banner() {
    return (
        <section className="relative flex min-h-[660px] items-center justify-center overflow-hidden bg-[url('/banner.jpg')] bg-cover bg-center px-6 pt-16">
            <div className="absolute inset-0 bg-surface/80" />
            <div className="absolute inset-0 bg-gradient-to-b from-surface/20 via-surface/55 to-surface/90" />

            <div className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-7">
                <div className="flex max-w-3xl flex-col items-center gap-5 text-center">
                    <h1 className="text-4xl font-bold leading-tight text-primary-medium sm:text-5xl lg:text-6xl">
                        Find Your Next Home with Confidence
                    </h1>
                    <p className="max-w-2xl text-base leading-7 text-neutral-muted sm:text-lg">
                        Discover premium verified rentals, manage viewings, and secure your lease all in one seamless platform.
                    </p>
                </div>

                <div className="flex w-full max-w-[780px] flex-col gap-3 rounded-xl border border-surface-border-cool bg-surface p-3 shadow-2xl sm:flex-row sm:items-center sm:gap-0">
                    <div className="flex min-w-0 flex-1 items-center gap-3 px-2 py-2 sm:border-r sm:border-surface-border-cool">
                        <MapPin className="h-6 w-6 shrink-0 text-neutral-muted" />
                        <input
                            placeholder="Location, Neighborhood"
                            className="min-w-0 flex-1 bg-transparent text-base text-neutral-muted outline-none placeholder:text-neutral-muted/45"
                        />
                    </div>

                    <div className="flex items-center gap-3 px-2 py-2 sm:border-r sm:border-surface-border-cool sm:px-5">
                        <Home className="h-5 w-5 shrink-0 text-neutral-muted" />
                        <select
                            id="property-type"
                            defaultValue="Any Property Type"
                            className="w-full cursor-pointer appearance-none bg-transparent pr-7 text-base text-primary-medium outline-none"
                        >
                            <option>Any Property Type</option>
                            <option>House</option>
                            <option>Commercial</option>
                        </select>
                        <ChevronDown className="-ml-8 h-4 w-4 shrink-0 text-neutral-muted" />
                    </div>

                    <div className="flex items-center gap-3 px-2 py-2 sm:px-5">
                        <HandCoins className="h-5 w-5 shrink-0 text-neutral-muted" />
                        <select
                            id="price-range"
                            defaultValue="Any Price"
                            className="w-full cursor-pointer appearance-none bg-transparent pr-7 text-base text-primary-medium outline-none"
                        >
                            <option>Any Price</option>
                            <option>$1,000 - $2,000</option>
                            <option>$2,000 - $4,000</option>
                            <option>$4,000+</option>
                        </select>
                        <ChevronDown className="-ml-8 h-4 w-4 shrink-0 text-neutral-muted" />
                    </div>

                    <button className="btn btn-primary h-12 shrink-0 px-6">
                        <Search className="h-4 w-4" />
                        Search
                    </button>
                </div>
            </div>
        </section>
    )
}
