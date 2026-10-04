import { Search } from "lucide-react";

export default function PropertySearch() {
  return (
    <>
      <h1 className="text-4xl font-bold">Find Your Perfect Home</h1>
      <span className="text-base text-neutral-500">Discover premium rental properties tailored to your lifestyle.</span>
      <div className="relative">
        <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input type="text" placeholder="Search by location..." className="min-w-0 w-full h-14 text-base rounded-lg pl-10 text-neutral-500 border pr-7 p-2 focus:ring-2 focus:outline-none" />
        <button className="btn btn-primary h-12 shrink-0 px-6 absolute right-1 top-1">
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>
    </>
  );
}