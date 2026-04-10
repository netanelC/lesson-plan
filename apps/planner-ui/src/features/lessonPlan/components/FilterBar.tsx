import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import {
  type LessonFilters,
  AGE_GROUPS,
  ACTIVITY_FRAMES,
  FRAME_LABELS,
  AGE_LABELS,
  type AgeGroupType,
  type FrameType,
} from "@repo/types";

const SEARCH_DEBOUNCE_MS = 400;

interface FilterBarProps {
  filters: LessonFilters;
  onFilterChange: (newFilters: Partial<LessonFilters>) => void;
  onReset: () => void;
  userRole?: string;
  userId?: string;
}

export const FilterBar = ({
  filters,
  onFilterChange,
  onReset,
  userRole,
  userId,
}: FilterBarProps) => {
  const [searchTerm, setSearchTerm] = useState(filters.search ?? "");
  const [debouncedSearch] = useDebounce(searchTerm, SEARCH_DEBOUNCE_MS);

  // Sync local state when parent resets filters
  useEffect(() => {
    if (filters.search !== searchTerm) {
      setSearchTerm(filters.search ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search]);

  // Trigger parent update on debounced change
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFilterChange({ search: debouncedSearch });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleAgeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ageGroup: e.target.value as AgeGroupType });
  };

  const handleFrameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ frame: e.target.value as FrameType });
  };

  const handleMyPlansChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // If checked, filter by current userId. If unchecked, clear the authorId filter.
    onFilterChange({ authorId: e.target.checked ? userId : "" });
  };

  return (
    <div
      className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-end"
      dir="rtl"
    >
      {/* Search Input */}
      <div className="flex-1 w-full">
        <label className="block text-xs font-bold text-gray-500 mb-1 mr-1">
          חיפוש חופשי (נושא, יחידה, מטרה)
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="חפשי מערך..."
            className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
          />
          <svg
            className="h-5 w-5 text-gray-400 absolute right-3 top-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Age Group Select */}
      <div className="w-full md:w-48">
        <label className="block text-xs font-bold text-gray-500 mb-1 mr-1">
          קבוצת גיל
        </label>
        <select
          value={filters.ageGroup ?? AGE_GROUPS[0]}
          onChange={handleAgeChange}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
        >
          <option value="">כל הגילאים</option>
          {AGE_GROUPS.map((group) => (
            <option key={group} value={group}>
              {AGE_LABELS[group]}
            </option>
          ))}
        </select>
      </div>

      {/* Frame Select */}
      <div className="w-full md:w-48">
        <label className="block text-xs font-bold text-gray-500 mb-1 mr-1">
          מסגרת פעילות
        </label>
        <select
          value={filters.frame ?? ""}
          onChange={handleFrameChange}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
        >
          <option value="">כל המסגרות</option>
          {ACTIVITY_FRAMES.map((frame) => (
            <option key={frame} value={frame}>
              {FRAME_LABELS[frame]}
            </option>
          ))}
        </select>
      </div>

      {/* My Plans Checkbox (Only for Admins/Owners) */}
      {(userRole === "OWNER" || userRole === "ADMIN") && (
        <div className="flex items-center gap-2 h-[42px] px-2 bg-gray-50 rounded-lg border border-gray-200">
          <input
            type="checkbox"
            id="my-plans"
            checked={filters.authorId === userId}
            onChange={handleMyPlansChange}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
          />
          <label
            htmlFor="my-plans"
            className="text-xs font-bold text-gray-700 cursor-pointer select-none whitespace-nowrap"
          >
            המערכים שלי
          </label>
        </div>
      )}

      {/* Reset Button */}
      <button
        type="button"
        onClick={onReset}
        className="text-gray-400 hover:text-red-500 p-2.5 transition-colors group"
        title="נקה הכל"
      >
        <svg
          className="h-6 w-6 group-hover:rotate-180 transition-transform duration-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    </div>
  );
};
