import { ArrowRight, Bath, Bed, Heart, MapPin, Ruler } from "lucide-react";
import PropertyCard from "../PropertyCard";

export default function FeaturedSection() {
    return (
        <div className="mx-40">
            <div className="flex justify-between p-2">
                <div className="">
                    <h2 className="text-lg font-semibold">Featured Properties</h2>
                    <p className="text-sm">Hand-picked premium listings available now.</p>
                </div>
                <button className="flex gap-2 cursor-pointer">view all <ArrowRight/></button>
            </div>
            <div className="grid grid-cols-3 gap-4 p-2">
                <article className="relative col-span-2 min-h-80 w-full overflow-hidden rounded-lg bg-[url('/12.jpg')] bg-cover bg-center shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/25 to-transparent" />
                    <button
                        type="button"
                        aria-label="Save property"
                        className="absolute right-6 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-surface/30 text-primary-foreground backdrop-blur-sm transition-colors hover:bg-surface/45"
                    >
                        <Heart className="h-5 w-5" />
                    </button>

                    <div className="relative z-10 flex h-full min-h-80 flex-col justify-end p-6 text-primary-foreground">
                        <span className="mb-3 w-fit rounded-full bg-secondary/70 px-4 py-2 text-base font-medium shadow-sm backdrop-blur-sm">
                            Available Now
                        </span>

                        <div className="flex items-end justify-between gap-6">
                            <div>
                                <h3 className="text-2xl font-bold">The Beacon at SoMa</h3>
                                <p className="mt-2 flex items-center gap-1.5 text-sm text-primary-foreground/90">
                                    <MapPin className="h-4 w-4 shrink-0" />
                                    <span>144 King St, San Francisco, CA</span>
                                </p>

                                <div className="mt-6 flex flex-wrap items-center gap-5 text-base text-primary-foreground">
                                    <span className="flex items-center gap-1.5">
                                        <Bed className="h-4 w-4" />
                                        2 Beds
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Bath className="h-4 w-4" />
                                        2 Baths
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Ruler className="h-4 w-4" />
                                        1,200 sqft
                                    </span>
                                </div>
                            </div>

                            <p className="shrink-0 text-right text-3xl font-bold">
                                $4,200<span className="text-sm font-medium text-primary-foreground/85">/mo</span>
                            </p>
                        </div>
                    </div>
                </article>
                <div className="flex  justify-center items-center"><PropertyCard/> </div>
                <div className="flex  justify-center items-center"><PropertyCard/> </div>
                <div className="flex  justify-center items-center"><PropertyCard/> </div>
                <div className="flex  justify-center items-center"><PropertyCard/> </div>
            </div>
        </div>
    )
}
