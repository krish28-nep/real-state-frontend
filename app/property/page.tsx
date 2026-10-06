"use client";

import PropertyFilters from "@/components/public/propertyPage/PropertyFilters";
import PropertyResults from "@/components/public/propertyPage/PropertyResults";
import PropertySearch from "@/components/public/propertyPage/PropertySearch";
import { usePublicRentals } from "@/hooks/usePublicRentals";

const PropertyPage = () => {
  const rentals = usePublicRentals();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-4 px-3 sm:px-4 lg:px-6">
      <PropertyFilters
        selectedTypes={rentals.propertyTypes}
        onToggleType={rentals.togglePropertyType}
        maxRent={rentals.maxRent}
        onMaxRentChange={rentals.setMaxRent}
        bedroomsMin={rentals.bedroomsMin}
        onBedroomsMinChange={rentals.setBedroomsMin}
        onClear={rentals.clearFilters}
      />
      <div className="flex flex-col gap-3">
        <PropertySearch value={rentals.search} onChange={rentals.setSearch} />
        <PropertyResults
          records={rentals.records}
          total={rentals.total}
          page={rentals.page}
          pageSize={rentals.pageSize}
          isPending={rentals.isPending}
          isError={rentals.isError}
          error={rentals.error}
          onRetry={() => { void rentals.refetch(); }}
          onPageChange={rentals.setPage}
        />
      </div>
    </div>
  )
}

export default PropertyPage;
