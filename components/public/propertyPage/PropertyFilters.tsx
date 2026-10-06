import { PROPERTY_TYPES, PROPERTY_TYPE_LABELS, type PropertyType } from "@/lib/api/properties";

type PropertyFiltersProps = {
  selectedTypes: PropertyType[];
  onToggleType: (type: PropertyType) => void;
  maxRent: number;
  onMaxRentChange: (value: number) => void;
  bedroomsMin: number;
  onBedroomsMinChange: (value: number) => void;
  onClear: () => void;
};

export default function PropertyFilters({ selectedTypes, onToggleType, maxRent, onMaxRentChange, bedroomsMin, onBedroomsMinChange, onClear }: PropertyFiltersProps) {
  const labelPosition = Math.min(Math.max((maxRent / 1_000_000) * 100, 8), 92);

  return (
    <aside className="sticky top-20 flex flex-col gap-3 self-start bg-surface px-2">
      <span className="text-xl font-bold">Filter</span>
      <hr className="mx-1 border-surface-border-cool" />
      <fieldset className="flex flex-col gap-2 text-sm">
        <legend className="mb-2 text-sm">Property Type</legend>
        {PROPERTY_TYPES.map((type) => (
          <label key={type} className="flex items-center gap-2">
            <input type="checkbox" checked={selectedTypes.includes(type)} onChange={() => onToggleType(type)} />
            <span>{PROPERTY_TYPE_LABELS[type]}</span>
          </label>
        ))}
      </fieldset>
      <div className="flex flex-col gap-2">
        <label htmlFor="max-rent" className="text-sm font-medium">Maximum monthly rent</label>
        <div className="relative px-4 pt-5">
          <span className="absolute top-0 -translate-x-1/2 whitespace-nowrap text-xs font-medium" style={{ left: `${labelPosition}%` }}>
            {maxRent === 0 ? "Any price" : `Rs. ${maxRent.toLocaleString()}`}
          </span>
          <input id="max-rent" type="range" min={0} max={1_000_000} step={10_000} value={maxRent} onChange={(event) => onMaxRentChange(Number(event.target.value))} className="w-full rounded-lg" />
          <div className="flex justify-between text-xs text-neutral-gray-500"><span>Any</span><span>Rs. 1,000,000</span></div>
        </div>
      </div>
      <fieldset className="flex flex-col gap-2 text-sm">
        <legend className="mb-2 text-sm">Bedrooms</legend>
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((count) => (
            <button key={count} type="button" aria-pressed={bedroomsMin === count} onClick={() => onBedroomsMinChange(count)} className={`rounded-lg border border-surface-border-cool px-4 py-2 text-xs font-medium shadow-sm transition-colors ${bedroomsMin === count ? "bg-primary text-primary-foreground" : "bg-surface/75 text-primary-medium hover:bg-surface"}`}>
              {count === 0 ? "Any" : `${count}+`}
            </button>
          ))}
        </div>
      </fieldset>
      <button type="button" onClick={onClear} className="rounded-lg border border-surface-border-cool bg-surface/75 px-4 py-2 text-sm font-medium text-primary-medium shadow-sm transition-colors hover:bg-surface">
        Clear Filters
      </button>
    </aside>
  );
}
