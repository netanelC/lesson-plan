import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { type AgeGroup, type ActivityFrame, AGE_GROUPS, type LessonFilters } from '@repo/types';

interface FilterBarProps {
  filters: LessonFilters;
  onFilterChange: (newFilters: Partial<LessonFilters>) => void;
  onReset: () => void;
}

export const FilterBar = ({ filters, onFilterChange, onReset }: FilterBarProps) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [debouncedSearch] = useDebounce(searchTerm, 400);

  // Sync local state when parent resets filters (e.g., Clear All)
  // Check ensures we don't overwrite if it's already the same (prevents cursor jumps)
  useEffect(() => {
    if (filters.search !== searchTerm) {
      setSearchTerm(filters.search || '');
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
    onFilterChange({ ageGroup: e.target.value as AgeGroup | '' });
  };

  const handleFrameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ frame: e.target.value as ActivityFrame | '' });
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-end" dir="rtl">
      {/* Search Input */}
      <div className="flex-1 w-full">
        <label className="block text-xs font-bold text-gray-500 mb-1 mr-1">חיפוש חופשי (נושא, יחידה, מטרה)</label>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="חפשי מערך..."
            className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
          />
          <svg className="h-5 w-5 text-gray-400 absolute right-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Age Group Select */}
      <div className="w-full md:w-48">
        <label className="block text-xs font-bold text-gray-500 mb-1 mr-1">קבוצת גיל</label>
        <select
          value={filters.ageGroup || ''}
          onChange={handleAgeChange}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
        >
          <option value="">כל הגילאים</option>
          {AGE_GROUPS.map(group => (
            <option key={group} value={group}>{group}</option>
          ))}
        </select>
      </div>

      {/* Frame Select */}
      <div className="w-full md:w-48">
        <label className="block text-xs font-bold text-gray-500 mb-1 mr-1">מסגרת פעילות</label>
        <select
          value={filters.frame || ''}
          onChange={handleFrameChange}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
        >
          <option value="">כל המסגרות</option>
          <option value="plenary">מליאה</option>
          <option value="small-group">קבוצה קטנה</option>
        </select>
      </div>

      {/* Reset Button */}
      <button
        type="button"
        onClick={onReset}
        className="text-gray-400 hover:text-red-500 p-2.5 transition-colors group"
        title="נקה הכל"
      >
        <svg className="h-6 w-6 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  );
};