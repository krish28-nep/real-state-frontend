"use client";

import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type EntityColumn<T> = { id: string; header: string; cell: (row: T) => ReactNode; align?: "left" | "right" };

export function EntityTable<T>({ rows, columns, getRowId, page, pageSize, total, onPageChange }: {
  rows: T[];
  columns: EntityColumn<T>[];
  getRowId: (row: T) => string | number;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return <div className="overflow-hidden rounded-lg border border-surface-border bg-surface shadow-sm">
    <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-surface-table text-[9px] uppercase tracking-[0.08em] text-neutral-medium"><tr>{columns.map((column) => <th key={column.id} className={`px-3 py-3 font-semibold ${column.align === "right" ? "text-right" : ""}`}>{column.header}</th>)}</tr></thead><tbody className="divide-y divide-surface-divider">{rows.map((row) => <tr key={getRowId(row)} className="text-[11px] transition-colors hover:bg-surface-hover">{columns.map((column) => <td key={column.id} className={`px-3 py-3 ${column.align === "right" ? "text-right" : ""}`}>{column.cell(row)}</td>)}</tr>)}</tbody></table></div>
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-surface-divider px-3 py-2.5 text-[10px] text-neutral-medium"><span>Showing {from}–{to} of {total} results</span><div className="flex items-center gap-1.5"><button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="rounded border border-neutral-200 px-2.5 py-1.5 hover:bg-neutral-50 disabled:opacity-40"><ChevronLeft className="h-3 w-3" /></button><span className="px-1">{page} / {pageCount}</span><button type="button" aria-label="Next page" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)} className="rounded border border-neutral-200 px-2.5 py-1.5 hover:bg-neutral-50 disabled:opacity-40"><ChevronRight className="h-3 w-3" /></button></div></div>
  </div>;
}
