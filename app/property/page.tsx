import PropertyFilters from "@/components/public/propertyPage/PropertyFilters";
import PropertyResults from "@/components/public/propertyPage/PropertyResults";
import PropertySearch from "@/components/public/propertyPage/PropertySearch";

const PropertyPage = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-4 px-3 sm:px-4 lg:px-6">
      <PropertyFilters />
      <div className="flex flex-col gap-3">
        <PropertySearch />
        <PropertyResults />
      </div>
    </div>
  )
}

export default PropertyPage;