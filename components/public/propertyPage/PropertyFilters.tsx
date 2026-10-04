"use client"

import { useState } from "react";

export default function PropertyFilters() {
  const [price, setPrice] = useState(0);
  const percentage = (price / 1000000) * 100;
  const labelPosition = Math.min(Math.max(percentage, 8), 92);

  return (
    <div className="flex flex-col gap-3 bg-surface px-2 sticky top-20 self-start">
      <span className="text-xl  font-bold">Filter</span>
      <hr className="border-border border-1 mx-1" />
      <div className="flex flex-col gap-2 text-sm">
        <span className="text-sm">Property Type</span>

        <label className="flex items-center gap-2">
          <input type="checkbox" />
          <span>Apartment</span>
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" />
          <span>House</span>
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" />
          <span>TownHouse</span>
        </label>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Price Range</span>

        <div className="relative px-4 pt-5">
          <span
            className="absolute top-0 whitespace-nowrap -translate-x-1/2 text-xs font-medium"
            style={{ left: `${labelPosition}%` }}
          >
            Rs. {price.toLocaleString()}
          </span>

          <input
            type="range"
            min={0}
            max={1000000}
            step={10000}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full rounded-lg"
          />

          <div className="flex justify-between text-xs text-neutral-500">
            <span>Rs. 0</span>
            <span>Rs. 1,000,000</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 text-sm">
        <span className="text-sm">Bedrooms</span>
        <div className="flex gap-2">
          <button className="rounded-lg border border-border bg-surface/75 px-4 py-2 text-xs font-medium text-primary shadow-sm transition-colors hover:bg-surface">
            Any
          </button>
          <button className="rounded-lg border border-border bg-surface/75 px-4 py-2 text-xs font-medium text-primary shadow-sm transition-colors hover:bg-surface">
            1+
          </button>
          <button className="rounded-lg border border-border bg-surface/75 px-4 py-2 text-xs font-medium text-primary shadow-sm transition-colors hover:bg-surface">
            2+
          </button>
          <button className="rounded-lg border border-border bg-surface/75 px-4 py-2 text-xs font-medium text-primary shadow-sm transition-colors hover:bg-surface">
            3+
          </button>
        </div>
      </div>
      <button className="rounded-lg border bg-surface/75 px-4 py-2 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-surface ">
        Clear Filters
      </button>
    </div>
  );
}