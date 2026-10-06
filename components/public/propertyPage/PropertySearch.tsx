"use client";

import { Search } from "lucide-react";

export default function PropertySearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <>
      <h1 className="text-4xl font-bold">Find Your Perfect Home</h1>
      <span className="text-base text-neutral-gray-500">Discover premium rental properties tailored to your lifestyle.</span>
      <form onSubmit={(event) => event.preventDefault()} role="search" className="relative">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-gray-500" aria-hidden="true" />
        <input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search by city, address, or property..." aria-label="Search rentals by location or property" className="h-14 w-full min-w-0 rounded-lg border p-2 pl-10 pr-28 text-base text-neutral-gray-500 focus:outline-none focus:ring-2" />
        <button type="submit" className="btn btn-primary absolute right-1 top-1 flex h-12 shrink-0 items-center gap-2 px-6">
          <Search className="h-4 w-4" /> Search
        </button>
      </form>
    </>
  );
}
