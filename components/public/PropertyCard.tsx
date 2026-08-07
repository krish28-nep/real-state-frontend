import { Bath, Bed, MapPin, Ruler } from "lucide-react"
import Image from "next/image"

const PropertyCard = () => {
    return (
        <article className="w-full overflow-hidden rounded-lg border border-border bg-surface shadow-xl">
            <div className="relative h-44 w-full">
                <Image
                    fill
                    src={'/1_new.jpg'}
                    alt="Bright modern kitchen inside Mission Bay Lofts"
                    className="object-cover"
                    sizes="100vw"
                />
                <span className="absolute left-3 top-3 rounded-full bg-surface px-3 py-1 text-xs font-medium text-secondary shadow-sm">
                    Available
                </span>
            </div>

            <div className="px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="truncate text-base font-bold text-primary">Mission Bay Lofts</h3>
                        <p className="mt-1 flex items-center gap-1 text-xs text-neutral">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">4th St, San Francisco</span>
                        </p>
                    </div>
                    <p className="shrink-0 text-base font-bold text-primary">$3,800</p>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-xs text-neutral">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <Bed className="h-3.5 w-3.5 text-neutral" />
                        <span>1 Bed</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                        <Bath className="h-3.5 w-3.5 text-neutral" />
                        <span>1 Bath</span>
                    </div>
                    <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                        <Ruler className="h-3.5 w-3.5 text-neutral" />
                        <span>850 sqft</span>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default PropertyCard
