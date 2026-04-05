import { useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import type { LessonFilters } from "@repo/types";
import { useAuth } from "../../auth/context/AuthContext";
import { useLessonPlans } from "../api/useLessonPlans";
import { useDeleteLessonPlan } from "../api/useDeleteLessonPlan";
import { FilterBar } from "./FilterBar";

const HighlightText = ({
  text,
  highlight,
}: {
  text?: string;
  highlight?: string;
}) => {
  if (text == null) return null;
  if ((highlight?.trim()) == null) return <>{text}</>;

  const escapeRegExp = (string: string) =>
    string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedHighlight = escapeRegExp(highlight.trim());
  const regex = new RegExp(`(${escapedHighlight})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-yellow-200 text-gray-900 rounded-[2px] font-inherit"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
};

export const LessonPlanList = () => {
  const { user } = useAuth();
  const listTopRef = useRef<HTMLDivElement>(null);

  // Initialize state including authorId for "My Plans" logic
  const [filters, setFilters] = useState<LessonFilters>({
    page: 1,
    limit: 12,
    search: "",
    authorId: "",
  });

  const {
    data: response,
    isLoading,
    isError,
    isFetching,
  } = useLessonPlans(filters);
  const deleteMutation = useDeleteLessonPlan();

  const isFirstLoad = isLoading;
  const isBackgroundLoading = isFetching && !!response;

  const handleFilterChange = useCallback(
    (newFilters: Partial<LessonFilters>) => {
      setFilters((prev) => {
        const nextFilters = {
          ...prev,
          ...newFilters,
          page: 1,
        } as LessonFilters;
        if (JSON.stringify(prev) === JSON.stringify(nextFilters)) return prev;
        return nextFilters;
      });
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 12,
      search: "",
      authorId: "",
    });
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (response?.meta && newPage > response.meta.totalPages))
      return;
    setFilters((prev) => ({ ...prev, page: newPage }));
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFilterChange({ limit: Number(e.target.value) });
  };

  const canDelete = (planAuthorId: string) => {
    if (user.role === "OWNER") return true;
    if (user.role === "ADMIN" && user.id === planAuthorId) return true;
    return false;
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (window.confirm("האם את בטוחה שברצונך למחוק מערך זה?")) {
      deleteMutation.mutate(id);
    }
  };

  const renderContent = () => {
    if (isFirstLoad) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="text-center p-10 bg-red-50 text-red-600 rounded-lg border border-red-100">
          <p className="font-bold">שגיאה בטעינת המערכים.</p>
          <p className="text-sm">וודאי שהשרת רץ ושהחיבור תקין.</p>
        </div>
      );
    }

    if (!response?.data || response.data.length === 0) {
      return (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">
            לא נמצאו מערכי שיעור
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            לא מצאנו תוצאות שתואמות את החיפוש שלך.
          </p>
          <button
            onClick={resetFilters}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors"
          >
            נקה את כל המסננים
          </button>
        </div>
      );
    }

    return (
      <div
        className={`transition-opacity duration-200 ${isBackgroundLoading ? "opacity-50 pointer-events-none" : "opacity-100"}`}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {response.data.map((plan) => (
            <div
              key={plan.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {canDelete(plan.authorId) && (
                <button
                  onClick={(e) => handleDelete(e, plan.id)}
                  disabled={deleteMutation.isPending}
                  className="absolute top-4 left-4 p-2 bg-white/90 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-sm border border-transparent hover:border-red-100 z-10"
                  title="מחק מערך"
                >
                  {deleteMutation.isPending ? (
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  )}
                </button>
              )}

              <div className="p-6 flex-1">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">
                  <HighlightText text={plan.topic} highlight={filters.search} />
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                  <HighlightText
                    text={plan.superGoal}
                    highlight={filters.search}
                  />
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                    גיל: {plan.ageGroup}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                    <HighlightText
                      text={plan.unit}
                      highlight={filters.search}
                    />
                  </span>
                  <span
                    className="inline-flex items-center text-xs text-gray-400 mr-auto"
                    dir="ltr"
                  >
                    {new Date(plan.createdAt).toLocaleDateString("he-IL")}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50/50 px-4 py-3 border-t border-gray-100 flex justify-between items-center group-hover:bg-indigo-50/30 transition-colors">
                <span className="text-[11px] font-medium text-gray-500 flex items-center gap-1 shrink-0">
                  <svg
                    className="h-3.5 w-3.5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {Array.isArray(plan.lessonFlow) ? plan.lessonFlow.length : 0} שלבים
                </span>

                <div className="flex items-center gap-1.5 px-2 overflow-hidden">
                  <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700 shrink-0 border border-indigo-200">
                    {plan.author?.fullName != null && plan.author.fullName.length > 0 ? plan.author.fullName.charAt(0) : "U"}
                  </div>
                  <span className="text-[11px] text-gray-600 truncate font-medium">
                    {plan.author?.fullName != null && plan.author.fullName.length > 0 ? plan.author.fullName : "משתמש"}
                  </span>
                </div>

                <Link
                  to={`/plan/${plan.id}`}
                  className="text-indigo-600 text-xs font-bold flex items-center gap-1 hover:gap-1.5 transition-all cursor-pointer shrink-0"
                >
                  צפי בפרטים
                  <svg
                    className="h-3.5 w-3.5 rotate-180"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {response.meta.totalPages > 0 && (
          <div className="flex flex-col-reverse md:flex-row justify-between items-center mt-12 py-6 border-t border-gray-100 gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <span>הצג:</span>
              <select
                value={filters.limit}
                onChange={handleLimitChange}
                className="cursor-pointer rounded-md border-indigo-200 bg-indigo-50 py-1.5 pl-8 pr-3 text-sm font-bold text-indigo-700 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 hover:bg-indigo-100 transition-colors shadow-sm"
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
              </select>
              <span>פריטים לעמוד</span>
            </div>

            {response.meta.totalPages > 1 && (
              <div className="flex flex-col items-center">
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm bg-white"
                  aria-label="Pagination"
                  dir="rtl"
                >
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="relative inline-flex items-center rounded-r-md px-3 py-2 text-indigo-600 ring-1 ring-inset ring-gray-300 hover:bg-indigo-50 focus:z-20 focus:outline-offset-0 disabled:opacity-40 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="mr-1 text-sm font-bold">הקודם</span>
                  </button>

                  {Array.from(
                    { length: response.meta.totalPages },
                    (_, i) => i + 1,
                  ).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-bold ring-1 ring-inset focus:z-20 focus:outline-offset-0 transition-colors ${
                        filters.page === pageNum
                          ? "z-10 bg-indigo-600 text-white ring-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          : "text-indigo-600 ring-gray-300 hover:bg-indigo-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page === response.meta.totalPages}
                    className="relative inline-flex items-center rounded-l-md px-3 py-2 text-indigo-600 ring-1 ring-inset ring-gray-300 hover:bg-indigo-50 focus:z-20 focus:outline-offset-0 disabled:opacity-40 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="ml-1 text-sm font-bold">הבא</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
                <div className="mt-2 text-xs text-gray-500">
                  מציג עמוד {filters.page} מתוך {response.meta.totalPages}
                </div>
              </div>
            )}

            <div className="hidden md:block w-32"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8" dir="rtl" ref={listTopRef}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            ספריית המערכים
          </h1>
          <p className="text-gray-500 mt-1">מאגר הידע המשותף של מערכי השיעור</p>
        </div>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
      />

      {renderContent()}
    </div>
  );
};