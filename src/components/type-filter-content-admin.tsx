"use client";

import { Search, Filter, ChevronDown, LayoutGrid, List } from "lucide-react";

interface TypeFilterContentAdminProps {
  search: string;
  setSearch: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  viewMode: "table" | "grid";
  setViewMode: (value: "table" | "grid") => void;
  filteredCount: number;
}

export default function TypeFilterContentAdmin({
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  viewMode,
  setViewMode,
  filteredCount,
}: TypeFilterContentAdminProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Cari judul konten..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-9 text-sm text-gray-700 placeholder-gray-400 transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
          />
        </div>

        {/* Type Filter */}
        <div className="relative">
          <Filter
            size={14}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="cursor-pointer appearance-none rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-8 pl-8 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
          >
            <option value="all">Semua Format</option>
            <option value="article">Artikel</option>
            <option value="video">Video</option>
          </select>
          <ChevronDown
            size={13}
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
          />
        </div>

        {/* View Toggle */}
        <div className="flex gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1">
          <button
            onClick={() => setViewMode("table")}
            className={`rounded-lg p-2 transition-all ${viewMode === "table" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`rounded-lg p-2 transition-all ${viewMode === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {/* Active filters indicator */}
      {(search || typeFilter !== "all") && (
        <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
          <span className="text-xs text-gray-500">Filter aktif:</span>
          {search && (
            <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
              &quot;{search}&quot;
              <button
                onClick={() => setSearch("")}
                className="ml-1 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
          {typeFilter !== "all" && (
            <span className="flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-600 capitalize">
              {typeFilter}
              <button
                onClick={() => setTypeFilter("all")}
                className="ml-1 hover:text-violet-800"
              >
                ×
              </button>
            </span>
          )}
          <span className="ml-auto text-xs text-gray-400">
            {filteredCount} hasil
          </span>
        </div>
      )}
    </div>
  );
}
